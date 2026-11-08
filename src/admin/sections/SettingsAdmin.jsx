import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import api, { formatApiErrorDetail } from "@/lib/api";
import { LANGS } from "@/lib/site";

export default function SettingsAdmin() {
  const [s, setS] = useState(null);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get("/admin/settings").then(({ data }) => setS(data.settings)).catch(() => setToast("Load failed."));
  }, []);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 2600); };
  if (!s) return <p className="font-mono text-xs uppercase tracking-widest text-zinc-600">Loading…</p>;

  const upd = (patch) => setS((cur) => ({ ...cur, ...patch }));

  const save = async () => {
    setBusy(true);
    try {
      await api.put("/admin/settings", {
        maintenance_enabled: !!s.maintenance_enabled,
        maintenance_message: s.maintenance_message || "",
        maintenance_eta: s.maintenance_eta || "",
        contact_email: s.contact_email || "",
        seo_title: s.seo_title || "",
        seo_description: s.seo_description || "",
        default_theme: s.default_theme || "dark",
        announcement_enabled: !!(s.announcement?.enabled),
        announcement_text: s.announcement?.text || "",
        announcement_link: s.announcement?.link || "",
        approved_langs: s.approved_langs || ["en"],
      });
      flash("Settings saved.");
    } catch (e) { flash(formatApiErrorDetail(e?.response?.data?.detail) || "Save failed."); } finally { setBusy(false); }
  };

  const inputCls = "w-full rounded-xl border border-brand-line bg-black px-4 py-3 text-sm text-white focus:border-blue-500/70 focus:outline-none";

  return (
    <div className="max-w-3xl space-y-8" data-testid="admin-settings">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-brand-muted">Maintenance mode, announcements, SEO and site preferences.</p>
      </div>

      <section className="rounded-2xl border border-brand-line bg-zinc-950/70 p-6">
        <h2 className="font-display text-base font-semibold">Maintenance mode</h2>
        <label className="mt-4 flex items-center gap-3 text-sm text-zinc-300">
          <input type="checkbox" checked={!!s.maintenance_enabled} onChange={(e) => upd({ maintenance_enabled: e.target.checked })} data-testid="settings-maintenance-toggle" className="h-4 w-4" />
          Enable public maintenance page (you keep full access while signed in)
        </label>
        <textarea rows={2} placeholder="Custom maintenance message (optional)" data-testid="settings-maintenance-message"
          className={`${inputCls} mt-4`} value={s.maintenance_message || ""} onChange={(e) => upd({ maintenance_message: e.target.value })} />
        <input placeholder="Estimated return — e.g. Sunday 18:00 UTC (optional)" data-testid="settings-maintenance-eta"
          className={`${inputCls} mt-3`} value={s.maintenance_eta || ""} onChange={(e) => upd({ maintenance_eta: e.target.value })} />
      </section>

      <section className="rounded-2xl border border-brand-line bg-zinc-950/70 p-6">
        <h2 className="font-display text-base font-semibold">Announcement banner</h2>
        <label className="mt-4 flex items-center gap-3 text-sm text-zinc-300">
          <input type="checkbox" checked={!!(s.announcement && s.announcement.enabled)} onChange={(e) => upd({ announcement: { ...(s.announcement || {}), enabled: e.target.checked } })} data-testid="settings-announcement-toggle" className="h-4 w-4" />
          Show dismissible banner on the public site
        </label>
        <textarea rows={2} placeholder="Announcement text" data-testid="settings-announcement-text"
          className={`${inputCls} mt-4`} value={(s.announcement && s.announcement.text) || ""} onChange={(e) => upd({ announcement: { ...(s.announcement || {}), text: e.target.value } })} />
        <input placeholder="Optional link (https://…)" data-testid="settings-announcement-link"
          className={`${inputCls} mt-3`} value={(s.announcement && s.announcement.link) || ""} onChange={(e) => upd({ announcement: { ...(s.announcement || {}), link: e.target.value } })} />
      </section>

      <section className="rounded-2xl border border-brand-line bg-zinc-950/70 p-6">
        <h2 className="font-display text-base font-semibold">SEO & contact</h2>
        <input placeholder="Default page title" data-testid="settings-seo-title" className={`${inputCls} mt-4`} value={s.seo_title || ""} onChange={(e) => upd({ seo_title: e.target.value })} />
        <textarea rows={2} placeholder="Default meta description" data-testid="settings-seo-description" className={`${inputCls} mt-3`} value={s.seo_description || ""} onChange={(e) => upd({ seo_description: e.target.value })} />
        <input placeholder="Official contact email" data-testid="settings-contact-email" className={`${inputCls} mt-3`} value={s.contact_email || ""} onChange={(e) => upd({ contact_email: e.target.value })} />
      </section>

      <section className="rounded-2xl border border-brand-line bg-zinc-950/70 p-6">
        <h2 className="font-display text-base font-semibold">Languages</h2>
        <div className="mt-4">
          <p className="mb-2 text-xs uppercase tracking-wider text-zinc-500">Approved languages (published to visitors)</p>
          <div className="flex flex-wrap gap-2">
            {LANGS.map((l) => {
              const on = (s.approved_langs || []).includes(l.code);
              return (
                <button key={l.code}
                  onClick={() => upd({ approved_langs: on ? s.approved_langs.filter((x) => x !== l.code) : [...(s.approved_langs || []), l.code] })}
                  data-testid={`settings-lang-${l.code}`}
                  className={`rounded-full border px-3.5 py-1.5 text-xs ${on ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-brand-line text-zinc-500"}`}>
                  {l.native}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button onClick={save} disabled={busy} data-testid="settings-save"
          className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-blue-500 hover:text-white">
          <Save size={14} /> {busy ? "Saving…" : "Save settings"}
        </button>
        {toast && <p className="text-sm text-blue-300" role="status">{toast}</p>}
      </div>
    </div>
  );
}
