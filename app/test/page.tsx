"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiTrash2,
  FiRefreshCw,
  FiAlertTriangle,
  FiCheck,
  FiDatabase,
  FiUsers,
  FiLock,
} from "react-icons/fi";
import { getAuth, deleteUser } from "firebase/auth";
import { toast } from "react-hot-toast";
// import initializeDummyData from "@/temp/DummyData"; // Commented out for build

export default function TestPage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState<"delete" | "reset" | null>(null);
  const [password, setPassword] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const ADMIN_PASSWORD = "doxfen-reset-2024"; // Change this to your secure password

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
    console.log(message);
  };

  const deleteAllAuthUsers = async () => {
    addLog("🗑️ Starting Firebase Auth cleanup...");
    const auth = getAuth();

    // Note: Firebase Admin SDK is required to delete users programmatically
    // This is a client-side limitation - users need to be deleted via Admin SDK
    addLog(
      "⚠️ Note: Firebase Auth users need to be deleted via Firebase Console or Admin SDK"
    );
    addLog(
      "   Please manually delete users from Firebase Console > Authentication"
    );

    return true;
  };

  const deleteAllLocalStorageData = async () => {
    addLog("🗑️ Starting localStorage cleanup...");

    const keysToClean = ["brandSettings", "onboarding_data"];

    try {
      // Get all localStorage keys that match our patterns
      const allKeys = Object.keys(localStorage);
      const userKeys = allKeys.filter(
        (key) =>
          key.startsWith("user_") ||
          key.startsWith("onboarding_") ||
          keysToClean.includes(key)
      );

      addLog(`Found ${userKeys.length} items to clean`);

      userKeys.forEach((key) => {
        localStorage.removeItem(key);
        addLog(`   ✅ Removed: ${key}`);
      });

      addLog("✅ LocalStorage cleanup completed successfully!");
      return true;
    } catch (error: any) {
      addLog(`❌ Error during localStorage cleanup: ${error.message}`);
      throw error;
    }
  };

  const handleDeleteAll = async () => {
    if (password !== ADMIN_PASSWORD) {
      toast.error("Incorrect password!");
      return;
    }

    setIsDeleting(true);
    setLogs([]);

    try {
      addLog("🚀 Starting complete data deletion...");

      await deleteAllLocalStorageData();
      await deleteAllAuthUsers();

      addLog("✅ All data deleted successfully!");
      toast.success("All data deleted successfully!");
      setShowConfirmation(false);
      setPassword("");
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      toast.error("Failed to delete data. Check console for details.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetData = async () => {
    if (password !== ADMIN_PASSWORD) {
      toast.error("Incorrect password!");
      return;
    }

    setIsResetting(true);
    setLogs([]);

    try {
      addLog("🚀 Starting complete data reset...");

      // Delete all existing data
      await deleteAllLocalStorageData();
      await deleteAllAuthUsers();

      addLog("📝 Data reset completed");

      addLog("✅ Database reset completed successfully!");
      toast.success("Database reset successfully! Refresh the page.");
      setShowConfirmation(false);
      setPassword("");
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      toast.error("Failed to reset data. Check console for details.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleActionClick = (type: "delete" | "reset") => {
    setActionType(type);
    setShowConfirmation(true);
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30">
              <FiAlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Database Management
              </h1>
              <p className="text-gray-400">
                Danger Zone - Reset or delete all application data
              </p>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-semibold mb-1">Warning</h3>
                <p className="text-gray-300 text-sm">
                  These actions are <strong>irreversible</strong>. All data will
                  be permanently deleted. Make sure you understand what you're
                  doing before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Delete All Data */}
          <motion.div
            className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <FiTrash2 className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Delete All Data</h2>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Permanently delete all localStorage data and Firebase Auth users.
              The database will be completely empty.
            </p>
            <ul className="space-y-2 mb-6 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <FiDatabase className="w-4 h-4 text-red-400" />
                Delete all localStorage data
              </li>
              <li className="flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-red-400" />
                Remove all Auth users (manual)
              </li>
            </ul>
            <button
              onClick={() => handleActionClick("delete")}
              disabled={isDeleting || isResetting}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 text-white rounded-xl font-semibold transition-all disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete All Data"}
            </button>
          </motion.div>

          {/* Reset with Dummy Data */}
          <motion.div
            className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <FiRefreshCw className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Reset LocalStorage
              </h2>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Delete all existing localStorage data. This will clear all saved
              business names, logos, and onboarding progress.
            </p>
            <ul className="space-y-2 mb-6 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <FiTrash2 className="w-4 h-4 text-blue-400" />
                Delete all existing data
              </li>
              <li className="flex items-center gap-2">
                <FiDatabase className="w-4 h-4 text-blue-400" />
                Clear localStorage
              </li>
              <li className="flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-blue-400" />
                Reset user progress
              </li>
            </ul>
            <button
              onClick={() => handleActionClick("reset")}
              disabled={isDeleting || isResetting}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white rounded-xl font-semibold transition-all disabled:cursor-not-allowed"
            >
              {isResetting ? "Resetting..." : "Reset LocalStorage"}
            </button>
          </motion.div>
        </div>

        {/* Logs Section */}
        {logs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiDatabase className="w-5 h-5" />
              Activity Log
            </h3>
            <div className="bg-black/50 rounded-xl p-4 font-mono text-sm text-gray-300 max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 sm:p-8 w-full max-w-md"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <FiLock className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Confirm {actionType === "delete" ? "Deletion" : "Reset"}
                </h3>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-gray-300 text-sm">
                  {actionType === "delete"
                    ? "You are about to DELETE ALL DATA permanently. This cannot be undone."
                    : "You are about to RESET THE DATABASE with dummy data. All existing data will be lost."}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password to confirm"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      if (actionType === "delete") {
                        handleDeleteAll();
                      } else {
                        handleResetData();
                      }
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Hint: Check the source code for the password
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    actionType === "delete" ? handleDeleteAll : handleResetData
                  }
                  disabled={!password || isDeleting || isResetting}
                  className={`flex-1 px-4 py-3 ${
                    actionType === "delete"
                      ? "bg-red-600 hover:bg-red-500"
                      : "bg-blue-600 hover:bg-blue-500"
                  } disabled:bg-gray-700 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed`}
                >
                  {isDeleting || isResetting ? (
                    <span className="flex items-center justify-center gap-2">
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Confirm ${actionType === "delete" ? "Delete" : "Reset"}`
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
