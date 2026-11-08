import { HeartHandshake, Wrench, Feather, ShieldCheck } from "lucide-react";
import { useSite } from "@/lib/site";
import { Reveal, Eyebrow, MaskedLines } from "@/components/Reveal";
import Seo from "@/components/Seo";

const VALUES = [
  { Icon: HeartHandshake, key: "Empowerment" },
  { Icon: Wrench, key: "Usefulness" },
  { Icon: Feather, key: "Simplicity" },
  { Icon: ShieldCheck, key: "Responsible innovation" },
];

export default function Philosophy() {
  const { t } = useSite();
  return (
    <div data-testid="page-philosophy" className="pt-16">
      <Seo title={t("nav.philosophy")} description={t("philosophy.quote")} />
      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal><Eyebrow>{t("philosophy.label")}</Eyebrow></Reveal>
        <MaskedLines lines={[t("philosophy.title")]} className="mt-6"
          lineClassName="font-display text-3xl font-bold leading-tight text-white sm:text-5xl" />

        <Reveal delay={0.15}>
          <blockquote className="relative my-14 border-s-2 border-gradient ps-8" data-testid="philosophy-quote">
            <p className="font-display text-xl font-medium leading-relaxed text-zinc-100 sm:text-3xl">
              "{t("philosophy.quote")}"
            </p>
          </blockquote>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-lg leading-relaxed text-zinc-300">{t("philosophy.p1")}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 text-lg leading-relaxed text-zinc-300">{t("philosophy.p2")}</p>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2" data-testid="philosophy-values">
          {VALUES.map((v, i) => (
            <Reveal key={v.key} delay={i * 0.07} className="h-full">
              <div className="flex h-full items-start gap-4 rounded-2xl border border-brand-line bg-zinc-950/70 p-6">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-line bg-zinc-900 text-purple-400">
                  <v.Icon size={17} strokeWidth={1.6} />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">{v.key}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">
                    {i === 0 && "Technology that amplifies what people can do — never replaces their judgment."}
                    {i === 1 && "Every capability must earn its place by being genuinely useful."}
                    {i === 2 && "Simple by default. Complexity is our problem to solve, not the user's."}
                    {i === 3 && "We build carefully, honestly and with respect for the people who rely on what we make."}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
