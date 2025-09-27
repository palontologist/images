'use client';

import { useState } from 'react';
import { upload } from '@imagekit/next';
import { Image } from '@imagekit/next';
import Link from 'next/link';

interface UploadResult {
  url: string;
  fileId: string;
  name: string;
}

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      // Get upload authentication parameters from our API route
      const authResponse = await fetch('/api/upload-auth');
      const authData = await authResponse.json();

      if (!authResponse.ok) {
        throw new Error(authData.error || 'Failed to get upload authentication');
      }

      // Upload the file using ImageKit
      const result = await upload({
        file: selectedFile,
        fileName: selectedFile.name,
        token: authData.token,
        expire: authData.expire,
        signature: authData.signature,
        publicKey: authData.publicKey,
      });

      setUploadResult({
        url: result.url || '',
        fileId: result.fileId || '',
        name: result.name || selectedFile.name,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Image Upload Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload images and see them processed with ImageKit transformations
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Upload Your Image
            </h2>

            <div className="space-y-6">
              {/* File Input */}
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Choose an image file
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700
                           hover:file:bg-blue-100
                           dark:file:bg-blue-900 dark:file:text-blue-300"
                />
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                         text-white font-semibold py-3 px-6 rounded-lg transition-colors
                         disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              {/* Upload Result */}
              {uploadResult && (
                <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-green-800 dark:text-green-200 font-semibold">
                      Upload successful! File ID: {uploadResult.fileId}
                    </p>
                  </div>

                  {/* Display the uploaded image with transformations */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Your Uploaded Image with Transformations
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Original */}
                      <div>
                        <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
                          Original
                        </h4>
                        <Image
                          src={uploadResult.url}
                          width={300}
                          height={300}
                          alt="Original uploaded image"
                          className="rounded-lg border"
                        />
                      </div>

                      {/* With transformations */}
                      <div>
                        <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
                          Resized & Optimized
                        </h4>
                        <Image
                          src={uploadResult.url}
                          width={300}
                          height={300}
                          alt="Transformed image"
                          transformation={[
                            { width: 300, height: 300, crop: "maintain_ratio" },
                            { quality: 80, format: "webp" }
                          ]}
                          className="rounded-lg border"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Background Removal */}
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Background Removed
                        </h4>
                        <Image
                          src={uploadResult.url}
                          width={200}
                          height={200}
                          alt="Background removed"
                          transformation={[
                            { width: 200, height: 200 },
                            { aiRemoveBackground: true }
                          ]}
                          className="rounded-lg border bg-gray-100 dark:bg-gray-700"
                        />
                      </div>

                      {/* Grayscale Effect */}
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Grayscale Effect
                        </h4>
                        <Image
                          src={uploadResult.url}
                          width={200}
                          height={200}
                          alt="Grayscale effect"
                          transformation={[
                            { width: 200, height: 200 },
                            { grayscale: true }
                          ]}
                          className="rounded-lg border"
                        />
                      </div>

                      {/* Border Effect */}
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Border Effect
                        </h4>
                        <Image
                          src={uploadResult.url}
                          width={200}
                          height={200}
                          alt="Border effect"
                          transformation={[
                            { width: 200, height: 200 },
                            { border: "5_FF0000" }
                          ]}
                          className="rounded-lg border"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}