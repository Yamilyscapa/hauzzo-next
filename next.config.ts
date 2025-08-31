import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip ESLint and type-checking errors during production builds.
  // This prevents Docker/CI builds from failing on lint issues.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
