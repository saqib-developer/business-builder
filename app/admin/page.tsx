"use client";

import Link from "next/link";
import { FiMessageSquare, FiArrowRight } from "react-icons/fi";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">Manage your platform</p>
        </div>

        {/* Messages Card */}
        <Link
          href="/admin/messages"
          className="block bg-white rounded-2xl p-8 sm:p-12 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FiMessageSquare className="w-10 h-10" />
              </div>

              {/* Content */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Messages
                </h2>
                <p className="text-gray-600">
                  View and respond to customer messages
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                    4 Active Conversations
                  </span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all">
              <FiArrowRight className="w-8 h-8" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
