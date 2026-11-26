import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";

// Everything the site loads from outside: analytics, ads and the optional story video.
const analytics = [
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://stats.g.doubleclick.net",
  "https://googleads.g.doubleclick.net",
  "https://www.googleadservices.com",
  "https://www.google.com",
  "https://connect.facebook.net",
  "https://www.facebook.com",
  "https://www.clarity.ms",
  "https://*.clarity.ms",
].join(" ");

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} ${analytics}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${analytics}${dev ? " ws: wss:" : ""}`,
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.googletagmanager.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const secure = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  async headers() {
    return [
      { source: "/:path*", headers: secure },
      // admin pages and their data must never be stored by a browser or a shared cache
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
      { source: "/api/admin/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
