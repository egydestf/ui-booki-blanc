/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co', // Allow images from Supabase Storage
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Ensure Next.js edge runtime configurations are compatible with Cloudflare Pages
  experimental: {
    // Other experimental features can go here if needed for RAG streaming
  }
};

export default nextConfig;
