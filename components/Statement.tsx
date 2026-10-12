"use client";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
gsap.registerPlugin(ScrollTrigger);

const TEXT = "A new session starts with no memory. The handoff says it is done. The repository says *otherwise.*";
export default function Statement() {
  const sec = useRef<HTMLElement>(null);
  useEffect(() => {
    const words = sec.current!.querySelectorAll<HTMLElement>(".w");
    const st = ScrollTrigger.create({
      trigger: sec.current, start: "top top", end: "bottom bottom", scrub: true,
      onUpdate: (s) => { const n = Math.round(s.progress * 1.08 * words.length); words.forEach((w, i) => w.classList.toggle("on", i < n)); },
    });
    return () => st.kill();
  }, []);
  const words = TEXT.split(" ").map((w) => ({ w: w.replace(/\*/g, ""), em: w.includes("*") }));
  return (
    <section className="statement" ref={sec}>
      <div className="statement-pin">
        <span className="eyebrow">The problem</span>
        <p>{words.map((x, i) => (<span key={i}><span className={`w${x.em ? " em" : ""}`}>{x.w}</span>{" "}</span>))}</p>
      </div>
    </section>
  );
}
