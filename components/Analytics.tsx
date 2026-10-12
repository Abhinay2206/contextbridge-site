"use client";
import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const KEY = "cb-analytics-consent";
type Choice = "granted" | "denied" | null;

declare global { interface Window { dataLayer: unknown[]; gtag: (...a: unknown[]) => void } }

/** Google Analytics 4, opt-in. Renders nothing unless NEXT_PUBLIC_GA_ID is set at build time.
 *  Consent Mode starts as "denied" (no analytics cookies) and only switches to "granted" after the visitor accepts. */
export default function Analytics() {
  const [choice, setChoice] = useState<Choice>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    try { const v = localStorage.getItem(KEY); if (v === "granted" || v === "denied") setChoice(v); } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (GA_ID && choice && window.gtag) window.gtag("consent", "update", { analytics_storage: choice });
  }, [choice]);

  if (!GA_ID) return null;
  const decide = (c: "granted" | "denied") => { try { localStorage.setItem(KEY, c); } catch {} setChoice(c); };

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        var saved = null; try { saved = localStorage.getItem("${KEY}"); } catch (e) {}
        gtag('consent', 'default', { analytics_storage: saved === 'granted' ? 'granted' : 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });
      `}</Script>
      {ready && choice === null && (
        <div className="consent" role="dialog" aria-label="Analytics consent">
          <p>This site can use Google Analytics to count visits. It is off unless you accept, and nothing else tracks you.</p>
          <div>
            <button className="pill ghost" onClick={() => decide("denied")}>Decline</button>
            <button className="pill solid" onClick={() => decide("granted")}>Accept</button>
          </div>
        </div>
      )}
    </>
  );
}
