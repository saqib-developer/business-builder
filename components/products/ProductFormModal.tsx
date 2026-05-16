"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import { ProductFormData } from "@/lib/types/product";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: ProductFormData;
  isLoading?: boolean;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: "",
      description: "",
      price: "",
      imageUrl: "",
    },
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      // Defer setting state to avoid synchronous setState inside effect
      setTimeout(() => {
        setFormData(initialData);
        setImagePreview(initialData.imageUrl || null);
      }, 0);
    } else {
      setTimeout(() => {
        setFormData({
          name: "",
          description: "",
          price: "",
          imageUrl: "",
        });
        setImagePreview(null);
      }, 0);
    }

    // Defer to avoid synchronous setState in effect
    setTimeout(() => setError(null), 0);
  }, [initialData, isOpen]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Product description is required");
      return;
    }
    if (!formData.price.trim()) {
      setError("Product price is required");
      return;
    }
    if (!imagePreview && !initialData?.imageUrl) {
      setError("Product image is required");
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ name: "", description: "", price: "", imageUrl: "" });
      setImagePreview(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6 overflow-y-auto flex-1">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Summer T-Shirt"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              disabled={isLoading}
            />
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your product..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              disabled={isLoading}
            />
          </div>

          {/* Product Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., $29.99"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              disabled={isLoading}
            />
          </div>

          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image * {initialData && "(Optional to keep existing)"}
            </label>
            {imagePreview && (
              <div className="mb-3 rounded-lg bg-gray-100 p-2">
                {/* eslint-disable-next-line */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-full object-cover rounded-lg"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-blue-700 focus:outline-none"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
              💡 <span className="font-medium">Tip:</span> Square (1:1) or landscape (4:3) works best (e.g. 800x800px).
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-200 p-6 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading && <FiLoader className="h-4 w-4 animate-spin" />}
            {initialData ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
