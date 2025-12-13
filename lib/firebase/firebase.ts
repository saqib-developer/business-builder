// lib/firebase.ts
// Firebase Configuration - Authentication and Storage Only
// Firestore and Realtime Database have been removed - using localStorage instead
import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Debug logging for Firebase configuration
console.log("🔥 Firebase Configuration Debug:");
console.log("Environment:", process.env.NODE_ENV);
console.log("API Key exists:", !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log(
  "Auth Domain exists:",
  !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
);
console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log(
  "Storage Bucket exists:",
  !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "demo-project.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abc123",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase configuration
if (
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
) {
  console.warn(
    "⚠️ Firebase configuration is incomplete! Using demo values for build."
  );
  console.warn(
    "⚠️ Please set up .env.local with your Firebase credentials for development."
  );
}

// Initialize Firebase (prevent duplicate initialization)
let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
    throw error;
  }
} else {
  app = getApps()[0];
  console.log("✅ Using existing Firebase app");
}

// Auth
export const auth = getAuth(app);
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  try {
    connectAuthEmulator(auth, "http://localhost:9099", {
      disableWarnings: true,
    });
    console.log("✅ Auth emulator connected");
  } catch (error) {
    console.warn("⚠️ Auth emulator connection failed:", error);
  }
} else {
  console.log("🌐 Using production Firebase Auth");
}

// Storage
export const storage = getStorage(app);
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  try {
    connectStorageEmulator(storage, "localhost", 9199);
    console.log("✅ Storage emulator connected");
  } catch (error) {
    console.warn("⚠️ Storage emulator connection failed:", error);
  }
} else {
  console.log("🌐 Using production Storage");
}

export default app;
