"use client";

import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useBrand } from "@/lib/context/BrandContext";
import { TemplateConfig } from "@/lib/types/template";
import { FiShoppingBag } from "react-icons/fi";

type TemplatePage = "home" | "shop" | "about";

interface TemplateLayoutProps {
  style: "modern" | "classic" | "minimal" | "bold";
  config?: TemplateConfig;
  homePage: ReactNode;
  shopPage: ReactNode;
  aboutPage: ReactNode;
  initialPage?: TemplatePage;
}

export default function TemplateLayout({
  style,
  config,
  homePage,
  shopPage,
  aboutPage,
  initialPage = "home",
}: TemplateLayoutProps) {
  const { brandSettings } = useBrand();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<TemplatePage>(initialPage);

  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "shop" || view === "about" || view === "home") {
      setTimeout(() => setCurrentPage(view as TemplatePage), 0);
      return;
    }

    setTimeout(() => setCurrentPage(initialPage), 0);
  }, [searchParams, initialPage]);

  const businessName = config?.content?.heroHeadline || brandSettings?.businessName || "My Business";
  const tagline = config?.content?.heroSubheadline || brandSettings?.tagline || "";
  const primaryColor = config?.theme?.primaryColor || brandSettings?.primaryColor || "#2563eb";
  const secondaryColor = config?.theme?.secondaryColor || brandSettings?.secondaryColor || "#1e40af";
  const brandLogo = config?.content?.brandLogo;

  const theme = useMemo(() => {
    if (style === "modern") {
      return {
        shell: "bg-white text-gray-900",
        nav: "bg-white/90 backdrop-blur border-gray-100",
        navLink: "text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md",
        footer: "bg-gray-50 border-gray-200 text-gray-700",
      };
    }
    if (style === "classic") {
      return {
        shell: "bg-zinc-950 text-white",
        nav: "bg-black border-zinc-800",
        navLink: "text-zinc-200 hover:text-white hover:bg-zinc-800 rounded-md",
        footer: "bg-black border-zinc-800 text-zinc-300",
      };
    }
    if (style === "minimal") {
      return {
        shell: "bg-amber-50/60 text-gray-900",
        nav: "bg-white border-amber-100",
        navLink: "text-gray-700 hover:text-gray-900 hover:bg-amber-100 rounded-full",
        footer: "bg-white border-amber-100 text-gray-700",
      };
    }
    return {
      shell: "bg-slate-100 text-slate-900",
      nav: "bg-slate-900 border-slate-700",
      navLink: "text-slate-100 hover:text-white hover:bg-slate-800 rounded-none",
      footer: "bg-slate-900 border-slate-700 text-slate-200",
    };
  }, [style]);

  const pages: Record<TemplatePage, ReactNode> = {
    home: homePage,
    shop: shopPage,
    about: aboutPage,
  };

  const getPageHref = (page: TemplatePage) => (page === "home" ? "/" : `/?view=${page}`);

  return (
    <div className={`min-h-screen ${theme.shell}`}>
      <header className={`sticky top-0 z-40 border-b ${theme.nav}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-left">
              {brandLogo ? (
                <img src={brandLogo} alt={`${businessName} logo`} className="h-8 w-8 object-contain rounded" />
              ) : (
                <FiShoppingBag className="h-7 w-7" style={{ color: primaryColor }} />
              )}
              <div>
                <p className="text-base font-bold leading-none">{businessName}</p>
                <p className="text-xs opacity-70 mt-1">{tagline || "Simple websites that convert"}</p>
              </div>
            </Link>

            <nav className="flex items-center gap-2">
              {([
                ["home", "Home"],
                ["shop", "Shop"],
                ["about", "About Us"],
              ] as Array<[TemplatePage, string]>).map(([key, label]) => (
                <Link
                  key={key}
                  href={getPageHref(key)}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${theme.navLink}`}
                  style={
                    currentPage === key
                      ? {
                          backgroundColor: `${primaryColor}22`,
                          color: style === "classic" || style === "bold" ? "#fff" : primaryColor,
                        }
                      : undefined
                  }
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main>{pages[currentPage]}</main>

      <footer className={`mt-14 border-t ${theme.footer}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-semibold">{businessName}</p>
              <p className="text-sm opacity-80">{tagline || "Built for real businesses."}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={getPageHref("home")} className="text-sm px-3 py-1.5 hover:opacity-80">
                Home
              </Link>
              <Link href={getPageHref("shop")} className="text-sm px-3 py-1.5 hover:opacity-80">
                Shop
              </Link>
              <Link href={getPageHref("about")} className="text-sm px-3 py-1.5 hover:opacity-80">
                About Us
              </Link>
            </div>
          </div>
          <p className="mt-6 text-xs opacity-70">© 2026 {businessName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
