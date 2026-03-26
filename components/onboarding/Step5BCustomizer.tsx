"use client";

import { useState, useRef } from "react";
import { FiArrowLeft, FiImage, FiCheckCircle, FiGlobe, FiLoader } from "react-icons/fi";
import { WebsiteSetup } from "@/lib/types/onboarding";
import { TemplateConfig } from "@/lib/types/template";
import { useAuth } from "@/lib/context/AuthContext";
import { useConvexUpload } from "@/hooks/useConvexUpload";

import ModernShopTemplate from "@/components/templates/ModernShopTemplate";
import ClassicStoreTemplate from "@/components/templates/ClassicStoreTemplate";
import MinimalBoutiqueTemplate from "@/components/templates/MinimalBoutiqueTemplate";
import BoldMarketTemplate from "@/components/templates/BoldMarketTemplate";
import toast from "react-hot-toast";

interface Step5BCustomizerProps {
  initialConfig?: TemplateConfig;
  businessName: string;
  templateId: string;
  onFinish: (websiteData: WebsiteSetup) => void;
  onBack: () => void;
}

export default function Step5BCustomizer({
  businessName,
  templateId,
  onFinish,
  onBack,
  initialConfig,
}: Step5BCustomizerProps) {
  // Ensure heroImage is part of the state
  const [config, setConfig] = useState<TemplateConfig>({
    templateId: initialConfig?.templateId || templateId,
    theme: initialConfig?.theme || {
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
    },
    content: initialConfig?.content || {
      heroHeadline: businessName || "My Business",
      heroSubheadline: "Welcome to our store. Discover amazing products.",
      heroImage: "", // added
    },
  });

  const { user } = useAuth();
  const { uploadFile, isUploading } = useConvexUpload();
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateTheme = (key: keyof TemplateConfig["theme"], value: string) => {
    setConfig((prev) => ({
      ...prev,
      theme: { ...prev.theme, [key]: value },
    }));
  };

  const handleUpdateContent = (key: keyof TemplateConfig["content"], value: string) => {
    setConfig((prev) => ({
      ...prev,
      content: { ...prev.content, [key]: value },
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      try {
        const result = await uploadFile(file, user.id, "website-hero");
        if (result.url) {
          handleUpdateContent("heroImage", result.url);
          toast.success("Image uploaded successfully!");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
      }
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setTimeout(() => {
      toast.success("Website published successfully!", { icon: "🎉" });
      onFinish({
        type: "template",
        templateId,
        customizations: {
          colors: {
            primary: config.theme.primaryColor,
            secondary: config.theme.secondaryColor,
          },
          texts: {
            heroHeadline: config.content.heroHeadline,
            heroSubheadline: config.content.heroSubheadline,
          },
          images: {
            heroImage: config.content.heroImage || "",
          },
        },
      });
      setIsPublishing(false);
    }, 1000);
  };

  const resetDesign = () => {
    if (confirm("Warning: This will reset your design to the defaults. Are you sure?")) {
      setConfig({
        templateId,
        theme: {
          primaryColor: "#3B82F6",
          secondaryColor: "#10B981",
        },
        content: {
          heroHeadline: `${businessName} Store`,
          heroSubheadline: "Welcome to our store. Discover amazing products.",
          heroImage: "", // reset image
        },
      });
    }
  };

  const renderTemplate = () => {
    switch (templateId) {
      case "modern-shop":
        return <ModernShopTemplate config={config} />;
      case "classic-store":
        return <ClassicStoreTemplate config={config} />;
      case "minimal-boutique":
        return <MinimalBoutiqueTemplate config={config} />;
      case "bold-market":
        return <BoldMarketTemplate config={config} />;
      default:
        return <div>Template not found.</div>;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto min-h-[85vh] flex flex-col lg:flex-row gap-8">
      {/* Left Sidebar: Form Controls */}
      <div className="w-full lg:w-1/3 flex flex-col space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-slate-100 flex-grow">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              title="Back to gallery"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-slate-800">Customize Design</h2>
          </div>

          <div className="space-y-8">
            {/* Colors Section */}
            <section>
              <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-4">Colors</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.theme.primaryColor}
                      onChange={(e) => handleUpdateTheme("primaryColor", e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={config.theme.primaryColor}
                      onChange={(e) => handleUpdateTheme("primaryColor", e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Secondary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.theme.secondaryColor}
                      onChange={(e) => handleUpdateTheme("secondaryColor", e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={config.theme.secondaryColor}
                      onChange={(e) => handleUpdateTheme("secondaryColor", e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section>
              <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-4">Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hero Headline</label>
                  <input
                    type="text"
                    value={config.content.heroHeadline}
                    onChange={(e) => handleUpdateContent("heroHeadline", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subheadline</label>
                  <textarea
                    value={config.content.heroSubheadline}
                    onChange={(e) => handleUpdateContent("heroSubheadline", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Image Upload */}
            <section>
              <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-4">Media</h3>
              <input
                type="file"
                accept="image/jpeg,image/png"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 hover:border-blue-400 transition-colors flex flex-col items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  {isUploading ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiImage className="w-5 h-5" />}
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {isUploading ? "Uploading..." : config.content.heroImage ? "Change Hero Image" : "Upload Hero Image"}
                </span>
                <span className="text-xs text-slate-500">JPG, PNG up to 10MB</span>
              </button>
              {config.content.heroImage && (
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <FiCheckCircle /> Image uploaded
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetDesign}
          className="w-full py-3 mb-3 px-6 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-2xl font-bold transition-all"
        >
          Reset Design
        </button>

        {/* Publish Button */}
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isPublishing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <FiCheckCircle className="w-5 h-5" />
              Publish / Finish Setup
            </>
          )}
        </button>
      </div>

      {/* Right Area: Live Preview */}
      <div className="w-full lg:w-2/3 bg-slate-100 rounded-2xl border-4 border-slate-200 overflow-hidden relative shadow-inner">
        <div className="absolute top-0 left-0 right-0 h-12 bg-white border-b border-slate-200 flex items-center px-4 gap-2 z-10">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="mx-auto px-4 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-500 flex items-center gap-2 font-mono">
            <FiGlobe /> preview.yourbusiness.com
          </div>
        </div>

        <div className="absolute top-12 left-0 right-0 bottom-0 overflow-auto bg-white custom-scrollbar">
          <div className="w-[1240px] origin-top-left transform scale-[0.6] sm:scale-[0.75] md:scale-[0.8] lg:scale-100 xl:scale-[0.85] 2xl:scale-100 transition-transform">
            <div className="pointer-events-none select-none">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}