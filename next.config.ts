import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: ["127.0.0.1", "172.20.10.5", "localhost"],
};

export default nextConfig;
