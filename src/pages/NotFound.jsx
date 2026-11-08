import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSite } from "@/lib/site";
import NetworkCanvas from "@/components/NetworkCanvas";
import { MaskedLines } from "@/components/Reveal";

export default function NotFound() {
  const { t } = useSite();
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black" data-testid="page-404">
      <NetworkCanvas nodeCount={30} />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(139,92,246,0.1), transparent 70%)" }} />
      <div className="relative z-10 px-6 text-center">
        <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
          className="font-display text-[26vw] font-bold leading-none text-white/[0.06] sm:text-[180px]" aria-hidden="true">
          404
        </motion.p>
        <MaskedLines lines={[t("notfound.title")]} className="mt-2"
          lineClassName="font-display text-2xl font-bold text-white sm:text-4xl" delay={0.2} />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}
          className="mx-auto mt-5 max-w-md text-brand-muted">
          {t("notfound.body")}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
          <Link to="/" data-testid="notfound-return-home"
            className="mt-9 inline-flex h-12 items-center rounded-full bg-white px-8 text-sm font-semibold text-black transition-all hover:bg-blue-500 hover:text-white hover:shadow-[0_0_32px_rgba(59,130,246,0.5)]">
            {t("notfound.cta")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
