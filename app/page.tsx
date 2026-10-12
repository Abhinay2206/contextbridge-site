import Motion from "../components/Motion";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Showreel from "../components/Showreel";
import Statement from "../components/Statement";
import Gate from "../components/Gate";
import Numbers from "../components/Numbers";
import Flow from "../components/Flow";
import Provenance from "../components/Provenance";
import Bento from "../components/Bento";
import BenchTeaser from "../components/BenchTeaser";
import Install from "../components/Install";
import Footer from "../components/Footer";
import { DESCRIPTION, TOOL_VERSION, PYPI_URL, REPO_URL, SITE_NAME, SITE_URL, ld } from "../lib/site";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": `${SITE_URL}/#site`, url: SITE_URL, name: SITE_NAME, description: DESCRIPTION, inLanguage: "en" },
    { "@type": "SoftwareApplication", "@id": `${SITE_URL}/#app`, name: "ContextBridge", alternateName: ["ContextBridge skill", "ContextBridge Claude skill"], applicationCategory: "DeveloperApplication", operatingSystem: "macOS, Linux, Windows", description: DESCRIPTION,
      url: SITE_URL, downloadUrl: PYPI_URL, codeRepository: REPO_URL, license: "https://opensource.org/licenses/MIT", softwareRequirements: "Python 3.9 or newer, Git", softwareVersion: TOOL_VERSION, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Person", name: "Abhinay", url: "https://github.com/Abhinay2206" }, publisher: { "@type": "Organization", name: "Orvantia", url: "https://www.orvantia.in" } },
  ],
};

export default function Page() {
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(JSON_LD) }} />
      <Motion /><Nav />
      <Hero /><Marquee /><Showreel /><Statement />
      <Gate /><Numbers /><Flow /><Provenance /><BenchTeaser /><Bento /><Install /><Footer />
    </main>
  );
}
