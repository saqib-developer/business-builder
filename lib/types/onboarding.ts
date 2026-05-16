// ============= ONBOARDING TYPES =============

export interface OnboardingData {
  userId: string;
  businessName: string;
  logo: LogoSetup;
  socialMedia: SocialMediaSetup;
  website: WebsiteSetup;
  completedSteps: number[];
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogoSetup {
  type: "upload" | "ai-generated" | "custom" | null;
  url?: string;
  fileName?: string;
  aiPrompt?: string;
  convexStorageId?: string;
  customDesignRequestId?: string;
}

export interface SocialMediaSetup {
  tiktok: SocialPlatform;
  instagram: SocialPlatform;
  facebook: SocialPlatform;
  whatsapp: SocialPlatform;
}

export interface SocialPlatform {
  clicked: boolean;
  url?: string;
  handle?: string;
}

export interface WebsiteSetup {
  type: "template" | "wordpress" | "custom" | null;
  templateId?: string;
  config?: WebsiteConfig;
  customizations?: TemplateCustomizations;
}

export interface WebsiteConfig {
  templateId?: string;
  isPublished?: boolean;
  hosting?: unknown;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  content?: {
    [key: string]: unknown;
  };
}

export interface TemplateCustomizations {
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  texts: {
    [key: string]: string;
  };
  images: {
    [key: string]: string;
  };
}

export const ONBOARDING_STEPS = {
  INTRODUCTION: 1,
  BUSINESS_NAME: 2,
  LOGO_SETUP: 3,
  SOCIAL_MEDIA: 4,
  WEBSITE_BUILDER: 5,
} as const;

export const SOCIAL_PLATFORMS = [
  {
    name: "TikTok",
    id: "tiktok",
    signupUrl: "https://www.tiktok.com/signup",
    icon: "FaTiktok",
    color: "#000000",
  },
  {
    name: "Instagram",
    id: "instagram",
    signupUrl: "https://www.instagram.com/accounts/emailsignup/",
    icon: "FaInstagram",
    color: "#E4405F",
  },
  {
    name: "Facebook",
    id: "facebook",
    signupUrl: "https://www.facebook.com/pages/create",
    icon: "FaFacebook",
    color: "#1877F2",
  },
  {
    name: "WhatsApp Business",
    id: "whatsapp",
    signupUrl: "https://www.whatsapp.com/business",
    icon: "FaWhatsapp",
    color: "#25D366",
  },
] as const;

export const MOTIVATIONAL_QUOTES = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Don't wait for opportunity. Create it.",
    author: "Anonymous",
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Anonymous",
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Anonymous",
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Anonymous",
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Anonymous",
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Anonymous",
  },
  {
    text: "Dream bigger. Do bigger.",
    author: "Anonymous",
  },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: "Anonymous",
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
  },
];
