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
  const createBasicUser = (firebaseUser: any): User => {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      firstName: firebaseUser.displayName?.split(" ")[0] || "",
      lastName: firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
      role: "user",
      country: "",
      dob: new Date(),
      phone: "",
      photoURL: firebaseUser.photoURL || "",
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
  const convertLocalStorageUser = (localData: any, docId: string): User => {
    return {
      id: docId,
      email: localData.email || "",
      firstName: localData.firstName || "",
      lastName: localData.lastName || "",
      country: localData.country || "",
      dob: localData.dob ? new Date(localData.dob) : new Date(),
      phone: localData.phone || "",
      photoURL: localData.photoURL || "",
      address: localData.address || "",
      bio: localData.bio || "",
      dateOfBirth: localData.dateOfBirth || "",
      role: localData.role || "user",
      paymentMethods: localData.paymentMethods || [],
      consent: localData.consent || {
        marketingEmails: false,
        termsOfService: false,
        privacyPolicy: false,
      },
      purchaseHistory: {
        activeServices: localData.purchaseHistory?.activeServices || [],
        totalServicesOrdered:
          localData.purchaseHistory?.totalServicesOrdered || 0,
        totalSpent: localData.purchaseHistory?.totalSpent || 0,
        totalOrders: localData.purchaseHistory?.totalOrders || 0,
        boughtProducts: localData.purchaseHistory?.boughtProducts || [],
      },
      createdAt: localData.createdAt
        ? new Date(localData.createdAt)
        : new Date(),
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
