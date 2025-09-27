import { Image } from '@imagekit/next';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ImageKit Next.js Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore ImageKit&apos;s powerful image transformation and AI features in Next.js with TypeScript
          </p>
        </header>

        <div className="space-y-16">
          {/* Basic Image Display */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Basic Image Display
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
                  Original Image (Demo)
                </h3>
                <Image
                  src="/default-image.jpg"
                  width={400}
                  height={300}
                  alt="Sample image"
                  className="rounded-lg border"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
                  With Basic Transformations
                </h3>
                <Image
                  src="/default-image.jpg"
                  width={400}
                  height={300}
                  alt="Transformed image"
                  transformation={[
                    { width: 400, height: 300, crop: "maintain_ratio" },
                    { quality: 80, format: "webp" }
                  ]}
                  className="rounded-lg border"
                />
              </div>
            </div>
          </section>

          {/* AI Transformations */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              AI-Powered Transformations
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
                  Background Removal
                </h3>
                <Image
                  src="/default-image.jpg"
                  width={300}
                  height={300}
                  alt="Background removed"
                  transformation={[
                    { width: 300, height: 300 },
                    { aiRemoveBackground: true }
                  ]}
                  className="rounded-lg border bg-gray-100 dark:bg-gray-700"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
                  AI Upscaling
                </h3>
                <Image
                  src="/default-image.jpg"
                  width={300}
                  height={300}
                  alt="AI upscaled"
                  transformation={[
                    { width: 150, height: 150 },
                    { aiUpscale: true },
                    { width: 300, height: 300 }
                  ]}
                  className="rounded-lg border"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
                  Drop Shadow Effect
                </h3>
                <Image
                  src="/default-image.jpg"
                  width={300}
                  height={300}
                  alt="With drop shadow"
                  transformation={[
                    { width: 300, height: 300 },
                    { aiDropShadow: true }
                  ]}
                  className="rounded-lg"
                />
              </div>
            </div>
          </section>

          {/* Responsive Images */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Responsive Image Delivery
            </h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Automatically optimized for different screen sizes
              </h3>
              <Image
                src="/default-image.jpg"
                width={800}
                height={400}
                alt="Responsive image"
                transformation={[
                  { quality: 80, format: 'webp' },
                  { width: 800, crop: "maintain_ratio" }
                ]}
                className="w-full rounded-lg border"
              />
            </div>
          </section>

          {/* Upload Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Image Upload & Processing
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Upload functionality requires API route implementation. 
                <a 
                  href="/upload" 
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-2"
                >
                  Go to Upload Demo →
                </a>
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <code className="text-sm text-gray-800 dark:text-gray-200">
                  API route: /api/upload-auth for secure upload authentication
                </code>
              </div>
            </div>
          </section>

          {/* Configuration Info */}
          <section className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-900 dark:text-blue-200">
              Setup Instructions
            </h2>
            <div className="space-y-4 text-blue-800 dark:text-blue-300">
              <p>
                <strong>1.</strong> Copy <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">.env.example</code> to <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">.env.local</code>
              </p>
              <p>
                <strong>2.</strong> Get your ImageKit credentials from your <a href="https://imagekit.io/dashboard" target="_blank" rel="noopener noreferrer" className="underline">ImageKit Dashboard</a>
              </p>
              <p>
                <strong>3.</strong> Replace the demo endpoint with your actual ImageKit URL endpoint
              </p>
              <p>
                <strong>4.</strong> Add your public and private keys to enable uploads and advanced features
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
