## Overview

This project showcases a Next.js image playground with three complementary workflows:

- **Discover** your AI partner aura. Upload a selfie and short description; Meta Llama 4 Maverick analyses the vibe and returns a bespoke Pollinations prompt.
- **Generate** photorealistic images on demand using Pollinations AI's `flux` model via the `@pollinations/react` hook.
- **Upload** existing assets to ImageKit for CDN-backed delivery and optimization.

Everything happens through the single-page experience in `app/page.tsx`.

## Prerequisites

- Node.js 18+ (recommended: the version used by Next.js 15)
- An ImageKit account
- A Groq Cloud account with access to `meta-llama/llama-4-maverick-17b-128e-instruct`

## Environment Setup

Create a `.env.local` file at the project root with the required credentials:

```bash
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_path
GROQ_API_KEY=your_groq_api_key
```

> The aura calculator calls Groq's Chat Completions API server-side. Keep your `GROQ_API_KEY` secret and configured only on the server.

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

1. **AI Partner Aura** – Upload a selfie and describe yourself. `/api/aipartner` sends the payload to Meta Llama 4 Maverick, receives an aura score and Pollinations prompt, and renders the generated partner card instantly.
2. **Generate with Pollinations** – Enter a natural language prompt and click **Generate Image**. The UI stores the prompt, derives a Pollinations image URL using `usePollinationsImage`, and renders the image instantly. You can download the result locally.
3. **Upload to ImageKit** – Click the upload card to pick a file. The file is converted to base64 in the browser and uploaded through `/api/upload`, which stores it in ImageKit and returns the CDN URL for display.
4. Review your generated and uploaded assets in their respective galleries below the controls.

## Troubleshooting

- **Groq API errors**: Confirm the `GROQ_API_KEY` is valid and the account has quota for `meta-llama/llama-4-maverick-17b-128e-instruct` multimodal calls. Server logs capture raw API errors for debugging.
- **ImageKit errors**: Double-check the ImageKit keys and URL endpoint. The upload route logs failures to the server console for easier debugging.

## Deployment

When deploying (for example, to Vercel), configure both the ImageKit environment variables and `GROQ_API_KEY` in the hosting platform. Pollinations runs in the browser, while the aura calculator and ImageKit uploads rely on the server-side API routes.
