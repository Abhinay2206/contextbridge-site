import type { Metadata, Viewport } from "next";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { DESCRIPTION, REPO_URL, SITE_NAME, SITE_URL, TAGLINE } from "../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: ${TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Abhinay", url: "https://github.com/Abhinay2206" }],
  creator: "Abhinay",
  publisher: "Orvantia",
  category: "technology",
  keywords: ["AI coding agent", "session handoff", "Claude Code", "context management", "git drift detection", "resume gate", "developer tools", "open source", "MIT", "Python CLI", "ContextBridge"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { type: "website", siteName: SITE_NAME, url: "/", title: `${SITE_NAME}: ${TAGLINE}`, description: DESCRIPTION, locale: "en_US" },
  twitter: { card: "summary_large_image", title: `${SITE_NAME}: ${TAGLINE}`, description: DESCRIPTION },
  formatDetection: { telephone: false, email: false, address: false },
  other: { "code-repository": REPO_URL },
};
export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ece8df" }, { media: "(prefers-color-scheme: dark)", color: "#0c0e13" }], width: "device-width", initialScale: 1, colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
