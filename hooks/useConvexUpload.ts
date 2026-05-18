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

function withTimeout<T>(promise: Promise<T>, ms: number, stage: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Timeout while ${stage}.`));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }) as Promise<T>;
}

function getDetailedUploadErrorMessage(error: unknown, stage: string): string {
  const rawMessage = error instanceof Error ? error.message : String(error || "");
  const message = rawMessage.toLowerCase();

  if (message.includes("timeout")) {
    return `Upload timed out while ${stage}. This usually means the upload service is unreachable or very slow.`;
  }

  if (
    message.includes("websocket") ||
    message.includes("convex") ||
    message.includes("connection") ||
    message.includes("network")
  ) {
    return "Cannot connect to the upload service (Convex). Check internet connection or Convex deployment status, then retry.";
  }

  if (message.includes("failed to fetch") || message.includes("load failed")) {
    return `Network request failed while ${stage}. The server may be unreachable from your browser.`;
  }

  if (message.includes("unauthorized") || message.includes("forbidden") || message.includes("401") || message.includes("403")) {
    return "Upload authorization failed. Your upload token/session may be invalid. Please sign in again and retry.";
  }

  if (message.includes("invalid") || message.includes("file type") || message.includes("size")) {
    return rawMessage;
  }

  return rawMessage || `Upload failed while ${stage}.`;
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
      let currentStage = "validating file";

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
      currentStage = "requesting upload URL";
      const uploadUrl = await withTimeout(generateUploadUrl(), 15000, currentStage);
      setUploadProgress(30);

      // Upload file to Convex storage
      currentStage = "uploading file to storage";
      const response = await withTimeout(fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      }), 30000, currentStage);

      if (!response.ok) {
        throw new Error(`Failed to upload file to storage (HTTP ${response.status})`);
      }

      const { storageId } = await response.json();
      setUploadProgress(70);

      // Save file record and get URL
      currentStage = "saving file metadata";
      const result = await withTimeout(saveFileRecord({
        storageId,
        userId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        category,
      }), 15000, currentStage);

      setUploadProgress(100);
      setIsUploading(false);

      return result as UploadResult;
    } catch (err: unknown) {
      const errorMessage = getDetailedUploadErrorMessage(err, "processing upload");
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
