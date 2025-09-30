"use client";

import Image from "next/image";
import { useState, useRef, type ReactNode } from "react";
import { usePollinationsImage } from "@pollinations/react";

type GeneratedImage = {
  id: string;
  prompt: string;
  seed: number;
  width: number;
  height: number;
  model: string;
};

type AuraResult = GeneratedImage & {
  rating: number | null;
  auraSummary: string;
  partnerPersona: string;
  guidance: string;
  colorPalette: string[];
};

function GeneratedImageCard({ image, children }: { image: GeneratedImage; children?: ReactNode }) {
  const imageUrl = usePollinationsImage(image.prompt, {
    width: image.width,
    height: image.height,
    model: image.model,
    seed: image.seed,
    nologo: true,
  });

  return (
    <div className="border rounded-lg p-4">
      <Image
        src={imageUrl}
        alt={image.prompt}
        width={image.width}
        height={image.height}
        unoptimized
        className="rounded-lg object-cover w-full h-64"
      />
      <p className="mt-2 text-sm text-gray-600 max-h-12 overflow-hidden">
        {image.prompt}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <a
          href={imageUrl}
          download={`pollinations-image-${image.id}.png`}
          className="text-blue-500 hover:underline text-sm"
        >
          Download
        </a>
      </div>
      {children ? (
        <div className="mt-3 border-t border-gray-200 pt-3 text-left">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{
    url: string;
    fileId: string;
    fileName: string;
  }>>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [partnerDescription, setPartnerDescription] = useState("");
  const [partnerPhotoPreview, setPartnerPhotoPreview] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auraResults, setAuraResults] = useState<AuraResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const partnerPhotoInputRef = useRef<HTMLInputElement>(null);

  const generateSeed = () => Math.floor(Math.random() * 1_000_000_000);
  const defaultWidth = 1024;
  const defaultHeight = 1024;
  const defaultModel = "flux";

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

  const handlePartnerPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAnalysisError("Please upload an image file (PNG, JPG, GIF)");
      return;
    }

    setAnalysisError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPartnerPhotoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerPartnerPhotoInput = () => {
    partnerPhotoInputRef.current?.click();
  };

  const handleGenerateImage = () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setGenerationError("Please enter a prompt before generating an image.");
      return;
    }

    setGenerationError(null);

    const seed = generateSeed();
    const width = defaultWidth;
    const height = defaultHeight;
    const model = defaultModel;

    const newImage: GeneratedImage = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${seed}`,
      prompt: trimmedPrompt,
      seed,
      width,
      height,
      model,
    };

    setGeneratedImages(prev => [newImage, ...prev]);
    setPrompt("");
  };

  const handleAnalyzePartner = async () => {
    if (!partnerPhotoPreview) {
      setAnalysisError("Please upload a selfie to analyze.");
      return;
    }

    const trimmedDescription = partnerDescription.trim();

    if (!trimmedDescription) {
      setAnalysisError("Tell us a little about yourself first.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch("/api/aipartner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photo: partnerPhotoPreview,
          description: trimmedDescription,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const message = result?.error || "Aura analysis failed";
        setAnalysisError(message);
        return;
      }

      const seed = generateSeed();
      const auraImage: AuraResult = {
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${seed}`,
        prompt: result.pollinationsPrompt,
        seed,
        width: defaultWidth,
        height: defaultHeight,
        model: defaultModel,
        rating: typeof result.rating === "number" ? result.rating : null,
        auraSummary: result.auraSummary ?? "",
        partnerPersona: result.partnerPersona ?? "",
        guidance: result.guidance ?? "",
        colorPalette: Array.isArray(result.colorPalette)
          ? result.colorPalette.map((entry: unknown) => String(entry))
          : [],
      };

      setAuraResults(prev => [auraImage, ...prev]);
    } catch (error) {
      console.error("Failed to analyze AI partner", error);
      setAnalysisError("Aura analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
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

        {/* AI Partner Aura Generator */}
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold text-center sm:text-left">AI Partner Aura Calculator</h2>
          <p className="text-sm text-gray-500 text-center sm:text-left mt-2">
            Upload a selfie and share a short description. We analyse your vibe with Llama 4 Maverick,
            craft an aura score, and generate a personalised AI partner concept via Pollinations.
          </p>

          <input
            ref={partnerPhotoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePartnerPhotoChange}
            className="hidden"
          />

          <div className="mt-4 grid gap-4">
            <button
              onClick={triggerPartnerPhotoInput}
              className="w-full rounded-lg border-2 border-dashed border-purple-300 p-6 text-center hover:border-purple-400 transition-colors"
            >
              {partnerPhotoPreview ? "Change uploaded photo" : "Upload a selfie"}
            </button>

            {partnerPhotoPreview && (
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Image
                  src={partnerPhotoPreview}
                  alt="Uploaded selfie preview"
                  width={180}
                  height={180}
                  unoptimized
                  className="rounded-xl object-cover w-full sm:w-auto sm:h-44"
                />
                <p className="text-sm text-gray-500">
                  Keep lighting clear and centered on your face for the best analysis. Your image stays on-device except for this single analysis request.
                </p>
              </div>
            )}

            <textarea
              value={partnerDescription}
              onChange={(event) => setPartnerDescription(event.target.value)}
              placeholder="Describe yourself, your vibe, and what you hope your AI partner is like."
              className="w-full rounded-lg border border-gray-300 p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[140px]"
            />

            <button
              onClick={handleAnalyzePartner}
              disabled={isAnalyzing || !partnerPhotoPreview || !partnerDescription.trim()}
              className="w-full rounded-lg bg-purple-600 text-white py-3 font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isAnalyzing ? "Analysing aura..." : "Create my AI partner"}
            </button>
          </div>

          {analysisError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {analysisError}
            </div>
          )}
        </div>

        {/* Prompt-based Pollinations Generation */}
        <div className="w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Generate with Pollinations</h2>

          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe the image you want Pollinations to create"
            className="w-full rounded-lg border border-gray-300 p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[140px]"
          />

          <button
            onClick={handleGenerateImage}
            disabled={!prompt.trim()}
            className="mt-4 w-full rounded-lg bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Generate Image
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

        {/* AI Partner Results */}
        {auraResults.length > 0 && (
          <div className="w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Your AI Partner Matches</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {auraResults.map((result) => (
                <GeneratedImageCard key={result.id} image={result}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-gray-700">Aura score:</span>
                      <span>{typeof result.rating === "number" ? `${result.rating} / 10` : "—"}</span>
                    </div>
                    {result.auraSummary && (
                      <p className="text-sm text-gray-600">{result.auraSummary}</p>
                    )}
                    {result.partnerPersona && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Partner persona:</span> {result.partnerPersona}
                      </p>
                    )}
                    {result.colorPalette.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                        {result.colorPalette.map((color) => (
                          <span key={`${result.id}-${color}`} className="rounded-full border border-gray-200 px-2 py-0.5">
                            {color}
                          </span>
                        ))}
                      </div>
                    )}
                    {result.guidance && (
                      <p className="text-xs text-gray-500 italic">{result.guidance}</p>
                    )}
                  </div>
                </GeneratedImageCard>
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
                <GeneratedImageCard key={image.id} image={image} />
              ))}
            </div>
          </div>
        )}

        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">Discover your aura and AI partner prompt with the Llama-powered calculator.</li>
          <li className="mb-2 tracking-[-.01em]">Generate images with Pollinations AI using custom prompts.</li>
          <li className="mb-2 tracking-[-.01em]">Upload images using ImageKit integration above.</li>
          <li className="tracking-[-.01em]">Images are automatically optimized and served via CDN.</li>
        </ol>

       
      </main>
      
    </div>
  );
}
