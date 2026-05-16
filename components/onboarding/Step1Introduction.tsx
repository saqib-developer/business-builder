"use client";

import { FiArrowRight, FiStar, FiAward, FiShare2, FiGlobe } from "react-icons/fi";
import MotivationalQuote from "./MotivationalQuote";

interface Step1IntroductionProps {
  onNext: () => void;
}

export default function Step1Introduction({ onNext }: Step1IntroductionProps) {
  const roadmapSteps = [
    {
      icon: <FiStar className="w-8 h-8" />,
      title: "Name Your Business",
      description: "Choose the perfect name that represents your vision",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: "Design Your Logo",
      description: "Create a professional brand identity that stands out",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <FiShare2 className="w-8 h-8" />,
      title: "Claim Your Social Handles",
      description: "Secure your presence across all major platforms",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: <FiGlobe className="w-8 h-8" />,
      title: "Build Your Website",
      description: "Launch a stunning online presence in minutes",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full mb-6">
          <span className="text-2xl">🚀</span>
          <span className="font-bold">Welcome to Your Business Journey!</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Let&apos;s Build Your Empire Together
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          In just a few simple steps, you&apos;ll go from having an idea to having a complete 
          digital business presence. We&apos;ll guide you through every step of the way!
        </p>
      </div>

      {/* Roadmap */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Your Roadmap to Success</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmapSteps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-white`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-900 text-white rounded-full text-xs font-bold">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="mb-12">
        <MotivationalQuote index={0} />
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-xl"
        >
          Let&apos;s Get Started!
          <FiArrowRight className="w-6 h-6" />
        </button>
        <p className="mt-4 text-gray-500 text-sm">
          This will only take 5-10 minutes ⏱️
        </p>
      </div>
    </div>
  );
}
