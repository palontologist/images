import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const MODEL_NAME = "meta-llama/llama-4-maverick-17b-128e-instruct";

const systemInstruction = `You are an empathetic "AI Partner Aura Analyst". Review the person's selfie and short self-description.
Return a JSON object ONLY, using this exact schema:
{
  "rating": number (1-10, integer),
  "aura_summary": string (2-3 sentences explaining the vibe you see),
  "partner_persona": string (a playful one-sentence description of their ideal AI partner),
  "pollinations_prompt": string (rich, single prompt for generating a stylised AI partner portrait matching the person),
  "color_palette": string[] (3-5 evocative color words),
  "guidance": string (one friendly suggestion for connecting with the AI partner)
}
Ensure the prompt references aesthetic cues that align with the photo + description, avoids explicit mention of the user or real names, and stays positive.`;

function extractBase64Mime(dataUrl: string) {
  const segments = dataUrl.split(",", 2);
  if (segments.length !== 2) {
    throw new Error("Invalid data URL supplied for photo");
  }

  const header = segments[0];
  const base64 = segments[1];
  const mimeMatch = /^data:([^;]+);base64$/u.exec(header);

  if (!mimeMatch) {
    throw new Error("Invalid data URL supplied for photo");
  }

  return {
    mimeType: mimeMatch[1],
    data: base64,
  };
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY environment variable is required" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    const body = await request.json();
    const photo: unknown = body?.photo;
    const description: unknown = body?.description;

    if (typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    if (typeof photo !== "string" || photo.length === 0) {
      return NextResponse.json(
        { error: "Photo is required" },
        { status: 400 }
      );
    }

    // Validate and normalise the data URL
    const imageDataUrl = photo.trim();
    if (!imageDataUrl.startsWith("data:")) {
      throw new Error("Photo must be a base64 data URL");
    }

    // Ensure the payload is not excessively large (> 5MB)
    if (imageDataUrl.length > 7 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Photo is too large. Please upload an image under ~5MB." },
        { status: 413 }
      );
    }

    const { mimeType } = extractBase64Mime(imageDataUrl);

    const userContent = [
      {
        type: "text",
        text: `User description: ${description.trim()}\n\nRespond strictly with JSON following the provided schema.`,
      },
      {
        type: "image_url",
        image_url: {
          url: imageDataUrl,
          mime_type: mimeType,
        },
      },
    ] as const;

    let rawContent: unknown;
    try {
      const completion = await groq.chat.completions.create({
        model: MODEL_NAME,
        temperature: 0.65,
        max_completion_tokens: 800,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: systemInstruction,
          },
          {
            role: "user",
            // @ts-expect-error Groq SDK typings do not yet cover multimodal content arrays.
            content: userContent,
          },
        ],
      });

      rawContent = completion?.choices?.[0]?.message?.content;
    } catch (error) {
      console.error("Groq API error", error);
      return NextResponse.json(
        {
          error: "Aura analysis failed",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 502 }
      );
    }

    if (typeof rawContent !== "string") {
      console.error("Unexpected response content", rawContent);
      return NextResponse.json(
        { error: "Unexpected response from analysis model" },
        { status: 502 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (error) {
      console.error("Failed to parse analysis JSON", rawContent, error);
      return NextResponse.json(
        { error: "Failed to parse analysis output" },
        { status: 502 }
      );
    }

    const rating = Number(parsed.rating ?? parsed.score ?? parsed.aura_score);
    const auraSummary: string = parsed.aura_summary ?? parsed.summary ?? "";
    const partnerPersona: string = parsed.partner_persona ?? parsed.persona ?? "";
    const pollinationsPrompt: string = parsed.pollinations_prompt ?? parsed.generated_prompt ?? "";
    const colorPalette: string[] = Array.isArray(parsed.color_palette)
      ? parsed.color_palette.map((item: unknown) => String(item))
      : [];
    const guidance: string = parsed.guidance ?? parsed.tip ?? "";

    if (!pollinationsPrompt) {
      return NextResponse.json(
        { error: "Analysis did not return a generation prompt" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      rating: Number.isFinite(rating) ? Math.min(Math.max(Math.round(rating), 1), 10) : null,
      auraSummary,
      partnerPersona,
      pollinationsPrompt,
      colorPalette,
      guidance,
    });
  } catch (error) {
    console.error("AI partner analysis error", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
