"use client";

import { useBrand } from "@/lib/context/BrandContext";
import TemplateLayout from "@/components/templates/TemplateLayout";
import { FiTag, FiAward, FiUsers, FiHeart } from "react-icons/fi";

export default function ClassicStoreTemplate() {
  const { brandSettings } = useBrand();

  const categories = [
    { name: "New Arrivals", icon: "🆕", count: 24 },
    { name: "Best Sellers", icon: "⭐", count: 18 },
    { name: "On Sale", icon: "🏷️", count: 32 },
    { name: "Trending", icon: "📈", count: 15 },
  ];

  const products = [
    {
      id: 1,
      name: "Classic Item",
      price: 59.99,
      oldPrice: 79.99,
      badge: "SALE",
      image: "📦",
    },
    {
      id: 2,
      name: "Traditional Product",
      price: 89.99,
      badge: "NEW",
      image: "🎁",
    },
    {
      id: 3,
      name: "Popular Item",
      price: 69.99,
      oldPrice: 89.99,
      badge: "SALE",
      image: "🛒",
    },
    {
      id: 4,
      name: "Featured Product",
      price: 99.99,
      badge: "HOT",
      image: "💼",
    },
    { id: 5, name: "Quality Item", price: 79.99, image: "📱" },
    { id: 6, name: "Premium Choice", price: 119.99, badge: "NEW", image: "⌚" },
  ];

  const stats = [
    { icon: <FiUsers />, value: "10K+", label: "Happy Customers" },
    { icon: <FiAward />, value: "500+", label: "Products" },
    { icon: <FiTag />, value: "50+", label: "Categories" },
    { icon: <FiHeart />, value: "99%", label: "Satisfaction" },
  ];

  return (
    <TemplateLayout style="classic">
      {/* Announcement Bar */}
      <div
        className="text-center py-2 text-sm text-white"
        style={{ backgroundColor: brandSettings.primaryColor }}
      >
        🎉 Free Shipping on Orders Over $50 | Shop Now and Save!
      </div>

      {/* Hero Banner */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Welcome to {brandSettings.businessName}
            </h1>
            <p className="text-2xl text-gray-600 mb-8">
              {brandSettings.tagline}
            </p>
            <button
              className="px-10 py-4 rounded-md text-white font-semibold text-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: brandSettings.primaryColor }}
            >
              Start Shopping
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                style={{ "--hover-color": brandSettings.primaryColor } as any}
              >
                <div className="text-5xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">{category.count} items</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600">Check out our best selling products</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {product.badge && (
                  <div className="relative">
                    <span
                      className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white z-10"
                      style={{
                        backgroundColor:
                          product.badge === "SALE"
                            ? "#EF4444"
                            : product.badge === "NEW"
                            ? "#10B981"
                            : "#F59E0B",
                      }}
                    >
                      {product.badge}
                    </span>
                  </div>
                )}
                <div className="relative h-64 bg-gray-100 flex items-center justify-center">
                  <div className="text-8xl">{product.image}</div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span
                        className="text-2xl font-bold"
                        style={{ color: brandSettings.primaryColor }}
                      >
                        ${product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${product.oldPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="w-full py-3 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: brandSettings.primaryColor }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl"
                  style={{ backgroundColor: brandSettings.primaryColor }}
                >
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section
        className="py-16"
        style={{ backgroundColor: brandSettings.primaryColor }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Get the latest updates on new products and exclusive offers!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-3 rounded-md border-none focus:ring-2 focus:ring-white outline-none"
            />
            <button
              className="px-8 py-3 bg-white rounded-md font-semibold hover:bg-gray-100 transition-colors"
              style={{ color: brandSettings.primaryColor }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </TemplateLayout>
  );
}
