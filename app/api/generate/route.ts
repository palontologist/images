import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-2.5-flash-image-preview";

let cachedClient: GoogleGenAI | null = null;

function getClient() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GOOGLE_GEMINI_API_KEY environment variable");
  }

  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey });
  }

  return cachedClient;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const ai = getClient();

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const candidates = response.candidates ?? [];

    for (const candidate of candidates) {
      const parts = candidate?.content?.parts ?? [];

      for (const part of parts) {
        if (part.inlineData?.data) {
          const mimeType = part.inlineData.mimeType ?? "image/png";

          return NextResponse.json({
            success: true,
            image: part.inlineData.data,
            mimeType,
            id: randomUUID(),
          });
        }
      }
    }

    const textOutputs = candidates
      .flatMap((candidate) => candidate?.content?.parts ?? [])
      .map((part) => part.text)
      .filter((text): text is string => typeof text === "string" && text.length > 0);

    return NextResponse.json(
      {
        error: "No image data returned from Gemini",
        details: textOutputs.join("\n"),
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("Gemini image generation error:", error);

    const message =
      error instanceof Error ? error.message : "Image generation failed";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
