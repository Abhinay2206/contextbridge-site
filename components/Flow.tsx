"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const P = [
  { n: "01", t: ["Record", "evidence."], p: "Run your tests through ContextBridge. The command, exit code and time are stored, whether it passes or fails.",
    c: `<span class="d">$</span> <span class="w">contextbridge run -- pytest -q</span>\nE1 \`pytest -q\` -> <span class="g">PASSED</span> (exit 0, 3.4s)\n\n<span class="d">$</span> <span class="w">contextbridge work add "Login endpoint" \\\n    --status completed --evidence E1</span>\nUpdated: state.json, HANDOFF.md` },
  { n: "02", t: ["Save a", "checkpoint."], p: "Branch, HEAD and a hash of every uncommitted file go into plain files in your repo. You review the diff first.",
    c: `<span class="d">$</span> <span class="w">contextbridge save \\\n    --objective "Add token auth" \\\n    --next "Finish refresh tests"</span>\n<span class="d">--- a/contextbridge/state.json</span>\n<span class="d">+++ b/contextbridge/state.json</span>\n<span class="g">+  "branch": "main",</span>\n<span class="g">+  "head": "580df56…",</span>\nApply these changes? [y/N] <span class="w">y</span>` },
  { n: "03", t: ["Switch", "anything."], p: "A new session, another account, a different agent. The handoff is files in the repository, not a private chat history.",
    c: `<span class="d"># same repo, new account</span>\ncontextbridge/\n  <span class="w">state.json</span>     <span class="d">evidence, work, snapshot</span>\n  <span class="w">graph.json</span>     <span class="d">decisions → code → tests</span>\n  <span class="w">sessions.json</span>  <span class="d">who is touching what</span>\n  <span class="w">HANDOFF.md</span>    <span class="d">what the next agent reads</span>` },
  { n: "04", t: ["Resume", "safely."], p: "Before any edit, the gate compares the checkpoint with the live workspace and returns one verdict.",
    c: `<span class="d">$</span> <span class="w">contextbridge resume --check</span>\n<span class="a">## Resume safety gate: REVIEW_REQUIRED</span>\nDo not edit yet. Inspect each item below…\n\n<span class="a">[WARN ]</span> src/auth.py: new uncommitted change\n<span class="a">[WARN ]</span> no passing test run matches the\n        current workspace state` },
];

export default function Flow() {
  const sec = useRef<HTMLElement>(null), track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const dist = () => track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: sec.current, start: "top top", end: () => `+=${dist()}`, pin: ".flow-pin", scrub: 0.6, invalidateOnRefresh: true, onUpdate: (s) => gsap.set(".flow-prog i", { scaleX: s.progress }) } });
    });
    return () => mm.revert();
  }, []);
  return (
    <section className="flow" id="how" ref={sec}>
      <div className="flow-pin">
        <div className="flow-bar"><span>How it works</span><div className="flow-prog"><i /></div><span>4 steps</span></div>
        <div className="flow-track" ref={track}>
          {P.map((x) => (
            <div className="flow-panel" key={x.n}>
              <div className="flow-num" aria-hidden>{x.n}</div>
              <div className="flow-copy"><h3>{x.t[0]}<br /><span className="it">{x.t[1]}</span></h3><p>{x.p}</p></div>
              <div className="flow-card"><div className="bar"><i /><i /><i /></div><div className="body" dangerouslySetInnerHTML={{ __html: x.c }} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
