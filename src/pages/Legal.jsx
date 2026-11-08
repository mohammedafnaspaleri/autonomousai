import { useSite } from "@/lib/site";
import { Reveal, Eyebrow } from "@/components/Reveal";
import Seo from "@/components/Seo";

const TITLES = {
  "legal.privacy": "footer.privacy",
  "legal.terms": "footer.terms",
  "legal.cookies": "footer.cookies",
  "legal.disclaimer": "footer.disclaimer",
};

export default function Legal({ kind }) {
  const { t, data } = useSite();
  const title = t(TITLES[kind] || kind);
  const sections = data?.legal?.[kind] || [];
  return (
    <div data-testid={`page-${kind.replace("legal.", "")}`} className="pt-16">
      <Seo title={title} />
      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal><Eyebrow>AUTONOMOUS // LEGAL</Eyebrow></Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-5 font-display text-3xl font-bold text-white sm:text-5xl" data-testid="legal-title">{title}</h1>
        </Reveal>
        <div className="mt-12 space-y-10" data-testid="legal-sections">
          {sections.map(([heading, body], i) => (
            <Reveal key={i} delay={i * 0.04}>
              <article>
                <h2 className="font-display text-lg font-semibold text-white sm:text-xl">{heading}</h2>
                <p className="mt-3 leading-relaxed text-brand-muted">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
