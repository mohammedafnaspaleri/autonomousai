import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useSite } from "@/lib/site";
import { LogoLockup } from "./Logo";

export default function Footer() {
  const { t, data } = useSite();
  const email = data?.settings?.contact_email || "autonomousai.support@gmail.com";
  const year = new Date().getFullYear();

  const quick = [
    ["/", "nav.home"], ["/about", "nav.about"], ["/vision", "nav.vision"], ["/mission", "nav.mission"],
    ["/philosophy", "nav.philosophy"], ["/exploring", "nav.exploring"], ["/product", "nav.product"],
    ["/journey", "nav.journey"], ["/faq", "nav.faq"], ["/contact", "nav.contact"],
  ];
  const legal = [
    ["/privacy", "footer.privacy"], ["/terms", "footer.terms"],
    ["/cookies", "footer.cookies"], ["/disclaimer", "footer.disclaimer"],
  ];

  return (
    <footer className="relative overflow-hidden border-t border-brand-line bg-black" data-testid="site-footer">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 sm:pt-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <LogoLockup className="h-6" alt="AUTONOMOUS" />
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-brand-blue" data-testid="footer-tagline">
              A Smarter Companion for Every Journey.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-muted">{t("footer.description")}</p>
            <a
              href={`mailto:${email}`}
              data-testid="footer-email-link"
              className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-blue-400"
            >
              <Mail size={14} /> {email}
            </a>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">{t("footer.quick")}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 md:grid-cols-1">
              {quick.map(([to, key]) => (
                <li key={to}>
                  <Link to={to} data-testid={`footer-link-${to.replace("/", "") || "home"}`}
                    className="text-sm text-zinc-400 transition-colors hover:text-white">
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">{t("footer.legal")}</h3>
            <ul className="mt-4 space-y-2.5">
              {legal.map(([to, key]) => (
                <li key={to}>
                  <Link to={to} data-testid={`footer-legal-${to.slice(1)}`}
                    className="text-sm text-zinc-400 transition-colors hover:text-white">
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs leading-relaxed text-zinc-600">{t("hero.building")}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-brand-line pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-zinc-600" data-testid="footer-copyright">
            © {year} AUTONOMOUS. {t("footer.rights")}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-700">The future of intelligence is taking shape</p>
        </div>
      </div>

      <div className="pointer-events-none select-none px-5 pb-4" aria-hidden="true">
        {/* Unbounded renders ~9.4em wide for this word; 9.4vw keeps the full word (incl. final S) inside the viewport */}
        <p className="font-display whitespace-nowrap text-center text-[9.4vw] font-bold leading-none text-white/[0.045]" data-testid="footer-watermark">AUTONOMOUS</p>
      </div>
    </footer>
  );
}
