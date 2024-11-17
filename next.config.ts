import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "twocat-room-avatars.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/room-avatars/**",
      },
    ],
  },
};

export default nextConfig;
