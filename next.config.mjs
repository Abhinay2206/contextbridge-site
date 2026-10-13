const isProd = process.env.NODE_ENV === "production";
const GA = Boolean(process.env.NEXT_PUBLIC_GA_ID);  // analytics is opt-in: the policy is only widened when an ID is set

// Everything is served from our own origin; inline script/style are required by Next.js hydration and GSAP.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${GA ? " https://www.googletagmanager.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${GA ? " https://*.google-analytics.com https://*.googletagmanager.com" : ""}`,
  "media-src 'self'",
  "font-src 'self' data:",
  `connect-src 'self'${GA ? " https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const security = [
  ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",  // lets a test build run beside `next dev` without clobbering it
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: security },
      // promo files are named by content hash (npm run promo), so a changed video gets a new URL and can be cached for a year
      { source: "/:file(promo-.*\\.[0-9a-f]{8}\\.(?:mp4|jpg))", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/:file(orvantia\\.webp|benchmark\\.json|ContextBridge-Benchmark-Report\\.docx)", headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }] },
    ];
  },
};
export default nextConfig;
