"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useBrand } from "@/lib/context/BrandContext";
import { TemplateConfig } from "@/lib/types/template";
import { FiShoppingBag } from "react-icons/fi";

interface TemplateShellProps {
  style: "modern" | "classic" | "minimal" | "bold";
  config?: TemplateConfig;
  children: ReactNode;
}

export default function TemplateShell({ style, config, children }: TemplateShellProps) {
  const { brandSettings } = useBrand();
  const businessName = config?.content?.heroHeadline || brandSettings?.businessName || "My Business";
  const tagline = config?.content?.heroSubheadline || brandSettings?.tagline || "";
  const primaryColor = config?.theme?.primaryColor || brandSettings?.primaryColor || "#2563eb";
  const secondaryColor = config?.theme?.secondaryColor || brandSettings?.secondaryColor || "#1e40af";
  const brandLogo = config?.content?.brandLogo;

  const navClass =
    style === "classic"
      ? "bg-black text-white border-zinc-800"
      : style === "bold"
      ? "bg-slate-900 text-white border-slate-700"
      : "bg-white text-gray-900 border-gray-200";

  return (
    <div className="min-h-screen bg-white">
      <header className={`border-b ${navClass}`} style={{ borderColor: `${secondaryColor}22` }}>
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
              {[
                ["home", "Home"],
                ["shop", "Shop"],
                ["about", "About Us"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href === "home" ? "/" : `/?view=${href}`}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    style === "classic"
                      ? "text-zinc-200 hover:bg-zinc-800"
                      : style === "bold"
                      ? "text-slate-100 hover:bg-slate-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer
        className={`border-t ${style === "classic" ? "bg-black text-white border-zinc-800" : style === "bold" ? "bg-slate-900 text-white border-slate-700" : "bg-gray-50 text-gray-900 border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-semibold">{businessName}</p>
              <p className="text-sm opacity-80">{tagline || "Built for real businesses."}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/" className="text-sm px-3 py-1.5 hover:opacity-80">Home</Link>
              <Link href="/?view=shop" className="text-sm px-3 py-1.5 hover:opacity-80">Shop</Link>
              <Link href="/?view=about" className="text-sm px-3 py-1.5 hover:opacity-80">About Us</Link>
            </div>
          </div>
          <p className="mt-6 text-xs opacity-70">© 2026 {businessName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
