import { Link } from "react-router-dom";
import { useSite } from "@/lib/site";
import { Reveal, Eyebrow, MaskedLines } from "@/components/Reveal";
import MissionGrid from "@/components/sections/MissionGrid";
import SectionHead from "@/components/sections/SectionHead";
import Seo from "@/components/Seo";

export default function Mission() {
  const { t } = useSite();
  return (
    <div data-testid="page-mission" className="pt-16">
      <Seo title={t("nav.mission")} description={t("mission.intro")} />
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal><Eyebrow>{t("mission.label")}</Eyebrow></Reveal>
        <MaskedLines lines={[t("mission.title")]} className="mt-6 max-w-3xl"
          lineClassName="font-display text-3xl font-bold leading-tight text-white sm:text-5xl" />
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-muted">{t("mission.intro")}</p>
        </Reveal>
        <div className="mt-14"><MissionGrid /></div>
        <Reveal delay={0.15}>
          <div className="mt-16 rounded-2xl border border-brand-line bg-zinc-950/70 p-8 sm:p-10" data-testid="mission-quote">
            <p className="font-display text-lg font-medium leading-relaxed text-zinc-100 sm:text-2xl">
              "{t("philosophy.quote")}"
            </p>
            <Link to="/philosophy" data-testid="mission-philosophy-link" className="mt-6 inline-block text-sm font-medium text-blue-400 hover:text-blue-300">
              {t("nav.philosophy")} →
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
