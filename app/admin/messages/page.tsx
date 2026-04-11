"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiSend,
  FiUser,
  FiImage,
  FiLoader,
  FiMessageCircle,
  FiAlertCircle,
  FiLock,
  FiCheck,
  FiDownload,
  FiX,
} from "react-icons/fi";
import { Timestamp } from "firebase/firestore";
import {
  subscribeToConversations,
  subscribeToMessages,
  sendMessage,
  markMessagesAsRead,
  Conversation,
  ChatMessage,
} from "@/lib/firebase/firestoreService";
import { useConvexUpload } from "@/hooks/useConvexUpload";
import { useAuth } from "@/lib/context/AuthContext";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

// Helper to convert Firestore Timestamp to Date
const timestampToDate = (timestamp: Timestamp | undefined): Date => {
  if (!timestamp) return new Date();
  return timestamp.toDate();
};

export default function AdminMessagesPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversationTypeFilter, setConversationTypeFilter] = useState<
    "all" | "logo" | "wordpress" | "custom-code"
  >("all");
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useConvexUpload();

  // Check authentication
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/sign-in?redirect=/admin/messages");
      return;
    }
  }, [user, authLoading, router]);

  // Subscribe to all conversations in realtime
  useEffect(() => {
    if (authLoading || !user) return;

    setIsLoading(true);

    const unsubscribe = subscribeToConversations((allConversations) => {
      setConversations(allConversations);

      // Keep selected conversation in sync with updates/removals.
      setSelectedConversation((prev) => {
        if (!allConversations.length) return null;
        if (!prev?.id) return allConversations[0];
        return allConversations.find((conv) => conv.id === prev.id) || allConversations[0];
      });

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  // Subscribe to messages for selected conversation
  useEffect(() => {
    if (!selectedConversation?.id || !user) return;

    const unsubscribe = subscribeToMessages(
      selectedConversation.id,
      (newMessages) => {
        setMessages(newMessages);

        // Mark messages as read
        const hasUnread = newMessages.some(
          (m) => m.senderId !== user.id && !m.read,
        );

        if (hasUnread && selectedConversation.id) {
          markMessagesAsRead(selectedConversation.id, user.id).catch(
            console.error,
          );
        }
      },
    );

    return () => unsubscribe();
  }, [selectedConversation?.id, user]);

  // Scroll to bottom when messages change - only scroll the messages container, not the whole page
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

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.userName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      conversationTypeFilter === "all" ||
      conv.conversationType === conversationTypeFilter;
    return matchesSearch && matchesType;
  });

  const getConversationTypeLabel = (type: string) => {
    switch (type) {
      case "logo":
        return "🎨 Logo";
      case "wordpress":
        return "🌐 WordPress";
      case "custom-code":
        return "💻 Custom Code";
      default:
        return type;
    }
  };

  const conversationTypeCounts = {
    all: conversations.length,
    logo: conversations.filter((c) => c.conversationType === "logo").length,
    wordpress: conversations.filter((c) => c.conversationType === "wordpress")
      .length,
    "custom-code": conversations.filter(
      (c) => c.conversationType === "custom-code",
    ).length,
  };

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be less than 10MB");
        return;
      }

      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    },
    [],
  );

  const clearImageSelection = useCallback(() => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [imagePreview]);

  const handleSendMessage = async () => {
    if (
      (!newMessage.trim() && !selectedImage) ||
      !selectedConversation?.id ||
      !user
    )
      return;

    setIsSending(true);
    try {
      let imageUrl: string | undefined;
      let convexStorageId: string | undefined;

      // Upload image if selected
      if (selectedImage) {
        const uploadResult = await uploadFile(selectedImage, user.id, "chat");
        if (uploadResult && uploadResult.url) {
          imageUrl = uploadResult.url;
          convexStorageId = uploadResult.storageId;
        }
      }

      // Send message with all required parameters
      const senderName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.email ||
        "Admin";
      await sendMessage(
        selectedConversation.id,
        user.id,
        "admin",
        senderName,
        newMessage.trim() || (imageUrl ? "Shared an image" : ""),
        imageUrl,
        convexStorageId,
      );

      setNewMessage("");
      clearImageSelection();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const formatTimestamp = (timestamp: Timestamp | undefined): string => {
    const date = timestampToDate(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = timestampToDate(message.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {} as Record<string, ChatMessage[]>,
  );

  // Extract unique images from messages (deduplicated by URL)
  const uniqueImageMap = new Map<string, { url: string; sender: string; senderType: string; timestamp: any }>();
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

  // Persist recommendation badges by deriving them from admin recommendation messages.
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

  const handleRecommendImage = async (imageUrl: string) => {
    if (!selectedConversation || selectedConversation.conversationType !== "logo" || !selectedConversation.id) {
      toast.error("Image recommendation is only available for logo chats");
      return;
    }

    try {
      setIsSending(true);

      // Send recommendation message with image
      await sendMessage(
        selectedConversation.id,
        user?.id || "admin",
        "admin",
        "Admin",
        `I recommend this image for your brand logo! 🎨`,
        imageUrl,
      );
      toast.success("Recommendation sent!");
    } catch (err: any) {
      console.error("Error recommending image:", err);
      toast.error("Failed to send recommendation");
    } finally {
      setIsSending(false);
    }
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-red-200 shadow-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiLock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You do not have permission to view customer messages.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Ask an administrator to grant you access in Firestore.
            </p>
            <Link
              href="/dashboard"
              className="block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            Customer Messages
          </h1>

          {/* Search */}
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Conversation Type Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setConversationTypeFilter("all")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                conversationTypeFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({conversationTypeCounts.all})
            </button>
            <button
              onClick={() => setConversationTypeFilter("logo")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                conversationTypeFilter === "logo"
                  ? "bg-pink-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🎨 Logo ({conversationTypeCounts.logo})
            </button>
            <button
              onClick={() => setConversationTypeFilter("wordpress")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                conversationTypeFilter === "wordpress"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🌐 WP ({conversationTypeCounts.wordpress})
            </button>
            <button
              onClick={() => setConversationTypeFilter("custom-code")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                conversationTypeFilter === "custom-code"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              💻 Code ({conversationTypeCounts["custom-code"]})
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FiMessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Customer messages will appear here</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedConversation?.id === conv.id
                    ? "bg-blue-50 border-l-4 border-l-blue-600"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {getInitials(conv.userName)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conv.userName}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conv.lastMessage || "New conversation"}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                        conv.conversationType === "logo"
                          ? "bg-pink-100 text-pink-700"
                          : conv.conversationType === "wordpress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {getConversationTypeLabel(conv.conversationType)}
                    </span>
                  </div>

                  {/* Unread Badge */}
                  {conv.unreadCount > 0 && (
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Main Area - Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {getInitials(selectedConversation.userName)}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">
                    {selectedConversation.userName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {getConversationTypeLabel(
                      selectedConversation.conversationType,
                    )}{" "}
                    Request
                  </p>
                </div>
              </div>
            </div>

            {/* Messages and Sidebar Container */}
            <div className="flex flex-1 overflow-hidden">
              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Messages */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
              {Object.keys(groupedMessages).length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No messages yet</p>
                  <p className="text-sm mt-1">
                    Start the conversation by sending a message
                  </p>
                </div>
              ) : (
                Object.entries(groupedMessages).map(([date, dateMessages]) => (
                  <div key={date}>
                    {/* Date Separator */}
                    <div className="flex items-center justify-center mb-4">
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                        {date === new Date().toLocaleDateString()
                          ? "Today"
                          : date}
                      </span>
                    </div>

                    {/* Messages for this date */}
                    <div className="space-y-4">
                      {dateMessages.map((msg) => {
                        // IMPORTANT: Use senderType for admin interface
                        // This allows same user to test both admin and user chats
                        const isAdminMessage = msg.senderType === "admin";
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${
                              isAdminMessage ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                                isAdminMessage
                                  ? "bg-blue-600 text-white"
                                  : "bg-white text-gray-800 border border-gray-200"
                              }`}
                            >
                              {/* Sender info for user messages */}
                              {!isAdminMessage && (
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="text-xs font-medium text-gray-600">
                                    {msg.senderName}
                                  </p>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                    user
                                  </span>
                                </div>
                              )}
                              {msg.imageUrl && (
                                <div className="mb-2 rounded-lg overflow-hidden">
                                  <Image
                                    src={msg.imageUrl}
                                    alt="Shared image"
                                    width={250}
                                    height={250}
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              {msg.content && (
                                <p className="text-sm">{msg.content}</p>
                              )}
                              <p
                                className={`text-xs mt-1 ${
                                  isAdminMessage
                                    ? "text-blue-100"
                                    : "text-gray-500"
                                }`}
                              >
                                {timestampToDate(
                                  msg.createdAt,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="bg-white border-t border-gray-200 p-3">
                <div className="relative inline-block">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <button
                    onClick={clearImageSelection}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-3 items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isSending}
                  className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
                  title="Attach image"
                >
                  <FiImage className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSendMessage()
                  }
                  placeholder="Type your reply..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={
                    (!newMessage.trim() && !selectedImage) ||
                    isSending ||
                    isUploading
                  }
                  className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isSending || isUploading ? (
                    <FiLoader className="w-4 h-4 animate-spin" />
                  ) : (
                    <FiSend className="w-4 h-4" />
                  )}
                  Send
                </button>
              </div>
            </div>
              </div>

              {/* Image Sidebar for Logo Chat */}
              {selectedConversation.conversationType === "logo" && (
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
                            {adminRecommendedImages.has(img.url) && (
                              <div className="absolute bottom-0 left-0 right-0 bg-green-600/90 text-white text-xs py-1 px-2 text-center font-semibold">
                                ✓ Recommended
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleRecommendImage(img.url)}
                                disabled={isSending}
                                className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:bg-gray-400"
                                title="Recommend this image"
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FiUser className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No conversation selected</p>
              <p className="text-sm mt-1">
                Select a conversation from the left to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
