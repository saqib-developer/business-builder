"use client";

import { useState } from "react";
import { FiArrowRight, FiGlobe, FiCheckCircle, FiLock } from "react-icons/fi";
import { SiWordpress } from "react-icons/si";
import { FaCode } from "react-icons/fa";
import MotivationalQuote from "./MotivationalQuote";
import { WebsiteSetup } from "@/lib/types/onboarding";
import { TEMPLATES } from "@/lib/types/template";
import Image from "next/image";

interface Step5WebsiteBuilderProps {
  businessName: string;
  onNext: (websiteData: WebsiteSetup) => void;
  onBack: () => void;
}

export default function Step5WebsiteBuilder({
  businessName,
  onNext,
  onBack,
}: Step5WebsiteBuilderProps) {
  const [selectedOption, setSelectedOption] = useState<
    "template" | "wordpress" | "custom" | null
  >(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  const handleContinue = () => {
    if (selectedOption === "template" && selectedTemplateId) {
      onNext({
        type: "template",
        templateId: selectedTemplateId,
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
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 opacity-60 cursor-not-allowed relative">
          <div className="absolute -top-3 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
            Paid Feature
          </div>
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white mb-4">
              <SiWordpress className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">WordPress</h3>
            <p className="text-gray-600 text-sm">
              Full WordPress website with premium themes
            </p>
            <div className="mt-3 inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
              <FiLock className="w-4 h-4" />
              Coming Soon
            </div>
          </div>
        </div>

        {/* Option C: Custom Code */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 opacity-60 cursor-not-allowed relative">
          <div className="absolute -top-3 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
            Contact Us
          </div>
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
            <div className="mt-3 inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
              <FiLock className="w-4 h-4" />
              Coming Soon
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
                  className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer overflow-hidden group"
                >
                  {selectedTemplateId === template.id && (
                    <div className="absolute top-3 right-3 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center z-10 shadow-lg">
                      <FiCheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}

                  {/* Template Style Visual */}
                  <div className="absolute inset-0 p-6">
                    {template.style === "modern" && (
                      <div className="space-y-3">
                        <div className="h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg"></div>
                        <div className="grid grid-cols-3 gap-2 h-24">
                          <div className="bg-white/80 rounded-lg"></div>
                          <div className="bg-white/80 rounded-lg"></div>
                          <div className="bg-white/80 rounded-lg"></div>
                        </div>
                        <div className="h-16 bg-white/80 rounded-lg"></div>
                      </div>
                    )}
                    {template.style === "classic" && (
                      <div className="space-y-3">
                        <div className="h-6 bg-gray-700 rounded"></div>
                        <div className="flex gap-2">
                          <div className="w-1/3 h-32 bg-white/80 rounded"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-white/80 rounded"></div>
                            <div className="h-4 bg-white/80 rounded w-2/3"></div>
                            <div className="h-16 bg-white/80 rounded"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {template.style === "minimal" && (
                      <div className="space-y-4">
                        <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
                        <div className="h-24 bg-white/90 rounded-lg"></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="h-12 bg-white/90 rounded"></div>
                          <div className="h-12 bg-white/90 rounded"></div>
                        </div>
                      </div>
                    )}
                    {template.style === "bold" && (
                      <div className="space-y-3">
                        <div className="h-10 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg"></div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-28 bg-yellow-400 rounded-lg"></div>
                          <div className="h-28 bg-red-400 rounded-lg"></div>
                        </div>
                      </div>
                    )}
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
                          "width=1200,height=800,menubar=no,toolbar=no,location=no,status=no"
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
              <span className="font-bold text-blue-700">✨ Don't worry!</span>{" "}
              You can customize colors, text, and images after selecting a
              template.
            </p>
          </div>
        </div>
      )}

      {/* WordPress Placeholder */}
      {selectedOption === "wordpress" && (
        <div className="bg-purple-50 rounded-2xl p-8 border-2 border-purple-200 mb-8 text-center">
          <SiWordpress className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            WordPress Sites - Coming Soon! 🚀
          </h3>
          <p className="text-gray-600 mb-4">
            We're working on integrating premium WordPress themes. This will be
            a paid feature.
          </p>
          <p className="text-sm text-gray-500">
            For now, try our free templates - they're pretty awesome! 😎
          </p>
        </div>
      )}

      {/* Custom Code Placeholder */}
      {selectedOption === "custom" && (
        <div className="bg-pink-50 rounded-2xl p-8 border-2 border-pink-200 mb-8 text-center">
          <FaCode className="w-16 h-16 text-pink-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Custom Development 💻
          </h3>
          <p className="text-gray-600 mb-4">
            Need a fully custom website? Our development team can help!
          </p>
          <a
            href="mailto:contact@businessbuilder.com?subject=Custom Website Development Request"
            className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-all"
          >
            Contact Development Team
          </a>
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
          Back
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
          Complete Setup
          <FiCheckCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
