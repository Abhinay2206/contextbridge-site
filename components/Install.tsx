"use client";
import { useState } from "react";

const T = [
  { id: "cli", label: "CLI", lines: ["pip install contextbridge-cli", "contextbridge run -- pytest -q", "contextbridge save --objective \"Add token auth\"", "contextbridge resume --check"], nop: [] as number[], note: "Python 3.9 or newer and git. Nothing else to install." },
  { id: "plugin", label: "Claude Code plugin", lines: ["/plugin marketplace add Abhinay2206/ContextBridge", "/plugin install contextbridge@abhinay-contextbridge"], nop: [0, 1], note: "Adds /contextbridge:init, :checkpoint, :resume and :status. They call the CLI when it is installed." },
  { id: "skill", label: "ContextBridge skill (Claude.ai)", lines: ["Download contextbridge-skill.zip from the repo's dist/ folder", "Claude → Customize → Skills → Upload a skill"], nop: [0, 1], note: "A browser chat cannot read your local repo or run the CLI. It works from files you provide." },
];
export default function Install() {
  const [i, setI] = useState(0), [ok, setOk] = useState(false);
  const t = T[i];
  const copy = async () => { try { await navigator.clipboard.writeText(t.lines.join("\n")); setOk(true); setTimeout(() => setOk(false), 1500); } catch {} };
  return (
    <section className="install dark" id="install">
      <div className="install-grid">
        <div className="install-copy">
          <span className="eyebrow" style={{ color: "var(--mute-d)" }}>Get started</span>
          <h2 data-lines style={{ marginTop: 28 }}><span className="mask"><span>Install in</span></span><span className="mask"><span>one <span className="it">line.</span></span></span></h2>
          <p data-fade>Use the ContextBridge skill as a Claude skill, a Claude Code plugin or a plain CLI. Open source, MIT licensed. Try it on a throwaway branch and open an issue if anything is unclear or wrong.</p>
        </div>
        <div data-fade>
          <div className="tabs" role="tablist">{T.map((x, k) => (<button key={x.id} role="tab" aria-selected={k === i} className={`tab${k === i ? " on" : ""}`} onClick={() => setI(k)}>{x.label}</button>))}</div>
          <div className="code">
            <button className="copy-btn" onClick={copy} data-cursor>{ok ? "Copied" : "Copy"}</button>
            {t.lines.map((l, k) => (<span key={l} className={`ln${t.nop.includes(k) && t.id !== "plugin" ? " nop" : ""}${t.id === "plugin" ? " nop" : ""}`}>{l}</span>))}
            <span className="note">{t.note}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
