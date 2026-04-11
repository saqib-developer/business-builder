"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useBrand } from "@/lib/context/BrandContext";
import { useAuth } from "@/lib/context/AuthContext";
import TemplateShell from "@/components/templates/TemplateShell";
import { TemplateConfig } from "@/lib/types/template";
import { buildWhatsAppLink, createProductArtwork, TemplateId } from "@/lib/templateCatalog";
import { FiArrowLeft, FiMessageCircle } from "react-icons/fi";
import { getProduct, Product } from "@/lib/firebase/firestoreService";
import ComingSoonPage from "@/components/storefront/ComingSoonPage";
import StorefrontNotFoundPage from "@/components/storefront/StorefrontNotFoundPage";
import { isLikelyStorefrontHost, normalizeDomain, resolveStorefrontByDomain, StorefrontResolution } from "@/lib/storefront";

const TEMPLATE_FRAME_CLASSES: Record<TemplateId, { hero: string; card: string; button: string }> = {
  "modern-shop": {
    hero: "bg-white text-gray-900",
    card: "border-gray-200 bg-white",
    button: "bg-blue-600 text-white",
  },
  "classic-store": {
    hero: "bg-black text-white",
    card: "border-zinc-700 bg-zinc-900 text-white",
    button: "bg-cyan-400 text-zinc-950",
  },
  "minimal-boutique": {
    hero: "bg-pink-50 text-gray-900",
    card: "border-white bg-white",
    button: "bg-pink-500 text-white",
  },
  "bold-market": {
    hero: "bg-slate-100 text-slate-900",
    card: "border-slate-300 bg-white",
    button: "bg-slate-900 text-white",
  },
};

function ProductDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { brandSettings, onboardingData } = useBrand();

  const [storefrontData, setStorefrontData] = useState<StorefrontResolution | null>(null);
  const [isStorefrontMode, setIsStorefrontMode] = useState(false);
  const [isResolvingStorefront, setIsResolvingStorefront] = useState(true);

  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const ownerPreviewRequested = searchParams.get("ownerPreview") === "1";

  useEffect(() => {
    let isCancelled = false;

    const resolveByHost = async () => {
      const host = typeof window !== "undefined" ? normalizeDomain(window.location.hostname) : "";
      const forcedDomain = normalizeDomain(searchParams.get("domain") || "");
      const lookupDomain = forcedDomain || host;

      if (!lookupDomain || (!forcedDomain && !isLikelyStorefrontHost(lookupDomain))) {
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
      } finally {
        if (!isCancelled) {
          setIsResolvingStorefront(false);
        }
      }
    };

    resolveByHost();

    return () => {
      isCancelled = true;
    };
  }, [searchParams]);

  const ownerOverride = Boolean(ownerPreviewRequested && user?.id && storefrontData?.userId === user.id);
  const selectedTemplateId = (
    storefrontData?.templateId ||
    brandSettings.selectedTemplateId ||
    "modern-shop"
  ) as TemplateId;
  const templateFrame = TEMPLATE_FRAME_CLASSES[selectedTemplateId] || TEMPLATE_FRAME_CLASSES["modern-shop"];
  const isBlockedByPublishState = Boolean(storefrontData && !storefrontData.isPublished && !ownerOverride);
  const targetUserId = storefrontData?.userId || user?.id;

  useEffect(() => {
    let isCancelled = false;

    if (!productId || !targetUserId || isBlockedByPublishState) {
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      const data = await getProduct(productId);

      if (isCancelled) return;

      // Ensure product belongs to active storefront owner.
      if (!data || data.userId !== targetUserId) {
        setProduct(null);
      } else {
        setProduct(data);
      }
      setIsLoading(false);
    };

    fetchProduct();

    return () => {
      isCancelled = true;
    };
  }, [productId, targetUserId, isBlockedByPublishState]);

  const config = useMemo<Partial<TemplateConfig>>(
    () => ({
      templateId: selectedTemplateId,
      theme: {
        primaryColor:
          storefrontData?.websiteConfig?.theme?.primaryColor ||
          brandSettings.primaryColor,
        secondaryColor:
          storefrontData?.websiteConfig?.theme?.secondaryColor ||
          brandSettings.secondaryColor,
      },
      content: {
        heroHeadline:
          storefrontData?.websiteConfig?.content?.heroHeadline ||
          storefrontData?.businessName ||
          brandSettings.businessName,
        heroSubheadline:
          storefrontData?.websiteConfig?.content?.heroSubheadline ||
          brandSettings.tagline,
        brandLogo:
          storefrontData?.logoUrl ||
          storefrontData?.websiteConfig?.content?.brandLogo ||
          brandSettings.logo,
        whatsappNumber:
          storefrontData?.websiteConfig?.content?.whatsappNumber ||
          brandSettings.whatsappNumber ||
          onboardingData?.website?.config?.content?.whatsappNumber ||
          "",
      },
    }),
    [brandSettings, onboardingData, selectedTemplateId, storefrontData],
  );

  const whatsappNumber = ((config.content?.whatsappNumber || "") as string).replace(/\D/g, "");
  const link = buildWhatsAppLink(whatsappNumber, product?.name || "this product");
  const artwork = createProductArtwork(
    product?.name || "Product",
    brandSettings.primaryColor || "#2563EB",
    brandSettings.secondaryColor || "#64748B",
  );

  if (isResolvingStorefront) {
    return (
      <section className={`min-h-[calc(100vh-160px)] flex items-center justify-center ${templateFrame.hero}`}>
        <div className="text-center px-4">
          <p className="text-lg opacity-80">Loading storefront...</p>
        </div>
      </section>
    );
  }

  if (isStorefrontMode && storefrontData === null) {
    return <StorefrontNotFoundPage />;
  }

  if (isBlockedByPublishState) {
    return (
      <ComingSoonPage
        businessName={storefrontData?.businessName || "Your Business"}
        logoUrl={storefrontData?.logoUrl || ""}
      />
    );
  }

  const page = isLoading ? (
    <section className={`min-h-[calc(100vh-160px)] flex items-center justify-center ${templateFrame.hero}`}>
      <div className="text-center px-4">
        <p className="text-lg opacity-80">Loading product...</p>
      </div>
    </section>
  ) : product ? (
    <section className={`min-h-[calc(100vh-160px)] ${templateFrame.hero}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium opacity-80 hover:opacity-100"
        >
          <FiArrowLeft />
          Back
        </button>

        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div className={`overflow-hidden border ${templateFrame.card} rounded-2xl shadow-sm`}>
            <img src={artwork} alt={product.name} className="w-full h-[420px] object-cover" />
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-semibold opacity-70">Product Detail</p>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold">{product.name}</h1>
              <p className="mt-4 text-lg opacity-80 max-w-xl">{product.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black" style={{ color: brandSettings.primaryColor || "#2563EB" }}>
                {product.price}
              </span>
            </div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${templateFrame.button} ${whatsappNumber ? "" : "opacity-60 pointer-events-none"}`}
            >
              <FiMessageCircle />
              Contact on WhatsApp
            </a>
            {!whatsappNumber && (
              <p className="text-sm opacity-70">Set the WhatsApp number in the editor to enable this button.</p>
            )}
            <div className={`rounded-2xl border p-5 ${templateFrame.card}`}>
              <p className="text-sm opacity-80">
                This detail page inherits the site shell and is designed to stay simple, responsive, and easy to deploy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <section className={`min-h-[calc(100vh-160px)] flex items-center justify-center ${templateFrame.hero}`}>
      <div className="text-center px-4">
        <h1 className="text-3xl font-bold mb-3">Product not found</h1>
        <p className="opacity-80 mb-6">The requested product is not available in this template.</p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold bg-blue-600 text-white"
        >
          <FiArrowLeft />
          Go Back
        </button>
      </div>
    </section>
  );

  return (
    <TemplateShell style={selectedTemplateId === "classic-store" ? "classic" : selectedTemplateId === "minimal-boutique" ? "minimal" : selectedTemplateId === "bold-market" ? "bold" : "modern"} config={config as TemplateConfig}>
      {page}
    </TemplateShell>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
            <p className="mt-3 text-sm text-slate-600">Loading product...</p>
          </div>
        </main>
      }
    >
      <ProductDetailPageContent />
    </Suspense>
  );
}
