"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useBrand } from "@/lib/context/BrandContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiShoppingBag,
  FiLayout,
  FiPackage,
  FiTrendingUp,
  FiUser,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit,
  FiGlobe,
  FiShare2,
  FiAward,
  FiClock,
} from "react-icons/fi";
import { OnboardingData } from "@/lib/types/onboarding";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { onboardingData, brandSettings } = useBrand();
  const router = useRouter();
  const [localOnboardingData, setLocalOnboardingData] = useState<Partial<OnboardingData> | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in?redirect=/dashboard");
      return;
    }

    // Check if user needs onboarding
    if (user && !loading) {
      const saved = localStorage.getItem(`onboarding_${user.id}`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setLocalOnboardingData(data);
          
          // If onboarding not complete, redirect to onboarding
          if (!data.isComplete) {
            router.push("/onboarding");
          }
        } catch (error) {
          console.error("Error loading onboarding:", error);
          router.push("/onboarding");
        }
      } else {
        // No onboarding data, redirect to onboarding
        router.push("/onboarding");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !localOnboardingData?.isComplete) {
    return null;
  }

  const completionPercentage = localOnboardingData?.completedSteps 
    ? (localOnboardingData.completedSteps.length / 5) * 100 
    : 0;

  const quickActions = [
    {
      icon: <FiLayout className="w-6 h-6" />,
      title: "Choose Template",
      description: "Select from our pre-made website templates",
      href: "/templates",
      color: "bg-blue-500",
    },
    {
      icon: <FiPackage className="w-6 h-6" />,
      title: "Add Products",
      description: "Start adding products to your store",
      href: "#",
      color: "bg-green-500",
    },
    {
      icon: <FiShoppingBag className="w-6 h-6" />,
      title: "Brand Builder",
      description: "Create your logo and brand identity",
      href: "/templates/settings",
      color: "bg-purple-500",
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Analytics",
      description: "View your store performance",
      href: "#",
      color: "bg-orange-500",
    },
  ];

  const stats = [
    { label: "Products", value: "0", icon: <FiPackage className="w-5 h-5" /> },
    {
      label: "Orders",
      value: "0",
      icon: <FiShoppingBag className="w-5 h-5" />,
    },
    {
      label: "Revenue",
      value: "$0",
      icon: <FiTrendingUp className="w-5 h-5" />,
    },
    { label: "Visitors", value: "0", icon: <FiUser className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName || user.email}! 👋
          </h1>
          <p className="text-gray-600">
            Here's an overview of your business progress.
          </p>
        </div>

        {/* Business Overview Card */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{localOnboardingData.businessName || "Your Business"}</h2>
              <p className="text-blue-100">Your digital empire is taking shape! 🚀</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <div className="text-sm text-blue-100">Setup Complete</div>
              <div className="text-2xl font-bold">{completionPercentage}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Business Name */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <FiEdit className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Business Name</span>
              </div>
              <p className="text-sm text-blue-100">✓ Configured</p>
            </div>

            {/* Logo */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <FiAward className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Logo</span>
              </div>
              <p className="text-sm text-blue-100">
                {localOnboardingData.logo?.type ? `✓ ${localOnboardingData.logo.type}` : "Not set"}
              </p>
            </div>

            {/* Social Media */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <FiShare2 className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Social Media</span>
              </div>
              <p className="text-sm text-blue-100">
                {localOnboardingData.socialMedia 
                  ? `${Object.values(localOnboardingData.socialMedia).filter(p => p.clicked).length}/4 platforms`
                  : "0/4 platforms"}
              </p>
            </div>

            {/* Website */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <FiGlobe className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Website</span>
              </div>
              <p className="text-sm text-blue-100">
                {localOnboardingData.website?.type ? `✓ ${localOnboardingData.website.type}` : "Not set"}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Current Status */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiCheckCircle className="w-6 h-6 text-green-500" />
              Your Business Setup
            </h3>

            <div className="space-y-4">
              {/* Business Name */}
              <div className="flex items-start justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Business Name</h4>
                    <p className="text-sm text-gray-600">{localOnboardingData.businessName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => router.push("/onboarding")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
              </div>

              {/* Logo */}
              <div className={`flex items-start justify-between p-4 rounded-lg border ${
                localOnboardingData.logo?.type 
                  ? "bg-green-50 border-green-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}>
                <div className="flex items-start gap-3">
                  {localOnboardingData.logo?.type ? (
                    <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <FiAlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">Logo</h4>
                    <p className="text-sm text-gray-600">
                      {localOnboardingData.logo?.type 
                        ? `${localOnboardingData.logo.type} logo`
                        : "Add a logo to strengthen your brand"}
                    </p>
                  </div>
                </div>
                {localOnboardingData.logo?.url && (
                  <img 
                    src={localOnboardingData.logo.url} 
                    alt="Logo" 
                    className="w-12 h-12 object-contain rounded"
                  />
                )}
              </div>

              {/* Social Media */}
              <div className="flex items-start justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <FiShare2 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Social Media</h4>
                    <p className="text-sm text-gray-600">
                      {localOnboardingData.socialMedia 
                        ? `${Object.values(localOnboardingData.socialMedia).filter(p => p.clicked).length} platforms secured`
                        : "No platforms set up yet"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-start gap-3">
                  <FiGlobe className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Website</h4>
                    <p className="text-sm text-gray-600">
                      {localOnboardingData.website?.templateId 
                        ? "Template selected - ready to customize"
                        : localOnboardingData.website?.type || "Not configured"}
                    </p>
                  </div>
                </div>
                {localOnboardingData.website?.templateId && (
                  <Link
                    href={`/templates/preview/${localOnboardingData.website.templateId}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Preview
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiTrendingUp className="w-6 h-6 text-blue-500" />
              Next Steps
            </h3>

            <div className="space-y-3">
              <Link
                href="/templates"
                className="block p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <FiLayout className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">Customize Your Website</h4>
                    <p className="text-sm text-gray-600">Edit colors, text, and images</p>
                  </div>
                </div>
              </Link>

              <div className="block p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center text-white">
                    <FiGlobe className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Domain & Hosting</h4>
                    <p className="text-sm text-gray-600">Coming Soon (FYP Phase 2)</p>
                  </div>
                  <FiClock className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="block p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center text-white">
                    <FiPackage className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Add Products</h4>
                    <p className="text-sm text-gray-600">Coming Soon (FYP Phase 2)</p>
                  </div>
                  <FiClock className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="block p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center text-white">
                    <FiShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Launch Store</h4>
                    <p className="text-sm text-gray-600">Coming Soon (FYP Phase 2)</p>
                  </div>
                  <FiClock className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200 text-center">
          <blockquote className="text-2xl font-medium text-gray-800 italic mb-3">
            "The secret of getting ahead is getting started."
          </blockquote>
          <p className="text-gray-600 font-semibold">— Mark Twain</p>
        </div>
      </main>
    </div>
  );
}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </span>
                <div className="text-blue-600">{stat.icon}</div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${action.color} p-3 rounded-lg text-white`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold mb-2">1</div>
              <h3 className="font-semibold mb-1">Choose Your Template</h3>
              <p className="text-blue-100 text-sm">
                Browse our collection of professional templates
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">2</div>
              <h3 className="font-semibold mb-1">Add Your Products</h3>
              <p className="text-blue-100 text-sm">
                Upload products with descriptions and images
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">3</div>
              <h3 className="font-semibold mb-1">Launch Your Store</h3>
              <p className="text-blue-100 text-sm">
                Go live and start selling to customers
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
