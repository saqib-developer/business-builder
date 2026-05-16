"use client";

import { MOTIVATIONAL_QUOTES } from "@/lib/types/onboarding";
import { FiStar } from "react-icons/fi";
import { useEffect, useState } from "react";

interface MotivationalQuoteProps {
  index?: number;
}

export default function MotivationalQuote({ index }: MotivationalQuoteProps) {
  const [randIndex, setRandIndex] = useState<number | null>(null);

  useEffect(() => {
    if (typeof index === "undefined") {
      // Defer to avoid synchronous setState in effect
      setTimeout(() => setRandIndex(Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)), 0);
    }
  }, [index]);

  const quoteIndex = index ?? (randIndex ?? 0);
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
            &ldquo;{quote.text}&rdquo;
          </blockquote>
          <p className="text-gray-600 font-semibold">— {quote.author}</p>
        </div>
      </div>
    </div>
  );
}
