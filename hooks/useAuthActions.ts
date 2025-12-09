// hooks/useAuthActions.ts
"use client";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, firestore, storage } from "@/lib/firebase/firebase";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";

export function useAuthActions() {
  const router = useRouter();

  const uploadProfileImage = async (
    file: File,
    userId: string
  ): Promise<string> => {
    try {
      const imageRef = ref(
        storage,
        `profile-images/${userId}/${Date.now()}_${file.name}`
      );
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw new Error("Failed to upload profile image");
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user has completed onboarding
      const onboardingData = localStorage.getItem(`onboarding_${user.uid}`);
      let shouldRedirectToOnboarding = false;
      
      if (onboardingData) {
        try {
          const data = JSON.parse(onboardingData);
          shouldRedirectToOnboarding = !data.isComplete;
        } catch (e) {
          shouldRedirectToOnboarding = true;
        }
      } else {
        shouldRedirectToOnboarding = true;
      }

      // Get the stored redirect URL or default based on onboarding status
      let redirectUrl = sessionStorage.getItem("redirectUrl");
      if (!redirectUrl) {
        redirectUrl = shouldRedirectToOnboarding ? "/onboarding" : "/dashboard";
      }
      sessionStorage.removeItem("redirectUrl");
      router.push(redirectUrl);

      return { success: true };
    } catch (err: any) {
      console.error("Login error:", err);
      return {
        success: false,
        error: err.message || "Invalid email or password.",
      };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists in Firestore
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create new user document for Google sign-in users
        const userData: any = {
          id: user.uid,
          email: user.email || "",
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
          role: "user",
          country: "",
          dob: new Date(),
          phone: "",
          photoURL: user.photoURL || "",
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
          createdAt: serverTimestamp(),
          paymentMethods: [],
          consent: {
            marketingEmails: false,
            termsOfService: true,
            privacyPolicy: true,
          },
        };

        await setDoc(userDocRef, userData);
        console.log("New Google user document created in Firestore");
      } else {
        console.log("Existing Google user found in Firestore");
      }

      // Check if user has completed onboarding
      const onboardingData = localStorage.getItem(`onboarding_${user.uid}`);
      let shouldRedirectToOnboarding = false;
      
      if (onboardingData) {
        try {
          const data = JSON.parse(onboardingData);
          shouldRedirectToOnboarding = !data.isComplete;
        } catch (e) {
          shouldRedirectToOnboarding = true;
        }
      } else {
        // New Google user should go through onboarding
        shouldRedirectToOnboarding = !userDoc.exists();
      }

      // Get the stored redirect URL or default based on onboarding status
      let redirectUrl = sessionStorage.getItem("redirectUrl");
      if (!redirectUrl) {
        redirectUrl = shouldRedirectToOnboarding ? "/onboarding" : "/dashboard";
      }
      sessionStorage.removeItem("redirectUrl");
      router.push(redirectUrl);

      return { success: true };
    } catch (err: any) {
      console.error("Google login error:", err);
      return {
        success: false,
        error: err.message || "Google sign-in failed.",
      };
    }
  };

  const signUpWithEmail = async (
    name: string,
    email: string,
    password: string,
    additionalData?: {
      country?: string;
      phone?: string;
      address?: string;
      bio?: string;
      dateOfBirth?: string;
      profileImage?: File;
    }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update the user profile with display name
      await updateProfile(user, {
        displayName: name,
      });

      // Upload profile image if provided
      let photoURL = "";
      if (additionalData?.profileImage) {
        try {
          photoURL = await uploadProfileImage(
            additionalData.profileImage,
            user.uid
          );
          // Update Firebase Auth profile with uploaded image
          await updateProfile(user, {
            displayName: name,
            photoURL: photoURL,
          });
        } catch (imageError) {
          console.error("Error uploading profile image:", imageError);
          // Continue with user creation even if image upload fails
        }
      }

      // Create comprehensive user document in Firestore
      const userData: any = {
        id: user.uid,
        email: user.email || "",
        firstName: name.split(" ")[0] || "",
        lastName: name.split(" ").slice(1).join(" ") || "",
        role: "user",
        country: additionalData?.country || "",
        dob: additionalData?.dateOfBirth
          ? new Date(additionalData.dateOfBirth)
          : new Date(),
        phone: additionalData?.phone || "",
        photoURL: photoURL,
        address: additionalData?.address || "",
        bio: additionalData?.bio || "",
        dateOfBirth: additionalData?.dateOfBirth || "",
        purchaseHistory: {
          activeServices: [],
          totalServicesOrdered: 0,
          totalSpent: 0,
          totalOrders: 0,
          boughtProducts: [],
        },
        createdAt: serverTimestamp(),
        paymentMethods: [],
        consent: {
          marketingEmails: false,
          termsOfService: true,
          privacyPolicy: true,
        },
      };

      await setDoc(doc(firestore, "users", user.uid), userData);
      console.log("New email user document created in Firestore");

      // New users always go to onboarding
      sessionStorage.removeItem("redirectUrl");
      router.push("/onboarding");

      return { success: true };
    } catch (err: any) {
      console.error("Signup error:", err);
      return {
        success: false,
        error: err.message || "An error occurred during sign up.",
      };
    }
  };

  const signupWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document already exists
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create user document for new Google users
        const userData: any = {
          id: user.uid,
          email: user.email || "",
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
          role: "user",
          country: "",
          dob: new Date(),
          phone: "",
          photoURL: user.photoURL || "",
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
          createdAt: serverTimestamp(),
          paymentMethods: [],
          consent: {
            marketingEmails: false,
            termsOfService: true,
            privacyPolicy: true,
          },
        };

        await setDoc(userDocRef, userData);
        console.log("New Google signup user document created in Firestore");
        
        // New Google users go to onboarding
        sessionStorage.removeItem("redirectUrl");
        router.push("/onboarding");
      } else {
        console.log("Existing Google user found during signup");
        
        // Check if existing user has completed onboarding
        const onboardingData = localStorage.getItem(`onboarding_${user.uid}`);
        let shouldRedirectToOnboarding = false;
        
        if (onboardingData) {
          try {
            const data = JSON.parse(onboardingData);
            shouldRedirectToOnboarding = !data.isComplete;
          } catch (e) {
            shouldRedirectToOnboarding = true;
          }
        } else {
          shouldRedirectToOnboarding = true;
        }

        // Get the stored redirect URL or default based on onboarding status
        let redirectUrl = sessionStorage.getItem("redirectUrl");
        if (!redirectUrl) {
          redirectUrl = shouldRedirectToOnboarding ? "/onboarding" : "/dashboard";
        }
        sessionStorage.removeItem("redirectUrl");
        router.push(redirectUrl);
      }

      return { success: true };
      sessionStorage.removeItem("redirectUrl");
      router.push(redirectUrl);

      return { success: true };
    } catch (err: any) {
      console.error("Google signup error:", err);
      return {
        success: false,
        error: err.message || "Google sign-up failed.",
      };
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/");
      return { success: true };
    } catch (err: any) {
      console.error("Logout error:", err);
      return {
        success: false,
        error: err.message || "Sign out failed.",
      };
    }
  };

  return {
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    signupWithGoogle,
    logout,
    uploadProfileImage,
  };
}
