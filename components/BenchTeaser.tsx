import { v2, speedTop, allScenarios, scenarioPass, num, pct } from "../lib/bench";
export default function BenchTeaser() {
  const fz = v2.fuzz, g = v2.tokens.summary_gate;
  return (
    <section className="teaser">
      <span className="eyebrow" style={{ color: "var(--mute)" }}>Benchmarks</span>
      <h2 data-lines style={{ marginTop: 28 }}><span className="mask"><span>Tested, then</span></span><span className="mask"><span><span className="it">measured.</span></span></span></h2>
      <div className="teaser-row">
        <div className="teaser-stats">
          <div data-fade><b>{scenarioPass}<small style={{ fontSize: ".45em", color: "var(--mute)" }}>/{allScenarios.length}</small></b><span>labeled drift scenarios behave as expected</span></div>
          <div data-fade="0.08"><b>{pct(fz.agreement, 1)}</b><span>agreement with an independent oracle over {num(fz.trials)} random git histories</span></div>
          <div data-fade="0.16"><b>{g.median}</b><span>median tokens for a resume check</span></div>
          <div data-fade="0.24"><b>{Math.round(speedTop.resume_check_s * 1000)}<small style={{ fontSize: ".45em", color: "var(--mute)" }}>ms</small></b><span>for {num(speedTop.files)} files</span></div>
        </div>
        <a className="pill solid" href="/benchmark" data-magnet>Read the full report →</a>
      </div>
    </section>
  );
}
