"use client";

import { useEffect, useState } from "react";
import { FiAlertCircle, FiLoader } from "react-icons/fi";
import ChatInterface from "@/components/chat/ChatInterface";
import {
  Conversation,
  getConversationByUserIdAndType,
} from "@/lib/firebase/firestoreService";

type WebsiteConversationType = "wordpress" | "custom-code";

interface WebsiteSupportChatPanelProps {
  conversationType: WebsiteConversationType;
  userId: string;
  userEmail: string;
  userDisplayName: string;
  recipientName: string;
  panelTitle: string;
  panelDescription: string;
}

export default function WebsiteSupportChatPanel({
  conversationType,
  userId,
  userEmail,
  userDisplayName,
  recipientName,
  panelTitle,
  panelDescription,
}: WebsiteSupportChatPanelProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const setupConversation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const existingConversation = await getConversationByUserIdAndType(
          userId,
          conversationType,
        );

        if (!isCancelled) {
          setConversation(existingConversation);
        }
      } catch (setupError) {
        if (!isCancelled) {
          setError(
            setupError instanceof Error
              ? setupError.message
              : "Failed to load team chat.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    setupConversation();

    return () => {
      isCancelled = true;
    };
  }, [conversationType, userDisplayName, userEmail, userId]);

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <h3 className="text-base font-semibold text-slate-900">{panelTitle}</h3>
      <p className="mt-1 text-sm text-slate-600">{panelDescription}</p>

      <div className="mt-4 h-[560px] overflow-hidden rounded-xl border border-slate-200 bg-white">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <FiLoader className="mx-auto h-10 w-10 animate-spin text-blue-600" />
              <p className="mt-3 text-sm text-slate-600">Preparing your team chat...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center p-6">
            <div className="max-w-sm rounded-xl border border-red-200 bg-red-50 p-4 text-center">
              <FiAlertCircle className="mx-auto h-8 w-8 text-red-600" />
              <p className="mt-2 text-sm font-medium text-red-700">{error}</p>
              <p className="mt-1 text-xs text-red-600">
                Refresh the page to retry this conversation setup.
              </p>
            </div>
          </div>
        ) : (
          <ChatInterface
            conversationId={conversation?.id}
            senderType="user"
            recipientName={recipientName}
            conversationDescription={panelDescription}
            conversationType={conversationType}
            lazyInitContext={{
              userId,
              userEmail,
              userName: userDisplayName.trim() || userEmail || "User",
              conversationType,
            }}
            onConversationInitialized={(initialized) => setConversation(initialized)}
          />
        )}
      </div>
    </div>
  );
}
