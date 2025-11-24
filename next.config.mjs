/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Completely ignore canvas module
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };

    // External for server-side
    if (isServer) {
      config.externals.push('canvas', 'pdfjs-dist');
    } else {
      // For client-side, use fallback
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      };
    }

    return config;
  },
  // Mark these packages as external for server components
  experimental: {
    serverComponentsExternalPackages: ['canvas', 'pdfjs-dist'],
  },
};

export default nextConfig;
