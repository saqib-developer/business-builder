import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export interface StorefrontResolution {
  userId: string;
  businessName: string;
  logoUrl: string;
  isPublished: boolean;
  templateId: string;
  websiteConfig: Record<string, unknown>;
}

function sanitizeSubdomainPrefix(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 40);
}

function getConfiguredRootDomain(): string {
  return normalizeDomain(process.env.NEXT_PUBLIC_ROOT_DOMAIN || "businessbuilders.tech");
}

export function normalizeDomain(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/:\d+$/, "")
    .replace(/\/.*$/, "");
}

function extractSubdomainPrefix(host: string): string {
  const normalized = normalizeDomain(host);
  if (!normalized) {
    return "";
  }

  const configuredRoot = getConfiguredRootDomain();
  if (configuredRoot && normalized === configuredRoot) {
    return "";
  }

  if (configuredRoot && normalized.endsWith(`.${configuredRoot}`)) {
    const withoutRoot = normalized.slice(0, -(configuredRoot.length + 1));
    const firstLabel = withoutRoot.split(".")[0] || "";
    return sanitizeSubdomainPrefix(firstLabel);
  }

  if (normalized.endsWith(".businessbuilder.com")) {
    const withoutRoot = normalized.replace(/\.businessbuilder\.com$/, "");
    return sanitizeSubdomainPrefix(withoutRoot.split(".")[0] || "");
  }

  if (normalized.endsWith(".localhost")) {
    const withoutRoot = normalized.replace(/\.localhost$/, "");
    return sanitizeSubdomainPrefix(withoutRoot.split(".")[0] || "");
  }

  if (normalized.endsWith(".lvh.me")) {
    const withoutRoot = normalized.replace(/\.lvh\.me$/, "");
    return sanitizeSubdomainPrefix(withoutRoot.split(".")[0] || "");
  }

  if (normalized.endsWith(".vercel.app")) {
    const labels = normalized.split(".");
    // Root Vercel domain: project.vercel.app -> no storefront prefix.
    if (labels.length <= 3) {
      return "";
    }

    // Subdomain Vercel domain: store.project.vercel.app -> "store".
    return sanitizeSubdomainPrefix(labels[0] || "");
  }

  return sanitizeSubdomainPrefix(normalized.split(".")[0] || "");
}

export function isLikelyStorefrontHost(hostname: string): boolean {
  const host = normalizeDomain(hostname);
  if (!host) {
    return false;
  }

  const configuredRoot = getConfiguredRootDomain();
  if (configuredRoot && host === configuredRoot) {
    return false;
  }

  if (configuredRoot && host === `www.${configuredRoot}`) {
    return false;
  }

  if (configuredRoot && host.endsWith(`.${configuredRoot}`)) {
    return true;
  }

  const appRoot = "businessbuilder.com";
  if (host === "localhost" || host === "127.0.0.1") {
    return false;
  }

  if (host === appRoot || host === `www.${appRoot}`) {
    return false;
  }

  if (host.endsWith(".localhost") || host.endsWith(".lvh.me") || host.endsWith(".vercel.app")) {
    return true;
  }

  if (host.endsWith(`.${appRoot}`)) {
    return true;
  }

  return true;
}

function mapUserDocToStorefront(userId: string, rawData: unknown): StorefrontResolution {
  const rd = rawData as Record<string, unknown>;
  const onboarding = (rd.onboarding ?? {}) as Record<string, unknown>;
  const website = (onboarding.website ?? {}) as Record<string, unknown>;
  const websiteConfig = (website.config ?? {}) as Record<string, unknown>;

  return {
    userId,
    businessName: (onboarding.businessName as string) || "Your Business",
    logoUrl:
      ((onboarding.logo as Record<string, unknown>)?.url as string) ||
      ((websiteConfig.content as Record<string, unknown>)?.brandLogo as string) ||
      "",
    isPublished: Boolean(websiteConfig.isPublished as boolean),
    templateId:
      (website.templateId as string) || (websiteConfig.templateId as string) ||
      "modern-shop",
    websiteConfig,
  };
}

export function getPrimaryLiveDomain(hosting: unknown): string {
  if (!hosting) {
    return "";
  }

  const h = hosting as Record<string, unknown>;
  if ((h.method as string) === "custom-domain" && (h.customDomain as string)) {
    return normalizeDomain(h.customDomain as string);
  }

  const free = (h.activeFreeSubdomain as string) ||
    (h.freeSubdomains as string[])?.[0] ||
    "";
  if (free) {
    return normalizeDomain(free);
  }

  if (h.freeSubdomain as string) {
    return `${sanitizeSubdomainPrefix(h.freeSubdomain as string)}.businessbuilder.com`;
  }

  return "";
}

export async function resolveStorefrontByDomain(domain: string): Promise<StorefrontResolution | null> {
  const normalizedDomain = normalizeDomain(domain);
  if (!normalizedDomain) {
    return null;
  }

  const usersRef = collection(firestore, "users");
  const subdomainPrefix = extractSubdomainPrefix(normalizedDomain);
  const canonicalFreeDomain = subdomainPrefix ? `${subdomainPrefix}.businessbuilder.com` : "";

  const exactCustomDomainQuery = query(
    usersRef,
    where("onboarding.website.config.hosting.customDomain", "==", normalizedDomain),
    limit(1),
  );
  const exactCustomDomainSnapshot = await getDocs(exactCustomDomainQuery);
  if (!exactCustomDomainSnapshot.empty) {
    const docSnap = exactCustomDomainSnapshot.docs[0];
    return mapUserDocToStorefront(docSnap.id, docSnap.data());
  }

  const exactFreeSubdomainQuery = query(
    usersRef,
    where("onboarding.website.config.hosting.freeSubdomains", "array-contains", normalizedDomain),
    limit(1),
  );
  const exactFreeSubdomainSnapshot = await getDocs(exactFreeSubdomainQuery);
  if (!exactFreeSubdomainSnapshot.empty) {
    const docSnap = exactFreeSubdomainSnapshot.docs[0];
    return mapUserDocToStorefront(docSnap.id, docSnap.data());
  }

  if (canonicalFreeDomain) {
    const canonicalFreeSubdomainQuery = query(
      usersRef,
      where("onboarding.website.config.hosting.freeSubdomains", "array-contains", canonicalFreeDomain),
      limit(1),
    );
    const canonicalFreeSubdomainSnapshot = await getDocs(canonicalFreeSubdomainQuery);
    if (!canonicalFreeSubdomainSnapshot.empty) {
      const docSnap = canonicalFreeSubdomainSnapshot.docs[0];
      return mapUserDocToStorefront(docSnap.id, docSnap.data());
    }
  }

  if (subdomainPrefix) {
    const legacyQuery = query(
      usersRef,
      where("onboarding.website.config.hosting.freeSubdomain", "==", subdomainPrefix),
      limit(1),
    );
    const legacySnapshot = await getDocs(legacyQuery);
    if (!legacySnapshot.empty) {
      const docSnap = legacySnapshot.docs[0];
      return mapUserDocToStorefront(docSnap.id, docSnap.data());
    }

    const customCanonicalQuery = query(
      usersRef,
      where("onboarding.website.config.hosting.customDomain", "==", canonicalFreeDomain),
      limit(1),
    );
    const customCanonicalSnapshot = await getDocs(customCanonicalQuery);
    if (!customCanonicalSnapshot.empty) {
      const docSnap = customCanonicalSnapshot.docs[0];
      return mapUserDocToStorefront(docSnap.id, docSnap.data());
    }
  }

  const legacyPrefix = normalizedDomain.endsWith(".businessbuilder.com")
    ? normalizedDomain.replace(/\.businessbuilder\.com$/, "")
    : "";
  if (!legacyPrefix) {
    return null;
  }

  const fallbackLegacyQuery = query(
    usersRef,
    where("onboarding.website.config.hosting.freeSubdomain", "==", legacyPrefix),
    limit(1),
  );
  const fallbackLegacySnapshot = await getDocs(fallbackLegacyQuery);
  if (fallbackLegacySnapshot.empty) {
    return null;
  }

  const docSnap = fallbackLegacySnapshot.docs[0];
  return mapUserDocToStorefront(docSnap.id, docSnap.data());
}