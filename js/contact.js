/* =========================================================
   contact.js — sends the contact form to the backend API
   ========================================================= */

/* Change this if the backend runs on a different host/port. */
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : ''; // same-origin in production (backend serves the frontend too)

document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('contact-submit');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      setStatus('Please fill in every field.', 'err');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('Please enter a valid email address.', 'err');
      return;
    }

    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    setStatus('', '');

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("Thanks — your message is in. I'll reply by email soon.", 'ok');
        form.reset();
      } else {
        setStatus(data.error || 'Something went wrong. Please try again.', 'err');
      }
    } catch (err) {
      setStatus('Could not reach the server. Please email me directly instead.', 'err');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.className = 'form-status' + (kind ? ' ' + kind : '');
  }
});
