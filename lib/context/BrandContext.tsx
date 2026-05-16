"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { BrandSettings, OnboardingData } from "@/lib/types";

interface BrandContextType {
  brandSettings: BrandSettings;
  onboardingData: Partial<OnboardingData> | null;
  updateBrandSettings: (settings: Partial<BrandSettings>) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  resetBrandSettings: () => void;
  isOnboardingComplete: boolean;
}

const defaultBrandSettings: BrandSettings = {
  businessName: "My Store",
  tagline: "Your one-stop shop for everything",
  primaryColor: "#2563EB",
  secondaryColor: "#64748B",
  selectedTemplateId: null,
};

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brandSettings, setBrandSettings] =
    useState<BrandSettings>(defaultBrandSettings);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData> | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("brandSettings");
    if (saved) {
      try {
        // Defer to avoid synchronous setState in effect
        setTimeout(() => setBrandSettings(JSON.parse(saved)), 0);
      } catch (error) {
        console.error("Error loading brand settings:", error);
      }
    }
  }, []);

  // Load onboarding data
  useEffect(() => {
    const savedOnboarding = localStorage.getItem("onboarding_data");
    if (savedOnboarding) {
      try {
        const data = JSON.parse(savedOnboarding);
        // Defer state updates to avoid synchronous setState in effect
        setTimeout(() => {
          setOnboardingData(data);

          // Sync onboarding data with brand settings
          if (data.businessName) {
            setBrandSettings((prev) => ({
              ...prev,
              businessName: data.businessName,
              logo: data.logo?.url,
              whatsappNumber: data.website?.config?.content?.whatsappNumber || prev.whatsappNumber,
              selectedTemplateId: data.website?.templateId || prev.selectedTemplateId,
            }));
          }
        }, 0);
      } catch (error) {
        console.error("Error loading onboarding data:", error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("brandSettings", JSON.stringify(brandSettings));
  }, [brandSettings]);

  const updateBrandSettings = (settings: Partial<BrandSettings>) => {
    setBrandSettings((prev) => ({ ...prev, ...settings }));
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    const updated = { ...onboardingData, ...data };
    setOnboardingData(updated);
    localStorage.setItem("onboarding_data", JSON.stringify(updated));
  };

  const resetBrandSettings = () => {
    setBrandSettings(defaultBrandSettings);
    localStorage.removeItem("brandSettings");
  };

  const isOnboardingComplete = onboardingData?.isComplete || false;

  return (
    <BrandContext.Provider
      value={{ 
        brandSettings, 
        onboardingData,
        updateBrandSettings, 
        updateOnboardingData,
        resetBrandSettings,
        isOnboardingComplete,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within BrandProvider");
  }
  return context;
}
