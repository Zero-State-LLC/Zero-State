// 3D hero mark. Draws the aperture mark over the hero PNG box, in the PNG's own coordinates,
// so the wordmark strip of the PNG and the SVG orbits stay exactly where they are.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const stage = document.querySelector('.stage');
const canvas = document.createElement('canvas');
canvas.className = 'aperture-3d';
canvas.tabIndex = 0;
canvas.setAttribute('aria-label', 'Zero State mark in 3D. Drag to turn it; it returns to face front when you let go.');

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch (err) {
  // No WebGL: leave the PNG as it is.
  throw err;
}
stage.append(canvas);
stage.classList.add('stage--3d');

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const deg = THREE.MathUtils.degToRad;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.7;

// Mark units are the PNG's pixels / 100 at 1876 px wide, centred on the zero at (960, 955) of 1876 x 1984.
const PNG = { w: 18.76, ox: 9.60 / 18.76, oy: 9.55 / 19.84 };
const FOV = 26, CAM_D = 40;
const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 300);
camera.position.set(0, 0, CAM_D);
camera.lookAt(0, 0, 0);

const key = new THREE.DirectionalLight(0xfff0dc, 1.6);
key.position.set(-6, 9, 12);
const rim = new THREE.DirectionalLight(0xff9a5c, 3.0);
rim.position.set(9, 3, -7);
scene.add(key, rim);

function boneTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 512;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#efe7d8');
  grad.addColorStop(0.55, '#eadcc4');
  grad.addColorStop(1, '#e2c3a2');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 512);
  for (let i = 0; i < 2600; i++) {
    const a = Math.random() * 0.06;
    g.fillStyle = Math.random() < 0.5 ? `rgba(120,90,60,${a})` : `rgba(255,250,240,${a})`;
    g.fillRect(Math.random() * 256, Math.random() * 512, 1 + Math.random() * 3, 1 + Math.random() * 2);
  }
  for (let y = 0; y < 512; y += 3) {
    g.fillStyle = `rgba(110,80,50,${Math.random() * 0.025})`;
    g.fillRect(0, y, 256, 1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.repeat.set(1 / 5.2, 1 / 12.6);
  tex.offset.set(0.5, 6.2 / 12.6);
  tex.anisotropy = 4;
  return tex;
}

const mat = {
  bone: new THREE.MeshPhysicalMaterial({ color: 0xf2e8d9, map: boneTexture(), roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.45 }),
  copper: new THREE.MeshStandardMaterial({ color: 0xe0915e, metalness: 1, roughness: 0.3 }),
  copperDim: new THREE.MeshStandardMaterial({ color: 0xc27a50, metalness: 0.85, roughness: 0.42 }),
  ash: new THREE.MeshStandardMaterial({ color: 0x5a5047, metalness: 0.2, roughness: 0.65 }),
  glyph: new THREE.MeshStandardMaterial({ color: 0xbfae96, metalness: 0.35, roughness: 0.5 }),
  boneLine: new THREE.MeshStandardMaterial({ color: 0xd9ccb6, metalness: 0.1, roughness: 0.6 }),
};

function extrude(shape, depth, bevel) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth, curveSegments: 72, bevelEnabled: true,
    bevelThickness: bevel, bevelSize: bevel * 0.8, bevelSegments: 4,
  });
  geo.translate(0, 0, -depth / 2);
  return geo;
}

function bar(x1, y1, x2, y2, thick, material) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const m = new THREE.Mesh(new THREE.BoxGeometry(len, thick, thick), material);
  m.position.set((x1 + x2) / 2, (y1 + y2) / 2, 0);
  m.rotation.z = Math.atan2(y2 - y1, x2 - x1);
  return m;
}

function arc(r, tube, fromDeg, toDeg, material) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 10, 160, deg(toDeg - fromDeg)), material);
  m.rotation.z = deg(fromDeg);
  return m;
}

// Bone: the blade and the left half of the zero, cut by the hole.
function makeBone() {
  const s = new THREE.Shape();
  const xR = -0.08, xL = -1.48, rIn = 1.70, rOut = 2.48;
  const yIn = Math.sqrt(rIn * rIn - xR * xR);
  const yOut = Math.sqrt(rOut * rOut - xL * xL);
  const aIn = Math.atan2(yIn, xR);
  s.moveTo(xL, 5.20);
  s.lineTo(xR, 6.37);
  s.lineTo(xR, yIn);
  s.absarc(0, 0, rIn, aIn, Math.PI * 2 - aIn, false);
  s.lineTo(xR, -6.10);
  s.lineTo(xL, -4.80);
  s.lineTo(xL, -yOut);
  s.absarc(0, 0, rOut, Math.PI * 2 + Math.atan2(-yOut, xL), Math.atan2(yOut, xL), true);
  s.lineTo(xL, 5.20);
  return new THREE.Mesh(extrude(s, 0.55, 0.05), mat.bone);
}

// Copper bar, broken where the PNG has its dark cuts.
function makeCopperBar() {
  const g = new THREE.Group();
  const x0 = 0.60, x1 = 0.90;
  const segs = [[5.60, 4.62, 0.15, 0.08], [4.40, -4.00, 0.08, 0.08], [-4.15, -4.30, 0, 0], [-4.45, -5.60, 0.08, -0.15]];
  for (const [top, bot, slantTop, slantBot] of segs) {
    const s = new THREE.Shape();
    s.moveTo(x0, top);
    s.lineTo(x1, top - slantTop);
    s.lineTo(x1, bot + Math.min(slantBot, 0));
    s.lineTo(x0, bot + Math.max(slantBot, 0));
    s.lineTo(x0, top);
    g.add(new THREE.Mesh(extrude(s, 0.34, 0.02), mat.copper));
  }
  return g;
}

function makeRightArcs() {
  const g = new THREE.Group();
  g.add(arc(2.75, 0.042, -64, 64, mat.copper));
  g.add(arc(1.80, 0.032, -70, 70, mat.copper));
  [[2.02, 54], [2.17, 49], [2.32, 43], [2.47, 36]].forEach(([r, span]) => g.add(arc(r, 0.014, -span, span, mat.copperDim)));
  return g;
}

function makeLeftArcs() {
  const g = new THREE.Group();
  g.add(arc(2.62, 0.016, 118, 242, mat.ash));
  g.add(arc(2.80, 0.012, 132, 228, mat.ash));
  return g;
}

function makeTicks() {
  const g = new THREE.Group();
  g.add(bar(-3.10, 0, -1.85, 0, 0.026, mat.copperDim));
  g.add(bar(1.85, 0, 3.15, 0, 0.026, mat.copperDim));
  return g;
}

function makeBinary(x, digits) {
  const g = new THREE.Group();
  const ys = [2.55, 1.70, 0.85, 0, -0.85, -1.62, -2.30];
  digits.forEach((d, i) => {
    let m;
    if (d === 0) {
      m = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.016, 8, 32), mat.glyph);
      m.scale.set(1.35, 1, 1);
    } else {
      m = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.034, 0.034), mat.glyph);
    }
    m.position.set(x, ys[i], 0);
    g.add(m);
  });
  return g;
}

function makeAntenna() {
  const g = new THREE.Group();
  g.add(bar(0, 6.65, 0, 9.55, 0.03, mat.copper));
  for (const y of [8.70, 7.70]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.022, 10, 40), mat.copper);
    ring.position.set(0, y, 0);
    g.add(ring);
  }
  for (let y = 9.55; y > 7.0; y -= 0.26) g.add(bar(-0.70, y, -0.70, y - 0.14, 0.034, mat.boneLine));
  for (let y = 9.30; y > 8.2; y -= 0.34) g.add(bar(-0.82, y, -0.82, y - 0.08, 0.024, mat.boneLine));
  g.add(bar(0.66, 8.05, 0.86, 8.05, 0.03, mat.boneLine));
  return g;
}

const root = new THREE.Group();
scene.add(root);
const parts = [];
function addPart(obj, explode, spin) {
  obj.userData.explode = new THREE.Vector3(...explode);
  obj.userData.spin = spin;
  obj.userData.base = obj.position.clone();
  root.add(obj);
  parts.push(obj);
}
addPart(makeLeftArcs(), [-0.3, 0, -2.0], -0.6);
addPart(makeAntenna(), [0, 0.5, -1.4], 0.4);
addPart(makeBone(), [0, 0, 0], 0.5);
addPart(makeCopperBar(), [0.25, 0, 1.5], -0.5);
addPart(makeRightArcs(), [0.5, 0, 2.7], 0.7);
addPart(makeTicks(), [0, 0, 3.7], -0.4);
addPart(makeBinary(-3.90, [1, 0, 0, 0, 0, 1, 1]), [-0.4, 0, -3.1], 0.8);
addPart(makeBinary(3.70, [0, 0, 0, 0, 0, 0, 1]), [0.4, 0, 4.4], -0.8);

// The camera stays put; setViewOffset puts its axis on the zero's spot in the PNG box,
// and root.scale makes one mark unit match the PNG at whatever size the box is drawn.
function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h) return;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.setViewOffset(w, h, w / 2 - PNG.ox * w, h / 2 - PNG.oy * h, w, h);
  const unitsPerPx = (2 * CAM_D * Math.tan(deg(FOV / 2))) / h;
  root.scale.setScalar((w / PNG.w) * unitsPerPx);
}
// Draw on demand: only while something moves (the load assembly, hover tilt, a drag and its ease
// back) and only while the hero is on screen. At rest the mark faces front and nothing redraws.
let visible = false;
let raf = 0;
function wake() {
  if (!raf && visible) raf = requestAnimationFrame(frame);
}
new ResizeObserver(() => { resize(); wake(); }).observe(canvas);
resize();
new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake(); }).observe(canvas);

const ASSEMBLE_FROM = 2.6;
const assembleStart = performance.now();
let assembling = !reduceMotion;
const hover = { yaw: 0, pitch: 0, tYaw: 0, tPitch: 0 };
const drag = { on: false, x: 0, y: 0, yaw: 0, pitch: 0 };

canvas.addEventListener('pointermove', (e) => {
  if (e.pointerType === 'mouse' && !drag.on) {
    const r = canvas.getBoundingClientRect();
    hover.tYaw = ((e.clientX - r.left) / r.width - 0.5) * 0.36;
    hover.tPitch = ((e.clientY - r.top) / r.height - 0.5) * 0.2;
  }
  if (drag.on) {
    drag.yaw += (e.clientX - drag.x) * 0.012;
    drag.pitch = THREE.MathUtils.clamp(drag.pitch + (e.clientY - drag.y) * 0.006, -0.6, 0.6);
    drag.x = e.clientX; drag.y = e.clientY;
  }
  wake();
});
canvas.addEventListener('pointerleave', () => { hover.tYaw = 0; hover.tPitch = 0; wake(); });
canvas.addEventListener('pointerdown', (e) => {
  drag.on = true; drag.x = e.clientX; drag.y = e.clientY;
  canvas.setPointerCapture(e.pointerId);
  wake();
});
const endDrag = () => { drag.on = false; wake(); };
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
canvas.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') drag.yaw -= 0.3;
  if (e.key === 'ArrowRight') drag.yaw += 0.3;
  wake();
});

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const SETTLED = 1e-4;
let last = performance.now();

function frame(now) {
  raf = 0;
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;

  let explode = 0;
  if (assembling) {
    const k = Math.min((now - assembleStart) / 2400, 1);
    explode = ASSEMBLE_FROM * (1 - easeOutCubic(k));
    if (k >= 1) assembling = false;
  }
  for (const p of parts) {
    const { base, explode: off, spin } = p.userData;
    p.position.copy(base).addScaledVector(off, explode);
    p.rotation.y = spin * Math.max(explode - 1, 0);
  }

  // The mark always settles back to face front: the reference remains.
  if (!drag.on) {
    const k = 1 - Math.exp(-dt * 1.6);
    drag.yaw += (0 - drag.yaw) * k;
    drag.pitch += (0 - drag.pitch) * k;
  }
  const s = 1 - Math.exp(-dt * 3);
  hover.yaw += (hover.tYaw - hover.yaw) * s;
  hover.pitch += (hover.tPitch - hover.pitch) * s;

  const moving = assembling || drag.on
    || Math.abs(drag.yaw) > SETTLED || Math.abs(drag.pitch) > SETTLED
    || Math.abs(hover.tYaw - hover.yaw) > SETTLED || Math.abs(hover.tPitch - hover.pitch) > SETTLED;
  if (!moving) {
    drag.yaw = drag.pitch = 0;
    hover.yaw = hover.tYaw;
    hover.pitch = hover.tPitch;
  }
  root.rotation.y = drag.yaw + hover.yaw;
  root.rotation.x = drag.pitch + hover.pitch;

  renderer.render(scene, camera);
  if (moving) wake();
}
