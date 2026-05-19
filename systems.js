/**
 * Engineering systems — the working method, layered.
 *
 * Hierarchy (textually implied, layout unchanged):
 *   FLD — analytical layer. The decision-driving system.
 *   CAD — execution layer. Translates decisions into geometry.
 *   EXP — validation layer. The truth check that closes the loop.
 *
 * Each panel reads as a field-report entry: what the system does, how it
 * does it, what it produces downstream, and the working envelope.
 */

export const systems = [
  {
    id: 'SYS-01',
    code: 'FLD',
    name: 'Fluid Dynamics — analytical layer',
    summary:
      'Primary decision-making system. Resolves the flow field around a geometry before metal is cut — identifying separation onset, wake structure, and pressure distribution so that design choices are made against simulated evidence, not intuition. All downstream geometry and test plans are anchored here.',
    methods: [
      'RANS CFD with k-ω SST closure (OpenFOAM, simpleFoam)',
      'Boundary-layer resolution and separation-point tracking',
      'Surface Cp mapping; drag / lift decomposition by component',
      'Wake-width and turbulence-intensity readout for follow-on test design',
    ],
    enables:
      'Geometry decisions made against pressure and velocity fields — not assumption. Each design variable is ranked by its contribution to the measured aerodynamic quantity it targets.',
    metrics: [
      { k: 'Reynolds range', v: '10⁴ – 10⁶' },
      { k: 'Solver class', v: 'RANS / LES' },
    ],
  },
  {
    id: 'SYS-02',
    code: 'CAD',
    name: 'CAD — execution layer',
    summary:
      'Translates analytical decisions into manufacturable geometry. Parametric so that any variable flagged by the fluid-dynamics layer — fillet radius, taper angle, camber distribution — can be re-swept and re-simulated without rebuilding from scratch.',
    methods: [
      'Parametric solid modelling (Fusion 360, SolidWorks)',
      'G2 / G3 surface continuity on aero-critical faces',
      'Design-for-manufacture constraints driven by available process (CNC, FDM, hand-finish)',
      'Variable tables coupled to simulation inputs — closed iteration loop',
    ],
    enables:
      'Geometry that survives a constraint change. New simulation result or fabrication limit propagates through the model in minutes, not days.',
    metrics: [
      { k: 'Iteration cycle', v: '< 30 min' },
      { k: 'Param coupling', v: 'full chain' },
    ],
  },
  {
    id: 'SYS-03',
    code: 'EXP',
    name: 'Experimental — validation layer',
    summary:
      'The truth check. Physical measurement that either confirms the analytical prediction or quantifies the deviation — and feeds that deviation back as a correction factor on the next CFD cycle. No design is considered closed until simulation and measurement agree within a stated tolerance.',
    methods: [
      'Open-circuit wind tunnel — in-house build, characterised against pitot reference',
      'Pitot rake and pressure-tap arrays for velocity and Cp profiles',
      'Flow visualisation (tuft, smoke) for separation and reattachment',
      'Sim-vs-test deviation analysis with stated uncertainty bounds',
    ],
    enables:
      'Confidence that simulated gains survive contact with real flow — and, when they do not, a calibration path that improves the next CFD run rather than discarding it.',
    metrics: [
      { k: 'Test velocity', v: '0 – 25 m/s' },
      { k: 'Sample rate', v: '≤ 1 kHz' },
    ],
  },
];
