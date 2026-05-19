# Aerodyne — Engineering Simulation Portfolio

Production-quality interactive portfolio for a pre-university engineering student
specialising in fluid dynamics, aerodynamics, CAD design, and experimental research.

This is not a marketing site. It is an engineering simulation interface that
happens to function as a portfolio.

## Stack

- **React 18** (functional components, hooks, strict-mode safe)
- **Three.js** (curl-noise streamline particle field, isolated module)
- **Vite** (production build, ES2020 target, manual chunk for `three`)
- **Plain CSS** with design tokens (no runtime CSS-in-JS overhead)
- **Vercel-ready** (`vercel.json` included; framework auto-detected)

## Quick start

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → ./dist
npm run preview  # preview the built bundle
```

Deploy to Vercel: push to a Git repo and import in the Vercel dashboard.
The `vercel.json` declares the framework so no manual setup is needed.

## Architecture

```
aerodyne/
├── index.html                  # entry, font preconnect, viewport meta
├── public/
│   └── favicon.svg             # minimal aerofoil glyph
├── src/
│   ├── main.jsx                # React mount
│   ├── App.jsx                 # composition of layers
│   ├── styles/
│   │   └── globals.css         # design tokens, reset, utilities
│   ├── three/
│   │   └── AirflowField.js     # ⚠ ALL Three.js lives here — no other module touches three
│   ├── hooks/
│   │   └── useReveal.js        # IntersectionObserver-based scroll reveal
│   ├── data/
│   │   ├── systems.js          # 3 engineering system modules
│   │   └── projects.js         # 5 project case studies
│   └── components/
│       ├── AirflowBackground.jsx   # thin React shell around AirflowField
│       ├── StatusBar.jsx           # fixed HUD strip
│       ├── Hero.jsx                # Layer 1: identity statement
│       ├── Systems.jsx             # Layer 2: simulation dashboard
│       ├── Projects.jsx            # Layer 3: case studies
│       └── Footer.jsx              # sign-off
├── vite.config.js              # production build config
├── vercel.json                 # deployment config
└── package.json
```

### Separation of UI vs simulation

The Three.js airflow system is fully isolated in `src/three/AirflowField.js`.
No React component imports `three` directly except `AirflowBackground.jsx`,
which is a thin lifecycle shell. The simulation can be swapped, disabled, or
replaced without touching any UI code.

## The three scroll layers

| Layer        | File                | Purpose                                     |
|--------------|---------------------|---------------------------------------------|
| **Hero**     | `Hero.jsx`          | Identity statement + telemetry sidebar      |
| **Systems**  | `Systems.jsx`       | Engineering method as a dashboard (3 panels)|
| **Projects** | `Projects.jsx`      | 5 expandable case-study cards               |

The user scrolls vertically through these in order. The airflow field is fixed
behind everything; its speed and swirl frequency are gently modulated by scroll
progress to create coupling without distracting motion.

## Airflow field — performance notes

The streamline field is built around a CPU-side curl-noise vector field. Particles
are advected each frame and drawn as `LineSegments` (head + tail per particle) with
additive blending.

- **Particle count**: 1800 desktop, 700 on mobile/low-core hardware (auto-detected)
- **Pixel ratio**: capped at 1.5×
- **Pause on tab hidden** via `visibilitychange`
- **Resize throttled** through `requestAnimationFrame`
- **dt clamped** to 50ms to prevent jumps after long pauses
- **Reduced motion**: respects `prefers-reduced-motion: reduce` (field disabled)
- **WebGL failure**: caught silently — site degrades to a clean static graphite UI

## Design system

| Token              | Value         | Use                                       |
|--------------------|---------------|-------------------------------------------|
| `--bg-010`         | `#0a0b0e`     | Page base (graphite)                      |
| `--ink-100`        | `#e7e9ee`     | Primary text                              |
| `--acc-violet`     | `#8b7ae8`     | Aerodynamic / streamline accent           |
| `--acc-cyan`       | `#5fb8d4`     | Telemetry / validation accent             |
| `--font-display`   | Space Grotesk | Headings, body, UI                        |
| `--font-mono`      | JetBrains Mono| Codes, IDs, technical data                |

Borders are 1px hairlines (`--line-200`). Border radius is intentionally sharp
(`2px`) — aerospace UI does not use rounded corners.

## Editing content

All copy lives in two files:

- `src/data/systems.js` — three engineering disciplines
- `src/data/projects.js` — five case studies

Each project has a `featured` flag for the capstone treatment. No data is generated
or fake — every entry is concrete.

## Browser support

Modern evergreens (Chrome/Edge/Safari/Firefox latest two versions).
Requires WebGL for the airflow field; falls back gracefully without it.
