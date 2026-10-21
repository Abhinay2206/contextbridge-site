import { Fragment } from "react";
import type { Block } from "../../lib/docs";
import { slugify } from "../../lib/docs";
import CodeBlock from "./CodeBlock";

const TOK = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
export function Inline({ x }: { x: string }) {
  return (
    <>
      {x.split(TOK).map((s, i) => {
        if (s.startsWith("`")) return <code key={i}>{s.slice(1, -1)}</code>;
        if (s.startsWith("**")) return <strong key={i}>{s.slice(2, -2)}</strong>;
        const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(s);
        if (m) { const ext = m[2].startsWith("http"); return <a key={i} href={m[2]} {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}>{m[1]}{ext ? " ↗" : ""}</a>; }
        return <Fragment key={i}>{s}</Fragment>;
      })}
    </>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "p": return <p key={i}><Inline x={b.x} /></p>;
          case "h2": return <h2 key={i} id={slugify(b.x)}><a href={`#${slugify(b.x)}`}>{b.x}</a></h2>;
          case "h3": return <h3 key={i} id={slugify(b.x)}>{b.x}</h3>;
          case "ul": return <ul key={i}>{b.x.map((l, j) => <li key={j}><Inline x={l} /></li>)}</ul>;
          case "ol": return <ol key={i}>{b.x.map((l, j) => <li key={j}><Inline x={l} /></li>)}</ol>;
          case "code": return <CodeBlock key={i} code={b.x} lang={b.lang} />;
          case "note": return <aside key={i} className={`d-note ${b.k}`}><b>{b.k === "warn" ? "Warning" : "Note"}</b><p><Inline x={b.x} /></p></aside>;
          case "table": return (
            <div key={i} className="d-table"><table>
              <thead><tr>{b.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}><Inline x={c} /></td>)}</tr>)}</tbody>
            </table></div>
          );
          case "steps": return (
            <ol key={i} className="d-steps">
              {b.items.map((s, j) => (
                <li key={j}><span className="d-n" aria-hidden>{j + 1}</span><div><h3>{s.title}</h3><Blocks blocks={s.body} /></div></li>
              ))}
            </ol>
          );
        }
      })}
    </>
  );
}
