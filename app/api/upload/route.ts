import { NextRequest, NextResponse } from "next/server";
import imagekit from "../../../lib/imagekit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { file, fileName } = body;

    if (!file || !fileName) {
      return NextResponse.json(
        { error: "File and fileName are required" },
        { status: 400 }
      );
    }

    // Upload image to ImageKit
    const response = await imagekit.upload({
      file, // base64 string or binary
      fileName,
      folder: "/uploads", // Optional: organize uploads in folders
    });

    return NextResponse.json({
      success: true,
      data: response,
      url: response.url,
      fileId: response.fileId,
    });
  } catch (error: unknown) {
    console.error("ImageKit upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for retrieving upload authentication parameters
export async function GET() {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Authentication failed" },
      { status: 500 }
    );
  }
}