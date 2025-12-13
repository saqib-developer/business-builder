"use client";

import { useState } from "react";
import {
  FiMessageCircle,
  FiThumbsUp,
  FiClock,
  FiPlus,
  FiX,
  FiSend,
} from "react-icons/fi";

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  timestamp: string;
  title: string;
  body: string;
  likes: number;
  replies: number;
  category: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    author: {
      name: "Sarah Johnson",
      avatar: "SJ",
      role: "Restaurant Owner",
    },
    timestamp: "2 hours ago",
    title: "Has anyone verified their WhatsApp Business account yet?",
    body: "I'm trying to set up WhatsApp Business for my restaurant but the verification process seems complicated. Has anyone successfully done this? What documents did you need?",
    likes: 12,
    replies: 8,
    category: "Social Media",
  },
  {
    id: 2,
    author: {
      name: "Mike Chen",
      avatar: "MC",
      role: "Food Delivery Startup",
    },
    timestamp: "5 hours ago",
    title: "What colors look best for a food delivery brand?",
    body: "I'm designing my logo and choosing brand colors for my food delivery service. I'm torn between orange/red (like other delivery apps) or going with something unique like purple. What do you all think? Does color psychology really matter that much?",
    likes: 24,
    replies: 15,
    category: "Branding",
  },
  {
    id: 3,
    author: {
      name: "Aisha Khan",
      avatar: "AK",
      role: "E-commerce Store",
    },
    timestamp: "1 day ago",
    title: "Best practices for product photography on a budget?",
    body: "I can't afford a professional photographer right now. What are some tips for taking good product photos with just a smartphone? I've heard about lightboxes but don't know where to start. Any recommendations?",
    likes: 31,
    replies: 22,
    category: "Marketing",
  },
  {
    id: 4,
    author: {
      name: "David Wilson",
      avatar: "DW",
      role: "Fitness Coach",
    },
    timestamp: "2 days ago",
    title: "Should I use the Modern Shop or Minimal Boutique template?",
    body: "I'm a fitness coach launching an online program. I love the clean look of Minimal Boutique but Modern Shop seems more dynamic. Which template would work better for a fitness/wellness brand? I want something that feels energetic but professional.",
    likes: 18,
    replies: 11,
    category: "Website Design",
  },
];

export default function CommunityPage() {
  const [showPostModal, setShowPostModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [replyText, setReplyText] = useState("");

  const handlePostQuestion = () => {
    if (newPostTitle.trim() && newPostBody.trim()) {
      alert("Question posted! (This is a demo - no backend connected)");
      setShowPostModal(false);
      setNewPostTitle("");
      setNewPostBody("");
    }
  };

  const handleReply = () => {
    if (replyText.trim()) {
      alert("Reply posted! (This is a demo - no backend connected)");
      setShowReplyModal(false);
      setReplyText("");
      setSelectedPost(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Community Forum 💬
              </h1>
              <p className="text-gray-600">
                Connect with fellow entrepreneurs, share tips, and get advice
              </p>
            </div>
            <button
              onClick={() => setShowPostModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg"
            >
              <FiPlus className="w-5 h-5" />
              Post a Question
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Category Filters */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm whitespace-nowrap">
            All Topics
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium text-sm border border-gray-200 hover:bg-gray-50 whitespace-nowrap">
            Social Media
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium text-sm border border-gray-200 hover:bg-gray-50 whitespace-nowrap">
            Branding
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium text-sm border border-gray-200 hover:bg-gray-50 whitespace-nowrap">
            Marketing
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium text-sm border border-gray-200 hover:bg-gray-50 whitespace-nowrap">
            Website Design
          </button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {MOCK_POSTS.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all"
            >
              {/* Author Info */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {post.author.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">
                      {post.author.name}
                    </h3>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {post.author.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiClock className="w-3 h-3" />
                    <span>{post.timestamp}</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">{post.body}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <FiThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {post.likes} Likes
                  </span>
                </button>
                <button
                  onClick={() => {
                    setSelectedPost(post);
                    setShowReplyModal(true);
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FiMessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {post.replies} Replies
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Placeholder */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center border-2 border-blue-200">
          <p className="text-gray-700 mb-4">
            🚀 <strong>Join the conversation!</strong> Share your
            entrepreneurial journey, ask questions, and help others succeed.
          </p>
          <button
            onClick={() => setShowPostModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Post Your First Question
          </button>
        </div>
      </div>

      {/* Post Question Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Post a Question
              </h2>
              <button
                onClick={() => setShowPostModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question Title
                </label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g., How do I verify my WhatsApp Business account?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Details
                </label>
                <textarea
                  value={newPostBody}
                  onChange={(e) => setNewPostBody(e.target.value)}
                  placeholder="Provide more details about your question..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Social Media</option>
                  <option>Branding</option>
                  <option>Marketing</option>
                  <option>Website Design</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostQuestion}
                  disabled={!newPostTitle.trim() || !newPostBody.trim()}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                >
                  Post Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Reply to Post
              </h2>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setSelectedPost(null);
                }}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Original Post Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {selectedPost.title}
              </p>
              <p className="text-sm text-gray-600">{selectedPost.body}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Reply
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Share your thoughts, advice, or answer..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedPost(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <FiSend className="w-4 h-4" />
                  Post Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
