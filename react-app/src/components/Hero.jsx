import { useState, useRef, useEffect } from 'react';
import { heroPhrases, EMAIL, INSTAGRAM_HANDLE, BOOKING_LINK } from '../data/content.js';
import useTyping from '../hooks/useTyping.js';

export default function Hero() {
  const [imgError, setImgError] = useState(false);
  const typed = useTyping(heroPhrases);

  // Subtle 3D tilt on the photo — desktop (hover-capable) only, and never for
  // users who prefer reduced motion. Touch devices simply show the photo flat.
  const cardRef = useRef(null);
  const tiltOk = useRef(false);

  useEffect(() => {
    const hover = window.matchMedia?.('(hover: hover)')?.matches !== false;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
    tiltOk.current = hover && !reduce;
    if (tiltOk.current && cardRef.current) cardRef.current.classList.add('tilt-target');
  }, []);

  const onTiltMove = (e) => {
    const el = cardRef.current;
    if (!tiltOk.current || !el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  };

  const onTiltLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = '';
  };

  return (
    <section className="hero" id="home">
      <div className="hero-bg" aria-hidden="true">
        <span className="glow glow-1" />
        <span className="glow glow-2" />
        <span className="grid-overlay" />
      </div>

      <div className="container hero-inner">
        <div className="hero-content reveal">
          <span className="badge">
            <span className="badge-dot" /> Open for freelance projects
          </span>

          <h1 className="hero-title">
            <span className="hero-greeting">Hi, I&rsquo;m</span>
            <span className="hero-name">Abdul Rahman</span>
            <span className="hero-role">
              Digital Marketer <span className="text-gradient">&amp;</span>
              <span className="type-wrap">
                <span id="typeText">{typed}</span>
                <span className="caret" aria-hidden="true" />
              </span>
            </span>
          </h1>

          <p className="hero-bio">
            I help business owners generate a consistent flow of{' '}
            <strong>qualified leads</strong> and improve their online growth. My focus is on
            building practical lead generation systems that reduce dependency on referrals and
            low-intent enquiries.
          </p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              View My Work
            </a>
            <a href="#contact" className="btn btn-ghost">
              Get in Touch
            </a>
            <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Book a Call
            </a>
          </div>

          <ul className="hero-meta">
            <li>
              <span className="meta-label">Email</span> {EMAIL}
            </li>
            <li>
              <span className="meta-label">Instagram</span> {INSTAGRAM_HANDLE}
            </li>
            <li>
              <span className="meta-label">Based in</span> India
            </li>
          </ul>
        </div>

        {/* Avatar / Profile photo */}
        <div className="hero-visual reveal">
          <div className="avatar-wrap">
            <div
              className="avatar-card"
              ref={cardRef}
              onMouseMove={onTiltMove}
              onMouseLeave={onTiltLeave}
            >
              <img
                src="/assets/rahman.jpeg"
                alt="Abdul Rahman — Digital Marketer"
                className={`avatar-img${imgError ? ' hidden' : ''}`}
                onError={() => setImgError(true)}
              />
              {imgError && (
                <div className="avatar-fallback">
                  <span className="avatar-initials">AR</span>
                  <span className="avatar-caption">Photo coming soon</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span className="scroll-line" />
      </div>
    </section>
  );
}