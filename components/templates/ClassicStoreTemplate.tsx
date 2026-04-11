"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useBrand } from "@/lib/context/BrandContext";
import TemplateLayout from "./TemplateLayout";
import { FiMessageCircle, FiMoon } from "react-icons/fi";
import { TemplateConfig } from "@/lib/types/template";
import { buildWhatsAppLink } from "@/lib/templateCatalog";
import { useTemplateProducts } from "@/hooks/useTemplateProducts";

export default function ClassicStoreTemplate({ config, storeOwnerId, initialPage }: { config?: TemplateConfig; storeOwnerId?: string; initialPage?: "home" | "shop" | "about" }) {
  const { brandSettings } = useBrand();
  const primaryColor = config?.theme?.primaryColor || brandSettings.primaryColor || "#22D3EE";
  const headline = config?.content?.heroHeadline || brandSettings.businessName || "Night Mode Commerce";
  const tagline = config?.content?.heroSubheadline || brandSettings.tagline || "High-contrast storefront built for clarity.";
  const heroImage = config?.content?.heroImage;
  const whatsappNumber = (config?.content?.whatsappNumber || brandSettings.whatsappNumber || "").replace(/\D/g, "");

  const [search, setSearch] = useState("");
  const { products, featuredProducts, isLoading, hasProducts } = useTemplateProducts({ userId: storeOwnerId });

  const filtered = useMemo(
    () => products.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  );

  const card = (item: (typeof products)[number]) => (
    <article key={item.id} className="rounded-lg border border-zinc-700 bg-zinc-900 p-5 transition-transform hover:-translate-y-1">
      <Link href={`/shop/${item.id}`} className="block">
        <div className="h-36 rounded-md bg-zinc-800 flex items-center justify-center text-5xl mb-4 overflow-hidden">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl font-semibold text-zinc-300">{item.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <h3 className="text-lg font-bold text-white">{item.name}</h3>
        <p className="text-sm text-zinc-300 mt-1">{item.description}</p>
        <p className="text-xl font-bold mt-3" style={{ color: primaryColor }}>{item.price}</p>
      </Link>
      <div className="mt-4 flex gap-3">
        <Link
          href={`/shop/${item.id}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-zinc-700 px-4 py-2.5 text-sm font-bold text-white"
        >
          View Details
        </Link>
        <a
          href={buildWhatsAppLink(whatsappNumber, item.name)}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold text-zinc-950 ${
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
      <section id="home" className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: primaryColor }}>Dark High-Contrast</p>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">{headline}</h1>
            <p className="mt-5 text-lg text-zinc-300">{tagline}</p>
          </div>
          <div className="h-80 rounded-lg border border-zinc-700 bg-zinc-900 overflow-hidden flex items-center justify-center">
            {heroImage ? (
              <img src={heroImage} alt={`${headline} hero`} className="h-full w-full object-cover" />
            ) : (
              <div className="relative h-full w-full bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_35%),linear-gradient(135deg,#020617,#18181b)]">
                <div className="absolute inset-6 rounded-2xl border border-zinc-700/70 bg-white/5" />
                <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-cyan-400/15" />
                <div className="absolute right-12 bottom-12 h-32 w-32 rounded-3xl bg-white/10 rotate-12" />
                <FiMoon className="absolute inset-0 m-auto h-12 w-12 text-zinc-300" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-14 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full rounded-lg border border-zinc-700 bg-zinc-900 p-8 text-center text-zinc-300">
                Loading featured products...
              </div>
            ) : featuredProducts.length > 0 ? featuredProducts.map(card) : (
              <div className="col-span-full rounded-lg border border-zinc-700 bg-zinc-900 p-8 text-center text-zinc-300">
                New products coming soon!
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );

  const shopPage = (
    <section id="shop" className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold">Shop</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or services..."
            className="w-full md:w-80 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full rounded-lg border border-zinc-700 bg-zinc-900 p-8 text-center text-zinc-300">
              Loading products...
            </div>
          ) : filtered.length > 0 ? filtered.map(card) : (
            <div className="col-span-full rounded-lg border border-zinc-700 bg-zinc-900 p-8 text-center text-zinc-300">
              {hasProducts ? "No matching products found." : "New products coming soon!"}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const aboutPage = (
    <section id="about" className="py-16 bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="text-zinc-300 mb-8">We build straightforward purchase flows through direct WhatsApp communication.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-6">
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <p className="text-sm text-zinc-300">Business: {headline}</p>
            <p className="text-sm text-zinc-300 mt-1">Primary contact: WhatsApp</p>
            <p className="text-sm text-zinc-300 mt-1">Support details are confirmed after launch.</p>
          </div>
          <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-6">
            <h3 className="font-semibold mb-3">Quick WhatsApp Contact</h3>
            <a
              href={buildWhatsAppLink(whatsappNumber, "general inquiry")}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 font-bold text-zinc-950 ${
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
      style="classic"
      config={config}
      homePage={homePage}
      shopPage={shopPage}
      aboutPage={aboutPage}
      initialPage={initialPage}
    />
  );
}
