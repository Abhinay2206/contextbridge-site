import { v2, speedTop, allScenarios, scenarioPass } from "../lib/bench";
const N = [
  { v: Math.round(speedTop.resume_check_s * 1000), u: "ms", l: `to check a repo with ${speedTop.files.toLocaleString("en-US")} files and ${speedTop.dirty} uncommitted changes` },
  { v: scenarioPass, u: `/${allScenarios.length}`, l: "labeled drift scenarios behave as expected; the misses are listed in the benchmark" },
  { v: 0, u: "", l: "network calls. No server, no account, no telemetry" },
  { v: 0, u: "", l: "runtime dependencies. Python standard library and git" },
];
export default function Numbers() {
  return (
    <div className="nums dark">
      {N.map((n, i) => (
        <div className="num-cell" key={i} data-fade={i * 0.08}><b><span data-count={n.v}>0</span>{n.u}</b><span>{n.l}</span></div>
      ))}
    </div>
  );
}
