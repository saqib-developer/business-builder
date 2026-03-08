import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate upload URL for file uploads
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Store file record with metadata
export const saveFileRecord = mutation({
  args: {
    storageId: v.id("_storage"),
    userId: v.string(),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    category: v.string(), // "logo", "chat-image", etc.
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return {
      storageId: args.storageId,
      url,
      fileName: args.fileName,
      fileType: args.fileType,
      fileSize: args.fileSize,
      userId: args.userId,
      category: args.category,
      uploadedAt: Date.now(),
    };
  },
});

// Get file URL by storage ID
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Delete file from storage
export const deleteFile = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId);
    return { success: true };
  },
});
