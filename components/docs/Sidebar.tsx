"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DOCS, GROUPS, SEARCH } from "../../lib/docs";
import { Mark } from "../Nav";

function Search({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState(""), [sel, setSel] = useState(0), r = useRouter(), inp = useRef<HTMLInputElement>(null);
  useEffect(() => inp.current?.focus(), []);
  const hits = useMemo(() => {
    const t = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!t.length) return SEARCH.filter((e) => !e.id).slice(0, 8);
    return SEARCH.map((e) => {
      const h = e.title.toLowerCase(), b = e.text.toLowerCase();
      if (!t.every((w) => h.includes(w) || b.includes(w) || e.section.toLowerCase().includes(w))) return null;
      return { e, s: t.reduce((a, w) => a + (h.includes(w) ? 5 : 0) + (b.includes(w) ? 1 : 0), 0) };
    }).filter(Boolean).sort((a, b) => b!.s - a!.s).slice(0, 8).map((x) => x!.e);
  }, [q]);
  const go = (i: number) => { const e = hits[i]; if (e) { r.push(`/docs/${e.slug}${e.id ? "#" + e.id : ""}`); onClose(); } };
  return (
    <div className="d-modal" onMouseDown={onClose} role="dialog" aria-modal="true" aria-label="Search documentation">
      <div onMouseDown={(e) => e.stopPropagation()}>
        <input ref={inp} value={q} placeholder="Search the docs" aria-label="Search" onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, hits.length - 1)); } if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); } if (e.key === "Enter") go(sel); }} />
        <ul>{hits.length ? hits.map((e, i) => (
          <li key={e.slug + e.id}><button className={i === sel ? "on" : ""} onMouseEnter={() => setSel(i)} onClick={() => go(i)}><b>{e.title}</b><span>{e.section}</span></button></li>
        )) : <li className="none">No results for “{q}”</li>}</ul>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const path = usePathname(), [open, setOpen] = useState(false), [find, setFind] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setFind(true); } };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, []);
  return (
    <>
      <header className="d-top">
        <a className="logo" href="/" aria-label="ContextBridge home"><Mark />ContextBridge<span className="logo-skill">docs</span></a>
        <button className="d-menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
      </header>
      <aside className={`d-side${open ? " open" : ""}`} aria-label="Documentation">
        <a className="logo d-logo" href="/" aria-label="ContextBridge home"><Mark />ContextBridge<span className="logo-skill">docs</span></a>
        <button className="d-search" onClick={() => setFind(true)}><span>Search</span><kbd>⌘K</kbd></button>
        {GROUPS.map((g) => (
          <nav key={g} aria-label={g}>
            <p>{g}</p>
            <ul>{DOCS.filter((d) => d.group === g).map((d) => <li key={d.slug}><a href={`/docs/${d.slug}`} className={path === `/docs/${d.slug}` ? "on" : ""} aria-current={path === `/docs/${d.slug}` ? "page" : undefined}>{d.title}</a></li>)}</ul>
          </nav>
        ))}
        <nav aria-label="More"><p>More</p><ul><li><a href="/benchmark">Benchmark report</a></li><li><a href="https://github.com/Abhinay2206/ContextBridge" target="_blank" rel="noreferrer">GitHub ↗</a></li></ul></nav>
      </aside>
      {find && <Search onClose={() => setFind(false)} />}
    </>
  );
}
