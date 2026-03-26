"use client";

import { useBrand } from "@/lib/context/BrandContext";
import TemplateLayout from "@/components/templates/TemplateLayout";
import { FiArrowRight } from "react-icons/fi";

import { TemplateConfig } from "@/lib/types/template";

export default function MinimalBoutiqueTemplate({ config }: { config?: TemplateConfig }) {
  const { brandSettings } = useBrand();
  const primaryColor = config?.theme?.primaryColor || brandSettings.primaryColor;
  const secondaryColor = config?.theme?.secondaryColor || brandSettings.secondaryColor;
  const headline = config?.content?.heroHeadline || brandSettings.businessName;
  const subheadline = config?.content?.heroSubheadline || brandSettings.tagline;
  const heroImage = config?.content?.heroImage;

  const collections = [
    { name: "Spring Collection", items: 24, image: "🌸" },
    { name: "Summer Essentials", items: 32, image: "☀️" },
    { name: "Autumn Favorites", items: 28, image: "🍂" },
  ];

  const featuredProducts = [
    { id: 1, name: "Elegant Piece", price: 149.99, image: "👗" },
    { id: 2, name: "Timeless Classic", price: 199.99, image: "👔" },
    { id: 3, name: "Refined Choice", price: 179.99, image: "👜" },
    { id: 4, name: "Sophisticated Item", price: 169.99, image: "👠" },
  ];

  return (
    <TemplateLayout style="minimal" config={config}>
      {/* Hero - Minimal */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className="text-sm font-medium mb-4 tracking-widest uppercase"
            style={{ color: primaryColor }}
          >
            {headline}
          </p>
          <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight">
            {subheadline}
          </h1>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
            Discover our carefully curated collection of timeless pieces
          </p>
          <button
            className="px-8 py-3 border-2 font-medium hover:text-white transition-colors"
            style={{
              borderColor: primaryColor,
              color: primaryColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                primaryColor;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = primaryColor;
            }}
          >
            Explore Collection
          </button>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="aspect-[16/9] bg-gray-100 rounded-sm flex items-center justify-center">
            <div className="text-center">
              <div className="text-9xl mb-4">✨</div>
              <p className="text-gray-500 italic">Featured Collection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-gray-900 mb-12 text-center">
            Collections
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-gray-50 mb-4 flex items-center justify-center overflow-hidden">
                  <div className="text-8xl transform group-hover:scale-105 transition-transform duration-500">
                    {collection.image}
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {collection.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {collection.items} items
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products - Minimal Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-light text-gray-900">Featured</h2>
            <a
              href="#"
              className="flex items-center space-x-2 text-sm hover:opacity-70 transition-opacity"
              style={{ color: primaryColor }}
            >
              <span>View All</span>
              <FiArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-white mb-4 flex items-center justify-center overflow-hidden border border-gray-100">
                  <div className="text-8xl transform group-hover:scale-105 transition-transform duration-500">
                    {product.image}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: primaryColor }}
                >
                  ${product.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6">
            Our Philosophy
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            We believe in the power of simplicity. Each piece in our collection
            is thoughtfully selected to bring elegance and refinement to your
            everyday life. Quality over quantity, always.
          </p>
          <div className="h-px w-24 bg-gray-300 mx-auto"></div>
        </div>
      </section>

      {/* Newsletter - Minimal */}
      <section className="py-16 border-t border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-8">
            Subscribe to receive updates on new arrivals and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-6 py-3 border border-gray-300 focus:border-gray-900 focus:ring-0 outline-none text-sm"
            />
            <button
              className="px-8 py-3 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: primaryColor }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </TemplateLayout>
  );
}
