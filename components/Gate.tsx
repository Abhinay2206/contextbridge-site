"use client";
import { useEffect, useRef, useState } from "react";

type L = ["BLOCK" | "STALE" | "WARN" | "INFO" | "OK", string];
type S = { id: string; key: string; label: string; shell: string; verdict: "READY" | "REVIEW_REQUIRED" | "BLOCKED"; exit: number; lines: L[]; note: string };
const NOMATCH: L = ["WARN", "no passing test run matches the current workspace state; re-run tests before trusting 'done'"];
const ADVICE = {
  READY: "No conflicts detected. Proceed with the Next action and keep verifying with tests.",
  REVIEW_REQUIRED: "Do not edit yet. Inspect each item below, reconcile it with the code or the user, then proceed.",
  BLOCKED: "Do not edit code. This checkpoint cannot be trusted for this workspace. Ask the user, or inspect the repo and create a fresh checkpoint with `contextbridge save`.",
};
const S: S[] = [
  { id: "none", key: "1", label: "Change nothing", shell: "# …time passes, nothing changes", verdict: "READY", exit: 0, lines: [["OK", "No drift: workspace matches the checkpoint."]], note: "Same commit, same files, a passing test run on this exact state. Safe to continue." },
  { id: "edit", key: "2", label: "Edit a file", shell: "echo '# hotfix' >> src/auth.py", verdict: "REVIEW_REQUIRED", exit: 1, lines: [["WARN", "src/auth.py: new uncommitted change since checkpoint"], NOMATCH], note: "Someone changed code after the checkpoint. The old test run no longer proves anything." },
  { id: "commit", key: "3", label: "Add a commit", shell: "git commit -am 'refactor tokens'", verdict: "REVIEW_REQUIRED", exit: 1, lines: [["WARN", "1 commit(s) since checkpoint (580df56 -> a41c9e2)"], NOMATCH], note: "History moved on. The agent must read what changed before it builds on the handoff." },
  { id: "fail", key: "4", label: "A test fails", shell: "contextbridge run -- pytest -q", verdict: "REVIEW_REQUIRED", exit: 1, lines: [["STALE", "last test run E2 `pytest -q` FAILED (exit 1)"], NOMATCH], note: "Evidence is recorded whether it passes or fails. A failing run is never hidden." },
  { id: "file", key: "5", label: "Delete a decision's file", shell: "rm src/queue.py", verdict: "REVIEW_REQUIRED", exit: 1, lines: [["STALE", "code:src/queue.py: file no longer exists"], NOMATCH], note: "The decision graph points at code that is gone, so the recorded reasoning is out of date." },
  { id: "branch", key: "6", label: "Switch branch", shell: "git checkout -b experiment", verdict: "BLOCKED", exit: 2, lines: [["BLOCK", "branch changed: main -> experiment"], NOMATCH], note: "A checkpoint made on another branch cannot be compared reliably. No resume prompt is printed." },
  { id: "amend", key: "7", label: "Rewrite history", shell: "git commit --amend -m 'reworded'", verdict: "BLOCKED", exit: 2, lines: [["BLOCK", "checkpoint commit 580df56 is not an ancestor of HEAD (rebase, force-push or different branch); file comparison is unreliable"], NOMATCH], note: "The commit the checkpoint describes no longer exists in this history." },
  { id: "env", key: "8", label: "Touch .env", shell: "echo 'KEY=1' > .env", verdict: "READY", exit: 0, lines: [["OK", "No drift: workspace matches the checkpoint."]], note: "Secret files are excluded by default: never recorded, hashed or compared. Privacy first." },
];

export default function Gate() {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>[]>([]);
  const secRef = useRef<HTMLElement>(null), touched = useRef(false), inView = useRef(false);
  const pick = (k: number) => { touched.current = true; setI(k); };
  const s = S[i];
  const rows: { cls: string; text: string }[] = [
    { cls: "p", text: `$ ${s.shell}` },
    { cls: "c", text: "$ contextbridge resume --check" },
    { cls: "c", text: `## Resume safety gate: ${s.verdict}` },
    { cls: "p", text: ADVICE[s.verdict] },
    ...s.lines.map(([lv, m]) => ({ cls: lv, text: lv === "OK" ? m : `[${lv.padEnd(5)}] ${m}` })),
  ];
  useEffect(() => {
    timer.current.forEach(clearTimeout); setShown(0);
    rows.forEach((_, k) => timer.current.push(setTimeout(() => setShown(k + 1), 120 + k * 170)));
    return () => timer.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 900px)").matches) return;
    const io = new IntersectionObserver(([e]) => { inView.current = e.isIntersecting; }, { threshold: 0.35 }); io.observe(secRef.current!);
    const id = setInterval(() => { if (inView.current && !touched.current) setI((n) => (n + 1) % S.length); }, 3600);
    return () => { io.disconnect(); clearInterval(id); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { const n = Number(e.key); if (n >= 1 && n <= S.length && !(e.target as HTMLElement).closest("input,textarea")) setI(n - 1); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="gate dark" id="gate" ref={secRef}>
      <div className="gate-head">
        <div>
          <span className="eyebrow">The resume gate</span>
          <h2 data-lines style={{ marginTop: 28 }}><span className="mask"><span>Throw something</span></span><span className="mask"><span>at the <span className="it">handoff.</span></span></span></h2>
        </div>
        <p data-fade>The checkpoint is a snapshot of the real repo. Change the workspace, then watch the gate decide, using the tool&apos;s actual messages. <span className="desk-only"> Press keys 1 to 8.</span><span className="mob-only"> Tap an action, or just watch: it cycles on its own.</span></p>
      </div>
      <div className="lab" data-fade>
        <div className="lab-actions" role="tablist" aria-label="Change the workspace">
          <h3>Do something after the checkpoint</h3>
          {S.map((x, k) => (
            <button key={x.id} role="tab" aria-selected={k === i} className={`act${k === i ? " on" : ""}`} onClick={() => pick(k)}>
              <span className="k">{x.key}</span>{x.label}
            </button>
          ))}
        </div>
        <div className="lab-out">
          <div className="term" aria-live="polite">
            {rows.slice(0, shown).map((r, k) => (<span key={`${i}-${k}`} className={`l ${r.cls}`}>{r.text}</span>))}
          </div>
          <div className="verdict">
            <div>
              <small>Verdict</small>
              <div className={`verdict-word v-${s.verdict}`}>{s.verdict}</div>
            </div>
            <div className="verdict-side"><span className={`exit v-${s.verdict}`}>exit {s.exit}</span><br />{s.note}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
