// DEPRECATED: This file is no longer used since Firestore was removed
// The app now uses localStorage for data persistence
// Keeping this file for reference only

/*
// import { firestore } from "@/lib/firebase/firebase";
import {
  collection,
  setDoc,
  doc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { User } from "@/lib/types";

// Helper functions
const now = new Date();
const timestamp = serverTimestamp();

const IMAGES = {
  avatars: [
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  ],
  games: [
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop", // Space theme
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop", // Gaming
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop", // Tech
  ],
  projects: [
    "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop", // Code
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop", // Retro gaming
    "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=800&h=600&fit=crop", // Programming
  ],
  services: [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop", // Art/Design
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop", // Marketing
  ],
};

// Helper function to delete all documents in a collection
async function deleteCollection(collectionPath: string) {
  console.log(`🗑️ Cleaning collection: ${collectionPath}`);
  const collectionRef = collection(firestore, collectionPath);
  const snapshot = await getDocs(collectionRef);

  if (snapshot.empty) {
    console.log(`   ✅ Collection ${collectionPath} is already empty`);
    return;
  }

  const batch = writeBatch(firestore);
  let batchCount = 0;

  for (const docSnapshot of snapshot.docs) {
    batch.delete(docSnapshot.ref);
    batchCount++;

    // Firestore batch limit is 500 operations
    if (batchCount === 500) {
      await batch.commit();
      console.log(
        `   🔄 Committed batch of ${batchCount} deletions for ${collectionPath}`
      );
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(
      `   ✅ Deleted ${snapshot.docs.length} documents from ${collectionPath}`
    );
  }
}

// Helper function to delete all subcollections (like chat messages)
async function deleteSubcollections() {
  console.log("🗑️ Cleaning chat message subcollections...");

  // Get all chat rooms first
  const chatsSnapshot = await getDocs(collection(firestore, "chats"));

  for (const chatDoc of chatsSnapshot.docs) {
    const messagesRef = collection(firestore, `chats/${chatDoc.id}/messages`);
    const messagesSnapshot = await getDocs(messagesRef);

    if (!messagesSnapshot.empty) {
      const batch = writeBatch(firestore);
      messagesSnapshot.docs.forEach((messageDoc) => {
        batch.delete(messageDoc.ref);
      });
      await batch.commit();
      console.log(
        `   ✅ Deleted ${messagesSnapshot.docs.length} messages from chat ${chatDoc.id}`
      );
    }
  }
}

export default async function initializeDummyData() {
  console.log("🚀 Starting Firestore initialization with dummy data...");
  console.log("🧹 First, cleaning existing data...");

  try {
    // List of all collections to clean
    const collectionsToClean = ["users"];

    // Clean subcollections first (chat messages)
    await deleteSubcollections();

    // Clean main collections
    for (const collectionName of collectionsToClean) {
      await deleteCollection(collectionName);
    }

    console.log("✅ Database cleanup completed successfully!");
    console.log("📝 Now creating fresh dummy data...");
  } catch (error) {
    console.error("❌ Error during database cleanup:", error);
    throw error;
  }

  // USERS - Create both Firebase Auth and Firestore user documents
  console.log("🔑 Creating users with authentication and user data...");

  // Import auth functions
  const {
    getAuth,
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
  } = await import("firebase/auth");
  const auth = getAuth();

  // Single comprehensive users array following the User type
  // Note: The 'id' field will be replaced with Firebase Auth UID after account creation
  const allUsers: (Partial<Omit<User, "id">> & {
    email: string;
    firstName: string;
    lastName: string;
    role: "user" | "admin";
    password: string;
    tempId: string;
    createdAt: Date;
  })[] = [
    // Admin users
    {
      tempId: "saqib_admin_2025", // Temporary ID for reference
      email: "muhammadsaqib8379@gmail.com",
      password: "123456",
      firstName: "Muhammad",
      lastName: "Saqib",
      role: "admin",

      createdAt: now,
    },
    {
      tempId: "touseef_admin_2025",
      email: "mtouseefahmad262@gmail.com",
      password: "123456",
      firstName: "Touseef",
      lastName: "Ahmad",
      role: "admin",
      createdAt: now,
    },
    {
      tempId: "admin_doxfen_2025",
      email: "admin@doxfen.com",
      password: "123456",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      createdAt: now,
    },
    {
      tempId: "support_doxfen_2025",
      email: "support@doxfen.com",
      password: "123456",
      firstName: "Support",
      lastName: "Manager",
      role: "admin",
      createdAt: now,
    },

    // Regular users
    {
      tempId: "user_alice_2025",
      email: "alice@example.com",
      password: "123456",
      firstName: "Alice",
      lastName: "Doe",
      role: "user",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 200),
    },
    {
      tempId: "user_bob_2025",
      email: "bob@example.com",
      password: "123456",
      firstName: "Bob",
      lastName: "Smith",
      role: "user",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 150),
    },
    {
      tempId: "user_charlie_2025",
      email: "charlie@example.com",
      password: "123456",
      firstName: "Charlie",
      lastName: "Wilson",
      role: "user",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30),
    },
    {
      tempId: "user_john_2025",
      email: "user1@example.com",
      password: "123456",
      firstName: "John",
      lastName: "Developer",
      role: "user",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 45),
    },
    {
      tempId: "user_sarah_2025",
      email: "user2@example.com",
      password: "123456",
      firstName: "Sarah",
      lastName: "Designer",
      role: "user",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20),
    },
    {
      tempId: "user_mike_2025",
      email: "gamer@example.com",
      password: "123456",
      firstName: "Mike",
      lastName: "Gamer",
      role: "user",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 12),
    },
    {
      tempId: "user_emma_2025",
      email: "dev@example.com",
      password: "123456",
      firstName: "Emma",
      lastName: "GameDev",
      role: "user",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 8),
    },
  ];

  const createdUsers: {
    [email: string]: { uid: string; role: string; userData: User };
  } = {}; // email -> {uid, role, userData} mapping

  // Step 1: Create Firebase Auth accounts for all users
  for (const user of allUsers) {
    try {
      // First check if user with this email already exists
      const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);

      if (signInMethods.length > 0) {
        console.log(
          `ℹ️ User with email ${user.email} already exists, skipping auth creation...`
        );
        continue;
      }

      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      const uid = userCredential.user.uid;

      // Prepare user data for Firestore (remove password and tempId, add real id)
      const { password, tempId, ...userDataForFirestore } = user;
      const userDocumentData: User = {
        id: uid,
        email: userDataForFirestore.email!,
        firstName: userDataForFirestore.firstName!,
        lastName: userDataForFirestore.lastName!,
        role: userDataForFirestore.role!,
        country: userDataForFirestore.country || "",
        dob: userDataForFirestore.dob || new Date(),
        phone: userDataForFirestore.phone || "",
        photoURL: userDataForFirestore.photoURL || "",
        address: userDataForFirestore.address || "",
        bio: userDataForFirestore.bio || "",
        dateOfBirth: userDataForFirestore.dateOfBirth || "",
        purchaseHistory: userDataForFirestore.purchaseHistory || {
          activeServices: [],
          totalServicesOrdered: 0,
          totalSpent: 0,
          totalOrders: 0,
          boughtProducts: [],
        },
        createdAt: userDataForFirestore.createdAt || new Date(),
        paymentMethods: userDataForFirestore.paymentMethods || [],
        consent: userDataForFirestore.consent || {
          marketingEmails: false,
          termsOfService: true,
          privacyPolicy: true,
        },
      };

      createdUsers[user.email] = {
        uid,
        role: user.role,
        userData: userDocumentData,
      };

      console.log(
        `✅ Created auth user: ${user.email} with UID: ${uid} (${user.role})`
      );
    } catch (error: any) {
      if (error?.code === "auth/email-already-in-use") {
        console.log(
          `ℹ️ User ${user.email} already exists, skipping auth creation...`
        );
      } else {
        console.error(`❌ Error creating user ${user.email}:`, error);
      }
    }
  }

  // Step 2: Create Firestore user documents in users/{uid} collection
  console.log("\n📝 Creating user documents in Firestore...");
  for (const [email, { uid, role, userData }] of Object.entries(createdUsers)) {
    try {
      // Save to users/{uid} collection using the Firebase Auth UID as document ID
      await setDoc(doc(firestore, "users", uid), userData);
      console.log(
        `✅ Created user document: users/${uid} (${role}) - ${email}`
      );
    } catch (error) {
      console.error(`❌ Error creating user document for ${email}:`, error);
    }
  }

  // Summary
  const totalUsers = Object.keys(createdUsers).length;
  const adminCount = Object.values(createdUsers).filter(
    (userData) => userData.role === "admin"
  ).length;
  const userCount = totalUsers - adminCount;

  console.log(`\n🎉 User creation summary:`);
  console.log(`   📊 Total users processed: ${totalUsers}`);
  console.log(`   👑 Admin users: ${adminCount}`);
  console.log(`   👤 Regular users: ${userCount}`);
  console.log(`\n📧 Test user credentials:`);
  Object.entries(createdUsers).forEach(([email, { uid, role }]) => {
    const originalUser = allUsers.find((u) => u.email === email);
    if (originalUser) {
      console.log(
        `   - ${email} (${role}): ${originalUser.password} [UID: ${uid}]`
      );
    }
  });

  console.log("✅ Firestore initialization completed successfully!");
  console.log(`📊 Created:
  👥 ${allUsers.length} users
`);
}
*/
