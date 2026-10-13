"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function Showreel() {
  const sec = useRef<HTMLElement>(null), vid = useRef<HTMLVideoElement>(null), fill = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false), [paused, setPaused] = useState(false), [muted, setMuted] = useState(true), [t, setT] = useState("0:00"), [mobile, setMobile] = useState(false), [dur, setDur] = useState(0);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s) % 60).padStart(2, "0")}`;
  const shownDur = dur || (mobile ? 45 : 59);  // fallbacks until the video reports its real length
  useEffect(() => { const q = window.matchMedia("(max-width: 900px)"); const f = () => setMobile(q.matches); f(); q.addEventListener("change", f); return () => q.removeEventListener("change", f); }, []);

  useEffect(() => {
    const v = vid.current!;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      gsap.to(".reel-frame", { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: sec.current, start: "top top", end: "+=95%", scrub: true } });
      gsap.to(".reel-title", { yPercent: -40, opacity: 0, ease: "none", scrollTrigger: { trigger: sec.current, start: "top top", end: "+=55%", scrub: true } });
    });
    mm.add("(max-width: 900px)", () => {  // phone: the 9:16 cut grows from a phone-shaped card to full screen
      gsap.fromTo(".reel-frame", { clipPath: "inset(31% 13% 11% 13% round 34px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: sec.current, start: "top top", end: "+=85%", scrub: true } });
      gsap.to(".reel-title", { yPercent: -50, opacity: 0, ease: "none", scrollTrigger: { trigger: sec.current, start: "top top", end: "+=45%", scrub: true } });
    });
    // ambient muted loop only while on screen
    const io = new IntersectionObserver(([e]) => { if (live) return; e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }, { rootMargin: "200px" });
    io.observe(sec.current!);
    const onTime = () => {
      if (fill.current && v.duration) gsap.set(fill.current, { scaleX: v.currentTime / v.duration });
      const s = Math.floor(v.currentTime); setT(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`);
    };
    const onEnd = () => { setLive(false); v.muted = true; setMuted(true); v.loop = true; v.currentTime = 0; v.play().catch(() => {}); };
    const onMeta = () => setDur(v.duration || 0);
    v.addEventListener("loadedmetadata", onMeta); onMeta();
    v.addEventListener("timeupdate", onTime); v.addEventListener("ended", onEnd);
    return () => { mm.revert(); io.disconnect(); v.removeEventListener("loadedmetadata", onMeta); v.removeEventListener("timeupdate", onTime); v.removeEventListener("ended", onEnd); };
  }, [live, mobile]);

  const start = () => { const v = vid.current!; v.loop = false; v.muted = false; v.currentTime = 0; v.play(); setMuted(false); setPaused(false); setLive(true); };
  const toggle = () => { const v = vid.current!; if (v.paused) { v.play(); setPaused(false); } else { v.pause(); setPaused(true); } };
  const mute = () => { const v = vid.current!; v.muted = !v.muted; setMuted(v.muted); };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => { const v = vid.current!, r = e.currentTarget.getBoundingClientRect(); v.currentTime = ((e.clientX - r.left) / r.width) * v.duration; };

  return (
    <section className={`reel${live ? " live" : ""}`} id="watch" ref={sec}>
      <div className="reel-pin">
        <div className="reel-title">
          <h2 data-lines><span className="mask"><span>Watch it in</span></span><span className="mask"><span className="it">under a minute.</span></span></h2>
          <p>The problem · the gate<br />the handoff</p>
        </div>
        <div className="reel-frame">
          <video ref={vid} key={mobile ? "v" : "h"} src={mobile ? "/promo-9x16.mp4" : "/promo-16x9.mp4"} poster={mobile ? "/promo-poster-v.jpg" : "/promo-poster.jpg"} muted loop playsInline preload="metadata" aria-label="ContextBridge promo video" />
          <div className="reel-ui reel-play-wrap">
            <button className="reel-play" onClick={start} data-cursor aria-label="Play the promo with sound">
              <i /><span>Play with sound<small>{fmt(shownDur)} · {mobile ? "9:16" : "16:9"}</small></span>
            </button>
          </div>
          <div className="reel-badge">Preview · muted</div>
          <div className="reel-bar">
            <button onClick={toggle}>{paused ? "Play" : "Pause"}</button>
            <div className="reel-track" onClick={seek} role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={Math.round(shownDur)}><i ref={fill as React.RefObject<HTMLElement>} /></div>
            <span>{t} / {fmt(shownDur)}</span>
            <button onClick={mute}>{muted ? "Sound off" : "Sound on"}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
