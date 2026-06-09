'use client';

import { useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

// EmailJS reused from the contact form. No file storage / Cloudinary - the
// resume is collected as a LINK and sent inside the email. These IDs are PUBLIC
// by design (client-side), exactly like the existing contact form.
const EMAILJS = {
  serviceId: 'service_lcjx2d8', // reused from the contact form
  templateId: 'template_dqb6si7', // reused from the contact form (renders {{message}} + {{to_email}})
  publicKey: 'RqdS907OQ8LxoSUPb', // reused from the contact form
  endpoint: 'https://api.emailjs.com/api/v1.0/email/send',
};
const CAREERS_TO = 'info@genufy.in';

function Field({ label, name, type = 'text', as = 'input', value, onChange, error, optional, autoComplete, placeholder }) {
  const Cmp = as;
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-white/45">
        {label}
        {optional ? (
          <span className="text-white/30"> (optional)</span>
        ) : (
          <span className="text-emerald-300/80"> *</span>
        )}
      </span>
      <Cmp
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        rows={as === 'textarea' ? 5 : undefined}
        placeholder={placeholder || label}
        className={
          'w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-white placeholder-white/25 outline-none transition ' +
          'focus:bg-white/[0.06] ' +
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
            className="mt-1.5 block text-[11px] text-rose-300/90"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

const EMPTY = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  experience: '',
  expertise: '',
  linkedin: '',
  resumeLink: '',
  message: '',
};

export default function CareerForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [serverError, setServerError] = useState('');

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.fullName.trim()) er.fullName = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = 'Enter a valid email address.';
    if (!/^[+\d][\d\s()-]{6,}$/.test(form.phone)) er.phone = 'Enter a valid phone number.';
    if (!form.location.trim()) er.location = 'Current location is required.';
    if (!form.experience.trim()) er.experience = 'Years of experience is required.';
    if (!form.expertise.trim()) er.expertise = 'Area of expertise is required.';
    if (!/^https?:\/\/[^\s]+\.[^\s]+/.test(form.resumeLink.trim())) {
      er.resumeLink = 'Paste a valid link to your resume (https://...).';
    }
    if (form.message.trim().length < 10) er.message = 'Tell us a little about yourself.';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    setServerError('');
    try {
      // Send via EmailJS, REUSING the contact template (template_dqb6si7). It
      // renders {{name}}/{{email}}/{{phone}}/{{message}} + {{to_email}}, so the
      // careers-specific fields and the resume link are folded into
      // `message`/`body_html` - no new EmailJS template, no file storage.
      const fullName = form.fullName.trim();
      const email = form.email.trim();
      const resumeLink = form.resumeLink.trim();
      const detailsText =
        `Location: ${form.location.trim()}\n` +
        `Years of Experience: ${form.experience.trim()}\n` +
        `Area of Expertise / Skills: ${form.expertise.trim()}\n` +
        `LinkedIn: ${form.linkedin.trim() || '-'}\n` +
        `Resume Link: ${resumeLink}\n\n` +
        `Cover Message:\n${form.message.trim()}`;
      const detailsHtml =
        `<table cellpadding="6" style="border-collapse:collapse;font-size:14px;">` +
        `<tr><td><b>Location</b></td><td>${form.location.trim()}</td></tr>` +
        `<tr><td><b>Years of Experience</b></td><td>${form.experience.trim()}</td></tr>` +
        `<tr><td><b>Area of Expertise / Skills</b></td><td>${form.expertise.trim()}</td></tr>` +
        `<tr><td><b>LinkedIn</b></td><td>${form.linkedin.trim() || '-'}</td></tr>` +
        `<tr><td><b>Resume</b></td><td><a href="${resumeLink}">${resumeLink}</a></td></tr>` +
        `<tr><td valign="top"><b>Cover Message</b></td><td>${form.message.trim().replace(/\n/g, '<br>')}</td></tr>` +
        `</table>`;

      const res = await fetch(EMAILJS.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS.serviceId,
          template_id: EMAILJS.templateId,
          user_id: EMAILJS.publicKey,
          template_params: {
            to_email: CAREERS_TO,
            from_name: 'Genufy Careers',
            reply_to: email,
            subject: `New Career Application - ${fullName}`,
            // Individual fields - used by the dedicated careers template's layout.
            name: fullName,
            email,
            phone: form.phone.trim(),
            location: form.location.trim(),
            experience: form.experience.trim(),
            expertise: form.expertise.trim(),
            linkedin: form.linkedin.trim() || '-',
            resume_url: resumeLink,
            cover: form.message.trim(),
            submitted_on: new Date().toLocaleString('en-IN', {
              dateStyle: 'full',
              timeStyle: 'short',
              timeZone: 'Asia/Kolkata',
            }),
            source: 'Genufy Careers Form',
            // Folded fallbacks - keep the current template working during the
            // switch to the dedicated careers template.
            message: detailsText,
            body_text: detailsText,
            body_html: detailsHtml,
          },
        }),
      });
      if (!res.ok) throw new Error('send-failed');

      setStatus('sent');
      setForm(EMPTY);
    } catch {
      setServerError(
        'Something went wrong submitting your application. Please try again, or email info@genufy.in directly.'
      );
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center"
      >
        <div
          className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(144,235,97,0.25), transparent 70%)' }}
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="#90eb61" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-semibold text-white">Application received</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/60">
          Thank you for your interest in Genufy. We've received your details, and we'll reach out if a
          suitable opportunity opens up.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3 text-sm text-white/85 transition hover:bg-white/[0.08]"
        >
          Submit another application
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-9 space-y-5"
    >
      {/* All single-line fields share one uniform 2-column grid so every field
          aligns and sizes exactly like Name/Email. The Cover Message (textarea)
          spans full width, which is natural for a multi-line field. */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Full Name" name="fullName" value={form.fullName} onChange={update} error={errors.fullName} autoComplete="name" />
        <Field label="Email Address" name="email" type="email" value={form.email} onChange={update} error={errors.email} autoComplete="email" />
        <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={update} error={errors.phone} autoComplete="tel" />
        <Field label="Current Location" name="location" value={form.location} onChange={update} error={errors.location} autoComplete="address-level2" />
        <Field label="Years of Experience" name="experience" value={form.experience} onChange={update} error={errors.experience} />
        <Field label="Area of Expertise / Skills" name="expertise" value={form.expertise} onChange={update} error={errors.expertise} />
        <Field label="LinkedIn Profile" name="linkedin" type="url" value={form.linkedin} onChange={update} error={errors.linkedin} optional autoComplete="url" placeholder="https://linkedin.com/in/you" />
        <Field
          label="Resume Link"
          name="resumeLink"
          type="url"
          value={form.resumeLink}
          onChange={update}
          error={errors.resumeLink}
          placeholder="Drive / Dropbox / portfolio link"
        />
      </div>

      <p className="text-[11px] text-white/40">
        For the resume, paste a shareable link and make sure its sharing permission allows anyone with
        the link to view.
      </p>

      <Field
        label="Cover Message"
        name="message"
        as="textarea"
        value={form.message}
        onChange={update}
        error={errors.message}
        placeholder="Tell us about your experience and how you can contribute to Genufy."
      />

      {status === 'error' && serverError && (
        <div className="text-xs text-rose-300">{serverError}</div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <span className="text-[11px] text-white/40">We review every application and reply if there's a fit.</span>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group relative inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(90deg,#7CFFB2,#24baac)' }}
        >
          {status === 'sending' ? 'Submitting…' : 'Submit Application'}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
        </button>
      </div>
    </form>
  );
}
