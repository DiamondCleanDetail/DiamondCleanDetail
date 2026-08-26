import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/services/wheel-ceramic-coating",
        destination: "/services/ceramic-coating",
        permanent: true,
      },
      {
        source: "/services/glass-ceramic-coating",
        destination: "/services/ceramic-coating",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
