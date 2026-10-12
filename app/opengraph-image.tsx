import { ImageResponse } from "next/og";
export const alt = "ContextBridge: Context outlives the session.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#ece8df", color: "#0c0e13", fontFamily: "Georgia, serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 700 }}>
          <svg width="76" height="48" viewBox="0 0 76 48"><path d="M4 40H72" stroke="#0c0e13" strokeWidth="4" strokeLinecap="round" /><path d="M4 40Q38 -6 72 40" fill="none" stroke="#ff4a1c" strokeWidth="4.5" strokeLinecap="round" /><circle cx="4" cy="40" r="5" fill="#0c0e13" /><circle cx="72" cy="40" r="5" fill="#ff4a1c" /></svg>
          ContextBridge skill
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 128, lineHeight: 0.94, letterSpacing: -4 }}>
          <span>Context</span><span style={{ color: "#ff4a1c", fontStyle: "italic" }}>outlives</span><span>the session.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, fontFamily: "Helvetica, Arial, sans-serif", color: "#5a5f6c" }}>
          <span>The ContextBridge skill: a resume safety gate for AI coding sessions</span><span style={{ color: "#0c0e13", fontWeight: 700 }}>READY · REVIEW_REQUIRED · BLOCKED</span>
        </div>
      </div>
    ),
    size,
  );
}
