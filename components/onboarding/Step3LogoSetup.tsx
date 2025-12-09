"use client";

import { useState } from "react";
import { FiUpload, FiZap, FiMessageCircle, FiArrowRight, FiCheck } from "react-icons/fi";
import MotivationalQuote from "./MotivationalQuote";
import { LogoSetup } from "@/lib/types/onboarding";

interface Step3LogoSetupProps {
  initialValue?: LogoSetup;
  onNext: (logoData: LogoSetup) => void;
  onBack: () => void;
}

export default function Step3LogoSetup({
  initialValue,
  onNext,
  onBack,
}: Step3LogoSetupProps) {
  const [selectedOption, setSelectedOption] = useState<"upload" | "ai-generated" | "custom" | null>(
    initialValue?.type || null
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialValue?.url);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedOption("upload");
    }
  };

  const handleContinue = () => {
    if (selectedOption === "upload" && uploadedFile) {
      onNext({
        type: "upload",
        url: previewUrl,
        fileName: uploadedFile.name,
      });
    } else if (selectedOption === "ai-generated") {
      onNext({
        type: "ai-generated",
      });
    } else if (selectedOption === "custom") {
      onNext({
        type: "custom",
      });
    }
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
      description: "Free AI logo generation",
      color: "from-purple-500 to-purple-600",
      available: false,
      badge: "Coming Soon",
    },
    {
      id: "custom" as const,
      icon: <FiMessageCircle className="w-10 h-10" />,
      title: "Custom Design",
      description: "Message us for a professional logo",
      color: "from-pink-500 to-pink-600",
      available: false,
      badge: "Work in Progress",
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
          Your logo is the face of your business. Let's make it memorable! 🎨
        </p>
      </div>

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
            {/* Badge */}
            {option.badge && (
              <div className="absolute -top-3 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                {option.badge}
              </div>
            )}

            {/* Selected Indicator */}
            {selectedOption === option.id && (
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheck className="w-6 h-6 text-white" />
              </div>
            )}

            <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${option.color} rounded-xl mb-4 text-white`}>
              {option.icon}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
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
                <p className="text-gray-600">
                  {uploadedFile?.name}
                </p>
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 cursor-pointer transition-all">
                  <FiUpload className="w-5 h-5" />
                  Change Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
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
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* Placeholder Messages */}
      {selectedOption === "ai-generated" && (
        <div className="bg-purple-50 rounded-2xl p-8 border-2 border-purple-200 mb-8 text-center">
          <FiZap className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Logo Generation Coming Soon! 🎉</h3>
          <p className="text-gray-600 mb-4">
            We're working on bringing you free AI-powered logo generation. Stay tuned!
          </p>
          <p className="text-sm text-gray-500">
            For now, you can upload your own logo or contact us for custom design.
          </p>
        </div>
      )}

      {selectedOption === "custom" && (
        <div className="bg-pink-50 rounded-2xl p-8 border-2 border-pink-200 mb-8 text-center">
          <FiMessageCircle className="w-16 h-16 text-pink-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Custom Logo Design 🎨</h3>
          <p className="text-gray-600 mb-4">
            Want a professionally designed custom logo? We'd love to help!
          </p>
          <a
            href="mailto:contact@businessbuilder.com?subject=Custom Logo Design Request"
            className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-all"
          >
            <FiMessageCircle className="w-5 h-5" />
            Contact Us
          </a>
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
          className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedOption}
          className={`inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl text-lg font-bold transition-all transform shadow-lg ${
            selectedOption
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
          <FiArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
