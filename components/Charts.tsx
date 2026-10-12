/* Server-rendered, dependency-free charts. Bars animate in via [data-bar] (see Motion.tsx). */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function HBars({ rows, max, unit = "", color = "var(--signal)", w = 150 }: { rows: { label: string; value: number; note?: string; color?: string }[]; max?: number; unit?: string; color?: string; w?: number }) {
  const m = max ?? Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="hbars" style={{ ["--lw" as any]: `${w}px` }}>
      {rows.map((r) => (
        <div className="hbar" key={r.label}>
          <span className="hl">{r.label}</span>
          <span className="ht"><i data-bar={(r.value / m) * 100} style={{ background: r.color || color, width: `${(r.value / m) * 100}%` }} /></span>
          <span className="hv">{r.note ?? `${r.value}${unit}`}</span>
        </div>
      ))}
    </div>
  );
}

export function Stack({ rows }: { rows: [string, { pass: number; total: number }][] }) {
  return (
    <div className="hbars" style={{ ["--lw" as any]: "190px" }}>
      {rows.map(([f, v]) => (
        <div className="hbar" key={f}>
          <span className="hl">{f}</span>
          <span className="ht">
            <i data-bar={(v.pass / 30) * 100} style={{ background: "var(--green)", width: `${(v.pass / 30) * 100}%` }} />
            {v.total > v.pass && <i data-bar={((v.total - v.pass) / 30) * 100} className="miss" style={{ width: `${((v.total - v.pass) / 30) * 100}%` }} />}
          </span>
          <span className="hv">{v.pass}/{v.total}</span>
        </div>
      ))}
    </div>
  );
}

/** log-scale line chart: x = work items, series of token counts */
export function Lines({ xs, series }: { xs: number[]; series: { name: string; ys: number[]; color: string; dash?: boolean }[] }) {
  const W = 760, H = 330, L = 64, R = 24, T = 20, Bm = 46;
  const lx = (x: number) => L + ((Math.log10(x) - Math.log10(xs[0])) / (Math.log10(xs[xs.length - 1]) - Math.log10(xs[0]))) * (W - L - R);
  const ymax = Math.max(...series.flatMap((s) => s.ys)), ymin = 100;
  const ly = (y: number) => T + (1 - (Math.log10(Math.max(y, ymin)) - Math.log10(ymin)) / (Math.log10(ymax) - Math.log10(ymin))) * (H - T - Bm);
  const ticks = [100, 1000, 10000, 100000].filter((t) => t <= ymax * 1.2);
  return (
    <svg className="lines" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Token count versus number of work items">
      {ticks.map((t) => (<g key={t}><line x1={L} x2={W - R} y1={ly(t)} y2={ly(t)} stroke="currentColor" strokeOpacity=".12" /><text x={L - 10} y={ly(t) + 4} textAnchor="end" fontSize="12" fill="currentColor" opacity=".6" fontFamily="var(--mono)">{t >= 1000 ? `${t / 1000}k` : t}</text></g>))}
      {xs.map((x) => (<text key={x} x={lx(x)} y={H - 18} textAnchor="middle" fontSize="12" fill="currentColor" opacity=".6" fontFamily="var(--mono)">{x}</text>))}
      <text x={(W + L) / 2} y={H - 2} textAnchor="middle" fontSize="11" fill="currentColor" opacity=".5" fontFamily="var(--mono)" letterSpacing="2">WORK ITEMS RECORDED (LOG)</text>
      {series.map((s) => (<g key={s.name}>
        <polyline points={s.ys.map((y, i) => `${lx(xs[i])},${ly(y)}`).join(" ")} fill="none" stroke={s.color} strokeWidth="3" strokeDasharray={s.dash ? "6 6" : undefined} strokeLinejoin="round" />
        {s.ys.map((y, i) => (<circle key={i} cx={lx(xs[i])} cy={ly(y)} r="4.5" fill={s.color} />))}
      </g>))}
    </svg>
  );
}

export function Matrix({ confusion }: { confusion: Record<string, number> }) {
  const V = ["READY", "REVIEW_REQUIRED", "BLOCKED"];
  const tot = Object.values(confusion).reduce((a, b) => a + b, 0);
  return (
    <div className="matrix" role="table" aria-label="Oracle versus tool verdicts">
      <div className="mx-h" />
      {V.map((v) => (<div className="mx-h" key={v}>tool: {v}</div>))}
      {V.map((o) => (<div key={o} style={{ display: "contents" }}>
        <div className="mx-h r">oracle: {o}</div>
        {V.map((t) => { const c = confusion[`${o}->${t}`] || 0; const diag = o === t; return (<div key={t} className={`mx-c${diag ? " d" : c ? " x" : ""}`} style={{ ["--a" as any]: Math.min(1, 0.14 + c / tot * 2.4) }}><b>{c}</b></div>); })}
      </div>))}
    </div>
  );
}
