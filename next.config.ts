import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pg uses dynamic requires for optional native bindings; keep it out of
  // the Server Components bundle so it's loaded natively instead of through
  // Next's bundler interop.
  serverExternalPackages: ["pg"],
};

export default nextConfig;
