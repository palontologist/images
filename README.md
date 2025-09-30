## Overview

This project showcases a Next.js image playground with two complementary workflows:

- **Generate** photorealistic images on demand using Google Gemini's `gemini-2.5-flash-image-preview` model.
- **Upload** existing assets to ImageKit for CDN-backed delivery and optimization.

Everything happens through the single-page experience in `app/page.tsx`.

## Prerequisites

- Node.js 18+ (recommended: the version used by Next.js 15)
- An ImageKit account
- Access to the Google Gemini API via [Google AI Studio](https://ai.google.dev/)

## Environment Setup

Create a `.env.local` file at the project root with the required credentials:

```bash
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_path
GOOGLE_GEMINI_API_KEY=your_google_gemini_key
```

> The Gemini key is used server-side by the API route at `app/api/generate/route.ts`.

## Install Dependencies

```bash
npm install
```

## Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to try it out.

## Usage

1. **Generate with Gemini** – Enter a natural language prompt and click **Generate Image**. The UI calls `/api/generate`, receives a base64 data URL, and renders the image instantly. You can download the result locally.
2. **Upload to ImageKit** – Click the upload card to pick a file. The file is converted to base64 in the browser and uploaded through `/api/upload`, which stores it in ImageKit and returns the CDN URL for display.
3. Review your generated and uploaded assets in their respective galleries below the controls.

## Troubleshooting

- **Gemini errors**: Ensure `GOOGLE_GEMINI_API_KEY` is present and that your Google Cloud project has access to the `gemini-2.5-flash-image-preview` model.
- **ImageKit errors**: Double-check the ImageKit keys and URL endpoint. The upload route logs failures to the server console for easier debugging.

## Deployment

When deploying (for example, to Vercel), configure the same environment variables in the hosting platform. Both API routes execute server-side only, so no secrets are exposed to the browser.
