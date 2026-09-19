import { tools } from '../data/content.js';

export default function EducationTools() {
  return (
    <section className="section section-alt" id="tools">
      <div className="container">
        <div className="section-head reveal">
          <span className="section-tag">Education &amp; Tools</span>
          <h2 className="section-title">
            The foundation &amp; <span className="text-gradient">toolkit</span>
          </h2>
        </div>

        <div className="edu-tools-grid">
          <div className="edu-card reveal">
            <h3>Education</h3>
            <div className="edu-item">
              <span className="edu-degree">B.Com (Computer Applications)</span>
              <span className="edu-sub">Commerce &amp; computer applications background</span>
            </div>
            <p className="edu-note">
              No formal certifications currently — but I continuously upskill through hands-on
              campaigns and community-based training through the &ldquo;High Paying
              Clients&rdquo; community.
            </p>
          </div>

          <div className="tools-card reveal">
            <h3>Tools I Use Daily</h3>
            <div className="tool-chips">
              {tools.map((tool) => (
                <span className="tool-chip" key={tool}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}