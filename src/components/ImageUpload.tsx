'use client';

import { useState } from 'react';
import { upload } from '@imagekit/next';

interface ImageUploadProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUploadSuccess: (result: any) => void;
  onUploadError: (error: string) => void;
  className?: string;
}

export default function ImageUpload({ 
  onUploadSuccess, 
  onUploadError, 
  className = '' 
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      // Get upload authentication parameters
      const authResponse = await fetch('/api/upload-auth');
      
      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        throw new Error(errorData.error || 'Failed to get upload authentication');
      }
      
      const authData = await authResponse.json();

      // Upload the file
      const result = await upload({
        file: selectedFile,
        fileName: selectedFile.name,
        token: authData.token,
        expire: authData.expire,
        signature: authData.signature,
        publicKey: authData.publicKey,
      });

      onUploadSuccess(result);
      setSelectedFile(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
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

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                 text-white font-semibold py-3 px-6 rounded-lg transition-colors
                 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
}