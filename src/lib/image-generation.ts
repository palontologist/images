import { GoogleGenAI } from '@google/genai';

export async function generateImages(prompt: string, numberOfImages: number = 4) {
  const ai = new GoogleGenAI({});
  
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: numberOfImages,
    },
  });

  const images: { imageBytes: string; index: number }[] = [];
  let idx = 1;
  
  // Check if generatedImages exists and is an array
  if (response.generatedImages && Array.isArray(response.generatedImages)) {
    for (const generatedImage of response.generatedImages) {
      if (generatedImage.image && generatedImage.image.imageBytes) {
        const imgBytes = generatedImage.image.imageBytes;
        images.push({
          imageBytes: imgBytes,
          index: idx
        });
        idx++;
      }
    }
  }

  return images;
}

// Main function similar to the provided code sample
export async function main() {
  const ai = new GoogleGenAI({});
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: 'Robot holding a red skateboard',
    config: {
      numberOfImages: 4,
    },
  });

  let idx = 1;
  if (response.generatedImages && Array.isArray(response.generatedImages)) {
    for (const generatedImage of response.generatedImages) {
      if (generatedImage.image && generatedImage.image.imageBytes) {
        const imgBytes = generatedImage.image.imageBytes;
        // Process image bytes here
        console.log(`Generated image ${idx}:`, imgBytes.substring(0, 50) + '...');
        idx++;
      }
    }
  }
}