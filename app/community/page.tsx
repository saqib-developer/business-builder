"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  createCommunityPost,
  subscribeToCommunityPosts,
  createReply,
  togglePostLike,
  CommunityPost,
} from "@/lib/firebase/firestoreService";
import {
  FiMessageCircle,
  FiThumbsUp,
  FiClock,
  FiPlus,
  FiX,
  FiSend,
  FiLogIn,
} from "react-icons/fi";

export default function CommunityPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [showPostModal, setShowPostModal] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Social Media");
  const [replyText, setReplyText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [posting, setPosting] = useState(false);

  // Subscribe to community posts
  useEffect(() => {
    const unsubscribe = subscribeToCommunityPosts((fetchedPosts) => {
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  // Modal Scroll Lock
  useEffect(() => {
    if (showPostModal || showReplyModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPostModal, showReplyModal]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "Just now";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  const handlePostQuestion = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (newPostTitle.trim() && newPostBody.trim()) {
      setPosting(true);
      try {
        await createCommunityPost({
          authorId: user.id,
          authorName: `${user.firstName} ${user.lastName}`,
          authorAvatar: getInitials(`${user.firstName} ${user.lastName}`),
          authorRole: user.role === "admin" ? "Admin" : "Entrepreneur",
          title: newPostTitle,
          body: newPostBody,
          category: newPostCategory,
        });

        setShowPostModal(false);
        setNewPostTitle("");
        setNewPostBody("");
        setNewPostCategory("Social Media");
      } catch (error) {
        console.error("Error posting question:", error);
        alert("Failed to post question. Please try again.");
      } finally {
        setPosting(false);
      }
    }
  };

  const handleReply = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (replyText.trim() && selectedPost) {
      setPosting(true);
      try {
        await createReply({
          postId: selectedPost.id,
          authorId: user.id,
          authorName: `${user.firstName} ${user.lastName}`,
          authorAvatar: getInitials(`${user.firstName} ${user.lastName}`),
          body: replyText,
        });

        setShowReplyModal(false);
        setReplyText("");
        setSelectedPost(null);
      } catch (error) {
        console.error("Error posting reply:", error);
        alert("Failed to post reply. Please try again.");
      } finally {
        setPosting(false);
      }
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    try {
      await togglePostLike(postId, user.id);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleOpenPostModal = () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    setShowPostModal(true);
  };

  const handleOpenReplyModal = (post: CommunityPost) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    setSelectedPost(post);
    setShowReplyModal(true);
  };

  const filteredPosts =
    selectedCategory === "All Topics"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const categories = [
    "All Topics",
    "Social Media",
    "Branding",
    "Marketing",
    "Website Design",
    "Other",
  ];

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
              onClick={handleOpenPostModal}
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
        {/* Auth Warning Banner */}
        {!user && !loading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <FiLogIn className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                <strong>Sign in to participate!</strong> You need to be logged
                in to post questions and replies.
              </p>
            </div>
            <button
              onClick={() => router.push("/sign-in")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all text-sm"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Category Filters */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <FiMessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 text-lg font-medium mb-2">
                No posts yet in this category
              </p>
              <p className="text-gray-500 text-sm">
                Be the first to start a conversation!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all"
              >
                {/* Author Info */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {post.authorAvatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">
                        {post.authorName}
                      </h3>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {post.authorRole}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiClock className="w-3 h-3" />
                      <span>{formatTimestamp(post.createdAt)}</span>
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
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {post.body}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleLike(post.id)}
                    disabled={!user}
                    className={`flex items-center gap-2 transition-colors ${
                      user && post.likedBy?.includes(user.id)
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <FiThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {post.likes} {post.likes === 1 ? "Like" : "Likes"}
                    </span>
                  </button>
                  <button
                    onClick={() => handleOpenReplyModal(post)}
                    disabled={!user}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiMessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {post.replyCount}{" "}
                      {post.replyCount === 1 ? "Reply" : "Replies"}
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Call to Action */}
        {posts.length === 0 && (
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center border-2 border-blue-200">
            <p className="text-gray-700 mb-4">
              🚀 <strong>Join the conversation!</strong> Share your
              entrepreneurial journey, ask questions, and help others succeed.
            </p>
            <button
              onClick={handleOpenPostModal}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Post Your First Question
            </button>
          </div>
        )}
      </div>

      {/* Post Question Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
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

            {/* Scrollable Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
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
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Social Media</option>
                  <option>Branding</option>
                  <option>Marketing</option>
                  <option>Website Design</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-100 flex-shrink-0 bg-gray-50/50">
              <button
                onClick={() => setShowPostModal(false)}
                disabled={posting}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePostQuestion}
                disabled={
                  !newPostTitle.trim() || !newPostBody.trim() || posting
                }
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                {posting ? "Posting..." : "Post Question"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
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

            {/* Scrollable Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Original Post Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {selectedPost.title}
                </p>
                <p className="text-sm text-gray-600">{selectedPost.body}</p>
              </div>

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
            </div>

            {/* Sticky Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-100 flex-shrink-0 bg-gray-50/50">
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setSelectedPost(null);
                }}
                disabled={posting}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={!replyText.trim() || posting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <FiSend className="w-4 h-4" />
                {posting ? "Posting..." : "Post Reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
