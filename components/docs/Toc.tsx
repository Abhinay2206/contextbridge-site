"use client";
import { useEffect, useState } from "react";

export default function Toc({ items }: { items: { id: string; text: string }[] }) {
  const [cur, setCur] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    const on = () => { let a = els[0]?.id; for (const e of els) if (e.getBoundingClientRect().top < 120) a = e.id; setCur(a); };
    on(); addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, [items]);
  if (!items.length) return <aside className="d-toc" />;
  return (
    <aside className="d-toc" aria-label="On this page">
      <p>On this page</p>
      <ul>{items.map((h) => <li key={h.id}><a href={`#${h.id}`} className={cur === h.id ? "on" : ""}>{h.text}</a></li>)}</ul>
    </aside>
  );
}
