import { ImageResponse } from "next/og";
export const alt = "ContextBridge benchmark report: measured, not claimed.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0c0e13", color: "#ece8df", fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 26, fontFamily: "Helvetica, Arial, sans-serif", letterSpacing: 6, color: "#8d93a3" }}>CONTEXTBRIDGE · BENCHMARK REPORT</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, lineHeight: 0.92, letterSpacing: -5 }}>
          <span>Measured,</span><span>not <span style={{ color: "#ff4a1c", fontStyle: "italic", marginLeft: 28 }}>claimed.</span></span>
        </div>
        <div style={{ display: "flex", gap: 56, fontSize: 28, fontFamily: "Helvetica, Arial, sans-serif", color: "#cfd2da" }}>
          <span>86 scenarios</span><span>800 random trials</span><span>65-token resume check</span>
        </div>
      </div>
    ),
    size,
  );
}
