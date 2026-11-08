import { useSite } from "@/lib/site";
import { Reveal, Eyebrow, MaskedLines } from "@/components/Reveal";
import JourneyTimeline from "@/components/sections/JourneyTimeline";
import SectionHead from "@/components/sections/SectionHead";
import ContactCta from "@/components/sections/ContactCta";
import Seo from "@/components/Seo";

export default function Journey() {
  const { t, data } = useSite();
  return (
    <div data-testid="page-journey" className="pt-16">
      <Seo title={t("nav.journey")} description={t("journey.intro")} />
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal><Eyebrow>{t("journey.label")}</Eyebrow></Reveal>
        <MaskedLines lines={[t("journey.title")]} className="mt-6"
          lineClassName="font-display text-3xl font-bold leading-tight text-white sm:text-5xl" />
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-muted">{t("journey.intro")}</p>
        </Reveal>

        <div className="mt-16 rounded-3xl border border-brand-line bg-zinc-950/60 p-8 sm:p-12">
          <JourneyTimeline milestones={data?.milestones} />
        </div>

        <Reveal delay={0.2}>
          <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-600">
            {t("journey.current")} — {data?.milestones?.[data.milestones.length - 1]?.title || ""}
          </p>
        </Reveal>
      </section>
      <ContactCta />
    </div>
  );
}
