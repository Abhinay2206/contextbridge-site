# ContextBridge site

Next.js 15 (App Router), GSAP ScrollTrigger and Lenis. Static output, no backend, no forms. No cookies and no analytics unless you opt in by setting `NEXT_PUBLIC_GA_ID` (see below).

```bash
npm install
npm run dev                 # http://localhost:3000
npm run build && npm start  # production (applies the Content-Security-Policy)
```

## Before deploying

1. Set the public URL (canonical links, Open Graph, sitemap, robots):
   `NEXT_PUBLIC_SITE_URL=https://your-domain.example` (see `.env.example`).
2. Serve over HTTPS (the site sends HSTS).
3. Keep `TOOL_VERSION` in `lib/site.ts` (shown in the hero, footer and structured data) equal to the tool's version, and the site's `package.json` version alongside it.
4. Regenerate benchmark data after a new run: `python3 merge.py` in `ContextBridge-Benchmark/` copies `benchmark.json` into `data/` and `public/`.

## What is built in

- **SEO:** per-page titles and descriptions, canonical URLs, Open Graph and Twitter cards with generated images, `sitemap.xml`, `robots.txt`, web manifest, JSON-LD (`SoftwareApplication`, `TechArticle`), semantic landmarks, one `h1` per page.
- **Security headers** (`next.config.mjs`): Content-Security-Policy (same-origin only, no `eval`), HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options`, Referrer-Policy, Permissions-Policy, COOP and CORP, `poweredByHeader` off. `/.well-known/security.txt` points to the repository's private vulnerability reporting.
- **Accessibility:** skip link, visible focus rings, `prefers-reduced-motion` support, labelled controls, text contrast of at least 4.5:1.
- **Performance:** self-hosted variable fonts, lazy media (`preload="metadata"`), the phone gets the 9:16 video, long-lived cache headers for media.
- **Resilience:** custom 404, error and global-error pages.

The promo videos carry music only, so there is no caption track.

## Google Analytics and Search Console (optional)

Both are off by default. They are read **at build time**, so set them before `npm run build`.

1. **Analytics:** create a GA4 property, copy its Measurement ID (`G-XXXXXXXXXX`) and set `NEXT_PUBLIC_GA_ID`. The site then loads GA4 with Consent Mode: analytics cookies stay off until the visitor accepts the banner, IP anonymization is on, and ad personalization and Google signals are disabled. The Content-Security-Policy only allows Google's domains when this variable is set.
2. **Search Console:** add your domain as a property, choose the "HTML tag" verification method, and set `NEXT_PUBLIC_GSC_VERIFICATION` to the `content` value. After deploying, click Verify, then submit `https://your-domain/sitemap.xml`.
