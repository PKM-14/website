/**
 * AirflowField — GPU-efficient streamline particle system.
 *
 * Design intent: CFD-inspired flow visualisation as ambient backdrop.
 * - ~1800 particles advected through a procedural curl-noise vector field
 * - LineSegments geometry: each particle leaves a short trail (current → previous)
 * - Additive blending on a deep graphite background → soft violet/cyan lines
 * - Scroll progress modulates flow speed & secondary swirl frequency
 * - Auto-degrades particle count on low-end hardware
 * - Pause on tab hidden, resize-throttled
 *
 * No external dependencies beyond `three`.
 */

import * as THREE from 'three';

/* ─────────── Curl noise (cheap CPU-side) ─────────── */
// Classic 3D simplex-ish gradient noise — small, no allocations per call.
const PERM = new Uint8Array(512);
{
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  // Deterministic shuffle (seed 1337)
  let seed = 1337;
  const rng = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a, b, t) { return a + t * (b - a); }
function grad(hash, x, y, z) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function noise3(x, y, z) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);
  const A = PERM[X] + Y, AA = PERM[A] + Z, AB = PERM[A + 1] + Z;
  const B = PERM[X + 1] + Y, BA = PERM[B] + Z, BB = PERM[B + 1] + Z;
  return lerp(
    lerp(
      lerp(grad(PERM[AA], x, y, z), grad(PERM[BA], x - 1, y, z), u),
      lerp(grad(PERM[AB], x, y - 1, z), grad(PERM[BB], x - 1, y - 1, z), u),
      v
    ),
    lerp(
      lerp(grad(PERM[AA + 1], x, y, z - 1), grad(PERM[BA + 1], x - 1, y, z - 1), u),
      lerp(grad(PERM[AB + 1], x, y - 1, z - 1), grad(PERM[BB + 1], x - 1, y - 1, z - 1), u),
      v
    ),
    w
  );
}

// Compute a 2D curl from a scalar 3D potential — gives divergence-free, flow-like motion.
const EPS = 0.08;
function curl2D(x, y, z, out) {
  const n1 = noise3(x, y + EPS, z);
  const n2 = noise3(x, y - EPS, z);
  const n3 = noise3(x + EPS, y, z);
  const n4 = noise3(x - EPS, y, z);
  out.x = (n1 - n2) / (2 * EPS);
  out.y = -(n3 - n4) / (2 * EPS);
}

/* ─────────── AirflowField ─────────── */

export class AirflowField {
  constructor(container, opts = {}) {
    this.container = container;
    this.opts = {
      maxParticles: 1800,
      ...opts,
    };

    this.scrollProgress = 0;     // 0 → 1 across the document
    this.targetScroll = 0;
    this.targetSpeed = 1.0;
    this.currentSpeed = 1.0;

    this.disposed = false;
    this.visible = !document.hidden;
    this._lastTime = 0;
    this._rafId = null;
    this._resizeRaf = null;

    this._init();
  }

  /* Init renderer, scene, geometry */
  _init() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // Detect low-end: scale particle count down on weak hardware
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /mobi|android|iphone|ipad/.test(ua);
    const cores = navigator.hardwareConcurrency || 4;
    const lowEnd = isMobile || cores <= 4;

    this.particleCount = lowEnd
      ? Math.min(700, this.opts.maxParticles)
      : this.opts.maxParticles;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.style.display = 'block';
    this.container.appendChild(this.renderer.domElement);

    // Scene & ortho camera (2D-ish flow)
    this.scene = new THREE.Scene();
    const aspect = w / h;
    const viewH = 10;
    this.camera = new THREE.OrthographicCamera(
      -viewH * aspect, viewH * aspect,
      viewH, -viewH,
      0.1, 100
    );
    this.camera.position.z = 10;

    this._buildParticles();

    // Listeners
    this._onResize = this._onResize.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onVisibility = this._onVisibility.bind(this);
    window.addEventListener('resize', this._onResize, { passive: true });
    window.addEventListener('scroll', this._onScroll, { passive: true });
    document.addEventListener('visibilitychange', this._onVisibility);

    this._tick = this._tick.bind(this);
    this._lastTime = performance.now();
    this._rafId = requestAnimationFrame(this._tick);
  }

  _buildParticles() {
    const n = this.particleCount;
    this.positions = new Float32Array(n * 2); // x, y
    this.lifetimes = new Float32Array(n);     // age (0 → maxLife)
    this.maxLife = new Float32Array(n);

    // Line segments: 2 endpoints per particle (current + previous) → 6 floats per particle
    const segPositions = new Float32Array(n * 2 * 3);
    const segColors = new Float32Array(n * 2 * 3);

    // Seed particles randomly across viewport with random lifetimes (avoids cohort effect)
    const ar = this.camera.right / this.camera.top;
    for (let i = 0; i < n; i++) {
      this.positions[i * 2] = (Math.random() * 2 - 1) * this.camera.top * ar * 1.1;
      this.positions[i * 2 + 1] = (Math.random() * 2 - 1) * this.camera.top * 1.1;
      this.maxLife[i] = 2 + Math.random() * 3.5;
      this.lifetimes[i] = Math.random() * this.maxLife[i];
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(segPositions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(segColors, 3));

    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.lines = new THREE.LineSegments(geo, mat);
    this.scene.add(this.lines);

    this.segGeo = geo;
    this.segPositions = segPositions;
    this.segColors = segColors;

    // Reusable curl output
    this._curlOut = { x: 0, y: 0 };
  }

  _onResize() {
    if (this._resizeRaf) cancelAnimationFrame(this._resizeRaf);
    this._resizeRaf = requestAnimationFrame(() => {
      const w = this.container.clientWidth || window.innerWidth;
      const h = this.container.clientHeight || window.innerHeight;
      const aspect = w / h;
      const viewH = 10;
      this.camera.left = -viewH * aspect;
      this.camera.right = viewH * aspect;
      this.camera.top = viewH;
      this.camera.bottom = -viewH;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
    });
  }

  _onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    this.targetScroll = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    // Scroll boosts flow speed slightly to feel reactive — capped
    this.targetSpeed = 1.0 + this.targetScroll * 0.45;
  }

  _onVisibility() {
    this.visible = !document.hidden;
    if (this.visible && !this._rafId && !this.disposed) {
      this._lastTime = performance.now();
      this._rafId = requestAnimationFrame(this._tick);
    }
  }

  _tick(now) {
    if (this.disposed) return;
    if (!this.visible) { this._rafId = null; return; }

    const dt = Math.min(0.05, (now - this._lastTime) / 1000); // clamp to avoid jumps
    this._lastTime = now;

    // Smooth scroll / speed
    this.scrollProgress += (this.targetScroll - this.scrollProgress) * 0.05;
    this.currentSpeed += (this.targetSpeed - this.currentSpeed) * 0.08;

    this._updateParticles(dt, now * 0.001);
    this.renderer.render(this.scene, this.camera);

    this._rafId = requestAnimationFrame(this._tick);
  }

  _updateParticles(dt, time) {
    const n = this.particleCount;
    const segPos = this.segPositions;
    const segCol = this.segColors;
    const positions = this.positions;
    const lifetimes = this.lifetimes;
    const maxLife = this.maxLife;
    const curl = this._curlOut;

    const ar = this.camera.right / this.camera.top;
    const bx = this.camera.top * ar * 1.1;
    const by = this.camera.top * 1.1;

    // Base drift bias — gives flow a dominant "wind" direction (left → right, slight downward)
    const driftX = 0.55 * this.currentSpeed;
    const driftY = -0.05 * this.currentSpeed;

    // Scroll modulates secondary swirl frequency
    const swirlFreq = 0.18 + this.scrollProgress * 0.06;
    const t = time * 0.08;

    // Colour palette — violet → cyan mix based on y position (telemetry feel)
    // Mid-tone targets (additive will brighten them naturally)
    const VR = 0.34, VG = 0.28, VB = 0.62; // violet (#8b7ae8 dim)
    const CR = 0.22, CG = 0.50, CB = 0.62; // cyan   (#5fb8d4 dim)

    for (let i = 0; i < n; i++) {
      const i2 = i * 2;
      const i6 = i * 6; // 2 endpoints * 3 components

      let x = positions[i2];
      let y = positions[i2 + 1];

      // Previous (trail tail) endpoint
      segPos[i6]     = x;
      segPos[i6 + 1] = y;
      segPos[i6 + 2] = 0;

      // Curl-noise field
      curl2D(x * swirlFreq, y * swirlFreq, t, curl);

      const vx = (curl.x * 1.6 + driftX) * dt;
      const vy = (curl.y * 1.6 + driftY) * dt;

      x += vx;
      y += vy;

      lifetimes[i] += dt;

      // Respawn if off-screen or aged out — recycles to left side or random edge
      if (x > bx || x < -bx || y > by || y < -by || lifetimes[i] > maxLife[i]) {
        // 70% respawn from left edge (preserves dominant flow direction), 30% random
        if (Math.random() < 0.7) {
          x = -bx + Math.random() * 0.5;
          y = (Math.random() * 2 - 1) * by * 0.95;
        } else {
          x = (Math.random() * 2 - 1) * bx;
          y = (Math.random() * 2 - 1) * by;
        }
        lifetimes[i] = 0;
        // Move tail to head to avoid long visible reset segment
        segPos[i6]     = x;
        segPos[i6 + 1] = y;
      }

      positions[i2] = x;
      positions[i2 + 1] = y;

      // Current (trail head)
      segPos[i6 + 3] = x;
      segPos[i6 + 4] = y;
      segPos[i6 + 5] = 0;

      // Colour: blend violet/cyan by vertical band; fade by life envelope
      const band = (y / by) * 0.5 + 0.5; // 0 → 1
      const lifeFrac = lifetimes[i] / maxLife[i];
      const envelope = Math.sin(lifeFrac * Math.PI); // 0 → 1 → 0

      const r = (VR * (1 - band) + CR * band) * envelope;
      const g = (VG * (1 - band) + CG * band) * envelope;
      const b = (VB * (1 - band) + CB * band) * envelope;

      // Tail slightly dimmer than head → directional gradient feel
      segCol[i6]     = r * 0.35;
      segCol[i6 + 1] = g * 0.35;
      segCol[i6 + 2] = b * 0.35;
      segCol[i6 + 3] = r;
      segCol[i6 + 4] = g;
      segCol[i6 + 5] = b;
    }

    this.segGeo.attributes.position.needsUpdate = true;
    this.segGeo.attributes.color.needsUpdate = true;
  }

  dispose() {
    this.disposed = true;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this._resizeRaf) cancelAnimationFrame(this._resizeRaf);
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('scroll', this._onScroll);
    document.removeEventListener('visibilitychange', this._onVisibility);

    this.segGeo?.dispose();
    this.lines?.material?.dispose();
    this.renderer?.dispose();
    if (this.renderer?.domElement?.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
