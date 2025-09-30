"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{
    url: string;
    fileId: string;
    fileName: string;
  }>>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Array<{
    id: string;
    url: string;
    mimeType: string;
    prompt: string;
  }>>([]);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            file: base64data, 
            fileName: file.name 
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          setUploadedImages(prev => [...prev, {
            url: result.url,
            fileId: result.fileId,
            fileName: result.data.name
          }]);
        } else {
          setUploadError(result.error || "Upload failed");
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadError("Upload failed");
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleGenerateImage = async () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setGenerationError("Please enter a prompt before generating an image.");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const message = result?.error || "Image generation failed";
        setGenerationError(message);
        return;
      }

      const mimeType = typeof result.mimeType === "string" && result.mimeType.length > 0 ? result.mimeType : "image/png";
      const dataUrl = `data:${mimeType};base64,${result.image}`;
      const newImage = {
        id: result.id ?? globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
        url: dataUrl,
        mimeType,
        prompt: trimmedPrompt,
      };

      setGeneratedImages(prev => [newImage, ...prev]);
      setPrompt("");
    } catch (error) {
      console.error("Failed to generate image", error);
      setGenerationError("Image generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        {/* ImageKit Upload Section */}
        <div className="w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">ImageKit Upload</h2>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <button
            onClick={triggerFileInput}
            disabled={isUploading}
            className="w-full rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                Uploading...
              </div>
            ) : (
              <div>
                <p className="text-gray-600">Click to select an image</p>
                <p className="text-sm text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </button>

          {uploadError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {uploadError}
            </div>
          )}
        </div>

        {/* Gemini Image Generation Section */}
        <div className="w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Generate with Google Gemini</h2>

          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe the image you want to create"
            className="w-full rounded-lg border border-gray-300 p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[140px]"
          />

          <button
            onClick={handleGenerateImage}
            disabled={isGenerating || !prompt.trim()}
            className="mt-4 w-full rounded-lg bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Generate Image"}
          </button>

          {generationError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {generationError}
            </div>
          )}
        </div>

        {/* Uploaded Images Display */}
        {uploadedImages.length > 0 && (
          <div className="w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Uploaded Images</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {uploadedImages.map((img) => (
                <div key={img.fileId} className="border rounded-lg p-4">
                  <Image
                    src={img.url}
                    alt={img.fileName}
                    width={300}
                    height={200}
                    className="rounded-lg object-cover w-full h-48"
                  />
                  <p className="mt-2 text-sm text-gray-600 truncate">{img.fileName}</p>
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View full image
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Images Display */}
        {generatedImages.length > 0 && (
          <div className="w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Generated Images</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {generatedImages.map((image) => (
                <div key={image.id} className="border rounded-lg p-4">
                  <Image
                    src={image.url}
                    alt={image.prompt}
                    width={512}
                    height={512}
                    unoptimized
                    className="rounded-lg object-cover w-full h-64"
                  />
                  <p className="mt-2 text-sm text-gray-600 max-h-12 overflow-hidden">{image.prompt}</p>
                  <a
                    href={image.url}
                    download={`gemini-image-${image.id}.${image.mimeType.split("/")[1] ?? "png"}`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">Generate images with Google Gemini using natural language prompts.</li>
          <li className="mb-2 tracking-[-.01em]">Upload images using ImageKit integration above.</li>
          <li className="tracking-[-.01em]">Images are automatically optimized and served via CDN.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
