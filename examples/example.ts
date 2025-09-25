// Example script demonstrating the exact functionality from the problem statement
import { GoogleGenAI } from '@google/genai';

async function main() {
  const ai = new GoogleGenAI({});
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: 'Robot holding a red skateboard',
    config: {
      numberOfImages: 4,
    },
  });

  let idx = 1;
  for (const generatedImage of response.generatedImages) {
    let imgBytes = generatedImage.image.imageBytes;
    
    // Process the image bytes here
    console.log(`Generated image ${idx}:`, imgBytes.substring(0, 50) + '...');
    
    // You can save the image to file or process it further
    // Example: fs.writeFileSync(`image-${idx}.png`, Buffer.from(imgBytes, 'base64'));
    
    idx++;
  }
}

main().catch(console.error);