"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ModernShopTemplate from "@/components/templates/ModernShopTemplate";
import ClassicStoreTemplate from "@/components/templates/ClassicStoreTemplate";
import MinimalBoutiqueTemplate from "@/components/templates/MinimalBoutiqueTemplate";
import BoldMarketTemplate from "@/components/templates/BoldMarketTemplate";
import { useAuth } from "@/lib/context/AuthContext";
import { TemplateConfig } from "@/lib/types/template";

export default function TemplatePreviewPage() {
  const { user } = useAuth();
  const params = useParams();
  const templateId = params.templateId as string;
  const [previewConfig, setPreviewConfig] = useState<TemplateConfig | undefined>();

  const defaultConfig = useMemo<TemplateConfig>(
    () => ({
      templateId,
      theme: {
        primaryColor: "#3B82F6",
        secondaryColor: "#10B981",
      },
      content: {
        heroHeadline: "My Business",
        heroSubheadline: "Welcome to our store. Discover amazing products.",
        heroImage: "",
        brandLogo: "",
      },
    }),
    [templateId],
  );

  useEffect(() => {
    if (!user?.id) {
      setPreviewConfig(defaultConfig);
      return;
    }

    try {
      const saved = localStorage.getItem(`onboarding_${user.id}`);
      if (!saved) {
        setPreviewConfig(defaultConfig);
        return;
      }

      const onboardingData = JSON.parse(saved);
      const selectedLogo = onboardingData?.logo?.url || "";
      const websiteConfig = onboardingData?.website?.config;

      setPreviewConfig({
        templateId,
        theme: {
          primaryColor:
            websiteConfig?.theme?.primaryColor || defaultConfig.theme.primaryColor,
          secondaryColor:
            websiteConfig?.theme?.secondaryColor || defaultConfig.theme.secondaryColor,
        },
        content: {
          heroHeadline:
            websiteConfig?.content?.heroHeadline || defaultConfig.content.heroHeadline,
          heroSubheadline:
            websiteConfig?.content?.heroSubheadline || defaultConfig.content.heroSubheadline,
          heroImage: websiteConfig?.content?.heroImage || defaultConfig.content.heroImage,
          brandLogo: selectedLogo || websiteConfig?.content?.brandLogo || "",
        },
      });
    } catch (error) {
      console.error("Error loading template preview data:", error);
      setPreviewConfig(defaultConfig);
    }
  }, [user?.id, templateId, defaultConfig]);

  const renderTemplate = () => {
    switch (templateId) {
      case "modern-shop":
        return <ModernShopTemplate config={previewConfig} />;
      case "classic-store":
        return <ClassicStoreTemplate config={previewConfig} />;
      case "minimal-boutique":
        return <MinimalBoutiqueTemplate config={previewConfig} />;
      case "bold-market":
        return <BoldMarketTemplate config={previewConfig} />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Template Not Found
              </h1>
              <p className="text-gray-600">
                The requested template could not be found.
              </p>
            </div>
          </div>
        );
    }
  };

  return <>{renderTemplate()}</>;
}
