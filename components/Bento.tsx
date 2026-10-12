const C = [
  { s: "s4", tag: "Evidence", h: "Executed tests, not recollection.", p: "contextbridge run records the command, exit code, timestamp and the exact workspace it ran against. Failed and interrupted runs stay visible.", viz: "E1 `pytest -q` → PASSED (exit 0)\nE2 `pytest -q` → FAILED (exit 1)" },
  { s: "s2", tag: "Decisions", h: "A graph, not a flat summary.", p: "Requirement → decision → code → test, with the alternatives you rejected.", viz: "R1 → D1 → src/queue.py → test" },
  { s: "s2", tag: "Drift", h: "Sees what moved.", p: "Branch, commits, edited files, stale assumptions and failed runs.", viz: "[WARN ] 2 commit(s) since checkpoint" },
  { s: "s2", tag: "Privacy", h: "Secrets never get written.", p: "Scanned before every write. Excluded files are never recorded.", viz: "[REDACTED:aws-access-key]" },
  { s: "s2", tag: "Local-first", h: "Plain files in your repo.", p: "No server. No account. No telemetry. Keep them out of git with one flag.", viz: "init --local-only" },
  { s: "s3", tag: "Portable", h: "Any account. Any agent.", p: "Versioned JSON plus a Markdown prompt any assistant can read. Export one file, import it anywhere.", viz: "schema: contextbridge/1" },
  { s: "s3", tag: "Sessions", h: "Claims, advisory by design.", p: "Name the paths each agent is working on and get a warning when claims overlap. It reduces surprises; it does not prevent conflicts.", viz: "'auth' ~ 'api': src/auth/" },
];
export default function Bento() {
  return (
    <section className="bento-sec">
      <h2 data-lines><span className="mask"><span>Everything a real</span></span><span className="mask"><span>repo <span className="it">needs.</span></span></span></h2>
      <div className="bento">
        {C.map((c, i) => (
          <article className={`bcard ${c.s}`} key={c.h} data-fade={(i % 3) * 0.08} data-cursor>
            <span className="tag">{c.tag}</span><h3>{c.h}</h3><p>{c.p}</p><pre className="viz">{c.viz}</pre>
          </article>
        ))}
      </div>
    </section>
  );
}
