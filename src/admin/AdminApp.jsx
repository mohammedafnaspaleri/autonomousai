import { useEffect, useState } from "react";
import api from "@/lib/api";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";

export default function AdminApp() {
  const [user, setUser] = useState(undefined); // undefined = checking

  useEffect(() => {
    api.get("/admin/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-600">Verifying session…</p>
      </div>
    );
  }
  if (!user) return <AdminLogin onAuthed={setUser} />;
  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}
