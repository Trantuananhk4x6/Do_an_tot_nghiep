import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Fix for pdfjs-dist canvas issue - completely exclude canvas
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
      fs: false,
    };
    
    // Mark canvas as external for both client and server
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        encoding: false,
        fs: false,
      };
    }
    
    // Externalize pdfjs-dist on server-side to prevent bundling
    if (isServer) {
      config.externals = [...(config.externals || []), 'pdfjs-dist', 'canvas'];
    }
    
    return config;
  },
};

export default nextConfig;
