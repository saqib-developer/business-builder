"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  FiShoppingBag,
  FiLayout,
  FiPackage,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in?redirect=/dashboard");
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

  if (!user) {
    return null;
  }

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
            Let's build something amazing today. Start by choosing a template or
            adding products.
          </p>
        </div>

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
