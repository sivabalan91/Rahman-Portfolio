import { timelineItems } from '../data/content.js';

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-head reveal">
          <span className="section-tag">Experience</span>
          <h2 className="section-title">
            Where I&rsquo;ve <span className="text-gradient">built my expertise</span>
          </h2>
        </div>

        <div className="timeline reveal">
          {timelineItems.map((item) => (
            <article className="timeline-item" key={item.title}>
              <span className="timeline-dot" aria-hidden="true" />
              <div className="timeline-card">
                <div className="timeline-head">
                  <div>
                    <h3>{item.title}</h3>
                    <span className="timeline-role">{item.role}</span>
                  </div>
                  <span className="timeline-tag">{item.tag}</span>
                </div>
                <p>{item.body}</p>
                {item.bullets.length > 0 && (
                  <ul className="timeline-list">
                    {item.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}