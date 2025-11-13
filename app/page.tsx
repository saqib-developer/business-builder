"use client";

import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import {
  FiShoppingBag,
  FiLayout,
  FiTrendingUp,
  FiPackage,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: <FiLayout className="w-8 h-8" />,
      title: "Pre-Made Templates",
      description:
        "Choose from professionally designed website templates tailored for e-commerce success.",
    },
    {
      icon: <FiShoppingBag className="w-8 h-8" />,
      title: "Easy Product Management",
      description:
        "Add, edit, and organize your products with our intuitive interface.",
    },
    {
      icon: <FiPackage className="w-8 h-8" />,
      title: "Brand Builder",
      description:
        "Create stunning logos and build your brand identity with built-in design tools.",
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: "Business Resources",
      description:
        "Access guides, tips, and resources to grow your online business effectively.",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create your free account in seconds",
    },
    {
      step: "2",
      title: "Build Your Store",
      description: "Choose a template and customize it",
    },
    {
      step: "3",
      title: "Add Products",
      description: "Upload your products with ease",
    },
    {
      step: "4",
      title: "Launch & Grow",
      description: "Go live and start selling",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Launch Your Online Store
            <span className="text-blue-600"> Without the Hassle</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            All-in-one platform to build, design, and manage your e-commerce
            business. No technical skills required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Start Free Today</span>
              <FiArrowRight />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600">
            Powerful tools designed for entrepreneurs, not developers
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Four simple steps to launch your online business
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Build Your Business?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of entrepreneurs who trust E-Commerce Launchpad
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <span>Create Your Account</span>
            <FiCheckCircle />
          </Link>
        </div>
      </section>
    </div>
  );
}
