import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    unoptimized: true, // For easier deployment on any platform
  },
};

export default nextConfig;
