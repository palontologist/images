// ImageKit transformation types and interfaces

export interface ImageKitTransformation {
  // Basic transformations
  width?: number | string;
  height?: number | string;
  crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max';
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'jpeg' | 'png';
  
  // AI transformations
  aiRemoveBackground?: boolean;
  aiUpscale?: boolean;
  aiDropShadow?: boolean;
  
  // Effects
  effect?: 'sepia' | 'grayscale';
  blur?: string | number;
  
  // Advanced
  progressive?: boolean;
  lossless?: boolean;
  trim?: boolean;
  
  // Allow any other properties for flexibility
  [key: string]: unknown;
}

export interface UploadAuthParams {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
}

export interface UploadOptions {
  file: File;
  fileName: string;
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  folder?: string;
  tags?: string[];
  isPrivateFile?: boolean;
  customCoordinates?: string;
  responseFields?: string[];
}

export interface UploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  size: number;
  filePath: string;
  tags: string[];
  isPrivateFile: boolean;
  customCoordinates: string | null;
  fileType: string;
}

export interface ImageKitConfig {
  urlEndpoint: string;
  publicKey: string;
  privateKey?: string; // Only for server-side
}