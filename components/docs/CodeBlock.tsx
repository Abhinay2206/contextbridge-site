"use client";
import { useState } from "react";

export default function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(code); setDone(true); setTimeout(() => setDone(false), 1500); } catch {} };
  return (
    <div className="d-code">
      <div><span>{lang || "text"}</span><button onClick={copy} aria-label="Copy code">{done ? "Copied" : "Copy"}</button></div>
      <pre><code>{code}</code></pre>
    </div>
  );
}
