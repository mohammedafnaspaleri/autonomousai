import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useSite } from "@/lib/site";

export default function ComingSoonModal({ open, onClose }) {
  const { t } = useSite();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          data-testid="coming-soon-modal"
          role="dialog" aria-modal="true" aria-label={t("product.popup_title")}
        >
          <div className="absolute inset-0 bg-black/85 glass" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-brand-line bg-zinc-950 p-8 text-center sm:p-12"
          >
            <div
              className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(59,130,246,0.25), rgba(139,92,246,0.1) 60%, transparent 75%)", filter: "blur(30px)" }}
            />
            <button
              onClick={onClose}
              data-testid="coming-soon-close"
              aria-label={t("product.popup_close")}
              className="absolute end-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-line text-zinc-400 transition-colors hover:text-white"
            >
              <X size={16} />
            </button>
            <div className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-brand-line bg-zinc-900">
              <Sparkles size={20} className="text-blue-400" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold leading-snug text-white" data-testid="coming-soon-title">
              {t("product.popup_title")}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-brand-muted" data-testid="coming-soon-message">
              {t("product.popup_message")}
            </p>
            <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-brand-blue to-brand-purple" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
