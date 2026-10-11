import type { NextConfig } from "next";

/** V1 addresses that moved, so old links and search results keep working. */
const legacyPages: Record<string, string> = {
  "/register": "/get-help",
  "/action": "/about",
  "/blog": "/news",
  "/search": "/programs",
};

const apiInternalUrl = (process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3072").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    qualities: [75, 85, 90],
  },
  async rewrites() {
    return [{ source: "/v1/:path*", destination: `${apiInternalUrl}/v1/:path*` }];
  },
  async redirects() {
    return Object.entries(legacyPages).map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
