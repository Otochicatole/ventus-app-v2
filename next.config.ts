import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@mui/material", "@mui/x-date-pickers"],
  },
};

export default nextConfig;
