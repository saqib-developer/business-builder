"use client";

import { useState, useEffect, useRef } from "react";
import { FiSend, FiImage, FiLoader, FiX, FiAlertCircle, FiCheck, FiDownload } from "react-icons/fi";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/lib/context/AuthContext";
import { useConvexUpload } from "@/hooks/useConvexUpload";
import {
  Conversation,
  initializeConversationIfNeeded,
  subscribeToMessages,
  sendMessage,
  markMessagesAsRead,
  ChatMessage,
  saveLogoData,
} from "@/lib/firebase/firestoreService";
import { firestore } from "@/lib/firebase";
import toast from "react-hot-toast";

interface ChatInterfaceProps {
  conversationId?: string;
  senderType: "user" | "admin";
  recipientName?: string;
  conversationDescription?: string;
  conversationType?: "logo" | "wordpress" | "custom-code";
  lazyInitContext?: {
    userId: string;
    userEmail: string;
    userName: string;
    conversationType: "logo" | "wordpress" | "custom-code";
    customDesignRequestId?: string;
  };
  onConversationInitialized?: (conversation: Conversation) => void;
}

export default function ChatInterface({
  conversationId,
  senderType,
  recipientName = "Support Team",
  conversationDescription = "Discuss your requirements with our support team",
  conversationType,
  lazyInitContext,
  onConversationInitialized,
}: ChatInterfaceProps) {
  const { user } = useAuth();
  const {
    uploadFile,
    isUploading,
    uploadProgress,
    error: uploadError,
  } = useConvexUpload();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLogoImage, setSelectedLogoImage] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(conversationId || null);
  const [isInitializingConversation, setIsInitializingConversation] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setActiveConversationId(conversationId || null);
  }, [conversationId]);

  // Subscribe to messages
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    const unsubscribe = subscribeToMessages(activeConversationId, (newMessages) => {
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [activeConversationId]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (activeConversationId && user?.id) {
      markMessagesAsRead(activeConversationId, user.id).catch(console.error);
    }
  }, [activeConversationId, user?.id, messages]);

  // Restore selected custom logo so sidebar reflects active choice across reloads.
  useEffect(() => {
    if (!user?.id || senderType !== "user" || conversationType !== "logo") {
      return;
    }

    try {
      const saved = localStorage.getItem(`onboarding_${user.id}`);
      if (!saved) return;

      const onboardingData = JSON.parse(saved);
      const activeUrl = onboardingData?.logo?.type === "custom" ? onboardingData?.logo?.url : null;
      if (activeUrl) {
        setSelectedLogoImage(activeUrl);
      }
    } catch (loadError) {
      console.error("Error restoring selected custom logo:", loadError);
    }
  }, [user?.id, senderType, conversationType]);

  // Scroll to bottom on new messages - only scroll the chat container, not the whole page
  useEffect(() => {
    if (messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 0);
    }
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedImage) || !user?.id) return;

    setIsSending(true);
    setError(null);

    try {
      let workingConversationId = activeConversationId;

      if (!workingConversationId) {
        if (senderType !== "user" || !lazyInitContext) {
          setError("Conversation is not ready yet.");
          setIsSending(false);
          return;
        }

        setIsInitializingConversation(true);
        const initializedConversation = await initializeConversationIfNeeded({
          userId: lazyInitContext.userId,
          userEmail: lazyInitContext.userEmail,
          userName: lazyInitContext.userName,
          conversationType: lazyInitContext.conversationType,
          customDesignRequestId: lazyInitContext.customDesignRequestId,
        });
        workingConversationId = initializedConversation.id || null;

        if (!workingConversationId) {
          throw new Error("Unable to create conversation.");
        }

        setActiveConversationId(workingConversationId);
        if (onConversationInitialized) {
          onConversationInitialized(initializedConversation);
        }
      }

      let imageUrl: string | undefined;
      let convexStorageId: string | undefined;

      // Upload image if selected
      if (selectedImage) {
        try {
          const uploadResult = await uploadFile(
            selectedImage,
            user.id,
            "chat-image",
          );
          imageUrl = uploadResult.url || undefined;
          convexStorageId = uploadResult.storageId;
        } catch (uploadErr: unknown) {
          const message = uploadErr instanceof Error ? uploadErr.message : String(uploadErr);
          setError(message || "Failed to upload image");
          setIsSending(false);
          return;
        }
      }

      // Send message
      await sendMessage(
        workingConversationId,
        user.id,
        senderType,
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.email ||
          "User",
        newMessage.trim(),
        imageUrl,
        convexStorageId,
      );

      // Clear inputs
      setNewMessage("");
      clearSelectedImage();
    } catch (err: unknown) {
      console.error("Error sending message:", err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Failed to send message");
      toast.error("Failed to send message");
    } finally {
      setIsInitializingConversation(false);
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: unknown) => {
    if (!timestamp) return "";
    const hasToDate = (typeof timestamp === "object" && timestamp !== null && "toDate" in (timestamp as object));
    const date = hasToDate
      ? (timestamp as { toDate: () => Date }).toDate()
      : new Date(timestamp as string | number);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return "";
    const hasToDate = (typeof timestamp === "object" && timestamp !== null && "toDate" in (timestamp as object));
    const date = hasToDate
      ? (timestamp as { toDate: () => Date }).toDate()
      : new Date(timestamp as string | number);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString();
  };

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups: { [key: string]: ChatMessage[] }, message) => {
      const date = formatDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {},
  );

  // Extract unique images from messages (deduplicated by URL)
  const uniqueImageMap = new Map<string, { url: string; sender: string; senderType: string; timestamp: unknown }>();
  messages.forEach((msg) => {
    if (msg.imageUrl && !uniqueImageMap.has(msg.imageUrl)) {
      uniqueImageMap.set(msg.imageUrl, {
        url: msg.imageUrl,
        sender: msg.senderName,
        senderType: msg.senderType,
        timestamp: msg.createdAt,
      });
    }
  });
  const allImages = Array.from(uniqueImageMap.values());

  // Treat admin messages with an image and recommendation text as recommended choices.
  const adminRecommendedImages = new Set(
    messages
      .filter(
        (msg) =>
          msg.senderType === "admin" &&
          Boolean(msg.imageUrl) &&
          Boolean(msg.content) &&
          msg.content.toLowerCase().includes("recommend"),
      )
      .map((msg) => msg.imageUrl as string),
  );

  const handleSelectLogoImage = async (imageUrl: string) => {
    if (conversationType !== "logo" || senderType !== "user" || !user?.id) return;

    try {
      setSelectedLogoImage(imageUrl);
      
      // Update onboarding data with selected logo
      const saved = localStorage.getItem(`onboarding_${user.id}`);
      const onboardingData = saved ? JSON.parse(saved) : {};
      
      onboardingData.logo = {
        type: "custom",
        url: imageUrl,
        customDesignRequestId: onboardingData.logo?.customDesignRequestId,
      };
      
      localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(onboardingData));

      // Persist selected logo to Firestore userLogos.
      await saveLogoData(user.id, {
        type: "custom",
        url: imageUrl,
        customDesignRequestId: onboardingData.logo?.customDesignRequestId,
      });

      // Persist onboarding.logo in users/{id}.onboarding so dashboard can recover across devices.
      const userRef = doc(firestore, "users", user.id);
      const userDoc = await getDoc(userRef);
      const existingOnboarding = userDoc.exists() ? userDoc.data()?.onboarding || {} : {};
      const mergedOnboarding = {
        ...existingOnboarding,
        logo: onboardingData.logo,
      };

      if (userDoc.exists()) {
        await updateDoc(userRef, { onboarding: mergedOnboarding });
      } else {
        await setDoc(userRef, { onboarding: mergedOnboarding }, { merge: true });
      }
      
      toast.success("Logo selected! It's now your brand logo.");
    } catch (err) {
      console.error("Error selecting logo:", err);
      toast.error("Failed to select logo");
    }
  };

  return (
    <div className="flex h-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Chat with {recipientName}
          </h2>
          <p className="text-sm text-gray-500">
            {conversationDescription}
          </p>
          {!activeConversationId && senderType === "user" && (
            <p className="mt-1 text-xs text-amber-600">
              Conversation will be created when you send your first message.
            </p>
          )}
        </div>

        {/* Messages and Input Container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Area */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSend className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Start the conversation by sending a message
            </p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Divider */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600">
                  {date}
                </div>
              </div>

              {/* Messages */}
              {dateMessages.map((message) => {
                // IMPORTANT: Distinguish messages by senderType, not senderId
                // This allows same user to test both admin and user chats
                const isOwnMessage = message.senderType === senderType;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-3`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        isOwnMessage
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    >
                      {/* Sender Name and Type Badge */}
                      {!isOwnMessage && (
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-medium text-gray-500">
                            {message.senderName}
                          </p>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                              message.senderType === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {message.senderType}
                          </span>
                        </div>
                      )}

                      {/* Image */}
                      {message.imageUrl && (
                        <div className="mb-2">
                          <img
                            src={message.imageUrl}
                            alt="Shared image"
                            className="max-w-full rounded-lg cursor-pointer hover:opacity-90"
                            onClick={() =>
                              window.open(message.imageUrl, "_blank")
                            }
                          />
                        </div>
                      )}

                      {/* Text Content */}
                      {message.content && (
                        <p className="whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      )}

                      {/* Time */}
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? "text-blue-100" : "text-gray-400"
                        }`}
                      >
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700 text-sm flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="mx-4 mb-2 p-3 bg-gray-100 rounded-lg">
          <div className="flex items-start gap-3">
            <img
              src={imagePreview}
              alt="Selected image"
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">
                {selectedImage?.name}
              </p>
              <p className="text-xs text-gray-500">
                {selectedImage && (selectedImage.size / 1024 / 1024).toFixed(2)}{" "}
                MB
              </p>
            </div>
            <button
              onClick={clearSelectedImage}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              disabled={isSending}
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {isUploading && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end gap-3">
          {/* Image Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending || isUploading}
            className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <FiImage className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            disabled={isSending || isUploading}
          />

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              disabled={isSending || isUploading}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all disabled:opacity-50 max-h-32"
              style={{ minHeight: "48px" }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={
              isSending || isUploading || (!newMessage.trim() && !selectedImage)
            }
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending || isUploading || isInitializingConversation ? (
              <FiLoader className="w-5 h-5 animate-spin" />
            ) : (
              <FiSend className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
        </div>
      </div>

      {/* Image Sidebar for Logo Chat */}
      {conversationType === "logo" && (
        <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
          <div className="px-4 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              Logo Options ({allImages.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {allImages.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">No images shared yet</p>
              </div>
            ) : (
              allImages.map((img, idx) => (
                <div key={idx} className="group">
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-2">
                    <img
                      src={img.url}
                      alt={`Logo option ${idx + 1}`}
                      className="w-full h-40 object-cover"
                    />
                    {selectedLogoImage === img.url && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <FiCheck className="w-6 h-6 text-green-600" />
                      </div>
                    )}
                    {adminRecommendedImages.has(img.url) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-600/90 text-white text-xs py-1 px-2 text-center font-semibold">
                        ✓ Admin Recommended
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleSelectLogoImage(img.url)}
                        disabled={senderType !== "user"}
                        className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:bg-gray-400"
                        title={senderType === "user" ? "Select as logo" : "Only users can select"}
                      >
                        <FiCheck className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => window.open(img.url, "_blank")}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        title="Download"
                      >
                        <FiDownload className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p className="font-medium">{img.sender}</p>
                    <p className="text-gray-500">{img.senderType}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
