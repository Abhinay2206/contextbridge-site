# ContextBridge site

Next.js 15 (App Router) + GSAP ScrollTrigger + Lenis. Static output, no backend.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

- Content constants: `components/Nav.tsx` (repo URL), `components/Footer.tsx` (Orvantia URL), `components/Install.tsx` (install commands).
- The promo video is `public/promo-16x9.mp4` (web-sized copy, 12.7 MB) with `public/promo-poster.jpg`.
- The plugin install line uses the `abhinay-contextbridge` marketplace name, which exists once the 0.3.2 changes are merged to `main`.
