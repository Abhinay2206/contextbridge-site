"use client";
import { useState } from "react";

export default function CopyMd({ md }: { md: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(md); setDone(true); setTimeout(() => setDone(false), 1500); } catch {} };
  return <button className="d-btn" onClick={copy}>{done ? "Copied ✓" : "Copy Markdown"}</button>;
}
