import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { useSite } from "@/lib/site";
import { Reveal, MaskedLines } from "../Reveal";
import GlowBg from "../GlowBg";

export default function ContactCta() {
  const { t, data } = useSite();
  const email = data?.settings?.contact_email || "autonomousai.support@gmail.com";
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32" data-testid="contact-cta-section">
      <GlowBg opacity={0.45} />
      <div className="relative overflow-hidden rounded-3xl border border-brand-line bg-zinc-950 px-6 py-16 text-center sm:px-12 sm:py-24">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 0%, rgba(59,130,246,0.14), rgba(139,92,246,0.07) 50%, transparent 80%)" }} />
        <Reveal>
          <EyebrowWrap>{t("contact.label")}</EyebrowWrap>
        </Reveal>
        <MaskedLines lines={[t("contact.title")]} className="mx-auto mt-5 max-w-2xl" lineClassName="font-display text-3xl sm:text-5xl font-bold text-white leading-tight" delay={0.1} />
        <Reveal delay={0.2}>
          <p className="mx-auto mt-5 max-w-xl text-brand-muted">{t("contact.intro")}</p>
        </Reveal>
        <Reveal delay={0.28}>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              data-testid="contact-cta-button"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-black transition-all hover:bg-blue-500 hover:text-white hover:shadow-[0_0_32px_rgba(59,130,246,0.5)]"
            >
              {t("nav.get_in_touch")}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
            </Link>
            <a href={`mailto:${email}`} data-testid="contact-cta-email"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-brand-line px-7 text-sm text-zinc-300 transition-colors hover:border-blue-500/50 hover:text-white">
              <Mail size={15} /> {email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function EyebrowWrap({ children }) {
  return <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand-blue">{children}</p>;
}
