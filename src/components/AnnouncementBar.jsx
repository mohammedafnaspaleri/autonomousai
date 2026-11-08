import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useSite } from "@/lib/site";

export default function AnnouncementBar() {
  const { data, t } = useSite();
  const ann = data?.announcement;
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem("autonomous_ann") === (ann?.text || ""); } catch { return false; }
  });

  if (!ann?.enabled || !ann.text || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem("autonomous_ann", ann.text); } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="relative z-30 border-b border-blue-500/20 py-2.5 text-center"
      style={{ background: "linear-gradient(90deg, rgba(30,58,138,0.35), rgba(76,29,149,0.35), rgba(30,58,138,0.35))" }}
      data-testid="announcement-bar"
    >
      <p className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2 px-10 font-mono text-[11px] tracking-wider text-blue-100">
        <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-blue-400" />
        {ann.link ? (
          <a href={ann.link} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline" data-testid="announcement-link">{ann.text}</a>
        ) : (
          <span>{ann.text}</span>
        )}
      </p>
      <button
        onClick={dismiss}
        aria-label={t("nav.close")}
        data-testid="announcement-dismiss"
        className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-blue-200/70 hover:text-white"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
