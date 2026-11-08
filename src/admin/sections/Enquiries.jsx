import { useEffect, useState } from "react";
import { Search, Mail, CheckCheck, Reply, Trash2 } from "lucide-react";
import api from "@/lib/api";

const REASONS = ["", "general", "business", "collab", "careers", "investor", "other"];
const STATUS_STYLES = {
  new: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  read: "border-zinc-600 text-zinc-300",
  replied: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
};

export default function Enquiries() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  const load = () => {
    const params = {};
    if (status) params.status = status;
    if (reason) params.reason = reason;
    if (q) params.q = q;
    api.get("/admin/enquiries", { params }).then(({ data }) => setItems(data.enquiries)).catch(() => {});
  };
  useEffect(() => { load(); }, [status, reason]);

  const mark = async (id, s) => {
    await api.patch(`/admin/enquiries/${id}?status=${s}`).catch(() => {});
    load();
    if (selected?.id === id) setSelected({ ...selected, status: s });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this enquiry permanently? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/enquiries/${id}`);
      if (selected?.id === id) setSelected(null);
      load();
    } catch {
      window.alert("Could not delete the enquiry.");
    }
  };

  return (
    <div className="space-y-6" data-testid="admin-enquiries">
      <div>
        <h1 className="font-display text-2xl font-bold">Enquiries</h1>
        <p className="mt-1 text-sm text-brand-muted">Every submission from the website contact form.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Search name, email, subject…"
            data-testid="enquiry-search"
            className="w-full rounded-full border border-brand-line bg-zinc-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/70 focus:outline-none" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} data-testid="enquiry-filter-status"
          className="rounded-full border border-brand-line bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300">
          <option value="">All statuses</option><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option>
        </select>
        <select value={reason} onChange={(e) => setReason(e.target.value)} data-testid="enquiry-filter-reason"
          className="rounded-full border border-brand-line bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300">
          {REASONS.map((r) => <option key={r} value={r}>{r === "" ? "All reasons" : r}</option>)}
        </select>
        <button onClick={load} data-testid="enquiry-search-btn" className="rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-black">Search</button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-zinc-600" data-testid="enquiry-empty">No enquiries match.</p>}
        {items.map((e) => (
          <div key={e.id} className="rounded-xl border border-brand-line bg-zinc-950/70 p-4" data-testid={`enquiry-${e.id}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <button className="min-w-0 flex-1 text-left" onClick={() => setSelected(e)} data-testid={`enquiry-open-${e.id}`}>
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-white">
                  {e.name}
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_STYLES[e.status] || ""}`} data-testid={`enquiry-status-${e.id}`}>{e.status}</span>
                </p>
                <p className="mt-1 truncate text-xs text-zinc-500">{e.email} · {e.reason} · {new Date(e.created_at).toLocaleString()}</p>
                <p className="mt-1.5 truncate text-sm text-zinc-300">{e.subject}</p>
              </button>
              <div className="flex shrink-0 items-center gap-2">
                <a href={`mailto:${e.email}`} data-testid={`enquiry-mailto-${e.id}`} className="rounded-lg border border-brand-line p-2 text-zinc-400 hover:text-white" title="Reply by email"><Mail size={13} /></a>
                {e.status === "new" && (
                  <button onClick={() => mark(e.id, "read")} data-testid={`enquiry-mark-read-${e.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-brand-line px-3 py-1.5 text-xs text-zinc-300 hover:text-white">
                    <CheckCheck size={12} /> Mark read
                  </button>
                )}
                {e.status !== "replied" && (
                  <button onClick={() => mark(e.id, "replied")} data-testid={`enquiry-mark-replied-${e.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/10">
                    <Reply size={12} /> Replied
                  </button>
                )}
                <button onClick={() => remove(e.id)} data-testid={`enquiry-delete-${e.id}`} title="Delete enquiry"
                  className="rounded-lg border border-red-500/40 p-2 text-red-400 hover:bg-red-500/10">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-5" role="dialog" aria-modal="true" onClick={() => setSelected(null)} data-testid="enquiry-detail-modal">
          <div className="w-full max-w-lg rounded-2xl border border-brand-line bg-zinc-950 p-7" onClick={(ev) => ev.stopPropagation()}>
            <p className="font-display text-lg font-semibold text-white">{selected.subject}</p>
            <p className="mt-2 text-xs text-zinc-500">{selected.name} · {selected.email} · {selected.reason} · {new Date(selected.created_at).toLocaleString()}</p>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{selected.message}</p>
            <div className="mt-7 flex justify-end gap-3">
              <button onClick={() => remove(selected.id)} data-testid="enquiry-detail-delete" className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 px-5 py-2 text-sm text-red-300 hover:bg-red-500/10">
                <Trash2 size={13} /> Delete
              </button>
              <button onClick={() => setSelected(null)} data-testid="enquiry-detail-close" className="rounded-full border border-brand-line px-5 py-2 text-sm text-zinc-300 hover:text-white">Close</button>
              <a href={`mailto:${selected.email}`} className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black">Reply by email</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
