# Portfolio Backend

A small Express API that powers the contact form on the portfolio site.

## What it does

- `POST /api/contact` — receives `{ name, email, message }`, validates it,
  saves it to `data/messages.json`, and (if configured) emails you a
  notification via Gmail.
- `GET /api/messages?key=YOUR_ADMIN_KEY` — lists every submitted message,
  protected by the `ADMIN_KEY` you set in `.env`.
- `GET /api/health` — simple uptime check.

## 1. Install dependencies

```bash
cd backend
npm install
```

## 2. Configure environment variables

```bash
cp .env.example .env
```

Then open `.env` and fill in:

- `PORT` — defaults to `5000`.
- `CORS_ORIGIN` — the origin(s) your frontend is served from (e.g. the URL of
  your Live Server / hosting provider).
- `EMAIL_USER` / `EMAIL_PASS` — a Gmail address and a 16-character
  [App Password](https://myaccount.google.com/apppasswords) (requires
  2-Step Verification to be turned on). Leave these blank if you don't want
  email notifications — submissions are still saved to `data/messages.json`.
- `EMAIL_TO` — where notification emails should be sent (defaults to
  `EMAIL_USER`).
- `ADMIN_KEY` — a private key only you know, used to view submissions at
  `/api/messages?key=...`.

## 3. Run it

```bash
npm start
```

The API will be live at `http://localhost:5000`.

## 4. Point the frontend at it

`frontend/js/contact.js` already targets `http://localhost:5000` when the
site is opened on `localhost`/`127.0.0.1`. When you deploy the frontend
elsewhere, update the `API_BASE` constant in that file to your deployed
backend URL, and add that frontend URL to `CORS_ORIGIN` in `.env`.

## 5. (Optional) serve the frontend from this same server

Open `server.js` and uncomment the block under "optionally serve the
frontend from the same server" to have Express serve the whole site from
one process — handy for simple single-server deployments (e.g. Render,
Railway, a VPS).

## Notes

- Messages are stored in a flat file (`data/messages.json`) — fine for a
  personal portfolio. For higher volume, swap `saveMessage`/`readMessages`
  in `routes/contact.js` for a real database.
- Basic in-memory rate limiting (5 submissions / 10 minutes / IP) is built
  in to discourage spam.
