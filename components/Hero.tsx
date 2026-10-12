"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { REPO } from "./Nav";
gsap.registerPlugin(ScrollTrigger);

const INSTALL = "pip install contextbridge-cli";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const c = gsap.context(() => {
      const spans = gsap.utils.toArray<HTMLElement>(".hero h1 .mask > span");
      gsap.set(spans, { yPercent: 118 });
      gsap.set(".hero-top, .hero-sub, .cta-row", { opacity: 0, y: 24 });
      gsap.set(".h-deck,.h-cable,.h-hang", { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(".h-node,.h-label", { opacity: 0 });
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
      tl.to(spans, { yPercent: 0, duration: 1.5, stagger: 0.12 })
        .to(".hero-top", { opacity: 1, y: 0, duration: 1 }, 0.4)
        .to(".h-deck", { strokeDashoffset: 0, duration: 1.4, ease: "power3.inOut" }, 0.5)
        .to(".h-cable", { strokeDashoffset: 0, duration: 1.8, ease: "power3.inOut" }, 0.7)
        .to(".h-hang", { strokeDashoffset: 0, duration: 0.9, stagger: 0.06 }, 1.5)
        .to(".h-node,.h-label", { opacity: 1, duration: 0.8, stagger: 0.1 }, 1.4)
        .to(".hero-sub, .cta-row", { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 1.1);

      // packet travels along the cable as you scroll away from the hero
      const path = root.current!.querySelector<SVGPathElement>(".h-cable")!, pk = root.current!.querySelector<SVGGElement>(".h-packet")!;
      const L = path.getTotalLength();
      ScrollTrigger.create({
        trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6,
        onUpdate: (s) => { const p = path.getPointAtLength(s.progress * L); gsap.set(pk, { x: p.x, y: p.y, opacity: s.progress > 0.01 ? 1 : 0 }); },
      });
      gsap.to(".hero h1", { yPercent: -14, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-bridge", { yPercent: 10, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    }, root);
    return () => c.revert();
  }, []);

  const copy = async () => { try { await navigator.clipboard.writeText(INSTALL); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {} };

  // hangers along a quadratic cable: P(t)
  const hangers = Array.from({ length: 13 }, (_, i) => { const t = (i + 1) / 14, x = 80 + 1440 * t, y = 250 - 2 * t * (1 - t) * 820; return { x, y }; });

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero-top"><span>Verified · Portable · Private</span><span>v0.3.2 — MIT · by <a href="https://www.orvantia.in" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>Orvantia</a></span></div>
      <h1>
        <span className="mask"><span>Context</span></span>
        <span className="mask"><span className="it">outlives</span></span>
        <span className="mask"><span>the session.</span></span>
      </h1>
      <svg className="hero-bridge" viewBox="0 0 1600 300" preserveAspectRatio="none" aria-hidden>
        <line className="h-deck" x1="80" y1="250" x2="1520" y2="250" stroke="#0c0e13" strokeWidth="5" pathLength="1" vectorEffect="non-scaling-stroke" />
        <path className="h-cable" d="M80 250 Q800 -160 1520 250" stroke="#ff4a1c" strokeWidth="5" pathLength="1" vectorEffect="non-scaling-stroke" />
        {hangers.map((h, i) => <line key={i} className="h-hang" x1={h.x} y1={250} x2={h.x} y2={h.y} stroke="#0c0e13" strokeOpacity=".35" strokeWidth="2" pathLength="1" vectorEffect="non-scaling-stroke" />)}
        <circle className="h-node" cx="80" cy="250" r="11" fill="#0c0e13" /><circle className="h-node" cx="1520" cy="250" r="11" fill="#ff4a1c" />
        <text className="h-label mono" x="80" y="290" fontSize="15" fill="#666b78" fontFamily="var(--mono)" letterSpacing="3">SESSION A</text>
        <text className="h-label mono" x="1520" y="290" fontSize="15" fill="#666b78" fontFamily="var(--mono)" letterSpacing="3" textAnchor="end">SESSION B</text>
        <g className="h-packet" opacity="0"><rect x="-13" y="-13" width="26" height="26" rx="7" fill="#0c0e13" /><rect x="-13" y="-13" width="26" height="26" rx="7" fill="#fff" opacity=".18" /></g>
      </svg>
      <div className="scroll-cue">Scroll</div>
      <div className="hero-bottom">
        <p className="hero-sub">
          A resume <b>safety gate</b> for AI coding sessions. It checkpoints the real state of your repo, records the tests you actually ran, and tells the next session whether it is safe to touch code.
        </p>
        <div className="cta-row">
          <button className="pill solid" onClick={copy} data-magnet aria-label="Copy install command">
            <code>{INSTALL}</code><span className="copy">{copied ? "Copied" : "Copy"}</span>
          </button>
          <a className="pill ghost" href={REPO} target="_blank" rel="noreferrer" data-magnet>View on GitHub ↗</a>
        </div>
      </div>
    </section>
  );
}
