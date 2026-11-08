import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import api, { formatApiErrorDetail } from "@/lib/api";

function FaqAdmin() {
  const [faqs, setFaqs] = useState([]);
  const [toast, setToast] = useState("");
  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 2400); };

  const load = () => api.get("/admin/faqs").then(({ data }) => setFaqs(data.faqs)).catch(() => flash("Load failed."));
  useEffect(() => { load(); }, []);

  const upd = (id, patch) => setFaqs((fs) => fs.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const save = async (f) => {
    try {
      await api.put(`/admin/faqs/${f.id}`, { question: f.question, answer: f.answer, order: Number(f.order) || 0, active: !!f.active });
      flash("FAQ saved.");
      load();
    } catch (e) { flash(formatApiErrorDetail(e?.response?.data?.detail) || "Save failed."); }
  };

  const create = async () => {
    try {
      await api.post("/admin/faqs", { question: "New question?", answer: "New answer.", order: faqs.length + 1, active: false });
      load();
    } catch { flash("Create failed."); }
  };

  const remove = async (id) => {
    try { await api.delete(`/admin/faqs/${id}`); load(); } catch { flash("Delete failed."); }
  };

  const inputCls = "w-full rounded-lg border border-brand-line bg-black px-3 py-2 text-sm text-white focus:border-blue-500/70 focus:outline-none";

  return (
    <div className="space-y-4" data-testid="admin-faqs">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">FAQs</h2>
        <button onClick={create} data-testid="faq-create" className="inline-flex items-center gap-2 rounded-full border border-brand-line px-4 py-2 text-xs text-zinc-300 hover:text-white">
          <Plus size={13} /> Add FAQ
        </button>
      </div>
      {faqs.map((f) => (
        <div key={f.id} className="rounded-xl border border-brand-line bg-zinc-950/70 p-4" data-testid={`faq-item-${f.id}`}>
          <div className="mb-2 flex items-center gap-3">
            <input className="w-16 rounded-lg border border-brand-line bg-black px-2 py-1.5 text-center font-mono text-xs text-white" value={f.order}
              onChange={(e) => upd(f.id, { order: e.target.value })} aria-label="Order" />
            <input className={inputCls} value={f.question} onChange={(e) => upd(f.id, { question: e.target.value })} data-testid={`faq-question-input-${f.id}`} />
            <label className="flex shrink-0 items-center gap-1.5 text-xs text-zinc-400">
              <input type="checkbox" checked={f.active} onChange={(e) => upd(f.id, { active: e.target.checked })} data-testid={`faq-active-${f.id}`} /> Live
            </label>
          </div>
          <textarea rows={3} className={inputCls} value={f.answer} onChange={(e) => upd(f.id, { answer: e.target.value })} data-testid={`faq-answer-input-${f.id}`} />
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={() => remove(f.id)} data-testid={`faq-delete-${f.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">
              <Trash2 size={12} /> Delete
            </button>
            <button onClick={() => save(f)} data-testid={`faq-save-${f.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-blue-500 hover:text-white">
              <Save size={12} /> Save
            </button>
          </div>
        </div>
      ))}
      {toast && <p className="text-sm text-blue-300" role="status">{toast}</p>}
    </div>
  );
}

function MilestoneAdmin() {
  const [ms, setMs] = useState([]);
  const [toast, setToast] = useState("");
  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 2400); };

  const load = () => api.get("/admin/milestones").then(({ data }) => setMs(data.milestones)).catch(() => flash("Load failed."));
  useEffect(() => { load(); }, []);

  const upd = (id, patch) => setMs((arr) => arr.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const save = async (m) => {
    try {
      await api.put(`/admin/milestones/${m.id}`, { stage: m.stage, title: m.title, description: m.description, order: Number(m.order) || 0, active: !!m.active });
      flash("Milestone saved.");
      load();
    } catch (e) { flash(formatApiErrorDetail(e?.response?.data?.detail) || "Save failed."); }
  };

  const create = async () => {
    try {
      await api.post("/admin/milestones", { stage: `0${ms.length + 1}`, title: "New milestone", description: "Describe this stage…", order: ms.length + 1, active: false });
      load();
    } catch { flash("Create failed."); }
  };

  const remove = async (id) => { try { await api.delete(`/admin/milestones/${id}`); load(); } catch { flash("Delete failed."); } };

  const inputCls = "w-full rounded-lg border border-brand-line bg-black px-3 py-2 text-sm text-white focus:border-blue-500/70 focus:outline-none";

  return (
    <div className="space-y-4" data-testid="admin-milestones">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Journey milestones</h2>
        <button onClick={create} data-testid="milestone-create" className="inline-flex items-center gap-2 rounded-full border border-brand-line px-4 py-2 text-xs text-zinc-300 hover:text-white">
          <Plus size={13} /> Add milestone
        </button>
      </div>
      {ms.map((m) => (
        <div key={m.id} className="rounded-xl border border-brand-line bg-zinc-950/70 p-4" data-testid={`milestone-item-${m.id}`}>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <input className="w-16 rounded-lg border border-brand-line bg-black px-2 py-1.5 text-center font-mono text-xs text-white" value={m.stage} onChange={(e) => upd(m.id, { stage: e.target.value })} aria-label="Stage" />
            <input className={`${inputCls} flex-1`} value={m.title} onChange={(e) => upd(m.id, { title: e.target.value })} data-testid={`milestone-title-input-${m.id}`} />
            <input className="w-16 rounded-lg border border-brand-line bg-black px-2 py-1.5 text-center font-mono text-xs text-white" value={m.order} onChange={(e) => upd(m.id, { order: e.target.value })} aria-label="Order" />
            <label className="flex shrink-0 items-center gap-1.5 text-xs text-zinc-400">
              <input type="checkbox" checked={m.active} onChange={(e) => upd(m.id, { active: e.target.checked })} data-testid={`milestone-active-${m.id}`} /> Live
            </label>
          </div>
          <textarea rows={2} className={inputCls} value={m.description} onChange={(e) => upd(m.id, { description: e.target.value })} data-testid={`milestone-desc-input-${m.id}`} />
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={() => remove(m.id)} data-testid={`milestone-delete-${m.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">
              <Trash2 size={12} /> Delete
            </button>
            <button onClick={() => save(m)} data-testid={`milestone-save-${m.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-blue-500 hover:text-white">
              <Save size={12} /> Save
            </button>
          </div>
        </div>
      ))}
      {toast && <p className="text-sm text-blue-300" role="status">{toast}</p>}
    </div>
  );
}

export default function FaqsMilestones() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold">FAQs & Journey</h1>
        <p className="mt-1 text-sm text-brand-muted">Everything here is editable — changes are live immediately and recorded in History.</p>
      </div>
      <FaqAdmin />
      <div className="h-px bg-brand-line" />
      <MilestoneAdmin />
    </div>
  );
}
