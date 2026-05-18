"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { FiCheckCircle, FiExternalLink, FiLoader, FiGlobe, FiTrash2 } from "react-icons/fi";
import { FiCopy } from "react-icons/fi";
import { firestore } from "@/lib/firebase";
import { OnboardingData } from "@/lib/types/onboarding";

interface DomainHostingSectionProps {
  userId: string;
  businessName?: string;
  onboardingData: Partial<OnboardingData> | null;
  onOnboardingDataUpdate: (next: Partial<OnboardingData>) => void;
}

type RoutingMethod = "free-subdomain" | "custom-domain";

interface HostingConfig {
  method?: RoutingMethod;
  freeSubdomain?: string;
  freeSubdomains?: string[];
  activeFreeSubdomain?: string;
  customDomain?: string;
}

function sanitizeSubdomain(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 40);
}

function sanitizeCustomDomain(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

export default function DomainHostingSection({
  userId,
  businessName,
  onboardingData,
  onOnboardingDataUpdate,
}: DomainHostingSectionProps) {
  const [subdomainInput, setSubdomainInput] = useState("");
  const [customDomainInput, setCustomDomainInput] = useState("");
  const [ownedFreeSubdomains, setOwnedFreeSubdomains] = useState<string[]>([]);
  const [ownedCustomDomain, setOwnedCustomDomain] = useState("");
  const [isSavingSubdomain, setIsSavingSubdomain] = useState(false);
  const [isSavingCustomDomain, setIsSavingCustomDomain] = useState(false);
  const [isDeletingDomain, setIsDeletingDomain] = useState<string | null>(null);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    // Check if running on localhost
    if (typeof window !== "undefined") {
      setIsLocalhost(
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      );
    }
  }, []);

  const sanitizedBusinessName = useMemo(
    () => sanitizeSubdomain(businessName || ""),
    [businessName],
  );

  const selectedRoutingMethod =
    ((onboardingData?.website?.config as Record<string, unknown> | undefined)?.hosting as Record<string, unknown> | undefined)?.method as RoutingMethod | undefined;

  const syncLocalHostingState = (hosting: HostingConfig) => {
    const legacy = hosting.freeSubdomain ? `${sanitizeSubdomain(hosting.freeSubdomain)}.businessbuilder.com` : "";
    const normalizedFree = Array.from(
      new Set(
        (hosting.freeSubdomains || [])
          .map((item) => sanitizeCustomDomain(item))
          .concat(legacy ? [legacy] : [])
          .filter(Boolean),
      ),
    );

    setOwnedFreeSubdomains(normalizedFree);
    setOwnedCustomDomain(sanitizeCustomDomain(hosting.customDomain || ""));
  };

  useEffect(() => {
    if (!userId) {
      return;
    }

    const loadInitialData = async () => {
      try {
        const userRef = doc(firestore, "users", userId);
        const userDoc = await getDoc(userRef);
        const remoteOnboarding = userDoc.exists()
          ? (userDoc.data()?.onboarding as Partial<OnboardingData> | undefined)
          : undefined;

        const remoteHosting =
          (remoteOnboarding?.website?.config?.hosting as HostingConfig | undefined) ||
          (onboardingData?.website?.config?.hosting as HostingConfig | undefined) ||
          {};

        const remoteBusinessName = sanitizeSubdomain(
          remoteOnboarding?.businessName ||
            onboardingData?.businessName ||
            businessName ||
            "",
        );

        syncLocalHostingState(remoteHosting);
        setSubdomainInput(remoteBusinessName || sanitizedBusinessName);
        setCustomDomainInput(sanitizeCustomDomain(remoteHosting.customDomain || ""));
      } catch (loadError) {
        const fallbackHosting =
          (onboardingData?.website?.config?.hosting as HostingConfig | undefined) ||
          {};
        syncLocalHostingState(fallbackHosting);
        setSubdomainInput(sanitizedBusinessName);
        setCustomDomainInput(sanitizeCustomDomain(fallbackHosting.customDomain || ""));
      }
    };

    loadInitialData();
  }, [userId, onboardingData, sanitizedBusinessName, businessName]);

  const isDomainTakenGlobally = async (candidateDomain: string): Promise<boolean> => {
    const normalizedCandidate = sanitizeCustomDomain(candidateDomain);
    if (!normalizedCandidate) {
      console.warn("isDomainTakenGlobally: normalized candidate is empty");
      return false;
    }

    try {
      console.log("isDomainTakenGlobally: checking", normalizedCandidate);
      const usersRef = collection(firestore, "users");
      const snapshot = await getDocs(usersRef);
      
      console.log("isDomainTakenGlobally: fetched", snapshot.docs.length, "users");

      for (const docSnap of snapshot.docs) {
        if (docSnap.id === userId) {
          continue;
        }

        const remoteHosting =
          (docSnap.data()?.onboarding?.website?.config?.hosting as HostingConfig | undefined) ||
          {};

        const legacyFree = remoteHosting.freeSubdomain
          ? `${sanitizeSubdomain(remoteHosting.freeSubdomain)}.businessbuilder.com`
          : "";

        const remoteFree = new Set(
          (remoteHosting.freeSubdomains || [])
            .map((value) => sanitizeCustomDomain(value))
            .concat(legacyFree ? [legacyFree] : [])
            .filter(Boolean),
        );

        const remoteCustom = sanitizeCustomDomain(remoteHosting.customDomain || "");

        if (remoteFree.has(normalizedCandidate) || remoteCustom === normalizedCandidate) {
          console.log("isDomainTakenGlobally: domain taken by user", docSnap.id);
          return true;
        }
      }

      console.log("isDomainTakenGlobally: domain is available");
      return false;
    } catch (error) {
      console.error("isDomainTakenGlobally: error checking domain availability:", {
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorCode: (error as any)?.code,
      });
      throw error;
    }
  };

  const persistOnboarding = async (next: Partial<OnboardingData>) => {
    try {
      console.log("persistOnboarding called with userId:", userId);
      console.log("nextOnboarding structure:", {
        hasWebsite: !!next.website,
        hasConfig: !!next.website?.config,
        hasHosting: !!next.website?.config?.hosting,
      });

      const userRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userRef);

      console.log("User doc exists:", userDoc.exists());

      if (userDoc.exists()) {
        console.log("Updating existing user document");
        // Clean undefined values before updating
        const cleanData = JSON.parse(JSON.stringify(next));
        await updateDoc(userRef, { onboarding: cleanData });
      } else {
        console.log("Creating new user document with merge");
        // Clean undefined values before creating
        const cleanData = JSON.parse(JSON.stringify(next));
        await setDoc(userRef, { onboarding: cleanData }, { merge: true });
      }
      
      console.log("Successfully persisted onboarding to Firestore");
    } catch (error) {
      console.error("Error persisting onboarding to Firestore:", {
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorCode: (error as any)?.code,
      });
      throw error;
    }
  };

  const handleSaveSubdomain = async () => {
    if (!userId) return;
    
    if (!onboardingData) {
      setError("Onboarding data not loaded. Please refresh the page.");
      return;
    }

    setError(null);
    setSuccess(null);

    const cleanedPrefix = sanitizeSubdomain(subdomainInput);
    if (!cleanedPrefix) {
      setError("Subdomain cannot be empty. Use letters and numbers only.");
      return;
    }

    const fullSubdomain = `${cleanedPrefix}.businessbuilder.com`;
    if (ownedFreeSubdomains.includes(fullSubdomain)) {
      setError("You already claimed this free subdomain.");
      return;
    }

    setIsSavingSubdomain(true);
    try {
      console.log("Checking if domain is taken globally:", fullSubdomain);
      const conflict = await isDomainTakenGlobally(fullSubdomain);
      if (conflict) {
        setError(
          "This subdomain is already claimed. Please choose a unique subdomain.",
        );
        return;
      }

      const nextFreeSubdomains = [...ownedFreeSubdomains, fullSubdomain];

      const existingHosting =
        (onboardingData?.website?.config?.hosting as HostingConfig | undefined) ||
        {};

      // Create a clean copy to preserve all onboarding data
      const nextOnboarding: Partial<OnboardingData> = {
        ...onboardingData,
        website: {
          type: onboardingData?.website?.type ?? null,
          templateId: onboardingData?.website?.templateId,
          customizations: onboardingData?.website?.customizations,
          config: {
            ...(onboardingData?.website?.config || {}),
            hosting: {
              ...existingHosting,
              method: "free-subdomain",
              freeSubdomains: nextFreeSubdomains,
              activeFreeSubdomain: fullSubdomain,
            },
          },
        },
      };

      console.log("Saving subdomain to Firestore:", fullSubdomain, nextOnboarding);
      await persistOnboarding(nextOnboarding);
      localStorage.setItem(`onboarding_${userId}`, JSON.stringify(nextOnboarding));
      onOnboardingDataUpdate(nextOnboarding);
      setOwnedFreeSubdomains(nextFreeSubdomains);
      setSubdomainInput(cleanedPrefix);
      setSuccess("Free subdomain added successfully.");
    } catch (saveError) {
      console.error("Error saving subdomain:", saveError);
      const errorMsg = saveError instanceof Error ? saveError.message : "Unknown error";
      setError(`Failed to save subdomain: ${errorMsg}`);
    } finally {
      setIsSavingSubdomain(false);
    }
  };

  const handleSaveCustomDomain = async () => {
    if (!userId) return;

    setError(null);
    setSuccess(null);

    const cleanedDomain = sanitizeCustomDomain(customDomainInput);
    if (!cleanedDomain || !cleanedDomain.includes(".")) {
      setError("Enter a valid domain like mybusiness.com");
      return;
    }

    if (ownedCustomDomain && ownedCustomDomain !== cleanedDomain) {
      const confirmed = window.confirm(
        `You already have ${ownedCustomDomain} connected. Saving ${cleanedDomain} will replace it. Continue?`,
      );
      if (!confirmed) {
        return;
      }
    }

    setIsSavingCustomDomain(true);
    try {
      const conflict = await isDomainTakenGlobally(cleanedDomain);
      if (conflict) {
        setError("This custom domain is already registered. Please use a different domain.");
        return;
      }

      // Step 1: Add domain to Vercel project
      const vercelResponse = await fetch("/api/domains/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: cleanedDomain }),
      });

      const vercelData = (await vercelResponse.json()) as Record<string, unknown>;

      if (!vercelResponse.ok) {
        const errorMsg = (vercelData?.error as string) || "Failed to add domain to Vercel.";
        setError(errorMsg);
        return;
      }

      // Step 2: Save to Firestore and localStorage
      const existingHosting =
        (onboardingData?.website?.config?.hosting as HostingConfig | undefined) ||
        {};

      const nextOnboarding: Partial<OnboardingData> = {
        ...onboardingData,
        website: {
          type: onboardingData?.website?.type ?? null,
          templateId: onboardingData?.website?.templateId,
          customizations: onboardingData?.website?.customizations,
          config: {
            ...(onboardingData?.website?.config || {}),
            hosting: {
              ...existingHosting,
              method: "custom-domain",
              customDomain: cleanedDomain,
            },
          },
        },
      };

      await persistOnboarding(nextOnboarding);
      localStorage.setItem(`onboarding_${userId}`, JSON.stringify(nextOnboarding));
      onOnboardingDataUpdate(nextOnboarding);
      setOwnedCustomDomain(cleanedDomain);
      setCustomDomainInput(cleanedDomain);
      setSuccess("Domain added successfully! Follow the DNS instructions above to connect it.");
    } catch (saveError) {
      setError("Failed to save custom domain. Please try again.");
    } finally {
      setIsSavingCustomDomain(false);
    }
  };

  const handleDeleteFreeSubdomain = async (domain: string) => {
    if (!userId) return;

    setError(null);
    setSuccess(null);
    setIsDeletingDomain(domain);

    try {
      const nextFreeSubdomains = ownedFreeSubdomains.filter((item) => item !== domain);
      const existingHosting =
        (onboardingData?.website?.config?.hosting as HostingConfig | undefined) ||
        {};

      const nextMethod =
        existingHosting.method === "free-subdomain" && nextFreeSubdomains.length === 0
          ? (ownedCustomDomain ? "custom-domain" : undefined)
          : existingHosting.method;

      const nextOnboarding: Partial<OnboardingData> = {
        ...onboardingData,
        website: {
          type: onboardingData?.website?.type ?? null,
          templateId: onboardingData?.website?.templateId,
          customizations: onboardingData?.website?.customizations,
          config: {
            ...(onboardingData?.website?.config || {}),
            hosting: {
              ...existingHosting,
              method: nextMethod,
              freeSubdomains: nextFreeSubdomains,
              activeFreeSubdomain:
                existingHosting.activeFreeSubdomain === domain
                  ? nextFreeSubdomains[0] || ""
                  : existingHosting.activeFreeSubdomain,
            },
          },
        },
      };

      await persistOnboarding(nextOnboarding);
      localStorage.setItem(`onboarding_${userId}`, JSON.stringify(nextOnboarding));
      onOnboardingDataUpdate(nextOnboarding);
      setOwnedFreeSubdomains(nextFreeSubdomains);
      setSuccess("Subdomain disconnected.");
    } catch (disconnectError) {
      setError("Failed to disconnect subdomain.");
    } finally {
      setIsDeletingDomain(null);
    }
  };

  const handleDeleteCustomDomain = async () => {
    if (!userId || !ownedCustomDomain) return;

    setError(null);
    setSuccess(null);
    setIsDeletingDomain(ownedCustomDomain);

    try {
      const existingHosting =
        (onboardingData?.website?.config?.hosting as HostingConfig | undefined) ||
        {};

      const nextMethod =
        existingHosting.method === "custom-domain"
          ? (ownedFreeSubdomains.length > 0 ? "free-subdomain" : undefined)
          : existingHosting.method;

      const nextOnboarding: Partial<OnboardingData> = {
        ...onboardingData,
        website: {
          type: onboardingData?.website?.type ?? null,
          templateId: onboardingData?.website?.templateId,
          customizations: onboardingData?.website?.customizations,
          config: {
            ...(onboardingData?.website?.config || {}),
            hosting: {
              ...existingHosting,
              method: nextMethod,
              customDomain: "",
            },
          },
        },
      };

      await persistOnboarding(nextOnboarding);
      localStorage.setItem(`onboarding_${userId}`, JSON.stringify(nextOnboarding));
      onOnboardingDataUpdate(nextOnboarding);
      setOwnedCustomDomain("");
      setCustomDomainInput("");
      setSuccess("Custom domain disconnected.");
    } catch (disconnectError) {
      setError("Failed to disconnect custom domain.");
    } finally {
      setIsDeletingDomain(null);
    }
  };

  const domainSearchKeyword = sanitizeSubdomain(
    subdomainInput || sanitizedBusinessName || businessName || "",
  );

  const goDaddyUrl = `https://www.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(domainSearchKeyword || "mybusiness")}.com`;
  const namecheapUrl = `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domainSearchKeyword || "mybusiness")}.com`;

  const normalizedCustomDomainPreview = sanitizeCustomDomain(customDomainInput);
  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(label);
      window.setTimeout(() => setCopiedValue((current) => (current === label ? null : current)), 1200);
    } catch {
      setError("Copy failed. Please copy the value manually.");
    }
  };

  const activeDomains = [
    ...ownedFreeSubdomains.map((domain) => ({ type: "free" as const, domain })),
    ...(ownedCustomDomain ? [{ type: "custom" as const, domain: ownedCustomDomain }] : []),
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_50px_-38px_rgba(15,23,42,0.75)] sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Domain & Hosting</h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage your free subdomains and one custom domain. One routing method is active at a time.
          </p>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {selectedRoutingMethod === "custom-domain"
            ? "Custom Domain Active"
            : selectedRoutingMethod === "free-subdomain"
              ? "Free Subdomain Active"
              : "No Active Route"}
        </span>
      </div>

      {(error || success) && (
        <div
          className={`mb-6 rounded-xl p-4 text-sm ${
            error
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Free Subdomain</h3>
          <p className="mt-1 text-sm text-slate-600">
            Use a free Business Builder URL.
          </p>

          <label className="mt-4 block text-sm font-medium text-slate-700">
            Your free URL
          </label>
          <div className="mt-2 flex items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
            <input
              value={subdomainInput}
              onChange={(e) => setSubdomainInput(sanitizeSubdomain(e.target.value))}
              placeholder="yourbrand"
              className="w-full bg-white px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none"
            />
            <span className="border-l border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
              .businessbuilder.com
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Auto-suggested from your business name in Firestore.
          </p>

          {isLocalhost && subdomainInput && (
            <div className="mt-4 rounded-xl border-2 border-amber-300 bg-amber-50 p-4">
              <p className="mb-2 text-xs font-semibold text-amber-900">
                Your website will work on:
              </p>
              <div className="space-y-2 text-sm text-amber-900">
                <p>
                  <span className="font-medium">Development:</span>{" "}
                  <span className="font-mono">http://{sanitizeSubdomain(subdomainInput)}.localhost:3000</span>
                </p>
                <p>
                  <span className="font-medium">Production:</span>{" "}
                  <span className="font-mono">{sanitizeSubdomain(subdomainInput)}.businessbuilder.com</span>
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSaveSubdomain}
            disabled={isSavingSubdomain || isSavingCustomDomain || Boolean(isDeletingDomain)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {isSavingSubdomain && <FiLoader className="h-4 w-4 animate-spin" />}
            Add Free Subdomain
          </button>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Connect Custom Domain</h3>
          <p className="mt-1 text-sm text-slate-600">
            Use your own premium .com domain.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={goDaddyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Buy on GoDaddy
              <FiExternalLink className="h-4 w-4" />
            </a>
            <a
              href={namecheapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Buy on Namecheap
              <FiExternalLink className="h-4 w-4" />
            </a>
          </div>

          <label className="mt-4 block text-sm font-medium text-slate-700">
            Enter your custom domain
          </label>
          <input
            value={customDomainInput}
            onChange={(e) => setCustomDomainInput(e.target.value)}
            placeholder="mybusiness.com"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500"
          />

          {normalizedCustomDomainPreview && (
            <div className="mt-4 rounded-xl border-2 border-blue-300 bg-blue-50 p-4">
              <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-900">
                <FiGlobe className="h-4 w-4" />
                DNS Setup Instructions for {normalizedCustomDomainPreview}
              </p>
              <div className="space-y-3 text-sm text-blue-900">
                <p>
                  Add these exact DNS records at your domain provider. Keep both records active so the root domain and
                  www version resolve correctly.
                </p>
                <div className="overflow-hidden rounded-xl border border-blue-200 bg-white">
                  <div className="grid grid-cols-12 gap-2 border-b border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
                    <div className="col-span-3">Type</div>
                    <div className="col-span-3">Name</div>
                    <div className="col-span-5">Value</div>
                    <div className="col-span-1 text-right">Copy</div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-2 border-b border-blue-100 px-4 py-3">
                    <div className="col-span-3 font-semibold text-slate-900">A</div>
                    <div className="col-span-3 font-mono text-slate-700">@</div>
                    <div className="col-span-5 flex items-center gap-2 font-mono text-slate-900">
                      <span>216.198.79.1</span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => copyToClipboard("216.198.79.1", "a-record")}
                        className="inline-flex items-center justify-center rounded-md border border-blue-200 p-2 text-blue-700 hover:bg-blue-50"
                        aria-label="Copy A record value"
                      >
                        <FiCopy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 items-center gap-2 px-4 py-3">
                    <div className="col-span-3 font-semibold text-slate-900">CNAME</div>
                    <div className="col-span-3 font-mono text-slate-700">www</div>
                    <div className="col-span-5 flex items-center gap-2 font-mono text-slate-900">
                      <span>cname.vercel-dns.com</span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => copyToClipboard("cname.vercel-dns.com", "cname-record")}
                        className="inline-flex items-center justify-center rounded-md border border-blue-200 p-2 text-blue-700 hover:bg-blue-50"
                        aria-label="Copy CNAME record value"
                      >
                        <FiCopy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                {copiedValue && (
                  <p className="text-xs font-medium text-emerald-700">
                    Copied successfully.
                  </p>
                )}
                <p className="rounded-lg border border-blue-200 bg-white/70 p-3 text-xs leading-5 text-blue-800">
                  After saving DNS, wait for propagation and then verify the domain in Vercel.
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSaveCustomDomain}
            disabled={isSavingCustomDomain || isSavingSubdomain || Boolean(isDeletingDomain)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSavingCustomDomain && <FiLoader className="h-4 w-4 animate-spin" />}
            Save Custom Domain
          </button>
        </article>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="inline-flex items-center gap-2 font-medium">
          <FiCheckCircle className="h-4 w-4 text-emerald-600" />
          Global uniqueness and routing exclusivity are enforced.
        </p>
        <p className="mt-1 text-slate-600">
          Free subdomains can be claimed in multiples, but only one routing method is active at once.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">Your Active Domains</h3>
        <p className="mt-1 text-sm text-slate-600">
          Remove domains you no longer need to release them back into the global pool.
        </p>

        {activeDomains.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
            You have not claimed any domains yet.
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {activeDomains.map((item) => (
              <li
                key={`${item.type}-${item.domain}`}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.domain}</p>
                    <p className="text-xs text-slate-500">
                      {item.type === "free" ? "Free subdomain" : "Custom domain"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      item.type === "free"
                        ? handleDeleteFreeSubdomain(item.domain)
                        : handleDeleteCustomDomain()
                    }
                    disabled={Boolean(isDeletingDomain) || isSavingSubdomain || isSavingCustomDomain}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    {isDeletingDomain === item.domain ? (
                      <FiLoader className="h-4 w-4 animate-spin" />
                    ) : (
                      <FiTrash2 className="h-4 w-4" />
                    )}
                    Disconnect
                  </button>
                </div>
                
                {isLocalhost && item.type === "free" && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
                    <p className="mb-1 font-semibold">Working links:</p>
                    <p>
                      <span className="font-medium">Development:</span>{" "}
                      <span className="font-mono">http://{sanitizeCustomDomain(item.domain.replace(".businessbuilder.com", ""))}.localhost:3000</span>
                    </p>
                    <p>
                      <span className="font-medium">Production:</span>{" "}
                      <span className="font-mono">{item.domain}</span>
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
