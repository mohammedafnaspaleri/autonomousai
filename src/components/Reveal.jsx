import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export function Reveal({ children, delay = 0, y = 28, className = "", once = true, as = "div" }) {
  const reduce = useReducedMotion();
  const M = as === "section" ? motion.section : motion.div;
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

export function MaskedLines({ lines, className = "", lineClassName = "", delay = 0, stagger = 0.14 }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <span className={`block ${className}`}>
        {lines.map((l, i) => (
          <span key={i} className={`block ${lineClassName}`}>{l}{i < lines.length - 1 ? " " : ""}</span>
        ))}
      </span>
    );
  }
  return (
    <span className={`block ${className}`}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: delay + i * stagger, ease: EASE }}
          >
            {/* trailing space keeps words separated in text (copy/paste, screen readers, translate, search) — invisible at a block line end */}
            {l}{i < lines.length - 1 ? " " : ""}          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Eyebrow({ children, className = "" }) {
  return (
    <p className={`font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-brand-blue ${className}`}>
      {children}
    </p>
  );
}

export default Reveal;
