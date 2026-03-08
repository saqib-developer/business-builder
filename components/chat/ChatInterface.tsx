"use client";

import { useState, useEffect, useRef } from "react";
import { FiSend, FiImage, FiLoader, FiX, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "@/lib/context/AuthContext";
import { useConvexUpload } from "@/hooks/useConvexUpload";
import {
  subscribeToMessages,
  sendMessage,
  markMessagesAsRead,
  ChatMessage,
} from "@/lib/firebase/firestoreService";
import toast from "react-hot-toast";

interface ChatInterfaceProps {
  conversationId: string;
  senderType: "user" | "admin";
  recipientName?: string;
}

export default function ChatInterface({
  conversationId,
  senderType,
  recipientName = "Support Team",
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to messages
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = subscribeToMessages(conversationId, (newMessages) => {
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [conversationId]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (conversationId && user?.id) {
      markMessagesAsRead(conversationId, user.id).catch(console.error);
    }
  }, [conversationId, user?.id, messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        } catch (uploadErr: any) {
          setError(uploadErr.message || "Failed to upload image");
          setIsSending(false);
          return;
        }
      }

      // Send message
      await sendMessage(
        conversationId,
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
      toast.success("Message sent!");
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message");
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
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

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Chat with {recipientName}
        </h2>
        <p className="text-sm text-gray-500">
          Discuss your custom logo design requirements
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        <div ref={messagesEndRef} />
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
            {isSending || isUploading ? (
              <FiLoader className="w-5 h-5 animate-spin" />
            ) : (
              <FiSend className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
