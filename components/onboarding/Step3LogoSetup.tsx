"use client";

import { useState, useEffect } from "react";
import {
  FiUpload,
  FiZap,
  FiMessageCircle,
  FiArrowRight,
  FiCheck,
  FiLoader,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";
import MotivationalQuote from "./MotivationalQuote";
import { LogoSetup } from "@/lib/types/onboarding";
import { useAuth } from "@/lib/context/AuthContext";
import { useConvexUpload } from "@/hooks/useConvexUpload";
import {
  saveLogoData,
  checkAIGenerationLimit,
  createCustomDesignRequest,
} from "@/lib/firebase/firestoreService";
import {
  generateLogoImage,
  createImageFile,
} from "@/lib/services/aiImageService";
import toast from "react-hot-toast";

interface Step3LogoSetupProps {
  initialValue?: LogoSetup;
  onNext: (logoData: LogoSetup) => void;
  onBack: () => void;
  isEditing?: boolean;
}

export default function Step3LogoSetup({
  initialValue,
  onNext,
  onBack,
  isEditing = false,
}: Step3LogoSetupProps) {
  const { user } = useAuth();
  const {
    uploadFile,
    isUploading,
    uploadProgress,
    error: uploadError,
  } = useConvexUpload();

  const [selectedOption, setSelectedOption] = useState<
    "upload" | "ai-generated" | "custom" | null
  >(initialValue?.type || null);

  // Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    initialValue?.url,
  );

  // AI Generation state
  const [aiPrompt, setAiPrompt] = useState<string>(
    initialValue?.aiPrompt || "",
  );
  const [aiGeneratedImages, setAiGeneratedImages] = useState<
    { blob: Blob; url: string }[]
  >([]);
  const [selectedAiImage, setSelectedAiImage] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [remainingGenerations, setRemainingGenerations] = useState<number>(10);

  // Custom design state
  const [customDesignAccepted, setCustomDesignAccepted] = useState(
    initialValue?.type === "custom",
  );

  // General state
  const [isSaving, setIsSaving] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const hasExistingUploadedLogo =
    initialValue?.type === "upload" && Boolean(initialValue.url);
  const hasExistingAiLogo =
    initialValue?.type === "ai-generated" && Boolean(initialValue.url);
  const hasExistingCustomRequest =
    initialValue?.type === "custom" && Boolean(initialValue.customDesignRequestId);

  const getErrorMessage = (error: unknown, fallbackMessage: string) => {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return fallbackMessage;
  };

  // Check AI generation limit on mount
  useEffect(() => {
    if (user?.id) {
      checkAIGenerationLimit(user.id).then((result) => {
        setRemainingGenerations(result.remaining);
      });
    }
  }, [user?.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploadedFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setSelectedOption("upload");
    setGeneralError(null);
  };

  const handleUploadToConvex = async (): Promise<{
    url: string;
    storageId: string;
  } | null> => {
    if (!uploadedFile || !user?.id) return null;

    try {
      const result = await uploadFile(uploadedFile, user.id, "logo");
      return { url: result.url || "", storageId: result.storageId };
    } catch (err: unknown) {
      setGeneralError(getErrorMessage(err, "Failed to upload logo"));
      return null;
    }
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim() || !user?.id) {
      setAiError("Please enter a description for your logo");
      return;
    }

    if (remainingGenerations <= 0) {
      setAiError("Daily generation limit reached. Please try again tomorrow.");
      return;
    }

    setIsGenerating(true);
    setAiError(null);

    try {
      const result = await generateLogoImage(user.id, aiPrompt);

      if (!result.success) {
        setAiError(result.error || "Failed to generate image");
        return;
      }

      if (result.imageBlob) {
        const imageUrl = URL.createObjectURL(result.imageBlob);
        setAiGeneratedImages((prev) => [
          ...prev,
          { blob: result.imageBlob!, url: imageUrl },
        ]);
        setSelectedAiImage(aiGeneratedImages.length);
      }

      if (result.remaining !== undefined) {
        setRemainingGenerations(result.remaining);
      }

      toast.success("Logo generated successfully!");
    } catch (err: unknown) {
      setAiError(getErrorMessage(err, "Failed to generate logo"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAiImage = (index: number) => {
    setSelectedAiImage(index);
    setPreviewUrl(aiGeneratedImages[index].url);
  };

  const handleContinue = async () => {
    if (!user?.id || !selectedOption) return;

    setIsSaving(true);
    setGeneralError(null);

    try {
      let logoData: LogoSetup;

      if (selectedOption === "upload") {
        if (uploadedFile) {
          // Upload to Convex
          const uploadResult = await handleUploadToConvex();
          if (!uploadResult) {
            setIsSaving(false);
            return;
          }

          // Save to Firestore
          await saveLogoData(user.id, {
            type: "upload",
            url: uploadResult.url,
            fileName: uploadedFile.name,
            convexStorageId: uploadResult.storageId,
          });

          logoData = {
            type: "upload",
            url: uploadResult.url,
            fileName: uploadedFile.name,
            convexStorageId: uploadResult.storageId,
          };

          toast.success("Logo uploaded successfully!");
        } else if (hasExistingUploadedLogo) {
          logoData = {
            type: "upload",
            url: initialValue?.url,
            fileName: initialValue?.fileName,
            convexStorageId: initialValue?.convexStorageId,
          };
        } else {
          setGeneralError("Please upload a logo file");
          setIsSaving(false);
          return;
        }
      } else {
        if (selectedOption === "ai-generated") {
          if (selectedAiImage !== null) {
            // Upload AI generated image to Convex
            const selectedImage = aiGeneratedImages[selectedAiImage];
            const file = createImageFile(
              selectedImage.blob,
              `ai-logo-${Date.now()}.png`,
            );

            const result = await uploadFile(file, user.id, "logo");

            // Save to Firestore
            await saveLogoData(user.id, {
              type: "ai-generated",
              url: result.url || "",
              aiPrompt,
              convexStorageId: result.storageId,
            });

            logoData = {
              type: "ai-generated",
              url: result.url || "",
              aiPrompt,
              convexStorageId: result.storageId,
            };

            toast.success("AI-generated logo saved successfully!");
          } else if (hasExistingAiLogo) {
            logoData = {
              type: "ai-generated",
              url: initialValue?.url,
              aiPrompt: aiPrompt || initialValue?.aiPrompt,
              convexStorageId: initialValue?.convexStorageId,
            };
          } else {
            setGeneralError("Please generate and select a logo");
            setIsSaving(false);
            return;
          }
        } else if (selectedOption === "custom") {
          if (hasExistingCustomRequest) {
            logoData = {
              type: "custom",
              customDesignRequestId: initialValue?.customDesignRequestId,
            };
          } else if (customDesignAccepted) {
            // Create custom design request
            const requestId = await createCustomDesignRequest(
              user.id,
              user.email || "",
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                user.email ||
                "User",
            );

            // Save to Firestore
            await saveLogoData(user.id, {
              type: "custom",
              customDesignRequestId: requestId,
            });

            logoData = {
              type: "custom",
              customDesignRequestId: requestId,
            };

            toast.success("Custom design request submitted!");
          } else {
            setGeneralError("Please confirm the custom design request");
            setIsSaving(false);
            return;
          }
        } else {
          setGeneralError("Please complete your logo selection");
          setIsSaving(false);
          return;
        }
      }

      onNext(logoData);
    } catch (err: unknown) {
      console.error("Error saving logo:", err);
      setGeneralError(getErrorMessage(err, "Failed to save logo. Please try again."));
      toast.error("Failed to save logo");
    } finally {
      setIsSaving(false);
    }
  };

  const canContinue = () => {
    if (!selectedOption) return false;
    if (selectedOption === "upload") {
      return !!uploadedFile || hasExistingUploadedLogo;
    }
    if (selectedOption === "ai-generated") {
      return selectedAiImage !== null || hasExistingAiLogo;
    }
    if (selectedOption === "custom") {
      return customDesignAccepted || hasExistingCustomRequest;
    }
    return false;
  };

  const options = [
    {
      id: "upload" as const,
      icon: <FiUpload className="w-10 h-10" />,
      title: "Upload Your Own",
      description: "Already have a logo? Upload it here",
      color: "from-blue-500 to-blue-600",
      available: true,
    },
    {
      id: "ai-generated" as const,
      icon: <FiZap className="w-10 h-10" />,
      title: "AI Generation",
      description: `Free AI logo generation (${remainingGenerations} left today)`,
      color: "from-purple-500 to-purple-600",
      available: true,
    },
    {
      id: "custom" as const,
      icon: <FiMessageCircle className="w-10 h-10" />,
      title: "Custom Design",
      description: "Chat with an admin for a professional logo",
      color: "from-pink-500 to-pink-600",
      available: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6">
          <FiZap className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Create Your Brand Identity
        </h1>

        <p className="text-xl text-gray-600">
          Your logo is the face of your business. Let&apos;s make it memorable.
        </p>
      </div>

      {/* General Error */}
      {generalError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700">{generalError}</span>
          <button
            onClick={() => setGeneralError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Logo Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => option.available && setSelectedOption(option.id)}
            className={`relative bg-white rounded-2xl p-8 border-2 cursor-pointer transition-all ${
              selectedOption === option.id
                ? "border-blue-500 shadow-xl scale-105"
                : option.available
                  ? "border-gray-200 hover:border-blue-300 hover:shadow-lg"
                  : "border-gray-200 opacity-60 cursor-not-allowed"
            }`}
          >
            {/* Selected Indicator */}
            {selectedOption === option.id && (
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheck className="w-6 h-6 text-white" />
              </div>
            )}

            <div
              className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${option.color} rounded-xl mb-4 text-white`}
            >
              {option.icon}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {option.title}
            </h3>
            <p className="text-gray-600">{option.description}</p>
          </div>
        ))}
      </div>

      {/* Upload Area */}
      {selectedOption === "upload" && (
        <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-blue-300 mb-8">
          <div className="text-center">
            {previewUrl ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Logo preview"
                    className="max-w-xs max-h-64 object-contain rounded-lg shadow-lg"
                  />
                </div>
                {(uploadedFile?.name || initialValue?.fileName) && (
                  <p className="text-gray-600">
                    {uploadedFile?.name || initialValue?.fileName}
                  </p>
                )}
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 cursor-pointer transition-all">
                  <FiUpload className="w-5 h-5" />
                  Change Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading || isSaving}
                  />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUpload className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      Click to upload your logo
                    </p>
                    <p className="text-gray-500 text-sm">
                      PNG, JPG, or SVG (Max 5MB)
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading || isSaving}
                />
              </label>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            {/* Upload Error */}
            {uploadError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 text-sm">{uploadError}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Generation Area */}
      {selectedOption === "ai-generated" && (
        <div className="bg-purple-50 rounded-2xl p-8 border-2 border-purple-200 mb-8">
          <div className="text-center mb-6">
            <FiZap className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              AI Logo Generation
            </h3>
            <p className="text-gray-600">
              Describe your ideal logo and our AI will create it for you.
            </p>
            <p className="text-sm text-purple-600 font-medium mt-2">
              {remainingGenerations} generations remaining today
            </p>
          </div>

          {hasExistingAiLogo && previewUrl && selectedAiImage === null && (
            <div className="max-w-xl mx-auto mb-6 rounded-xl border border-purple-200 bg-white p-4">
              <p className="text-sm font-semibold text-purple-700 mb-3">
                Current AI logo
              </p>
              <img
                src={previewUrl}
                alt="Current AI logo"
                className="mx-auto h-32 w-full max-w-xs object-contain"
              />
            </div>
          )}

          {/* Prompt Input */}
          <div className="max-w-xl mx-auto mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Describe your logo
            </label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., A modern coffee shop logo with a steaming cup, warm brown colors, minimalist style"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
              rows={3}
              disabled={isGenerating || isSaving}
            />
            <button
              onClick={handleGenerateAI}
              disabled={
                isGenerating ||
                !aiPrompt.trim() ||
                remainingGenerations <= 0 ||
                isSaving
              }
              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FiZap className="w-5 h-5" />
                  Generate Logo
                </>
              )}
            </button>
          </div>

          {/* AI Error */}
          {aiError && (
            <div className="max-w-xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{aiError}</span>
              <button
                onClick={() => setAiError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Generated Images Grid */}
          {aiGeneratedImages.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Generated Logos (Click to select)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {aiGeneratedImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectAiImage(index)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-4 transition-all ${
                      selectedAiImage === index
                        ? "border-purple-500 shadow-lg scale-105"
                        : "border-transparent hover:border-purple-300"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Generated logo ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    {selectedAiImage === index && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <FiCheck className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-500 text-sm mt-4">
                Not satisfied? Generate more variations above!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Custom Design Area */}
      {selectedOption === "custom" && (
        <div className="bg-pink-50 rounded-2xl p-8 border-2 border-pink-200 mb-8">
          <div className="text-center">
            <FiMessageCircle className="w-16 h-16 text-pink-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Custom Logo Design
            </h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Upon completion of these onboarding steps, you&apos;ll be connected
              with our design team to discuss your custom logo requirements. You
              can share your ideas, preferences, and inspirations through our
              built-in chat system.
            </p>

            {hasExistingCustomRequest && (
              <div className="bg-white rounded-xl p-4 max-w-md mx-auto mb-6 text-left border border-pink-200">
                <p className="text-sm font-semibold text-gray-900">
                  Active request detected
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Request ID: {initialValue?.customDesignRequestId}
                </p>
              </div>
            )}

            <div className="bg-white rounded-xl p-6 max-w-md mx-auto mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                What to expect:
              </h4>
              <ul className="text-left text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  Direct chat with our design team
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  Share reference images and ideas
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  Multiple revision rounds
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  Professional quality deliverables
                </li>
              </ul>
            </div>

            <label className="flex items-center justify-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customDesignAccepted}
                onChange={(e) => setCustomDesignAccepted(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              />
              <span className="text-gray-700">
                I understand and want to proceed with custom design
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Motivational Quote */}
      <div className="mb-8">
        <MotivationalQuote index={2} />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <button
          onClick={onBack}
          disabled={isSaving || isUploading}
          className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          {isEditing ? "Back to Dashboard" : "Back"}
        </button>
        <button
          onClick={handleContinue}
          disabled={!canContinue() || isSaving || isUploading || isGenerating}
          className={`inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl text-lg font-bold transition-all transform shadow-lg ${
            canContinue() && !isSaving && !isUploading && !isGenerating
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSaving || isUploading ? (
            <>
              <FiLoader className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            <>
              <FiCheck className="w-5 h-5" />
              Save Changes
            </>
          ) : (
            <>
              Continue
              <FiArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
