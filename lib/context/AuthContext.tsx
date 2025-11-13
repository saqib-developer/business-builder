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
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase/firebase";
import { User } from "@/lib/types";

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
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
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

  // Helper function to convert Firestore data to User type
  const convertFirestoreUser = (firestoreData: any, docId: string): User => {
    return {
      id: docId,
      email: firestoreData.email || "",
      firstName: firestoreData.firstName || "",
      lastName: firestoreData.lastName || "",
      country: firestoreData.country || "",
      dob: firestoreData.dob?.toDate
        ? firestoreData.dob.toDate()
        : new Date(firestoreData.dob || Date.now()),
      phone: firestoreData.phone || "",
      photoURL: firestoreData.photoURL || "",
      address: firestoreData.address || "",
      bio: firestoreData.bio || "",
      dateOfBirth: firestoreData.dateOfBirth || "",
      role: firestoreData.role || "user",
      paymentMethods: firestoreData.paymentMethods || [],
      consent: firestoreData.consent || {
        marketingEmails: false,
        termsOfService: false,
        privacyPolicy: false,
      },
      purchaseHistory: {
        activeServices: firestoreData.purchaseHistory?.activeServices || [],
        totalServicesOrdered:
          firestoreData.purchaseHistory?.totalServicesOrdered || 0,
        totalSpent: firestoreData.purchaseHistory?.totalSpent || 0,
        totalOrders: firestoreData.purchaseHistory?.totalOrders || 0,
        boughtProducts: firestoreData.purchaseHistory?.boughtProducts || [],
      },
      createdAt: firestoreData.createdAt?.toDate
        ? firestoreData.createdAt.toDate()
        : new Date(firestoreData.createdAt || Date.now()),
    };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log(
        "Auth state changed:",
        firebaseUser
          ? `${firebaseUser.email} (${firebaseUser.displayName})`
          : "No user signed in"
      );

      if (firebaseUser) {
        try {
          // Fetch complete user data from Firestore users collection
          const userDoc = await getDoc(
            doc(firestore, "users", firebaseUser.uid)
          );

          if (userDoc.exists()) {
            // User document exists in Firestore - use that data
            const firestoreData = userDoc.data();
            const userData = convertFirestoreUser(
              firestoreData,
              firebaseUser.uid
            );

            console.log("User loaded from Firestore:", userData.email);
            setUser(userData);
          } else {
            // User document doesn't exist - create basic user object (fallback for Google sign-ins)
            console.log("No Firestore document found, using basic user data");
            const basicUser = createBasicUser(firebaseUser);
            setUser(basicUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to basic user object on error
          const basicUser = createBasicUser(firebaseUser);
          setUser(basicUser);
        }
      } else {
        console.log("User signed out");
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
