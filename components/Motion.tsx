"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Smooth scroll, custom cursor, film grain and generic reveals. Rendered once in the page. */
export default function Motion() {
  const cur = useRef<HTMLDivElement>(null);
  const grain = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // film grain
    const cv = document.createElement("canvas"), ctx = cv.getContext("2d")!;
    cv.width = cv.height = 220;
    const img = ctx.createImageData(220, 220);
    for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    ctx.putImageData(img, 0, 0);
    grain.current!.style.backgroundImage = `url(${cv.toDataURL()})`;

    let lenis: Lenis | null = null;
    const tick = (t: number) => lenis?.raf(t * 1000);
    if (!reduce) {
      lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3.4) });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // cursor
    const el = cur.current!;
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" }), yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    const move = (e: PointerEvent) => { xTo(e.clientX); yTo(e.clientY); };
    const over = (e: Event) => el.classList.toggle("big", !!(e.target as HTMLElement).closest("a,button,[data-cursor]"));
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);

    // reveals
    const ctxG = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((box) => {
        const spans = box.querySelectorAll<HTMLElement>(".mask > span");
        gsap.set(spans, { yPercent: 115 });
        ScrollTrigger.create({ trigger: box, start: "top 86%", once: true, onEnter: () => gsap.to(spans, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.09 }) });
      });
      gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((n) => {
        gsap.set(n, { opacity: 0, y: 36 });
        ScrollTrigger.create({ trigger: n, start: "top 90%", once: true, onEnter: () => gsap.to(n, { opacity: 1, y: 0, duration: 1, ease: "expo.out", delay: Number(n.dataset.fade) || 0 }) });
      });
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((n) => {
        const to = Number(n.dataset.count), o = { v: 0 };
        ScrollTrigger.create({ trigger: n, start: "top 90%", once: true, onEnter: () => gsap.to(o, { v: to, duration: 1.8, ease: "power3.out", onUpdate: () => (n.textContent = String(Math.round(o.v))) }) });
      });
      gsap.utils.toArray<HTMLElement>("[data-bar]").forEach((n) => {
        const to = Number(n.dataset.bar);
        gsap.set(n, { width: "0%" });
        ScrollTrigger.create({ trigger: n, start: "top 94%", once: true, onEnter: () => gsap.to(n, { width: `${to}%`, duration: 1.4, ease: "expo.out" }) });
      });
      // magnetic buttons
      gsap.utils.toArray<HTMLElement>("[data-magnet]").forEach((b) => {
        const qx = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3" }), qy = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3" });
        b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * 0.28); qy((e.clientY - r.top - r.height / 2) * 0.4); });
        b.addEventListener("pointerleave", () => { qx(0); qy(0); });
      });
    });
    // phones: scroll-driven choreography (the desktop pins are replaced by lighter, touch-friendly versions)
    const mm = gsap.matchMedia();
    mm.add("(max-width: 900px)", () => {
      if (reduce) return;
      const st = { trigger: "" as unknown as Element, scrub: true };
      // hero: headline lines drift apart, bridge slides, as you scroll away
      gsap.utils.toArray<HTMLElement>(".hero h1 .mask > span").forEach((l, i) => gsap.to(l, { xPercent: i === 1 ? 14 : i === 2 ? -9 : -4, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } }));
      gsap.to(".hero-bridge", { scale: 1.18, transformOrigin: "50% 100%", ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      // how it works: each step's number parallaxes, the card swings up and straightens
      gsap.utils.toArray<HTMLElement>(".flow-panel").forEach((panel) => {
        const num = panel.querySelector(".flow-num"), card = panel.querySelector(".flow-card"), h = panel.querySelector(".flow-copy h3"), pp = panel.querySelector(".flow-copy p");
        gsap.fromTo(num, { yPercent: -18 }, { yPercent: 38, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(card, { rotateX: 28, y: 90, scale: 0.88, opacity: 0.2 }, { rotateX: 0, y: 0, scale: 1, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 98%", end: "top 55%", scrub: true } });
        gsap.fromTo([h, pp], { y: 46, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: panel, start: "top 80%", end: "top 38%", scrub: true } });
      });
      // feature cards flip up one by one
      gsap.utils.toArray<HTMLElement>(".bcard").forEach((c, i) => gsap.fromTo(c, { y: 90, rotate: i % 2 ? 2.2 : -2.2, scale: 0.93, opacity: 0.3 }, { y: 0, rotate: 0, scale: 1, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: c, start: "top 97%", end: "top 60%", scrub: true } }));
      gsap.utils.toArray<HTMLElement>(".num-cell b, .bm-stat b").forEach((b) => gsap.fromTo(b, { scale: 0.7, transformOrigin: "0 100%" }, { scale: 1, ease: "power2.out", scrollTrigger: { trigger: b, start: "top 98%", end: "top 65%", scrub: true } }));
      // oversized footer wordmark slides in sideways
      gsap.fromTo(".foot-word", { xPercent: 22 }, { xPercent: -6, ease: "none", scrollTrigger: { trigger: ".foot-word", start: "top bottom", end: "bottom top", scrub: true } });
      void st;
    });
    // tap feedback on touch devices
    const ripple = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      const r = document.createElement("div"); r.className = "ripple"; r.style.left = `${e.clientX}px`; r.style.top = `${e.clientY}px`; document.body.appendChild(r);
      gsap.fromTo(r, { scale: 1, opacity: 0.9 }, { scale: 7, opacity: 0, duration: 0.7, ease: "power2.out", onComplete: () => r.remove() });
    };
    window.addEventListener("pointerdown", ripple);
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      mm.revert(); window.removeEventListener("pointerdown", ripple); ctxG.revert(); lenis?.destroy(); gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", move); document.removeEventListener("pointerover", over);
    };
  }, []);

  return (<><div className="cursor" ref={cur} /><div className="grain" ref={grain} /></>);
}
