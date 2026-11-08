import { useSite } from "@/lib/site";

export default function Marquee() {
  const { t } = useSite();
  const items = t("marquee.items").split("/").map((s) => s.trim()).filter(Boolean);
  const row = (hidden) => (
    <div className="flex items-center gap-14 pr-14 shrink-0" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-14 whitespace-nowrap font-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-zinc-500">
          {item}
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden border-y border-brand-line bg-zinc-950/40 py-6" data-testid="editorial-marquee">
      <div className="flex w-max animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
