import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const KEY = "autonomous_loaded_session";

export default function Loader() {
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let seen = null;
    try { seen = sessionStorage.getItem(KEY); } catch {}
    if (seen || reduce) return;
    setShow(true);
    try { sessionStorage.setItem(KEY, "1"); } catch {}
    const t1 = setTimeout(() => setDone(true), 1500);
    const t2 = setTimeout(() => setShow(false), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [reduce]);

  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9998] bg-black flex flex-col items-center justify-center"
      data-testid="brand-loader"
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      style={{ pointerEvents: done ? "none" : "auto" }}
      aria-hidden="true"
    >
      <motion.img
        src="/icons/icon-64.png"
        alt=""
        className="w-14 h-14 mb-6"
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.p
        className="font-display text-white text-xs sm:text-sm tracking-[0.5em] uppercase"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.7 }}
      >
        AUTONOMOUS
      </motion.p>
      <div className="mt-8 h-px w-40 overflow-hidden bg-white/10">
        <motion.div
          className="h-full w-full origin-left"
          style={{ background: "linear-gradient(90deg,#3B82F6,#8B5CF6)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.3, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
