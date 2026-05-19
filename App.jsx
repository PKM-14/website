import { useRef } from 'react';
import AirflowBackground from './components/AirflowBackground.jsx';
import StatusBar from './components/StatusBar.jsx';
import Hero from './components/Hero.jsx';
import Systems from './components/Systems.jsx';
import Projects from './components/Projects.jsx';
import Footer from './components/Footer.jsx';
import { useReveal } from './hooks/useReveal.js';

export default function App() {
  const rootRef = useRef(null);
  useReveal(rootRef);

  return (
    <div ref={rootRef}>
      {/* Background layers — z=0 / z=1 */}
      <AirflowBackground />
      <div className="fx-grain" aria-hidden="true" />

      {/* Content — z=2 */}
      <StatusBar />
      <main>
        <Hero />
        <Systems />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}
