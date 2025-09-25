import { NextRequest, NextResponse } from 'next/server';
import { generateImages } from '@/lib/image-generation';

export async function POST(request: NextRequest) {
  try {
    const { prompt, numberOfImages = 4 } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const images = await generateImages(prompt, numberOfImages);
    
    return NextResponse.json({ 
      success: true, 
      images,
      prompt,
      numberOfImages 
    });
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 }
    );
  }
}