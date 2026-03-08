import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "./firebase";

// Helper function to remove undefined values from objects before saving to Firestore
function cleanUndefinedValues(obj: any): any {
  const cleaned: any = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
}

// ============= USER MANAGEMENT =============

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  country?: string;
  phone?: string;
  photoURL?: string;
  address?: string;
  bio?: string;
  dateOfBirth?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export async function createUserProfile(
  userId: string,
  userData: Omit<UserProfile, "id" | "createdAt" | "updatedAt" | "role"> & {
    role?: "user" | "admin";
  },
): Promise<void> {
  const userRef = doc(firestore, "users", userId);

  // Clean undefined values before saving to Firestore
  await setDoc(
    userRef,
    cleanUndefinedValues({
      ...userData,
      id: userId,
      role: userData.role || "user",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
  );
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const userRef = doc(firestore, "users", userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }
  return null;
}

export async function updateUserRole(
  userId: string,
  role: "user" | "admin",
): Promise<void> {
  const userRef = doc(firestore, "users", userId);
  await updateDoc(userRef, {
    role,
    updatedAt: serverTimestamp(),
  });
}

// ============= LOGO DATA =============

export interface LogoData {
  userId: string;
  type: "upload" | "ai-generated" | "custom";
  convexStorageId?: string;
  url?: string;
  fileName?: string;
  aiPrompt?: string;
  aiGenerationCount?: number;
  customDesignRequestId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export async function saveLogoData(
  userId: string,
  logoData: Omit<LogoData, "createdAt" | "updatedAt" | "userId">,
): Promise<void> {
  const logoRef = doc(firestore, "userLogos", userId);
  const existingDoc = await getDoc(logoRef);

  if (existingDoc.exists()) {
    await updateDoc(
      logoRef,
      cleanUndefinedValues({
        ...logoData,
        updatedAt: serverTimestamp(),
      }),
    );
  } else {
    await setDoc(
      logoRef,
      cleanUndefinedValues({
        ...logoData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    );
  }
}

export async function getLogoData(userId: string): Promise<LogoData | null> {
  const logoRef = doc(firestore, "userLogos", userId);
  const logoDoc = await getDoc(logoRef);

  if (logoDoc.exists()) {
    return logoDoc.data() as LogoData;
  }
  return null;
}

// ============= AI GENERATION RATE LIMITING =============

export interface AIGenerationRecord {
  userId: string;
  count: number;
  lastGeneratedAt: Timestamp;
  dailyLimit: number;
}

const DAILY_AI_GENERATION_LIMIT = 10; // Hard limit for AI generation

export async function checkAIGenerationLimit(
  userId: string,
): Promise<{ canGenerate: boolean; remaining: number; resetTime?: Date }> {
  const limitRef = doc(firestore, "aiGenerationLimits", userId);
  const limitDoc = await getDoc(limitRef);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!limitDoc.exists()) {
    // First time user
    return { canGenerate: true, remaining: DAILY_AI_GENERATION_LIMIT };
  }

  const data = limitDoc.data() as AIGenerationRecord;
  const lastGenDate = data.lastGeneratedAt?.toDate();

  // Reset count if last generation was before today
  if (lastGenDate && lastGenDate < todayStart) {
    return { canGenerate: true, remaining: DAILY_AI_GENERATION_LIMIT };
  }

  const remaining = DAILY_AI_GENERATION_LIMIT - data.count;
  const resetTime = new Date(todayStart);
  resetTime.setDate(resetTime.getDate() + 1);

  return {
    canGenerate: remaining > 0,
    remaining: Math.max(0, remaining),
    resetTime,
  };
}

export async function incrementAIGenerationCount(
  userId: string,
): Promise<void> {
  const limitRef = doc(firestore, "aiGenerationLimits", userId);
  const limitDoc = await getDoc(limitRef);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!limitDoc.exists()) {
    await setDoc(limitRef, {
      userId,
      count: 1,
      lastGeneratedAt: serverTimestamp(),
      dailyLimit: DAILY_AI_GENERATION_LIMIT,
    });
    return;
  }

  const data = limitDoc.data() as AIGenerationRecord;
  const lastGenDate = data.lastGeneratedAt?.toDate();

  // Reset count if last generation was before today
  if (lastGenDate && lastGenDate < todayStart) {
    await updateDoc(limitRef, {
      count: 1,
      lastGeneratedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(limitRef, {
      count: data.count + 1,
      lastGeneratedAt: serverTimestamp(),
    });
  }
}

// ============= CUSTOM DESIGN REQUESTS =============

export interface CustomDesignRequest {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export async function createCustomDesignRequest(
  userId: string,
  userEmail: string,
  userName: string,
): Promise<string> {
  const requestsRef = collection(firestore, "customDesignRequests");
  const docRef = await addDoc(requestsRef, {
    userId,
    userEmail,
    userName,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getCustomDesignRequest(
  userId: string,
): Promise<CustomDesignRequest | null> {
  const requestsRef = collection(firestore, "customDesignRequests");
  const q = query(requestsRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as CustomDesignRequest;
}

// ============= CHAT MESSAGES =============

export interface ChatMessage {
  id?: string;
  conversationId: string;
  senderId: string;
  senderType: "user" | "admin";
  senderName: string;
  content: string;
  imageUrl?: string;
  convexStorageId?: string;
  createdAt: Timestamp;
  read: boolean;
}

export interface Conversation {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  conversationType: "logo" | "wordpress" | "custom-code";
  customDesignRequestId?: string;
  lastMessage?: string;
  lastMessageAt?: Timestamp;
  unreadCount: number;
  status: "active" | "closed";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export async function createConversation(
  userId: string,
  userEmail: string,
  userName: string,
  conversationType: "logo" | "wordpress" | "custom-code",
  customDesignRequestId?: string,
): Promise<string> {
  const conversationsRef = collection(firestore, "conversations");
  const docRef = await addDoc(
    conversationsRef,
    cleanUndefinedValues({
      userId,
      userEmail,
      userName,
      conversationType,
      customDesignRequestId,
      unreadCount: 0,
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
  );
  return docRef.id;
}

export async function getConversationByUserId(
  userId: string,
): Promise<Conversation | null> {
  const conversationsRef = collection(firestore, "conversations");
  const q = query(conversationsRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Conversation;
}

export async function getConversationByUserIdAndType(
  userId: string,
  conversationType: "logo" | "wordpress" | "custom-code",
): Promise<Conversation | null> {
  const conversationsRef = collection(firestore, "conversations");
  const q = query(
    conversationsRef,
    where("userId", "==", userId),
    where("conversationType", "==", conversationType),
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Conversation;
}

export async function getAllConversations(): Promise<Conversation[]> {
  const conversationsRef = collection(firestore, "conversations");
  const q = query(conversationsRef, orderBy("updatedAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Conversation[];
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderType: "user" | "admin",
  senderName: string,
  content: string,
  imageUrl?: string,
  convexStorageId?: string,
): Promise<string> {
  const messagesRef = collection(
    firestore,
    "conversations",
    conversationId,
    "messages",
  );

  // Clean undefined values before saving to Firestore
  const messageDoc = await addDoc(
    messagesRef,
    cleanUndefinedValues({
      conversationId,
      senderId,
      senderType,
      senderName,
      content,
      imageUrl,
      convexStorageId,
      createdAt: serverTimestamp(),
      read: false,
    }),
  );

  // Update conversation with last message
  const conversationRef = doc(firestore, "conversations", conversationId);
  await updateDoc(conversationRef, {
    lastMessage: content || "Image",
    lastMessageAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    unreadCount:
      senderType === "user"
        ? 0
        : (await getDoc(conversationRef)).data()?.unreadCount + 1 || 1,
  });

  return messageDoc.id;
}

export function subscribeToMessages(
  conversationId: string,
  callback: (messages: ChatMessage[]) => void,
): () => void {
  const messagesRef = collection(
    firestore,
    "conversations",
    conversationId,
    "messages",
  );
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatMessage[];
    callback(messages);
  });
}

export async function markMessagesAsRead(
  conversationId: string,
  userId: string,
): Promise<void> {
  const messagesRef = collection(
    firestore,
    "conversations",
    conversationId,
    "messages",
  );
  const q = query(messagesRef, where("read", "==", false));
  const snapshot = await getDocs(q);

  const updates = snapshot.docs
    .filter((doc) => doc.data().senderId !== userId)
    .map((doc) => updateDoc(doc.ref, { read: true }));

  await Promise.all(updates);

  // Reset unread count
  const conversationRef = doc(firestore, "conversations", conversationId);
  await updateDoc(conversationRef, { unreadCount: 0 });
}

// ============= COMMUNITY POSTS =============

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  title: string;
  body: string;
  category: string;
  likes: number;
  likedBy: string[];
  replyCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CommunityReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  body: string;
  likes: number;
  likedBy: string[];
  createdAt: Timestamp;
}

export async function createCommunityPost(postData: {
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  title: string;
  body: string;
  category: string;
}): Promise<string> {
  const postsRef = collection(firestore, "communityPosts");
  const newPost = {
    ...postData,
    likes: 0,
    likedBy: [],
    replyCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(postsRef, cleanUndefinedValues(newPost));
  return docRef.id;
}

export function subscribeToCommunityPosts(
  callback: (posts: CommunityPost[]) => void,
): () => void {
  const postsRef = collection(firestore, "communityPosts");
  const q = query(postsRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CommunityPost[];
    callback(posts);
  });
}

export async function createReply(replyData: {
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  body: string;
}): Promise<void> {
  const repliesRef = collection(
    firestore,
    "communityPosts",
    replyData.postId,
    "replies",
  );

  const newReply = {
    postId: replyData.postId,
    authorId: replyData.authorId,
    authorName: replyData.authorName,
    authorAvatar: replyData.authorAvatar,
    body: replyData.body,
    likes: 0,
    likedBy: [],
    createdAt: serverTimestamp(),
  };

  await addDoc(repliesRef, cleanUndefinedValues(newReply));

  // Increment reply count on the post
  const postRef = doc(firestore, "communityPosts", replyData.postId);
  const postSnap = await getDoc(postRef);
  if (postSnap.exists()) {
    const currentCount = postSnap.data().replyCount || 0;
    await updateDoc(postRef, { replyCount: currentCount + 1 });
  }
}

export function subscribeToReplies(
  postId: string,
  callback: (replies: CommunityReply[]) => void,
): () => void {
  const repliesRef = collection(firestore, "communityPosts", postId, "replies");
  const q = query(repliesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const replies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CommunityReply[];
    callback(replies);
  });
}

export async function togglePostLike(
  postId: string,
  userId: string,
): Promise<void> {
  const postRef = doc(firestore, "communityPosts", postId);
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    const likedBy = postSnap.data().likedBy || [];
    const hasLiked = likedBy.includes(userId);

    if (hasLiked) {
      // Unlike
      await updateDoc(postRef, {
        likes: (postSnap.data().likes || 1) - 1,
        likedBy: likedBy.filter((id: string) => id !== userId),
      });
    } else {
      // Like
      await updateDoc(postRef, {
        likes: (postSnap.data().likes || 0) + 1,
        likedBy: [...likedBy, userId],
      });
    }
  }
}

export async function toggleReplyLike(
  postId: string,
  replyId: string,
  userId: string,
): Promise<void> {
  const replyRef = doc(firestore, "communityPosts", postId, "replies", replyId);
  const replySnap = await getDoc(replyRef);

  if (replySnap.exists()) {
    const likedBy = replySnap.data().likedBy || [];
    const hasLiked = likedBy.includes(userId);

    if (hasLiked) {
      // Unlike
      await updateDoc(replyRef, {
        likes: (replySnap.data().likes || 1) - 1,
        likedBy: likedBy.filter((id: string) => id !== userId),
      });
    } else {
      // Like
      await updateDoc(replyRef, {
        likes: (replySnap.data().likes || 0) + 1,
        likedBy: [...likedBy, userId],
      });
    }
  }
}
