const express  = require('express');
const fs       = require('fs');
const path     = require('path');
const nodemailer = require('nodemailer');

const router = express.Router();

const DATA_FILE = path.join(__dirname, '..', 'data', 'messages.json');

/* ---------- helpers ---------- */

function readMessages() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function saveMessage(entry) {
  const messages = readMessages();
  messages.push(entry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* Basic in-memory rate limiting: max 5 submissions per IP per 10 minutes */
const submissionLog = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const max = 5;
  const timestamps = (submissionLog.get(ip) || []).filter(t => now - t < windowMs);
  timestamps.push(now);
  submissionLog.set(ip, timestamps);
  return timestamps.length > max;
}

async function sendEmailNotification({ name, email, message }) {
  // Only attempt to send if SMTP credentials are configured.
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('EMAIL_USER / EMAIL_PASS not set — skipping email send, message saved locally only.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    replyTo: email,
    subject: `New portfolio message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`
  });
}

/* ---------- routes ---------- */

// POST /api/contact — submit the form
router.post('/contact', async (req, res) => {
  const ip = req.ip;
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many messages sent. Please try again later.' });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are all required.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (message.length > 5000) {
    return res.status(400).json({ error: 'Message is too long.' });
  }

  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    message: String(message).slice(0, 5000),
    receivedAt: new Date().toISOString()
  };

  try {
    saveMessage(entry);
  } catch (err) {
    console.error('Failed to save message:', err);
    return res.status(500).json({ error: 'Could not save your message. Please try again.' });
  }

  try {
    await sendEmailNotification(entry);
  } catch (err) {
    // Message is already saved — email failure shouldn't fail the whole request.
    console.error('Failed to send email notification:', err);
  }

  return res.status(201).json({ success: true, message: 'Message received. Thank you!' });
});

// GET /api/messages?key=ADMIN_KEY — view stored submissions (simple admin view)
router.get('/messages', (req, res) => {
  const key = req.query.key;
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  return res.json(readMessages());
});

module.exports = router;
