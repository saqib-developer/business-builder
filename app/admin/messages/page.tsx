"use client";

import { useState } from "react";
import { FiSearch, FiSend, FiMoreVertical, FiUser } from "react-icons/fi";

interface User {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: number;
  userId: number;
  sender: "admin" | "user";
  text: string;
  timestamp: string;
}

const MOCK_USERS: User[] = [
  {
    id: 1,
    name: "John Doe",
    avatar: "JD",
    lastMessage: "Thanks for the help with my logo!",
    timestamp: "2m ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Sarah Startups",
    avatar: "SS",
    lastMessage: "How do I change the template colors?",
    timestamp: "15m ago",
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: "Ali Khan",
    avatar: "AK",
    lastMessage: "My website isn't loading properly",
    timestamp: "1h ago",
    unread: 1,
    online: false,
  },
  {
    id: 4,
    name: "Emma Wilson",
    avatar: "EW",
    lastMessage: "Can I upgrade my plan?",
    timestamp: "2h ago",
    unread: 0,
    online: false,
  },
];

const MOCK_CONVERSATIONS: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      userId: 1,
      sender: "user",
      text: "Hi! I'm having trouble with my logo upload. It keeps saying the file is too large.",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      userId: 1,
      sender: "admin",
      text: "Hello John! I can help with that. The maximum file size is 5MB. Try resizing your image or converting it to a different format like PNG or JPG.",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      userId: 1,
      sender: "user",
      text: "Oh I see! Let me try that. Should I use PNG or JPG?",
      timestamp: "10:33 AM",
    },
    {
      id: 4,
      userId: 1,
      sender: "admin",
      text: "PNG is better for logos because it supports transparency and maintains quality. JPG works too but doesn't support transparent backgrounds.",
      timestamp: "10:35 AM",
    },
    {
      id: 5,
      userId: 1,
      sender: "user",
      text: "Perfect! It worked. Thanks for the help with my logo!",
      timestamp: "10:38 AM",
    },
  ],
  2: [
    {
      id: 1,
      userId: 2,
      sender: "user",
      text: "Hello! I selected the Modern Shop template but I want to change the blue color to purple. How do I do that?",
      timestamp: "9:45 AM",
    },
    {
      id: 2,
      userId: 2,
      sender: "admin",
      text: "Hi Sarah! Great question. Go to Templates → Settings, and you'll find a color customization section where you can change your primary and secondary colors.",
      timestamp: "9:47 AM",
    },
    {
      id: 3,
      userId: 2,
      sender: "user",
      text: "How do I change the template colors?",
      timestamp: "9:50 AM",
    },
  ],
  3: [
    {
      id: 1,
      userId: 3,
      sender: "user",
      text: "My website preview shows a blank page. I selected the Classic Store template but nothing appears.",
      timestamp: "8:30 AM",
    },
    {
      id: 2,
      userId: 3,
      sender: "admin",
      text: "Hi Ali! Let me help you troubleshoot this. Have you completed all the onboarding steps including adding your business name?",
      timestamp: "8:35 AM",
    },
    {
      id: 3,
      userId: 3,
      sender: "user",
      text: "Yes, I completed everything. The dashboard shows 100% progress.",
      timestamp: "8:40 AM",
    },
    {
      id: 4,
      userId: 3,
      sender: "admin",
      text: "Try clearing your browser cache and refreshing the page. Sometimes the preview needs a hard refresh. Press Ctrl+Shift+R (or Cmd+Shift+R on Mac).",
      timestamp: "8:42 AM",
    },
    {
      id: 5,
      userId: 3,
      sender: "user",
      text: "My website isn't loading properly",
      timestamp: "9:00 AM",
    },
  ],
  4: [
    {
      id: 1,
      userId: 4,
      sender: "user",
      text: "Hi! I'm loving the platform. Can I upgrade my plan to get access to custom domains?",
      timestamp: "7:15 AM",
    },
    {
      id: 2,
      userId: 4,
      sender: "admin",
      text: "Hello Emma! I'm so glad you're enjoying it! Custom domains and premium features will be available soon. For now, you can prepare your business setup and customize your site.",
      timestamp: "7:20 AM",
    },
    {
      id: 3,
      userId: 4,
      sender: "user",
      text: "Can I upgrade my plan?",
      timestamp: "7:25 AM",
    },
  ],
};

export default function AdminMessagesPage() {
  const [selectedUserId, setSelectedUserId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const selectedUser = MOCK_USERS.find((u) => u.id === selectedUserId);
  const conversation = MOCK_CONVERSATIONS[selectedUserId] || [];

  const filteredUsers = MOCK_USERS.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Mock sending - just visual feedback
      alert("Message sent! (This is a demo - no backend connected)");
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-gray-50 ${
                selectedUserId === user.id
                  ? "bg-blue-50 border-l-4 border-l-blue-600"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.avatar}
                  </div>
                  {user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {user.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {user.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {user.lastMessage}
                  </p>
                </div>

                {/* Unread Badge */}
                {user.unread > 0 && (
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {user.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Main Area - Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedUser.avatar}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">
                    {selectedUser.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedUser.online ? (
                      <span className="text-green-600">● Online</span>
                    ) : (
                      "Offline"
                    )}
                  </p>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <FiMoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {conversation.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      msg.sender === "admin"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "admin"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <FiSend className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FiUser className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
