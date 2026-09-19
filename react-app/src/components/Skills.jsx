import { skills } from '../data/content.js';

export default function Skills() {
  return (
    <section className="section section-alt" id="skills">
      <div className="container">
        <div className="section-head reveal">
          <span className="section-tag">Skills</span>
          <h2 className="section-title">
            What I bring to <span className="text-gradient">your campaigns</span>
          </h2>
        </div>

        <div className="skills-grid">
          {skills.map((skill) => (
            <div className="skill-card reveal" key={skill.title}>
              <span className="skill-icon">{skill.icon}</span>
              <h3>{skill.title}</h3>
              <p>{skill.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}