import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,    
  },
  staticPageGenerationTimeout: 300,
};

