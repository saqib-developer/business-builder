"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useBrand } from "@/lib/context/BrandContext";
import TemplateLayout from "./TemplateLayout";
import { FiMessageCircle, FiSmile } from "react-icons/fi";
import { TemplateConfig } from "@/lib/types/template";
import { buildWhatsAppLink } from "@/lib/templateCatalog";
import { useTemplateProducts } from "@/hooks/useTemplateProducts";

export default function MinimalBoutiqueTemplate({ config, storeOwnerId, initialPage }: { config?: TemplateConfig; storeOwnerId?: string; initialPage?: "home" | "shop" | "about" }) {
  const { brandSettings } = useBrand();
  const primaryColor = config?.theme?.primaryColor || brandSettings.primaryColor || "#EC4899";
  const secondaryColor = config?.theme?.secondaryColor || brandSettings.secondaryColor || "#8B5CF6";
  const headline = config?.content?.heroHeadline || brandSettings.businessName || "Playful Market";
  const tagline = config?.content?.heroSubheadline || brandSettings.tagline || "Fun colors, friendly flow, direct chat support.";
  const heroImage = config?.content?.heroImage;
  const whatsappNumber = (config?.content?.whatsappNumber || brandSettings.whatsappNumber || "").replace(/\D/g, "");

  const [search, setSearch] = useState("");
  const { products, featuredProducts, isLoading, hasProducts } = useTemplateProducts({ userId: storeOwnerId });

  const filtered = useMemo(
    () => products.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  );

  const card = (item: (typeof products)[number]) => (
    <article
      key={item.id}
      className="rounded-3xl border-4 border-white bg-white p-5 shadow-[0_10px_0_0_rgba(236,72,153,0.2)]"
      style={{ outline: `2px solid ${primaryColor}22` }}
    >
      <Link href={`/shop/${item.id}`} className="block">
        <div className="h-36 rounded-2xl bg-gradient-to-br from-pink-100 via-purple-100 to-sky-100 flex items-center justify-center text-5xl mb-4 overflow-hidden">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl font-semibold text-pink-500">{item.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
        <p className="text-xl font-extrabold mt-3" style={{ color: primaryColor }}>{item.price}</p>
      </Link>
      <div className="mt-4 flex gap-3">
        <Link
          href={`/shop/${item.id}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-pink-100 px-4 py-2.5 text-sm font-bold text-gray-900"
        >
          View Details
        </Link>
        <a
          href={buildWhatsAppLink(whatsappNumber, item.name)}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white ${
            whatsappNumber ? "" : "opacity-60 pointer-events-none"
          }`}
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
        >
          <FiMessageCircle />
          WhatsApp
        </a>
      </div>
    </article>
  );

  const homePage = (
    <>
      <section id="home" className="py-20 bg-gradient-to-b from-pink-50 via-purple-50 to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] mb-3 font-bold" style={{ color: primaryColor }}>Vibrant & Playful</p>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">{headline}</h1>
            <p className="mt-5 text-lg text-gray-700">{tagline}</p>
          </div>
          <div className="h-80 rounded-3xl border-4 border-white bg-white/80 overflow-hidden flex items-center justify-center shadow-lg">
            {heroImage ? (
              <img src={heroImage} alt={`${headline} hero`} className="h-full w-full object-cover" />
            ) : (
              <div className="relative h-full w-full bg-[radial-gradient(circle_at_top_right,_rgba(236,72,153,0.2),_transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(250,245,255,0.92))]">
                <div className="absolute inset-6 rounded-[2rem] border-4 border-dashed border-pink-100 bg-white/25" />
                <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-pink-200/40" />
                <div className="absolute right-10 bottom-10 h-32 w-32 rounded-[2rem] bg-purple-200/40 rotate-12" />
                <FiSmile className="absolute inset-0 m-auto h-12 w-12" style={{ color: primaryColor }} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-y-4 border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full rounded-3xl border-4 border-dashed border-pink-200 bg-pink-50 p-8 text-center text-gray-700">
                Loading featured products...
              </div>
            ) : featuredProducts.length > 0 ? featuredProducts.map(card) : (
              <div className="col-span-full rounded-3xl border-4 border-dashed border-pink-200 bg-pink-50 p-8 text-center text-gray-700">
                New products coming soon!
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );

  const shopPage = (
    <section id="shop" className="py-16 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-black text-gray-900">Shop</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or services..."
            className="w-full md:w-80 rounded-full border-4 border-pink-200 px-4 py-2.5"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full rounded-3xl border-4 border-dashed border-pink-200 bg-pink-50 p-8 text-center text-gray-700">
              Loading products...
            </div>
          ) : filtered.length > 0 ? filtered.map(card) : (
            <div className="col-span-full rounded-3xl border-4 border-dashed border-pink-200 bg-pink-50 p-8 text-center text-gray-700">
              {hasProducts ? "No matching products found." : "New products coming soon!"}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const aboutPage = (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black text-gray-900 mb-4">About Us</h2>
        <p className="text-gray-600 mb-8">We keep things fun and easy while helping customers buy via direct WhatsApp chat.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border-4 border-purple-100 bg-purple-50 p-6">
            <h3 className="font-bold text-gray-900 mb-3">Contact Information</h3>
            <p className="text-sm text-gray-700">Business: {headline}</p>
            <p className="text-sm text-gray-700 mt-1">Primary contact: WhatsApp</p>
            <p className="text-sm text-gray-700 mt-1">Business details are shared once the store goes live.</p>
          </div>
          <div className="rounded-3xl border-4 border-pink-100 bg-pink-50 p-6">
            <h3 className="font-bold text-gray-900 mb-3">Quick WhatsApp Contact</h3>
            <a
              href={buildWhatsAppLink(whatsappNumber, "general inquiry")}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-bold text-white ${
                whatsappNumber ? "" : "opacity-60 pointer-events-none"
              }`}
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
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
      style="minimal"
      config={config}
      homePage={homePage}
      shopPage={shopPage}
      aboutPage={aboutPage}
      initialPage={initialPage}
    />
  );
}
