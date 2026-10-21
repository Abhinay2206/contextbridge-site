export const REPO = "https://github.com/Abhinay2206/ContextBridge";
export function Mark() {
  return (
    <svg viewBox="0 0 76 48" fill="none" aria-hidden>
      <path d="M4 40H72" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M4 40Q38 -6 72 40" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="4" cy="40" r="5" fill="currentColor" /><circle cx="72" cy="40" r="5" fill="currentColor" />
    </svg>
  );
}
export default function Nav({ base = "" }: { base?: string }) {
  return (
    <header className="nav">
      <a className="logo" href={base ? "/" : "#top"} aria-label="ContextBridge home"><Mark />ContextBridge<span className="logo-skill">skill</span></a>
      <nav className="nav-links">
        <a href={`${base}#watch`}>Watch</a><a href={`${base}#gate`}>The gate</a><a href={`${base}#how`}>How it works</a><a href="/docs/quick-start">Docs</a><a href="/benchmark">Benchmarks</a><a href={`${base}#install`}>Install</a>
        <a className="nav-gh" href={REPO} target="_blank" rel="noreferrer" data-magnet>GitHub ↗</a>
      </nav>
    </header>
  );
}
