"use client";

import { useState, useEffect, useCallback } from "react";
import { FiPlus, FiLoader, FiAlertCircle } from "react-icons/fi";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  subscribeToUserProducts,
} from "@/lib/firebase/firestoreService";
import { useConvexUpload } from "@/hooks/useConvexUpload";
import { Product, ProductFormData } from "@/lib/types/product";
import ProductFormModal from "./ProductFormModal";
import ProductGrid from "./ProductGrid";

interface ProductsSectionProps {
  userId: string;
}

export default function ProductsSection({ userId }: ProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { uploadFile, isUploading } = useConvexUpload();

  // Subscribe to real-time product updates
  useEffect(() => {
    if (!userId) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToUserProducts(
      userId,
      (updatedProducts) => {
        setProducts(updatedProducts);
        setError(null);
        setIsLoading(false);
      },
      (listenerError) => {
        setProducts([]);
        setIsLoading(false);
        setError(
          listenerError?.message ||
            "Unable to load products. Check Firestore permissions and indexes.",
        );
      },
    );

    return unsubscribe;
  }, [userId]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setError(null);
  };

  const handleSaveProduct = useCallback(
    async (formData: ProductFormData) => {
      try {
        setIsSaving(true);
        setError(null);

        let imageUrl = formData.imageUrl;

        // Upload image if a new one was selected
        if (formData.imageFile) {
          try {
            const uploadResult = await uploadFile(
              formData.imageFile,
              userId,
              "product-image",
            );
            imageUrl = uploadResult.url || "";
          } catch (uploadError) {
            setError(
              uploadError instanceof Error
                ? uploadError.message
                : "Failed to upload image",
            );
            setIsSaving(false);
            return;
          }
        }

        if (!imageUrl) {
          setError("Image URL is required");
          setIsSaving(false);
          return;
        }

        // Save or update product
        if (editingProduct) {
          // Update existing product
          await updateProduct(editingProduct.id, {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            imageUrl,
          });
        } else {
          // Create new product
          await createProduct(userId, {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            imageUrl,
          });
        }

        handleCloseModal();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save product");
      } finally {
        setIsSaving(false);
      }
    },
    [userId, uploadFile, editingProduct],
  );

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setIsDeletingId(productId);
      await deleteProduct(productId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your inventory and product listings. Your products will appear
            on your shop pages.
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          disabled={isSaving || isLoading || isUploading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 whitespace-nowrap"
        >
          <FiPlus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 flex gap-3">
          <FiAlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FiLoader className="h-8 w-8 text-blue-600 animate-spin mb-3" />
          <p className="text-gray-600">Loading your products...</p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <ProductGrid
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            isDeleting={isDeletingId}
            isLoading={isSaving || isUploading}
          />

          {/* Stats Footer */}
          {products.length > 0 && (
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              You have <span className="font-semibold">{products.length}</span>{" "}
              product{products.length !== 1 ? "s" : ""} in your store.
            </div>
          )}
        </>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveProduct}
        initialData={
          editingProduct
            ? {
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price,
                imageUrl: editingProduct.imageUrl,
              }
            : undefined
        }
        isLoading={isSaving || isUploading}
      />
    </div>
  );
}
