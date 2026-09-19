import { useEffect, useState } from 'react';
import { EMAIL, WHATSAPP_LINK, WHATSAPP_DISPLAY, INSTAGRAM, INSTAGRAM_HANDLE, BOOKING_LINK } from '../data/content.js';

// API base for the contact form.
//  • '' (default) = same origin — works in dev (Vite proxy) and when the
//    backend itself serves the React site (Render). 
//  • To post to a hosted backend from anywhere, create react-app/.env with:
//      VITE_API_BASE=https://rahman-portfolio-84wk.onrender.com
const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    ? String(import.meta.env.VITE_API_BASE)
    : '';

export default function Contact() {
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [sending, setSending] = useState(false);

  // Warn immediately if the page is opened as a local file — the API can't be reached that way.
  useEffect(() => {
    if (window.location.protocol === 'file:') {
      setIsError(true);
      setStatus(
        'Opened as a local file, so the form can\u2019t reach the backend. Run "npm run dev" and open the local URL, or deploy both frontend + backend to a host.'
      );
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const business = String(fd.get('business') || '').trim();
    const message = String(fd.get('message') || '').trim();

    if (!name || !email || !message) {
      setIsError(true);
      setStatus('Please fill in your name, email, and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setIsError(true);
      setStatus('Please enter a valid email address.');
      return;
    }

    setSending(true);
    setIsError(false);
    setStatus('Sending your message…');

    try {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      business,
      message,
      _honey: fd.get('_honey') || '',
    }),
  });

      let data = {};
      try {
        data = await res.json();
      } catch {
        /* non-JSON body */
      }

      if (!res.ok || data?.success === false) {
        throw new Error(
          typeof data?.message === 'string' ? data.message : 'Server could not save your message'
        );
      }

      setIsError(false);
      setStatus(data?.message || 'Sent! Thanks for reaching out \u2014 I\u2019ll reply soon.');
      form.reset();
    } catch (err) {
      // Any failure here means the backend didn't respond properly:
      // the backend is stopped, or the Vite proxy couldn't reach it.
      console.error('Contact form error:', err);
      setIsError(true);
      setStatus(
        `Could not reach the backend server. Make sure it is running (start-all.bat) and try again — or email me directly at ${EMAIL}.`
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info reveal">
            <span className="section-tag">Contact</span>
            <h2 className="section-title">
              Let&rsquo;s grow your business{' '}
              <span className="text-gradient">with quality leads</span>
            </h2>
            <p className="contact-intro">
              Looking for a freelance digital marketer to generate qualified leads through Meta
              Ads? I&rsquo;m looking for business owners who want to grow with
              performance-focused marketing.
            </p>

            <ul className="contact-list">
              <li>
                <span className="contact-icon" aria-hidden="true">&#9993;</span>
                <div>
                  <span className="contact-label">Email</span>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </div>
              </li>
              <li>
                <span className="contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </span>
                <div>
                  <span className="contact-label">WhatsApp</span>
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                    {WHATSAPP_DISPLAY}
                  </a>
                </div>
              </li>
              <li>
                <span className="contact-icon" aria-hidden="true">&#10022;</span>
                <div>
                  <span className="contact-label">Instagram</span>
                  <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
                    {INSTAGRAM_HANDLE}
                  </a>
                </div>
              </li>
              <li>
                <span className="contact-icon" aria-hidden="true">&#9998;</span>
                <div>
                  <span className="contact-label">Preferred Engagement</span>
                  <span className="contact-value">
                    Freelance / Contract — Meta Ads &amp; Lead Gen Projects
                  </span>
                </div>
              </li>
            </ul>
            <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-primary book-call-btn">
              Book a Free Strategy Call
            </a>
          </div>
          <form className="contact-form reveal" id="contactForm" onSubmit={handleSubmit} novalidate>
            <h3>Send a message</h3>
            {/* Spam honeypot — invisible to humans, ignored by bots */}
            <input
              type="text"
              name="_honey"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" name="name" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@company.com"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="business">Your Business / Industry</label>
              <input
                type="text"
                id="business"
                name="business"
                placeholder="e.g. Dental Clinic"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Tell me about your project</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="What are you looking to grow?"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={sending}>
              {sending ? 'Sending…' : 'Send Message'}
            </button>
            <p className={`form-note${isError ? ' error' : ''}`}>{status}</p>
          </form>
        </div>
      </div>
    </section>
  );
}