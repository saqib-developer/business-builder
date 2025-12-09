"use client";

import { MOTIVATIONAL_QUOTES } from "@/lib/types/onboarding";
import { FiStar } from "react-icons/fi";

interface MotivationalQuoteProps {
  index?: number;
}

export default function MotivationalQuote({ index }: MotivationalQuoteProps) {
  // If no index provided, pick a random quote
  const quoteIndex = index ?? Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  const quote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
            <FiStar className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <blockquote className="text-xl md:text-2xl font-medium text-gray-800 italic mb-3 leading-relaxed">
            "{quote.text}"
          </blockquote>
          <p className="text-gray-600 font-semibold">— {quote.author}</p>
        </div>
      </div>
    </div>
  );
}
