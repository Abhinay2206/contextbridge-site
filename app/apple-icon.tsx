import { ImageResponse } from "next/og";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0c0e13" }}>
        <svg width="132" height="84" viewBox="0 0 76 48"><path d="M4 40H72" stroke="#ece8df" strokeWidth="4" strokeLinecap="round" /><path d="M4 40Q38 -6 72 40" fill="none" stroke="#ff4a1c" strokeWidth="5" strokeLinecap="round" /><circle cx="4" cy="40" r="5" fill="#ece8df" /><circle cx="72" cy="40" r="5" fill="#ece8df" /></svg>
      </div>
    ),
    size,
  );
}
