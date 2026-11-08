import { useEffect, useState } from "react";
import { History, RotateCcw, ScrollText } from "lucide-react";
import api from "@/lib/api";

export default function HistoryAdmin() {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(null);
  const [toast, setToast] = useState("");

  const load = () => api.get("/admin/history").then(({ data }) => setData(data)).catch(() => setToast("Load failed."));
  useEffect(() => { load(); }, []);

  const restore = async (id) => {
    try { await api.post(`/admin/history/${id}/restore`); setToast("Version restored."); load(); }
    catch { setToast("Restore failed."); }
  };

  if (!data) return <p className="font-mono text-xs uppercase tracking-widest text-zinc-600">Loading…</p>;

  return (
    <div className="space-y-10" data-testid="admin-history">
      {toast && <p className="text-sm text-blue-300" role="status">{toast}</p>}

      <section>
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold"><History size={20} /> Version history</h1>
        <p className="mt-1 text-sm text-brand-muted">Every content change, with before-and-after comparison and one-click restore.</p>
        <div className="mt-6 space-y-3">
          {data.versions.length === 0 && <p className="text-sm text-zinc-600">No changes recorded yet.</p>}
          {data.versions.map((v) => (
            <div key={v.id} className="rounded-xl border border-brand-line bg-zinc-950/70 p-4" data-testid={`version-${v.id}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-blue-400">{v.lang}:{v.key} · <span className="text-zinc-500">{v.action}</span></p>
                  <p className="mt-1 text-[11px] text-zinc-600">{v.changed_by} · {new Date(v.at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setOpen(open === v.id ? null : v.id)} data-testid={`version-diff-${v.id}`}
                    className="rounded-lg border border-brand-line px-3 py-1.5 text-xs text-zinc-300 hover:text-white">Compare</button>
                  {v.key !== "settings" && (
                    <button onClick={() => restore(v.id)} data-testid={`version-restore-${v.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/10">
                      <RotateCcw size={11} /> Restore
                    </button>
                  )}
                </div>
              </div>
              {open === v.id && (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                    <p className="mb-2 text-[10px] uppercase tracking-wider text-red-300">Before</p>
                    <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs text-zinc-400">{JSON.stringify(v.old_value, null, 2) || "—"}</pre>
                  </div>
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <p className="mb-2 text-[10px] uppercase tracking-wider text-emerald-300">After</p>
                    <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs text-zinc-400">{JSON.stringify(v.new_value, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><ScrollText size={17} /> Audit log</h2>
        <div className="mt-5 overflow-hidden rounded-xl border border-brand-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 text-[11px] uppercase tracking-wider text-zinc-500">
              <tr><th className="px-4 py-3">When</th><th className="px-4 py-3">Actor</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Target</th></tr>
            </thead>
            <tbody className="divide-y divide-brand-line/60">
              {data.audit.length === 0 && <tr><td colSpan="4" className="px-4 py-4 text-zinc-600">No entries yet.</td></tr>}
              {data.audit.map((a, i) => (
                <tr key={a.id || i} className="bg-zinc-950/50 text-zinc-300">
                  <td className="px-4 py-2.5 text-xs text-zinc-500">{new Date(a.at).toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-xs">{a.actor}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-blue-300">{a.action}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-zinc-500">{a.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
