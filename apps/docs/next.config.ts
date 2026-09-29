import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@lairy/tokens", "@lairy/ui", "@lairy/content"],
  // Playwright drives the dev server over 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
  // A distinct build directory so a Playwright-spawned dev server never
  // collides with a dev server already running against this same checkout.
  ...(process.env.LAIRY_NEXT_DIST_DIR ? { distDir: process.env.LAIRY_NEXT_DIST_DIR } : {}),
};

export default nextConfig;
