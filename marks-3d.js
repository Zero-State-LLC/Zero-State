// 3D versions of the method glyph ("Zero is not emptiness") and the local-intelligence enclosure.
// Each is drawn over its SVG in the SVG's own units, so it sits exactly where the flat art was.
// Drag turns it freely in any direction; let go and it eases back to face front.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const deg = THREE.MathUtils.degToRad;
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const FOV = 26;
const IDENTITY = new THREE.Quaternion();

const COLOR = { ink: 0xeee8de, ink2: 0xcbc5bb, muted: 0x9a938a, paper: 0x161311, accent: 0xe8895a };

function makeMaterials() {
  return {
    bone: new THREE.MeshPhysicalMaterial({ color: 0xf2e8d9, roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.45 }),
    copper: new THREE.MeshStandardMaterial({ color: 0xe0915e, metalness: 1, roughness: 0.3 }),
    line: new THREE.MeshStandardMaterial({ color: COLOR.ink2, metalness: 0.15, roughness: 0.55 }),
    muted: new THREE.MeshStandardMaterial({ color: COLOR.muted, metalness: 0.15, roughness: 0.6 }),
    paper: new THREE.MeshBasicMaterial({ color: COLOR.paper }),
  };
}

function extrude(shape, depth, bevel) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth, curveSegments: 96, bevelEnabled: true,
    bevelThickness: bevel, bevelSize: bevel * 0.8, bevelSegments: 4,
  });
  geo.translate(0, 0, -depth / 2);
  return geo;
}

// A square-section bar between two points in the x/y plane.
function bar(x1, y1, x2, y2, thick, depth, material, extend = 0) {
  const len = Math.hypot(x2 - x1, y2 - y1) + extend * 2;
  const m = new THREE.Mesh(new THREE.BoxGeometry(len, thick, depth), material);
  m.position.set((x1 + x2) / 2, (y1 + y2) / 2, 0);
  m.rotation.z = Math.atan2(y2 - y1, x2 - x1);
  return m;
}

// A round rod between two 3D points.
function rod(a, b, r, material) {
  const v = new THREE.Vector3().subVectors(b, a);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, v.length(), 12), material);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.normalize());
  return m;
}

// Text as a flat plane, in the site's mono face, so labels turn with the mark.
function label(text, x, y, anchor, size, color) {
  const px = 8;
  const font = `500 ${size * px}px "Geist Mono", ui-monospace, monospace`;
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  g.font = font;
  g.letterSpacing = `${0.14 * size * px}px`;
  const w = Math.ceil(g.measureText(text).width) + 4;
  const h = Math.ceil(size * px * 1.4);
  c.width = w; c.height = h;
  g.font = font;
  g.letterSpacing = `${0.14 * size * px}px`;
  g.fillStyle = color;
  g.textBaseline = 'alphabetic';
  g.fillText(text, 2, Math.round(size * px * 1.05));
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w / px, h / px),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }),
  );
  const cx = anchor === 'middle' ? x : anchor === 'end' ? x - w / px / 2 : x + w / px / 2;
  // SVG text sits on its baseline; the plane is centred, so lift it by the gap to the baseline.
  m.position.set(cx, y + (h / px) / 2 - size * 1.05, 0);
  return m;
}

// Mounts one 3D stage over an inline SVG.
//   svg: the SVG to replace; viewW: its viewBox width; pivot: [x, y] in viewBox units to turn about;
//   pad: canvas margin around the SVG as a share of its width; depth: camera distance in viewBox units.
function mountStage({ svg, viewW, pivot, pad, depth, build }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return; // No WebGL: the SVG stays.
  }
  const host = svg.parentElement;
  const canvas = renderer.domElement;
  canvas.className = 'mark-3d';
  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);
  host.classList.add('has-3d');
  svg.classList.add('svg-3d');

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.7;
  const key = new THREE.DirectionalLight(0xfff0dc, 1.6);
  key.position.set(-6, 9, 12);
  const rim = new THREE.DirectionalLight(0xff9a5c, 3.0);
  rim.position.set(9, 3, -7);
  scene.add(key, rim);

  const camera = new THREE.PerspectiveCamera(FOV, 1, depth * 0.05, depth * 4);
  camera.position.set(0, 0, depth);
  camera.lookAt(0, 0, 0);

  // spin carries the user's rotation and the pixel scale; root holds the art in viewBox units, y up.
  const spin = new THREE.Group();
  const root = new THREE.Group();
  spin.add(root);
  scene.add(spin);
  const tick = build(root, makeMaterials()) || (() => {});

  function layout() {
    host.style.position = '';
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    const hr = host.getBoundingClientRect();
    const sr = svg.getBoundingClientRect();
    if (!sr.width || !sr.height) return;
    const padPx = pad * sr.width;
    const w = Math.round(sr.width + padPx * 2), h = Math.round(sr.height + padPx * 2);
    canvas.style.left = `${sr.left - hr.left - padPx}px`;
    canvas.style.top = `${sr.top - hr.top - padPx}px`;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    const k = sr.width / viewW;
    const px = padPx + pivot[0] * k, py = padPx + pivot[1] * k;
    camera.aspect = w / h;
    camera.setViewOffset(w, h, w / 2 - px, h / 2 - py, w, h);
    const unitsPerPx = (2 * depth * Math.tan(deg(FOV / 2))) / h;
    spin.scale.setScalar(k * unitsPerPx);
  }
  const ro = new ResizeObserver(layout);
  ro.observe(svg);
  ro.observe(host);
  layout();

  // Trackball: drag rotates about the axis across the drag, in screen space, with a little momentum.
  const user = new THREE.Quaternion();
  const sway = new THREE.Quaternion();
  const swayEuler = new THREE.Euler();
  const vel = new THREE.Vector2();
  const axis = new THREE.Vector3();
  const step = new THREE.Quaternion();
  let dragging = false, lastX = 0, lastY = 0, lastInput = -Infinity;
  function rotateBy(dx, dy) {
    const len = Math.hypot(dx, dy);
    if (!len) return;
    axis.set(dy, dx, 0).normalize();
    step.setFromAxisAngle(axis, len * 0.009);
    user.premultiply(step);
  }
  svg.addEventListener('pointerdown', (e) => {
    dragging = true; lastX = e.clientX; lastY = e.clientY; vel.set(0, 0);
    lastInput = performance.now();
    svg.setPointerCapture(e.pointerId);
  });
  svg.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    rotateBy(dx, dy);
    vel.set(dx, dy);
    lastX = e.clientX; lastY = e.clientY;
    lastInput = performance.now();
  });
  const end = () => { dragging = false; lastInput = performance.now(); };
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);

  // Only draw while the stage is on screen.
  let visible = false;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: '120px' }).observe(host);

  const clock = new THREE.Clock();
  function frame(now) {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    if (visible) {
      if (!dragging) {
        if (vel.lengthSq() > 0.01) {
          rotateBy(vel.x, vel.y);
          vel.multiplyScalar(Math.exp(-dt * 5));
        }
        // After a pause it settles back to face front, as the hero mark does.
        if (now - lastInput > 1800) user.slerp(IDENTITY, 1 - Math.exp(-dt * 1.4));
      }
      const idle = reduceMotion ? 0 : 1;
      swayEuler.set(idle * 0.06 * Math.sin(t * 0.27), idle * 0.2 * Math.sin(t * 0.33), 0);
      sway.setFromEuler(swayEuler);
      spin.quaternion.copy(user).multiply(sway);
      tick(t, dt, now);
      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// Method glyph: viewBox 48 x 48, ring centred at (24, 24). Units here are viewBox units, y up.
function buildMethod(root, mat, highway) {
  // The split zero: two thick cream arcs with round ends, the gaps on the diagonal.
  function arcShape(r, half, a1, a2) {
    const s = new THREE.Shape();
    const ro = r + half, ri = r - half;
    s.moveTo(Math.cos(a1) * ro, Math.sin(a1) * ro);
    s.absarc(0, 0, ro, a1, a2, false);
    s.absarc(Math.cos(a2) * r, Math.sin(a2) * r, half, a2, a2 + Math.PI, false);
    s.absarc(0, 0, ri, a2, a1, true);
    s.absarc(Math.cos(a1) * r, Math.sin(a1) * r, half, a1 + Math.PI, a1 + Math.PI * 2, false);
    return s;
  }
  for (const [a1, a2] of [[51, 219], [231, 399]]) {
    root.add(new THREE.Mesh(extrude(arcShape(14, 1.6, deg(a1), deg(a2)), 2.6, 0.3), mat.bone));
  }

  // The frame: four thin corner brackets.
  const corners = [
    [[-20, 12], [-20, 20], [-12, 20]],
    [[12, 20], [20, 20], [20, 12]],
    [[20, -12], [20, -20], [12, -20]],
    [[-12, -20], [-20, -20], [-20, -12]],
  ];
  for (const [a, b, c] of corners) {
    root.add(bar(a[0], a[1], b[0], b[1], 0.24, 0.24, mat.muted, 0.12));
    root.add(bar(b[0], b[1], c[0], c[1], 0.24, 0.24, mat.muted, 0.12));
  }

  // The passage: copper dashes on the diagonal, floating in front of the ring. Like the SVG passage,
  // it makes one linear pass on reveal (brand-token spec: 4800 ms, 57.6 units) and then holds still.
  const LEN = Math.hypot(60, 60), DASH = 7.2, PERIOD = 14.4;
  const dir = new THREE.Vector3(1, 1, 0).normalize();
  const start = new THREE.Vector3(-30, -30, 3.2);
  const dashes = [];
  for (let i = 0; i < Math.ceil(LEN / PERIOD) + 1; i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(1, 2.9, 1.3), mat.copper);
    m.rotation.z = Math.PI / 4;
    root.add(m);
    dashes.push(m);
  }
  const PASS = 57.6, PASS_MS = 4800;
  let revealedAt = null;
  return (t, dt, now) => {
    if (revealedAt === null && (!highway || highway.classList.contains('is-revealed'))) revealedAt = now;
    const offset = reduceMotion || revealedAt === null ? 0 : (clamp01((now - revealedAt) / PASS_MS) * PASS) % PERIOD;
    dashes.forEach((m, i) => {
      const a = i * PERIOD + offset - PERIOD;
      const s0 = Math.max(a, 0), s1 = Math.min(a + DASH, LEN);
      m.visible = s1 - s0 > 0.05;
      if (!m.visible) return;
      m.scale.x = s1 - s0;
      m.position.copy(start).addScaledVector(dir, (s0 + s1) / 2);
    });
  };
}

// Local-intelligence enclosure: viewBox 480 x 320, centred on the graph at (211, 160).
function buildEnclosure(root, mat, figure) {
  const P = (x, y, z = 0) => new THREE.Vector3(x - 211, 160 - y, z);

  // Frame corners, flying in when the section is revealed, like the SVG version.
  const cornerDefs = [
    { pts: [[40, 92], [40, 40], [92, 40]], from: [-34, 34], delay: 0 },
    { pts: [[330, 40], [382, 40], [382, 92]], from: [34, 34], delay: 60 },
    { pts: [[382, 228], [382, 280], [330, 280]], from: [34, -34], delay: 120 },
    { pts: [[92, 280], [40, 280], [40, 228]], from: [-34, -34], delay: 180 },
  ];
  const corners = cornerDefs.map(({ pts, from, delay }) => {
    const g = new THREE.Group();
    const m = mat.bone.clone();
    m.transparent = true;
    for (let i = 0; i < 2; i++) {
      const a = P(...pts[i]), b = P(...pts[i + 1]);
      g.add(bar(a.x, a.y, b.x, b.y, 2.4, 6, m, 1.2));
    }
    root.add(g);
    return { g, m, from, delay };
  });

  // Cloud: two dashed lines cut off by copper crosses, and the label.
  for (const y of [92, 228]) {
    for (let x = 478; x > 392; x -= 10) {
      const a = P(x, y), b = P(Math.max(x - 4, 392), y);
      root.add(bar(a.x, a.y, b.x, b.y, 1.4, 1.4, mat.muted));
    }
    const c = P(392, y);
    root.add(bar(c.x - 6, c.y - 6, c.x + 6, c.y + 6, 1.6, 1.6, mat.copper));
    root.add(bar(c.x - 6, c.y + 6, c.x + 6, c.y - 6, 1.6, 1.6, mat.copper));
  }

  // The graph. The hub sits forward of the triangle, so turning it shows a shallow pyramid.
  const M = P(211, 104), A = P(139, 206), D = P(283, 206), C = P(211, 160, 30);
  for (const [a, b] of [[M, A], [A, D], [D, M], [C, M], [C, A], [C, D]]) root.add(rod(a, b, 0.8, mat.line));
  const hub = new THREE.Mesh(new THREE.SphereGeometry(4, 24, 16), mat.bone);
  hub.position.copy(C);
  root.add(hub);
  for (const p of [M, A, D]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(9, 0.9, 12, 48), mat.bone);
    ring.position.copy(p);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(8.4, 40), mat.paper);
    disc.position.set(p.x, p.y, 1.2);
    root.add(ring, disc);
  }

  // The dotted circle around the hub, turning slowly.
  const dots = new THREE.Group();
  const N = 42;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 1.4), mat.line);
    m.position.set(Math.cos(a) * 54, Math.sin(a) * 54, 0);
    m.rotation.z = a;
    dots.add(m);
  }
  root.add(dots);

  // The orange dot, travelling Models → Agents → Your data and pausing at each.
  const dotMat = new THREE.MeshStandardMaterial({ color: COLOR.accent, emissive: 0xd8672f, emissiveIntensity: 0.55, metalness: 0.4, roughness: 0.35 });
  const dot = new THREE.Mesh(new THREE.SphereGeometry(7.2, 32, 20), dotMat);
  const glow = new THREE.PointLight(0xff9a5c, 2.2, 140, 1.4);
  dot.add(glow);
  dot.position.set(M.x, M.y, 2.5);
  root.add(dot);

  // Labels, at the SVG's text positions (already in centred units).
  const col = '#9a938a';
  root.add(label('MODELS', 0, 80, 'middle', 11, col));
  root.add(label('AGENTS', -72, -76, 'middle', 11, col));
  root.add(label('YOUR DATA', 72, -76, 'middle', 11, col));
  root.add(label('CLOUD', 265, 82, 'end', 11, col));

  const stops = [M, A, D];
  const TRAVEL = 2.8, HOLD = 1.6, LEG = TRAVEL + HOLD;
  let revealedAt = null;
  return (t, dt, now) => {
    if (revealedAt === null && (figure.classList.contains('is-revealed') || !figure.hasAttribute('data-reveal'))) revealedAt = now;
    for (const c of corners) {
      const p = reduceMotion ? 1 : revealedAt === null ? 0 : easeOutCubic(clamp01((now - revealedAt - c.delay) / 900));
      c.g.position.set(c.from[0] * (1 - p), c.from[1] * (1 - p), 0);
      c.m.opacity = p;
    }
    if (reduceMotion) return;
    dots.rotation.z = -t * (Math.PI * 2 / 40);
    const leg = Math.floor(t / LEG) % 3;
    const k = easeInOut(clamp01(((t % LEG) - HOLD) / TRAVEL));
    const a = stops[leg], b = stops[(leg + 1) % 3];
    dot.position.set(a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k, 2.5);
  };
}

const methodSvg = document.querySelector('.method__zero');
if (methodSvg) {
  const highway = methodSvg.querySelector('.mz__highway');
  mountStage({ svg: methodSvg, viewW: 48, pivot: [24, 24], pad: 0.3, depth: 150, build: (root, mat) => buildMethod(root, mat, highway) });
}
const enclosure = document.querySelector('.enclosure');
const encSvg = enclosure && enclosure.querySelector('.enclosure__art');
if (encSvg) {
  document.fonts.load('500 11px "Geist Mono"').catch(() => {}).finally(() => {
    mountStage({ svg: encSvg, viewW: 480, pivot: [211, 160], pad: 0.12, depth: 1250, build: (root, mat) => buildEnclosure(root, mat, enclosure) });
  });
}
