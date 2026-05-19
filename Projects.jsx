import { useState, useCallback } from 'react';
import { projects } from '../data/projects.js';
import './Projects.css';

export default function Projects() {
  const [open, setOpen] = useState(() => new Set(['PRJ-05'])); // capstone open by default

  const toggle = useCallback((id) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <section id="projects" className="projects section" aria-labelledby="projects-title">
      <div className="container">
        <header className="projects__header reveal">
          <span className="idx-tag mono">02 / PROJECTS</span>
          <h2 id="projects-title" className="projects__title">
            Case studies — engineering record
          </h2>
          <p className="projects__desc">
            Five entries: a competition project, a national-scholarship defence, an independent
            research paper, an in-house instrumentation build, and the active capstone. Each entry
            follows a fixed structure — problem, methodology, contribution, optimisation, result —
            so authorship and decision traceability are visible without reading between the lines.
          </p>
        </header>

        <ul className="projects__list" aria-label="Project case studies">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              isOpen={open.has(p.id)}
              onToggle={() => toggle(p.id)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, isOpen, onToggle }) {
  const {
    id, code, title, subtitle, domain, year, status, problem,
    methodology, contribution, optimisation, result, tags, featured,
    failure_mode, uncertainty, tradeoff,
  } = project;

  return (
    <li
      className={`prj-card reveal${featured ? ' prj-card--featured' : ''}${isOpen ? ' is-open' : ''}`}
      style={{ transitionDelay: `${Math.min(index * 60, 240)}ms` }}
    >
      <button
        className="prj-card__summary"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${id}-detail`}
      >
        <div className="prj-card__col-id">
          <span className="prj-card__num mono">{String(index + 1).padStart(2, '0')}</span>
          <span className="prj-card__code mono">{code}</span>
          {featured && <span className="prj-card__featured-tag mono">CAPSTONE</span>}
        </div>

        <div className="prj-card__col-main">
          <h3 className="prj-card__title">{title}</h3>
          <p className="prj-card__subtitle">{subtitle}</p>
        </div>

        <div className="prj-card__col-meta">
          <span className="prj-card__meta-item mono">{domain}</span>
          <span className="prj-card__meta-sep" aria-hidden />
          <span className="prj-card__meta-item mono">{year}</span>
          <span className="prj-card__meta-sep" aria-hidden />
          <span className="prj-card__meta-item prj-card__status mono">{status}</span>
        </div>

        <div className="prj-card__col-toggle" aria-hidden>
          <ChevronIcon open={isOpen} />
        </div>
      </button>

      <div
        id={`${id}-detail`}
        className="prj-card__detail"
        hidden={!isOpen}
      >
        <div className="prj-card__detail-inner">
          <DetailBlock label="Problem" body={problem} />
          <DetailBlock label="Methodology" list={methodology} />
          {contribution && <DetailBlock label="Contribution" list={contribution} />}
          <DetailBlock label="Optimisation" body={optimisation} accent />
          {featured && failure_mode && (
            <DetailBlock label="Primary failure mode" body={failure_mode} />
          )}
          {featured && uncertainty && (
            <DetailBlock label="Key uncertainty" body={uncertainty} />
          )}
          {featured && tradeoff && (
            <DetailBlock label="Limiting trade-off" body={tradeoff} />
          )}
          <DetailBlock label="Result" body={result} />

          {tags?.length > 0 && (
            <div className="prj-card__tags">
              {tags.map((t) => (
                <span key={t} className="prj-tag mono">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function DetailBlock({ label, body, list, accent }) {
  return (
    <div className={`detail-block${accent ? ' detail-block--accent' : ''}`}>
      <div className="detail-block__label-row">
        <span className="label">{label}</span>
        <span className="detail-block__rule" aria-hidden />
      </div>
      {body && <p className="detail-block__body">{body}</p>}
      {list && (
        <ol className="detail-block__list">
          {list.map((item, i) => (
            <li key={i}>
              <span className="detail-block__index mono">{String(i + 1).padStart(2, '0')}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="square" />
    </svg>
  );
}
