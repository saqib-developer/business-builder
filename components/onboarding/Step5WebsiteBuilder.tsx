"use client";

import { useState } from "react";
import { FiArrowRight, FiGlobe, FiCheckCircle } from "react-icons/fi";
import { SiWordpress } from "react-icons/si";
import { FaCode } from "react-icons/fa";
import MotivationalQuote from "./MotivationalQuote";
import { WebsiteSetup } from "@/lib/types/onboarding";
import { TEMPLATES } from "@/lib/types/template";
import Step5BCustomizer from "./Step5BCustomizer";
import TemplateMiniPreview from "@/components/templates/TemplateMiniPreview";

interface Step5WebsiteBuilderProps {
  initialData?: WebsiteSetup;
  businessName: string;
  onNext: (websiteData: WebsiteSetup) => void;
  onBack: () => void;
  isEditing?: boolean;
  openCustomizer?: boolean;
}

export default function Step5WebsiteBuilder({
  businessName,
  initialData,
  onNext,
  onBack,
  isEditing = false,
  openCustomizer = false,
}: Step5WebsiteBuilderProps) {
  const [mode, setMode] = useState<"select" | "customize">(
    openCustomizer &&
      initialData?.type === "template" &&
      Boolean(initialData?.templateId)
      ? "customize"
      : "select",
  );
  const [selectedOption, setSelectedOption] = useState<
    "template" | "wordpress" | "custom" | null
  >(
    initialData?.type === "template" ||
      initialData?.type === "wordpress" ||
      initialData?.type === "custom"
      ? initialData.type
      : null,
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    initialData?.templateId || null
  );

  const handleContinue = () => {
    if (selectedOption === "template" && selectedTemplateId) {
      // Step flow should only save/change template selection.
      // Full website editing is launched from dashboard.
      onNext({
        type: "template",
        templateId: selectedTemplateId,
        config:
          initialData?.type === "template" &&
          initialData?.templateId === selectedTemplateId
            ? initialData?.config
            : undefined,
      });
    } else if (selectedOption === "wordpress") {
      onNext({
        type: "wordpress",
      });
    } else if (selectedOption === "custom") {
      onNext({
        type: "custom",
      });
    }
  };

  if (mode === "customize" && selectedOption === "template" && selectedTemplateId) {
    const initialTemplateConfig =
      initialData?.templateId === selectedTemplateId
        ? {
            templateId: selectedTemplateId,
            isPublished: initialData?.config?.isPublished,
            theme: {
              primaryColor:
                initialData?.config?.theme?.primaryColor || "#3B82F6",
              secondaryColor:
                initialData?.config?.theme?.secondaryColor || "#10B981",
            },
            content: {
              heroHeadline:
                initialData?.config?.content?.heroHeadline ||
                `${businessName} Store`,
              heroSubheadline:
                initialData?.config?.content?.heroSubheadline ||
                "Welcome to our store. Discover amazing products.",
              heroImage: initialData?.config?.content?.heroImage || "",
              brandLogo: initialData?.config?.content?.brandLogo,
              whatsappNumber:
                initialData?.config?.content?.whatsappNumber || "",
            },
          }
        : undefined;

    return (
      <Step5BCustomizer
        businessName={businessName}
        templateId={selectedTemplateId}
        initialConfig={initialTemplateConfig}
        onFinish={onNext}
        onBack={() => setMode("select")}
      />
    );
  }

  const canContinue =
    (selectedOption === "template" && selectedTemplateId) ||
    selectedOption === "wordpress" ||
    selectedOption === "custom";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-6">
          <FiGlobe className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Build Your Website
        </h1>

        <p className="text-xl text-gray-600">
          Choose how you want to create your online presence 🌐
        </p>
      </div>

      {/* Website Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Option A: Templates */}
        <div
          onClick={() => setSelectedOption("template")}
          className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
            selectedOption === "template"
              ? "border-blue-500 shadow-xl scale-105"
              : "border-gray-200 hover:border-blue-300 hover:shadow-lg"
          }`}
        >
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white mb-4">
              <FiGlobe className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Default Templates
            </h3>
            <p className="text-gray-600 text-sm">
              Choose from our professionally designed templates
            </p>
            <div className="mt-3 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
              <FiCheckCircle className="w-4 h-4" />
              Recommended
            </div>
          </div>
        </div>

        {/* Option B: WordPress */}
        <div
          onClick={() => setSelectedOption("wordpress")}
          className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
            selectedOption === "wordpress"
              ? "border-purple-500 shadow-xl scale-105"
              : "border-gray-200 hover:border-purple-300 hover:shadow-lg"
          }`}
        >
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white mb-4">
              <SiWordpress className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">WordPress</h3>
            <p className="text-gray-600 text-sm">
              Full WordPress website with premium themes
            </p>
            <div className="mt-3 inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
              <FiCheckCircle className="w-4 h-4" />
              Chat with Team
            </div>
          </div>
        </div>

        {/* Option C: Custom Code */}
        <div
          onClick={() => setSelectedOption("custom")}
          className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
            selectedOption === "custom"
              ? "border-pink-500 shadow-xl scale-105"
              : "border-gray-200 hover:border-pink-300 hover:shadow-lg"
          }`}
        >
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl text-white mb-4">
              <FaCode className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Custom Code
            </h3>
            <p className="text-gray-600 text-sm">
              Fully custom website built to your specs
            </p>
            <div className="mt-3 inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold">
              <FiCheckCircle className="w-4 h-4" />
              Chat with Dev Team
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      {selectedOption === "template" && (
        <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Choose Your Template
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                className={`bg-white rounded-xl border-2 transition-all overflow-hidden ${
                  selectedTemplateId === template.id
                    ? "border-blue-500 shadow-lg ring-4 ring-blue-200"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                {/* Template Preview Image */}
                <div
                  onClick={() => setSelectedTemplateId(template.id)}
                  className="relative h-72 bg-gray-100 cursor-pointer overflow-hidden group"
                >
                  {selectedTemplateId === template.id && (
                    <div className="absolute top-3 right-3 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center z-10 shadow-lg">
                      <FiCheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-white">
                    <TemplateMiniPreview templateId={template.id} />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200"></div>
                </div>

                {/* Template Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900 mb-1">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {template.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `/templates/preview/${template.id}`,
                          "_blank",
                          "width=1200,height=800,menubar=no,toolbar=no,location=no,status=no",
                        );
                      }}
                      className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <FiGlobe className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => setSelectedTemplateId(template.id)}
                      className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                        selectedTemplateId === template.id
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 hover:bg-blue-100 text-blue-700"
                      }`}
                    >
                      {selectedTemplateId === template.id
                        ? "Selected"
                        : "Select"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-bold text-blue-700">✨ Do not worry.</span>{" "}
              You can customize colors, text, and images after selecting a
              template.
            </p>
          </div>
        </div>
      )}

      {/* WordPress Confirmation */}
      {selectedOption === "wordpress" && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200 mb-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                <SiWordpress className="w-8 h-8" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                WordPress Website Setup 🌐
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Perfect choice! Our team will help you set up a professional
                WordPress website with premium themes, essential plugins, and
                hosting recommendations.
              </p>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold text-purple-700">
                    ✨ Includes:
                  </span>
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Premium WordPress theme selection</li>
                  <li>• Essential plugins setup</li>
                  <li>• Hosting and domain guidance</li>
                  <li>• Direct chat support with our web team</li>
                </ul>
              </div>
              <div className="mt-4 bg-purple-100 rounded-lg p-3 border border-purple-200">
                <p className="text-sm text-purple-900">
                  📬 <strong>Next step:</strong> Once on your dashboard, you can
                  chat directly with our web team to discuss your WordPress
                  website requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Code Confirmation */}
      {selectedOption === "custom" && (
        <div className="bg-gradient-to-br from-pink-50 to-indigo-50 rounded-2xl p-8 border-2 border-pink-200 mb-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white">
                <FaCode className="w-8 h-8" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Custom Website Development 💻
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Excellent choice! Our development team will build a fully custom
                website tailored to your exact requirements and business needs.
              </p>
              <div className="bg-white rounded-lg p-4 border border-pink-200">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold text-pink-700">
                    ✨ Includes:
                  </span>
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Custom design tailored to your brand</li>
                  <li>• Full-stack development (frontend & backend)</li>
                  <li>• Database setup and integrations</li>
                  <li>• Direct chat support with our dev team</li>
                </ul>
              </div>
              <div className="mt-4 bg-pink-100 rounded-lg p-3 border border-pink-200">
                <p className="text-sm text-pink-900">
                  📬 <strong>Next step:</strong> Once on your dashboard, you can
                  chat directly with our development team to discuss features,
                  functionality, and bring your vision to life.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Quote */}
      <div className="mb-8">
        <MotivationalQuote index={4} />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <button
          onClick={onBack}
          className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
        >
          {isEditing ? "Back to Dashboard" : "Back"}
        </button>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl text-lg font-bold transition-all transform shadow-lg ${
            canContinue
              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {selectedOption === "template" && mode === "select" ? (
            <>
              Continue
              <FiArrowRight className="w-5 h-5" />
            </>
          ) : (
            <>
              {isEditing ? "Save Changes" : "Complete Setup"}
              <FiCheckCircle className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
