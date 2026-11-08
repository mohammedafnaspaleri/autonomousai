import { useSite } from "@/lib/site";
import { Reveal, Eyebrow, MaskedLines } from "@/components/Reveal";
import FaqAccordion from "@/components/sections/FaqAccordion";
import ContactCta from "@/components/sections/ContactCta";
import Seo from "@/components/Seo";

export default function Faq() {
  const { t } = useSite();
  return (
    <div data-testid="page-faq" className="pt-16">
      <Seo title={t("nav.faq")} description={t("faq.title")} />
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="text-center">
          <Reveal><Eyebrow>{t("faq.label")}</Eyebrow></Reveal>
          <MaskedLines lines={[t("faq.title")]} className="mt-6"
            lineClassName="font-display text-3xl font-bold leading-tight text-white sm:text-5xl" />
        </div>
        <div className="mt-14"><FaqAccordion /></div>
      </section>
      <ContactCta />
    </div>
  );
}
