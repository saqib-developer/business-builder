import { useMemo } from "react";
import { useBrand } from "@/lib/context/BrandContext";
import { getTemplateProducts, TemplateId, TemplateProduct } from "@/lib/templateCatalog";

interface TemplateMiniPreviewProps {
  templateId: string;
}

export default function TemplateMiniPreview({
  templateId,
}: TemplateMiniPreviewProps) {
  const { brandSettings } = useBrand();
  const primaryColor = brandSettings.primaryColor || "#2563eb";
  const secondaryColor = brandSettings.secondaryColor || "#64748b";
  const businessName = brandSettings.businessName || "My Business";
  const tagline = brandSettings.tagline || "Simple websites that convert.";

  const products = useMemo(() => getTemplateProducts(templateId as TemplateId).slice(0, 3), [templateId]);

  const renderPreview = () => {
    switch (templateId) {
      case "modern-shop":
        return (
          <ModernShopMini
            businessName={businessName}
            tagline={tagline}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            products={products}
          />
        );
      case "classic-store":
        return (
          <ClassicStoreMini
            businessName={businessName}
            tagline={tagline}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            products={products}
          />
        );
      case "minimal-boutique":
        return (
          <MinimalBoutiqueMini
            businessName={businessName}
            tagline={tagline}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            products={products}
          />
        );
      case "bold-market":
        return (
          <BoldMarketMini
            businessName={businessName}
            tagline={tagline}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            products={products}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="w-full h-full bg-white overflow-hidden"
      style={{
        transform: "scale(0.5)",
        transformOrigin: "top left",
        width: "200%",
        height: "200%",
      }}
    >
      {renderPreview()}
    </div>
  );
}

interface MiniPreviewProps {
  businessName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  products: TemplateProduct[];
}

// Modern Shop Mini Preview
function ModernShopMini({ businessName, tagline, primaryColor, secondaryColor, products }: MiniPreviewProps) {
  return (
    <div className="w-full h-full bg-slate-50 text-slate-900">
      <div className="h-14 bg-white/95 border-b border-slate-200 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }} />
          <div className="text-base font-bold">{businessName}</div>
        </div>
        <div className="flex items-center gap-5 text-xs font-medium text-slate-500">
          <span>Home</span>
          <span>Shop</span>
          <span>About</span>
        </div>
      </div>

      <div className="mx-8 mt-8 grid grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
        <div className="rounded-3xl p-8 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
          <div className="text-xs uppercase tracking-[0.3em] opacity-80 mb-4">Modern Shop</div>
          <div className="text-3xl font-black leading-tight max-w-sm">{businessName}</div>
          <div className="mt-4 text-sm leading-6 opacity-90 max-w-sm">{tagline}</div>
          <div className="mt-6 inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900">
            View Featured
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm overflow-hidden">
          <div className="h-full rounded-2xl bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.20),transparent_35%),linear-gradient(135deg,#ffffff,#e2e8f0)] flex items-end justify-end p-4">
            <div className="rounded-2xl bg-white/80 px-4 py-3 text-right shadow-sm backdrop-blur-sm">
              <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Featured</div>
              <div className="text-lg font-semibold">Launch-ready store</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-8 mt-6 grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="h-28 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl mb-3">
              {product.emoji}
            </div>
            <div className="text-sm font-semibold text-slate-900">{product.name}</div>
            <div className="mt-1 text-xs text-slate-500 line-clamp-2">{product.description}</div>
            <div className="mt-3 text-sm font-bold" style={{ color: primaryColor }}>{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Classic Store Mini Preview
function ClassicStoreMini({ businessName, tagline, primaryColor, secondaryColor, products }: MiniPreviewProps) {
  return (
    <div className="w-full h-full bg-zinc-950 text-white">
      <div className="h-10 flex items-center justify-center text-xs font-semibold tracking-[0.25em] uppercase text-zinc-950" style={{ backgroundColor: primaryColor }}>
        Free Shipping Over $50
      </div>

      <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-8 bg-black">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }} />
          <div className="text-base font-bold">{businessName}</div>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-300">
          <span>Home</span>
          <span>Shop</span>
          <span>About</span>
        </div>
      </div>

      <div className="px-8 py-8 grid grid-cols-[1fr_0.9fr] gap-4 items-center">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-400 mb-3">Classic Store</div>
          <div className="text-3xl font-black leading-tight">{businessName}</div>
          <div className="mt-3 text-sm text-zinc-300 max-w-xs">{tagline}</div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="grid grid-cols-2 gap-2">
            {['New', 'Sale', 'Best', 'Hot'].map((label, i) => (
              <div key={i} className="rounded-xl bg-zinc-800 px-3 py-4 text-center">
                <div className="text-xs font-semibold text-zinc-200">{label}</div>
                <div className="mt-1 text-[11px] text-zinc-400">{12 + i} items</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="h-28 rounded-xl bg-zinc-800 flex items-center justify-center text-3xl mb-3">{product.emoji}</div>
            <div className="text-sm font-semibold">{product.name}</div>
            <div className="mt-1 text-xs text-zinc-400">{product.description}</div>
            <div className="mt-3 text-sm font-bold" style={{ color: primaryColor }}>{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Minimal Boutique Mini Preview
function MinimalBoutiqueMini({ businessName, tagline, primaryColor, secondaryColor, products }: MiniPreviewProps) {
  return (
    <div className="w-full h-full bg-white text-gray-900">
      <div className="h-20 flex flex-col items-center justify-center border-b border-gray-200">
        <div className="w-6 h-6 rounded-full mb-2" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }} />
        <div className="flex space-x-6 text-xs text-gray-500">
          <div>Home</div>
          <div>Shop</div>
          <div>About</div>
        </div>
      </div>

      <div className="py-14 text-center px-10">
        <div className="text-[2.6rem] leading-none font-light tracking-[0.25em] mb-4">{businessName.toUpperCase()}</div>
        <div className="w-28 h-px bg-gray-300 mx-auto mb-4"></div>
        <div className="text-sm text-gray-600 max-w-md mx-auto">{tagline}</div>
      </div>

      <div className="grid grid-cols-3 gap-6 px-10">
        {products.map((product) => (
          <div key={product.id} className="text-center">
            <div className="h-32 rounded-2xl bg-gray-100 mb-4 flex items-center justify-center text-3xl">{product.emoji}</div>
            <div className="text-sm font-medium text-gray-900 mb-1">{product.name}</div>
            <div className="text-xs text-gray-500">{product.price}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 mx-10 rounded-3xl border border-gray-200 p-5 text-left">
        <div className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-2">About Us</div>
        <div className="text-sm text-gray-600">A refined storefront with quiet whitespace and simple direct inquiry flow.</div>
      </div>
    </div>
  );
}

// Bold Market Mini Preview
function BoldMarketMini({ businessName, tagline, primaryColor, secondaryColor, products }: MiniPreviewProps) {
  return (
    <div className="w-full h-full bg-slate-950 text-white">
      <div className="h-16 bg-black flex items-center justify-between px-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }} />
          <div className="text-base font-bold">{businessName}</div>
        </div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/60">Bold Market</div>
      </div>

      <div className="mx-8 mt-8 p-8 rounded-3xl text-center" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
        <div className="text-xs uppercase tracking-[0.3em] text-white/80 mb-3">High impact</div>
        <div className="text-4xl font-black text-white mb-3">{businessName}</div>
        <div className="text-sm text-white/90 max-w-md mx-auto">{tagline}</div>
        <div className="mt-5 inline-flex rounded-full bg-black px-4 py-2 text-xs font-bold text-white">Shop Now</div>
      </div>

      <div className="grid grid-cols-3 gap-4 px-8 mt-6">
        {products.map((product, index) => (
          <div key={product.id} className={`rounded-2xl p-4 ${index === 0 ? 'bg-black' : 'bg-white/5 border border-white/10'}`}>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-white/50 mb-3">
              <span>{index === 0 ? 'Hot' : index === 1 ? 'New' : 'Pro'}</span>
              <span>{index === 0 ? '-50%' : index === 1 ? '-40%' : '-30%'}</span>
            </div>
            <div className="h-24 rounded-xl bg-white/10 flex items-center justify-center text-3xl mb-3">{product.emoji}</div>
            <div className="text-sm font-semibold">{product.name}</div>
            <div className="mt-1 text-xs text-white/60 line-clamp-2">{product.description}</div>
            <div className="mt-3 text-base font-bold">{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
