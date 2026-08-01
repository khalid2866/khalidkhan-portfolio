require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const contactRoutes = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ---------- middleware ---------- */

const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: allowedOrigins.includes('*') ? true : allowedOrigins,
  methods: ['GET', 'POST'],
}));

app.use(express.json({ limit: '100kb' }));

/* ---------- ensure data file exists ---------- */

const dataDir  = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'messages.json');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]');

/* ---------- API routes ---------- */

app.use('/api', contactRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/* ---------- optionally serve the frontend from the same server ----------
   Uncomment this block to have Express serve the static site as well,
   so the whole portfolio runs from a single process/port in production. */

// const frontendPath = path.join(__dirname, '..', 'frontend');
// app.use(express.static(frontendPath));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(frontendPath, 'index.html'));
// });

/* ---------- start ---------- */

app.listen(PORT, () => {
  console.log(`Portfolio backend running on http://localhost:${PORT}`);
});
