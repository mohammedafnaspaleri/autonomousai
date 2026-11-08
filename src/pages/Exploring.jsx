import { Link } from "react-router-dom";
import { useSite } from "@/lib/site";
import { Reveal, Eyebrow, MaskedLines } from "@/components/Reveal";
import ExploringGrid from "@/components/sections/ExploringGrid";
import Seo from "@/components/Seo";

const EXPLORE_IMG = "https://images.unsplash.com/photo-1669829691116-1d1b367aaa59?crop=entropy&cs=srgb&fm=jpg&q=85";

export default function Exploring() {
  const { t } = useSite();
  return (
    <div data-testid="page-exploring" className="pt-16">
      <Seo title={t("nav.exploring")} description={t("exploring.intro")} />
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal><Eyebrow>{t("exploring.label")}</Eyebrow></Reveal>
        <MaskedLines lines={[t("exploring.title")]} className="mt-6 max-w-3xl"
          lineClassName="font-display text-3xl font-bold leading-tight text-white sm:text-5xl" />
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-muted">{t("exploring.intro")}</p>
        </Reveal>
        <div className="mt-14"><ExploringGrid /></div>

        <Reveal delay={0.2}>
          <div className="relative mt-20 overflow-hidden rounded-3xl border border-brand-line">
            <img src={EXPLORE_IMG} alt="Futuristic light trail corridor" className="h-64 w-full object-cover opacity-60 sm:h-80" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
              <p className="font-display text-xl font-medium text-white sm:text-2xl">{t("product.title")}</p>
              <Link to="/product" data-testid="exploring-product-link" className="mt-4 inline-flex h-10 items-center rounded-full border border-white/25 px-5 text-sm text-white glass transition-colors hover:border-blue-400/60">
                {t("nav.product")} →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
