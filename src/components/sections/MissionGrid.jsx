import { motion } from "framer-motion";
import { useSite } from "@/lib/site";
import { Reveal } from "../Reveal";

export default function MissionGrid() {
  const { t } = useSite();
  const items = [1, 2, 3, 4].map((i) => ({ n: `0${i}`, title: t(`mission.item${i}_title`), body: t(`mission.item${i}_body`) }));
  return (
    <div className="grid gap-5 sm:grid-cols-2" data-testid="mission-grid">
      {items.map((item, i) => (
        <Reveal key={i} delay={i * 0.08}>
          <motion.article
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="group relative h-full overflow-hidden rounded-2xl border border-brand-line bg-zinc-950/70 p-7 sm:p-8"
            data-testid={`mission-card-${i + 1}`}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.22), transparent 70%)" }} />
            <span className="font-mono text-xs tracking-[0.3em] text-brand-blue">{item.n}</span>
            <h3 className="mt-4 font-display text-lg font-semibold text-white sm:text-xl">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-brand-muted">{item.body}</p>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-blue-500/40 to-purple-500/0 opacity-40" />
          </motion.article>
        </Reveal>
      ))}
    </div>
  );
}
