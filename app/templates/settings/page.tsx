"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useBrand } from "@/lib/context/BrandContext";
import { FiSave, FiRefreshCw, FiEye } from "react-icons/fi";
import toast from "react-hot-toast";

export default function BrandSettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { brandSettings, updateBrandSettings, resetBrandSettings } = useBrand();

  const [formData, setFormData] = useState({
    businessName: brandSettings.businessName,
    tagline: brandSettings.tagline,
    primaryColor: brandSettings.primaryColor,
    secondaryColor: brandSettings.secondaryColor,
  });

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
    router.push("/sign-in?redirect=/templates/settings");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandSettings(formData);
    toast.success("Brand settings saved successfully!");
  };

  const handleReset = () => {
    if (
      confirm("Are you sure you want to reset all brand settings to default?")
    ) {
      resetBrandSettings();
      setFormData({
        businessName: "My Store",
        tagline: "Your one-stop shop for everything",
        primaryColor: "#2563EB",
        secondaryColor: "#64748B",
      });
      toast.success("Settings reset to default");
    }
  };

  const handlePreview = () => {
    if (brandSettings.selectedTemplateId) {
      window.open(
        `/templates/preview/${brandSettings.selectedTemplateId}`,
        "_blank",
        "width=1200,height=800"
      );
    } else {
      toast.error("Please select a template first");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Brand Settings
          </h1>
          <p className="text-gray-600">
            Customize your brand identity. These settings will apply to your
            selected template.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Name */}
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="businessName"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., Fashion Boutique"
              />
              <p className="text-sm text-gray-500 mt-1">
                This will appear as your store name
              </p>
            </div>

            {/* Tagline */}
            <div>
              <label
                htmlFor="tagline"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tagline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tagline"
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., Style that speaks to you"
              />
              <p className="text-sm text-gray-500 mt-1">
                A short, memorable phrase about your business
              </p>
            </div>

            {/* Colors */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Primary Color */}
              <div>
                <label
                  htmlFor="primaryColor"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Primary Color <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="primaryColor"
                    value={formData.primaryColor}
                    onChange={(e) =>
                      setFormData({ ...formData, primaryColor: e.target.value })
                    }
                    className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) =>
                      setFormData({ ...formData, primaryColor: e.target.value })
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                    placeholder="#2563EB"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Main brand color for buttons and accents
                </p>
              </div>

              {/* Secondary Color */}
              <div>
                <label
                  htmlFor="secondaryColor"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Secondary Color <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        secondaryColor: e.target.value,
                      })
                    }
                    className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        secondaryColor: e.target.value,
                      })
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                    placeholder="#64748B"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Secondary color for text and backgrounds
                </p>
              </div>
            </div>

            {/* Preview Box */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <p className="text-sm font-medium text-gray-700 mb-4">Preview</p>
              <div className="space-y-4">
                <div>
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: formData.primaryColor }}
                  >
                    {formData.businessName || "Business Name"}
                  </h3>
                  <p
                    className="text-lg"
                    style={{ color: formData.secondaryColor }}
                  >
                    {formData.tagline || "Your tagline here"}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    Primary Button
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2 rounded-lg font-medium"
                    style={{
                      backgroundColor: "white",
                      color: formData.secondaryColor,
                      border: `2px solid ${formData.secondaryColor}`,
                    }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <FiSave className="w-5 h-5" />
                <span>Save Settings</span>
              </button>
              {brandSettings.selectedTemplateId && (
                <button
                  type="button"
                  onClick={handlePreview}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <FiEye className="w-5 h-5" />
                  <span>Preview Store</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <FiRefreshCw className="w-5 h-5" />
                <span>Reset</span>
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 Tips for Great Branding
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• Keep your business name short and memorable</li>
            <li>• Choose a tagline that clearly communicates your value</li>
            <li>• Use colors that reflect your brand personality</li>
            <li>• Ensure good contrast between primary and secondary colors</li>
            <li>• Preview your changes before saving</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
