"use client";

import { useState } from "react";
import { FiArrowRight, FiCheckCircle, FiExternalLink, FiAlertCircle } from "react-icons/fi";
import { FaTiktok, FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import MotivationalQuote from "./MotivationalQuote";
import { SocialMediaSetup } from "@/lib/types/onboarding";

interface Step4SocialMediaProps {
  initialValue?: SocialMediaSetup;
  onNext: (socialData: SocialMediaSetup) => void;
  onBack: () => void;
}

export default function Step4SocialMedia({
  initialValue,
  onNext,
  onBack,
}: Step4SocialMediaProps) {
  const [socialMedia, setSocialMedia] = useState<SocialMediaSetup>(
    initialValue || {
      tiktok: { clicked: false },
      instagram: { clicked: false },
      facebook: { clicked: false },
      whatsapp: { clicked: false },
    }
  );
  const [showSkipModal, setShowSkipModal] = useState(false);

  const platforms = [
    {
      id: "tiktok" as keyof SocialMediaSetup,
      name: "TikTok",
      icon: FaTiktok,
      signupUrl: "https://www.tiktok.com/signup",
      color: "bg-black",
      hoverColor: "hover:bg-gray-800",
    },
    {
      id: "instagram" as keyof SocialMediaSetup,
      name: "Instagram",
      icon: FaInstagram,
      signupUrl: "https://www.instagram.com/accounts/emailsignup/",
      color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
      hoverColor: "hover:opacity-90",
    },
    {
      id: "facebook" as keyof SocialMediaSetup,
      name: "Facebook",
      icon: FaFacebook,
      signupUrl: "https://www.facebook.com/pages/create",
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      id: "whatsapp" as keyof SocialMediaSetup,
      name: "WhatsApp Business",
      icon: FaWhatsapp,
      signupUrl: "https://www.whatsapp.com/business",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
  ];

  const handlePlatformClick = (platformId: keyof SocialMediaSetup, url: string) => {
    // Mark as clicked
    setSocialMedia((prev) => ({
      ...prev,
      [platformId]: {
        ...prev[platformId],
        clicked: true,
      },
    }));

    // Open in new tab
    window.open(url, "_blank");
  };

  const allPlatformsClicked = Object.values(socialMedia).every((platform) => platform.clicked);
  const completedCount = Object.values(socialMedia).filter((platform) => platform.clicked).length;

  const handleContinue = () => {
    if (allPlatformsClicked) {
      onNext(socialMedia);
    } else {
      setShowSkipModal(true);
    }
  };

  const handleSkip = () => {
    setShowSkipModal(false);
    onNext(socialMedia);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl mb-6">
          <FiCheckCircle className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Claim Your Social Media Handles
        </h1>
        
        <p className="text-xl text-gray-600 mb-6">
          Secure your business name across all major platforms 🚀
        </p>

        {/* Progress Indicator */}
        <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-700 px-6 py-3 rounded-full">
          <span className="font-bold text-lg">{completedCount} / {platforms.length}</span>
          <span>Platforms Secured</span>
        </div>
      </div>

      {/* Social Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {platforms.map((platform) => {
          const isCompleted = socialMedia[platform.id].clicked;
          const Icon = platform.icon;

          return (
            <div
              key={platform.id}
              className={`relative bg-white rounded-2xl p-6 border-2 transition-all ${
                isCompleted
                  ? "border-green-500 shadow-lg"
                  : "border-gray-200 hover:border-blue-300 hover:shadow-md"
              }`}
            >
              {/* Completed Badge */}
              {isCompleted && (
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <FiCheckCircle className="w-7 h-7 text-white" />
                </div>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 ${platform.color} rounded-xl flex items-center justify-center text-white text-3xl`}>
                  <Icon />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{platform.name}</h3>
                  <p className="text-sm text-gray-500">
                    {isCompleted ? "✓ Visited" : "Not visited yet"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handlePlatformClick(platform.id, platform.signupUrl)}
                className={`w-full flex items-center justify-center gap-2 ${platform.color} ${platform.hoverColor} text-white px-6 py-3 rounded-lg font-semibold transition-all`}
              >
                {isCompleted ? "Visit Again" : "Create Account"}
                <FiExternalLink className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200 mb-8">
        <div className="flex items-start gap-4">
          <FiAlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Why This Matters</h3>
            <p className="text-gray-700 mb-3">
              Claiming your business name across all platforms ensures consistency and prevents 
              others from using your brand name. This is crucial for:
            </p>
            <ul className="space-y-1 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Building trust with your customers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Maximizing your reach and visibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Protecting your brand identity</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="mb-8">
        <MotivationalQuote index={3} />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <button
          onClick={onBack}
          className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
        >
          {allPlatformsClicked ? "Continue" : "Skip for Now"}
          <FiArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Skip Confirmation Modal */}
      {showSkipModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Are You Sure?
              </h3>
              <p className="text-gray-600">
                We highly recommend securing all handles to maximize your client reach and 
                protect your brand identity!
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowSkipModal(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Go Back and Complete
              </button>
              <button
                onClick={handleSkip}
                className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Skip Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
