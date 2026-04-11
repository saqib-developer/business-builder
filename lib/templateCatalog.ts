export type TemplateId =
  | "modern-shop"
  | "classic-store"
  | "minimal-boutique"
  | "bold-market";

export interface TemplateProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  emoji: string;
}

export const TEMPLATE_PRODUCTS: Record<TemplateId, TemplateProduct[]> = {
  "modern-shop": [
    { id: "starter-kit", name: "Starter Kit", description: "A clean and practical starter bundle.", price: "$49", emoji: "📦" },
    { id: "growth-kit", name: "Growth Kit", description: "Built for growing businesses.", price: "$99", emoji: "🚀" },
    { id: "premium-kit", name: "Premium Kit", description: "Extended support and features.", price: "$149", emoji: "✨" },
    { id: "custom-plan", name: "Custom Plan", description: "Tailored to your exact needs.", price: "Custom", emoji: "🛠️" },
  ],
  "classic-store": [
    { id: "dark-starter", name: "Dark Starter", description: "Entry package with quick setup.", price: "$59", emoji: "🌙" },
    { id: "neon-growth", name: "Neon Growth", description: "Optimized for conversion and speed.", price: "$119", emoji: "⚡" },
    { id: "midnight-pro", name: "Midnight Pro", description: "Advanced support and optimization.", price: "$179", emoji: "🛰️" },
    { id: "custom-black", name: "Custom Black", description: "Custom implementation and rollout.", price: "Custom", emoji: "🖤" },
  ],
  "minimal-boutique": [
    { id: "happy-pack", name: "Happy Pack", description: "Bright and cheerful starter option.", price: "$39", emoji: "🌈" },
    { id: "color-boost", name: "Color Boost", description: "Most loved package for growing teams.", price: "$79", emoji: "🎉" },
    { id: "fun-pro", name: "Fun Pro", description: "Extended support with playful branding.", price: "$129", emoji: "🪩" },
    { id: "party-custom", name: "Party Custom", description: "Tailored package for special campaigns.", price: "Custom", emoji: "🎈" },
  ],
  "bold-market": [
    { id: "consulting-package", name: "Consulting Package", description: "Business discovery and advisory session.", price: "$99", emoji: "📊" },
    { id: "execution-package", name: "Execution Package", description: "Implementation and delivery support.", price: "$179", emoji: "🧩" },
    { id: "operations-package", name: "Operations Package", description: "Process optimization and reporting.", price: "$249", emoji: "📁" },
    { id: "enterprise-contract", name: "Enterprise Contract", description: "Tailored scope for enterprise teams.", price: "Custom", emoji: "🏢" },
  ],
};

export function getTemplateProducts(templateId?: string | null): TemplateProduct[] {
  const resolvedTemplateId = (templateId as TemplateId) || "modern-shop";
  return TEMPLATE_PRODUCTS[resolvedTemplateId] || TEMPLATE_PRODUCTS["modern-shop"];
}

export function buildWhatsAppLink(number: string | undefined, itemName: string): string {
  const normalized = (number || "").replace(/\D/g, "");
  if (!normalized) return "#";
  const text = encodeURIComponent(`Hi, I am interested in ${itemName}`);
  return `https://wa.me/${normalized}?text=${text}`;
}

export function createProductArtwork(label: string, primaryColor: string, secondaryColor: string): string {
  const safeLabel = label.slice(0, 24).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${primaryColor}"/>
          <stop offset="100%" stop-color="${secondaryColor}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" rx="48" fill="url(#bg)"/>
      <circle cx="1010" cy="170" r="120" fill="white" fill-opacity="0.15"/>
      <circle cx="190" cy="680" r="180" fill="white" fill-opacity="0.10"/>
      <text x="80" y="210" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="white">${safeLabel}</text>
      <text x="80" y="300" font-family="Arial, sans-serif" font-size="34" fill="white" fill-opacity="0.92">Product preview</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
