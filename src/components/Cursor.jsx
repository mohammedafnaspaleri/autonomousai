import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 400, damping: 40, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine && !reduce);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;
    const move = (e) => {
      x.current = e.clientX;
      y.current = e.clientY;
      const t = e.target;
      setHovering(!!(t.closest && t.closest("a, button, [role=button], input, textarea, select, [data-cursor]")));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="cursor-glow"
      data-testid="glow-cursor"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      aria-hidden="true"
    >
      <motion.div
        animate={{ scale: hovering ? 2.1 : 1, opacity: hovering ? 0.9 : 0.55 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="rounded-full"
        style={{
          width: 26,
          height: 26,
          background: "radial-gradient(circle, rgba(99,102,241,0.85) 0%, rgba(59,130,246,0.45) 40%, rgba(139,92,246,0) 70%)",
          filter: "blur(1px)",
        }}
      />
    </motion.div>
  );
}
