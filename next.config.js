const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  publicRuntimeConfig: {
    FRONTEND_SENTRY_DSN: process.env.FRONTEND_SENTRY_DSN,
  },
  async rewrites() {
    if(process.env.NODE_ENV === "production")
      return []

    return [
      {
        source: "/api/:path*/",
        destination: "http://localhost:8000/api/:path*/", // Proxy to Backend
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*", // Proxy to Backend
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, {
  hideSourceMaps: false
})
