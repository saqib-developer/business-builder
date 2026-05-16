"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useSearchParams } from "next/navigation";
import ModernShopTemplate from "@/components/templates/ModernShopTemplate";
import ClassicStoreTemplate from "@/components/templates/ClassicStoreTemplate";
import MinimalBoutiqueTemplate from "@/components/templates/MinimalBoutiqueTemplate";
import BoldMarketTemplate from "@/components/templates/BoldMarketTemplate";
import ComingSoonPage from "@/components/storefront/ComingSoonPage";
import StorefrontNotFoundPage from "@/components/storefront/StorefrontNotFoundPage";
import {
  isLikelyStorefrontHost,
  normalizeDomain,
  resolveStorefrontByDomain,
  StorefrontResolution,
} from "@/lib/storefront";
import { TemplateConfig } from "@/lib/types/template";

function StorefrontShopPageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [storefrontData, setStorefrontData] = useState<StorefrontResolution | null>(null);
  const [isStorefrontMode, setIsStorefrontMode] = useState(false);
  const [isResolvingStorefront, setIsResolvingStorefront] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const loadStorefront = async () => {
      const forcedDomain = normalizeDomain(searchParams.get("domain") || "");
      const host = typeof window !== "undefined" ? normalizeDomain(window.location.hostname) : "";
      const lookupDomain = forcedDomain || host;

      if (!lookupDomain) {
        if (!isCancelled) {
          setIsStorefrontMode(false);
          setStorefrontData(null);
          setIsResolvingStorefront(false);
        }
        return;
      }

      const shouldResolveStorefront = Boolean(forcedDomain) || isLikelyStorefrontHost(lookupDomain);
      if (!shouldResolveStorefront) {
        if (!isCancelled) {
          setIsStorefrontMode(false);
          setStorefrontData(null);
          setIsResolvingStorefront(false);
        }
        return;
      }

      if (!isCancelled) {
        setIsStorefrontMode(true);
        setIsResolvingStorefront(true);
      }

      try {
        const resolved = await resolveStorefrontByDomain(lookupDomain);
        if (!isCancelled) {
          setStorefrontData(resolved);
        }
      } catch {
        if (!isCancelled) {
          setStorefrontData(null);
        }
      } finally {
        if (!isCancelled) {
          setIsResolvingStorefront(false);
        }
      }
    };

    loadStorefront();

    return () => {
      isCancelled = true;
    };
  }, [searchParams]);

  const ownerPreviewRequested = searchParams.get("ownerPreview") === "1";
  const ownerOverride = Boolean(ownerPreviewRequested && user?.id && storefrontData?.userId === user.id);

  const storefrontConfig = useMemo<TemplateConfig | undefined>(() => {
    if (!storefrontData) {
      return undefined;
    }

    const config = storefrontData.websiteConfig || {};
    const theme = (config as Record<string, unknown>)?.theme as Record<string, string> | undefined || {};
    const content = (config as Record<string, unknown>)?.content as Record<string, unknown> | undefined || {};
    return {
      templateId: storefrontData.templateId,
      theme: {
        primaryColor: (theme as Record<string, unknown>)?.primaryColor as string || "#2563EB",
        secondaryColor: (theme as Record<string, unknown>)?.secondaryColor as string || "#64748B",
      },
      content: {
        heroHeadline: (content as Record<string, unknown>)?.heroHeadline as string || storefrontData.businessName,
        heroSubheadline: (content as Record<string, unknown>)?.heroSubheadline as string || "Welcome to our store.",
        heroImage: (content as Record<string, unknown>)?.heroImage as string || "",
        brandLogo: storefrontData.logoUrl || (content as Record<string, unknown>)?.brandLogo as string || "",
        whatsappNumber: (content as Record<string, unknown>)?.whatsappNumber as string || "",
      },
    };
  }, [storefrontData]);

  if (!isStorefrontMode) {
    return <StorefrontNotFoundPage />;
  }

  if (isResolvingStorefront) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
          <p className="mt-3 text-sm text-slate-600">Loading storefront...</p>
        </div>
      </main>
    );
  }

  if (storefrontData === null) {
    return <StorefrontNotFoundPage />;
  }

  if (!storefrontData.isPublished && !ownerOverride) {
    return (
      <ComingSoonPage
        businessName={storefrontData.businessName}
        logoUrl={storefrontData.logoUrl}
      />
    );
  }

  switch (storefrontData.templateId) {
    case "classic-store":
      return <ClassicStoreTemplate config={storefrontConfig} storeOwnerId={storefrontData.userId} initialPage="shop" />;
    case "minimal-boutique":
      return <MinimalBoutiqueTemplate config={storefrontConfig} storeOwnerId={storefrontData.userId} initialPage="shop" />;
    case "bold-market":
      return <BoldMarketTemplate config={storefrontConfig} storeOwnerId={storefrontData.userId} initialPage="shop" />;
    default:
      return <ModernShopTemplate config={storefrontConfig} storeOwnerId={storefrontData.userId} initialPage="shop" />;
  }
}

export default function StorefrontShopPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
            <p className="mt-3 text-sm text-slate-600">Loading storefront...</p>
          </div>
        </main>
      }
    >
      <StorefrontShopPageContent />
    </Suspense>
  );
}