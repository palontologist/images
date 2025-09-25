# AI Image Generator

A Next.js 15 application that uses Google's Imagen AI model to generate images based on text prompts.

## Features

- 🎨 Generate images using Google's Imagen-4.0 model
- 🖼️ Support for generating 1-4 images per request
- 📱 Responsive UI built with Tailwind CSS
- 💾 Download generated images as PNG files
- ⚡ Built with Next.js 15 and TypeScript

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- Google AI API key (set up environment variables for production use)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd images
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

### Web Interface

1. Enter a text prompt describing the image you want to generate
2. Select the number of images (1-4)
3. Click "Generate Images"
4. View and download the generated images

### Programmatic Usage

The core functionality from the problem statement is implemented in `src/lib/image-generation.ts`:

```typescript
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
    // Process image bytes here
    console.log(`Generated image ${idx}:`, imgBytes.substring(0, 50) + '...');
    idx++;
  }
}

main();
```

See `examples/example.ts` for a complete standalone example.

## API Endpoints

- `POST /api/generate` - Generate images based on a text prompt

Request body:
```json
{
  "prompt": "Robot holding a red skateboard",
  "numberOfImages": 4
}
```

## Project Structure

```
src/
├── app/
│   ├── api/generate/route.ts    # API endpoint for image generation
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main UI page
│   └── globals.css              # Global styles
├── lib/
│   └── image-generation.ts      # Core image generation logic
└── examples/
    └── example.ts               # Standalone example script
```

## Technologies Used

- Next.js 15.5.4
- React 19.1.0
- TypeScript
- Tailwind CSS 4
- Google AI SDK (@google/genai)

## Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Google AI SDK Documentation](https://ai.google.dev/)
- [Imagen AI Model](https://deepmind.google/technologies/imagen/)
