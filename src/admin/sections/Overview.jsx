import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Inbox, Eye, Activity, CheckCheck, ArrowUpRight } from "lucide-react";
import api from "@/lib/api";

const TOOLTIP = {
  contentStyle: {
    background: "#0A0A0A", border: "1px solid #262626", borderRadius: "12px",
    fontSize: "12px", color: "#fff",
  },
  labelStyle: { color: "#a1a1aa" },
};

export default function Overview() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    api.get("/admin/overview").then(({ data }) => setData(data)).catch(() => setErr(true));
  }, []);

  if (err) return <p className="text-sm text-red-400">Could not load overview.</p>;
  if (!data) return <p className="font-mono text-xs uppercase tracking-widest text-zinc-600">Loading…</p>;

  const stats = [
    { label: "New enquiries", value: data.new_enquiries, Icon: Inbox, testid: "overview-new-enquiries", accent: "#3B82F6" },
    { label: "Total enquiries", value: data.total_enquiries, Icon: Eye, testid: "overview-total-enquiries", accent: "#8B5CF6" },
    { label: "Replied", value: data.replied_enquiries, Icon: CheckCheck, testid: "overview-replied", accent: "#34D399" },
    { label: "Visits (7 days)", value: data.visits_7d, Icon: Activity, testid: "overview-visits", accent: "#F59E0B" },
  ];

  // Fill every day of the last 14 (UTC) so the area chart draws a continuous series even with sparse data
  const dailyMap = Object.fromEntries((data.daily || []).map((d) => [d.day, d.count]));
  const daily = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(Date.now() - (13 - i) * 86400000).toISOString().slice(0, 10);
    return { day, count: dailyMap[day] || 0 };
  });
  const hasVisits = (data.daily || []).length > 0;

  const reasonData = (data.by_reason || []).map((r) => ({ name: r.reason || "other", value: r.count }));
  const REASON_COLORS = ["#3B82F6", "#8B5CF6", "#34D399", "#F59E0B", "#EF4444", "#60A5FA"];

  return (
    <div className="space-y-8" data-testid="overview-root">
      <div>
        <h1 className="font-display text-2xl font-bold">Overview</h1>
        <p className="mt-1 text-sm text-brand-muted">A live pulse-check of the website.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-2xl border border-brand-line bg-zinc-950/70 p-6" data-testid={s.testid}>
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${s.accent}, transparent 70%)` }} />
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-zinc-500">{s.label}</p>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-line bg-zinc-900" style={{ color: s.accent }}>
                <s.Icon size={14} />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-line bg-zinc-950/70 p-6" data-testid="overview-visits-chart">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Visits — last 14 days</p>
          <div className="mt-4 h-56">
            {!hasVisits ? (
              <p className="text-sm text-zinc-600">No visits recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={daily} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1c1c26" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "#262626" }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fill: "#71717a", fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
                  <Tooltip {...TOOLTIP} cursor={{ stroke: "#3B82F6", strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} fill="url(#visitGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-brand-line bg-zinc-950/70 p-6" data-testid="overview-reason-chart">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Enquiries by reason</p>
          <div className="mt-4 flex h-56 items-center">
            {reasonData.length === 0 ? (
              <p className="text-sm text-zinc-600">No enquiries yet.</p>
            ) : (
              <>
              <ul className="order-2 ml-2 w-40 shrink-0 space-y-2" data-testid="overview-reason-legend">
                {reasonData.map((r, i) => (
                  <li key={r.name} className="flex items-center justify-between gap-3 text-xs">
                    <span className="flex items-center gap-2 capitalize text-zinc-300">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: REASON_COLORS[i % REASON_COLORS.length] }} />
                      {r.name}
                    </span>
                    <span className="font-mono text-zinc-500">{r.value}</span>
                  </li>
                ))}
              </ul>
              <ResponsiveContainer width="100%" height="100%" className="order-1">
                <PieChart>
                  <Pie data={reasonData} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={reasonData.length > 1 ? 3 : 0} stroke="#0A0A0A" strokeWidth={reasonData.length > 1 ? 2 : 0}>
                    {reasonData.map((_, i) => <Cell key={i} fill={REASON_COLORS[i % REASON_COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...TOOLTIP} />
                </PieChart>
              </ResponsiveContainer>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-line bg-zinc-950/70 p-6" data-testid="overview-popular">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Popular pages (7 days)</p>
          <div className="mt-4 h-56">
            {data.popular.length === 0 ? (
              <p className="text-sm text-zinc-600">No visits recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.popular} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#1c1c26" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="path" width={90} tick={{ fill: "#a1a1aa", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#262626" }} />
                  <Tooltip {...TOOLTIP} cursor={{ fill: "#12121c" }} />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[0, 6, 6, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-brand-line bg-zinc-950/70 p-6" data-testid="overview-recent">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-zinc-500">Recent enquiries</p>
            <Link to="/admin" onClick={() => window.dispatchEvent(new CustomEvent("admin-goto", { detail: "enquiries" }))} className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300" data-testid="overview-view-all">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-brand-line/60">
            {(data.recent || []).length === 0 && <li className="py-4 text-sm text-zinc-600">No enquiries yet.</li>}
            {(data.recent || []).map((e, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{e.name}</p>
                  <p className="truncate text-xs text-zinc-500">{e.subject || e.reason}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                  e.status === "new" ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                  : e.status === "replied" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-600 text-zinc-300"}`}>{e.status}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-brand-line/60 pt-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500">Site status</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-zinc-300">Maintenance mode</span>
                <span className={data.maintenance_enabled ? "text-amber-400" : "text-emerald-400"}>{data.maintenance_enabled ? "ON" : "OFF"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-zinc-300">Announcement banner</span>
                <span className={data.announcement_enabled ? "text-emerald-400" : "text-zinc-500"}>{data.announcement_enabled ? "ON" : "OFF"}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
