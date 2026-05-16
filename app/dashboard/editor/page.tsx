"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { FiArrowLeft, FiSettings } from "react-icons/fi";
import { useAuth } from "@/lib/context/AuthContext";
import { useBrand } from "@/lib/context/BrandContext";
import { firestore } from "@/lib/firebase";
import { OnboardingData, WebsiteSetup } from "@/lib/types/onboarding";
import { TemplateConfig } from "@/lib/types/template";
import Step5BCustomizer from "@/components/onboarding/Step5BCustomizer";

function removeUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => removeUndefinedDeep(item))
      .filter((item) => item !== undefined) as T;
  }

  if (value && typeof value === "object") {
    const cleaned = Object.entries(value as Record<string, unknown>).reduce(
      (acc, [key, entry]) => {
        if (entry === undefined) {
          return acc;
        }
        acc[key] = removeUndefinedDeep(entry);
        return acc;
      },
      {} as Record<string, unknown>,
    );
    return cleaned as T;
  }

  return value;
}

function DashboardEditorPageContent() {
  const { user, loading: authLoading } = useAuth();
  const { brandSettings, updateBrandSettings } = useBrand();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateFromQuery = searchParams.get("template");
  const [initialWebsiteData, setInitialWebsiteData] = useState<WebsiteSetup | undefined>();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/sign-in?redirect=/dashboard/editor");
      return;
    }

    const saved = localStorage.getItem(`onboarding_${user.id}`);
    if (saved) {
      try {
        const onboardingData = JSON.parse(saved) as Partial<OnboardingData>;
        // Defer setState to avoid synchronous setState inside effect
        setTimeout(() => setInitialWebsiteData(onboardingData.website), 0);
      } catch (error) {
        void error;
      }
    }
  }, [user, authLoading, router]);

  const editorTemplateId = useMemo(() => {
    return (
      templateFromQuery ||
      initialWebsiteData?.templateId ||
      brandSettings.selectedTemplateId ||
      "modern-shop"
    );
  }, [brandSettings.selectedTemplateId, initialWebsiteData?.templateId, templateFromQuery]);

  const initialConfig = useMemo<TemplateConfig>(() => {
    if (initialWebsiteData?.config?.templateId) {
      return {
        templateId: initialWebsiteData.config.templateId as string,
        theme: {
          primaryColor:
            (initialWebsiteData.config.theme?.primaryColor as string | undefined) || brandSettings.primaryColor,
          secondaryColor:
            (initialWebsiteData.config.theme?.secondaryColor as string | undefined) || brandSettings.secondaryColor,
        },
        content: {
          heroHeadline:
            (initialWebsiteData.config.content?.heroHeadline as string | undefined) || brandSettings.businessName,
          heroSubheadline:
            (initialWebsiteData.config.content?.heroSubheadline as string | undefined) || brandSettings.tagline,
          heroImage: (initialWebsiteData.config.content?.heroImage as string | undefined) || "",
          brandLogo: (initialWebsiteData.config.content?.brandLogo as string | undefined) || brandSettings.logo,
          whatsappNumber:
            (initialWebsiteData.config.content?.whatsappNumber as string | undefined) || brandSettings.whatsappNumber || "",
        },
      };
    }

    return {
      templateId: editorTemplateId,
      theme: {
        primaryColor: brandSettings.primaryColor,
        secondaryColor: brandSettings.secondaryColor,
      },
      content: {
        heroHeadline: brandSettings.businessName,
        heroSubheadline: brandSettings.tagline,
        heroImage: "",
        brandLogo: brandSettings.logo,
        whatsappNumber: brandSettings.whatsappNumber || "",
      },
    };
  }, [brandSettings, editorTemplateId, initialWebsiteData?.config]);

  const handleFinish = async (websiteData: WebsiteSetup) => {
    if (!user?.id) {
      return;
    }

    const previousOnboarding = localStorage.getItem(`onboarding_${user.id}`);
    const parsedOnboarding = previousOnboarding ? JSON.parse(previousOnboarding) : {};
    const existingWhatsappNumber =
      parsedOnboarding?.website?.config?.content?.whatsappNumber ||
      brandSettings.whatsappNumber ||
      "";
    const providedWhatsappNumber = websiteData.config?.content?.whatsappNumber || "";

    const mergedWebsiteData: WebsiteSetup = removeUndefinedDeep({
      ...websiteData,
      config: {
        ...(websiteData.config || {}),
        templateId: websiteData.templateId,
        isPublished: Boolean(parsedOnboarding?.website?.config?.isPublished),
        content: {
          ...(websiteData.config?.content || {}),
          whatsappNumber: providedWhatsappNumber || existingWhatsappNumber,
        },
      },
    });

    const updatedOnboarding: Partial<OnboardingData> = {
      ...parsedOnboarding,
      website: mergedWebsiteData,
    };

    localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(updatedOnboarding));
    updateBrandSettings({
      selectedTemplateId: mergedWebsiteData.templateId || brandSettings.selectedTemplateId,
      whatsappNumber: mergedWebsiteData.config?.content?.whatsappNumber || existingWhatsappNumber,
    });

    try {
      const userRef = doc(firestore, "users", user.id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, { onboarding: updatedOnboarding });
      } else {
        await setDoc(userRef, { onboarding: updatedOnboarding }, { merge: true });
      }
    } catch (error) {
      void error;
    }

    router.push("/dashboard");
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <FiSettings className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-slate-600">Loading website editor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="w-full px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Website Editor
              </p>
              <h1 className="text-xl font-semibold text-slate-900">
                Customize Your Website
              </h1>
            </div>
          </div>
            </div>
      </div>

      <main className="w-full px-0 py-0">
        <Step5BCustomizer
          businessName={brandSettings.businessName}
          templateId={editorTemplateId}
          initialConfig={initialConfig}
          onFinish={handleFinish}
          onBack={() => router.push("/dashboard")}
          embedded
          interactivePreview
          onBackLabel="Back to Dashboard"
        />
      </main>
    </div>
  );
}

export default function DashboardEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <FiSettings className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-sm text-slate-600">Loading website editor...</p>
          </div>
        </div>
      }
    >
      <DashboardEditorPageContent />
    </Suspense>
  );
}
