import './StatusBar.css';

/**
 * StatusBar — thin fixed header.
 * Mimics an aerospace HUD strip: callsign, system status indicators, clock.
 * Information-dense, not decorative — every cell has meaning.
 */
export default function StatusBar() {
  return (
    <header className="status-bar" role="banner">
      <div className="status-bar__inner">
        <div className="sb-group">
          <span className="sb-callsign">AERODYNE / R.K.</span>
          <span className="sb-sep" aria-hidden>·</span>
          <span className="sb-meta mono">REV 02.6</span>
        </div>

        <nav className="sb-nav" aria-label="Section navigation">
          <a href="#hero" className="sb-link mono">00 / IDENTITY</a>
          <a href="#systems" className="sb-link mono">01 / SYSTEMS</a>
          <a href="#projects" className="sb-link mono">02 / PROJECTS</a>
        </nav>

        <div className="sb-group sb-group--right">
          <span className="pulse-dot violet" aria-hidden />
          <span className="sb-status mono">FIELD · ACTIVE</span>
        </div>
      </div>
      <div className="sb-rule" />
    </header>
  );
}
