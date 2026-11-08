import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useSite } from "@/lib/site";
import { Reveal } from "../Reveal";

export default function FaqAccordion() {
  const { t, data } = useSite();
  const [open, setOpen] = useState(0);
  const faqs = data?.faqs || [];

  return (
    <div className="mx-auto max-w-3xl" data-testid="faq-accordion">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={f.id || i} delay={i * 0.06}>
            <div className="border-b border-brand-line">
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                data-testid={`faq-question-${i + 1}`}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className={`font-display text-base font-medium transition-colors sm:text-lg ${isOpen ? "text-white" : "text-zinc-300"}`}>
                  {f.question}
                </span>
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.25 }}
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${isOpen ? "border-blue-500/60 text-blue-400" : "border-brand-line text-zinc-500"}`}>
                  <Plus size={14} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-7 pe-12 text-[15px] leading-relaxed text-brand-muted" data-testid={`faq-answer-${i + 1}`}>{f.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
