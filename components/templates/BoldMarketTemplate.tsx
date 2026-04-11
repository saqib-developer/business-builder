"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useBrand } from "@/lib/context/BrandContext";
import TemplateLayout from "./TemplateLayout";
import { FiBriefcase, FiMessageCircle } from "react-icons/fi";
import { TemplateConfig } from "@/lib/types/template";
import { buildWhatsAppLink } from "@/lib/templateCatalog";
import { useTemplateProducts } from "@/hooks/useTemplateProducts";

export default function BoldMarketTemplate({ config, storeOwnerId, initialPage }: { config?: TemplateConfig; storeOwnerId?: string; initialPage?: "home" | "shop" | "about" }) {
  const { brandSettings } = useBrand();
  const primaryColor = config?.theme?.primaryColor || brandSettings.primaryColor || "#0F172A";
  const secondaryColor = config?.theme?.secondaryColor || brandSettings.secondaryColor || "#334155";
  const headline = config?.content?.heroHeadline || brandSettings.businessName || "Corporate Solutions";
  const tagline = config?.content?.heroSubheadline || brandSettings.tagline || "Structured services with clear delivery outcomes.";
  const heroImage = config?.content?.heroImage;
  const whatsappNumber = (config?.content?.whatsappNumber || brandSettings.whatsappNumber || "").replace(/\D/g, "");

  const [search, setSearch] = useState("");
  const { products, featuredProducts, isLoading, hasProducts } = useTemplateProducts({ userId: storeOwnerId });

  const filtered = useMemo(
    () => products.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  );

  const card = (item: (typeof products)[number]) => (
    <article key={item.id} className="border border-slate-300 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1">
      <Link href={`/shop/${item.id}`} className="block">
        <div className="h-36 border border-slate-200 bg-slate-50 flex items-center justify-center text-5xl mb-4 overflow-hidden">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl font-semibold text-slate-500">{item.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
        <p className="text-sm text-slate-600 mt-1">{item.description}</p>
        <p className="text-xl font-bold mt-3" style={{ color: primaryColor }}>{item.price}</p>
      </Link>
      <div className="mt-4 flex gap-3">
        <Link
          href={`/shop/${item.id}`}
          className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold border border-slate-300 text-slate-900"
        >
          View Details
        </Link>
        <a
          href={buildWhatsAppLink(whatsappNumber, item.name)}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white ${
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
      <section id="home" className="py-16 bg-slate-100 border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-3 font-semibold" style={{ color: secondaryColor }}>
              Structured Corporate
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">{headline}</h1>
            <p className="mt-5 text-lg text-slate-700 max-w-xl">{tagline}</p>
          </div>
          <div className="h-72 border border-slate-300 bg-white overflow-hidden flex items-center justify-center">
            {heroImage ? (
              <img src={heroImage} alt={`${headline} hero`} className="h-full w-full object-cover" />
            ) : (
              <div className="relative h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.14),_transparent_38%),linear-gradient(135deg,#e2e8f0,#f8fafc)]">
                <div className="absolute inset-6 border border-slate-300 bg-white/35" />
                <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-slate-900/10" />
                <div className="absolute right-10 bottom-10 h-32 w-32 rounded-[2rem] bg-slate-600/10 rotate-12" />
                <FiBriefcase className="absolute inset-0 m-auto h-12 w-12 text-slate-500" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-slate-900 mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full border border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                Loading featured products...
              </div>
            ) : featuredProducts.length > 0 ? featuredProducts.map(card) : (
              <div className="col-span-full border border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                New products coming soon!
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );

  const shopPage = (
    <section id="shop" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-semibold text-slate-900">Shop</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or services..."
            className="w-full md:w-80 border border-slate-300 bg-white px-4 py-2.5"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full border border-slate-300 bg-white p-8 text-center text-slate-600">
              Loading products...
            </div>
          ) : filtered.length > 0 ? filtered.map(card) : (
            <div className="col-span-full border border-slate-300 bg-white p-8 text-center text-slate-600">
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
        <h2 className="text-3xl font-semibold text-slate-900 mb-4">About Us</h2>
        <p className="text-slate-600 mb-8">We provide structured services with clear communication and direct WhatsApp support.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border border-slate-300 bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Contact Information</h3>
            <p className="text-sm text-slate-700">Business: {headline}</p>
            <p className="text-sm text-slate-700 mt-1">Primary contact: WhatsApp</p>
            <p className="text-sm text-slate-700 mt-1">Operational details are finalized after launch.</p>
          </div>
          <div className="border border-slate-300 bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Quick WhatsApp Contact</h3>
            <a
              href={buildWhatsAppLink(whatsappNumber, "general inquiry")}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white ${
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
      style="bold"
      config={config}
      homePage={homePage}
      shopPage={shopPage}
      aboutPage={aboutPage}
      initialPage={initialPage}
    />
  );
}
