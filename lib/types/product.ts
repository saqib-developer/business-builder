// ============= PRODUCT TYPES =============

export interface Product {
  id: string;
  userId: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  createdAt: string | Date; // Timestamp
  updatedAt: string | Date; // Timestamp
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  imageFile?: File;
  imageUrl?: string;
}
