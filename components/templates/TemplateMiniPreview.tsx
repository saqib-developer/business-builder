import { useBrand } from "@/lib/context/BrandContext";

interface TemplateMiniPreviewProps {
  templateId: string;
}

export default function TemplateMiniPreview({
  templateId,
}: TemplateMiniPreviewProps) {
  const { brandSettings } = useBrand();

  const renderPreview = () => {
    switch (templateId) {
      case "modern-shop":
        return <ModernShopMini {...brandSettings} />;
      case "classic-store":
        return <ClassicStoreMini {...brandSettings} />;
      case "minimal-boutique":
        return <MinimalBoutiqueMini {...brandSettings} />;
      case "bold-market":
        return <BoldMarketMini {...brandSettings} />;
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

// Modern Shop Mini Preview
function ModernShopMini({ businessName, tagline, primaryColor }: any) {
  return (
    <div className="w-full h-full bg-gray-50">
      {/* Header */}
      <div className="h-16 bg-white border-b flex items-center px-8">
        <div
          className="w-8 h-8 rounded-full"
          style={{ backgroundColor: primaryColor }}
        ></div>
        <div className="ml-3 text-lg font-bold">{businessName}</div>
      </div>

      {/* Hero with gradient */}
      <div className="mx-8 mt-8 h-40 rounded-xl p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <div className="text-3xl font-bold mb-2">{businessName}</div>
        <div className="text-lg opacity-90 mb-4">{tagline}</div>
        <button className="px-6 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium">
          Shop Now
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-3 gap-6 px-8 mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div
              className="h-4 rounded font-bold"
              style={{
                backgroundColor: primaryColor + "20",
                color: primaryColor,
              }}
            >
              $99
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Classic Store Mini Preview
function ClassicStoreMini({ businessName, tagline, primaryColor }: any) {
  return (
    <div className="w-full h-full bg-white">
      {/* Announcement Bar */}
      <div
        className="h-10 flex items-center justify-center text-white text-sm font-medium"
        style={{ backgroundColor: primaryColor }}
      >
        Free Shipping Over $50!
      </div>

      {/* Header */}
      <div className="h-16 border-b flex items-center justify-between px-8 bg-gray-50">
        <div className="flex items-center">
          <div
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: primaryColor }}
          ></div>
          <div className="ml-3 text-lg font-bold">{businessName}</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="h-12 bg-gray-900 flex items-center px-8 space-x-8 text-white text-sm">
        <div>Home</div>
        <div>Shop</div>
        <div>About</div>
        <div>Contact</div>
      </div>

      {/* Hero */}
      <div className="px-8 py-12 text-center">
        <div className="text-3xl font-bold mb-2">{businessName}</div>
        <div className="text-lg text-gray-600 mb-4">{tagline}</div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-4 gap-4 px-8">
        {["New", "Sale", "Best", "Hot"].map((label, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-6 text-center">
            <div className="text-sm font-bold mb-2">{label}</div>
            <div className="text-xs text-gray-600">{12 + i} items</div>
          </div>
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-3 gap-6 px-8 mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border rounded-lg p-4">
            <div className="relative">
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                SALE
              </div>
              <div className="h-32 bg-gray-200 rounded mb-3"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div
              className="h-4 rounded font-bold"
              style={{ color: primaryColor }}
            >
              $59.99
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Minimal Boutique Mini Preview
function MinimalBoutiqueMini({ businessName, tagline }: any) {
  return (
    <div className="w-full h-full bg-white">
      {/* Simple Header */}
      <div className="h-20 flex flex-col items-center justify-center border-b">
        <div className="w-6 h-6 rounded-full bg-gray-900 mb-2"></div>
        <div className="flex space-x-6 text-xs text-gray-600">
          <div>Home</div>
          <div>Shop</div>
          <div>About</div>
        </div>
      </div>

      {/* Large Typography Hero */}
      <div className="py-20 text-center">
        <div className="text-5xl font-light tracking-wide mb-4">
          {businessName.toUpperCase()}
        </div>
        <div className="w-32 h-px bg-gray-300 mx-auto mb-4"></div>
        <div className="text-sm text-gray-600">{tagline}</div>
      </div>

      {/* Minimal Product Layout */}
      <div className="grid grid-cols-3 gap-12 px-16">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <div className="h-40 bg-gray-100 mb-4"></div>
            <div className="text-sm text-gray-900 mb-1">Product Name</div>
            <div className="text-xs text-gray-600">$149</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Bold Market Mini Preview
function BoldMarketMini({ businessName, tagline, primaryColor }: any) {
  return (
    <div className="w-full h-full bg-gray-900">
      {/* Bold Header */}
      <div className="h-16 bg-black flex items-center justify-between px-8">
        <div className="flex items-center">
          <div
            className="w-8 h-8 rounded"
            style={{ backgroundColor: primaryColor }}
          ></div>
          <div className="ml-3 text-lg font-bold text-white">
            {businessName}
          </div>
        </div>
      </div>

      {/* Mega Hero */}
      <div className="mx-8 mt-8 p-12 bg-red-500 text-center">
        <div className="text-4xl font-black text-white mb-3">MEGA SALE</div>
        <div className="text-2xl font-bold text-white mb-4">UP TO 50% OFF</div>
        <button className="px-8 py-3 bg-black text-white rounded font-bold text-sm">
          SHOP NOW
        </button>
      </div>

      {/* Bold Products */}
      <div className="grid grid-cols-3 gap-6 px-8 mt-8">
        {[50, 40, 30].map((discount, i) => (
          <div key={i} className="bg-black p-4 relative">
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1">
              -{discount}%
            </div>
            <div className="h-32 bg-gray-800 mb-3"></div>
            <div className="text-white font-bold text-lg">$79.99</div>
            <div className="text-gray-500 text-sm line-through">$99.99</div>
          </div>
        ))}
      </div>
    </div>
  );
}
