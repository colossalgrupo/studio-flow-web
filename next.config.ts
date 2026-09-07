import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundle mínimo e autocontido — importante na t3.micro (914 MB de RAM)
  // que também roda o backend Java.
  output: "standalone",
};

export default nextConfig;
