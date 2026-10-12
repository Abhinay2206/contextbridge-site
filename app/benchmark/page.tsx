/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import Motion from "../../components/Motion";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { HBars, Stack, Lines, Matrix } from "../../components/Charts";
import { SITE_URL, ld } from "../../lib/site";
import { B, v1, v2, ms, num, pct, allScenarios, scenarioPass, speedTop, families } from "../../lib/bench";

export const metadata: Metadata = {
  title: "Benchmark report",
  description: "Measured, not claimed: speed, gate accuracy, randomized oracle testing, token cost, secret scanning and reliability for ContextBridge, with the raw data and a downloadable report.",
  alternates: { canonical: "/benchmark" },
  openGraph: { type: "article", url: "/benchmark", title: "ContextBridge benchmark report: measured, not claimed", description: "Labeled scenarios, randomized oracle testing, token cost and secret-scanner results for ContextBridge." },
};

const fz = v2.fuzz, tk = v2.tokens, sc = v2.scanner, st = v2.stability, cc = v2.concurrency, pk = v2.packaging;
const gate = tk.summary_gate, full = tk.summary_full;
const misses = allScenarios.filter((s: any) => !s.verdict_ok);
const covered = Object.entries(sc.covered) as [string, any][];
const gaps = Object.entries(sc.gaps) as [string, any][];
const worstCC = cc[cc.length - 1];
const repo = tk.baseline;

export default function Benchmark() {
  const speedRows = v1.speed.rows.filter((r: any) => r.dirty === 500 || r.dirty === 0);
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld({ "@context": "https://schema.org", "@type": "TechArticle", headline: "ContextBridge benchmark report", url: `${SITE_URL}/benchmark`, about: "ContextBridge", author: { "@type": "Person", name: "Abhinay" }, dateModified: B.generated, inLanguage: "en" }) }} />
      <Motion /><Nav base="/" />

      <section className="bm-hero">
        <span className="eyebrow" style={{ color: "var(--mute)" }}>Benchmark report</span>
        <h1 data-lines style={{ marginTop: 28 }}><span className="mask"><span>Measured,</span></span><span className="mask"><span>not <span className="it">claimed.</span></span></span></h1>
        <p className="bm-lead" data-fade>Every number here comes from real runs of the CLI against real git repositories: {num(allScenarios.length)} labeled scenarios, {num(fz.trials)} randomized trials checked against an independent oracle, concurrency and stability tests, token counts, and secret-scanner tests on {num(sc.corpora.python_stdlib_all.lines + sc.corpora.node_modules_js_sample.lines)} lines of real code.</p>
        <div className="bm-meta" data-fade="0.1">
          <span>v{v2.meta.version}</span><span>commit {v2.meta.commit}{v2.meta.dirty_tree ? " + working tree" : ""}</span><span>{v2.meta.cpu}</span><span>Python {v2.meta.python}</span><span>{v2.meta.git}</span><span>{v2.meta.date}</span>
        </div>
        <div className="bm-dl" data-fade="0.15">
          <a className="pill solid" href="/ContextBridge-Benchmark-Report.docx" download data-magnet>Download the report (.docx) ↓</a>
          <a className="pill ghost" href="/benchmark.json" download data-magnet>Raw data (.json) ↓</a>
        </div>
      </section>

      <div className="bm-stats dark">
        <div className="bm-stat" data-fade><b><span data-count={scenarioPass}>0</span><small>/{allScenarios.length}</small></b><span>labeled drift scenarios behave as expected</span></div>
        <div className="bm-stat" data-fade="0.08"><b>{pct(fz.agreement, 1)}</b><span>agreement with an independent oracle over {num(fz.trials)} random sequences of git and file operations</span></div>
        <div className="bm-stat" data-fade="0.16"><b><span data-count={Math.round(gate.median)}>0</span><small> tokens</small></b><span>median cost of <code>resume --check</code>; the full resume prompt is {num(Math.round(full.median))}</span></div>
        <div className="bm-stat" data-fade="0.24"><b><span data-count={Math.round(speedTop.resume_check_s * 1000)}>0</span><small>ms</small></b><span>to check a repo with {num(speedTop.files)} files and {speedTop.dirty} uncommitted changes</span></div>
      </div>

      {/* ---------------- accuracy ---------------- */}
      <section className="bm-sec">
        <span className="eyebrow">01 · Gate accuracy</span>
        <h2 data-lines><span className="mask"><span>Does the gate say the</span></span><span className="mask"><span>right <span className="it">thing?</span></span></span></h2>
        <p className="sub" data-fade>{allScenarios.length} scenarios, each applying one change after a checkpoint and comparing the verdict with the expected one. I wrote the expectations before running, so this shows the tool behaves as designed, and where it cannot know better.</p>
        <div className="bm-cols">
          <div className="panel" data-fade><h3>Scenarios by family</h3><Stack rows={families as any} /></div>
          <div className="panel" data-fade="0.1">
            <h3>Misses ({misses.length})</h3>
            <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Scenario</th><th>Expected</th><th>Got</th></tr></thead><tbody>
              {misses.map((m: any) => (<tr key={m.id}><td><span className="mono">{m.id}</span><br />{m.description}</td><td className="mono">{m.expected}</td><td className="mono">{String(m.got).startsWith("CRASH") ? "crash (traceback)" : m.got}</td></tr>))}
            </tbody></table></div>
            <p className="bm-note">An unfetched remote is invisible by design (no network). Everything else, including rewrites, branch moves, merges, nested repos, privacy exclusions and corrupted state, behaves as labeled.</p>
          </div>
        </div>
      </section>

      {/* ---------------- fuzz ---------------- */}
      <section className="bm-sec dark">
        <span className="eyebrow">02 · Randomized testing</span>
        <h2 data-lines><span className="mask"><span>{num(fz.trials)} random</span></span><span className="mask"><span>histories, <span className="it">one oracle.</span></span></span></h2>
        <p className="sub" data-fade>Each trial applies 1 to 5 random operations (edit, add, delete, commit, branch, amend, reset, stash, rename, ignored files…). An independent oracle, built from plain git plumbing and content hashes, decides what the verdict should be. Seeds {fz.seeds.join(" and ")}, so it is reproducible. The second seed never edits the tool&apos;s own notes (see below).</p>
        <div className="bm-cols">
          <div className="panel" data-fade><h3>Oracle vs tool</h3><Matrix confusion={fz.confusion} /></div>
          <div className="panel" data-fade="0.1">
            <h3>Result</h3>
            <div className="big-ok">{fz.agree}<span style={{ fontSize: ".4em", color: "var(--mute-d)" }}> / {fz.trials}</span></div>
            <p className="bm-note" style={{ marginTop: 14 }}>{fz.disagreement_count === 0 ? "No disagreements." : `${fz.disagreement_count} disagreement${fz.disagreement_count === 1 ? "" : "s"}; ${fz.unexplained} unexplained.`} Mean {fz.mean_ops.toFixed(1)} operations per trial.</p>
            {fz.by_seed.map((r: any) => (<p className="bm-note" key={r.seed} style={{ marginTop: 10 }}><span className="mono">seed {r.seed}</span>: {r.agree} / {r.trials} agree{r.exclude_notes ? " (notes excluded from edit targets)" : ""}.</p>))}
            {fz.disagreements.slice(0, 5).map((d: any) => (<p className="bm-note" key={d.trial + "-" + d.seed} style={{ marginTop: 14 }}><span className="mono">seed {d.seed}, trial {d.trial}</span>: ops {d.ops.join(" → ")}; oracle {d.oracle}, tool {d.tool}. <i>{d.findings[0]}</i> {d.explained ?? "Unexplained: needs investigation."}</p>))}
          </div>
        </div>
      </section>

      {/* ---------------- tokens ---------------- */}
      <section className="bm-sec">
        <span className="eyebrow">03 · Tokens</span>
        <h2 data-lines><span className="mask"><span>What it costs an</span></span><span className="mask"><span>agent to <span className="it">read.</span></span></span></h2>
        <p className="sub" data-fade>Counted with real tokenizers (cl100k and o200k via tiktoken) over the actual output of the CLI. Claude&apos;s own tokenizer is not available offline, so treat these as close proxies, not exact Claude counts.</p>
        <div className="bm-cols">
          <div className="panel" data-fade>
            <h3>Tokens a fresh agent must read</h3>
            <HBars w={170} rows={repo.flatMap((r: any) => [
              { label: `${r.repo}`, value: r.git_orientation_dump, note: `${num(r.git_orientation_dump)} git dump`, color: "var(--mute)" },
              { label: "", value: r.resume_full, note: `${num(r.resume_full)} full resume`, color: "var(--signal)" },
              { label: "", value: r.gate_only, note: `${num(r.gate_only)} gate only`, color: "var(--green)" },
            ])} max={Math.max(...repo.map((r: any) => r.git_orientation_dump))} />
            <p className="bm-note">Grey is a typical orientation dump: <span className="mono">git status</span> + <span className="mono">git log -20 --stat</span> + a diff stat. It is not equivalent information (it has no evidence, decisions or verdict); it shows the size of the cheapest alternative.</p>
          </div>
          <div className="panel" data-fade="0.1">
            <h3>Handoff size stays flat as projects grow</h3>
            <Lines xs={tk.scaling.map((r: any) => r.work_items)} series={[
              { name: "raw state.json", ys: tk.scaling.map((r: any) => r.raw_state_json), color: "#8d93a3", dash: true },
              { name: "full resume", ys: tk.scaling.map((r: any) => r.resume_full), color: "#ff4a1c" },
              { name: "resume --check", ys: tk.scaling.map((r: any) => r.gate_only), color: "#12b886" },
            ]} />
            <div className="legend"><span><i style={{ background: "#8d93a3" }} />raw state.json</span><span><i style={{ background: "#ff4a1c" }} />full resume</span><span><i style={{ background: "#12b886" }} />resume --check</span></div>
          </div>
        </div>
        <div className="panel" data-fade style={{ marginTop: 24 }}>
          <h3>Across all {tk.summary_gate.n} scenarios (cl100k tokens)</h3>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Output</th><th>Median</th><th>p90</th><th>Max</th><th>Min</th></tr></thead><tbody>
            <tr><td><span className="mono">resume --check</span></td><td className="mono">{gate.median}</td><td className="mono">{gate.p90}</td><td className="mono">{num(gate.max)}</td><td className="mono">{gate.min}</td></tr>
            <tr><td><span className="mono">resume</span> (gate + handoff)</td><td className="mono">{full.median}</td><td className="mono">{full.p90}</td><td className="mono">{num(full.max)}</td><td className="mono">{full.min}</td></tr>
          </tbody></table></div>
          <p className="bm-note">The maximum is the scenario with 1,000 new files. The gate collapses repeated findings into a count, so even that output stays small.</p>
        </div>
      </section>

      {/* ---------------- speed ---------------- */}
      <section className="bm-sec dark">
        <span className="eyebrow">04 · Speed</span>
        <h2 data-lines><span className="mask"><span>Fast enough to run</span></span><span className="mask"><span>before <span className="it">every turn.</span></span></span></h2>
        <div className="bm-cols">
          <div className="panel" data-fade>
            <h3>resume --check latency (median of 5)</h3>
            <HBars w={190} unit=" ms" color="var(--signal)" rows={speedRows.map((r: any) => ({ label: `${num(r.files)} files · ${r.dirty} uncommitted`, value: Math.round(r.resume_check_s * 1000) }))} />
            <p className="bm-note">Each call is a fresh Python process; about {ms(v1.speed.interpreter_startup_s)} of that is interpreter startup. Cost scales with uncommitted files (hashing), not repo size.</p>
          </div>
          <div className="panel" data-fade="0.1">
            <h3>Other timings</h3>
            <dl className="kv">
              <dt>save</dt><dd>{ms(speedTop.save_s)} at {num(speedTop.files)} files, {speedTop.dirty} uncommitted</dd>
              <dt>run overhead</dt><dd>{ms(speedTop.run_overhead_s)} on top of the command</dd>
              <dt>export / import</dt><dd>{ms(v2.io.export_s)} / {ms(v2.io.import_s)} with {v2.io.work_items} work items ({num(v2.io.bundle_bytes)} bytes)</dd>
              <dt>scanner</dt><dd>about {sc.corpora.python_stdlib_all.mb_per_s.toFixed(1)} MB/s</dd>
              <dt>CLI startup</dt><dd>{ms(pk.installs[0].startup_seconds)} installed from the wheel</dd>
            </dl>
          </div>
        </div>
      </section>

      {/* ---------------- scanner ---------------- */}
      <section className="bm-sec">
        <span className="eyebrow">05 · Secret scanner</span>
        <h2 data-lines><span className="mask"><span>What it catches,</span></span><span className="mask"><span>and what it <span className="it">misses.</span></span></span></h2>
        <p className="sub" data-fade>{num(covered[0][1].n)} synthetic fake secrets per format ({covered.length} formats with dedicated patterns), then {gaps.length} formats with none, then how often it fires on real code.</p>
        <div className="bm-cols">
          <div className="panel" data-fade>
            <h3>Detected and redacted: {covered.length} formats</h3>
            <div className="chips">{covered.map(([k, v]) => (<span key={k} className={`chipx2 ${v.recall === 1 ? "ok" : "no"}`}>{k.replace(/_/g, " ")} {pct(v.recall, 0)}</span>))}</div>
            <p className="bm-note">Redaction removed the secret and left nothing re-detectable in {pct(Math.min(...covered.map(([, v]) => v.redaction_clean ?? 1)), 0)} of detections.</p>
            <h3 style={{ marginTop: 30 }}>Deliberately not detected: {gaps.length} formats</h3>
            <div className="chips">{gaps.map(([k, v]) => (<span key={k} className="chipx2 no">{k.replace(/_/g, " ")} {pct(v.recall, 0)}</span>))}</div>
            <p className="bm-note">Random hex and base64 strings, UUID-style keys and short passwords are not flagged; doing so would flag hashes and IDs. The scanner is best-effort, and the README says so.</p>
          </div>
          <div className="panel" data-fade="0.1">
            <h3>Hits on real code</h3>
            <HBars w={180} color="var(--amber)" rows={Object.entries(sc.corpora).map(([k, v]: [string, any]) => ({ label: k.replace(/_/g, " "), value: v.per_million_lines, note: `${v.flagged} / ${num(v.lines)} lines` }))} />
            <p className="bm-note">Lines flagged per million lines scanned. What remains is mostly test fixtures with literal passwords, such as <span className="mono">{sc.corpora.python_stdlib_all.samples[0]?.[3]}</span>, and very long minified lines. Lockfiles produced {sc.corpora.package_lock_files.flagged} hits.</p>
          </div>
        </div>
      </section>

      {/* ---------------- reliability ---------------- */}
      <section className="bm-sec dark">
        <span className="eyebrow">06 · Reliability</span>
        <h2 data-lines><span className="mask"><span>Stable, portable,</span></span><span className="mask"><span>and <span className="it">lossless.</span></span></span></h2>
        <div className="bm-cols">
          <div className="panel" data-fade>
            <h3>Test-suite stability</h3>
            <div className="big-ok">{st.passed}<span style={{ fontSize: ".4em", color: "var(--mute-d)" }}> / {st.runs} runs</span></div>
            <p className="bm-note" style={{ marginTop: 10 }}>{st.tests_per_run} tests per run, median {st.seconds_median.toFixed(1)} s. No flaky failures.</p>
            <h3 style={{ margin: "28px 0 14px" }}>Python versions (macOS)</h3>
            <div className="tbl-wrap"><table className="tbl"><tbody>{v2.python_matrix.map((m: any) => (<tr key={m.python}><td className="mono">{m.python}</td><td>{m.passed}/{m.runs} runs passed, {m.tests} tests</td></tr>))}</tbody></table></div>
            <h3 style={{ margin: "28px 0 14px" }}>Packaging</h3>
            <dl className="kv">
              <dt>wheel</dt><dd>{num(pk.wheel_bytes)} bytes, tests excluded: {String(!pk.wheel_has_tests)}</dd>
              <dt>sdist</dt><dd>{num(pk.sdist_bytes)} bytes</dd>
              <dt>install</dt><dd>{pk.installs.map((i: any) => `${i.python.replace("Python ", "py")} ${i.install_ok ? "ok" : "failed"} (${i.install_seconds.toFixed(1)}s, ${i.version_output})`).join(" · ")}</dd>
              <dt>dependencies</dt><dd>0</dd>
            </dl>
          </div>
          <div className="panel" data-fade="0.1">
            <h3>Concurrent writers</h3>
            <HBars w={120} rows={cc.flatMap((c: any) => [{ label: `${c.workers} writers`, value: c.expected, note: `${c.expected} executed`, color: "var(--mute-d)" }, { label: "", value: c.recorded, note: `${c.recorded} recorded`, color: "var(--green)" }])} max={Math.max(...cc.map((c: any) => c.expected))} />
            <p className="bm-note">Several processes run <span className="mono">run</span> in the same repository at once. Writers take an exclusive lock around reading and writing the notes, so every executed run is recorded with a unique id and the files stay valid JSON.</p>
          </div>
        </div>
      </section>

      {/* ---------------- method ---------------- */}
      <section className="bm-sec dark">
        <span className="eyebrow">07 · Method and limits</span>
        <h2 data-lines><span className="mask"><span>Read this before</span></span><span className="mask"><span>you <span className="it">trust it.</span></span></span></h2>
        <div className="bm-cols">
          <div className="panel" data-fade><h3>What this does not prove</h3>
            <ul style={{ listStyle: "none", display: "grid", gap: 14, color: "#cfd2da", lineHeight: 1.5 }}>
              <li>It does not measure whether an AI agent finishes tasks better with ContextBridge. That needs many paid agent runs against a baseline.</li>
              <li>I wrote the scenario expectations, so they reflect my idea of correct. The fuzz oracle is independent code, but also mine.</li>
              <li>Token counts use OpenAI-style tokenizers as a proxy for Claude&apos;s.</li>
              <li>One machine (Apple M3, macOS). Linux and Windows are covered by CI for functionality, not benchmarked here.</li>
              <li>No other tool was installed or compared.</li>
            </ul>
          </div>
          <div className="panel" data-fade="0.1"><h3>Reproduce</h3>
            <pre className="mono" style={{ fontSize: 13, lineHeight: 1.8, color: "#d7dae2", whiteSpace: "pre-wrap" }}>{`git clone https://github.com/Abhinay2206/ContextBridge
cd ContextBridge-Benchmark
python3 bench.py    # speed, labeled scenarios, scanner
python3 bench2.py   # fuzz, tokens, concurrency, matrix
python3 merge.py && python3 charts.py`}</pre>
            <p className="bm-note">The harness lives in the ContextBridge-Benchmark folder next to the repo; it is not part of the shipped package.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
