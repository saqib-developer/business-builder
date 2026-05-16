"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useBrand } from "@/lib/context/BrandContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  FiAward,
  FiCheckCircle,
  FiGlobe,
  FiMessageCircle,
  FiShare2,
  FiType,
  FiPackage,
  FiServer,
} from "react-icons/fi";
import { OnboardingData, WebsiteSetup } from "@/lib/types/onboarding";
import {
  CustomDesignRequest,
  getCustomDesignRequest,
  getLogoData,
} from "@/lib/firebase/firestoreService";
import { firestore } from "@/lib/firebase";
import WebsiteSupportChatPanel from "@/components/dashboard/WebsiteSupportChatPanel";
import ProductsSection from "@/components/products/ProductsSection";
import DomainHostingSection from "@/components/dashboard/DomainHostingSection";
import LaunchStoreSection from "@/components/dashboard/LaunchStoreSection";

const TOTAL_ONBOARDING_STEPS = 5;

interface PillarCardProps {
  title: string;
  subtitle: string;
  statusLabel: string;
  icon: ReactNode;
  iconToneClass: string;
  children: ReactNode;
}

function PillarCard({
  title,
  subtitle,
  statusLabel,
  icon,
  iconToneClass,
  children,
}: PillarCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_50px_-38px_rgba(15,23,42,0.75)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg ${iconToneClass}`}
          >
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {statusLabel}
        </span>
      </div>
      {children}
    </article>
  );
}

function formatSelection(value: string | null | undefined) {
  if (!value) {
    return "Not selected";
  }

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getConnectedPlatformCount(socialMedia: OnboardingData["socialMedia"] | undefined) {
  if (!socialMedia) {
    return 0;
  }

  return Object.values(socialMedia).filter((platform) => platform.clicked).length;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { brandSettings, updateBrandSettings } = useBrand();
  const router = useRouter();
  const [localOnboardingData, setLocalOnboardingData] =
    useState<Partial<OnboardingData> | null>(null);
  const [customLogoRequest, setCustomLogoRequest] =
    useState<CustomDesignRequest | null>(null);
  const [isCustomLogoRequestLoading, setIsCustomLogoRequestLoading] =
    useState(false);
  const [whatsappDraft, setWhatsappDraft] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "domain-hosting" | "launch-store">("dashboard");

  useEffect(() => {
    let deferredStateUpdate: number | null = null;

    if (!loading && !user) {
      router.push("/sign-in?redirect=/dashboard");
      return;
    }

    if (!user || loading) {
      return;
    }

    // Check local onboarding cache first
    const saved = localStorage.getItem(`onboarding_${user.id}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);

        // If onboarding not complete, redirect to onboarding
        if (!data.isComplete) {
          router.push("/onboarding");
          return;
        }

        // Keep this update async to avoid triggering lint's set-state-in-effect rule.
        deferredStateUpdate = window.setTimeout(() => {
          setLocalOnboardingData(data);
        }, 0);
      } catch (error) {
        console.error("Error loading onboarding:", error);
        router.push("/onboarding");
      }
    } else {
      // Fallback to Firestore users/{id}.onboarding when local cache is unavailable.
      const loadFromFirestore = async () => {
        try {
          const userRef = doc(firestore, "users", user.id);
          const userDoc = await getDoc(userRef);
          const remoteOnboarding = userDoc.exists() ? userDoc.data()?.onboarding : null;

          if (!remoteOnboarding?.isComplete) {
            router.push("/onboarding");
            return;
          }

          localStorage.setItem(
            `onboarding_${user.id}`,
            JSON.stringify(remoteOnboarding),
          );
          setLocalOnboardingData(remoteOnboarding);
        } catch (error) {
          console.error("Error loading onboarding from Firestore:", error);
          router.push("/onboarding");
        }
      };

      loadFromFirestore();
    }

    return () => {
      if (deferredStateUpdate !== null) {
        window.clearTimeout(deferredStateUpdate);
      }
    };
  }, [user, loading, router]);

  useEffect(() => {
    const numberFromOnboarding =
      (localOnboardingData?.website?.config?.content?.whatsappNumber as string | undefined) ||
      brandSettings.whatsappNumber ||
      "";
    // Defer setState to avoid synchronous setState inside effect
    setTimeout(() => setWhatsappDraft(numberFromOnboarding), 0);
  }, [localOnboardingData?.website?.config?.content?.whatsappNumber, brandSettings.whatsappNumber]);

  useEffect(() => {
    if (!user?.id || !localOnboardingData) {
      return;
    }

    // Keep local onboarding.logo in sync with persisted userLogos selection.
    getLogoData(user.id)
      .then((logoData) => {
        if (!logoData?.url || logoData.type !== "custom") {
          return;
        }

        const existingUrl = localOnboardingData.logo?.url;
        if (existingUrl === logoData.url && localOnboardingData.logo?.type === "custom") {
          return;
        }

        const mergedData: Partial<OnboardingData> = {
          ...localOnboardingData,
          logo: {
            ...(localOnboardingData.logo || {}),
            type: "custom",
            url: logoData.url,
            customDesignRequestId:
              logoData.customDesignRequestId || localOnboardingData.logo?.customDesignRequestId,
          },
        };

        setLocalOnboardingData(mergedData);
        localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(mergedData));
      })
      .catch((error) => {
        console.error("Error syncing selected logo from Firestore:", error);
      });
  }, [user?.id, localOnboardingData]);

  useEffect(() => {
    let isCancelled = false;
    let deferredReset: number | null = null;
    let deferredLoadingStart: number | null = null;

    if (!user?.id || localOnboardingData?.logo?.type !== "custom") {
      deferredReset = window.setTimeout(() => {
        setCustomLogoRequest(null);
        setIsCustomLogoRequestLoading(false);
      }, 0);
      return;
    }

    deferredLoadingStart = window.setTimeout(() => {
      setIsCustomLogoRequestLoading(true);
    }, 0);

    getCustomDesignRequest(user.id)
      .then((request) => {
        if (!isCancelled) {
          setCustomLogoRequest(request);
        }
      })
      .catch((error) => {
        console.error("Error loading custom logo request:", error);
        if (!isCancelled) {
          setCustomLogoRequest(null);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsCustomLogoRequestLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      if (deferredReset !== null) {
        window.clearTimeout(deferredReset);
      }
      if (deferredLoadingStart !== null) {
        window.clearTimeout(deferredLoadingStart);
      }
    };
  }, [user?.id, localOnboardingData?.logo?.type]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !localOnboardingData?.isComplete) {
    return null;
  }

  const completionPercentage = localOnboardingData.completedSteps
    ? Math.round(
        (localOnboardingData.completedSteps.length / TOTAL_ONBOARDING_STEPS) *
          100,
      )
    : 0;

  const logoType = localOnboardingData.logo?.type;
  const websiteType = localOnboardingData.website?.type;
  const socialConnections = getConnectedPlatformCount(localOnboardingData.socialMedia);
  const configuredPillars = [
    Boolean(localOnboardingData.businessName),
    Boolean(logoType),
    socialConnections > 0,
    Boolean(websiteType),
  ].filter(Boolean).length;

  const socialPlatforms = [
    {
      name: "TikTok",
      connected: Boolean(localOnboardingData.socialMedia?.tiktok?.clicked),
    },
    {
      name: "Instagram",
      connected: Boolean(localOnboardingData.socialMedia?.instagram?.clicked),
    },
    {
      name: "Facebook",
      connected: Boolean(localOnboardingData.socialMedia?.facebook?.clicked),
    },
    {
      name: "WhatsApp",
      connected: Boolean(localOnboardingData.socialMedia?.whatsapp?.clicked),
    },
  ];

  const progressBarWidth = Math.min(Math.max(completionPercentage, 0), 100);
  const displayName = user.firstName?.trim() || user.email;
  const hasTemplateSelected = Boolean(localOnboardingData.website?.templateId);
  const selectedTemplateId = localOnboardingData.website?.templateId || brandSettings.selectedTemplateId;
 
  const openEditStep = (step: number, options?: { openCustomizer?: boolean }) => {
    if (step === 5) {
      router.push(`/dashboard/editor?template=${selectedTemplateId || "modern-shop"}`);
      return;
    }

    const params = new URLSearchParams({
      step: String(step),
      source: "dashboard",
      mode: "edit",
    });

    if (step === 5 && options?.openCustomizer) {
      params.set("edit", "true");
    }

    router.push(`/onboarding?${params.toString()}`);
  };

  const handleSaveWhatsappNumber = async () => {
    if (!user?.id) {
      return;
    }

    const cleanedNumber = whatsappDraft.replace(/\D/g, "");
    const updatedWebsite: WebsiteSetup = {
      type: localOnboardingData?.website?.type ?? null,
      templateId: localOnboardingData?.website?.templateId,
      config: {
        ...(localOnboardingData?.website?.config || {}),
        content: {
          ...(localOnboardingData?.website?.config?.content || {}),
          whatsappNumber: cleanedNumber,
        },
      },
    };

    const updatedOnboarding: Partial<OnboardingData> = {
      ...localOnboardingData,
      website: updatedWebsite,
    };

    setWhatsappDraft(cleanedNumber);
    setLocalOnboardingData(updatedOnboarding);
    updateBrandSettings({ whatsappNumber: cleanedNumber });
    localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(updatedOnboarding));

    try {
      const userRef = doc(firestore, "users", user.id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, { onboarding: updatedOnboarding });
      } else {
        await setDoc(userRef, { onboarding: updatedOnboarding }, { merge: true });
      }
    } catch (error) {
      console.error("Error saving WhatsApp number:", error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute -top-16 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-200/55 blur-3xl" />
        <div className="absolute -right-20 top-56 h-72 w-72 rounded-full bg-blue-200/45 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-[0_35px_70px_-52px_rgba(15,23,42,0.65)] backdrop-blur">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-8 text-white sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
              Dashboard Control Center
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back, {displayName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
              Track your progress and monitor each core business pillar from one
              polished workspace.
            </p>
            
            {/* Tab Toggle */}
            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-white text-slate-900"
                    : "bg-slate-700 text-white hover:bg-slate-600"
                }`}
              >
                <FiCheckCircle className="h-4 w-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "products"
                    ? "bg-white text-slate-900"
                    : "bg-slate-700 text-white hover:bg-slate-600"
                }`}
              >
                <FiPackage className="h-4 w-4" />
                Products
              </button>
              <button
                onClick={() => setActiveTab("domain-hosting")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "domain-hosting"
                    ? "bg-white text-slate-900"
                    : "bg-slate-700 text-white hover:bg-slate-600"
                }`}
              >
                <FiServer className="h-4 w-4" />
                Domain & Hosting
              </button>
              <button
                onClick={() => setActiveTab("launch-store")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "launch-store"
                    ? "bg-white text-slate-900"
                    : "bg-slate-700 text-white hover:bg-slate-600"
                }`}
              >
                <FiGlobe className="h-4 w-4" />
                Launch Store
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Completion</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {completionPercentage}%
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600"
                  style={{ width: `${progressBarWidth}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Configured Pillars</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {configuredPillars}/4
              </p>
              <p className="mt-4 text-sm text-slate-500">
                Business Name, Logo, Social Media, Website
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Connected Platforms</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {socialConnections}/4
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                <FiCheckCircle className="h-4 w-4" />
                Social footprint tracking active
              </p>
            </div>
          </div>
        </section>

        {activeTab === "products" ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_50px_-38px_rgba(15,23,42,0.75)] sm:p-8">
            <ProductsSection userId={user?.id || ""} />
          </section>
        ) : activeTab === "domain-hosting" ? (
          <DomainHostingSection
            userId={user?.id || ""}
            businessName={localOnboardingData.businessName}
            onboardingData={localOnboardingData}
            onOnboardingDataUpdate={(next) => setLocalOnboardingData(next)}
          />
        ) : activeTab === "launch-store" ? (
          <LaunchStoreSection
            userId={user?.id || ""}
            onboardingData={localOnboardingData}
            onOnboardingDataUpdate={(next) => setLocalOnboardingData(next)}
          />
        ) : (
        <section className="grid gap-6 lg:grid-cols-2">
          <PillarCard
            title="Business Name"
            subtitle="Identity"
            statusLabel={localOnboardingData.businessName ? "Configured" : "Pending"}
            icon={<FiType className="h-5 w-5" />}
            iconToneClass="bg-gradient-to-br from-sky-500 to-blue-600"
          >
            <p className="text-2xl font-semibold text-slate-900">
              {localOnboardingData.businessName || "Untitled Business"}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              This card anchors the core brand name that will be reused across
              the product experience.
            </p>
            
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => openEditStep(2)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
              >
                Edit
              </button>
            </div>
          </PillarCard>

          <PillarCard
            title="Logo"
            subtitle="Brand Visual"
            statusLabel={formatSelection(logoType)}
            icon={<FiAward className="h-5 w-5" />}
            iconToneClass="bg-gradient-to-br from-amber-500 to-orange-500"
          >
            <p className="text-sm text-slate-600">
              Current mode: <span className="font-semibold text-slate-900">{formatSelection(logoType)}</span>
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => openEditStep(3)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
              >
                Change Logo Mode
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              {logoType === "upload" || logoType === "ai-generated" ? (
                localOnboardingData.logo?.url ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {logoType === "upload" ? "Uploaded Logo" : "AI Generated Logo"}
                      </p>
                      <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                        Active
                      </span>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <img
                        src={localOnboardingData.logo.url}
                        alt="Active logo"
                        className="mx-auto h-28 w-full max-w-[220px] object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-600">
                    No logo asset was found for this option. Choose a new logo
                    to refresh your brand visual.
                  </p>
                )
              ) : logoType === "custom" ? (
                localOnboardingData.logo?.url ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Custom Logo (Chosen from Chat)
                      </p>
                      <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                        Active
                      </span>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <img
                        src={localOnboardingData.logo.url}
                        alt="Active custom logo"
                        className="mx-auto h-28 w-full max-w-[220px] object-contain"
                      />
                    </div>
                    <button
                      onClick={() => router.push("/dashboard/chat?type=logo")}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      <FiMessageCircle className="h-4 w-4" />
                      Chat with Design Team
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Custom Design Request
                      </p>
                    </div>
                    <p className="text-slate-700">
                      Choose a logo image from chat to set it as your active brand logo.
                    </p>
                    <button
                      onClick={() => router.push("/dashboard/chat?type=logo")}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      <FiMessageCircle className="h-4 w-4" />
                      Chat with Design Team
                    </button>
                  </div>
                )
              ) : (
                <p className="text-slate-600">
                  No logo is configured yet. Choose upload, AI generation, or
                  custom design to activate your brand visual.
                </p>
              )}
            </div>
            
          </PillarCard>

          <PillarCard
            title="Social Media"
            subtitle="Distribution"
            statusLabel={`${socialConnections}/4 Connected`}
            icon={<FiShare2 className="h-5 w-5" />}
            iconToneClass="bg-gradient-to-br from-emerald-500 to-cyan-600"
          >
            <p className="mb-4 text-sm text-slate-600">
              Platform readiness snapshot for your initial growth channels.
            </p>

            <ul className="grid grid-cols-2 gap-3">
              {socialPlatforms.map((platform) => (
                <li
                  key={platform.name}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <p className="text-sm font-medium text-slate-800">{platform.name}</p>
                  <p
                    className={`mt-1 text-xs font-semibold uppercase tracking-wide ${
                      platform.connected ? "text-emerald-600" : "text-slate-500"
                    }`}
                  >
                    {platform.connected ? "Connected" : "Pending"}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => openEditStep(4)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
              >
                Edit
              </button>
            </div>
          </PillarCard>

          <PillarCard
            title="Website"
            subtitle="Digital Presence"
            statusLabel={formatSelection(websiteType)}
            icon={<FiGlobe className="h-5 w-5" />}
            iconToneClass="bg-gradient-to-br from-indigo-500 to-blue-700"
          >
            <p className="text-sm text-slate-600">
              Current mode: <span className="font-semibold text-slate-900">{formatSelection(websiteType)}</span>
            </p>

            <div className="mt-4 rounded-xl border p-4 text-sm">
              {websiteType === "template" ? (
                <div className="space-y-3">
                  <p className="text-blue-700">
                    Your template website is ready to customize.
                  </p>
                  <button
                    type="button"
                    onClick={() => openEditStep(5, { openCustomizer: true })}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Edit Website
                  </button>
                </div>
              ) : websiteType === "wordpress" || websiteType === "custom" ? (
                <div className="space-y-3">
                  <p className="text-indigo-700">
                    {websiteType === "wordpress"
                      ? "Your WordPress setup support chat is ready when you send your first message."
                      : "Your custom development support chat is ready when you send your first message."}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/dashboard/chat?type=${websiteType === "wordpress" ? "wordpress" : "custom-code"}`,
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    <FiMessageCircle className="h-4 w-4" />
                    Chat with Developer
                  </button>
                  <p className="text-xs text-slate-500">
                    Chats are separated by topic and only appear to admins after your first message.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-slate-900 font-medium">Website setup is not selected yet.</p>
                  <p className="text-slate-600">
                    Choose a website type to continue building your storefront.
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push("/onboarding?step=5")}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Choose Website Setup
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                WhatsApp Business Number
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={whatsappDraft}
                  onChange={(e) => setWhatsappDraft(e.target.value)}
                  placeholder="15551234567"
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveWhatsappNumber}
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Save Number
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                This number powers your website contact buttons and product WhatsApp links.
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  openEditStep(5, {
                    openCustomizer: false,
                  })
                }
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
              >
                {websiteType ? "Change" : "Edit"}
              </button>
            </div>
          </PillarCard>
        </section>
        )}
      </main>
    </div>
  );
}
