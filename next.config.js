/** @type {import('next').NextConfig} */
const nextConfig = {

   typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "116.118.51.65",
      },
      {
        protocol: "https",
        hostname: "img.beatinterview.com",
      },
    ],
  },
};

module.exports = nextConfig;
