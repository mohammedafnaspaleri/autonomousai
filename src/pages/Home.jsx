import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { useSite } from "@/lib/site";
import { Reveal, MaskedLines, Eyebrow } from "@/components/Reveal";
import NetworkCanvas from "@/components/NetworkCanvas";
import Marquee from "@/components/Marquee";
import SectionHead from "@/components/sections/SectionHead";
import GlowBg from "@/components/GlowBg";
import MissionGrid from "@/components/sections/MissionGrid";
import ExploringGrid from "@/components/sections/ExploringGrid";
import JourneyTimeline from "@/components/sections/JourneyTimeline";
import FaqAccordion from "@/components/sections/FaqAccordion";
import ContactCta from "@/components/sections/ContactCta";
import ConstructionScene from "@/components/ConstructionScene";
import ComingSoonModal from "@/components/ComingSoonModal";

const HERO_IMG = "https://images.unsplash.com/photo-1689443111130-6e9c7dfd8f9e?crop=entropy&cs=srgb&fm=jpg&q=85";
const VISION_IMG = "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?crop=entropy&cs=srgb&fm=jpg&q=85";

export default function Home() {
  const { t, data } = useSite();
  const [modal, setModal] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const yOrb = useTransform(scrollY, [0, 800], [0, 140]);
  const yImg = useTransform(scrollY, [0, 800], [0, -60]);

  return (
    <div data-testid="page-home">
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden" data-testid="hero-section">
        <NetworkCanvas nodeCount={44} />
        <GlowBg opacity={1} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,black)]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-32 sm:px-8">
          <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
          </motion.div>

          <h1 className="mt-6" data-testid="hero-title">
            <MaskedLines
              lines={["The future of", "intelligence is", "taking shape."]}
              lineClassName="font-display text-[2.6rem] font-bold leading-[1.04] tracking-tight text-white dark:text-gradient sm:text-6xl lg:text-[5.2rem]"
              delay={0.25}
            />
          </h1>

          <div className="mt-9 grid gap-10 lg:grid-cols-12 lg:items-end">
            <motion.div className="lg:col-span-7" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.85 }}>
              <p className="max-w-xl text-lg leading-relaxed text-brand-muted sm:text-xl">{t("hero.intro")}</p>
              <p className="mt-4 max-w-xl font-display text-sm font-medium text-white sm:text-base">{t("hero.believe")}</p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link to="/vision" data-testid="hero-primary-cta"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple px-7 text-sm font-semibold text-white transition-all hover:shadow-[0_0_36px_rgba(99,102,241,0.55)]">
                  {t("hero.cta_primary")}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
                </Link>
                <Link to="/product" data-testid="hero-secondary-cta"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-brand-linestrong px-7 text-sm font-medium text-zinc-200 transition-colors hover:border-blue-500/60 hover:text-white">
                  {t("hero.cta_secondary")}
                </Link>
              </div>
            </motion.div>

            <motion.div className="hidden lg:col-span-5 lg:block" style={{ y: reduce ? 0 : yImg }} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.9 }}>
              <div className="relative overflow-hidden rounded-2xl border border-brand-line">
                <img src={HERO_IMG} alt="Abstract blue and purple light architecture" className="h-[320px] w-full object-cover opacity-80" loading="eager" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <p className="absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-300">{t("hero.building")}</p>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-16 flex items-center gap-3 text-zinc-600">
            <ArrowDown size={14} className="animate-bounce" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]">{t("hero.scroll")}</span>
          </motion.div>
        </div>
      </section>

      <Marquee />

      {/* ============ ABOUT ============ */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32" data-testid="home-about">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <Eyebrow>{t("about.label")}</Eyebrow>
                <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-white sm:text-4xl">{t("about.title")}</h2>
                <Link to="/about" data-testid="home-about-link" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300">
                  {t("nav.about")} <ArrowRight size={14} className="rtl:rotate-180" />
                </Link>
              </Reveal>
            </div>
          </div>
          <div className="space-y-6 lg:col-span-8">
            {[t("about.p1"), t("about.p2"), t("about.p3")].map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-lg leading-relaxed text-zinc-300 sm:text-xl">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ VISION ============ */}
      <section className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8" data-testid="home-vision">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-brand-line">
            <img src={VISION_IMG} alt="Abstract neural sphere with node connections" className="absolute inset-0 h-full w-full object-cover opacity-30" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
            <div className="relative px-6 py-24 text-center sm:px-12 sm:py-32">
              <Eyebrow>{t("vision.label")}</Eyebrow>
              <MaskedLines lines={[t("vision.title")]} className="mx-auto mt-6 max-w-4xl"
                lineClassName="font-display text-2xl font-bold leading-snug text-white sm:text-4xl lg:text-[2.9rem]" delay={0.1} />
              <Reveal delay={0.35}>
                <Link to="/vision" data-testid="home-vision-link"
                  className="mt-9 inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-6 text-sm text-white glass transition-colors hover:border-blue-400/60">
                  {t("hero.cta_primary")} <ArrowRight size={14} className="rtl:rotate-180" />
                </Link>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ MISSION ============ */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32" data-testid="home-mission">
        <SectionHead label={t("mission.label")} title={t("mission.title")} intro={t("mission.intro")} />
        <div className="mt-12"><MissionGrid /></div>
      </section>

      {/* ============ PHILOSOPHY ============ */}
      <section className="relative border-y border-brand-line bg-zinc-950/50" data-testid="home-philosophy">
        <GlowBg opacity={0.5} />
        <div className="relative mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal><Eyebrow>{t("philosophy.label")}</Eyebrow></Reveal>
          <MaskedLines lines={['"', t("philosophy.quote"), '"']} className="mt-8" lineClassName="font-display text-xl font-medium leading-relaxed text-zinc-100 sm:text-3xl" />
          <Reveal delay={0.2}>
            <p className="mt-10 max-w-3xl leading-relaxed text-brand-muted">{t("philosophy.p1")}</p>
          </Reveal>
          <Reveal delay={0.28}>
            <Link to="/philosophy" data-testid="home-philosophy-link" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300">
              {t("nav.philosophy")} <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ EXPLORING ============ */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32" data-testid="home-exploring">
        <SectionHead label={t("exploring.label")} title={t("exploring.title")} intro={t("exploring.intro")} />
        <div className="mt-12"><ExploringGrid /></div>
      </section>

      {/* ============ PRODUCT TEASER ============ */}
      <section className="relative border-y border-brand-line bg-zinc-950/50" data-testid="home-product">
        <GlowBg opacity={0.5} />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <SectionHead label={t("product.label")} title={t("product.title")} />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-brand-muted">{t("product.intro")}</p>
          </Reveal>
          <Reveal delay={0.2} className="mt-12">
            <ConstructionScene />
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setModal(true)}
                data-testid="coming-soon-trigger"
                className="group relative inline-flex items-center gap-3 rounded-full border border-blue-500/40 bg-blue-500/10 px-8 py-3.5 font-mono text-xs font-medium uppercase tracking-[0.3em] text-blue-300 transition-all hover:bg-blue-500/20 hover:shadow-[0_0_36px_rgba(59,130,246,0.35)]"
              >
                <span className="inline-block h-2 w-2 animate-pulse-soft rounded-full bg-blue-400" />
                {t("product.status")}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ JOURNEY ============ */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32" data-testid="home-journey">
        <SectionHead label={t("journey.label")} title={t("journey.title")} intro={t("journey.intro")} />
        <div className="mt-14"><JourneyTimeline milestones={data?.milestones} /></div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32" data-testid="home-faq">
        <SectionHead label={t("faq.label")} title={t("faq.title")} align="center" />
        <div className="mt-12"><FaqAccordion /></div>
      </section>

      <ContactCta />
      <ComingSoonModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}
