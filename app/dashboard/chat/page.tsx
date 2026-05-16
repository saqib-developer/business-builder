"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiMessageCircle,
  FiLoader,
  FiAlertCircle,
  FiArrowLeft,
  FiGlobe,
} from "react-icons/fi";
import { useAuth } from "@/lib/context/AuthContext";
import {
  getCustomDesignRequest,
  getConversationByUserIdAndType,
  CustomDesignRequest,
  Conversation,
} from "@/lib/firebase/firestoreService";
import ChatInterface from "@/components/chat/ChatInterface";
import Link from "next/link";

type ConversationType = "logo" | "wordpress" | "custom-code";

type OnboardingDataPartial = Record<string, unknown> | null;

interface ChatConfig {
  title: string;
  subtitle: string;
  recipientName: string;
  icon: React.ReactNode;
  requiredCondition: (onboardingData: OnboardingDataPartial) => boolean;
  fallbackMessage: string;
  fallbackAction: string;
  fallbackLink: string;
}

const chatConfigs: Record<ConversationType, ChatConfig> = {
  logo: {
    title: "Custom Logo Design",
    subtitle: "Chat with our design team about your logo",
    recipientName: "Design Team",
    icon: <FiMessageCircle className="w-5 h-5" />,
    requiredCondition: (data) => {
      const d = data as OnboardingDataPartial;
      const logo = (d && (d.logo as Record<string, unknown>)) || undefined;
      return (logo?.type as string) === "custom";
    },
    fallbackMessage:
      'You don\'t have an active custom design request. To chat with our design team, please select "Custom Design" during the logo setup step in onboarding.',
    fallbackAction: "Go to Logo Setup",
    fallbackLink: "/onboarding?step=3",
  },
  wordpress: {
    title: "WordPress Website Setup",
    subtitle: "Chat with our team about your WordPress website",
    recipientName: "Web Team",
    icon: <FiGlobe className="w-5 h-5" />,
    requiredCondition: (data) => {
      const d = data as OnboardingDataPartial;
      const website = (d && (d.website as Record<string, unknown>)) || undefined;
      return (website?.type as string) === "wordpress";
    },
    fallbackMessage:
      'You don\'t have an active WordPress setup request. To chat with our team, please select "WordPress" during the website setup step in onboarding.',
    fallbackAction: "Go to Website Setup",
    fallbackLink: "/onboarding?step=5",
  },
  "custom-code": {
    title: "Custom Website Development",
    subtitle: "Chat with our developers about your custom website",
    recipientName: "Dev Team",
    icon: <FiGlobe className="w-5 h-5" />,
    requiredCondition: (data) => {
      const d = data as OnboardingDataPartial;
      const website = (d && (d.website as Record<string, unknown>)) || undefined;
      return (website?.type as string) === "custom";
    },
    fallbackMessage:
      'You don\'t have an active custom development request. To chat with our team, please select "Custom Code" during the website setup step in onboarding.',
    fallbackAction: "Go to Website Setup",
    fallbackLink: "/onboarding?step=5",
  },
};

function UserChatPageContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customDesignRequest, setCustomDesignRequest] =
    useState<CustomDesignRequest | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [conversationType, setConversationType] =
    useState<ConversationType>("logo");
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Get conversation type from URL params, default to "logo"
    const typeParam = searchParams.get("type") as ConversationType;
    if (typeParam && ["logo", "wordpress", "custom-code"].includes(typeParam)) {
      setConversationType(typeParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/sign-in?redirect=/dashboard/chat");
      return;
    }

    loadChatData();
  }, [user, authLoading, router, conversationType]);

  const loadChatData = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get onboarding data to check access
      const saved = localStorage.getItem(`onboarding_${user.id}`);
      let onboardingData = null;
      if (saved) {
        onboardingData = JSON.parse(saved);
      }

      // Check if user has access to this conversation type
      const config = chatConfigs[conversationType];
      const userHasAccess = config.requiredCondition(onboardingData);
      setHasAccess(userHasAccess);

      if (!userHasAccess) {
        setIsLoading(false);
        return;
      }

      // For logo conversations, get custom design request
      if (conversationType === "logo") {
        const request = await getCustomDesignRequest(user.id);
        setCustomDesignRequest(request);
      }

      // Check if conversation exists for this type
      const conv = await getConversationByUserIdAndType(
        user.id,
        conversationType,
      );

      setConversation(conv);
    } catch (err: unknown) {
      console.error("Error loading chat data:", err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Failed to load chat");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-gray-200 shadow-sm">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadChatData}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const config = chatConfigs[conversationType];

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-gray-200 shadow-sm">
          <FiMessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Chat Available
          </h2>
          <p className="text-gray-600 mb-6">{config.fallbackMessage}</p>
          <div className="space-y-3">
            <Link
              href={config.fallbackLink}
              className="block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              {config.fallbackAction}
            </Link>
            <Link
              href="/dashboard"
              className="block px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex items-center gap-3">
              {config.icon}
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {config.title}
                </h1>
                <p className="text-sm text-gray-500">{config.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="h-[calc(100vh-180px)]">
          {conversation?.id ? (
            <ChatInterface
              conversationId={conversation.id}
              senderType="user"
              recipientName={config.recipientName}
              conversationDescription={config.subtitle}
              conversationType={conversationType}
              lazyInitContext={{
                userId: user.id,
                userEmail: user.email || "",
                userName:
                  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                  user.email ||
                  "User",
                conversationType,
                customDesignRequestId:
                  conversationType === "logo"
                    ? customDesignRequest?.id
                    : undefined,
              }}
              onConversationInitialized={(initialized) => setConversation(initialized)}
            />
          ) : (
            <ChatInterface
              senderType="user"
              recipientName={config.recipientName}
              conversationDescription={config.subtitle}
              conversationType={conversationType}
              lazyInitContext={{
                userId: user.id,
                userEmail: user.email || "",
                userName:
                  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                  user.email ||
                  "User",
                conversationType,
                customDesignRequestId:
                  conversationType === "logo"
                    ? customDesignRequest?.id
                    : undefined,
              }}
              onConversationInitialized={(initialized) => setConversation(initialized)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <FiLoader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading chat...</p>
          </div>
        </div>
      }
    >
      <UserChatPageContent />
    </Suspense>
  );
}
