import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "cdn.example.com",
      "your-other-domain.com",
      "res.cloudinary.com",
      "lh3.googleusercontent.com"
      
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
    reactStrictMode: true,
    swcMinify: true,
};

export default nextConfig;
