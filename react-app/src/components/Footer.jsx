import { EMAIL, INSTAGRAM, WHATSAPP_LINK } from '../data/content.js';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <a href="#home" className="logo">
          <span className="logo-mark">AR</span>
          <span className="logo-text">
            rahman<span className="logo-dot">.</span>
          </span>
        </a>
        <p className="footer-quote">
          Generating qualified leads through Meta Ads &amp; performance-focused digital marketing.
        </p>
        <div className="footer-links">
          <a href={`mailto:${EMAIL}`} className="footer-link">Email</a>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="footer-link">
            Instagram
          </a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="footer-link">
            WhatsApp
          </a>
        </div>
        <p className="footer-copy">
          &copy; {year} Abdul Rahman. All rights reserved.
        </p>
      </div>
    </footer>
  );
}