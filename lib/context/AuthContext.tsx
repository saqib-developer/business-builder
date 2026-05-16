// context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User } from "@/lib/types";
import { getLocalStorageItem } from "@/hooks/useLocalStorage";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoize isAdmin to prevent unnecessary re-renders
  const isAdmin = useMemo(() => {
    return user?.role === "admin";
  }, [user?.role]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      void error;
    }
  }, []);

  // Helper function to create a basic user object
  const createBasicUser = (firebaseUser: unknown): User => {
    const fu = firebaseUser as { uid: string; email?: string; displayName?: string; photoURL?: string };
    return {
      id: fu.uid,
      email: fu.email || "",
      firstName: fu.displayName?.split(" ")[0] || "",
      lastName: fu.displayName?.split(" ").slice(1).join(" ") || "",
      role: "user",
      country: "",
      dob: new Date(),
      phone: "",
      photoURL: fu.photoURL || "",
      address: "",
      bio: "",
      dateOfBirth: "",
      purchaseHistory: {
        activeServices: [],
        totalServicesOrdered: 0,
        totalSpent: 0,
        totalOrders: 0,
        boughtProducts: [],
      },
      createdAt: new Date(),
      paymentMethods: [],
      consent: {
        marketingEmails: false,
        termsOfService: false,
        privacyPolicy: false,
      },
    };
  };

  // Helper function to convert localStorage data to User type
  const convertLocalStorageUser = (localData: unknown, docId: string): User => {
    const ld = (localData as Record<string, unknown>) || {};
    return {
      id: docId,
      email: (ld.email as string) || "",
      firstName: (ld.firstName as string) || "",
      lastName: (ld.lastName as string) || "",
      country: (ld.country as string) || "",
      dob: ld.dob ? new Date(ld.dob as string | number | Date) : new Date(),
      phone: (ld.phone as string) || "",
      photoURL: (ld.photoURL as string) || "",
      address: (ld.address as string) || "",
      bio: (ld.bio as string) || "",
      dateOfBirth: (ld.dateOfBirth as string) || "",
      role: ((ld.role as string) || "user") as "user" | "admin",
      paymentMethods: (ld.paymentMethods as unknown[]) || [],
      consent: (ld.consent as any) || {
        marketingEmails: false,
        termsOfService: false,
        privacyPolicy: false,
      },
      purchaseHistory: {
        activeServices: ((ld.purchaseHistory as any)?.activeServices as string[]) || [],
        totalServicesOrdered: ((ld.purchaseHistory as any)?.totalServicesOrdered as number) || 0,
        totalSpent: ((ld.purchaseHistory as any)?.totalSpent as number) || 0,
        totalOrders: ((ld.purchaseHistory as any)?.totalOrders as number) || 0,
        boughtProducts: ((ld.purchaseHistory as any)?.boughtProducts as string[]) || [],
      },
      createdAt: ld.createdAt ? new Date(ld.createdAt as string | number | Date) : new Date(),
    };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDataKey = `user_${firebaseUser.uid}`;
          const localUserData = getLocalStorageItem(userDataKey, null);

          if (localUserData) {
            const userData = convertLocalStorageUser(
              localUserData,
              firebaseUser.uid
            );

            setUser(userData);
          } else {
            const basicUser = createBasicUser(firebaseUser);
            setUser(basicUser);
          }
        } catch (error) {
          const basicUser = createBasicUser(firebaseUser);
          setUser(basicUser);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      logout,
    }),
    [user, loading, isAdmin, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
