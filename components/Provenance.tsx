"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function Provenance() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const c = gsap.context(() => {
      gsap.set(".stamp", { scale: 2.4, opacity: 0, rotate: -18 });
      ScrollTrigger.create({ trigger: ".prov-grid", start: "top 70%", once: true, onEnter: () => {
        gsap.to(".stamp.ok", { scale: 1, opacity: 1, rotate: -6, duration: 0.5, ease: "back.out(1.8)", delay: 0.25 });
        gsap.to(".stamp.no", { scale: 1, opacity: 1, rotate: -6, duration: 0.7, ease: "power3.out", delay: 0.9 });
        gsap.fromTo(".pcard.ok", { y: 0 }, { keyframes: { y: [0, 8, -3, 0] }, duration: 0.35, delay: 0.5 });
      } });
    }, ref);
    return () => c.revert();
  }, []);
  return (
    <section className="prov" ref={ref}>
      <div className="prov-head">
        <h2 data-lines><span className="mask"><span>Knows what is</span></span><span className="mask"><span><span className="it">proven</span> and what</span></span><span className="mask"><span>is only <span className="it">claimed.</span></span></span></h2>
        <p data-fade>Every item in the handoff carries its source. A task is marked verified only when you link a passing run to it. Everything else says who claimed it, and that nobody has checked.</p>
      </div>
      <div className="prov-grid">
        <div className="pcard ok" data-fade>
          <h4>Observed</h4><div className="stamp ok">VERIFIED</div>
          <div className="row"><div className="title">Login endpoint</div>
            <div className="meta">verified by E1 PASSED, exit 0<br />@ 2026-10-12T09:41:07Z<br />workspace fingerprint matches checkpoint</div></div>
        </div>
        <div className="pcard" data-fade="0.12">
          <h4>Claimed</h4><div className="stamp no">UNVERIFIED</div>
          <div className="row"><div className="title">Refresh-token tests</div>
            <div className="meta">claimed by claude-account-a<br />no linked evidence<br />a passing run proves a command succeeded, not that the software is correct</div></div>
        </div>
      </div>
    </section>
  );
}
