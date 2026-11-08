import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Check, ChevronDown, Globe } from "lucide-react";
import { useSite, LANGS } from "@/lib/site";
import { LogoLockup, LogoMark } from "./Logo";

const DESKTOP_LINKS = [
  { to: "/", key: "nav.home", id: "home" },
  { to: "/about", key: "nav.about", id: "about" },
  { to: "/vision", key: "nav.vision", id: "vision" },
  { to: "/mission", key: "nav.mission", id: "mission" },
  { to: "/product", key: "nav.product", id: "product" },
  { to: "/contact", key: "nav.contact", id: "contact" },
];

const MOBILE_LINKS = [...DESKTOP_LINKS.slice(0, 5),
  { to: "/philosophy", key: "nav.philosophy", id: "philosophy" },
  { to: "/exploring", key: "nav.exploring", id: "exploring" },
  { to: "/journey", key: "nav.journey", id: "journey" },
  { to: "/faq", key: "nav.faq", id: "faq" },
  ...DESKTOP_LINKS.slice(5),
];

function LanguageSelector({ onSelect, up = false }) {
  const { lang, setLang, t } = useSite();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGS.find((l) => l.code === lang);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        data-testid="nav-language-btn"
        aria-label={t("nav.language")}
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-brand-line px-3 text-xs font-mono uppercase tracking-wider text-brand-muted hover:text-white hover:border-brand-linestrong transition-colors"
      >
        <Globe size={13} />
        <span>{current?.code}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={`absolute end-0 z-50 w-44 rounded-xl border border-brand-line bg-zinc-950/95 glass p-1.5 shadow-2xl shadow-black/60 ${up ? "bottom-11" : "top-11"}`}
            data-testid="nav-language-menu"
          >
            {LANGS.map((l) => (
              <li key={l.code}>
                <button
                  onClick={() => { setLang(l.code); setOpen(false); onSelect && onSelect(); }}
                  data-testid={`nav-language-${l.code}`}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                    l.code === lang ? "bg-blue-500/10 text-blue-400" : "text-zinc-300 hover:bg-white/5"}`}
                >
                  <span>{l.native}</span>
                  {l.code === lang && <Check size={14} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Nav() {
  const { t } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "border-b border-brand-line/70 bg-black/85 glass" : "bg-black/40 glass border-b border-transparent"}`}
        data-testid="site-nav"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link to="/" data-testid="nav-logo-link" aria-label="AUTONOMOUS home" className="flex items-center">
            <LogoLockup className="h-5 sm:h-6" alt="AUTONOMOUS" />
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
            {DESKTOP_LINKS.map((l) => (
              <NavLink
                key={l.id}
                to={l.to}
                data-testid={`nav-link-${l.id}`}
                className={({ isActive }) =>
                  `text-[13px] font-medium tracking-wide transition-colors ${
                    isActive ? "text-white" : "text-brand-muted hover:text-white"}`}
              >
                {t(l.key)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block"><LanguageSelector /></div>
            <Link
              to="/contact"
              data-testid="nav-cta"
              className="hidden md:inline-flex h-9 items-center rounded-full bg-white px-4 text-[13px] font-semibold text-black transition-all hover:bg-blue-500 hover:text-white hover:shadow-[0_0_24px_rgba(59,130,246,0.45)]"
            >
              {t("nav.get_in_touch")}
            </Link>
            <button
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-line text-white"
              onClick={() => setOpen(true)}
              data-testid="nav-mobile-open"
              aria-label={t("nav.menu")}
            >
              <Menu size={17} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 glass lg:hidden"
            data-testid="nav-mobile-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <LogoMark className="h-6" />
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-line text-white"
                onClick={() => setOpen(false)}
                data-testid="nav-mobile-close"
                aria-label={t("nav.close")}
              >
                <X size={17} />
              </button>
            </div>
            <nav className="mt-4 flex flex-col gap-1 px-6" aria-label="Mobile">
              {MOBILE_LINKS.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.045, duration: 0.4 }}
                >
                  <NavLink
                    to={l.to}
                    data-testid={`nav-mobile-link-${l.id}`}
                    className={({ isActive }) =>
                      `block border-b border-white/5 py-3.5 font-display text-2xl font-medium ${
                        isActive ? "text-gradient" : "text-zinc-200"}`}
                  >
                    {t(l.key)}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="mt-6 flex items-center justify-between px-6">
              <LanguageSelector onSelect={() => setOpen(false)} up />
              <Link
                to="/contact"
                data-testid="nav-mobile-cta"
                className="inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-black"
              >
                {t("nav.get_in_touch")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
