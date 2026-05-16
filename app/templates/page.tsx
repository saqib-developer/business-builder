"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useBrand } from "@/lib/context/BrandContext";
import { TEMPLATES } from "@/lib/types";
import { FiCheck, FiEye, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";
import TemplateMiniPreview from "@/components/templates/TemplateMiniPreview";

export default function TemplatesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { brandSettings, updateBrandSettings } = useBrand();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    brandSettings.selectedTemplateId
  );

  // Load the template from onboarding data if it exists
  useEffect(() => {
    if (user && !selectedTemplate) {
      const saved = localStorage.getItem(`onboarding_${user.id}`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.website?.templateId) {
            // Defer state updates to avoid synchronous setState in effect
            setTimeout(() => {
              setSelectedTemplate(data.website.templateId);
              updateBrandSettings({
                selectedTemplateId: data.website.templateId,
              });
            }, 0);
          }
        } catch (error) {
          console.error("Error loading template from onboarding:", error);
        }
      }
    }
  }, [user, selectedTemplate, updateBrandSettings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in?redirect=/templates");
    return null;
  }

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    updateBrandSettings({ selectedTemplateId: templateId });

    // Also save to onboarding data
    if (user) {
      const saved = localStorage.getItem(`onboarding_${user.id}`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          data.website = {
            ...data.website,
            templateId: templateId,
            type:
              TEMPLATES.find((t) => t.id === templateId)?.name || "Template",
          };
          localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(data));
        } catch (error) {
          console.error("Error updating onboarding data:", error);
        }
      }
    }

    toast.success("Template selected!");
  };

  const handlePreview = (templateId: string) => {
    // Open preview in new window
    window.open(
      `/templates/preview/${templateId}`,
      "_blank",
      "width=1200,height=800"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Template
          </h1>
          <p className="text-gray-600">
            Select a professionally designed template for your online store. You
            can preview each template before making your choice.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800 text-sm">
            💡 <strong>Tip:</strong> After selecting a template, customize your
            brand name, tagline, and colors in{" "}
            <Link
              href="/templates/settings"
              className="underline font-semibold"
            >
              Brand Settings
            </Link>
            . Your changes will apply to all templates!
          </p>
        </div>

        {/* Current Selection */}
        {selectedTemplate && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiCheck className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Currently using:{" "}
                <strong>
                  {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
                </strong>
              </span>
            </div>
            <Link
              href={`/templates/preview/${selectedTemplate}`}
              target="_blank"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <FiEye className="w-4 h-4" />
              <span>View Live</span>
            </Link>
          </div>
        )}

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-lg ${
                selectedTemplate === template.id
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-gray-200"
              }`}
            >
              {/* Template Thumbnail */}
              <div className="relative h-64 rounded-t-xl overflow-hidden bg-gray-100 border-b">
                <div
                  className="w-full h-full scale-[0.25] origin-top-left"
                  style={{ width: "400%", height: "400%" }}
                >
                  <TemplateMiniPreview templateId={template.id} />
                </div>
                {selectedTemplate === template.id && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 z-10">
                    <FiCheck className="w-4 h-4" />
                    <span>Selected</span>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {template.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Features
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handlePreview(template.id)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FiEye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => handleSelectTemplate(template.id)}
                    disabled={selectedTemplate === template.id}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                      selectedTemplate === template.id
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {selectedTemplate === template.id ? (
                      <>
                        <FiCheck className="w-4 h-4" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <>
                        <span>Select</span>
                        <FiArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        {selectedTemplate && (
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold mb-2">1</div>
                <h3 className="font-semibold mb-1">Customize Your Brand</h3>
                <p className="text-blue-100 text-sm">
                  Set your business name, tagline, and colors
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">2</div>
                <h3 className="font-semibold mb-1">Add Products</h3>
                <p className="text-blue-100 text-sm">
                  Upload your products with images and descriptions
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">3</div>
                <h3 className="font-semibold mb-1">Launch Your Store</h3>
                <p className="text-blue-100 text-sm">
                  Go live and start selling to customers
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/templates/settings"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <span>Customize Brand Settings</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
