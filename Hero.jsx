import './Hero.css';

export default function Hero() {
  return (
    <section id="hero" className="hero section" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero__grid">
          <div className="hero__meta reveal">
            <span className="idx-tag mono">00 / IDENTITY</span>
            <div className="hero__coords mono">
              <span>LAT 51.5074°N</span>
              <span>LON 00.1278°W</span>
            </div>
          </div>

          <h1 id="hero-title" className="hero__title reveal" style={{ transitionDelay: '60ms' }}>
            Engineering <em>aerodynamic systems</em>
            <br />
            for <span className="hero__title-accent">performance optimisation</span>.
          </h1>

          <p className="hero__lede reveal" style={{ transitionDelay: '140ms' }}>
            Pre-university engineering student. Works across fluid-dynamics analysis,
            parametric CAD, and in-house experimental validation as a single coupled method.
            Every design decision is traceable to a simulated or measured outcome.
          </p>

          <div className="hero__discipline-row reveal" style={{ transitionDelay: '220ms' }}>
            <Discipline code="FLD" label="Fluid Dynamics" />
            <Sep />
            <Discipline code="CAD" label="Engineering Design" />
            <Sep />
            <Discipline code="EXP" label="Experimental Research" />
          </div>

          <a href="#systems" className="hero__cta reveal mono" style={{ transitionDelay: '320ms' }}>
            <span>View systems</span>
            <Arrow />
          </a>
        </div>

        {/* Right-side telemetry block — subtle technical detail, not decoration:
            data echoes the engineering posture stated in the headline. */}
        <aside className="hero__telemetry reveal" style={{ transitionDelay: '180ms' }} aria-hidden="true">
          <div className="tel-row">
            <span className="tel-k mono">methodology</span>
            <span className="tel-v mono">analyse → model → build → test → optimise</span>
          </div>
          <div className="tel-row">
            <span className="tel-k mono">recognition</span>
            <span className="tel-v mono">Arkwright Scholar · F1iS National 3rd</span>
          </div>
          <div className="tel-row">
            <span className="tel-k mono">focus</span>
            <span className="tel-v mono">adaptive aerodynamics · validation systems</span>
          </div>
          <div className="tel-row">
            <span className="tel-k mono">trajectory</span>
            <span className="tel-v mono">aerospace systems engineering</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Discipline({ code, label }) {
  return (
    <span className="discipline">
      <span className="discipline__code mono">{code}</span>
      <span className="discipline__label">{label}</span>
    </span>
  );
}

function Sep() {
  return <span className="hero__discipline-sep" aria-hidden="true" />;
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1.5V12.5M7 12.5L2.5 8M7 12.5L11.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
    </svg>
  );
}
