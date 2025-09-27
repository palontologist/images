import type { Metadata } from "next";
import { ImageKitProvider } from '@imagekit/next';
import "./globals.css";

export const metadata: Metadata = {
  title: "ImageKit Next.js Demo",
  description: "Next.js project with ImageKit integration for image generation and transformation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/demo"}>
          {children}
        </ImageKitProvider>
      </body>
    </html>
  );
}
