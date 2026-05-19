import { useEffect, useRef } from 'react';
import { AirflowField } from '../three/AirflowField.js';

/**
 * AirflowBackground
 * Mounts the Three.js airflow renderer into a fixed full-screen layer.
 * Strictly background — does not intercept events, does not re-render with parents.
 */
export default function AirflowBackground() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    // Respect reduced motion: skip the field entirely.
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let field;
    try {
      field = new AirflowField(ref.current, { maxParticles: 1800 });
    } catch (err) {
      // WebGL unavailable / context creation failed — silently skip.
      // eslint-disable-next-line no-console
      console.warn('Airflow disabled:', err?.message || err);
    }

    return () => {
      try { field?.dispose(); } catch { /* ignore */ }
    };
  }, []);

  return <div ref={ref} className="fx-canvas" aria-hidden="true" />;
}
