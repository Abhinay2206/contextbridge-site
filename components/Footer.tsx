import { REPO } from "./Nav";
import { TOOL_VERSION } from "../lib/site";
export const ORVANTIA = "https://www.orvantia.in";
const LIM = ["It does not copy chat history, account memory or usage allowance.", "A passing test proves a command succeeded, not that the software is correct.", "It cannot see a remote you have not fetched. Run git fetch first.", "The secret scanner is best-effort. Review every diff before sharing."];
export default function Footer() {
  return (
    <footer className="dark">
      <div className="limits">
        <h3 data-lines><span className="mask"><span>What it</span></span><span className="mask"><span><span className="it" style={{ color: "var(--signal)" }}>won&apos;t</span> do.</span></span></h3>
        <ul>{LIM.map((l) => (<li key={l} data-fade>{l}</li>))}</ul>
      </div>
      <a className="orv" href={ORVANTIA} target="_blank" rel="noreferrer" data-cursor aria-label="Visit Orvantia, opens in a new tab">
        <img src="/orvantia.webp" alt="" width={315} height={192} loading="lazy" decoding="async" />
        <div className="orv-copy">
          <span className="orv-k">Developed by</span>
          <strong>Orvantia</strong>
          <p>Software &amp; automation for growing businesses. Orvantia helps small teams replace diaries, spreadsheets and WhatsApp follow-ups with automation, SaaS and custom software their teams actually use.</p>
        </div>
        <span className="orv-go">Visit orvantia.in <i>↗</i></span>
      </a>
      <div className="foot">
        <div className="foot-top">
          <span>Preserve the state of the work, not just the story of the conversation.</span>
          <nav><a href={REPO} target="_blank" rel="noreferrer">GitHub</a><a href="https://pypi.org/project/contextbridge-cli/" target="_blank" rel="noreferrer">PyPI</a><a href={`${REPO}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer">Changelog</a><a href={`${REPO}/blob/main/SECURITY.md`} target="_blank" rel="noreferrer">Security</a></nav>
        </div>
        <div className="foot-word" aria-hidden>Context<span className="it">Bridge</span></div>
        <div className="foot-bot"><span>Built by Abhinay · Developed by <a href={ORVANTIA} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>Orvantia</a></span><span>MIT License · v{TOOL_VERSION}</span></div>
      </div>
    </footer>
  );
}
