import { NextRequest, NextResponse } from "next/server";
import imagekit from "../../../lib/imagekit";

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
      console.error("Missing ImageKit environment variables:", {
        hasPublicKey: !!process.env.IMAGEKIT_PUBLIC_KEY,
        hasPrivateKey: !!process.env.IMAGEKIT_PRIVATE_KEY,
        hasUrlEndpoint: !!process.env.IMAGEKIT_URL_ENDPOINT,
      });
      return NextResponse.json(
        { error: "ImageKit configuration is missing" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { file, fileName } = body;

    if (!file || !fileName) {
      return NextResponse.json(
        { error: "File and fileName are required" },
        { status: 400 }
      );
    }

    console.log("Attempting to upload file:", fileName);

    // Upload image to ImageKit
    const response = await imagekit.upload({
      file, // base64 string or binary
      fileName,
      folder: "/uploads", // Optional: organize uploads in folders
    });

    console.log("Upload successful:", response.fileId);

    return NextResponse.json({
      success: true,
      data: response,
      url: response.url,
      fileId: response.fileId,
    });
  } catch (error: unknown) {
    console.error("ImageKit upload error:", error);
    
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        name: error.name,
      });
    }
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Upload failed",
        details: "Please check your ImageKit credentials and configuration"
      },
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