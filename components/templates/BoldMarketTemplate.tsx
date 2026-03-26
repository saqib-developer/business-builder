"use client";

import { useBrand } from "@/lib/context/BrandContext";
import TemplateLayout from "@/components/templates/TemplateLayout";
import { FiZap, FiTrendingUp, FiAward } from "react-icons/fi";

import { TemplateConfig } from "@/lib/types/template";

export default function BoldMarketTemplate({ config }: { config?: TemplateConfig }) {
  const { brandSettings } = useBrand();
  const primaryColor = config?.theme?.primaryColor || brandSettings.primaryColor;
  const secondaryColor = config?.theme?.secondaryColor || brandSettings.secondaryColor;
  const headline = config?.content?.heroHeadline || brandSettings.businessName;
  const subheadline = config?.content?.heroSubheadline || brandSettings.tagline;
  const heroImage = config?.content?.heroImage;

  const deals = [
    {
      title: "MEGA DEAL",
      discount: "50% OFF",
      desc: "Limited Time",
      image: "🔥",
    },
    {
      title: "FLASH SALE",
      discount: "40% OFF",
      desc: "Today Only",
      image: "⚡",
    },
    {
      title: "SUPER SAVE",
      discount: "30% OFF",
      desc: "This Week",
      image: "💰",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Power Product",
      price: 79.99,
      oldPrice: 99.99,
      badge: "HOT",
      image: "💪",
    },
    {
      id: 2,
      name: "Mega Item",
      price: 89.99,
      oldPrice: 119.99,
      badge: "SALE",
      image: "🚀",
    },
    {
      id: 3,
      name: "Super Choice",
      price: 69.99,
      oldPrice: 89.99,
      badge: "NEW",
      image: "⭐",
    },
    {
      id: 4,
      name: "Ultimate Pick",
      price: 99.99,
      oldPrice: 139.99,
      badge: "HOT",
      image: "🎯",
    },
    {
      id: 5,
      name: "Epic Deal",
      price: 59.99,
      oldPrice: 79.99,
      badge: "SALE",
      image: "💎",
    },
    {
      id: 6,
      name: "Prime Product",
      price: 109.99,
      oldPrice: 149.99,
      badge: "NEW",
      image: "👑",
    },
  ];

  const features = [
    { icon: <FiZap />, title: "Lightning Fast", desc: "Quick Delivery" },
    { icon: <FiTrendingUp />, title: "Best Prices", desc: "Guaranteed" },
    { icon: <FiAward />, title: "Top Quality", desc: "Premium Products" },
  ];

  return (
    <TemplateLayout style="bold" config={config}>
      {/* Bold Hero */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
              {subheadline.toUpperCase()}
            </h1>
            <p
              className="text-2xl md:text-3xl font-bold mb-8"
              style={{ color: primaryColor }}
            >
              INCREDIBLE DEALS • UNBEATABLE PRICES
            </p>
            <button
              className="px-12 py-5 text-black font-black text-xl hover:scale-105 transition-transform"
              style={{ backgroundColor: primaryColor }}
            >
              SHOP NOW 🔥
            </button>
          </div>
        </div>
      </section>

      {/* Deals Banner */}
      <section
        className="py-12"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {deals.map((deal, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-xl"
              >
                <div className="text-6xl mb-3">{deal.image}</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  {deal.title}
                </h3>
                <div
                  className="text-4xl font-black mb-2"
                  style={{ color: primaryColor }}
                >
                  {deal.discount}
                </div>
                <p className="text-gray-600 font-bold">{deal.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-center space-x-3"
              >
                <div
                  className="text-3xl"
                  style={{ color: primaryColor }}
                >
                  {feature.icon}
                </div>
                <div className="text-left">
                  <div className="font-black text-lg">{feature.title}</div>
                  <div className="text-sm text-gray-400">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid - Bold Style */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              🔥 HOT DEALS 🔥
            </h2>
            <p className="text-xl font-bold text-gray-600">
              LIMITED TIME OFFERS • GRAB THEM NOW!
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border-4 border-transparent hover:border-current"
                style={{ "--hover-color": primaryColor } as any}
              >
                <div className="relative">
                  <div
                    className="absolute top-4 left-4 px-4 py-2 font-black text-white text-sm z-10 transform -rotate-3 shadow-lg"
                    style={{
                      backgroundColor:
                        product.badge === "SALE"
                          ? "#EF4444"
                          : product.badge === "HOT"
                          ? "#F59E0B"
                          : "#10B981",
                    }}
                  >
                    {product.badge}!
                  </div>
                  <div className="h-64 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <div className="text-9xl">{product.image}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-3">
                    {product.name}
                  </h3>
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div
                        className="text-3xl font-black"
                        style={{ color: primaryColor }}
                      >
                        ${product.price}
                      </div>
                      <div className="text-lg text-gray-500 line-through font-bold">
                        ${product.oldPrice}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-red-500">
                        -
                        {Math.round(
                          ((product.oldPrice - product.price) /
                            product.oldPrice) *
                            100
                        )}
                        %
                      </div>
                    </div>
                  </div>
                  <button
                    className="w-full py-4 text-white font-black text-lg hover:scale-105 transition-transform rounded-lg shadow-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    ADD TO CART 🛒
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Bold */}
      <section className="bg-black text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            DON'T MISS OUT!
          </h2>
          <p
            className="text-2xl font-bold mb-8"
            style={{ color: primaryColor }}
          >
            Join 50,000+ Happy Customers Today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 font-bold text-lg border-4 border-white focus:ring-0 outline-none"
            />
            <button
              className="px-10 py-4 rounded-lg font-black text-lg text-black hover:scale-105 transition-transform"
              style={{ backgroundColor: primaryColor }}
            >
              GET DEALS!
            </button>
          </div>
        </div>
      </section>
    </TemplateLayout>
  );
}
