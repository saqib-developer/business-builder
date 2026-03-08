"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

interface UploadResult {
  storageId: string;
  url: string | null;
  fileName: string;
  fileType: string;
  fileSize: number;
  userId: string;
  category: string;
  uploadedAt: number;
}

interface UseConvexUploadReturn {
  uploadFile: (
    file: File,
    userId: string,
    category: string,
  ) => Promise<UploadResult>;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  reset: () => void;
}

export function useConvexUpload(): UseConvexUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFileRecord = useMutation(api.files.saveFileRecord);

  const uploadFile = async (
    file: File,
    userId: string,
    category: string,
  ): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File size exceeds 10MB limit");
      }

      // Validate file type for images
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ];
      if (category === "logo" || category === "chat-image") {
        if (!allowedTypes.includes(file.type)) {
          throw new Error(
            "Invalid file type. Please upload a valid image (JPEG, PNG, GIF, WebP, or SVG)",
          );
        }
      }

      setUploadProgress(10);

      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();
      setUploadProgress(30);

      // Upload file to Convex storage
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file to storage");
      }

      const { storageId } = await response.json();
      setUploadProgress(70);

      // Save file record and get URL
      const result = await saveFileRecord({
        storageId,
        userId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        category,
      });

      setUploadProgress(100);
      setIsUploading(false);

      return result as UploadResult;
    } catch (err: any) {
      const errorMessage =
        err.message || "An error occurred while uploading the file";
      setError(errorMessage);
      setIsUploading(false);
      throw new Error(errorMessage);
    }
  };

  const reset = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
  };

  return {
    uploadFile,
    isUploading,
    uploadProgress,
    error,
    reset,
  };
}
