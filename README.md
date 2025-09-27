# ImageKit Next.js Demo

A comprehensive Next.js application with TypeScript integration showcasing ImageKit's powerful image transformation and AI features.

![ImageKit Demo Homepage](https://github.com/user-attachments/assets/4434aff0-9bf9-4da0-bb2b-44820decb96b)

## Features

- ✅ **Next.js 15** with TypeScript and Tailwind CSS
- ✅ **ImageKit Integration** with `@imagekit/next` SDK
- ✅ **AI-Powered Transformations**:
  - Background removal
  - AI upscaling
  - Drop shadow effects
  - Grayscale and other effects
- ✅ **Secure Image Uploads** with authentication
- ✅ **Responsive Image Delivery** with automatic optimization
- ✅ **Type-Safe Components** with TypeScript interfaces
- ✅ **Modern UI** with Tailwind CSS styling

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Then update `.env.local` with your ImageKit credentials:

```env
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key_here
IMAGEKIT_PRIVATE_KEY=your_private_key_here
```

Get these credentials from your [ImageKit Dashboard](https://imagekit.io/dashboard).

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── upload-auth/     # Secure upload authentication API
│   ├── upload/              # Image upload demo page
│   ├── layout.tsx           # Root layout with ImageKit provider
│   └── page.tsx            # Homepage with transformation demos
├── components/
│   ├── ImageKitImage.tsx   # Reusable ImageKit image component
│   └── ImageUpload.tsx     # Upload component with progress
└── types/
    └── imagekit.ts         # TypeScript interfaces for ImageKit
```

## Key Features Demonstrated

### 1. Basic Image Transformations
- Resize and crop images
- Format optimization (WebP, JPEG, PNG)
- Quality control

### 2. AI-Powered Features
- **Background Removal**: Automatically remove backgrounds using AI
- **AI Upscaling**: Enhance image resolution with AI
- **Drop Shadow**: Add professional drop shadows

### 3. Secure Upload Workflow
![Upload Demo](https://github.com/user-attachments/assets/635882e4-f7b4-49a2-b274-2fae9a57853b)

The upload functionality includes:
- Secure authentication via API routes
- Real-time upload progress
- Multiple transformation previews
- Error handling and validation

### 4. Responsive Image Delivery
- Automatic format selection based on browser support
- Device-specific optimization
- Lazy loading for better performance

## API Routes

### `/api/upload-auth`

Provides secure upload authentication parameters. This endpoint:
- Generates temporary upload tokens
- Signs upload requests securely
- Never exposes private keys to the client

## Components

### `ImageKitImage`
A wrapper around ImageKit's Image component with TypeScript support:

```tsx
import ImageKitImage from '@/components/ImageKitImage';

<ImageKitImage
  src="/sample.jpg"
  width={400}
  height={300}
  alt="Sample image"
  transformation={[
    { width: 400, height: 300, crop: "maintain_ratio" },
    { quality: 80, format: "webp" }
  ]}
/>
```

### `ImageUpload`
A complete upload solution with progress tracking:

```tsx
import ImageUpload from '@/components/ImageUpload';

<ImageUpload
  onUploadSuccess={(result) => console.log('Uploaded:', result)}
  onUploadError={(error) => console.error('Error:', error)}
/>
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | Your ImageKit URL endpoint | Yes |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | Your ImageKit public key | Yes |
| `IMAGEKIT_PRIVATE_KEY` | Your ImageKit private key (server-side only) | Yes |

## Build and Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## ImageKit Transformations

This demo showcases various ImageKit transformations:

- **Resize**: `{ width: 400, height: 300 }`
- **Crop**: `{ crop: "maintain_ratio" }`
- **Quality**: `{ quality: 80 }`
- **Format**: `{ format: "webp" }`
- **AI Background Removal**: `{ aiRemoveBackground: true }`
- **AI Upscaling**: `{ aiUpscale: true }`
- **Drop Shadow**: `{ aiDropShadow: true }`
- **Grayscale**: `{ grayscale: true }`
- **Border**: `{ border: "5_FF0000" }`

## Learn More

- [ImageKit Documentation](https://imagekit.io/docs)
- [ImageKit Next.js SDK](https://imagekit.io/docs/integration/nextjs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## License

This project is open source and available under the [MIT License](LICENSE).
