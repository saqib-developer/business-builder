import { NextRequest, NextResponse } from "next/server";

const PRIMARY_IMAGE_MODEL =
  process.env.HF_IMAGE_MODEL || "black-forest-labs/FLUX.1-schnell";
const FALLBACK_IMAGE_MODEL = "runwayml/stable-diffusion-v1-5";

function buildModelUrl(modelId: string): string {
  return `https://router.huggingface.co/hf-inference/models/${modelId}`;
}

function getHuggingFaceApiKey(): string {
  return (
    process.env.HUGGINGFACE_API_KEY ||
    process.env.HF_API_KEY ||
    process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY ||
    ""
  );
}

function toFriendlyMessage(status: number, rawError: string): {
  message: string;
  code: string;
} {
  const normalized = rawError.toLowerCase();

  if (
    normalized.includes("deprecated") ||
    normalized.includes("no longer supported")
  ) {
    return {
      message:
        "The AI image model is currently unavailable. Please try again shortly.",
      code: "MODEL_DEPRECATED",
    };
  }

  if (status === 503 || normalized.includes("loading")) {
    return {
      message: "AI model is warming up. Please wait a moment and try again.",
      code: "MODEL_LOADING",
    };
  }

  if (status === 429) {
    return {
      message: "Too many requests right now. Please try again in a minute.",
      code: "RATE_LIMIT",
    };
  }

  if (status === 400) {
    return {
      message:
        "Your logo prompt could not be processed. Please try a clearer description.",
      code: "INVALID_PROMPT",
    };
  }

  return {
    message: "We could not generate your logo right now. Please try again.",
    code: "GENERATION_FAILED",
  };
}

async function requestImageFromModel(modelId: string, prompt: string, apiKey: string) {
  const response = await fetch(buildModelUrl(modelId), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        negative_prompt:
          "blurry, low quality, distorted, ugly, watermark, text-heavy, noisy background",
        width: 1024,
        height: 1024,
        num_inference_steps: 28,
        guidance_scale: 5,
      },
    }),
  });

  return response;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    const apiKey = getHuggingFaceApiKey();

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Image generation is not configured. Please contact support.",
          code: "MISSING_HF_API_KEY",
        },
        { status: 500 },
      );
    }

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt provided" },
        { status: 400 },
      );
    }

    // Enhance prompt for logo generation
    const enhancedPrompt = `Professional business logo design, ${prompt}, minimalist, clean design, vector style, high quality, white background, centered composition`;

    let response = await requestImageFromModel(
      PRIMARY_IMAGE_MODEL,
      enhancedPrompt,
      apiKey,
    );

    // Automatic fallback when the provider rejects the selected model.
    if (!response.ok) {
      const firstErrorText = await response.text();
      const normalizedFirstError = firstErrorText.toLowerCase();
      const shouldTryFallback =
        PRIMARY_IMAGE_MODEL !== FALLBACK_IMAGE_MODEL &&
        (normalizedFirstError.includes("deprecated") ||
          normalizedFirstError.includes("no longer supported") ||
          normalizedFirstError.includes("not supported by provider"));

      if (shouldTryFallback) {
        response = await requestImageFromModel(
          FALLBACK_IMAGE_MODEL,
          enhancedPrompt,
          apiKey,
        );
      } else {
        const friendly = toFriendlyMessage(response.status, firstErrorText);
        return NextResponse.json(
          {
            error: friendly.message,
            code: friendly.code,
          },
          { status: response.status },
        );
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      const friendly = toFriendlyMessage(response.status, errorText);

      return NextResponse.json(
        {
          error: friendly.message,
          code: friendly.code,
        },
        { status: response.status },
      );
    }

    // Get image blob
    const imageBlob = await response.blob();
    // Return the image as a response
    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: "Internal server error while generating image",
        code: "SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}
