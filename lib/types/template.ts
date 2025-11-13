// ============= TEMPLATE TYPES =============

export interface BrandSettings {
  businessName: string;
  tagline: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  selectedTemplateId: string | null;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  style: "modern" | "classic" | "minimal" | "bold";
  features: string[];
}

export const TEMPLATES: Template[] = [
  {
    id: "modern-shop",
    name: "Modern Shop",
    description:
      "Clean and contemporary design with smooth animations and modern aesthetics",
    thumbnail: "/templates/modern-preview.jpg",
    style: "modern",
    features: [
      "Animated sections",
      "Grid layout",
      "Large images",
      "Modern typography",
    ],
  },
  {
    id: "classic-store",
    name: "Classic Store",
    description:
      "Traditional e-commerce layout with familiar navigation and proven design patterns",
    thumbnail: "/templates/classic-preview.jpg",
    style: "classic",
    features: [
      "Traditional layout",
      "Easy navigation",
      "Product categories",
      "Trust badges",
    ],
  },
  {
    id: "minimal-boutique",
    name: "Minimal Boutique",
    description:
      "Elegant and sophisticated with plenty of white space and refined details",
    thumbnail: "/templates/minimal-preview.jpg",
    style: "minimal",
    features: [
      "White space",
      "Typography focus",
      "Subtle animations",
      "Clean design",
    ],
  },
  {
    id: "bold-market",
    name: "Bold Market",
    description:
      "Eye-catching design with vibrant colors and strong visual impact",
    thumbnail: "/templates/bold-preview.jpg",
    style: "bold",
    features: [
      "Vibrant colors",
      "Large headings",
      "Dynamic layout",
      "High contrast",
    ],
  },
];
