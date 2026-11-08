import { Link } from "react-router-dom";
import { ArrowRight, ListChecks, Compass, Wrench, Telescope } from "lucide-react";
import { useSite } from "@/lib/site";
import { Reveal, Eyebrow, MaskedLines } from "@/components/Reveal";
import SectionHead from "@/components/sections/SectionHead";
import Seo from "@/components/Seo";
import GlowBg from "@/components/GlowBg";

const ABOUT_IMG = "https://images.unsplash.com/photo-1669829691116-1d1b367aaa59?crop=entropy&cs=srgb&fm=jpg&q=85";

export default function About() {
  const { t } = useSite();
  const problems = t("about.problems") || [];
  return (
    <div data-testid="page-about" className="pt-16">
      <Seo title={t("nav.about")} description={t("about.p1")} />
      <section className="relative overflow-hidden">
        <GlowBg opacity={0.5} />
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal><Eyebrow>{t("about.label")}</Eyebrow></Reveal>
          <MaskedLines lines={[t("about.title")]} className="mt-6 max-w-4xl"
            lineClassName="font-display text-3xl font-bold leading-tight text-white sm:text-5xl" />
          <Reveal delay={0.2}>
            <div className="relative mt-14 overflow-hidden rounded-2xl border border-brand-line">
              <img src={ABOUT_IMG} alt="Futuristic blue and purple light corridor" className="h-64 w-full object-cover opacity-70 sm:h-80" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <p className="absolute bottom-5 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-300">{t("hero.building")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-24 sm:px-8" data-testid="about-narrative">
        {[t("about.p1"), t("about.p2"), t("about.p3"), t("about.p4")].map((p, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <p className="mb-8 text-lg leading-relaxed text-zinc-300">{p}</p>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32" data-testid="about-pillars">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { Icon: ListChecks, title: t("about.problems_title"), body: problems },
            { Icon: Compass, title: t("about.approach_title"), body: [t("about.approach_body")] },
            { Icon: Telescope, title: t("about.direction_title"), body: [t("about.p4")] },
          ].map((col, i) => (
            <Reveal key={i} delay={i * 0.08} className="h-full">
              <article className="h-full rounded-2xl border border-brand-line bg-zinc-950/70 p-7" data-testid={`about-pillar-${i + 1}`}>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-line bg-zinc-900 text-blue-400">
                  <col.Icon size={19} strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">{col.title}</h3>
                <ul className="mt-4 space-y-3">
                  {col.body.map((b, j) => (
                    <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-brand-muted">
                      <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-brand-blue" />{b}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div className="mt-14 flex flex-wrap justify-center gap-4">
            <Link to="/vision" data-testid="about-cta-vision" className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-black transition-all hover:bg-blue-500 hover:text-white">
              {t("hero.cta_primary")} <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
            </Link>
            <Link to="/journey" data-testid="about-cta-journey" className="inline-flex h-12 items-center rounded-full border border-brand-linestrong px-7 text-sm text-zinc-200 transition-colors hover:border-blue-500/60 hover:text-white">
              {t("nav.journey")}
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
