import { useEffect, useMemo, useState } from "react";
import { Save, Send, Undo2, Monitor, Tablet, Smartphone, X } from "lucide-react";
import api, { formatApiErrorDetail } from "@/lib/api";

const GROUPS = [
  { id: "hero", label: "Home / Hero" },
  { id: "about", label: "About" },
  { id: "vision", label: "Vision" },
  { id: "mission", label: "Mission" },
  { id: "philosophy", label: "Philosophy" },
  { id: "exploring", label: "Exploring" },
  { id: "product", label: "Product teaser" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
  { id: "footer", label: "Footer" },
  { id: "notfound", label: "404 page" },
  { id: "maintenance", label: "Maintenance" },
  { id: "legal", label: "Legal titles" },
];

export default function ContentEditor() {
  const [group, setGroup] = useState("hero");
  const [docs, setDocs] = useState({});
  const [edits, setEdits] = useState({});
  const [busyKey, setBusyKey] = useState("");
  const [toast, setToast] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setEdits({});
    api.get("/admin/content", { params: { lang: "en", section: group } })
      .then(({ data }) => {
        const map = {};
        data.content.forEach((d) => { map[d.key] = d; });
        setDocs(map);
      })
      .catch(() => setToast("Could not load content."));
  }, [group]);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2600); };

  const draftOf = (key) => {
    if (edits[key] !== undefined) return edits[key];
    const d = docs[key];
    if (!d) return "";
    const v = d.draft_value ?? d.published_value;
    return Array.isArray(v) ? v.join("\n") : typeof v === "object" ? JSON.stringify(v, null, 2) : String(v);
  };

  const parsedValue = (key, raw) => {
    const published = docs[key]?.published_value;
    if (Array.isArray(published)) return raw.split("\n").map((s) => s.trim()).filter(Boolean);
    if (typeof published === "object" && published !== null) { try { return JSON.parse(raw); } catch { return null; } }
    return raw;
  };

  const save = async (key, publish) => {
    setBusyKey(key);
    try {
      const value = parsedValue(key, draftOf(key));
      if (value === null) { flash("Invalid JSON for this field."); return; }
      await api.put(`/admin/content/${encodeURIComponent(key)}`, { value, lang: "en", publish });
      const { data } = await api.get("/admin/content", { params: { lang: "en", section: group } });
      const map = {}; data.content.forEach((d) => { map[d.key] = d; });
      setDocs(map);
      setEdits((e) => ({ ...e, [key]: undefined }));
      flash(publish ? "Saved and published." : "Draft saved.");
    } catch (e2) {
      flash(formatApiErrorDetail(e2?.response?.data?.detail) || "Save failed.");
    } finally { setBusyKey(""); }
  };

  const revert = async (key) => {
    setBusyKey(key);
    try {
      await api.post(`/admin/content/${encodeURIComponent(key)}/revert-draft`, null, { params: { lang: "en" } });
      setEdits((e) => ({ ...e, [key]: undefined }));
      const { data } = await api.get("/admin/content", { params: { lang: "en", section: group } });
      const map = {}; data.content.forEach((d) => { map[d.key] = d; });
      setDocs(map);
      flash("Draft reverted to published version.");
    } catch { flash("Revert failed."); } finally { setBusyKey(""); }
  };

  const keys = useMemo(() => Object.keys(docs).sort(), [docs]);
  const dirty = (key) => edits[key] !== undefined && edits[key] !== draftOf(key);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Content</h1>
          <p className="mt-1 text-sm text-brand-muted">Edit the English website content. Save as draft, preview, then publish.</p>
        </div>
        <button onClick={() => setPreview(1440)} data-testid="content-preview-btn"
          className="inline-flex items-center gap-2 rounded-full border border-brand-line px-4 py-2 text-xs text-zinc-300 hover:border-blue-500/50 hover:text-white">
          <Monitor size={13} /> Preview site
        </button>
      </div>

      <div className="flex flex-wrap gap-2" data-testid="content-groups">
        {GROUPS.map((g) => (
          <button key={g.id} onClick={() => setGroup(g.id)} data-testid={`content-group-${g.id}`}
            className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
              group === g.id ? "border-blue-500/50 bg-blue-500/10 text-blue-300" : "border-brand-line text-zinc-400 hover:text-white"}`}>
            {g.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {keys.length === 0 && <p className="text-sm text-zinc-600">No content keys in this section.</p>}
        {keys.map((key) => {
          const isLong = draftOf(key).length > 60 || key.endsWith("_body") || key.startsWith("about.p");
          return (
            <div key={key} className="rounded-2xl border border-brand-line bg-zinc-950/70 p-5" data-testid={`content-key-${key}`}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[11px] tracking-wider text-blue-400">{key}</p>
                <div className="flex items-center gap-2">
                  {dirty(key) && <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-amber-300">Unsaved</span>}
                  <button onClick={() => revert(key)} disabled={busyKey === key} title="Revert draft to published"
                    className="rounded-lg border border-brand-line p-2 text-zinc-500 hover:text-white" data-testid={`content-revert-${key}`}><Undo2 size={13} /></button>
                  <button onClick={() => save(key, false)} disabled={busyKey === key} data-testid={`content-save-draft-${key}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-brand-line px-3 py-2 text-xs text-zinc-300 hover:border-blue-500/50 hover:text-white">
                    <Save size={12} /> {busyKey === key ? "…" : "Save draft"}
                  </button>
                  <button onClick={() => save(key, true)} disabled={busyKey === key} data-testid={`content-publish-${key}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black hover:bg-blue-500 hover:text-white">
                    <Send size={12} /> Publish
                  </button>
                </div>
              </div>
              {isLong ? (
                <textarea rows={4} data-testid={`content-input-${key}`} className="w-full rounded-xl border border-brand-line bg-black px-4 py-3 text-sm text-white focus:border-blue-500/70 focus:outline-none"
                  value={draftOf(key)} onChange={(e) => setEdits((s) => ({ ...s, [key]: e.target.value }))} />
              ) : (
                <input data-testid={`content-input-${key}`} className="w-full rounded-xl border border-brand-line bg-black px-4 py-3 text-sm text-white focus:border-blue-500/70 focus:outline-none"
                  value={draftOf(key)} onChange={(e) => setEdits((s) => ({ ...s, [key]: e.target.value }))} />
              )}
              <p className="mt-2 text-[11px] text-zinc-600">Published: {Array.isArray(docs[key]?.published_value) ? docs[key].published_value.join(" · ") : String(docs[key]?.published_value ?? "").slice(0, 120)}</p>
            </div>
          );
        })}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-brand-line bg-zinc-900 px-5 py-2.5 text-sm text-white shadow-2xl" role="status" data-testid="content-toast">
          {toast}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4" role="dialog" aria-modal="true" data-testid="content-preview-modal">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[["Desktop", Monitor, 1440], ["Tablet", Tablet, 768], ["Mobile", Smartphone, 390]].map(([label, Icon, w]) => (
                <button key={label} onClick={() => setPreview(w)} data-testid={`content-preview-${w}`}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs ${preview === w ? "border-blue-500/50 bg-blue-500/10 text-blue-300" : "border-brand-line text-zinc-400"}`}>
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>
            <button onClick={() => setPreview(null)} data-testid="content-preview-close" className="rounded-full border border-brand-line p-2 text-zinc-400 hover:text-white"><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-hidden rounded-xl border border-brand-line bg-white">
            <iframe
              title="Site preview"
              src={window.location.origin + (preview === 1440 ? "/" : `/`)}
              style={{ width: preview === 1440 ? "100%" : `${(preview / 1440) * 100}%`, height: preview === 1440 ? "100%" : `${(preview / 1440) * 100}%`, transform: preview === 1440 ? "none" : "scale(1)", transformOrigin: "top left", border: 0 }}
              className="h-full w-full"
            />
          </div>
          <p className="mt-2 text-center text-[11px] text-zinc-600">Drafts are shown because you are signed in as administrator.</p>
        </div>
      )}
    </div>
  );
}
