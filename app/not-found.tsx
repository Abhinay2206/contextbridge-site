import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="err">
      <p className="eyebrow">404</p>
      <h1>This page <span className="it">moved.</span></h1>
      <p>The link may be old, or the page never existed. The gate is still READY.</p>
      <Link className="pill solid" href="/">Back to the start →</Link>
    </main>
  );
}
