import type { Metadata, Viewport } from "next";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://github.com/Abhinay2206/ContextBridge"),
  title: "ContextBridge — Context outlives the session",
  description:
    "Verified, portable, private project memory for AI coding sessions. Checkpoint real repo state, record executed tests, and let a resume gate say READY, REVIEW_REQUIRED or BLOCKED before any agent edits code.",
  openGraph: {
    title: "ContextBridge — Context outlives the session",
    description: "A resume safety gate for AI coding sessions. Local-first, zero dependencies.",
    type: "website",
  },
};
export const viewport: Viewport = { themeColor: "#ece8df" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
