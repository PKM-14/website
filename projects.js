/**
 * Projects — case studies.
 *
 * Per-project structure:
 *   problem        — the engineering question, constraint set stated explicitly
 *   methodology    — ordered steps, each describing a method tied to an outcome
 *   contribution   — personal authorship: what was designed, iterated, decided,
 *                    and what alternative was rejected and why
 *   optimisation   — cause → decision → measurable consequence
 *   result         — observed outcome, with numbers where available
 *
 * Capstone (featured: true) additionally carries:
 *   failure_mode   — the most likely engineering failure
 *   uncertainty    — the dominant unknown remaining in the design
 *   tradeoff       — the constraint that bounds peak performance
 */

export const projects = [
  {
    id: 'PRJ-01',
    code: 'F1S',
    title: 'F1 in Schools',
    subtitle: '3rd Place — National Finals',
    domain: 'Aerodynamic Optimisation',
    year: '2024',
    status: 'Completed',
    problem:
      'Design a CO₂-propelled scale car for minimum drag under a fixed body-volume envelope and fixed-mass tolerance, against a national field of regional-champion teams operating with significantly larger fabrication budgets.',
    methodology: [
      'Baseline body modelled in Fusion 360 with three parametric drivers: body width, nose radius, rear taper angle.',
      'CFD sweep of baseline plus four candidate shells in OpenFOAM (simpleFoam, k-ω SST) at race-condition velocity.',
      'Surface Cp mapping to locate separation on the rear deck and inboard wheel fairings.',
      'Iterative geometry refinement targeting attached flow across the rear 80% of body length.',
      'Final candidate machined and run on the regulation track for time-of-flight validation against CFD prediction.',
    ],
    contribution: [
      'Owned the CFD pipeline end to end — mesh, boundary conditions, post-processing — and cross-checked results against a coarser second mesh to bound numerical error.',
      'Identified the wheel-fairing fillet radius as the dominant drag driver after the first sweep; redirected subsequent iterations onto that variable rather than splitting effort across the full parameter set.',
      'Rejected an aggressive low-drag nose profile because Cp data showed early stagnation movement and unstable attachment at off-axis yaw — chose a slightly higher-drag nose with stable attachment instead.',
      'Tuned nose taper against wake width, not Cd in isolation, so the car held trailing-position pace as well as straight-line speed.',
    ],
    optimisation:
      'Drag was prioritised over downforce because the brief rewards top-end velocity, not cornering grip. The wheel-fairing fillet radius alone accounted for ~38% of the Cd delta seen across iterations — every subsequent design hour was spent there, not on lower-leverage variables. Nose taper was tuned to a wake-width target rather than to minimum Cd, accepting a small Cd penalty for measurably more stable trailing-car behaviour.',
    result:
      '3rd place at National Finals against 30+ regional-champion teams. Final race pace within 1.4% of the winning car despite sub-quartile fabrication budget. Measured time-of-flight tracked CFD prediction to within 3%.',
    tags: ['CFD', 'OpenFOAM', 'Fusion 360', 'Iterative design'],
  },
  {
    id: 'PRJ-02',
    code: 'ARK',
    title: 'Arkwright Engineering Scholarship',
    subtitle: 'Selective National Recognition',
    domain: 'Engineering Aptitude',
    year: '2023',
    status: 'Awarded',
    problem:
      'Two-stage selection — timed aptitude examination plus a panel interview defending an original engineering proposal — assessing analytical reasoning, design judgement, and the ability to hold a position under technical scrutiny.',
    methodology: [
      'Proposal: a low-cost airflow visualisation rig for school-level aerodynamics teaching.',
      'Comparative analysis of three visualisation methods — smoke, tuft, laser sheet — scored against cost, repeatability, and safety for unsupervised student use.',
      'Defended the position that measurement uncertainty is the more useful quantity to teach at learner stage, not measurement precision.',
    ],
    contribution: [
      'Authored the proposal from scratch — chose teaching-instrument framing over research-instrument framing, which reframed the panel’s evaluation criteria entirely.',
      'Pre-built the cost-benefit comparison matrix so trade-offs could be defended numerically rather than argued from intuition.',
      'Rejected laser-sheet visualisation despite higher fidelity — safety constraints and operator training requirements made it unviable for the stated end-user.',
      'Identified ahead of the interview that the load-bearing argument was the framing of trade-offs, not the rig itself; prepared accordingly.',
    ],
    optimisation:
      'The rig was pitched as teaching-first, research-second — accepting reduced fidelity to gain unsupervised student operability. This single framing choice converted a moderate proposal into a defensible one: the panel evaluated against pedagogical fit, where the lower-cost design wins, rather than against measurement fidelity, where it would have lost.',
    result:
      'Scholarship awarded. Sustained engineering mentorship, technical sponsorship, and entry into the national engineering pipeline.',
    tags: ['Interview defence', 'Design rationale', 'Engineering reasoning'],
  },
  {
    id: 'PRJ-03',
    code: 'BIO',
    title: 'Ionic Wind × Shark Skin Biomimicry',
    subtitle: 'Research Paper — Bio-inspired Fluid Dynamics',
    domain: 'Independent Research',
    year: '2024',
    status: 'Published — internal',
    problem:
      'Electrohydrodynamic (EHD) thrusters suffer from low thrust-to-area ratios and unstable corona discharge at upper voltage. Open question: does denticle-aligned surface microstructure — analogous to shark-skin riblets — suppress turbulent breakdown in the post-corona region and raise effective thrust per unit electrode area?',
    methodology: [
      'Literature synthesis across EHD propulsion (Christenson & Moller; MIT EAD aircraft, Barrett et al.) and riblet drag reduction (Bechert et al., Walsh).',
      'Working hypothesis: riblets aligned with ion drift suppress lateral turbulent fluctuation in the ion-laden boundary layer, stabilising thrust.',
      'Benchtop test cell built with swappable electrode plates — smooth aluminium control vs. 3D-printed denticle array with riblet pitch as primary variable.',
      'Measurement chain: micro-balance for thrust, series ammeter for current draw, high-speed imaging for corona stability across an applied-voltage sweep.',
    ],
    contribution: [
      'Designed and built the test cell — electrode mount, alignment jig, micro-balance integration — from scratch.',
      'Made the central methodological decision to normalise riblet pitch against estimated ion mean free path rather than against biological denticle scale. This reframed the project from biomimicry-by-analogy to length-scale matching.',
      'Iterated electrode-gap geometry three times after early runs showed corona instability dominating the thrust signal; locked geometry once corona stability was repeatable across runs.',
      'Rejected an early plan to vary riblet height as a second axis — single-variable sweep gave cleaner causation and the rig’s measurement uncertainty would have masked the second-order effect anyway.',
    ],
    optimisation:
      'Riblet pitch was treated as the single primary variable, normalised against ion mean free path rather than copied from biological scale. That reframing — from "copy nature" to "match the relevant physical length scale" — is the methodological core of the paper: it explains why direct biomimicry was failing in earlier amateur literature and predicts a different optimal pitch.',
    result:
      'Measurable improvement in thrust stability at the upper end of the voltage sweep, where the smooth-plate control became unstable. Paper documents the rig, the deviation between predicted and measured scaling, and a refined experiment plan for a follow-on study with tighter pitch resolution.',
    tags: ['EHD propulsion', 'Biomimicry', 'Experimental rig', 'Literature synthesis'],
  },
  {
    id: 'PRJ-04',
    code: 'WT',
    title: 'Wind Tunnel Development',
    subtitle: 'In-House Validation Instrument',
    domain: 'Instrumentation Design',
    year: '2024 – 2025',
    status: 'In development',
    problem:
      'No accessible school-grade subsonic wind tunnel available for validating CFD work produced by the other projects. Commercial units are cost-prohibitive; existing DIY designs typically run at turbulence intensities (5–8%) too high to discriminate between competing aerodynamic geometries.',
    methodology: [
      'Open-circuit Eiffel-type configuration selected over closed-circuit for footprint, cost, and ease of test-section access.',
      'Contraction ratio set at 6:1 — chosen from the turbulence-intensity-vs-contraction-length trade curves in Mehta & Bradshaw (1979).',
      'Conditioning train: hexagonal-cell honeycomb followed by three graded mesh screens, targeting < 1% turbulence intensity at test-section inlet.',
      'Instrumentation: pitot rake at test-section inlet for velocity profile, surface pressure taps for Cp distribution on mounted models.',
      'Plenum chamber and contraction surfaces built with internal hand-finishing to suppress surface-roughness-induced transition.',
    ],
    contribution: [
      'Specified the entire instrument against a measurement-quality target (< 1% TI) rather than a velocity target — the more useful specification for CFD validation, but the harder one to hit.',
      'Designed the contraction profile in CAD using a matched-cubic curve to keep favourable pressure gradient through the contraction and prevent boundary-layer growth on the walls.',
      'Rejected a stepped honeycomb-only conditioning section in favour of honeycomb-plus-screens; honeycomb alone removes swirl but leaves small-scale turbulence intact.',
      'Built the frame and contraction; screens, pitot rake, and DAQ chain are the current work front.',
    ],
    optimisation:
      'The design is driven by measurement quality, not peak velocity. A slower, cleaner flow is more useful for resolving small aerodynamic differences than a fast, noisy one. The contraction was the longest-considered decision in the build — its geometry sets the ceiling on every measurement the tunnel will ever take, and a poor contraction cannot be recovered downstream.',
    result:
      'Frame and contraction complete. Honeycomb fitted; screens, instrumentation, and DAQ in active build. Target operating envelope: models up to 200 mm chord at 0–25 m/s, with characterised TI to be reported alongside first test runs.',
    tags: ['Wind tunnel', 'Instrumentation', 'Turbulence management', 'Open-circuit'],
  },
  {
    id: 'PRJ-05',
    code: 'MW',
    title: 'Morphing Wing RC Aircraft',
    subtitle: 'Capstone — Adaptive Aerodynamics',
    domain: 'Adaptive Systems',
    year: '2025 – 2026',
    status: 'Concept → Prototype',
    featured: true,
    problem:
      'A fixed-geometry wing is always a compromise: a profile optimised for cruise carries an efficiency penalty in climb and approach. The capstone tests whether a small RC platform can carry a compliant, span-wise morphing wing whose camber adapts in flight, and whether the actuation overhead — mass, power, response delay — is recovered through aerodynamic gain across a representative mission profile.',
    methodology: [
      'Wing structure: corrugated internal skeleton with elastomeric skin — bending compliance in the camber axis, stiffness in span — driven by a single servo per span station, replacing discrete control surfaces.',
      'XFOIL polar sweep across a target camber range to define the morphing envelope at the mission Reynolds number.',
      'CFD on transitional geometries — intermediate camber states — not only on the endpoint shapes, because the penalty during the morph itself is the failure mode that gets overlooked.',
      'Sub-scale section testing in the in-house wind tunnel before committing to the full-span build, feeding measured Cl/Cd back into the actuation control law.',
      'Mass and energy budgets tracked at each iteration to verify that aerodynamic gain still exceeds actuation overhead.',
    ],
    contribution: [
      'Defined the optimisation function as net energy per cruise kilometre, not peak L/D — this single decision sets a different optimal geometry to the textbook one and reframes every downstream trade-off.',
      'Selected a compliant-mechanism structure over a hinged-segment morphing concept; hinged designs were rejected for mass penalty, hinge friction, and surface-step drag that would have eroded the aerodynamic gain.',
      'Designed the CFD test matrix to include transitional camber states explicitly, after early XFOIL results showed the intermediate geometries had non-monotonic drag behaviour.',
      'Integrated the project as the validation case for the in-house wind tunnel — closing analysis, fabrication, and test inside a single project ecosystem.',
    ],
    optimisation:
      'The wing is treated as a coupled system: actuator mass, servo response time, and skin compliance are traded against aerodynamic gain at the mission level, not the airfoil level. Optimising for net energy per cruise kilometre — rather than peak L/D — leads to a softer morphing range with lower actuation duty cycle, which preserves the energy budget the morphing was meant to win in the first place.',
    failure_mode:
      'Most likely failure: skin buckling or local wrinkling at the leading edge under camber-down actuation, triggering early separation and collapsing the aerodynamic gain the morphing is meant to deliver. Mitigation: graded skin stiffness, leading-edge reinforcement, and tunnel verification of attached flow across the full morph cycle before flight test.',
    uncertainty:
      'Dominant unknown is the dynamic aerodynamic response during the morph transition itself. Static endpoint polars are well-characterised by XFOIL and CFD; the unsteady drag and pitching-moment behaviour during a 0.5–1.0 s camber change is not — and it determines whether the actuation overhead is recovered or wasted.',
    tradeoff:
      'Peak performance is bounded by actuator authority versus structural compliance. A more compliant skin gives a wider morph range but reduces aeroelastic stiffness, raising flutter risk. A stiffer skin is safer but narrows the usable camber range and erodes the gain over a fixed wing. The build operates inside this band — wider is not better.',
    result:
      'In active development. The wing is the integration point for every system above: fluid-dynamics analysis sets the morphing envelope, parametric CAD generates the compliant structure, and the in-house wind tunnel provides the validation loop. Sub-scale section build is the current milestone.',
    tags: ['Morphing wing', 'Compliant mechanism', 'CFD + XFOIL', 'Systems integration', 'Capstone'],
  },
];
