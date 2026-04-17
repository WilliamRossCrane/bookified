import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
      // Potentially have to update this to Vercel Blob URL Working Right Now :D
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
