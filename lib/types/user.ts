// ============= USER & AUTHENTICATION =============

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  country: string;
  dob: Date;
  phone: string;
  photoURL: string;
  address: string;
  bio: string;
  dateOfBirth: string;
  purchaseHistory: {
    activeServices: string[];
    totalServicesOrdered: number;
    totalSpent: number;
    totalOrders: number;
    boughtProducts: string[];
  };
  createdAt: Date;
  paymentMethods: unknown[];
  consent: {
    marketingEmails: boolean;
    termsOfService: boolean;
    privacyPolicy: boolean;
  };
}
