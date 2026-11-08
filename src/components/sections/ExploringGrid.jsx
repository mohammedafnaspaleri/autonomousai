import { BrainCircuit, Workflow, Users, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import { useSite } from "@/lib/site";
import { Reveal } from "../Reveal";

const ICONS = [BrainCircuit, Workflow, Users, Gauge];

export default function ExploringGrid() {
  const { t } = useSite();
  const items = [1, 2, 3, 4].map((i) => ({
    title: t(`exploring.item${i}_title`), body: t(`exploring.item${i}_body`), Icon: ICONS[i - 1],
  }));
  return (
    <div className="grid gap-5 md:grid-cols-2" data-testid="exploring-grid">
      {items.map((item, i) => (
        <Reveal key={i} delay={i * 0.08} className="h-full">
          <motion.article
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="group relative h-full overflow-hidden rounded-2xl border border-brand-line bg-zinc-950/70 p-7 sm:p-8"
            data-testid={`exploring-card-${i + 1}`}
          >
            <div className="flex items-start justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-line bg-zinc-900 text-blue-400 transition-colors duration-300 group-hover:border-blue-500/50 group-hover:text-blue-300">
                <item.Icon size={19} strokeWidth={1.6} />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">0{i + 1}</span>
            </div>
            <h3 className="mt-6 font-display text-lg font-semibold text-white sm:text-xl">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-brand-muted">{item.body}</p>
            <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-brand-blue to-brand-purple transition-transform duration-500 group-hover:scale-x-100" />
          </motion.article>
        </Reveal>
      ))}
    </div>
  );
}
