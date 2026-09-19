import { useEffect, useRef } from 'react';
import { results } from '../data/content.js';

/** Split "100%" -> { num: 100, suffix: "%" } so the counter can animate numbers only. */
const parseValue = (value) => {
  const m = String(value).match(/^(\d+(?:\.\d+)?)(.*)$/);
  return { num: m ? Number(m[1]) : 0, suffix: m ? m[2] : '' };
};

export default function Results() {
  const gridRef = useRef(null);

  // Animate counters once when they scroll into view. Fully skipped when the
  // user prefers reduced motion — the real values are still rendered.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !('IntersectionObserver' in window)) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
    const nodes = Array.from(grid.querySelectorAll('.result-value'));
    if (reduce || nodes.length === 0) return;

    const play = (node) => {
      const target = Number(node.dataset.num) || 0;
      const suffix = node.dataset.suffix || '';
      const duration = 1100;
      const start = performance.now();
      node.textContent = `0${suffix}`;
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        node.textContent = `${Math.round(target * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting) return;
        play(entry.target);
        obs.unobserve(entry.target);
      },
      { threshold: 0.45 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section" id="results">
      <div className="container">
        <div className="section-head reveal">
          <span className="section-tag">Results &amp; Approach</span>
          <h2 className="section-title">
            Built on <span className="text-gradient">research &amp; consistency</span>
          </h2>
        </div>

        <div className="results-grid reveal" ref={gridRef}>
          {results.map((r) => {
            const { num, suffix } = parseValue(r.value);
            return (
              <div className="result-item" key={r.label}>
                <span className="result-value" data-num={num} data-suffix={suffix}>
                  {r.value}
                </span>
                <span className="result-label">{r.label}</span>
              </div>
            );
          })}
        </div>

        <div className="results-note reveal">
          <span className="note-icon" aria-hidden="true">&#9432;</span>
          <p>
            <strong>Honest note:</strong> I&rsquo;m currently building a results-driven portfolio
            through practical lead generation projects and live campaign experience. No specific
            numerical results are being claimed at this stage — because trust matters more than
            numbers.
          </p>
        </div>
      </div>
    </section>
  );
}