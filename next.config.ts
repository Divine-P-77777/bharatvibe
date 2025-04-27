import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "cdn.example.com",
      "your-other-domain.com"
      // add any external domains you use images from
    ],
  },
};

export default nextConfig;
