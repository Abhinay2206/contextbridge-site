import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DOCS, bySlug, headings, toMarkdown } from "../../../lib/docs";
import { Blocks, Inline } from "../../../components/docs/Render";
import Toc from "../../../components/docs/Toc";
import CopyMd from "../../../components/docs/CopyMd";
import { SITE_URL, ld } from "../../../lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => DOCS.map((d) => ({ slug: d.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = bySlug((await params).slug);
  if (!d) return {};
  return { title: `${d.title} | Docs`, description: d.lead, alternates: { canonical: `/docs/${d.slug}` }, openGraph: { type: "article", url: `/docs/${d.slug}`, title: `${d.title} | ContextBridge skill docs`, description: d.lead } };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const d = bySlug((await params).slug);
  if (!d) notFound();
  const i = DOCS.indexOf(d), prev = DOCS[i - 1], next = DOCS[i + 1];
  const ldj = { "@context": "https://schema.org", "@type": "TechArticle", headline: d.title, description: d.lead, url: `${SITE_URL}/docs/${d.slug}`, author: { "@type": "Person", name: "Abhinay" }, publisher: { "@type": "Organization", name: "Orvantia", url: "https://www.orvantia.in" } };
  return (
    <div className="d-main">
      <main id="main" className="d-article">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(ldj) }} />
        <p className="d-crumb">{d.group}</p>
        <div className="d-head"><h1>{d.title}</h1><CopyMd md={toMarkdown(d)} /></div>
        <p className="d-lead"><Inline x={d.lead} /></p>
        <Blocks blocks={d.blocks} />
        <nav className="d-pn" aria-label="Previous and next">
          {prev ? <a href={`/docs/${prev.slug}`}><span>Previous</span>{prev.title}</a> : <i />}
          {next ? <a href={`/docs/${next.slug}`} className="r"><span>Next</span>{next.title}</a> : <i />}
        </nav>
      </main>
      <Toc items={headings(d)} />
    </div>
  );
}
