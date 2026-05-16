"use client";

import {
  checkAIGenerationLimit,
  incrementAIGenerationCount,
} from "@/lib/firebase/firestoreService";

interface GenerateImageResult {
  success: boolean;
  imageBlob?: Blob;
  error?: string;
  remaining?: number;
}

export async function generateLogoImage(
  userId: string,
  prompt: string,
): Promise<GenerateImageResult> {
  // Check rate limit first
  const limitCheck = await checkAIGenerationLimit(userId);

  if (!limitCheck.canGenerate) {
    return {
      success: false,
      error: `Daily limit reached (${limitCheck.remaining} remaining). Resets at ${limitCheck.resetTime?.toLocaleTimeString()}`,
      remaining: limitCheck.remaining,
    };
  }

  try {
    // Call our API route instead of Hugging Face directly
    const response = await fetch("/api/generate-logo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      console.error("AI Generation Error:", {
        status: response.status,
        errorData,
      });

      // Handle specific error cases
      if (response.status === 503) {
        return {
          success: false,
          error: "AI model is loading. Please wait a moment and try again.",
          remaining: limitCheck.remaining,
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          error: "Too many requests. Please wait a moment and try again.",
          remaining: limitCheck.remaining,
        };
      }

      if (response.status === 400) {
        return {
          success: false,
          error:
            "Invalid prompt. Please try a different description for your logo.",
          remaining: limitCheck.remaining,
        };
      }

      return {
        success: false,
        error:
          errorData.error ||
          errorData.details?.error ||
          "Failed to generate image. Please try again.",
        remaining: limitCheck.remaining,
      };
    }

    const imageBlob = await response.blob();

    // Only increment count on successful generation
    await incrementAIGenerationCount(userId);

    // Get updated remaining count
    const updatedLimit = await checkAIGenerationLimit(userId);

    return {
      success: true,
      imageBlob,
      remaining: updatedLimit.remaining,
    };
  } catch (error: unknown) {
    console.error("AI generation error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: message || "An unexpected error occurred during image generation",
      remaining: limitCheck.remaining,
    };
  }
}

export function createImageFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, { type: blob.type || "image/png" });
}
