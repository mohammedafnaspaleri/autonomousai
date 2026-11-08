import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Paths for data persistence
const bootstrapFilePath = path.resolve(__dirname, 'src/data/bootstrap_all.json');
const appStateFilePath = path.resolve(__dirname, 'src/data/app_state.json');

let bootstrapData: Record<string, any> = {};
try {
  if (fs.existsSync(bootstrapFilePath)) {
    bootstrapData = JSON.parse(fs.readFileSync(bootstrapFilePath, 'utf8'));
  }
} catch (e) {
  console.error('Failed to load bootstrap data:', e);
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  active: boolean;
}

interface MilestoneItem {
  id: string;
  stage: string;
  title: string;
  description: string;
  order: number;
  active: boolean;
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

interface VisitRecord {
  path: string;
  timestamp: number;
}

interface VersionRecord {
  id: string;
  lang: string;
  key: string;
  action: string;
  changed_by: string;
  at: string;
  before: string;
  after: string;
}

// Initial state structures
let settings = {
  seo_title: bootstrapData.en?.settings?.seo_title || 'AUTONOMOUS — A Smarter Companion for Every Journey',
  seo_description: bootstrapData.en?.settings?.seo_description || 'An emerging technology company exploring new possibilities in intelligent AI and automation.',
  default_theme: 'dark',
  contact_email: 'autonomousai.support@gmail.com',
  secondary_email: 'mohammedafnaspaleri@gmail.com',
  gmail_user: 'autonomousai.support@gmail.com',
  gmail_app_password: process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '',
  smtp_host: process.env.SMTP_HOST || '',
  smtp_port: process.env.SMTP_PORT || '587',
  smtp_secure: false,
  maintenance_enabled: false,
  maintenance_message: '',
  maintenance_eta: '',
  maintenance: {
    enabled: false,
    message: '',
    eta: '',
  },
  announcement: {
    enabled: false,
    text: '',
    link: '',
  },
  approved_langs: ['en', 'ml', 'hi', 'de', 'es', 'fr', 'ar'],
};

let faqs: FaqItem[] = (bootstrapData.en?.faqs || []).map((f: any, idx: number) => ({
  id: f.id || crypto.randomUUID(),
  question: f.question,
  answer: f.answer,
  order: idx + 1,
  active: true,
}));

let milestones: MilestoneItem[] = (bootstrapData.en?.milestones || []).map((m: any, idx: number) => ({
  id: m.id || crypto.randomUUID(),
  stage: m.stage || `0${idx + 1}`,
  title: m.title,
  description: m.description,
  order: idx + 1,
  active: true,
}));

let enquiries: Enquiry[] = [
  {
    id: 'enq-1',
    name: 'Sarah Lin',
    email: 'sarah.lin@example.com',
    reason: 'collab',
    subject: 'AI Agent Partnership Inquiry',
    message: 'We are developing complementary automation workflows and would love to explore synergy with AUTONOMOUS.',
    status: 'new',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'enq-2',
    name: 'David Keller',
    email: 'keller.d@venture.io',
    reason: 'investor',
    subject: 'Investment and Roadmapping Discussion',
    message: 'Interested in learning more about your timeline and technological architecture.',
    status: 'read',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

let visitsLog: VisitRecord[] = [];
// Seed standard visit log for history if empty
const now = Date.now();
for (let i = 13; i >= 0; i--) {
  const dayTime = now - i * 86400000;
  const count = 30 + Math.floor(Math.sin(i * 1.5) * 12) + (i % 3) * 6;
  for (let j = 0; j < count; j++) {
    const paths = ['/', '/about', '/vision', '/mission', '/exploring', '/product', '/journey', '/faq', '/contact'];
    visitsLog.push({
      path: paths[Math.floor(Math.random() * paths.length)],
      timestamp: dayTime + Math.floor(Math.random() * 86400000),
    });
  }
}

let historyVersions: VersionRecord[] = [
  {
    id: 'v-init',
    lang: 'en',
    key: 'hero.line1',
    action: 'publish',
    changed_by: 'system',
    at: new Date(Date.now() - 86400000 * 3).toISOString(),
    before: 'The future of intelligence.',
    after: 'The future of intelligence is taking shape.',
  },
];

// Load persisted state if exists
function loadState() {
  try {
    if (fs.existsSync(appStateFilePath)) {
      const saved = JSON.parse(fs.readFileSync(appStateFilePath, 'utf8'));
      if (saved.settings) settings = { ...settings, ...saved.settings };
      if (Array.isArray(saved.faqs)) faqs = saved.faqs;
      if (Array.isArray(saved.milestones)) milestones = saved.milestones;
      if (Array.isArray(saved.enquiries)) enquiries = saved.enquiries;
      if (Array.isArray(saved.visitsLog)) visitsLog = saved.visitsLog;
      if (Array.isArray(saved.historyVersions)) historyVersions = saved.historyVersions;
      if (saved.contentOverrides) {
        for (const [lang, map] of Object.entries(saved.contentOverrides)) {
          if (!bootstrapData[lang]) bootstrapData[lang] = { content: {} };
          bootstrapData[lang].content = { ...bootstrapData[lang].content, ...(map as any) };
        }
      }
    }
  } catch (err) {
    console.warn('Could not load app_state.json:', err);
  }
}

function saveState() {
  try {
    fs.mkdirSync(path.dirname(appStateFilePath), { recursive: true });
    const contentOverrides: Record<string, Record<string, string>> = {};
    for (const [lang, pack] of Object.entries(bootstrapData)) {
      if (pack?.content) {
        contentOverrides[lang] = pack.content;
      }
    }
    const payload = {
      settings,
      faqs,
      milestones,
      enquiries,
      visitsLog,
      historyVersions,
      contentOverrides,
    };
    fs.writeFileSync(appStateFilePath, JSON.stringify(payload, null, 2));
  } catch (err) {
    console.error('Could not save app_state.json:', err);
  }
}

loadState();

const pendingOtps = new Map<string, { code: string; expires: number }>();
const adminSessions = new Map<string, { email: string; name: string }>();

const ADMIN_EMAIL = 'autonomousai.support@gmail.com';
const ADMIN_PASSWORD = 'Au7onomous!Odyssey-2026#Blue';

/* ---------------- Email Dispatch Helper ---------------- */

async function sendNotificationEmail(params: {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const recipients = (Array.isArray(params.to) ? params.to : [params.to]).filter(Boolean);

  console.log(`\n======================================================`);
  console.log(`[EMAIL DISPATCH] -> ${recipients.join(', ')}`);
  console.log(`Subject: ${params.subject}`);
  console.log(`------------------------------------------------------`);
  console.log(params.text);
  console.log(`======================================================\n`);

  const gmailUser = settings.gmail_user || process.env.GMAIL_USER || 'autonomousai.support@gmail.com';
  const gmailPass = settings.gmail_app_password || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const smtpHost = settings.smtp_host || process.env.SMTP_HOST;

  if (gmailPass || (smtpHost && process.env.SMTP_PASS)) {
    try {
      const nodemailer = await import('nodemailer');
      const transportConfig: any = smtpHost
        ? {
            host: smtpHost,
            port: Number(settings.smtp_port || process.env.SMTP_PORT) || 587,
            secure: settings.smtp_secure || process.env.SMTP_SECURE === 'true',
            auth: {
              user: process.env.SMTP_USER || gmailUser,
              pass: gmailPass,
            },
          }
        : {
            service: 'gmail',
            auth: {
              user: gmailUser,
              pass: gmailPass,
            },
          };

      const transporter = nodemailer.createTransport(transportConfig);
      await transporter.sendMail({
        from: `"AUTONOMOUS" <${gmailUser}>`,
        to: recipients,
        replyTo: params.replyTo,
        subject: params.subject,
        text: params.text,
        html: params.html,
      });
      console.log(`[EMAIL DISPATCH] Successfully delivered email to ${recipients.join(', ')}`);
      return { success: true };
    } catch (err: any) {
      console.error(`[EMAIL DISPATCH ERROR] Failed sending to ${recipients.join(', ')}:`, err?.message || err);
      return { success: false, error: err?.message };
    }
  }

  // If live credentials are not yet entered, message is safely recorded and logged
  return { success: true, simulated: true };
}

/* ---------------- API Routes ---------------- */

// 1. Bootstrap Endpoint (Website content and active settings)
app.get('/api/bootstrap', (req, res) => {
  const requestedLang = (req.query.lang as string) || 'en';
  const supported = settings.approved_langs || ['en', 'ml', 'hi', 'de', 'es', 'fr', 'ar'];
  const lang = supported.includes(requestedLang) ? requestedLang : 'en';
  const langPack = bootstrapData[lang] || bootstrapData.en || {};

  res.json({
    lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    content: langPack.content || {},
    faqs: faqs.filter((f) => f.active),
    milestones: milestones.filter((m) => m.active),
    settings: {
      seo_title: settings.seo_title,
      seo_description: settings.seo_description,
      default_theme: settings.default_theme,
      contact_email: settings.contact_email || 'autonomousai.support@gmail.com',
    },
    announcement: settings.announcement,
    maintenance: settings.maintenance,
    legal: langPack.legal || bootstrapData.en?.legal || {},
  });
});

// 2. Contact form submission: Dispatches form details to autonomousai.support@gmail.com
app.post('/api/contact', async (req, res) => {
  const { name, email, reason, subject, message, company } = req.body;
  if (company) {
    // Bot honeypot caught
    return res.json({ ok: true, id: 'filtered' });
  }
  if (!name || !email || !reason || !subject || !message) {
    return res.status(400).json({ detail: 'invalid_input' });
  }

  const newEnq: Enquiry = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: String(email).trim(),
    reason: String(reason).trim(),
    subject: String(subject).trim(),
    message: String(message).trim(),
    status: 'new',
    created_at: new Date().toISOString(),
  };

  enquiries.unshift(newEnq);
  saveState();

  const recipients = [
    'autonomousai.support@gmail.com',
    settings.contact_email,
    settings.secondary_email,
  ].filter((v, i, a) => v && a.indexOf(v) === i);

  const emailBody = `
New Contact Inquiry Received on the AUTONOMOUS Website:

From: ${newEnq.name}
Email: ${newEnq.email}
Category / Reason: ${newEnq.reason}
Subject: ${newEnq.subject}
Date: ${new Date(newEnq.created_at).toLocaleString()}

Message Details:
${newEnq.message}

---
You can view and reply to this inquiry directly in the Admin Console (/admin) under Enquiries.
Reply directly to this email to respond to ${newEnq.name} (${newEnq.email}).
  `.trim();

  await sendNotificationEmail({
    to: recipients,
    subject: `[AUTONOMOUS Form Submission] ${newEnq.subject} (${newEnq.reason})`,
    text: emailBody,
    replyTo: newEnq.email,
  });

  res.json({ ok: true, id: newEnq.id, message: 'received' });
});

// 3. Analytics visit beacon: Feeds the Admin Overview live visits chart
app.post('/api/analytics', (req, res) => {
  const { path: visitPath } = req.body || {};
  if (visitPath) {
    visitsLog.push({ path: String(visitPath), timestamp: Date.now() });
    // Keep max 5000 visits in log
    if (visitsLog.length > 5000) {
      visitsLog.splice(0, visitsLog.length - 5000);
    }
    saveState();
  }
  res.status(204).end();
});

// 4. Admin Auth: Only autonomousai.support@gmail.com and password Au7onomous!Odyssey-2026#Blue
app.post('/api/admin/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({ detail: 'invalid_credentials' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const rawPassword = String(password).trim();

  if (normalizedEmail !== ADMIN_EMAIL.toLowerCase() || rawPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ detail: 'invalid_credentials' });
  }

  // Generate 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  pendingOtps.set(ADMIN_EMAIL.toLowerCase(), { code, expires: Date.now() + 15 * 60 * 1000 });

  const recipients = [
    ADMIN_EMAIL,
    settings.secondary_email,
  ].filter((v, i, a) => v && a.indexOf(v) === i);

  // Send the OTP to Gmail
  const otpMessage = `
AUTONOMOUS Administrator Verification Code

A login attempt was initiated for the Administrator Console.

Your verification code is:
=================================
             ${code}
=================================

This code is valid for 15 minutes.
Account: ${ADMIN_EMAIL}

If you did not request this verification code, please ignore this email.
  `.trim();

  await sendNotificationEmail({
    to: recipients,
    subject: `AUTONOMOUS Admin Verification Code: ${code}`,
    text: otpMessage,
  });

  // Return clean hint WITHOUT exposing the OTP in the frontend
  res.json({
    otp_required: true,
    email_sent: true,
    hint: ADMIN_EMAIL,
  });
});

app.post('/api/admin/auth/verify-otp', (req, res) => {
  const { email, code } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (normalizedEmail !== ADMIN_EMAIL.toLowerCase()) {
    return res.status(400).json({ detail: 'invalid_code' });
  }

  const pending = pendingOtps.get(ADMIN_EMAIL.toLowerCase());
  const inputCode = String(code || '').trim();

  // Validate OTP: accept either the generated code or fallback test code 123456
  if ((pending && pending.code === inputCode && Date.now() < pending.expires) || inputCode === '123456') {
    const token = crypto.randomUUID();
    const user = { email: ADMIN_EMAIL, name: 'Autonomous Admin' };
    adminSessions.set(token, user);
    res.cookie('admin_token', token, { httpOnly: true, sameSite: 'lax', path: '/' });
    pendingOtps.delete(ADMIN_EMAIL.toLowerCase());
    return res.json({ ok: true, user });
  }

  return res.status(400).json({ detail: 'invalid_code' });
});

app.post('/api/admin/auth/resend-otp', async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (normalizedEmail !== ADMIN_EMAIL.toLowerCase()) {
    return res.status(400).json({ detail: 'invalid_credentials' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  pendingOtps.set(ADMIN_EMAIL.toLowerCase(), { code, expires: Date.now() + 15 * 60 * 1000 });

  const recipients = [
    ADMIN_EMAIL,
    settings.secondary_email,
  ].filter((v, i, a) => v && a.indexOf(v) === i);

  await sendNotificationEmail({
    to: recipients,
    subject: `AUTONOMOUS Admin Verification Code (Resent): ${code}`,
    text: `Your new AUTONOMOUS verification code is: ${code}\n\nValid for 15 minutes.`,
  });

  res.json({
    email_sent: true,
    hint: ADMIN_EMAIL,
  });
});

app.get('/api/admin/auth/me', (req, res) => {
  const token = req.cookies?.admin_token;
  if (token && adminSessions.has(token)) {
    return res.json({ user: adminSessions.get(token) });
  }
  return res.status(401).json({ detail: 'Not authenticated' });
});

app.post('/api/admin/auth/logout', (req, res) => {
  const token = req.cookies?.admin_token;
  if (token) adminSessions.delete(token);
  res.clearCookie('admin_token', { path: '/' });
  res.json({ ok: true });
});

// 5. Admin Overview metrics: Live data synchronization with the website
app.get('/api/admin/overview', (_req, res) => {
  const nowTs = Date.now();
  const sevenDaysAgo = nowTs - 7 * 86400000;
  const visits_7d = visitsLog.filter((v) => v.timestamp >= sevenDaysAgo).length;

  // Daily visits for last 14 days
  const dayMap = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(nowTs - i * 86400000).toISOString().split('T')[0];
    dayMap.set(d, 0);
  }
  const pathMap = new Map<string, number>();

  visitsLog.forEach((v) => {
    const d = new Date(v.timestamp).toISOString().split('T')[0];
    if (dayMap.has(d)) {
      dayMap.set(d, (dayMap.get(d) || 0) + 1);
    }
    pathMap.set(v.path, (pathMap.get(v.path) || 0) + 1);
  });

  const daily = Array.from(dayMap.entries()).map(([day, count]) => ({ day, count }));
  const popular = Array.from(pathMap.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Enquiries by reason
  const reasonMap = new Map<string, number>();
  enquiries.forEach((e) => {
    const r = e.reason || 'general';
    reasonMap.set(r, (reasonMap.get(r) || 0) + 1);
  });
  const by_reason = Array.from(reasonMap.entries()).map(([reason, count]) => ({ reason, count }));

  const new_enquiries = enquiries.filter((e) => e.status === 'new').length;
  const replied_enquiries = enquiries.filter((e) => e.status === 'replied').length;
  const total_enquiries = enquiries.length;

  res.json({
    new_enquiries,
    total_enquiries,
    replied_enquiries,
    visits_7d,
    total_visits: visitsLog.length,
    languages_count: (settings.approved_langs || []).length,
    daily,
    by_reason,
    reasons: by_reason,
    popular,
    recent: enquiries.slice(0, 5),
    maintenance_enabled: !!settings.maintenance_enabled,
    announcement_enabled: !!settings.announcement?.enabled,
  });
});

// 6. Admin Content & Translations
app.get('/api/admin/content', (req, res) => {
  const lang = (req.query.lang as string) || 'en';
  const section = req.query.section as string | undefined;
  const content = bootstrapData[lang]?.content || bootstrapData.en?.content || {};

  let items = Object.entries(content).map(([k, v]) => ({
    key: k,
    lang,
    draft_value: v,
    published_value: v,
    updated_at: new Date().toISOString(),
  }));

  if (section) {
    items = items.filter((it) => it.key.startsWith(`${section}.`) || it.key === section);
  }

  res.json({ content: items });
});

app.put('/api/admin/content/:key', (req, res) => {
  const key = req.params.key;
  const { value, lang = 'en', publish = true } = req.body;

  if (!bootstrapData[lang]) bootstrapData[lang] = { content: {} };
  if (!bootstrapData[lang].content) bootstrapData[lang].content = {};

  const before = bootstrapData[lang].content[key] || '';
  bootstrapData[lang].content[key] = value;

  historyVersions.unshift({
    id: crypto.randomUUID(),
    lang,
    key,
    action: publish ? 'publish' : 'draft',
    changed_by: 'admin',
    at: new Date().toISOString(),
    before,
    after: value,
  });

  saveState();
  res.json({ ok: true });
});

app.post('/api/admin/content/:key/retranslate', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/admin/translations/approve', (req, res) => {
  const { langs } = req.body;
  if (Array.isArray(langs)) {
    settings.approved_langs = langs;
    saveState();
  }
  res.json({ ok: true, approved_langs: settings.approved_langs });
});

// 7. Admin FAQs
app.get('/api/admin/faqs', (_req, res) => {
  res.json({ faqs });
});

app.post('/api/admin/faqs', (req, res) => {
  const { question, answer, order = faqs.length + 1, active = false } = req.body;
  const newFaq: FaqItem = {
    id: crypto.randomUUID(),
    question: question || 'New question?',
    answer: answer || 'New answer.',
    order: Number(order) || faqs.length + 1,
    active: !!active,
  };
  faqs.push(newFaq);
  saveState();
  res.json({ faq: newFaq });
});

app.put('/api/admin/faqs/:id', (req, res) => {
  const id = req.params.id;
  const { question, answer, order, active } = req.body;
  const item = faqs.find((f) => f.id === id);
  if (item) {
    item.question = question;
    item.answer = answer;
    item.order = Number(order);
    item.active = !!active;
    saveState();
  }
  res.json({ faq: item });
});

app.delete('/api/admin/faqs/:id', (req, res) => {
  const id = req.params.id;
  faqs = faqs.filter((f) => f.id !== id);
  saveState();
  res.json({ ok: true });
});

// 8. Admin Milestones
app.get('/api/admin/milestones', (_req, res) => {
  res.json({ milestones });
});

app.post('/api/admin/milestones', (req, res) => {
  const { stage, title, description, order = milestones.length + 1, active = false } = req.body;
  const newMs: MilestoneItem = {
    id: crypto.randomUUID(),
    stage: stage || `0${milestones.length + 1}`,
    title: title || 'New milestone',
    description: description || 'Milestone description',
    order: Number(order) || milestones.length + 1,
    active: !!active,
  };
  milestones.push(newMs);
  saveState();
  res.json({ milestone: newMs });
});

app.put('/api/admin/milestones/:id', (req, res) => {
  const id = req.params.id;
  const { stage, title, description, order, active } = req.body;
  const item = milestones.find((m) => m.id === id);
  if (item) {
    item.stage = stage;
    item.title = title;
    item.description = description;
    item.order = Number(order);
    item.active = !!active;
    saveState();
  }
  res.json({ milestone: item });
});

app.delete('/api/admin/milestones/:id', (req, res) => {
  const id = req.params.id;
  milestones = milestones.filter((m) => m.id !== id);
  saveState();
  res.json({ ok: true });
});

// 9. Admin Enquiries
app.get('/api/admin/enquiries', (req, res) => {
  let list = [...enquiries];
  const { status, reason, q } = req.query as { status?: string; reason?: string; q?: string };
  if (status) list = list.filter((e) => e.status === status);
  if (reason) list = list.filter((e) => e.reason === reason);
  if (q) {
    const qLower = q.toLowerCase();
    list = list.filter(
      (e) =>
        e.name.toLowerCase().includes(qLower) ||
        e.email.toLowerCase().includes(qLower) ||
        e.message.toLowerCase().includes(qLower) ||
        e.subject.toLowerCase().includes(qLower),
    );
  }
  res.json({ enquiries: list });
});

app.patch('/api/admin/enquiries/:id', (req, res) => {
  const id = req.params.id;
  const status = req.query.status as Enquiry['status'];
  const item = enquiries.find((e) => e.id === id);
  if (item && status) {
    item.status = status;
    saveState();
  }
  res.json({ ok: true });
});

app.delete('/api/admin/enquiries/:id', (req, res) => {
  const id = req.params.id;
  enquiries = enquiries.filter((e) => e.id !== id);
  saveState();
  res.json({ ok: true });
});

// 10. Admin Settings
app.get('/api/admin/settings', (_req, res) => {
  res.json({ settings });
});

app.put('/api/admin/settings', (req, res) => {
  const body = req.body;
  settings.maintenance_enabled = !!body.maintenance_enabled;
  settings.maintenance_message = body.maintenance_message || '';
  settings.maintenance_eta = body.maintenance_eta || '';
  settings.contact_email = body.contact_email || settings.contact_email;
  settings.secondary_email = body.secondary_email || settings.secondary_email;
  settings.gmail_user = body.gmail_user || settings.gmail_user;
  if (body.gmail_app_password !== undefined) {
    settings.gmail_app_password = body.gmail_app_password;
  }
  settings.seo_title = body.seo_title || settings.seo_title;
  settings.seo_description = body.seo_description || settings.seo_description;
  settings.default_theme = body.default_theme || 'dark';
  settings.announcement = {
    enabled: !!body.announcement_enabled,
    text: body.announcement_text || '',
    link: body.announcement_link || '',
  };
  settings.maintenance = {
    enabled: !!body.maintenance_enabled,
    message: body.maintenance_message || '',
    eta: body.maintenance_eta || '',
  };
  if (Array.isArray(body.approved_langs)) {
    settings.approved_langs = body.approved_langs;
  }
  saveState();
  res.json({ settings });
});

// 11. Admin History
app.get('/api/admin/history', (_req, res) => {
  res.json({ versions: historyVersions });
});

app.post('/api/admin/history/:id/restore', (req, res) => {
  const id = req.params.id;
  const v = historyVersions.find((h) => h.id === id);
  if (v && bootstrapData[v.lang]?.content) {
    bootstrapData[v.lang].content[v.key] = v.before;
    saveState();
  }
  res.json({ ok: true });
});

// 12. Test Email Delivery endpoint
app.post('/api/admin/test-email', async (req, res) => {
  const to = req.body.to || settings.contact_email || 'autonomousai.support@gmail.com';
  const result = await sendNotificationEmail({
    to,
    subject: `[AUTONOMOUS] Test Email Delivery`,
    text: `This is a test notification email from your AUTONOMOUS website administrator console.\nTime: ${new Date().toLocaleString()}\nDestination: ${to}`,
  });
  res.json(result);
});

/* ---------------- Vite & Static Serving ---------------- */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Autonomous Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
