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

export default function Page() {
  return (
    <main>
      <Motion /><Nav />
      <Hero /><Marquee /><Showreel /><Statement />
      <Gate /><Numbers /><Flow /><Provenance /><BenchTeaser /><Bento /><Install /><Footer />
    </main>
  );
}
