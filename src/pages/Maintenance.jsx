import { Wrench } from "lucide-react";
import { useSite } from "@/lib/site";

export default function Maintenance() {
  const { t, data } = useSite();
  const message = data?.maintenance?.message || t("maintenance.body");
  const eta = data?.maintenance?.eta;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center" data-testid="page-maintenance">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(59,130,246,0.08), transparent 70%)" }} />
      <div className="relative">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-line bg-zinc-950">
          <Wrench size={24} className="text-blue-400" />
        </span>
        <h1 className="mt-8 font-display text-3xl font-bold text-white sm:text-4xl" data-testid="maintenance-title">{t("maintenance.title")}</h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-brand-muted" data-testid="maintenance-message">{message}</p>
        {eta && (
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-zinc-500" data-testid="maintenance-eta">
            {t("maintenance.eta_label")}: {eta}
          </p>
        )}
        <div className="mx-auto mt-10 h-px w-28 bg-gradient-to-r from-brand-blue to-brand-purple" />
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-700">AUTONOMOUS</p>
      </div>
    </div>
  );
}
