import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import {
  LayoutDashboard, FileText, Languages, Milestone, HelpCircle, Inbox,
  Megaphone, Settings, History, ExternalLink, LogOut,
} from "lucide-react";
import Overview from "./sections/Overview";
import ContentEditor from "./sections/ContentEditor";
import Translations from "./sections/Translations";
import FaqsMilestones from "./sections/FaqsMilestones";
import Enquiries from "./sections/Enquiries";
import SettingsAdmin from "./sections/SettingsAdmin";
import HistoryAdmin from "./sections/HistoryAdmin";
import { LogoMark } from "@/components/Logo";

const NAV = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "content", label: "Content", Icon: FileText },
  { id: "translations", label: "Translations", Icon: Languages },
  { id: "faqs", label: "FAQs & Journey", Icon: HelpCircle },
  { id: "enquiries", label: "Enquiries", Icon: Inbox },
  { id: "settings", label: "Settings", Icon: Settings },
  { id: "history", label: "History", Icon: History },
];

export default function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    await api.post("/admin/auth/logout").catch(() => {});
    onLogout();
  };

  const NavList = () => (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {NAV.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => { setTab(id); setMobileOpen(false); }}
          data-testid={`admin-nav-${id}`}
          className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
            tab === id ? "bg-blue-500/10 text-blue-300 border border-blue-500/25" : "text-zinc-400 border border-transparent hover:bg-white/5 hover:text-white"}`}
        >
          <Icon size={16} strokeWidth={1.7} /> {label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-black text-white" data-testid="admin-dashboard">
      <div className="mx-auto flex max-w-[1500px]">
        {/* sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-e border-brand-line bg-zinc-950/60 p-5 lg:flex">
          <div className="mb-8 flex items-center gap-3">
            <LogoMark className="h-7" />
            <div>
              <p className="font-display text-sm font-semibold">AUTONOMOUS</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">Admin Console</p>
            </div>
          </div>
          <NavList />
          <div className="mt-auto space-y-2 pt-6">
            <Link to="/" target="_blank" data-testid="admin-view-site"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white">
              <ExternalLink size={15} /> View site
            </Link>
            <button onClick={logout} data-testid="admin-logout"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-zinc-400 hover:bg-red-500/10 hover:text-red-300">
              <LogOut size={15} /> Sign out
            </button>
            <p className="px-4 pt-2 text-[11px] text-zinc-700">{user?.email}</p>
          </div>
        </aside>

        {/* main */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-brand-line bg-black/85 px-5 glass sm:px-8 lg:hidden">
            <div className="flex items-center gap-3">
              <LogoMark className="h-6" />
              <p className="font-display text-sm font-semibold">Admin</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" target="_blank" className="rounded-full border border-brand-line p-2 text-zinc-400"><ExternalLink size={14} /></Link>
              <button onClick={logout} className="rounded-full border border-brand-line p-2 text-zinc-400"><LogOut size={14} /></button>
              <button onClick={() => setMobileOpen((o) => !o)} data-testid="admin-mobile-nav"
                className="rounded-full border border-brand-line p-2 text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
              </button>
            </div>
          </header>
          {mobileOpen && (
            <div className="border-b border-brand-line bg-zinc-950 p-4 lg:hidden">
              <NavList />
            </div>
          )}

          <main className="p-5 sm:p-8">
            {tab === "overview" && <Overview />}
            {tab === "content" && <ContentEditor />}
            {tab === "translations" && <Translations />}
            {tab === "faqs" && <FaqsMilestones />}
            {tab === "enquiries" && <Enquiries />}
            {tab === "settings" && <SettingsAdmin />}
            {tab === "history" && <HistoryAdmin />}
          </main>
        </div>
      </div>
    </div>
  );
}
