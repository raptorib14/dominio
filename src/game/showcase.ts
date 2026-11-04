// Vitrina 3D para el pase POLAR: skin POLAR y GL-0 GLACIAR girando con escarcha.
import * as THREE from "three";

export type ShowKind = "polar" | "glaciar" | "both";

function ice() {
  return {
    ice: new THREE.MeshStandardMaterial({ color: 0xbfe6ff, emissive: 0x2a8cff, emissiveIntensity: 0.35, roughness: 0.15, metalness: 0.35 }),
    snow: new THREE.MeshStandardMaterial({ color: 0xf4f8ff, roughness: 0.8 }),
    crystal: new THREE.MeshStandardMaterial({ color: 0x9fe9ff, emissive: 0x47d4ff, emissiveIntensity: 1.2, roughness: 0.05, transparent: true, opacity: 0.88 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x1d3550, roughness: 0.5, metalness: 0.5 }),
    visor: new THREE.MeshStandardMaterial({ color: 0x0b1c2c, emissive: 0x47d4ff, emissiveIntensity: 1.6, roughness: 0.1 }),
  };
}

function box(g: THREE.Group, m: THREE.Material, w: number, h: number, d: number, x: number, y: number, z: number, rx = 0, rz = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, 0, rz);
  g.add(mesh);
  return mesh;
}

export function buildGlaciar() {
  const M = ice();
  const g = new THREE.Group();
  box(g, M.snow, 0.12, 0.2, 0.6, 0, 0, 0.55);
  box(g, M.ice, 0.16, 0.24, 0.8, 0, 0.03, -0.1);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.0, 12), M.ice);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.07, -0.95);
  g.add(barrel);
  for (let i = 0; i < 5; i++) {
    const c = new THREE.Mesh(new THREE.OctahedronGeometry(0.06 - i * 0.007), M.crystal);
    c.position.set(0, 0.07, -0.6 - i * 0.2);
    c.rotation.set(0, i, 0.6);
    g.add(c);
  }
  for (const [x, y, z, r] of [[0.07, 0.24, -0.2, -0.5], [-0.07, 0.22, 0.05, 0.5], [0, 0.26, -0.45, 0]]) {
    const s = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.2, 6), M.crystal);
    s.position.set(x, y, z);
    s.rotation.z = r;
    g.add(s);
  }
  box(g, M.crystal, 0.09, 0.36, 0.13, 0, -0.26, -0.1, 0.15);
  box(g, M.snow, 0.09, 0.26, 0.1, 0, -0.2, 0.2, 0.25);
  box(g, M.snow, 0.05, 0.07, 0.5, 0, 0.2, -0.1);
  g.rotation.y = Math.PI / 2;
  return g;
}

export function buildPolar() {
  const M = ice();
  const g = new THREE.Group();
  box(g, M.snow, 0.5, 0.62, 0.3, 0, 1.1, 0);
  box(g, M.ice, 0.52, 0.16, 0.32, 0, 0.86, 0);
  box(g, M.crystal, 0.12, 0.12, 0.05, 0, 1.2, 0.17);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 14), M.snow);
  head.position.set(0, 1.62, 0);
  g.add(head);
  box(g, M.visor, 0.3, 0.09, 0.06, 0, 1.64, 0.17);
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), M.snow);
    ear.position.set(0.15 * s, 1.8, 0);
    g.add(ear);
    box(g, M.snow, 0.15, 0.56, 0.17, 0.34 * s, 1.08, 0, 0, 0.12 * s);
    box(g, M.ice, 0.16, 0.1, 0.18, 0.37 * s, 0.82, 0);
    box(g, M.dark, 0.19, 0.6, 0.22, 0.13 * s, 0.48, 0);
    box(g, M.ice, 0.21, 0.12, 0.3, 0.13 * s, 0.12, 0.04);
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 6), M.crystal);
    spike.position.set(0.27 * s, 1.47, -0.02);
    spike.rotation.z = -0.5 * s;
    g.add(spike);
  }
  const cape = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.8), new THREE.MeshStandardMaterial({ color: 0x8fd3ff, emissive: 0x1a6cff, emissiveIntensity: 0.3, side: THREE.DoubleSide, transparent: true, opacity: 0.8 }));
  cape.position.set(0, 1.0, -0.2);
  cape.rotation.x = 0.12;
  g.add(cape);
  g.position.y = -0.95;
  return g;
}

/** Monta una escena giratoria en el canvas. burst=true hace el destello de desbloqueo. */
export function mountShowcase(canvas: HTMLCanvasElement, kind: ShowKind, burst: boolean) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  cam.position.set(0, 0.35, 4.2);
  scene.add(new THREE.HemisphereLight(0xdff4ff, 0x10243a, 1.4));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(2, 3, 3);
  scene.add(key);
  const rim = new THREE.PointLight(0x47d4ff, 6, 8);
  rim.position.set(-1.5, 1, -1.5);
  scene.add(rim);
  const flash = new THREE.PointLight(0xffffff, 0, 10);
  flash.position.set(0, 0.5, 1.5);
  scene.add(flash);

  const items: THREE.Group[] = [];
  if (kind !== "glaciar") items.push(buildPolar());
  if (kind !== "polar") items.push(buildGlaciar());
  items.forEach((it, i) => {
    if (items.length === 2) it.position.x = i === 0 ? -0.75 : 0.75;
    it.userData.s = kind === "both" && i === 1 ? 0.75 : kind === "glaciar" ? 1.15 : 1;
    scene.add(it);
  });

  // Escarcha
  const N = 260;
  const pos = new Float32Array(N * 3);
  const vel = new Float32Array(N * 3);
  const reset = (i: number, out: boolean) => {
    if (out) {
      const a = Math.random() * Math.PI * 2;
      const e = Math.random() * 2 - 1;
      pos.set([0, 0.3, 0], i * 3);
      const sp = 1.2 + Math.random() * 2.6;
      vel.set([Math.cos(a) * sp * Math.sqrt(1 - e * e), e * sp, Math.sin(a) * sp * Math.sqrt(1 - e * e)], i * 3);
    } else {
      pos.set([(Math.random() - 0.5) * 4, Math.random() * 3 - 1.2, (Math.random() - 0.5) * 2], i * 3);
      vel.set([(Math.random() - 0.5) * 0.1, -0.15 - Math.random() * 0.25, 0], i * 3);
    }
  };
  for (let i = 0; i < N; i++) reset(i, burst && i < N * 0.7);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xe6f8ff, size: 0.05, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(pts);

  const ring = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.28, 48), new THREE.MeshBasicMaterial({ color: 0x9fe9ff, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
  ring.position.set(0, 0.3, -0.6);
  scene.add(ring);

  const resize = () => {
    const w = canvas.clientWidth || 300;
    const h = canvas.clientHeight || 300;
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
  };
  resize();
  const t0 = performance.now();
  let last = t0;
  let raf = 0;
  const loop = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = (now - t0) / 1000;
    const intro = burst ? Math.min(1, t / 1.1) : 1;
    const ease = 1 - Math.pow(1 - intro, 3);
    items.forEach((it, i) => {
      it.rotation.y = (burst ? (1 - ease) * 6 : 0) + t * 0.8 + i * 0.6;
      it.scale.setScalar((it.userData.s as number) * (0.2 + 0.8 * ease));
    });
    flash.intensity = burst ? Math.max(0, 40 * (1 - t / 0.8)) : 0;
    ring.scale.setScalar(1 + t * 9);
    (ring.material as THREE.MeshBasicMaterial).opacity = burst ? Math.max(0, 0.9 - t * 0.9) : 0;
    for (let i = 0; i < N; i++) {
      pos[i * 3] += vel[i * 3] * dt;
      pos[i * 3 + 1] += vel[i * 3 + 1] * dt;
      pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
      vel[i * 3] *= 0.985;
      vel[i * 3 + 1] = vel[i * 3 + 1] * 0.985 - 0.2 * dt;
      if (pos[i * 3 + 1] < -1.6 || Math.abs(pos[i * 3]) > 4) reset(i, false);
    }
    geo.attributes.position.needsUpdate = true;
    renderer.render(scene, cam);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  window.addEventListener("resize", resize);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    renderer.dispose();
  };
}

/** Sonido de desbloqueo (WebAudio, sin archivos). */
export function unlockSound(big: boolean) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const notes = big ? [523, 659, 784, 1047, 1319, 1568] : [784, 1175];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = i % 2 ? "triangle" : "sine";
      o.frequency.value = f;
      const s = now + i * (big ? 0.09 : 0.07);
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(big ? 0.18 : 0.12, s + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, s + (big ? 1.4 : 0.5));
      o.connect(g).connect(ctx.destination);
      o.start(s);
      o.stop(s + 1.5);
    });
    if (big) {
      const n = ctx.createBufferSource();
      const b = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
      n.buffer = b;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 3000;
      const g = ctx.createGain();
      g.gain.value = 0.12;
      n.connect(hp).connect(g).connect(ctx.destination);
      n.start(now);
    }
    setTimeout(() => void ctx.close(), 2500);
  } catch {
    /* sin audio */
  }
}
