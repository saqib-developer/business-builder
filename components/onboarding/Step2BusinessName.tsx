"use client";

import { useState } from "react";
import { FiArrowRight, FiEdit3, FiCheckCircle } from "react-icons/fi";
import MotivationalQuote from "./MotivationalQuote";

interface Step2BusinessNameProps {
  initialValue?: string;
  onNext: (businessName: string) => void;
  onBack: () => void;
  isEditing?: boolean;
}

export default function Step2BusinessName({
  initialValue = "",
  onNext,
  onBack,
  isEditing = false,
}: Step2BusinessNameProps) {
  const [businessName, setBusinessName] = useState(initialValue);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessName.trim()) {
      setError("Please enter your business name");
      return;
    }

    if (businessName.trim().length < 2) {
      setError("Business name must be at least 2 characters");
      return;
    }

    onNext(businessName.trim());
  };

  const suggestions = [
    "Keep it simple and memorable",
    "Make sure it's easy to spell",
    "Check if domain is available",
    "Ensure social handles are available",
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6">
          <FiEdit3 className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          What's Your Business Name?
        </h1>

        <p className="text-xl text-gray-600">
          This is the foundation of your brand. Choose wisely! ✨
        </p>
      </div>

      {/* Business Name Input */}
      <form onSubmit={handleSubmit} className="mb-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 mb-8">
          <label
            htmlFor="businessName"
            className="block text-lg font-semibold text-gray-900 mb-3"
          >
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            value={businessName}
            onChange={(e) => {
              setBusinessName(e.target.value);
              setError("");
            }}
            placeholder="e.g., Elite Fashion Boutique"
            className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all"
            autoFocus
          />
          {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5 text-blue-600" />
            Tips for a Great Business Name
          </h3>
          <ul className="space-y-2">
            {suggestions.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-blue-600 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Motivational Quote */}
        <div className="mb-8">
          <MotivationalQuote index={1} />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            {isEditing ? "Back to Dashboard" : "Back"}
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
          >
            {isEditing ? (
              <>
                <FiCheckCircle className="w-5 h-5" />
                Save Changes
              </>
            ) : (
              <>
                Continue
                <FiArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
