"use client";

import { useBrand } from "@/lib/context/BrandContext";
import TemplateLayout from "@/components/templates/TemplateLayout";
import {
  FiArrowRight,
  FiStar,
  FiTruck,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";

export default function ModernShopTemplate() {
  const { brandSettings } = useBrand();

  const products = [
    { id: 1, name: "Premium Product", price: 99.99, rating: 4.5, image: "🎨" },
    { id: 2, name: "Bestseller Item", price: 79.99, rating: 5.0, image: "✨" },
    {
      id: 3,
      name: "Featured Product",
      price: 129.99,
      rating: 4.8,
      image: "🌟",
    },
    { id: 4, name: "Popular Choice", price: 89.99, rating: 4.7, image: "💎" },
  ];

  const features = [
    { icon: <FiTruck />, title: "Free Shipping", desc: "On orders over $50" },
    { icon: <FiShield />, title: "Secure Payment", desc: "100% protected" },
    { icon: <FiRefreshCw />, title: "Easy Returns", desc: "30-day guarantee" },
  ];

  return (
    <TemplateLayout style="modern">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-50 to-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {brandSettings.tagline}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover our curated collection of premium products designed to
                elevate your lifestyle.
              </p>
              <button
                className="px-8 py-4 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity flex items-center space-x-2"
                style={{ backgroundColor: brandSettings.primaryColor }}
              >
                <span>Shop Now</span>
                <FiArrowRight />
              </button>
            </div>
            <div className="relative h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <div className="text-9xl">🛍️</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: brandSettings.primaryColor }}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked items just for you
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                  <div className="text-8xl transform group-hover:scale-110 transition-transform duration-300">
                    {product.image}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? "fill-current" : ""
                        }`}
                        style={{ color: "#FCD34D" }}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.rating})
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: brandSettings.primaryColor }}
                    >
                      ${product.price}
                    </span>
                    <button
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: brandSettings.primaryColor }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16"
        style={{ backgroundColor: brandSettings.primaryColor + "10" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Subscribe to get exclusive offers and updates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              className="px-8 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: brandSettings.primaryColor }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </TemplateLayout>
  );
}
