import { useEffect, useState } from 'react';
import { navLinks } from '../data/content.js';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('');

  // Add shadow/border to header once the hero is scrolled past
  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: '-64px 0px 0px 0px' }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Scrollspy — highlight the nav link for the visible section
  useEffect(() => {
    const sections = document.querySelectorAll('main section[id]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="siteHeader">
      <nav className="nav container" aria-label="Main navigation">
        <a href="#home" className="logo" onClick={close}>
          <span className="logo-mark">AR</span>
          <span className="logo-text">
            rahman<span className="logo-dot">.</span>
          </span>
        </a>

        <ul className={`nav-links${open ? ' open' : ''}`} id="navLinks">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`nav-link${activeId === link.href.slice(1) ? ' active' : ''}`}
                onClick={close}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" className="btn btn-primary nav-cta" onClick={close}>
              Let&rsquo;s Talk
            </a>
          </li>
        </ul>

        <button
          className={`nav-toggle${open ? ' open' : ''}`}
          id="navToggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
    </header>
  );
}