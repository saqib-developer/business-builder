"use client";

import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { updateUserRole } from "@/lib/firebase/firestoreService";
import { FiShield, FiCheck, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminSetupPage() {
  const { user, loading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  const makeCurrentUserAdmin = async () => {
    if (!user?.id) {
      toast.error("No user logged in");
      return;
    }

    setIsUpdating(true);
    setSuccess(false);

    try {
      await updateUserRole(user.id, "admin");
      setSuccess(true);
      toast.success("You are now an admin! Please refresh the page.");
    } catch (error: any) {
      console.error("Error making user admin:", error);
      toast.error("Failed to update role. Check console for details.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-gray-200 shadow-sm">
          <FiAlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign In Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to access admin setup.
          </p>
          <Link
            href="/sign-in?redirect=/admin/setup"
            className="block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4">
            <FiShield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Setup</h1>
          <p className="text-gray-600">
            Grant admin privileges to your account
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Current User
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
              <p className="text-sm text-gray-600 mt-2 mb-1">User ID</p>
              <p className="font-mono text-xs text-gray-900 break-all">
                {user.id}
              </p>
            </div>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <FiCheck className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-green-900 mb-2">
                Admin Access Granted!
              </h3>
              <p className="text-green-700 mb-4">
                You now have admin privileges. Please refresh the page or sign
                out and sign back in for changes to take effect.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => window.location.reload()}
                  className="block w-full px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Refresh Page
                </button>
                <Link
                  href="/admin/messages"
                  className="block w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go to Admin Messages
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Important</p>
                    <p>
                      This will grant admin privileges to your account. Admin
                      users can:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>View and respond to all customer messages</li>
                      <li>Access all conversations</li>
                      <li>Manage custom design requests</li>
                      <li>Modify other user profiles</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={makeCurrentUserAdmin}
                disabled={isUpdating}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiShield className="w-5 h-5" />
                    Make Me Admin
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Developer Note
          </h3>
          <p className="text-sm text-blue-800">
            This page is for initial setup. In production, you should manage
            admin roles through Firebase Console or a secure admin panel. You
            can remove this page once you've set up your admin accounts.
          </p>
        </div>
      </div>
    </div>
  );
}
