"use client";
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="err">
      <p className="eyebrow">Something broke</p>
      <h1>That didn&apos;t <span className="it">load.</span></h1>
      <p>An unexpected error occurred while rendering this page. Trying again usually fixes it.</p>
      <button className="pill solid" onClick={reset}>Try again</button>
    </main>
  );
}
