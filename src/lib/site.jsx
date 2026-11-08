import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import api from "./api";

export const LANGS = [
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", dir: "ltr" },
  { code: "hi", label: "Hindi", native: "हिन्दी", dir: "ltr" },
  { code: "de", label: "German", native: "Deutsch", dir: "ltr" },
  { code: "es", label: "Spanish", native: "Español", dir: "ltr" },
  { code: "fr", label: "French", native: "Français", dir: "ltr" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
];

const FALLBACK_EN = {
  "nav.home": "Home", "nav.about": "About", "nav.vision": "Vision", "nav.mission": "Mission",
  "nav.philosophy": "Philosophy", "nav.exploring": "Exploring", "nav.product": "Product",
  "nav.journey": "Our Journey", "nav.faq": "FAQ", "nav.contact": "Contact",
  "nav.get_in_touch": "Get in Touch", "nav.theme": "Toggle theme", "nav.language": "Language",
  "hero.eyebrow": "AUTONOMOUS // EMERGING TECHNOLOGY",
  "hero.line1": "The future of intelligence is taking shape.",
  "hero.intro": "An emerging technology company exploring new possibilities in intelligent AI and automation.",
  "hero.believe": "We believe technology should do more, so people can achieve more.",
  "hero.building": "Something different is being built.",
  "hero.cta_primary": "Explore Our Vision",
  "hero.cta_secondary": "Discover What We're Building",
  "hero.scroll": "Scroll to explore",
  "common.loading": "Loading…",
};

const SiteContext = createContext(null);

function readStoredLang() {
  try {
    const v = localStorage.getItem("autonomous_lang");
    return LANGS.some((l) => l.code === v) ? v : "en";
  } catch {
    return "en";
  }
}

function readStoredTheme() {
  try {
    const v = localStorage.getItem("autonomous_theme");
    return ["dark", "light", "system"].includes(v) ? v : null;
  } catch {
    return null;
  }
}

export function SiteProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang());
  const [theme, setThemeState] = useState(readStoredTheme() || "dark");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const firstLoad = useRef(true);
  const loadSeq = useRef(0);
  const retryTimer = useRef(null);

  // Retries with backoff for ~35s (0.8, 1.6, 3.2, then every 5s) so a slow/waking
  // backend never forces the visitor to reload manually. A newer load() cancels older retries.
  const MAX_ATTEMPTS = 9;
  const load = useCallback(async (l = lang, silent = false, attempt = 0, seq = null) => {
    if (seq === null) {
      loadSeq.current += 1;
      seq = loadSeq.current;
      clearTimeout(retryTimer.current);
    }
    if (seq !== loadSeq.current) return;
    if (!silent) setLoading(true);
    try {
      const { data: d } = await api.get("/bootstrap", { params: { lang: l, preview: 1 }, timeout: 15000 });
      if (seq !== loadSeq.current) return;
      setData(d);
      setError(null);
      setLoading(false);
      firstLoad.current = false;
    } catch (e) {
      if (seq !== loadSeq.current) return;
      if (attempt < MAX_ATTEMPTS - 1) {
        const delay = Math.min(800 * 2 ** attempt, 5000);
        retryTimer.current = setTimeout(() => load(l, true, attempt + 1, seq), delay);
        return;
      }
      setError(e.message || "network error");
      setLoading(false);
      firstLoad.current = false;
    }
  }, [lang]);

  useEffect(() => { load(lang, false, 0); return () => clearTimeout(retryTimer.current); }, [load, lang]);

  // If every attempt failed, keep recovering on our own: when the tab regains focus,
  // the network comes back, or every 10s — no manual reload needed.
  useEffect(() => {
    if (!error || data || loading) return;
    const retry = () => load(lang, false, 0);
    const onVis = () => { if (document.visibilityState === "visible") retry(); };
    window.addEventListener("online", retry);
    document.addEventListener("visibilitychange", onVis);
    const iv = setInterval(retry, 10000);
    return () => {
      window.removeEventListener("online", retry);
      document.removeEventListener("visibilitychange", onVis);
      clearInterval(iv);
    };
  }, [error, data, loading, load, lang]);

  const setLang = useCallback((l) => {
    if (!LANGS.some((x) => x.code === l)) return;
    setLangState(l);
    try { localStorage.setItem("autonomous_lang", l); } catch {}
  }, []);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    try { localStorage.setItem("autonomous_theme", t); } catch {}
  }, []);

  useEffect(() => {
    const meta = LANGS.find((l) => l.code === lang) || LANGS[0];
    document.documentElement.lang = meta.code;
    document.documentElement.dir = meta.dir;
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    const tag = document.querySelector('meta[name="theme-color"]');
    if (tag) tag.setAttribute("content", "#000000");
  }, []);

  const t = useCallback(
    (key, vars) => {
      let v = (data && data.content && data.content[key]) || FALLBACK_EN[key] || key;
      if (vars) {
        Object.entries(vars).forEach(([k, val]) => { v = v.replaceAll(`{${k}}`, val); });
      }
      return v;
    },
    [data]
  );

  const value = useMemo(
    () => ({ lang, setLang, theme, setTheme, data, loading, error, t, refresh: () => load(lang, true) }),
    [lang, setLang, theme, setTheme, data, loading, error, t, load]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
