import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

const withNextIntl = createNextIntlPlugin("./config/i18n/request.ts");

export default withNextIntl(nextConfig);
