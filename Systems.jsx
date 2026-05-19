import { systems } from '../data/systems.js';
import './Systems.css';

export default function Systems() {
  return (
    <section id="systems" className="systems section" aria-labelledby="systems-title">
      <div className="container">
        <div className="systems__header reveal">
          <span className="idx-tag mono">01 / SYSTEMS</span>
          <h2 id="systems-title" className="systems__title">
            Engineering systems — dashboard
          </h2>
          <p className="systems__desc">
            Three coupled layers compose the working method. The fluid-dynamics layer drives
            decisions; the CAD layer executes them as manufacturable geometry; the experimental
            layer validates the result and feeds correction back upstream. Every project below
            traverses these three layers in order.
          </p>
        </div>

        <div className="systems__pipeline reveal" aria-hidden="true">
          <PipelineStep n="01" label="Analyse" />
          <PipelineEdge />
          <PipelineStep n="02" label="Model" />
          <PipelineEdge />
          <PipelineStep n="03" label="Build" />
          <PipelineEdge />
          <PipelineStep n="04" label="Test" />
          <PipelineEdge />
          <PipelineStep n="05" label="Optimise" active />
        </div>

        <div className="systems__grid">
          {systems.map((sys, i) => (
            <SystemPanel key={sys.id} system={sys} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SystemPanel({ system, delay }) {
  return (
    <article
      className="sys-panel reveal"
      style={{ transitionDelay: `${delay}ms` }}
      aria-labelledby={`${system.id}-name`}
    >
      <header className="sys-panel__head">
        <div className="sys-panel__id">
          <span className="mono sys-panel__sysid">{system.id}</span>
          <span className="pulse-dot" aria-hidden />
        </div>
        <span className="sys-panel__code mono">{system.code}</span>
      </header>

      <h3 id={`${system.id}-name`} className="sys-panel__name">{system.name}</h3>

      <p className="sys-panel__summary">{system.summary}</p>

      <div className="sys-panel__section">
        <span className="label">Methods</span>
        <ul className="sys-panel__methods">
          {system.methods.map((m) => (
            <li key={m}>
              <span className="sys-panel__tick" aria-hidden />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="sys-panel__section">
        <span className="label">Enables</span>
        <p className="sys-panel__enables">{system.enables}</p>
      </div>

      <div className="sys-panel__metrics" aria-hidden="true">
        {system.metrics.map((m) => (
          <div key={m.k} className="sys-metric">
            <span className="sys-metric__k mono">{m.k}</span>
            <span className="sys-metric__v mono">{m.v}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function PipelineStep({ n, label, active }) {
  return (
    <div className={`pipe-step${active ? ' pipe-step--active' : ''}`}>
      <span className="pipe-step__n mono">{n}</span>
      <span className="pipe-step__label mono">{label}</span>
    </div>
  );
}

function PipelineEdge() {
  return <span className="pipe-edge" aria-hidden="true" />;
}
