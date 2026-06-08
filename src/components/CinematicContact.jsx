import { useEffect, useMemo, useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';

/* ============================================================
   CinematicContact - single-screen premium contact form
   Fields: First Name · Last Name · Email · Contact Number · Message
   Posts to FormSubmit so deliveries reach the configured INBOX.
============================================================ */

/* -----------------------------------------------------------------
   Email delivery configuration
   -----------------------------------------------------------------
   The form sends to whichever path is configured below.

   Preferred - EmailJS (your own SMTP, full HTML control, sender name,
   reply-to, and far better deliverability than FormSubmit):
     1) Create a free account at https://www.emailjs.com
     2) Add an Email Service (Gmail / Zoho / Microsoft 365 / your SMTP)
     3) Create a Template - set:
          From Name:  Genufy Website Notifications
          Subject:    {{subject}}
          Reply-To:   {{reply_to}}
          Content:    (HTML - see EMAIL_TEMPLATE_PREVIEW below for the
                       exact body we send as a `body_html` variable, OR
                       use individual `{{name}}, {{email}}, …` vars.)
     4) Paste the IDs below. As soon as `serviceId` is non-empty,
        EmailJS is used and FormSubmit is bypassed.

   Fallback - FormSubmit (no setup, but Reply-To only and may hit spam). */
const INBOX = 'info@genufy.in';

/* -----------------------------------------------------------------
   EmailJS setup (one-time) - fill the three IDs below and the polished
   HTML email is sent automatically (FormSubmit is bypassed):

   1) Sign up at https://www.emailjs.com (free tier is fine).
   2) Email Services → Add Service (Gmail / Zoho / Microsoft 365 / SMTP).
      Copy the Service ID  → paste into `serviceId` below.
   3) Email Templates → Create Template. In the template settings set:
        To Email   : {{to_email}}
        From Name  : {{from_name}}
        Reply To   : {{reply_to}}
        Subject    : {{subject}}
      For the Content, switch the editor to the code/HTML view and paste
      the block in EMAILJS_TEMPLATE_HTML (exported at the bottom of this
      file). It uses {{name}}, {{email}}, {{phone}}, {{message}},
      {{submitted_on}}, {{source}} - exactly the params we send.
      Copy the Template ID → paste into `templateId` below.
   4) Account → General → Public Key → paste into `publicKey` below.

   That's it - no code changes needed after pasting the IDs. */
const EMAILJS = {
  serviceId: 'service_lcjx2d8',
  templateId: 'template_dqb6si7',
  publicKey: 'RqdS907OQ8LxoSUPb',
  endpoint: 'https://api.emailjs.com/api/v1.0/email/send',
};

const FORM_ENDPOINT = `https://formsubmit.co/ajax/${INBOX}`;

/* Escape user-supplied strings before injecting them into the HTML email
   body - prevents broken markup and trivial HTML injection. */
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* Professional, business-style HTML inquiry email - clean two-column
   Name/Value table with a blue header bar, matching FormSubmit's default
   table aesthetic. */
function buildBodyHtml({ fullName, email, phone, message, submittedDate }) {
  const messageHtml = esc(message).replace(/\n/g, '<br>');
  const submittedAt = new Date().toUTCString();
  const rows = [
    ['Name',           esc(fullName)],
    ['Email',          esc(email)],
    ['Contact Number', esc(phone)],
    ['Message',        messageHtml],
    ['Submitted Date', esc(submittedDate)],
    ['Source',         'Genufy Website'],
  ];
  const rowsHtml = rows
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:12px 16px; border-bottom:1px solid #e5e9f0; font-weight:600; color:#1f2937; width:35%; vertical-align:top; background:#ffffff;">${k}</td>
          <td style="padding:12px 16px; border-bottom:1px solid #e5e9f0; color:#0f172a; font-family:'SFMono-Regular',Consolas,Menlo,monospace; font-size:13px; background:#ffffff; line-height:1.55;">${v}</td>
        </tr>`
    )
    .join('');

  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color:#1f2937; background:#f3f4f6; padding:24px;">
  <div style="max-width:680px; margin:0 auto;">
    <p style="margin:0 0 14px; font-size:15px; line-height:1.6;">Hello Team,</p>
    <p style="margin:0 0 14px; font-size:15px; line-height:1.6;">
      A new visitor has submitted an inquiry through the Genufy website and may be interested in learning more about our services.
    </p>
    <p style="margin:0 0 18px; font-size:15px; line-height:1.6;">Please find the details below:</p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0"
           style="width:100%; border-collapse:collapse; border:1px solid #d1d5db; font-size:14px; background:#ffffff;">
      <thead>
        <tr style="background:#1e3a8a; color:#ffffff;">
          <th align="left" style="padding:12px 16px; font-size:14px; font-weight:600; border-bottom:1px solid #1e3a8a;">Name</th>
          <th align="left" style="padding:12px 16px; font-size:14px; font-weight:600; border-bottom:1px solid #1e3a8a;">Value</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <p style="margin:22px 0 12px; font-size:15px; line-height:1.6;">
      This visitor has taken the time to reach out through our website and may be interested in discussing potential opportunities, services, partnerships, or digital transformation initiatives.
    </p>
    <p style="margin:0 0 22px; font-size:15px; line-height:1.6;">
      Please follow up with them at the earliest convenience.
    </p>

    <p style="margin:0; font-size:14px; color:#475569;">Best Regards,</p>
    <p style="margin:4px 0 24px; font-size:14px; color:#0f172a; font-weight:600;">Genufy Website Automation</p>

    <p style="margin:0; text-align:center; font-size:12px; color:#64748b;">
      Submitted at ${esc(submittedAt)}
    </p>
  </div>
</div>`.trim();
}

/* Plain-text fallback (used by FormSubmit, which can't render HTML). */
function buildBodyText({ fullName, email, phone, message, submittedDate }) {
  return [
    'Hello Team,',
    '',
    'A new visitor has submitted an inquiry through the Genufy website and may be interested in learning more about our services.',
    '',
    'Please find the details below:',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━',
    `Name             : ${fullName}`,
    `Email            : ${email}`,
    `Contact Number   : ${phone}`,
    `Message          : ${message}`,
    `Submitted On     : ${submittedDate}`,
    `Source           : Genufy Website Contact Form`,
    '━━━━━━━━━━━━━━━━━━━━━━',
    '',
    'This visitor has taken the time to reach out through our website and may be interested in discussing potential opportunities, services, partnerships, or digital transformation initiatives.',
    '',
    'Please follow up with them at the earliest convenience.',
    '',
    'Best Regards,',
    'Genufy Website Automation',
  ].join('\n');
}

/* ------------------------------- field --------------------------------- */
function Field({ label, name, type = 'text', as = 'input', value, onChange, error, autoComplete, delay = 0 }) {
  const Cmp = as;
  return (
    <motion.label
      initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="block group"
    >
      <span className="block text-[10px] tracking-[0.32em] uppercase text-white/45 mb-2">
        {label}<span className="text-emerald-300/80"> *</span>
      </span>
      <Cmp
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        rows={as === 'textarea' ? 5 : undefined}
        placeholder={label}
        className={
          'w-full rounded-xl border bg-white/[0.03] backdrop-blur-md px-4 py-3 text-white placeholder-white/25 outline-none transition ' +
          'focus:bg-white/[0.06] focus:shadow-[0_0_30px_rgba(80,200,255,0.18)] ' +
          (error
            ? 'border-rose-400/50 focus:border-rose-300/70'
            : 'border-white/10 focus:border-cyan-300/60')
        }
      />
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="mt-1.5 block text-[11px] text-rose-300/90"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.label>
  );
}

/* --------------------------- success scene ----------------------------- */
function SuccessScene({ onClose, inbox }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-10"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto h-24 w-24 rounded-full grid place-items-center"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(144,235,97,0.25), transparent 70%)',
        }}
      >
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.6, 1.6], opacity: [0.7, 0, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          style={{ boxShadow: '0 0 36px 8px rgba(144,235,97,0.6)' }}
        />
        <svg viewBox="0 0 64 64" className="relative h-14 w-14">
          <defs>
            <linearGradient id="sucG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#90eb61" />
              <stop offset="100%" stopColor="#24baac" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="url(#sucG)"
            strokeWidth="2.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            strokeLinecap="round"
          />
          <motion.path
            d="M19 33 L29 43 L46 24"
            fill="none"
            stroke="url(#sucG)"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-7 font-display text-2xl md:text-3xl font-semibold tracking-tight"
      >
        <span className="text-white">Your message is on its way</span>
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.5 }}
        className="mt-3 max-w-md mx-auto text-sm md:text-base text-white/65 leading-relaxed"
      >
        We've received it at <span className="text-white">{inbox}</span> and will reply within one business day.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose?.(); }}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md px-7 py-3 text-sm text-white/85 hover:bg-white/[0.08] hover:border-white/30 transition"
      >
        Close
      </motion.button>
    </motion.div>
  );
}

/* ----------------------------- main modal ------------------------------ */
export default function CinematicContact({ open, onClose, cta = "Let's Build Together" }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
  const [errDetail, setErrDetail] = useState(''); // raw provider error, for debugging

  /* Reset state every time the dialog re-opens */
  useEffect(() => {
    if (open) {
      setStatus('idle');
      setErrors({});
    }
  }, [open]);

  /* Body-scroll lock while open */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  /* ESC closes only the contact form */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
    };
    window.addEventListener('keydown', onKey, true); // capture phase so it fires first
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.firstName.trim()) er.firstName = 'First name is required.';
    if (!form.lastName.trim()) er.lastName = 'Last name is required.';
    if (!form.email.trim()) er.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = 'Enter a valid email address.';
    if (!form.phone.trim()) er.phone = 'Contact number is required.';
    else if (!/^[+\d][\d\s()-]{6,}$/.test(form.phone)) er.phone = 'Enter a valid phone number.';
    if (!form.message.trim()) er.message = 'Tell us a little about your project.';
    else if (form.message.trim().length < 12) er.message = 'A little more detail will help us respond well.';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
      const email = form.email.trim();
      const phone = form.phone.trim();
      const message = form.message.trim();
      const submittedDate = new Date().toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata',
      });
      const subject = `New Inquiry from ${fullName} - Genufy Website`;
      const bodyText = buildBodyText({ fullName, email, phone, message, submittedDate });
      const bodyHtml = buildBodyHtml({ fullName, email, phone, message, submittedDate });

      let ok = false;

      /* Preferred path - EmailJS (real SMTP, custom HTML + sender name) */
      if (EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey) {
        const res = await fetch(EMAILJS.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: EMAILJS.serviceId,
            template_id: EMAILJS.templateId,
            user_id: EMAILJS.publicKey,
            template_params: {
              to_email: INBOX,
              from_name: 'Genufy Website Notifications',
              reply_to: email,
              subject,
              name: fullName,
              email,
              phone,
              message,
              submitted_on: submittedDate,
              source: 'Genufy Website Contact Form',
              body_text: bodyText,
              body_html: bodyHtml,
            },
          }),
        });
        ok = res.ok;
        if (!ok) {
          const detail = await res.text().catch(() => '');
          throw new Error(`EmailJS ${res.status}: ${detail || 'request failed'}`);
        }
      } else {
        /* Fallback - FormSubmit. We send ONLY clean, well-ordered fields (no
           emoji keys, no paragraph-rows) so the received email is a tidy
           Name/Value list. `_template: 'box'` is FormSubmit's cleanest layout.
           FormSubmit builds its own email from these fields and ignores raw
           HTML, so the polished buildBodyHtml is reserved for the EmailJS path. */
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            Name:             fullName,
            Email:            email,
            'Contact Number': phone,
            Message:          message,
            'Submitted On':   submittedDate,
            Source:           'Genufy Website Contact Form',
            _subject:  subject,
            _template: 'box',
            _captcha:  'false',
            _replyto:  email,
          }),
        });
        ok = res.ok;
      }

      if (!ok) throw new Error('send failed');
      setStatus('sent');
      setErrDetail('');
      setForm({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    } catch (err) {
      setErrDetail(err?.message || String(err));
      setStatus('error');
    }
  };

  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        i,
        x: (i * 41) % 100,
        y: (i * 53) % 100,
        size: 0.4 + ((i * 11) % 7) / 10,
        duration: 5 + (i % 6),
        delay: (i * 0.3) % 5,
        green: i % 2 === 0,
      })),
    []
  );

  const showSuccess = status === 'sent';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cinematic-contact"
          className="fixed inset-0 z-[2147483647] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Contact"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Backdrop - clicking outside the panel closes only this form */}
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={(e) => { e.stopPropagation(); onClose?.(); }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Static glow layers */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-[10%] top-[15%] w-[520px] h-[520px] rounded-full blur-[150px] opacity-50"
              style={{ background: 'radial-gradient(circle, rgba(36,186,172,0.5), transparent 70%)' }}
            />
            <div
              className="absolute right-[8%] bottom-[10%] w-[560px] h-[560px] rounded-full blur-[160px] opacity-45"
              style={{ background: 'radial-gradient(circle, rgba(144,235,97,0.45), transparent 70%)' }}
            />
          </div>

          {/* Floating particles */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {particles.map((p) => (
              <motion.span
                key={p.i}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size * 3,
                  height: p.size * 3,
                  background: p.green ? 'rgba(144,235,97,0.75)' : 'rgba(36,186,172,0.75)',
                  boxShadow: '0 0 8px rgba(144,235,97,0.45)',
                }}
                animate={{ opacity: [0.15, 0.85, 0.15], y: [0, -10, 0] }}
                transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
              />
            ))}
          </div>

          {/* Grid texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '54px 54px',
              maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)',
            }}
          />

          {/* Panel - close button lives here, top-right corner */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[1] w-[min(94vw,720px)] max-h-[92vh] overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl px-6 pt-12 pb-6 md:px-9 md:pt-14 md:pb-8"
          >
            {/* X close button - top-right corner of the form panel only */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClose?.(); }}
              aria-label="Close contact form"
              className="absolute top-4 right-4 z-20 grid place-items-center h-10 w-10 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-md text-white/60 hover:text-white hover:border-white/35 hover:bg-white/[0.12] transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            {/* Brand-gradient ring */}
            <div
              aria-hidden
              className="absolute -inset-px rounded-3xl pointer-events-none opacity-40"
              style={{
                background:
                  'linear-gradient(135deg, rgba(144,235,97,0.45), rgba(36,186,172,0.30) 50%, rgba(36,186,172,0.10))',
                mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                padding: 1,
              }}
            />

            {showSuccess ? (
              <SuccessScene onClose={onClose} inbox={INBOX} />
            ) : (
              <>
                {/* Header - compact so the CTA sits in view without scrolling */}
                <div className="text-center mb-5 md:mb-6">
                  <div className="text-[10px] md:text-[11px] tracking-[0.45em] uppercase text-white/55">
                    Begin the conversation
                  </div>
                  <h2 className="mt-2 font-display text-xl md:text-2xl lg:text-[28px] font-semibold tracking-tight leading-[1.2]">
                    <span className="block text-white">Tell us where you're going.</span>
                    <span
                      className="block mt-0.5"
                      style={{
                        background: 'linear-gradient(90deg,#90eb61,#24baac)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 18px rgba(36,186,172,0.25))',
                      }}
                    >
                      We'll engineer the way there.
                    </span>
                  </h2>
                </div>

                <form onSubmit={submit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="First Name" name="firstName" value={form.firstName} onChange={update} error={errors.firstName} autoComplete="given-name" delay={0.05} />
                    <Field label="Last Name" name="lastName" value={form.lastName} onChange={update} error={errors.lastName} autoComplete="family-name" delay={0.12} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Email Address" name="email" type="email" value={form.email} onChange={update} error={errors.email} autoComplete="email" delay={0.19} />
                    <Field label="Contact Number" name="phone" type="tel" value={form.phone} onChange={update} error={errors.phone} autoComplete="tel" delay={0.26} />
                  </div>
                  <Field label="Message" name="message" as="textarea" value={form.message} onChange={update} error={errors.message} delay={0.33} />

                  {/* Inline status row - only takes space when there's an error */}
                  {status === 'error' && (
                    <div className="text-xs text-rose-300">
                      Something went wrong. Please try again, or email us directly at {INBOX}.
                      {errDetail && (
                        <span className="mt-1 block break-words text-rose-400/80">{errDetail}</span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-white/40">
                      We typically respond within one business day.
                    </span>
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="group relative inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_45px_rgba(110,255,180,0.40)]"
                      style={{ background: 'linear-gradient(90deg,#7CFFB2,#24baac)' }}
                    >
                      {status === 'sending' ? 'Sending…' : cta}
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================================
   EMAILJS_TEMPLATE_HTML

   Copy everything between the backticks below and paste it into your EmailJS
   template's Content (switch the editor to the </> code / HTML view first).
   It uses the same variables this form sends - {{name}}, {{email}}, {{phone}},
   {{message}}, {{submitted_on}}, {{source}} - so no further wiring is needed.
   The {{message}} cell uses `white-space:pre-line` so line breaks are kept.
   EmailJS escapes these values, so it is safe against HTML injection.
============================================================================ */
export const EMAILJS_TEMPLATE_HTML = `
<div style="margin:0;padding:24px;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#1f2937;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#90eb61,#24baac);padding:28px 32px;">
      <h1 style="margin:0;font-size:20px;font-weight:700;color:#062019;letter-spacing:-0.2px;">New Website Inquiry</h1>
      <p style="margin:6px 0 0;font-size:13px;color:#063b32;">Genufy - submitted {{submitted_on}}</p>
    </div>
    <div style="padding:28px 32px;">
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#374151;">
        A new visitor has reached out through the Genufy website. Their details are below.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eef1f4;font-weight:600;color:#6b7280;width:34%;">Name</td>
          <td style="padding:12px 0;border-bottom:1px solid #eef1f4;color:#111827;">{{name}}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eef1f4;font-weight:600;color:#6b7280;">Email</td>
          <td style="padding:12px 0;border-bottom:1px solid #eef1f4;color:#111827;"><a href="mailto:{{email}}" style="color:#0f766e;text-decoration:none;">{{email}}</a></td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eef1f4;font-weight:600;color:#6b7280;">Contact Number</td>
          <td style="padding:12px 0;border-bottom:1px solid #eef1f4;color:#111827;">{{phone}}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eef1f4;font-weight:600;color:#6b7280;vertical-align:top;">Message</td>
          <td style="padding:12px 0;border-bottom:1px solid #eef1f4;color:#111827;white-space:pre-line;line-height:1.6;">{{message}}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;font-weight:600;color:#6b7280;">Source</td>
          <td style="padding:12px 0;color:#111827;">{{source}}</td>
        </tr>
      </table>
      <div style="margin-top:24px;">
        <a href="mailto:{{email}}" style="display:inline-block;background:linear-gradient(135deg,#90eb61,#24baac);color:#062019;font-weight:600;font-size:14px;text-decoration:none;padding:11px 22px;border-radius:999px;">Reply to {{name}}</a>
      </div>
    </div>
    <div style="padding:16px 32px;background:#fafbfc;border-top:1px solid #eef1f4;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">Generated automatically by the Genufy website contact form.</p>
    </div>
  </div>
</div>`;
