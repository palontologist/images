import { Image } from '@imagekit/next';

interface ImageKitImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformation?: any[];
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export default function ImageKitImage({
  src,
  alt,
  width,
  height,
  transformation = [],
  className = '',
  loading = 'lazy',
  priority = false,
}: ImageKitImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      transformation={transformation}
      className={className}
      loading={loading}
      priority={priority}
    />
  );
}