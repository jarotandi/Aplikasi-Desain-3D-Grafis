import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co"
      }
    ]
  },
  outputFileTracingRoot: path.resolve("."),
  turbopack: {
    root: path.resolve(".")
  }
};

export default nextConfig;
