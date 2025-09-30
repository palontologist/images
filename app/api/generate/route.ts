import { NextResponse } from "next/server";

/**
 * This route has been deprecated. Client-side image generation now uses Pollinations AI
 * via the `usePollinationsImage` hook, so no server request is required.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Image generation now occurs client-side via Pollinations AI. No server action required.",
    },
    { status: 410 }
  );
}
