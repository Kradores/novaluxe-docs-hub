import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./config/i18n/request.ts");

export default withNextIntl(nextConfig);
