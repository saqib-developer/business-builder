"use client";

import { ReactNode } from "react";
import { useBrand } from "@/lib/context/BrandContext";
import { TemplateConfig } from "@/lib/types/template";
import {
  FiShoppingBag,
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiMenu,
} from "react-icons/fi";

interface TemplateLayoutProps {
  children: ReactNode;
  style: "modern" | "classic" | "minimal" | "bold";
  config?: TemplateConfig;
}

export default function TemplateLayout({
  children,
  style,
  config,
}: TemplateLayoutProps) {
  const { brandSettings } = useBrand();

  const primaryColor = config?.theme?.primaryColor || brandSettings?.primaryColor || "#3b82f6";
  const secondaryColor = config?.theme?.secondaryColor || brandSettings?.secondaryColor || "#1e40af";
  const businessName = brandSettings?.businessName || "My Business";
  const tagline = brandSettings?.tagline || "";

  const navLinks = ["Home", "Shop", "About", "Contact"];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`border-b ${
          style === "bold" ? "bg-black text-white" : "bg-white text-gray-900"
        }`}
        style={{
          borderColor:
            style === "minimal"
              ? "#f3f4f6"
              : secondaryColor + "30",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <FiShoppingBag
                className="w-8 h-8"
                style={{ color: primaryColor }}
              />
              <span
                className={`text-xl font-bold ${
                  style === "bold" ? "text-white" : ""
                }`}
              >
                {businessName}
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className={`hover:opacity-70 transition-opacity ${
                    style === "bold" ? "text-white" : "text-gray-700"
                  }`}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button className="hover:opacity-70">
                <FiSearch className="w-5 h-5" />
              </button>
              <button className="hover:opacity-70">
                <FiUser className="w-5 h-5" />
              </button>
              <button className="hover:opacity-70 relative">
                <FiShoppingCart className="w-5 h-5" />
                <span
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  0
                </span>
              </button>
              <button className="md:hidden">
                <FiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer
        className={`border-t mt-16 ${
          style === "bold" ? "bg-black text-white" : "bg-gray-50 text-gray-900"
        }`}
        style={{
          borderColor:
            style === "minimal"
              ? "#f3f4f6"
              : secondaryColor + "30",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FiShoppingBag
                  className="w-6 h-6"
                  style={{ color: primaryColor }}
                />
                <span className="font-bold">{businessName}</span>
              </div>
              <p
                className={`text-sm ${
                  style === "bold" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {tagline}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul
                className={`space-y-2 text-sm ${
                  style === "bold" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <li>
                  <a href="#" className="hover:opacity-70">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-70">
                    Best Sellers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-70">
                    Sale
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul
                className={`space-y-2 text-sm ${
                  style === "bold" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <li>
                  <a href="#" className="hover:opacity-70">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-70">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-70">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul
                className={`space-y-2 text-sm ${
                  style === "bold" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <li>
                  <a href="#" className="hover:opacity-70">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-70">
                    Shipping
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-70">
                    Returns
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`border-t mt-8 pt-8 text-center text-sm ${
              style === "bold"
                ? "text-gray-400 border-gray-800"
                : "text-gray-600 border-gray-200"
            }`}
          >
            <p>
              &copy; 2025 {businessName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
