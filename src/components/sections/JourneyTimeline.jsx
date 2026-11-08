import { motion } from "framer-motion";
import { useSite } from "@/lib/site";
import { Reveal } from "../Reveal";

export default function JourneyTimeline({ milestones }) {
  const items = milestones && milestones.length ? milestones : null;
  if (!items) return null;
  return (
    <div className="relative" data-testid="journey-timeline">
      <div className="absolute left-[13px] top-2 h-[calc(100%-16px)] w-px bg-gradient-to-b from-brand-blue via-brand-purple to-transparent md:hidden" />
      <ol className="grid gap-8 md:grid-cols-4 md:gap-5">
        {items.map((m, i) => (
          <Reveal key={m.id || i} delay={i * 0.1}>
            <li className="relative ps-12 md:ps-0" data-testid={`journey-stage-${i + 1}`}>
              <span className="absolute left-0 top-1 flex h-[27px] w-[27px] items-center justify-center rounded-full border border-blue-500/40 bg-black md:relative md:mb-6">
                <motion.span
                  className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 }}
                />
              </span>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand-blue">{m.stage}</p>
              <h3 className="mt-2 font-display text-base font-semibold text-white sm:text-lg">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{m.description}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
