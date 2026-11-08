import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSite } from "@/lib/site";
import { Reveal, Eyebrow, MaskedLines } from "@/components/Reveal";
import Seo from "@/components/Seo";
import GlowBg from "@/components/GlowBg";

const VISION_IMG = "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?crop=entropy&cs=srgb&fm=jpg&q=85";

export default function Vision() {
  const { t } = useSite();
  return (
    <div data-testid="page-vision" className="pt-16">
      <Seo title={t("nav.vision")} description={t("vision.title")} />
      <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
        <img src={VISION_IMG} alt="Abstract neural sphere with node connections" className="absolute inset-0 h-full w-full object-cover opacity-25" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black" />
        <GlowBg opacity={0.6} />
        <div className="relative mx-auto w-full max-w-5xl px-5 py-24 text-center sm:px-8">
          <Reveal><Eyebrow>{t("vision.label")}</Eyebrow></Reveal>
          <MaskedLines
            lines={[t("vision.title")]}
            className="mt-8"
            lineClassName="font-display text-2xl font-bold leading-snug text-white sm:text-4xl lg:text-5xl"
            delay={0.15}
          />
          <Reveal delay={0.4}>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-300">{t("vision.body")}</p>
          </Reveal>
          <Reveal delay={0.5}>
            <div className="mx-auto mt-12 h-px w-32 bg-gradient-to-r from-brand-blue to-brand-purple" />
          </Reveal>
          <Reveal delay={0.55}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/mission" data-testid="vision-cta-mission" className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-black transition-all hover:bg-blue-500 hover:text-white">
                {t("nav.mission")} <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
              </Link>
              <Link to="/philosophy" data-testid="vision-cta-philosophy" className="inline-flex h-12 items-center rounded-full border border-white/25 px-7 text-sm text-white glass transition-colors hover:border-blue-400/60">
                {t("nav.philosophy")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
