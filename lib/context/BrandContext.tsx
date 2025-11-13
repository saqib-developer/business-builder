"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { BrandSettings } from "@/lib/types";

interface BrandContextType {
  brandSettings: BrandSettings;
  updateBrandSettings: (settings: Partial<BrandSettings>) => void;
  resetBrandSettings: () => void;
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

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("brandSettings");
    if (saved) {
      try {
        setBrandSettings(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading brand settings:", error);
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

  const resetBrandSettings = () => {
    setBrandSettings(defaultBrandSettings);
    localStorage.removeItem("brandSettings");
  };

  return (
    <BrandContext.Provider
      value={{ brandSettings, updateBrandSettings, resetBrandSettings }}
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
