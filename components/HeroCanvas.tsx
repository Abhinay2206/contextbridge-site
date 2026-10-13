"use client";
import { useEffect, useRef } from "react";

/** The bridge as ~2,600 live particles. The verdict changes how it behaves:
 *  READY: a green pulse flows across. REVIEW_REQUIRED: parts flicker and jitter. BLOCKED: the span breaks and sparks fall.
 *  The pointer pushes particles away; a click sends a shockwave; scrolling dissolves the bridge. */
const COLORS: [number, number, number][] = [[5, 150, 105], [217, 119, 6], [225, 29, 72]];  // darker tones, readable on paper
const css = (c: number[], a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

type Props = { verdict: number; dispersion: React.MutableRefObject<number> };

export default function HeroCanvas({ verdict, dispersion }: Props) {
  const wrap = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null);
  const vRef = useRef(verdict), shock = useRef<{ x: number; y: number; t: number } | null>(null);
  vRef.current = verdict;

  useEffect(() => {
    const canvas = cv.current!, ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 900px)").matches;
    const K = small ? 0.58 : 1;
    // particle groups: 0 deck, 1 cable, 2 hanger, 3 node, 4 dust
    const N = { deck: Math.round(760 * K), cable: Math.round(980 * K), hang: 13, perHang: Math.round(26 * K), node: Math.round(130 * K), dust: Math.round(460 * K) };
    const total = N.deck + N.cable + N.hang * N.perHang + 2 * N.node + N.dust;
    const x = new Float32Array(total), y = new Float32Array(total), vx = new Float32Array(total), vy = new Float32Array(total);
    const tx = new Float32Array(total), ty = new Float32Array(total), u = new Float32Array(total), sd = new Float32Array(total), sz = new Float32Array(total);
    const grp = new Uint8Array(total);
    for (let i = 0; i < total; i++) sd[i] = Math.random();

    let W = 0, H = 0, dpr = 1, x0 = 0, x1 = 0, deckY = 0, cableTop = 0, ready = false;
    const cableAt = (t: number) => { // quadratic bezier, control point chosen so the apex sits at cableTop
      const c = 2 * cableTop - deckY, py = (1 - t) * (1 - t) * deckY + 2 * t * (1 - t) * c + t * t * deckY;
      return { px: x0 + (x1 - x0) * t, py };
    };

    const retarget = () => {
      let k = 0;
      for (let i = 0; i < N.deck; i++, k++) { const t = i / (N.deck - 1); u[k] = t; grp[k] = 0; tx[k] = x0 + (x1 - x0) * t; ty[k] = deckY + (sd[k] - 0.5) * 5; sz[k] = 1.3 + sd[k] * 1.2; }
      for (let i = 0; i < N.cable; i++, k++) { const t = i / (N.cable - 1), p = cableAt(t); u[k] = t; grp[k] = 1; tx[k] = p.px; ty[k] = p.py + (sd[k] - 0.5) * 4; sz[k] = 1.4 + sd[k] * 1.5; }
      for (let h = 0; h < N.hang; h++) {
        const t = (h + 1) / (N.hang + 1), top = cableAt(t).py;
        for (let j = 0; j < N.perHang; j++, k++) { u[k] = t; grp[k] = 2; tx[k] = x0 + (x1 - x0) * t + (sd[k] - 0.5) * 2; ty[k] = deckY + (top - deckY) * (j / (N.perHang - 1)); sz[k] = 1 + sd[k]; }
      }
      for (let n = 0; n < 2; n++) for (let j = 0; j < N.node; j++, k++) {
        const a = (j / N.node) * Math.PI * 2 * 3, r = (j % 3 === 0 ? 5 : 13) + sd[k] * 3;
        u[k] = n; grp[k] = 3; tx[k] = (n ? x1 : x0) + Math.cos(a) * r; ty[k] = deckY + Math.sin(a) * r; sz[k] = 1.6 + sd[k] * 1.4;
      }
      for (let j = 0; j < N.dust; j++, k++) { u[k] = sd[k]; grp[k] = 4; tx[k] = sd[k] * W; ty[k] = ((sd[k] * 977) % 1) * H; sz[k] = 0.8 + sd[k] * 1.2; }
    };

    const resize = () => {
      const r = wrap.current!.getBoundingClientRect();
      W = r.width; H = r.height; dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const portrait = H > W * 1.15;
      x0 = W * (portrait ? 0.07 : 0.2); x1 = W * (portrait ? 0.93 : 0.93);
      deckY = H * (portrait ? 0.93 : 0.8); cableTop = H * (portrait ? 0.74 : 0.3);
      retarget();
      if (!ready) { for (let i = 0; i < total; i++) { x[i] = W / 2 + (sd[i] - 0.5) * W * 0.2; y[i] = H * 0.5 + (sd[(i * 7) % total] - 0.5) * H * 0.2; } ready = true; }
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(wrap.current!);

    const mouse = { x: -9999, y: -9999, on: false };
    const host = wrap.current!.parentElement!;
    const move = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true; };
    const leave = () => { mouse.on = false; mouse.x = mouse.y = -9999; };
    const down = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); shock.current = { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() }; };
    host.addEventListener("pointermove", move); host.addEventListener("pointerleave", leave); host.addEventListener("pointerdown", down);

    const cls = new Uint16Array(total * 3), cnt = [0, 0, 0];
    let col = [...COLORS[vRef.current]], gap = 0, jit = 0, last = performance.now(), time = 0, visible = true, raf = 0, lastVerdict = vRef.current, flash = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
      const v = vRef.current, target = COLORS[v], disp = dispersion.current;
      if (v !== lastVerdict) { lastVerdict = v; flash = 1; }
      flash = Math.max(0, flash - dt * 2.2);
      for (let c = 0; c < 3; c++) col[c] += (target[c] - col[c]) * Math.min(1, dt * 4);
      gap += ((v === 2 ? 1 : 0) - gap) * Math.min(1, dt * 2.6);
      jit += ((v === 1 ? 1 : 0) - jit) * Math.min(1, dt * 3);

      // trails: fade what is already on the canvas instead of clearing it
      ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      const wp = ((time * 0.16) % 1.35) - 0.18, gapA = 0.43, gapB = 0.57;
      const sw = shock.current, swAge = sw ? (now - sw.t) / 1000 : 9;
      cnt[0] = cnt[1] = cnt[2] = 0;
      const R = 120, R2 = R * R;
      for (let i = 0; i < total; i++) {
        let px = tx[i], py = ty[i], a = 1;
        const g = grp[i], ui = u[i];
        if (g === 4) { px += Math.sin(time * 0.5 + sd[i] * 40) * 14; py += Math.cos(time * 0.4 + sd[i] * 30) * 10; a = 0.2; }
        else {
          const inGap = g <= 2 && ui > gapA && ui < gapB;
          if (inGap && gap > 0.01) { py += gap * (40 + 230 * sd[i] * sd[i]); px += (sd[i] - 0.5) * gap * 60; a *= 1 - 0.8 * gap; }
          if (jit > 0.01 && sd[(i * 13) % total] < 0.4) { px += Math.sin(time * 19 + sd[i] * 60) * 2.6 * jit; py += Math.cos(time * 17 + sd[i] * 50) * 2.6 * jit; a *= 1 - jit * (0.5 - 0.5 * Math.sin(time * 9 + sd[i] * 40)) * 0.8; }
        }
        if (disp > 0.001) { const ang = sd[i] * 6.283; px += Math.cos(ang) * disp * (120 + 380 * sd[(i * 3) % total]); py += Math.sin(ang) * disp * (120 + 380 * sd[(i * 5) % total]) - disp * 160; a *= 1 - Math.min(1, disp * 1.3); }
        // spring toward the (possibly displaced) target
        let ax = (px - x[i]) * 0.075, ay = (py - y[i]) * 0.075;
        if (mouse.on) { const dx = x[i] - mouse.x, dy = y[i] - mouse.y, d2 = dx * dx + dy * dy; if (d2 < R2 && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / R) * 9; ax += (dx / d) * f; ay += (dy / d) * f; } }
        if (swAge < 1.1) { const dx = x[i] - sw!.x, dy = y[i] - sw!.y, d = Math.sqrt(dx * dx + dy * dy) + 1, ring = swAge * 520, band = 90; if (Math.abs(d - ring) < band) { const f = (1 - Math.abs(d - ring) / band) * 26 * (1 - swAge / 1.1); ax += (dx / d) * f; ay += (dy / d) * f; } }
        vx[i] = (vx[i] + ax) * 0.84; vy[i] = (vy[i] + ay) * 0.84; x[i] += vx[i]; y[i] += vy[i];

        // class: 0 ink, 1 verdict colour, 2 pulse (verdict colour, larger)
        let c = 0, size = sz[i];
        if (g === 1 || g === 3) c = 1;
        if (g <= 1 || g === 3) {
          const nx = g === 3 ? (ui ? 1 : 0) : ui, b = Math.exp(-Math.pow((nx - wp) / 0.045, 2)) * (v === 2 && wp > gapA ? 0 : 1);
          if (b > 0.55) { c = 2; size *= 1.5 + b; } else if (b > 0.12 && g === 0) c = 1;
          a *= 0.5 + 0.5 * Math.min(1, b * 1.4 + 0.45);
        }
        if (g === 4 && sd[i] < 0.1) c = 1;
        if (g === 2) a *= 0.5;
        if (mouse.on) { const dx = x[i] - mouse.x, dy = y[i] - mouse.y; if (dx * dx + dy * dy < 7000) { c = 1; a = Math.min(1, a + 0.4); } }
        a *= 0.9 + 0.6 * flash * (g === 1 ? 1 : 0);
        const idx = c * total + cnt[c]++; cls[idx] = i; alphaBuf[idx] = a; sizeBuf[idx] = size;
      }
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = c === 0 ? "rgb(12,14,19)" : css(col);
        const base = c * total;
        for (let n = 0; n < cnt[c]; n++) { const i = cls[base + n], s = sizeBuf[base + n]; ctx.globalAlpha = Math.max(0, Math.min(1, alphaBuf[base + n])); ctx.fillRect(x[i] - s / 2, y[i] - s / 2, s, s); }
      }
      ctx.globalAlpha = 1;
    };
    const alphaBuf = new Float32Array(total * 3), sizeBuf = new Float32Array(total * 3);

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }); io.observe(host);
    if (reduce) { for (let i = 0; i < total; i++) { x[i] = tx[i]; y[i] = ty[i]; } time = 0.6; frame(performance.now()); cancelAnimationFrame(raf); }
    else raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave); host.removeEventListener("pointerdown", down); };
  }, [dispersion]);

  return (<div className="hero-bridge" ref={wrap} aria-hidden><canvas ref={cv} /></div>);
}
