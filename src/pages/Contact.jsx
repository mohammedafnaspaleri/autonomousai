import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useSite } from "@/lib/site";
import api, { formatApiErrorDetail } from "@/lib/api";
import { Reveal, Eyebrow, MaskedLines } from "@/components/Reveal";
import Seo from "@/components/Seo";
import GlowBg from "@/components/GlowBg";
import { useId } from "react";

const REASON_KEYS = [
  ["general", "contact.reason_general"],
  ["business", "contact.reason_business"],
  ["collab", "contact.reason_collab"],
  ["careers", "contact.reason_careers"],
  ["investor", "contact.reason_investor"],
  ["other", "contact.reason_other"],
];

export default function Contact() {
  const { t, data } = useSite();
  const email = data?.settings?.contact_email || "autonomousai.support@gmail.com";
  const [form, setForm] = useState({ name: "", email: "", reason: "general", subject: "", message: "", company: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorDetail, setErrorDetail] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const formId = useId();

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));

  const submit = async (e) => {
    e.preventDefault();
    setErrorDetail("");
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setStatus("error"); setErrorDetail(t("contact.error_required")); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus("error"); setErrorDetail(t("contact.error_email")); return;
    }
    setStatus("sending");
    const started = Date.now();
    try {
      await api.post("/contact", { ...form, reason: form.reason, elapsed_ms: elapsed + (Date.now() - started) });
      setStatus("success");
    } catch (err) {
      const d = err?.response?.data?.detail;
      const map = { rate_limited: "contact.error_rate", duplicate: "contact.error_duplicate", too_fast: "contact.error_generic", invalid_input: "contact.error_required" };
      setStatus("error");
      setErrorDetail(map[d] ? t(map[d]) : (formatApiErrorDetail(d) || t("contact.error_generic")));
    }
  };

  const inputCls = "w-full rounded-xl border border-brand-line bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder:text-zinc-600 transition-colors focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/25";

  return (
    <div data-testid="page-contact" className="relative pt-16">
      <Seo title={t("nav.contact")} description={t("contact.intro")} />
      <GlowBg opacity={0.45} />
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal><Eyebrow>{t("contact.label")}</Eyebrow></Reveal>
            <MaskedLines lines={[t("contact.title")]} className="mt-5"
              lineClassName="font-display text-3xl font-bold leading-tight text-white sm:text-5xl" />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-muted">{t("contact.intro")}</p>
            </Reveal>
            <Reveal delay={0.28}>
              <div className="mt-10 rounded-2xl border border-brand-line bg-zinc-950/70 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">{t("contact.email_label")}</p>
                <a href={`mailto:${email}`} data-testid="contact-page-email" className="mt-3 block break-all font-display text-sm font-medium text-blue-400 hover:text-blue-300 sm:text-base">
                  {email}
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-3xl border border-brand-line bg-zinc-950/70 p-10 text-center"
                  data-testid="contact-success"
                  role="status"
                >
                  <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.15 }}>
                    <CheckCircle2 size={56} className="text-blue-400" strokeWidth={1.4} />
                  </motion.div>
                  <p className="mt-7 max-w-sm font-display text-lg font-medium leading-relaxed text-white sm:text-xl">
                    {t("contact.success")}
                  </p>
                  <div className="mt-8 h-px w-24 bg-gradient-to-r from-brand-blue to-brand-purple" />
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="rounded-3xl border border-brand-line bg-zinc-950/70 p-7 sm:p-9"
                  data-testid="contact-form"
                  noValidate
                  ref={(el) => { if (el && !elapsed) { const t = setTimeout(() => setElapsed(99999), 3000); } }}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`${formId}-name`} className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400">{t("contact.name")} *</label>
                      <input id={`${formId}-name`} data-testid="contact-input-name" className={inputCls} placeholder={t("contact.name_ph")} value={form.name} onChange={onChange("name")} autoComplete="name" />
                    </div>
                    <div>
                      <label htmlFor={`${formId}-email`} className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400">{t("contact.email")} *</label>
                      <input id={`${formId}-email`} data-testid="contact-input-email" type="email" className={inputCls} placeholder={t("contact.email_ph")} value={form.email} onChange={onChange("email")} autoComplete="email" />
                    </div>
                    <div>
                      <label htmlFor={`${formId}-reason`} className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400">{t("contact.reason")} *</label>
                      <select id={`${formId}-reason`} data-testid="contact-input-reason" className={inputCls} value={form.reason} onChange={onChange("reason")}>
                        {REASON_KEYS.map(([v, k]) => <option key={v} value={v} className="bg-zinc-950">{t(k)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`${formId}-subject`} className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400">{t("contact.subject")} *</label>
                      <input id={`${formId}-subject`} data-testid="contact-input-subject" className={inputCls} placeholder={t("contact.subject_ph")} value={form.subject} onChange={onChange("subject")} />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={`${formId}-message`} className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-400">{t("contact.message")} *</label>
                      <textarea id={`${formId}-message`} data-testid="contact-input-message" rows={6} className={inputCls} placeholder={t("contact.message_ph")} value={form.message} onChange={onChange("message")} />
                    </div>
                  </div>

                  {/* honeypot — hidden from humans */}
                  <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
                    <label htmlFor={`${formId}-company`}>{t("contact.verify_label")}</label>
                    <input id={`${formId}-company`} tabIndex={-1} autoComplete="off" value={form.company} onChange={onChange("company")} />
                  </div>

                  <div aria-live="polite" role="alert" className="min-h-[24px]">
                    {status === "error" && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        data-testid="contact-error" className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        <AlertCircle size={15} /> {errorDetail}
                      </motion.p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    data-testid="contact-submit"
                    className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple text-sm font-semibold text-white transition-all hover:shadow-[0_0_32px_rgba(99,102,241,0.45)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-9"
                  >
                    {status === "sending" ? (
                      <>
                        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white" />
                        {t("contact.sending")}
                      </>
                    ) : (
                      <>{t("contact.submit")} <Send size={15} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" /></>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
