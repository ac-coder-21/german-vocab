import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // node:sqlite is a native Node built-in; keep it out of the Server
  // Components bundle so it's loaded natively instead of through Next's
  // bundler interop (which doesn't have `require` in scope for it).
  serverExternalPackages: ["node:sqlite"],
};

export default nextConfig;
