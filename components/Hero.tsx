"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { REPO } from "./Nav";
import { TOOL_VERSION } from "../lib/site";
import HeroCanvas from "./HeroCanvas";
gsap.registerPlugin(ScrollTrigger);

const INSTALL = "pip install contextbridge-cli";
type Kind = "OK" | "WARN" | "BLOCK";
type G = { verdict: "READY" | "REVIEW_REQUIRED" | "BLOCKED"; short: string; exit: number; color: string; lines: [Kind, string][]; note: string };
// The messages are the tool's real output (see the gate lab below for the full set).
const GATE: G[] = [
  { verdict: "READY", short: "Ready", exit: 0, color: "#059669", lines: [["OK", "No drift: workspace matches the checkpoint."]], note: "Same commit, same files, a passing run on this exact state." },
  { verdict: "REVIEW_REQUIRED", short: "Review", exit: 1, color: "#d97706", lines: [["WARN", "[WARN ] src/auth.py: new uncommitted change since checkpoint"], ["WARN", "[WARN ] no passing test run matches the current workspace state"]], note: "Something changed after the checkpoint. Inspect before you edit." },
  { verdict: "BLOCKED", short: "Blocked", exit: 2, color: "#e11d48", lines: [["BLOCK", "[BLOCK] branch changed: main -> experiment"]], note: "The checkpoint can't be trusted here. No resume prompt, no blind edits." },
];

export default function Hero({ stats }: { stats: { v: string; l: string }[] }) {
  const root = useRef<HTMLElement>(null), accent = useRef<HTMLSpanElement>(null);
  const disp = useRef(0), manualUntil = useRef(0);
  const [copied, setCopied] = useState(false);
  const [i, setI] = useState(0), [shown, setShown] = useState(0);
  const g = GATE[i];

  // verdict cycle: automatic until the visitor picks one (then it waits 14 s)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => { if (Date.now() > manualUntil.current) setI((n) => (n + 1) % GATE.length); }, 5200);
    return () => clearInterval(id);
  }, []);
  const pick = (k: number) => { manualUntil.current = Date.now() + 14000; setI(k); };

  useEffect(() => {
    setShown(0);
    const ts = [0, 1, 2].map((k) => setTimeout(() => setShown(k + 1), 240 + k * 300));
    const el = accent.current;
    if (el) { el.classList.remove("glitch"); void el.offsetWidth; el.classList.add("glitch"); }
    return () => ts.forEach(clearTimeout);
  }, [i]);

  useEffect(() => {
    const c = gsap.context(() => {
      const spans = gsap.utils.toArray<HTMLElement>(".hero h1 .mask > span");
      gsap.set(spans, { yPercent: 150 });
      gsap.set(".hero-top, .hero-chip, .hero-sub, .cta-row, .hero-read, .hero-stats > div", { opacity: 0, y: 24 });
      gsap.set(".hero-bridge", { opacity: 0, scale: 1.08 });
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 });
      tl.to(".hero-bridge", { opacity: 1, scale: 1, duration: 2.2, ease: "power2.out" }, 0)
        .to(".hero-top", { opacity: 1, y: 0, duration: 0.9 }, 0.15)
        .to(".hero-chip", { opacity: 1, y: 0, duration: 0.9 }, 0.3)
        .to(spans, { yPercent: 0, duration: 1.5, stagger: 0.12 }, 0.35)
        .to(".hero-sub, .cta-row", { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 1)
        .to(".hero-read", { opacity: 1, y: 0, duration: 1.2 }, 0.9)
        .to(".hero-stats > div", { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 1.4);
      // scrolling away dissolves the bridge and lifts the copy
      ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom 30%", scrub: true, onUpdate: (s) => { disp.current = s.progress; } });
      gsap.to(".hero-copy", { yPercent: -8, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    }, root);
    return () => c.revert();
  }, []);

  const copy = async () => { try { await navigator.clipboard.writeText(INSTALL); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {} };

  return (
    <section className="hero" id="top" ref={root} style={{ ["--vc" as string]: g.color }}>
      <HeroCanvas verdict={i} dispersion={disp} />
      <div className="hero-glow" aria-hidden />
      <div className="hero-top"><span>Verified · Portable · Private</span><span>v{TOOL_VERSION} — MIT · by <a href="https://www.orvantia.in" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>Orvantia</a></span></div>

      <div className="hero-main">
        <div className="hero-copy">
          <span className="hero-chip"><i />Resume safety gate for AI coding sessions</span>
          <h1>
            <span className="mask"><span>Context</span></span>
            <span className="mask"><span className="it" ref={accent}>outlives</span></span>
            <span className="mask"><span>the session.</span></span>
          </h1>
          <p className="hero-sub">The <b>ContextBridge skill</b> checkpoints the real state of your repo, records the tests you actually ran, and tells the next session whether it is safe to touch code.</p>
          <div className="cta-row">
            <button className="pill solid" onClick={copy} data-magnet aria-label="Copy install command"><code>{INSTALL}</code><span className="copy">{copied ? "Copied" : "Copy"}</span></button>
            <a className="pill ghost" href={REPO} target="_blank" rel="noreferrer" data-magnet>View on GitHub ↗</a>
          </div>
        </div>

        <aside className="hero-read" aria-label="Live example of the resume gate">
          <div className="read-top mono"><span>contextbridge resume --check</span><em>live example</em></div>
          <div className="read-word"><div key={i} className={`gword v-${g.verdict}`}>{g.verdict}</div></div>
          <div className="read-log mono" aria-hidden>
            {g.lines.map(([k, t], n) => (<span key={`${i}-${n}`} className={`gl ${k}`} style={{ opacity: shown > n ? 1 : 0 }}>{t}</span>))}
          </div>
          <p className="read-note"><span className={`gexit mono v-${g.verdict}`}>exit {g.exit}</span>{g.note}</p>
          <div className="read-pick" role="tablist" aria-label="Show a verdict">
            {GATE.map((x, k) => (<button key={x.verdict} role="tab" aria-selected={k === i} className={k === i ? "on" : ""} onClick={() => pick(k)} style={{ ["--c" as string]: x.color }}><i />{x.short}</button>))}
          </div>
          <p className="read-hint mono">move the mouse through the bridge · click to send a shockwave</p>
        </aside>
      </div>

      <div className="hero-stats">
        {stats.map((s) => (<div key={s.l}><b>{s.v}</b><span>{s.l}</span></div>))}
      </div>
    </section>
  );
}
