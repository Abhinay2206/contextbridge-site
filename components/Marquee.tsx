"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const WORDS = ["Verified", "Portable", "Private", "Local-first", "Zero dependencies", "Evidence, not memory"];
const Row = () => (
  <div className="marquee-item">
    {WORDS.map((w, i) => (<span key={w} style={{ display: "contents" }}>{i % 2 ? <em>{w}</em> : <span>{w}</span>}<i /></span>))}
  </div>
);
export default function Marquee() {
  const t = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tw = gsap.to(t.current, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
    const st = ScrollTrigger.create({ onUpdate: (s) => { gsap.to(tw, { timeScale: 1 + Math.min(Math.abs(s.getVelocity()) / 500, 6) * (s.direction as number), duration: 0.2, overwrite: true }); gsap.to(tw, { timeScale: 1, delay: 0.25, duration: 1 }); } });
    return () => { tw.kill(); st.kill(); };
  }, []);
  return (<div className="marquee" aria-hidden><div className="marquee-track" ref={t}><Row /><Row /><Row /><Row /></div></div>);
}
