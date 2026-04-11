"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useBrand } from "@/lib/context/BrandContext";
import TemplateLayout from "./TemplateLayout";
import { FiArrowRight, FiMessageCircle } from "react-icons/fi";
import { TemplateConfig } from "@/lib/types/template";
import { buildWhatsAppLink } from "@/lib/templateCatalog";
import { useTemplateProducts } from "@/hooks/useTemplateProducts";

export default function ModernShopTemplate({ config, storeOwnerId, initialPage }: { config?: TemplateConfig; storeOwnerId?: string; initialPage?: "home" | "shop" | "about" }) {
  const { brandSettings } = useBrand();
  const primaryColor = config?.theme?.primaryColor || brandSettings.primaryColor || "#1D4ED8";
  const headline = config?.content?.heroHeadline || brandSettings.businessName || "Minimal Studio";
  const tagline = config?.content?.heroSubheadline || brandSettings.tagline || "Simple products, clear value.";
  const heroImage = config?.content?.heroImage;
  const whatsappNumber = (config?.content?.whatsappNumber || brandSettings.whatsappNumber || "").replace(/\D/g, "");

  const [search, setSearch] = useState("");
  const { products, featuredProducts, isLoading, hasProducts } = useTemplateProducts({ userId: storeOwnerId });

  const filtered = useMemo(
    () => products.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  );

  const productCard = (product: (typeof products)[number]) => (
    <article key={product.id} className="border border-gray-200 bg-white p-5 transition-transform hover:-translate-y-1">
      <Link href={`/shop/${product.id}`} className="block">
        <div className="h-40 rounded-lg bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center text-5xl mb-4 overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl font-semibold text-slate-500">{product.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        <p className="text-xl font-bold mt-3" style={{ color: primaryColor }}>{product.price}</p>
      </Link>
      <div className="mt-4 flex gap-3">
        <Link
          href={`/shop/${product.id}`}
          className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 text-gray-900"
        >
          View Details
        </Link>
        <a
          href={buildWhatsAppLink(whatsappNumber, product.name)}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-white text-sm font-medium ${
            whatsappNumber ? "" : "opacity-60 pointer-events-none"
          }`}
          style={{ backgroundColor: primaryColor }}
        >
          <FiMessageCircle />
          WhatsApp
        </a>
      </div>
    </article>
  );

  const homePage = (
    <>
      <section id="home" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: primaryColor }}>Minimal & Airy</p>
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 leading-tight">{headline}</h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl">{tagline}</p>
            <button
              onClick={() => window.scrollTo({ top: 560, behavior: "smooth" })}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-white"
              style={{ backgroundColor: primaryColor }}
            >
              View Featured
              <FiArrowRight />
            </button>
          </div>
          <div className="h-96 border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
            {heroImage ? (
              <img src={heroImage} alt={`${headline} hero`} className="h-full w-full object-cover" />
            ) : (
              <div className="relative h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(29,78,216,0.16),_transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(241,245,249,0.9))]">
                <div className="absolute inset-6 rounded-3xl border border-white/70 bg-white/30 backdrop-blur-sm" />
                <div className="absolute left-10 top-10 h-28 w-28 rounded-full bg-white/70" />
                <div className="absolute right-10 bottom-10 h-40 w-40 rounded-[2rem] bg-slate-900/10 rotate-12" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light text-gray-900 mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full p-8 text-center text-gray-600">Loading featured products...</div>
            ) : featuredProducts.length > 0 ? featuredProducts.map(productCard) : (
              <div className="col-span-full border border-gray-200 bg-white p-8 text-center text-gray-600">
                New products coming soon!
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );

  const shopPage = (
    <section id="shop" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-light text-gray-900">Shop</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or services..."
            className="w-full md:w-80 border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2"
            style={{ boxShadow: `0 0 0 0px ${primaryColor}` }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full border border-gray-200 bg-slate-50 p-8 text-center text-gray-600">
              Loading products...
            </div>
          ) : filtered.length > 0 ? filtered.map(productCard) : (
            <div className="col-span-full border border-gray-200 bg-slate-50 p-8 text-center text-gray-600">
              {hasProducts ? "No matching products found." : "New products coming soon!"}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const aboutPage = (
    <section id="about" className="py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-light text-gray-900 mb-4">About Us</h2>
        <p className="text-gray-600 mb-8">
          We help customers choose the right package quickly with transparent communication and direct WhatsApp support.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
            <p className="text-sm text-gray-600">Business: {headline}</p>
            <p className="text-sm text-gray-600 mt-1">Primary contact: WhatsApp</p>
            <p className="text-sm text-gray-600 mt-1">Response times and service area are shared after launch.</p>
          </div>
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Quick WhatsApp Contact</h3>
            <a
              href={buildWhatsAppLink(whatsappNumber, "general inquiry")}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-white font-medium ${
                whatsappNumber ? "" : "opacity-60 pointer-events-none"
              }`}
              style={{ backgroundColor: primaryColor }}
            >
              <FiMessageCircle />
              Contact on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <TemplateLayout
      style="modern"
      config={config}
      homePage={homePage}
      shopPage={shopPage}
      aboutPage={aboutPage}
      initialPage={initialPage}
    />
  );
}
