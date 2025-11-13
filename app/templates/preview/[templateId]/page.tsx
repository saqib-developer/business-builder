"use client";

import { useParams } from "next/navigation";
import ModernShopTemplate from "@/components/templates/ModernShopTemplate";
import ClassicStoreTemplate from "@/components/templates/ClassicStoreTemplate";
import MinimalBoutiqueTemplate from "@/components/templates/MinimalBoutiqueTemplate";
import BoldMarketTemplate from "@/components/templates/BoldMarketTemplate";

export default function TemplatePreviewPage() {
  const params = useParams();
  const templateId = params.templateId as string;

  const renderTemplate = () => {
    switch (templateId) {
      case "modern-shop":
        return <ModernShopTemplate />;
      case "classic-store":
        return <ClassicStoreTemplate />;
      case "minimal-boutique":
        return <MinimalBoutiqueTemplate />;
      case "bold-market":
        return <BoldMarketTemplate />;
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
