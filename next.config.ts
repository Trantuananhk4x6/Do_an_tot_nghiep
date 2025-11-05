import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Fix for pdfjs-dist canvas issue
    if (isServer) {
      config.resolve.alias.canvas = false;
    }
    
    // Exclude canvas from bundling
    config.externals = [...(config.externals || []), 'canvas'];
    
    return config;
  },
};

export default nextConfig;
