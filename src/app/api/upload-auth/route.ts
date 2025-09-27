import { getUploadAuthParams } from '@imagekit/next/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if environment variables are set
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      return NextResponse.json(
        { 
          error: 'ImageKit credentials not configured. Please set IMAGEKIT_PRIVATE_KEY and NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY in your environment variables.' 
        },
        { status: 500 }
      );
    }

    const { token, expire, signature } = getUploadAuthParams({
      privateKey,
      publicKey,
    });

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
    });
  } catch (error) {
    console.error('Error generating upload auth params:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload authentication parameters' },
      { status: 500 }
    );
  }
}

// Also support POST method for form data
export async function POST() {
  return GET();
}