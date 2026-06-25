/**
 * contactForm.js — client-side validation, inline errors, simulated submit
 * with loading + success state. (No backend; swap the timeout for a fetch.)
 */
export function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const success = form.querySelector('[data-form-success]');
  const submitBtn = form.querySelector('[type="submit"]');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fields = {
    name: { el: form.elements.name, validate: (v) => (v.trim() ? '' : 'Please enter your name.') },
    email: {
      el: form.elements.email,
      validate: (v) =>
        !v.trim() ? 'Please enter your email.' : emailRe.test(v.trim()) ? '' : 'Please enter a valid email address.',
    },
    message: { el: form.elements.message, validate: (v) => (v.trim() ? '' : 'Please add a short message.') },
  };

  function setError(name, msg) {
    const f = fields[name];
    const wrap = f.el.closest('.field');
    const err = form.querySelector(`[data-error-for="${name}"]`);
    if (err) err.textContent = msg;
    if (wrap) wrap.classList.toggle('has-error', !!msg);
    f.el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function validateField(name) {
    const msg = fields[name].validate(fields[name].el.value);
    setError(name, msg);
    return !msg;
  }

  Object.keys(fields).forEach((name) => {
    const el = fields[name].el;
    el.addEventListener('blur', () => validateField(name)); // validate on blur
    el.addEventListener('input', () => {
      const wrap = el.closest('.field');
      if (wrap && wrap.classList.contains('has-error')) validateField(name); // clear once fixed
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let firstInvalid = null;
    Object.keys(fields).forEach((name) => {
      if (!validateField(name) && !firstInvalid) firstInvalid = fields[name].el;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    const original = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    await new Promise((r) => setTimeout(r, 900)); // simulate network
    submitBtn.disabled = false;
    submitBtn.textContent = original;

    if (success) success.hidden = false;
    form.querySelectorAll('input, textarea').forEach((el) => {
      el.value = '';
      el.setAttribute('aria-invalid', 'false');
    });
  });
}
