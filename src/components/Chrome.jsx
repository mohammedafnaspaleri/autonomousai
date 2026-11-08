import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    let raf;
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);
  return null;
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export function trackVisit(path) {
  try {
    const payload = { path, referrer: document.referrer || "" };
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      const base = (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL) || "";
      const url = `${base}/api/analytics`;
      navigator.sendBeacon && navigator.sendBeacon(url, blob);
    }
  } catch {}
}
