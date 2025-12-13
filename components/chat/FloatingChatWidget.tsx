"use client";

import { useState, useEffect } from "react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import { usePathname } from "next/navigation";

interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const pathname = usePathname();

  // Context-aware initial messages based on current page
  const getContextMessages = (): Message[] => {
    const baseMessages: Message[] = [
      {
        id: 1,
        sender: "bot",
        text: "Hi! I'm your Business Builder Assistant. How can I help you today? 👋",
        timestamp: "10:30 AM",
      },
    ];

    if (pathname?.includes("/onboarding")) {
      // Check which step based on URL or add more context
      if (pathname.includes("logo") || message.toLowerCase().includes("logo")) {
        baseMessages.push({
          id: 2,
          sender: "bot",
          text: "I see you're working on your logo. Need help designing your logo? I can guide you through the process! 🎨",
          timestamp: "10:31 AM",
        });
      } else if (pathname.includes("social")) {
        baseMessages.push({
          id: 2,
          sender: "bot",
          text: "Setting up social media? I can help you choose the right platforms for your business! 📱",
          timestamp: "10:31 AM",
        });
      } else if (pathname.includes("website")) {
        baseMessages.push({
          id: 2,
          sender: "bot",
          text: "Choosing a website template? Let me know if you need recommendations! 🌐",
          timestamp: "10:31 AM",
        });
      } else {
        baseMessages.push({
          id: 2,
          sender: "bot",
          text: "I'm here to help you build your business online. Feel free to ask any questions! 💼",
          timestamp: "10:31 AM",
        });
      }
    } else if (pathname?.includes("/dashboard")) {
      baseMessages.push({
        id: 2,
        sender: "bot",
        text: "Welcome to your dashboard! Need help navigating or setting up your business? 📊",
        timestamp: "10:31 AM",
      });
    } else if (pathname?.includes("/templates")) {
      baseMessages.push({
        id: 2,
        sender: "bot",
        text: "Looking at templates? I can help you customize colors, layouts, and content! 🎨",
        timestamp: "10:31 AM",
      });
    } else {
      baseMessages.push({
        id: 2,
        sender: "bot",
        text: "I'm here to help you build your business online. Feel free to ask any questions! 💼",
        timestamp: "10:31 AM",
      });
    }

    return baseMessages;
  };

  const [messages, setMessages] = useState<Message[]>(getContextMessages());

  // Update messages when pathname changes
  useEffect(() => {
    setMessages(getContextMessages());
  }, [pathname]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newUserMessage: Message = {
        id: messages.length + 1,
        sender: "user",
        text: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const botResponse: Message = {
        id: messages.length + 2,
        sender: "bot",
        text: "Thanks for your message! Our support team will get back to you shortly. In the meantime, check out our FAQ section. 😊",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages([...messages, newUserMessage, botResponse]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-50 group"
          aria-label="Open chat"
        >
          <FiMessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>

          {/* Tooltip - Hidden on mobile */}
          <div className="hidden sm:block absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Need help? Chat with us!
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full h-full sm:w-96 sm:h-[500px] bg-white sm:rounded-2xl shadow-2xl z-50 flex flex-col border-0 sm:border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-4 flex items-center justify-between safe-area-top">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FiMessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">
                  Support Assistant
                </h3>
                <p className="text-xs text-blue-100">
                  Online • Typically replies instantly
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 sm:w-8 sm:h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-all flex-shrink-0"
              aria-label="Close chat"
            >
              <FiX className="w-6 h-6 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2 ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender === "user" ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-3 sm:px-4 py-2 bg-gray-100 border-t border-gray-200">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <button className="px-3 py-1.5 bg-white text-gray-700 text-xs rounded-full border border-gray-300 hover:bg-gray-50 whitespace-nowrap">
                📚 View FAQ
              </button>
              <button className="px-3 py-1.5 bg-white text-gray-700 text-xs rounded-full border border-gray-300 hover:bg-gray-50 whitespace-nowrap">
                📞 Contact Support
              </button>
              <button className="px-3 py-1.5 bg-white text-gray-700 text-xs rounded-full border border-gray-300 hover:bg-gray-50 whitespace-nowrap">
                💡 Tips & Guides
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 bg-white border-t border-gray-200 safe-area-bottom">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="w-10 h-10 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex-shrink-0"
                aria-label="Send message"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center hidden sm:block">
              We typically respond within minutes
            </p>
          </div>
        </div>
      )}
    </>
  );
}
