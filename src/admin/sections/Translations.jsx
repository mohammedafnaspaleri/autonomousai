import { useEffect, useState } from "react";
import { Save, BadgeCheck } from "lucide-react";
import api, { formatApiErrorDetail } from "@/lib/api";
import { LANGS } from "@/lib/site";

const EDITABLE_PREFIXES = ["nav.", "hero.", "mission.", "philosophy.quote", "exploring.", "product.", "journey.", "faq.", "contact.", "notfound.", "maintenance.", "footer.", "about.title", "about.p1", "vision.title"];

export default function Translations() {
  const [lang, setLang] = useState("ml");
  const [enDocs, setEnDocs] = useState({});
  const [langDocs, setLangDocs] = useState({});
  const [edits, setEdits] = useState({});
  const [settings, setSettings] = useState(null);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const [en, other, s] = await Promise.all([
      api.get("/admin/content", { params: { lang: "en" } }),
      api.get("/admin/content", { params: { lang } }),
      api.get("/admin/settings"),
    ]);
    const enMap = {}; en.data.content.forEach((d) => { enMap[d.key] = d; });
    const otherMap = {}; other.data.content.forEach((d) => { otherMap[d.key] = d; });
    setEnDocs(enMap); setLangDocs(otherMap); setSettings(s.data.settings);
  };

  useEffect(() => { load().catch(() => setToast("Could not load translations.")); }, [lang]);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 2600); };

  const keys = Object.keys(enDocs)
    .filter((k) => EDITABLE_PREFIXES.some((p) => k.startsWith(p) || k === p.replace(".", "")))
    .sort();

  const valueOf = (key) => {
    if (edits[key] !== undefined) return edits[key];
    const d = langDocs[key];
    return d ? String(d.draft_value ?? d.published_value ?? "") : "";
  };

  const save = async (key, publish) => {
    setBusy(true);
    try {
      await api.put(`/admin/content/${encodeURIComponent(key)}`, { value: valueOf(key), lang, publish });
      await load();
      setEdits((e) => ({ ...e, [key]: undefined }));
      flash(publish ? "Translation saved and published." : "Translation draft saved.");
    } catch (e) { flash(formatApiErrorDetail(e?.response?.data?.detail) || "Save failed."); } finally { setBusy(false); }
  };

  const approved = settings?.approved_langs || ["en"];
  const isApproved = approved.includes(lang);

  const toggleApprove = async () => {
    setBusy(true);
    try {
      const next = isApproved ? approved.filter((l) => l !== lang) : [...approved, lang];
      await api.post("/admin/translations/approve", { langs: next });
      await load();
      flash(isApproved ? `${lang.toUpperCase()} unapproved — visitors now see English for missing review.` : `${lang.toUpperCase()} approved for publication.`);
    } catch { flash("Update failed."); } finally { setBusy(false); }
  };

  const others = LANGS.filter((l) => l.code !== "en");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Translations</h1>
        <p className="mt-1 text-sm text-brand-muted">AI-generated drafts with manual editing. Publish only reviewed languages — unreviewed keys fall back to English for visitors.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2" data-testid="translations-langs">
        {others.map((l) => (
          <button key={l.code} onClick={() => setLang(l.code)} data-testid={`translations-lang-${l.code}`}
            className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
              lang === l.code ? "border-blue-500/50 bg-blue-500/10 text-blue-300" : "border-brand-line text-zinc-400 hover:text-white"}`}>
            {l.native}
            {approved.includes(l.code) && <span className="ms-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />}
          </button>
        ))}
        <button onClick={toggleApprove} disabled={busy} data-testid="translations-approve-toggle"
          className={`ms-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
            isApproved ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "bg-white text-black hover:bg-blue-500 hover:text-white"}`}>
          <BadgeCheck size={13} /> {isApproved ? `Approved — click to unpublish ${lang.toUpperCase()}` : `Approve ${lang.toUpperCase()} for visitors`}
        </button>
      </div>

      <div className="space-y-3">
        {keys.map((key) => {
          const dirty = edits[key] !== undefined && edits[key] !== valueOf(key);
          const saved = langDocs[key]?.published_value;
          return (
            <div key={key} className="rounded-xl border border-brand-line bg-zinc-950/70 p-4" data-testid={`translation-key-${key}`}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[10px] tracking-wider text-zinc-500">{key}</p>
                <div className="flex items-center gap-2">
                  {dirty && <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300">Unsaved</span>}
                  <button onClick={() => save(key, false)} disabled={busy} data-testid={`translation-save-${key}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-brand-line px-3 py-1.5 text-[11px] text-zinc-300 hover:text-white">
                    <Save size={11} /> Save draft
                  </button>
                  <button onClick={() => save(key, true)} disabled={busy} data-testid={`translation-publish-${key}`}
                    className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-black hover:bg-blue-500 hover:text-white">Publish</button>
                </div>
              </div>
              <p className="mb-2 rounded-lg bg-black/60 px-3 py-2 text-xs text-zinc-400">EN: {String(enDocs[key]?.published_value ?? "")}</p>
              <input data-testid={`translation-input-${key}`}
                className="w-full rounded-lg border border-brand-line bg-black px-3 py-2.5 text-sm text-white focus:border-blue-500/70 focus:outline-none"
                dir={lang === "ar" ? "rtl" : "ltr"}
                value={valueOf(key)} placeholder="English fallback shown to visitors"
                onChange={(e) => setEdits((s) => ({ ...s, [key]: e.target.value }))} />
              {saved && <p className="mt-1.5 text-[10px] text-zinc-600">Current published: {String(saved)}</p>}
            </div>
          );
        })}
      </div>

      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-brand-line bg-zinc-900 px-5 py-2.5 text-sm text-white shadow-2xl" role="status">{toast}</div>}
    </div>
  );
}
