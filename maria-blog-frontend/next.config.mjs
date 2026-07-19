/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Scaffold copied verbatim from a shared library; don't block builds on lint.
  eslint: { ignoreDuringBuilds: true },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
