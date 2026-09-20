import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { append, readAll } from './store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

// Simple in-memory rate limit: max 3 messages per 10 minutes per client.
// Keeps the contact form spam-friendly without external dependencies.
const contactHits = new Map();
app.use('/api/contact', (req, res, next) => {
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown';
  const now = Date.now();
  const recent = (contactHits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 3) {
    return res
      .status(429)
      .json({ success: false, message: 'Too many messages — please wait a few minutes and try again.' });
  }
  recent.push(now);
  contactHits.set(ip, recent);
  next();
});

const TO_EMAIL = process.env.TO_EMAIL || 'abdulrahman.digimarketing@gmail.com';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Email transport.
 *  1) RESEND_API_KEY set  -> send over HTTPS (port 443). Works on Render's free plan.
 *  2) SMTP_PASS set       -> Nodemailer SMTP (works locally / on paid hosts, but Render's
 *                            free plan blocks SMTP ports 25/465/587).
 *  3) neither             -> email disabled, submissions are only stored.
 */
function buildSmtp() {
  const pass = process.env.SMTP_PASS;
  if (!pass || pass.startsWith('your-')) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: { user: process.env.SMTP_USER, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

const RESEND_KEY = (process.env.RESEND_API_KEY || '').trim();
const RESEND_FROM = process.env.RESEND_FROM || 'Rahman Portfolio <onboarding@resend.dev>';
const smtp = RESEND_KEY ? null : buildSmtp();
const mailMode = RESEND_KEY ? 'resend' : smtp ? 'smtp' : 'none';

async function sendViaResend({ subject, text, html, replyTo }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: RESEND_FROM, to: [TO_EMAIL], reply_to: replyTo, subject, text, html }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

async function sendMail(payload) {
  if (mailMode === 'resend') return sendViaResend(payload);
  return smtp.sendMail({
    from: `"Rahman Portfolio" <${process.env.SMTP_USER}>`,
    to: TO_EMAIL,
    replyTo: payload.replyTo,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
}

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function renderHtml(submission) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden">
      <div style="background:linear-gradient(120deg,#3b82f6,#8b5cf6);padding:18px 24px;color:#fff">
        <h2 style="margin:0;font-size:18px">📬 New Portfolio Enquiry</h2>
      </div>
      <div style="padding:24px;color:#111827;line-height:1.6;font-size:14px">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#6b7280;width:110px"><b>Name</b></td><td>${esc(submission.name)}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280"><b>Email</b></td><td><a href="mailto:${esc(submission.email)}">${esc(submission.email)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#6b7280"><b>Business</b></td><td>${esc(submission.business || '—')}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280"><b>Received</b></td><td>${new Date(submission.createdAt).toLocaleString()}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0" />
        <p style="white-space:pre-wrap;margin:0">${esc(submission.message)}</p>
      </div>
    </div>`;
}

// Store the submission, then try to email it. Always returns the store result.
app.post('/api/contact', async (req, res) => {
  const body = req.body || {};
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const business = String(body.business || '').trim();
  const message = String(body.message || '').trim();
  const honey = String(body._honey || '').trim();

  // Honeypot filled = bot. Silently accept the request so bots think it worked.
  if (honey) return res.json({ success: true });

  // Validation
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: 'Please fill in your name, email, and message.' });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const submission = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name,
    email,
    business,
    message,
    createdAt: new Date().toISOString(),
  };

  // 1) Store in the backend (always — this is the source of truth)
  try {
    append(submission);
  } catch (err) {
    console.error('Store error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Could not save your message. Please email me directly.' });
  }

  // 2) Send the notification email (best effort)
  let emailSent = false;
  if (mailMode !== 'none') {
    try {
      await sendMail({
        replyTo: email,
        subject: `[Portfolio Enquiry] ${name}${business ? ` - ${business}` : ''}`,
        text:
          `Name: ${name}\n` +
          `Email: ${email}\n` +
          `Business: ${business || '—'}\n` +
          `Received: ${new Date(submission.createdAt).toLocaleString()}\n\n` +
          message,
        html: renderHtml(submission),
      });
      emailSent = true;
    } catch (err) {
      console.error(`Email send failed (${mailMode}):`, err.message);
    }
  }

  const messageToShow = emailSent
    ? 'Sent! Thanks for reaching out \u2014 I\u2019ll reply soon.'
    : mailMode !== 'none'
      ? 'Message saved. (Email delivery failed \u2014 please check the server logs.)'
      : 'Message saved, but email is not configured yet. Add RESEND_API_KEY in the server environment.';

  res.json({
    success: Boolean(emailSent || mailMode === 'none'),
    stored: true,
    emailSent,
    message: messageToShow,
  });
});

// Quick check of which email mode is active: GET /api/health
app.get('/api/health', (_req, res) => res.json({ ok: true, mail: mailMode }));

// View stored submissions — protected by ADMIN_KEY from server/.env.
// Call with:  /api/submissions?key=YOUR_KEY   or the  x-admin-key: YOUR_KEY  header.
app.get('/api/submissions', (req, res) => {
  const key = String(req.get('x-admin-key') || req.query.key || '');
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return res
      .status(401)
      .json({ success: false, message: 'Unauthorized — add ?key= or x-admin-key header.' });
  }
  res.json(readAll());
});

// Serve the built React app from the same server (production, one process).
const dist = path.join(__dirname, '..', 'react-app', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
  console.log(`   API: POST /api/contact  |  GET /api/submissions`);
  console.log(`   Email mode: ${mailMode}`);
});