import { projects } from '../data/content.js';

export default function Projects() {
  return (
    <section className="section section-alt" id="projects">
      <div className="container">
        <div className="section-head reveal">
          <span className="section-tag">Projects &amp; Campaigns</span>
          <h2 className="section-title">
            Lead generation work <span className="text-gradient">across industries</span>
          </h2>
          <p className="section-sub">
            Practical lead generation projects run across five industries.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((p) => (
            <article className="project-card reveal" key={p.title}>
              <div className="project-top">
                <span className="project-icon">{p.icon}</span>
                <span className="project-industry">{p.industry}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <span className="project-focus">{p.focus}</span>
            </article>
          ))}

          <article className="project-card project-card-cta reveal">
            <div className="project-cta-inner">
              <h3>Your industry is next.</h3>
              <p>Let&rsquo;s design a lead generation campaign built around your business.</p>
              <a href="#contact" className="btn btn-primary">
                Start a Project
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}