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
      {
        protocol: 'https',
        hostname: '*.hf.space', // Allow images from Hugging Face Spaces (book covers)
      },
      {
        protocol: 'https',
        hostname: 'static-sc.cloudapp.web.id', // CDN Kemendikbud — sumber gambar sampul buku
        pathname: '/content/image/**',
      },
    ],
  },
  // Ensure Next.js edge runtime configurations are compatible with Cloudflare Pages
  experimental: {
    // Other experimental features can go here if needed for RAG streaming
  }
};

export default nextConfig;
