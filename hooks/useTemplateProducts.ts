"use client";

import { useEffect, useMemo, useState } from "react";
import { subscribeToUserProducts } from "@/lib/firebase/firestoreService";
import { useAuth } from "@/lib/context/AuthContext";

export interface TemplateProductItem {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

interface UseTemplateProductsOptions {
  userId?: string;
}

function normalizePrice(price: string): string {
  const value = (price || "").trim();
  if (!value) return "$0";
  if (/^[\$€£]/.test(value)) return value;
  if (/^\d+(\.\d{1,2})?$/.test(value)) return `$${value}`;
  return value;
}

export function useTemplateProducts(options?: UseTemplateProductsOptions) {
  const { user } = useAuth();
  const [products, setProducts] = useState<TemplateProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const targetUserId = options?.userId || user?.id;

  useEffect(() => {
    if (!targetUserId) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToUserProducts(targetUserId, (items) => {
      const mapped = items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: normalizePrice(item.price),
        imageUrl: item.imageUrl,
      }));
      setProducts(mapped);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [targetUserId]);

  const featuredProducts = useMemo(() => products.slice(0, 3), [products]);

  return {
    products,
    featuredProducts,
    isLoading,
    hasProducts: products.length > 0,
  };
}
