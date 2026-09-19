import { focusAreas } from '../data/content.js';

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-head reveal">
          <span className="section-tag">About Me</span>
          <h2 className="section-title">
            Turning ad spend into <span className="text-gradient">quality enquiries</span>
          </h2>
        </div>

        <div className="about-grid">
          <div className="about-text reveal">
            <p>
              I&rsquo;m <strong>Abdul Rahman</strong>, a Digital Marketer specializing in{' '}
              <strong>Meta Ads</strong> and <strong>Lead Generation</strong>. I work with
              businesses to develop lead generation strategies, run Meta Ads campaigns, research
              target audiences, and improve the quality of incoming enquiries.
            </p>
            <p>
              My approach is <strong>research-driven</strong> — I take time to understand your
              business, identify the right audience, craft relevant offers, and build systems that
              attract <strong>higher-intent enquiries</strong> instead of low-quality clicks.
            </p>
            <ul className="about-points">
              <li>Results-focused Meta Ads campaigns</li>
              <li>Practical, research-driven audience strategies</li>
              <li>Clear, honest reporting and communication</li>
            </ul>
            <a href="#contact" className="btn btn-primary">
              Work With Me
            </a>
          </div>

          <div className="about-card reveal">
            <div className="about-card-glow" aria-hidden="true" />
            <div className="about-card-head">
              <span className="about-card-label">Focus Areas</span>
              <span className="about-card-note">Always optimizing</span>
            </div>
            <ul className="focus-list">
              {focusAreas.map((f) => (
                <li key={f.n}>
                  <span className="focus-icon">{f.n}</span>
                  <div>
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}