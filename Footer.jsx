import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__top">
          <div className="footer__col">
            <span className="idx-tag mono">END · TRANSMISSION</span>
            <p className="footer__statement">
              Geometry is the easy part. The hard part is knowing which question to ask the geometry.
            </p>
          </div>

          <div className="footer__col footer__col--meta">
            <div className="footer__meta-row">
              <span className="mono footer__k">Contact</span>
              <span className="mono footer__v">available on request</span>
            </div>
            <div className="footer__meta-row">
              <span className="mono footer__k">Posture</span>
              <span className="mono footer__v">student · researcher · builder</span>
            </div>
            <div className="footer__meta-row">
              <span className="mono footer__k">Trajectory</span>
              <span className="mono footer__v">aerospace systems engineering</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span className="mono footer__sig">© R.K. — Aerodyne</span>
          <span className="mono footer__build">build 2026.05 · static</span>
        </div>
      </div>
    </footer>
  );
}
