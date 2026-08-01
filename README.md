# Khalid Abbas Khan — Portfolio

A personal portfolio website built from your resume, styled in the soft
lavender / glass-gradient theme from the reference design you shared.

```
khalid-portfolio/
├── frontend/            plain HTML, CSS & JavaScript (no build step)
│   ├── index.html        Home
│   ├── about.html         About + education + certifications
│   ├── projects.html      Automation & academic projects
│   ├── skills.html        Skills, certifications, soft skills
│   ├── contact.html       Contact channels + working form
│   ├── css/style.css       every style in one file
│   ├── js/main.js          nav toggle + scroll animation
│   ├── js/contact.js       submits the contact form to the backend
│   └── assets/…             your resume PDF (offered as "Download CV")
└── backend/              Node.js + Express API for the contact form
    ├── server.js
    ├── routes/contact.js
    ├── data/messages.json  (submissions get saved here)
    └── README.md            full backend setup instructions
```

## Running the site

**Frontend only (fastest way to look at it):**
Open `frontend/index.html` directly in a browser, or serve the folder with
any static server (e.g. the VS Code "Live Server" extension) so relative
links behave correctly.

**Frontend + backend (to make the contact form actually send messages):**
1. Follow `backend/README.md` to install dependencies and configure `.env`.
2. `cd backend && npm start` — the API runs on `http://localhost:5000`.
3. Serve `frontend/` with a static server on any port and open it in your
   browser. The form in `contact.html` will POST to the backend
   automatically when running on `localhost`.

## Before you publish this — links to double-check

A few social links were built from what was legible in your resume/design
brief, but should be confirmed or replaced with your real profile URLs
before going live:

- **LinkedIn** — your resume shows the handle as `khalidkhan-`, which looks
  truncated. Update the `https://linkedin.com/in/khalidkhan-` links across
  the site with your full LinkedIn URL.
- **Facebook, Instagram, TikTok** — these weren't in your resume, so
  placeholder URLs (`facebook.com/khalidabbaskhan`, etc.) were used. Replace
  them with your actual profile links in each HTML file (search for
  `facebook.com`, `instagram.com`, and `tiktok.com`).
- **WhatsApp & email** are wired correctly using the phone number and Gmail
  address from your resume — no changes needed there.

## Notes on the theme

- Colors, type (Outfit + Inter), the floating pill navigation, black rounded
  buttons, and the glass-gradient hero visual all mirror the reference
  design's language, re-themed around automation (the hero graphic is an
  abstract "workflow pipeline" instead of a plain gradient block).
- Fully responsive down to mobile, with a slide-down nav on small screens.
