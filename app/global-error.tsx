"use client";
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#ece8df", color: "#0c0e13", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 40, margin: "0 0 12px" }}>Something went wrong.</h1>
          <button onClick={reset} style={{ padding: "12px 22px", borderRadius: 999, border: 0, background: "#0c0e13", color: "#ece8df", fontSize: 16, cursor: "pointer" }}>Reload</button>
        </div>
      </body>
    </html>
  );
}
