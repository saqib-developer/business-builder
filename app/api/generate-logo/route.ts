import { NextRequest, NextResponse } from "next/server";

const HUGGINGFACE_API_URL =
  "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt provided" },
        { status: 400 },
      );
    }

    // Enhance prompt for logo generation
    const enhancedPrompt = `Professional business logo design, ${prompt}, minimalist, clean design, vector style, high quality, white background, centered composition`;

    const response = await fetch(HUGGINGFACE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: enhancedPrompt,
        parameters: {
          negative_prompt:
            "blurry, low quality, distorted, ugly, amateur, text, watermark",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      // Handle specific error cases
      if (response.status === 503) {
        return NextResponse.json(
          {
            error: "AI model is loading. Please wait a moment and try again.",
            code: "MODEL_LOADING",
          },
          { status: 503 },
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error: "Too many requests. Please wait a moment and try again.",
            code: "RATE_LIMIT",
          },
          { status: 429 },
        );
      }

      if (response.status === 400) {
        return NextResponse.json(
          {
            error: "Invalid prompt. Please try a different description.",
            code: "INVALID_PROMPT",
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          error: errorData.error || `Failed to generate image: ${errorText}`,
          code: "GENERATION_FAILED",
          details: errorData,
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
