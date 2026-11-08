import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import api, { formatApiErrorDetail } from "@/lib/api";
import { LogoMark } from "@/components/Logo";

export default function AdminLogin({ onAuthed }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const inputCls = "w-full rounded-xl border border-brand-line bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/25";

  const step1 = async (e) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const { data } = await api.post("/admin/auth/login", { email, password });
      setHint(data.hint || "");
      setStep(2);
    } catch (err) {
      const d = err?.response?.data?.detail;
      setError(d === "invalid_credentials" ? "Incorrect email or password."
        : d === "locked" ? "Too many attempts. Try again in 15 minutes."
        : d === "rate_limited" ? "Too many attempts. Try again later."
        : formatApiErrorDetail(d) || "Sign-in failed.");
    } finally { setBusy(false); }
  };

  const step2 = async (e) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const { data } = await api.post("/admin/auth/verify-otp", { email, code });
      onAuthed(data.user);
    } catch (err) {
      const d = err?.response?.data?.detail;
      setError(d === "invalid_code" ? "Invalid or expired code." : formatApiErrorDetail(d) || "Verification failed.");
    } finally { setBusy(false); }
  };

  const resend = async () => {
    setBusy(true); setError("");
    try {
      const { data } = await api.post("/admin/auth/resend-otp", { email });
      if (!data.email_sent) setError("Code could not be emailed right now — check that email sending is available and try again.");
      else setError("");
    } catch (err) {
      setError("Could not resend. Try again shortly.");
    } finally { setBusy(false); }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-5" data-testid="admin-login">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 45% 35% at 50% 20%, rgba(59,130,246,0.1), transparent 70%)" }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative w-full max-w-md rounded-2xl border border-brand-line bg-zinc-950/90 p-8 sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark className="h-10" />
          <h1 className="mt-5 font-display text-xl font-bold text-white">Administrator Access</h1>
          <p className="mt-2 text-sm text-brand-muted">
            {step === 1 ? "Sign in with your administrator credentials." : `Enter the 6-digit code sent to ${hint || email}.`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={step1} className="space-y-4" data-testid="admin-login-form">
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input id="admin-email" data-testid="admin-input-email" type="email" required className={`${inputCls} pl-10`}
                  value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
              </div>
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input id="admin-password" data-testid="admin-input-password" type="password" required className={`${inputCls} pl-10`}
                  value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
              </div>
            </div>
            {error && <p role="alert" data-testid="admin-login-error" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
            <button type="submit" disabled={busy} data-testid="admin-login-submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple text-sm font-semibold text-white transition-all hover:shadow-[0_0_28px_rgba(99,102,241,0.4)] disabled:opacity-60">
              {busy ? "Verifying…" : "Continue"}
              <ShieldCheck size={15} />
            </button>
          </form>
        ) : (
          <form onSubmit={step2} className="space-y-4" data-testid="admin-otp-form">
            <div>
              <label htmlFor="admin-otp" className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400">Verification code</label>
              <input id="admin-otp" data-testid="admin-input-otp" inputMode="numeric" pattern="[0-9]*" maxLength={6} required
                className={`${inputCls} text-center font-mono text-xl tracking-[0.5em]`}
                value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} autoComplete="one-time-code" />
            </div>
            {error && <p role="alert" data-testid="admin-otp-error" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
            <button type="submit" disabled={busy} data-testid="admin-otp-submit"
              className="flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-brand-blue to-brand-purple text-sm font-semibold text-white disabled:opacity-60">
              {busy ? "Verifying…" : "Sign in"}
            </button>
            <div className="flex items-center justify-between text-xs">
              <button type="button" onClick={() => { setStep(1); setError(""); }} data-testid="admin-otp-back"
                className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300">
                <ArrowLeft size={12} /> Back
              </button>
              <button type="button" onClick={resend} disabled={busy} data-testid="admin-otp-resend" className="text-blue-400 hover:text-blue-300">
                Resend code
              </button>
            </div>
          </form>
        )}
        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-700">Private area — authorized access only</p>
      </motion.div>
    </div>
  );
}
