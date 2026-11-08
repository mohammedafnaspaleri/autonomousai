import { useState } from "react";
import { Lock } from "lucide-react";
import { useSite } from "@/lib/site";
import { Reveal, Eyebrow, MaskedLines } from "@/components/Reveal";
import ConstructionScene from "@/components/ConstructionScene";
import ComingSoonModal from "@/components/ComingSoonModal";
import Seo from "@/components/Seo";
import GlowBg from "@/components/GlowBg";

export default function Product() {
  const { t } = useSite();
  const [modal, setModal] = useState(false);
  return (
    <div data-testid="page-product" className="pt-16">
      <Seo title={t("nav.product")} description={t("product.intro")} />
      <section className="relative overflow-hidden">
        <GlowBg opacity={0.55} />
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="text-center">
            <Reveal><Eyebrow>{t("product.label")}</Eyebrow></Reveal>
            <MaskedLines lines={[t("product.title")]} className="mt-6"
              lineClassName="font-display text-3xl font-bold leading-tight text-white sm:text-5xl" />
            <Reveal delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-muted">{t("product.intro")}</p>
            </Reveal>
            <Reveal delay={0.28}>
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-blue-300" data-testid="product-status-badge">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-blue-400" />
                {t("product.status")}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="mt-14">
            <ConstructionScene />
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-12 flex flex-col items-center gap-5 text-center">
              <p className="max-w-xl text-brand-muted">{t("product.future")}</p>
              <button
                onClick={() => setModal(true)}
                data-testid="coming-soon-trigger"
                className="group relative inline-flex items-center gap-3 rounded-full border border-blue-500/40 bg-blue-500/10 px-8 py-3.5 font-mono text-xs font-medium uppercase tracking-[0.3em] text-blue-300 transition-all hover:bg-blue-500/20 hover:shadow-[0_0_36px_rgba(59,130,246,0.35)]"
              >
                <Lock size={13} />
                {t("product.status")}
              </button>
            </div>
          </Reveal>
        </div>
      </section>
      <ComingSoonModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}
