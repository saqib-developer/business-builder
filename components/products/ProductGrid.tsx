"use client";

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Product } from "@/lib/types/product";

interface ProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => Promise<void>;
  isDeleting?: string | null;
  isLoading?: boolean;
}

export default function ProductGrid({
  products,
  onEdit,
  onDelete,
  isDeleting,
  isLoading = false,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-3 h-40 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <div className="text-4xl mb-2">📦</div>
        <p className="text-gray-600">No products yet</p>
        <p className="text-sm text-gray-500 mt-1">
          Add your first product to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow overflow-hidden"
        >
          {/* Image */}
          <div className="h-40 bg-gray-100 overflow-hidden">
            {/* eslint-disable-next-line */}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 text-lg truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {product.description}
            </p>
            <p className="text-lg font-bold text-blue-600 mt-2">
              {product.price}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t border-gray-200 p-4">
            <button
              onClick={() => onEdit(product)}
              disabled={!!isDeleting || isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <FiEdit2 className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(product.id)}
              disabled={!!isDeleting || isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50"
            >
              <FiTrash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
