import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createAudio } from "@/game/audio";
import { createFx, flashTexture } from "@/game/fx";
import { MAPS, type GameMap, type MapId } from "@/game/maps";
import { loadSave, writeSave, type Diff, type QualityPref, type SaveData } from "@/game/save";

export type Phase = "menu" | "play" | "pause" | "win" | "lose";

export type PhaseInfo = {
  phase: Phase;
  kills: number;
  deaths: number;
  elapsed: number;
  best: number | null;
  wins: number;
  reason: string;
  map: MapId;
  basesTaken: number;
};

export type HudNodes = {
  hp: HTMLElement;
  armor: HTMLElement;
  mag: HTMLElement;
  reserve: HTMLElement;
  timer: HTMLElement;
  kills: HTMLElement;
  alfaFill: HTMLElement;
  bravoFill: HTMLElement;
  alfaState: HTMLElement;
  bravoState: HTMLElement;
  banner: HTMLElement;
  fps: HTMLElement;
  feed: HTMLElement;
  cross: HTMLElement;
  hurt: HTMLElement;
  hit: HTMLElement;
  dmgN: HTMLElement;
  dmgE: HTMLElement;
  dmgS: HTMLElement;
  dmgW: HTMLElement;
  reloadBar: HTMLElement;
  minimap: HTMLCanvasElement;
  quality: HTMLElement;
  weaponName: HTMLElement;
  slots: HTMLElement;
  scope: HTMLElement;
  root: HTMLElement;
};

export type GameApi = {
  dispose: () => void;
  start: () => void;
  resume: () => void;
  pause: () => void;
  toMenu: () => void;
  setTouchMove: (x: number, y: number) => void;
  addLook: (dx: number, dy: number) => void;
  setFireHeld: (v: boolean) => void;
  setAdsHeld: (v: boolean) => void;
  setSprintHeld: (v: boolean) => void;
  toggleCrouch: () => void;
  reload: () => void;
  jump: () => void;
  setMuted: (v: boolean) => void;
  setSens: (v: number) => void;
  setMap: (id: MapId) => void;
  setQualityPref: (q: QualityPref) => void;
  setFov: (fov: number) => void;
  setBotCount: (n: number) => void;
  setDiff: (d: Diff) => void;
  setVolume: (v: number) => void;
  setAllyName: (name: string) => void;
  attachNet: (io: NetIO | null) => void;
  ingest: (msg: unknown, from?: string) => void;
  announce: () => void;
  isMuted: () => boolean;
  getSens: () => number;
  selectWeapon: (index: number) => void;
  setLoadout: (ids: string[]) => void;
  setAbilities: (ids: string[]) => void;
  useAbility: (i: number) => boolean;
  getAbilities: () => { id: string; cd: number; max: number }[];
  getLoadoutNames: () => string[];
  setSkin: (hex: number | null) => void;
  cycleWeapon: () => void;
};

type NetRole = "solo" | "host" | "guest";

type NetIO = {
  role: NetRole;
  name: string;
  broadcast: (data: unknown) => void;
  send: (data: unknown) => void;
};

type Aabb = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
};

type Kind = "concrete" | "wood" | "metal" | "sand" | "hazard";

type Bot = {
  id: number;
  name: string;
  home: 0 | 1;
  x: number;
  y: number;
  z: number;
  vx: number;
  vz: number;
  yaw: number;
  hp: number;
  alive: boolean;
  respawn: number;
  cooldown: number;
  alert: number;
  react: number;
  lx: number;
  lz: number;
  wp: number;
  stuck: number;
  nudge: number;
  side: number;
  walk: number;
  flash: number;
  spawnX: number;
  spawnZ: number;
  enabled: boolean;
  group: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  bodyMats: THREE.MeshStandardMaterial[];
};

type PoolMesh = {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  life: number;
};

const ROUND = 210;
const STEP = 1 / 60;
const PITCH_LIMIT = Math.PI / 2 - 0.04;

type WeaponId = "rifle" | "smg" | "shot" | "pistol" | "dmr" | "lmg" | "revolver" | "carbine" | "glaciar";
type BaseSound = "rifle" | "smg" | "shot" | "pistol" | "dmr";

type WeaponDef = {
  id: WeaponId;
  name: string;
  blurb: string;
  magSize: number;
  reserve: number;
  interval: number;
  reloadTime: number;
  damage: number;
  head: number;
  pellets: number;
  spread: number;
  sprayGrow: number;
  sprayAdd: number;
  moveSpread: number;
  air: number;
  adsTight: number;
  recoil: number;
  yawKick: number;
  auto: boolean;
  kick: number;
  fallStart: number;
  fallDist: number;
  fallMin: number;
  adsFov: number;
  draw: number;
  model?: number;
  snd?: BaseSound;
};

const WEAPONS: WeaponDef[] = [
  {
    id: "rifle",
    name: "R-47",
    blurb: "FUSIL",
    magSize: 30,
    reserve: 120,
    interval: 0.098,
    reloadTime: 1.85,
    damage: 26,
    head: 100,
    pellets: 1,
    spread: 0.0045,
    sprayGrow: 0.042,
    sprayAdd: 0.14,
    moveSpread: 0.0032,
    air: 0.026,
    adsTight: 0.62,
    recoil: 0.015,
    yawKick: 0.008,
    auto: true,
    kick: 1,
    fallStart: 28,
    fallDist: 40,
    fallMin: 0.72,
    adsFov: 50,
    draw: 0.28,
  },
  {
    id: "smg",
    name: "VX-9",
    blurb: "SUBFUSIL",
    magSize: 36,
    reserve: 144,
    interval: 0.058,
    reloadTime: 1.55,
    damage: 15,
    head: 36,
    pellets: 1,
    spread: 0.014,
    sprayGrow: 0.055,
    sprayAdd: 0.1,
    moveSpread: 0.0045,
    air: 0.034,
    adsTight: 0.4,
    recoil: 0.008,
    yawKick: 0.012,
    auto: true,
    kick: 0.62,
    fallStart: 14,
    fallDist: 22,
    fallMin: 0.45,
    adsFov: 58,
    draw: 0.22,
  },
  {
    id: "shot",
    name: "SC-12",
    blurb: "ESCOPETA",
    magSize: 6,
    reserve: 30,
    interval: 0.72,
    reloadTime: 2.35,
    damage: 13,
    head: 18,
    pellets: 8,
    spread: 0.082,
    sprayGrow: 0.01,
    sprayAdd: 0.22,
    moveSpread: 0.004,
    air: 0.04,
    adsTight: 0.35,
    recoil: 0.042,
    yawKick: 0.02,
    auto: false,
    kick: 1.35,
    fallStart: 7,
    fallDist: 14,
    fallMin: 0.22,
    adsFov: 64,
    draw: 0.34,
  },
  {
    id: "pistol",
    name: "P-19",
    blurb: "PISTOLA",
    magSize: 15,
    reserve: 60,
    interval: 0.18,
    reloadTime: 1.2,
    damage: 32,
    head: 78,
    pellets: 1,
    spread: 0.0028,
    sprayGrow: 0.018,
    sprayAdd: 0.16,
    moveSpread: 0.0022,
    air: 0.018,
    adsTight: 0.55,
    recoil: 0.017,
    yawKick: 0.006,
    auto: false,
    kick: 0.78,
    fallStart: 20,
    fallDist: 34,
    fallMin: 0.58,
    adsFov: 54,
    draw: 0.18,
  },
  {
    id: "dmr",
    name: "M-90",
    blurb: "TIRADOR",
    magSize: 10,
    reserve: 40,
    interval: 0.46,
    reloadTime: 2.05,
    damage: 70,
    head: 140,
    pellets: 1,
    spread: 0.0014,
    sprayGrow: 0.01,
    sprayAdd: 0.32,
    moveSpread: 0.0055,
    air: 0.048,
    adsTight: 0.88,
    recoil: 0.03,
    yawKick: 0.004,
    auto: false,
    kick: 1.12,
    fallStart: 42,
    fallDist: 55,
    fallMin: 0.86,
    adsFov: 26,
    draw: 0.36,
  },
  {
    id: "lmg", name: "AM-60", blurb: "AMETRALLADORA", magSize: 60, reserve: 180, interval: 0.085, reloadTime: 3.1,
    damage: 23, head: 70, pellets: 1, spread: 0.007, sprayGrow: 0.05, sprayAdd: 0.09, moveSpread: 0.006, air: 0.04,
    adsTight: 0.55, recoil: 0.013, yawKick: 0.011, auto: true, kick: 1.05, fallStart: 24, fallDist: 36, fallMin: 0.66,
    adsFov: 52, draw: 0.5, model: 0, snd: "rifle",
  },
  {
    id: "revolver", name: "RV-44", blurb: "REVÓLVER", magSize: 6, reserve: 36, interval: 0.42, reloadTime: 1.9,
    damage: 55, head: 120, pellets: 1, spread: 0.0022, sprayGrow: 0.02, sprayAdd: 0.3, moveSpread: 0.0026, air: 0.02,
    adsTight: 0.6, recoil: 0.034, yawKick: 0.01, auto: false, kick: 1.2, fallStart: 22, fallDist: 30, fallMin: 0.6,
    adsFov: 52, draw: 0.24, model: 3, snd: "dmr",
  },
  {
    id: "carbine", name: "K-4", blurb: "CARABINA", magSize: 25, reserve: 100, interval: 0.075, reloadTime: 1.6,
    damage: 21, head: 64, pellets: 1, spread: 0.006, sprayGrow: 0.045, sprayAdd: 0.12, moveSpread: 0.0035, air: 0.03,
    adsTight: 0.58, recoil: 0.011, yawKick: 0.009, auto: true, kick: 0.8, fallStart: 22, fallDist: 30, fallMin: 0.6,
    adsFov: 54, draw: 0.25, model: 1, snd: "smg",
  },
  {
    // Exclusiva del pase POLAR: congela (ralentiza) a los bots que impacta.
    id: "glaciar", name: "GL-0 GLACIAR", blurb: "CRIOFUSIL", magSize: 24, reserve: 96, interval: 0.11, reloadTime: 1.9,
    damage: 27, head: 78, pellets: 1, spread: 0.0045, sprayGrow: 0.04, sprayAdd: 0.1, moveSpread: 0.0032, air: 0.03,
    adsTight: 0.55, recoil: 0.012, yawKick: 0.008, auto: true, kick: 0.9, fallStart: 26, fallDist: 34, fallMin: 0.62,
    adsFov: 50, draw: 0.34, model: 5, snd: "rifle",
  },
];
const KEYS = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowLeft",
  "ArrowDown",
  "ArrowRight",
  "Space",
  "ShiftLeft",
  "ShiftRight",
  "ControlLeft",
  "ControlRight",
  "KeyC",
  "KeyR",
]);

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function dampAngle(current: number, target: number, dt: number, speed: number) {
  let d = target - current;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return current + d * Math.min(1, speed * dt);
}

function setText(el: HTMLElement, text: string) {
  if (el.textContent !== text) el.textContent = text;
}

function fmtTime(total: number) {
  const s = Math.max(0, Math.ceil(total));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function makeMaps(
  size: number,
  paint: (ctx: CanvasRenderingContext2D, n: number) => void,
  roughBase: number,
  roughSpread: number,
) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("canvas");
  paint(ctx, size);
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 8;
  const normal = heightToNormal(c);
  const rough = roughnessFrom(c, roughBase, roughSpread);
  return { map, normal, rough };
}

function roughnessFrom(src: HTMLCanvasElement, base: number, spread: number) {
  const srcN = src.width;
  const n = 128;
  const ctx = src.getContext("2d");
  if (!ctx) throw new Error("canvas");
  const img = ctx.getImageData(0, 0, srcN, srcN);
  const data = img.data;
  const out = document.createElement("canvas");
  out.width = out.height = n;
  const octx = out.getContext("2d");
  if (!octx) throw new Error("canvas");
  const oimg = octx.createImageData(n, n);
  const od = oimg.data;
  const step = srcN / n;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const sx = Math.min(srcN - 1, Math.floor(x * step));
      const sy = Math.min(srcN - 1, Math.floor(y * step));
      const i = (sy * srcN + sx) * 4;
      const lum = (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11) / 255;
      const r = clamp(Math.round((base + (0.5 - lum) * spread) * 255), 12, 250);
      const o = (y * n + x) * 4;
      od[o] = r;
      od[o + 1] = r;
      od[o + 2] = r;
      od[o + 3] = 255;
    }
  }
  octx.putImageData(oimg, 0, 0);
  const tex = new THREE.CanvasTexture(out);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function heightToNormal(src: HTMLCanvasElement) {
  const srcN = src.width;
  const n = Math.min(128, srcN);
  const ctx = src.getContext("2d");
  if (!ctx) throw new Error("canvas");
  const img = ctx.getImageData(0, 0, srcN, srcN);
  const data = img.data;
  const lumAt = (x: number, y: number) => {
    const xx = ((x % srcN) + srcN) % srcN;
    const yy = ((y % srcN) + srcN) % srcN;
    const i = (yy * srcN + xx) * 4;
    return data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
  };
  const out = document.createElement("canvas");
  out.width = out.height = n;
  const octx = out.getContext("2d");
  if (!octx) throw new Error("canvas");
  const oimg = octx.createImageData(n, n);
  const od = oimg.data;
  const step = srcN / n;
  const strength = 2.2;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const sx = Math.floor(x * step);
      const sy = Math.floor(y * step);
      const dx = (lumAt(sx - 2, sy) - lumAt(sx + 2, sy)) / 255;
      const dy = (lumAt(sx, sy - 2) - lumAt(sx, sy + 2)) / 255;
      const dz = 1 / strength;
      const len = Math.hypot(dx, dy, dz) || 1;
      const i = (y * n + x) * 4;
      od[i] = (dx / len) * 127 + 128;
      od[i + 1] = (dy / len) * 127 + 128;
      od[i + 2] = (dz / len) * 127 + 128;
      od[i + 3] = 255;
    }
  }
  octx.putImageData(oimg, 0, 0);
  const tex = new THREE.CanvasTexture(out);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

function paintConcrete(ctx: CanvasRenderingContext2D, n: number) {
  ctx.fillStyle = "#a89b88";
  ctx.fillRect(0, 0, n, n);
  const img = ctx.getImageData(0, 0, n, n);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const j = (Math.random() - 0.5) * 34;
    d[i] = clamp(d[i] + j, 0, 255);
    d[i + 1] = clamp(d[i + 1] + j * 0.92, 0, 255);
    d[i + 2] = clamp(d[i + 2] + j * 0.7, 0, 255);
  }
  ctx.putImageData(img, 0, 0);
  ctx.fillStyle = "rgba(70,62,52,0.55)";
  const cell = 64;
  for (let y = 0; y < n; y += cell) {
    ctx.fillRect(0, y, n, 2);
  }
  for (let x = 0; x < n; x += cell) {
    ctx.fillRect(x, 0, 2, n);
  }
  for (let k = 0; k < 50; k++) {
    ctx.fillStyle = `rgba(${40 + Math.random() * 40},${32 + Math.random() * 24},${22 + Math.random() * 16},${0.08 + Math.random() * 0.16})`;
    ctx.beginPath();
    ctx.ellipse(Math.random() * n, Math.random() * n, 6 + Math.random() * 40, 4 + Math.random() * 18, Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(48,40,32,0.45)";
  ctx.lineWidth = 1;
  for (let k = 0; k < 18; k++) {
    ctx.beginPath();
    let x = Math.random() * n;
    let y = Math.random() * n;
    ctx.moveTo(x, y);
    for (let s = 0; s < 6; s++) {
      x += (Math.random() - 0.5) * 36;
      y += (Math.random() - 0.5) * 36;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(28,24,20,0.22)";
  ctx.fillRect(0, n - 28, n, 28);
}

function paintWood(ctx: CanvasRenderingContext2D, n: number) {
  ctx.fillStyle = "#6a4630";
  ctx.fillRect(0, 0, n, n);
  const plank = 36;
  for (let y = 0; y < n; y += plank) {
    const shade = 92 + Math.random() * 48;
    ctx.fillStyle = `rgb(${shade + 40},${shade * 0.62},${shade * 0.32})`;
    ctx.fillRect(0, y + 1, n, plank - 3);
    for (let x = 0; x < n; x += 2) {
      const g = shade + Math.sin(x * 0.08 + y) * 10;
      ctx.fillStyle = `rgba(${g + 30},${g * 0.5},${g * 0.25},0.35)`;
      ctx.fillRect(x, y + 2, 1, plank - 6);
    }
    ctx.fillStyle = "rgba(28,16,8,0.8)";
    ctx.fillRect(0, y, n, 2);
    ctx.fillStyle = "rgba(90,50,28,0.9)";
    ctx.beginPath();
    ctx.ellipse(40 + Math.random() * (n - 80), y + plank * 0.5, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintMetal(ctx: CanvasRenderingContext2D, n: number) {
  ctx.fillStyle = "#6d767c";
  ctx.fillRect(0, 0, n, n);
  const rib = 10;
  for (let x = 0; x < n; x++) {
    const wave = Math.sin((x / rib) * Math.PI) * 22;
    const g = 78 + wave + Math.random() * 5;
    ctx.fillStyle = `rgb(${g - 4},${g},${g + 6})`;
    ctx.fillRect(x, 0, 1, n);
  }
  ctx.fillStyle = "rgba(120,48,28,0.55)";
  for (let k = 0; k < 7; k++) {
    ctx.beginPath();
    ctx.ellipse(Math.random() * n, Math.random() * n, 10 + Math.random() * 28, 6 + Math.random() * 14, Math.random(), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(210,214,216,0.35)";
  ctx.lineWidth = 1;
  for (let k = 0; k < 12; k++) {
    ctx.beginPath();
    const y = Math.random() * n;
    ctx.moveTo(0, y);
    ctx.lineTo(n, y + (Math.random() - 0.5) * 8);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(16,18,20,0.7)";
  for (let y = 22; y < n; y += 48) {
    for (let x = 18; x < n; x += 48) {
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(180,186,190,0.45)";
      ctx.stroke();
    }
  }
}

function paintSand(ctx: CanvasRenderingContext2D, n: number) {
  ctx.fillStyle = "#c2ae86";
  ctx.fillRect(0, 0, n, n);
  const img = ctx.getImageData(0, 0, n, n);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const j = (Math.random() - 0.5) * 28;
    d[i] = clamp(d[i] + j, 0, 255);
    d[i + 1] = clamp(d[i + 1] + j * 0.85, 0, 255);
    d[i + 2] = clamp(d[i + 2] + j * 0.55, 0, 255);
  }
  ctx.putImageData(img, 0, 0);
  for (let k = 0; k < 80; k++) {
    ctx.fillStyle = `rgba(70,58,40,${0.15 + Math.random() * 0.35})`;
    ctx.fillRect(Math.random() * n, Math.random() * n, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
}

function paintHazard(ctx: CanvasRenderingContext2D, n: number) {
  ctx.fillStyle = "#e0a41c";
  ctx.fillRect(0, 0, n, n);
  ctx.fillStyle = "#16180f";
  const stripe = n / 7;
  for (let i = -8; i < 14; i++) {
    ctx.beginPath();
    ctx.moveTo(i * stripe, 0);
    ctx.lineTo(i * stripe + stripe * 0.48, 0);
    ctx.lineTo(i * stripe + stripe * 0.48 - n, n);
    ctx.lineTo(i * stripe - n, n);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  for (let k = 0; k < 20; k++) ctx.fillRect(Math.random() * n, Math.random() * n, 8, 2);
}

function paintYard(ctx: CanvasRenderingContext2D, n: number) {
  ctx.fillStyle = "#8d7b5e";
  ctx.fillRect(0, 0, n, n);
  const img = ctx.getImageData(0, 0, n, n);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const j = (Math.random() - 0.5) * 30;
    d[i] = clamp(d[i] + j, 0, 255);
    d[i + 1] = clamp(d[i + 1] + j * 0.9, 0, 255);
    d[i + 2] = clamp(d[i + 2] + j * 0.65, 0, 255);
  }
  ctx.putImageData(img, 0, 0);
  const slab = n / 4;
  ctx.strokeStyle = "rgba(50,44,36,0.55)";
  ctx.lineWidth = 3;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(i * slab, 0);
    ctx.lineTo(i * slab, n);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * slab);
    ctx.lineTo(n, i * slab);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(24,22,18,0.28)";
  ctx.fillRect(n * 0.42, 0, n * 0.06, n);
  ctx.fillRect(0, n * 0.62, n, n * 0.045);
  ctx.fillStyle = "rgba(20,18,16,0.35)";
  ctx.beginPath();
  ctx.ellipse(n * 0.3, n * 0.4, 28, 16, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(n * 0.72, n * 0.7, 22, 12, -0.3, 0, Math.PI * 2);
  ctx.fill();
}

function paintFirearm(ctx: CanvasRenderingContext2D, n: number) {
  ctx.fillStyle = "#3e4540";
  ctx.fillRect(0, 0, n, n);
  for (let y = 0; y < n; y++) {
    const g = 62 + Math.sin(y * 0.55) * 8 + (Math.random() - 0.5) * 8;
    ctx.fillStyle = `rgba(${g},${g + 3},${g - 1},0.55)`;
    ctx.fillRect(0, y, n, 1);
  }
  ctx.strokeStyle = "rgba(190,184,170,0.28)";
  for (let k = 0; k < 16; k++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * n, Math.random() * n);
    ctx.lineTo(Math.random() * n, Math.random() * n);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(20,18,16,0.45)";
  for (let k = 0; k < 8; k++) {
    ctx.beginPath();
    ctx.ellipse(Math.random() * n, Math.random() * n, 8, 4, Math.random(), 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintCamo(ctx: CanvasRenderingContext2D, n: number) {
  ctx.fillStyle = "#2c3832";
  ctx.fillRect(0, 0, n, n);
  const blobs: [string, number][] = [
    ["#1b2420", 28],
    ["#3d4a34", 22],
    ["#6a5a3c", 16],
    ["#141816", 12],
  ];
  for (const [color, r] of blobs) {
    ctx.fillStyle = color;
    for (let k = 0; k < 10; k++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * n, Math.random() * n, r * (0.6 + Math.random()), r * (0.4 + Math.random() * 0.5), Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function applyWorldUv(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position;
  const nrm = geo.attributes.normal;
  const uv = geo.attributes.uv;
  if (!pos || !nrm || !uv) return;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const nx = Math.abs(nrm.getX(i));
    const ny = Math.abs(nrm.getY(i));
    const nz = Math.abs(nrm.getZ(i));
    let u: number;
    let v: number;
    if (ny >= nx && ny >= nz) {
      u = x;
      v = z;
    } else if (nx >= nz) {
      u = z;
      v = y;
    } else {
      u = x;
      v = y;
    }
    uv.setXY(i, u * 0.42, v * 0.42);
  }
}

function rayBox(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, b: Aabb) {
  let tmin = 0;
  let tmax = Infinity;
  let nx = 0;
  let ny = 0;
  let nz = 0;
  const o = [ox, oy, oz];
  const d = [dx, dy, dz];
  const mn = [b.minX, b.minY, b.minZ];
  const mx = [b.maxX, b.maxY, b.maxZ];
  for (let i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-8) {
      if (o[i] < mn[i] || o[i] > mx[i]) return null;
      continue;
    }
    let t1 = (mn[i] - o[i]) / d[i];
    let t2 = (mx[i] - o[i]) / d[i];
    let n1 = -1;
    let n2 = 1;
    if (t1 > t2) {
      const ts = t1;
      t1 = t2;
      t2 = ts;
      const ns = n1;
      n1 = n2;
      n2 = ns;
    }
    if (t1 > tmin) {
      tmin = t1;
      nx = 0;
      ny = 0;
      nz = 0;
      if (i === 0) nx = n1;
      else if (i === 1) ny = n1;
      else nz = n1;
    }
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return null;
  }
  if (tmax < 0) return null;
  const t = tmin >= 0 ? tmin : tmax;
  if (t < 0) return null;
  return { t, nx, ny, nz };
}

function raySphere(
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  cx: number,
  cy: number,
  cz: number,
  r: number,
) {
  const lx = cx - ox;
  const ly = cy - oy;
  const lz = cz - oz;
  const tca = lx * dx + ly * dy + lz * dz;
  if (tca < 0) return null;
  const d2 = lx * lx + ly * ly + lz * lz - tca * tca;
  const r2 = r * r;
  if (d2 > r2) return null;
  const thc = Math.sqrt(r2 - d2);
  const t = tca - thc;
  return t > 0.02 ? t : null;
}

function jitter(dx: number, dy: number, dz: number, spread: number) {
  let rx = -dz;
  let ry = 0;
  let rz = dx;
  let rl = Math.hypot(rx, ry, rz);
  if (rl < 1e-4) {
    rx = 1;
    ry = 0;
    rz = 0;
    rl = 1;
  }
  rx /= rl;
  ry /= rl;
  rz /= rl;
  const ux = ry * dz - rz * dy;
  const uy = rz * dx - rx * dz;
  const uz = rx * dy - ry * dx;
  const a = Math.random() * Math.PI * 2;
  const s = spread * Math.sqrt(Math.random());
  const ca = Math.cos(a) * s;
  const sa = Math.sin(a) * s;
  let x = dx + rx * ca + ux * sa;
  let y = dy + ry * ca + uy * sa;
  let z = dz + rz * ca + uz * sa;
  const len = Math.hypot(x, y, z) || 1;
  return { x: x / len, y: y / len, z: z / len };
}

function labelTexture(text: string) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 96;
  const g = c.getContext("2d");
  if (!g) throw new Error("canvas");
  g.clearRect(0, 0, 256, 96);
  g.fillStyle = "rgba(20,24,16,0.72)";
  g.fillRect(28, 16, 200, 64);
  g.fillStyle = "#f3ecdc";
  g.font = "700 48px sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text, 128, 50);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createGame(
  canvas: HTMLCanvasElement,
  hud: HudNodes,
  onPhase: (info: PhaseInfo) => void,
  onLock: (locked: boolean) => void,
): GameApi {
  const audio = createAudio();
  let save: SaveData = loadSave();
  let baseSens = save.sens;
  let activeMap: GameMap = MAPS[save.map] ?? MAPS.complejo;
  let ways = activeMap.ways;
  let botCount = save.bots;
  let diff: Diff = save.diff;
  let qualityPref: QualityPref = save.quality;
  let baseFov = save.fov;
  let net: NetIO | null = null;
  let netAcc = 0;
  let allyId: string | null = null;
  const remote = {
    x: 0,
    y: 0,
    z: 8,
    tx: 0,
    ty: 0,
    tz: 8,
    yaw: 0,
    tyaw: 0,
    pitch: 0,
    hp: 100,
    alive: false,
    seen: false,
    name: "",
  };
  const keys = new Set<string>();
  let qaKeys: Set<string> | null = null;
  let qa = false;
  let fireHeld = false;
  let qaFire = false;
  let adsHeld = false;
  let sprintHeld = false;
  let crouchToggle = false;
  let jumpQueued = false;
  let touchX = 0;
  let touchY = 0;
  let lookDX = 0;
  let lookDY = 0;
  let hadLock = false;
  let disposed = false;
  let phase: Phase = "menu";
  let reason = "";
  const feed: string[] = [];
  let banner = "";
  let bannerT = 0;
  let simT = 0;
  let timer = ROUND;
  let acc = 0;
  let last = performance.now();
  let fps = 60;
  let fpsFrames = 0;
  let fpsAcc = 0;
  let boot = performance.now();
  let quality = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 820 ? 1 : 2;
  let lastDrop = 0;
  const fpsSamples: number[] = [];
  let swayX = 0;
  let swayY = 0;
  let gunKick = 0;
  let flashLife = 0;
  let shake = 0;
  let hurt = 0;
  let hurtN = 0;
  let hurtE = 0;
  let hurtS = 0;
  let hurtW = 0;
  let hitAlpha = 0;
  let hitHead = false;
  let emptyLatch = false;
  let prevReload = false;
  let orbit = 0.4;
  let shellI = 0;
  let sparkI = 0;
  let tracerI = 0;
  let decalI = 0;
  let muzzleLife = 0;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
    stencil: false,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.96;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0xc9bba4, 1);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.045).texture;
  pmrem.dispose();

  const scene = new THREE.Scene();
  scene.environment = envTex;
  scene.environmentIntensity = 0.4;
  scene.fog = new THREE.Fog(0xcbbda6, 24, 92);
  const camera = new THREE.PerspectiveCamera(78, 1, 0.08, 280);
  camera.rotation.order = "YXZ";

  const viewScene = new THREE.Scene();
  viewScene.environment = envTex;
  viewScene.environmentIntensity = 0.85;
  const viewCamera = new THREE.PerspectiveCamera(78, 1, 0.05, 10);
  viewScene.add(new THREE.HemisphereLight(0xd5e2f4, 0x8d7a5e, 0.85));
  const viewSun = new THREE.DirectionalLight(0xfff1d6, 2.1);
  viewSun.position.set(2, 4, 1.2);
  viewScene.add(viewSun);
  const gunRoot = new THREE.Group();
  viewScene.add(gunRoot);

  const hemi = new THREE.HemisphereLight(0x9eb6d4, 0x8d734c, 0.42);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d0, 2.65);
  sun.position.set(26, 42, 18);
  sun.target.position.set(0, 0, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -42;
  sun.shadow.camera.right = 42;
  sun.shadow.camera.top = 42;
  sun.shadow.camera.bottom = -42;
  sun.shadow.camera.near = 2;
  sun.shadow.camera.far = 120;
  sun.shadow.bias = -0.00035;
  sun.shadow.normalBias = 0.04;
  sun.shadow.radius = 2;
  scene.add(sun);
  scene.add(sun.target);
  const fill = new THREE.DirectionalLight(0x9eb8d4, 0.42);
  fill.position.set(-24, 16, -18);
  scene.add(fill);
  const fx = createFx(renderer, scene, camera);

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(200, 28, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        top: { value: new THREE.Color("#2f6ea8") },
        hor: { value: new THREE.Color("#f0d2a4") },
        bot: { value: new THREE.Color("#b7a07e") },
      },
      vertexShader: `
        varying vec3 vP;
        void main() {
          vP = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vP;
        uniform vec3 top;
        uniform vec3 hor;
        uniform vec3 bot;
        void main() {
          vec3 n = normalize(vP);
          float h = n.y;
          vec3 col = mix(hor, top, smoothstep(0.0, 0.55, h));
          col = mix(bot, col, smoothstep(-0.18, 0.05, h));
          float bands = sin(n.x * 7.0 + n.z * 5.0) * sin(n.z * 11.0 + n.x * 3.0);
          float cloud = smoothstep(0.15, 0.8, bands * 0.5 + 0.5) * smoothstep(0.12, 0.48, h);
          col = mix(col, vec3(0.93, 0.94, 0.96), cloud * 0.55);
          vec3 sunDir = normalize(vec3(0.48, 0.72, 0.34));
          float sun = pow(max(dot(n, sunDir), 0.0), 520.0);
          float glow = pow(max(dot(n, sunDir), 0.0), 5.0);
          col += vec3(1.0, 0.95, 0.8) * sun * 1.4;
          col += vec3(1.0, 0.72, 0.4) * glow * 0.22;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    }),
  );
  scene.add(sky);

  const buckets: Record<Kind, THREE.BufferGeometry[]> = {
    concrete: [],
    wood: [],
    metal: [],
    sand: [],
    hazard: [],
  };
  const colliders: Aabb[] = [];
  const shadowMeshes: THREE.Mesh[] = [];

  function tintColor(hex: number | undefined) {
    const c = new THREE.Color(hex ?? 0xffffff);
    c.multiplyScalar(0.93 + Math.random() * 0.07);
    return c;
  }

  function pushGeometry(kind: Kind, geo: THREE.BufferGeometry, tint: number | undefined, worldUv: boolean) {
    if (worldUv) applyWorldUv(geo);
    const col = tintColor(tint);
    const arr = new Float32Array(geo.attributes.position.count * 3);
    for (let i = 0; i < geo.attributes.position.count; i++) {
      arr[i * 3] = col.r;
      arr[i * 3 + 1] = col.g;
      arr[i * 3 + 2] = col.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
    buckets[kind].push(geo);
  }

  function pushBox(
    kind: Kind,
    x: number,
    z: number,
    w: number,
    h: number,
    d: number,
    tint?: number,
    y0 = 0,
    collide = true,
  ) {
    const geo = new THREE.BoxGeometry(w, h, d);
    geo.translate(x, y0 + h / 2, z);
    pushGeometry(kind, geo, tint, kind === "concrete" || kind === "sand");
    if (collide) {
      colliders.push({
        minX: x - w / 2,
        maxX: x + w / 2,
        minY: y0,
        maxY: y0 + h,
        minZ: z - d / 2,
        maxZ: z + d / 2,
      });
    }
  }

  function pushCyl(kind: Kind, x: number, z: number, r: number, h: number, tint?: number) {
    const geo = new THREE.CylinderGeometry(r, r, h, 10);
    geo.translate(x, h / 2, z);
    pushGeometry(kind, geo, tint, false);
    colliders.push({
      minX: x - r,
      maxX: x + r,
      minY: 0,
      maxY: h,
      minZ: z - r,
      maxZ: z + r,
    });
  }

  const tex: Record<Kind, { map: THREE.CanvasTexture; normal: THREE.CanvasTexture; rough: THREE.CanvasTexture }> = {
    concrete: makeMaps(512, paintConcrete, 0.88, 0.28),
    wood: makeMaps(256, paintWood, 0.78, 0.22),
    metal: makeMaps(256, paintMetal, 0.38, 0.55),
    sand: makeMaps(256, paintSand, 0.96, 0.12),
    hazard: makeMaps(256, paintHazard, 0.62, 0.2),
  };
  const bump: Record<Kind, number> = {
    concrete: 0.85,
    wood: 0.7,
    metal: 1.05,
    sand: 0.45,
    hazard: 0.3,
  };
  const levelMats: THREE.MeshStandardMaterial[] = [];
  const worldMeshes: THREE.Mesh[] = [];

  function commitWorld() {
    for (const mesh of worldMeshes) {
      scene.remove(mesh);
      mesh.geometry.dispose();
    }
    worldMeshes.length = 0;
    shadowMeshes.length = 0;
    (Object.keys(buckets) as Kind[]).forEach((kind) => {
      const list = buckets[kind];
      buckets[kind] = [];
      if (!list.length) return;
      const merged = mergeGeometries(list, false);
      list.forEach((g) => g.dispose());
      if (!merged) return;
      const mat = new THREE.MeshStandardMaterial({
        map: tex[kind].map,
        normalMap: tex[kind].normal,
        normalScale: new THREE.Vector2(bump[kind], bump[kind]),
        roughnessMap: tex[kind].rough,
        roughness: 1,
        metalness: kind === "metal" ? 0.82 : kind === "hazard" ? 0.08 : 0.04,
        vertexColors: true,
        envMapIntensity: kind === "metal" ? 1.15 : 0.28,
      });
      levelMats.push(mat);
      const mesh = new THREE.Mesh(merged, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      worldMeshes.push(mesh);
      shadowMeshes.push(mesh);
    });
  }

  const groundMaps = makeMaps(512, paintYard, 0.92, 0.2);
  groundMaps.map.repeat.set(7, 7);
  groundMaps.normal.repeat.set(7, 7);
  groundMaps.rough.repeat.set(7, 7);
  const groundMat = new THREE.MeshStandardMaterial({
    map: groundMaps.map,
    normalMap: groundMaps.normal,
    normalScale: new THREE.Vector2(0.8, 0.8),
    roughnessMap: groundMaps.rough,
    roughness: 1,
    metalness: 0.02,
    color: activeMap.ground,
    envMapIntensity: 0.22,
  });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(130, 130), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(80 * 3);
  for (let i = 0; i < 80; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 70;
    dustPos[i * 3 + 1] = 0.4 + Math.random() * 3.2;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 56;
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({ color: 0xe6d7bc, size: 0.06, transparent: true, opacity: activeMap.dust, depthWrite: false });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  const lampMetal = new THREE.MeshStandardMaterial({ color: 0x8d9498, roughness: 0.32, metalness: 0.72 });
  const lampDark = new THREE.MeshStandardMaterial({ color: 0x2a2d28, roughness: 0.5, metalness: 0.4 });
  const lampRoot = new THREE.Group();
  scene.add(lampRoot);

  function clearLamps() {
    for (const child of [...lampRoot.children]) {
      lampRoot.remove(child);
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
    }
  }

  function placeLamp(x: number, z: number, cool: boolean) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 3.4, 8), lampMetal);
    pole.position.set(x, 1.7, z);
    pole.castShadow = true;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.28), lampDark);
    head.position.set(x, 3.4, z);
    head.castShadow = true;
    const glow = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.04, 0.16),
      new THREE.MeshBasicMaterial({ color: cool ? 0xc9ddff : 0xffc98a }),
    );
    glow.position.set(x, 3.32, z);
    const bulb = new THREE.PointLight(cool ? 0xb9d4ff : 0xffc27a, cool ? 2.1 : 1.35, cool ? 16 : 12, 2);
    bulb.position.set(x, 3.15, z);
    lampRoot.add(pole, head, glow, bulb);
  }

  function applyAtmosphere(def: GameMap) {
    const skyMat = sky.material as THREE.ShaderMaterial;
    skyMat.uniforms.top.value.set(def.sky.top);
    skyMat.uniforms.hor.value.set(def.sky.hor);
    skyMat.uniforms.bot.value.set(def.sky.bot);
    const fog = scene.fog as THREE.Fog;
    fog.color.set(def.fog.color);
    fog.near = def.fog.near;
    fog.far = def.fog.far;
    renderer.setClearColor(def.clear, 1);
    groundMat.color.set(def.ground);
    sun.color.set(def.sun.color);
    sun.intensity = def.sun.intensity;
    sun.position.set(def.sun.x, def.sun.y, def.sun.z);
    fx.setSun(new THREE.Vector3(def.sun.x, def.sun.y, def.sun.z));
    hemi.color.set(def.hemi.sky);
    hemi.groundColor.set(def.hemi.ground);
    hemi.intensity = def.hemi.intensity;
    dustMat.opacity = def.dust;
    scene.environmentIntensity = qualityPref === "realista" ? 0.62 : qualityPref === "rendimiento" ? 0.22 : 0.4;
  }

  function fillLevel(def: GameMap) {
    colliders.length = 0;
    for (const key of Object.keys(buckets) as Kind[]) buckets[key] = [];
    for (const box of def.boxes) {
      pushBox(box.k, box.x, box.z, box.w, box.h, box.d, box.tint, box.y ?? 0, box.hit !== false);
    }
    for (const cyl of def.cyls) pushCyl(cyl.k, cyl.x, cyl.z, cyl.r, cyl.h, cyl.tint);
  }

  function layoutActors(def: GameMap) {
    ways = def.ways;
    bases[0].x = def.bases[0].x;
    bases[0].z = def.bases[0].z;
    bases[1].x = def.bases[1].x;
    bases[1].z = def.bases[1].z;
    for (const base of bases) {
      base.ring.position.set(base.x, 0.04, base.z);
      base.disc.position.set(base.x, 0.035, base.z);
      base.beam.position.set(base.x, 3.8, base.z);
      base.sign.position.set(base.x, 3.35, base.z);
      base.light.position.set(base.x, 2.2, base.z);
    }
    for (let i = 0; i < bots.length; i++) {
      const spawn = def.bots[i];
      const bot = bots[i];
      bot.home = spawn.home;
      bot.spawnX = spawn.x;
      bot.spawnZ = spawn.z;
      bot.x = spawn.x;
      bot.z = spawn.z;
      bot.enabled = i < botCount;
      bot.group.visible = bot.enabled;
      bot.group.position.set(spawn.x, 0, spawn.z);
      bot.wp = i % ways[bot.home].length;
    }
  }

  function rebuildLevel(def: GameMap) {
    activeMap = def;
    for (const mat of levelMats) mat.dispose();
    levelMats.length = 0;
    fillLevel(def);
    commitWorld();
    clearLamps();
    const cool = def.id === "deposito";
    for (const [x, z] of def.lamps) placeLamp(x, z, cool);
    applyAtmosphere(def);
    if (bases.length) layoutActors(def);
  }

  function makeZone(name: string, x: number, z: number, color: number) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(4.7, 5.35, 48),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, 0.04, z);
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(4.7, 40),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }),
    );
    disc.rotation.x = -Math.PI / 2;
    disc.position.set(x, 0.035, z);
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.55, 7.5, 12, 1, true),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }),
    );
    beam.position.set(x, 3.8, z);
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 0.9),
      new THREE.MeshBasicMaterial({ map: labelTexture(name), transparent: true, depthWrite: false, side: THREE.DoubleSide }),
    );
    sign.position.set(x, 3.35, z);
    const light = new THREE.PointLight(color, 0.7, 12, 2);
    light.position.set(x, 2.2, z);
    scene.add(ring, disc, beam, sign, light);
    return { x, z, r: 5.35, p: 0, ring, disc, beam, sign, light, half: false, held: false };
  }

  const bases = [
    makeZone("ALFA", activeMap.bases[0].x, activeMap.bases[0].z, 0x3cb8b2),
    makeZone("BRAVO", activeMap.bases[1].x, activeMap.bases[1].z, 0x3cb8b2),
  ];
  const camo = makeMaps(128, paintCamo, 0.9, 0.15);

  function makeBot(id: number, home: 0 | 1, x: number, z: number): Bot {
    const uniform = new THREE.MeshStandardMaterial({
      map: camo.map,
      normalMap: camo.normal,
      normalScale: new THREE.Vector2(0.35, 0.35),
      roughnessMap: camo.rough,
      roughness: 1,
      metalness: 0.02,
    });
    const plate = new THREE.MeshStandardMaterial({ color: 0x4a555c, roughness: 0.42, metalness: 0.62, envMapIntensity: 0.8 });
    const glove = new THREE.MeshStandardMaterial({ color: 0x6a5346, roughness: 0.82 });
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x1a1d1a, roughness: 0.45, metalness: 0.45 });
    const visor = new THREE.MeshStandardMaterial({
      color: 0x062220,
      emissive: 0x167f7a,
      emissiveIntensity: 0.9,
      roughness: 0.25,
      metalness: 0.4,
    });
    const group = new THREE.Group();
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.5, 0.28), plate);
    torso.position.set(0, 1.22, 0);
    torso.castShadow = true;
    const belly = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.28, 0.22), uniform);
    belly.position.set(0, 0.86, 0);
    belly.castShadow = true;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 0.26), uniform);
    head.position.set(0, 1.62, 0);
    head.castShadow = true;
    const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.32), plate);
    helmet.position.set(0, 1.78, 0);
    const vis = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.07, 0.04), visor);
    vis.position.set(0, 1.63, -0.14);
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.32, 0.12), uniform);
    pack.position.set(0, 1.22, 0.18);
    const limb = (px: number, py: number, pz: number, w: number, h: number, d: number, mat: THREE.Material) => {
      const pivot = new THREE.Group();
      pivot.position.set(px, py, pz);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(0, -h / 2, 0);
      mesh.castShadow = true;
      pivot.add(mesh);
      return pivot;
    };
    const legL = limb(-0.12, 0.72, 0, 0.15, 0.7, 0.16, uniform);
    const legR = limb(0.12, 0.72, 0, 0.15, 0.7, 0.16, uniform);
    const armL = limb(-0.34, 1.42, 0, 0.12, 0.5, 0.14, uniform);
    const armR = limb(0.34, 1.42, 0, 0.12, 0.46, 0.14, glove);
    const rifle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.46), gunMat);
    rifle.position.set(0.02, -0.28, -0.22);
    armR.add(rifle);
    group.add(torso, belly, head, helmet, vis, pack, legL, legR, armL, armR);
    group.position.set(x, 0, z);
    scene.add(group);
    const base = bases[home];
    return {
      id,
      name: `Guardia ${id + 1}`,
      home,
      x,
      y: 0,
      z,
      vx: 0,
      vz: 0,
      yaw: Math.atan2(-(base.x - x), -(base.z - z)),
      hp: 100,
      alive: true,
      respawn: 0,
      cooldown: 0.4 + id * 0.07,
      alert: 0,
      react: 0,
      lx: x,
      lz: z,
      wp: id % ways[home].length,
      stuck: 0,
      nudge: 0,
      side: id % 2 === 0 ? 1 : -1,
      walk: id,
      flash: 0,
      spawnX: x,
      spawnZ: z,
      enabled: true,
      group,
      legL,
      legR,
      armL,
      armR,
      bodyMats: [uniform, plate, glove, gunMat],
    };
  }

  const bots: Bot[] = activeMap.bots.map((spawn, id) => makeBot(id, spawn.home, spawn.x, spawn.z));
  rebuildLevel(activeMap);

  const allyMat = new THREE.MeshStandardMaterial({ color: 0x1c3a40, roughness: 0.72, metalness: 0.08 });
  const allyVisor = new THREE.MeshStandardMaterial({
    color: 0x062220,
    emissive: 0x3cb8b2,
    emissiveIntensity: 1.2,
    roughness: 0.18,
  });
  const ally = new THREE.Group();
  const allyBody = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.78, 0.28), allyMat);
  allyBody.position.y = 1.08;
  allyBody.castShadow = true;
  const allyHead = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 0.26), allyMat);
  allyHead.position.y = 1.64;
  allyHead.castShadow = true;
  const allyVis = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.07, 0.04), allyVisor);
  allyVis.position.set(0, 1.64, -0.14);
  ally.add(allyBody, allyHead, allyVis);
  ally.visible = false;
  scene.add(ally);

  const flashMat = new THREE.MeshBasicMaterial({
    map: flashTexture(),
    color: 0xffe1a2,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
  });
  const gunWear = makeMaps(256, paintFirearm, 0.46, 0.4);
  const dark = new THREE.MeshStandardMaterial({
    map: gunWear.map,
    normalMap: gunWear.normal,
    normalScale: new THREE.Vector2(0.45, 0.45),
    roughnessMap: gunWear.rough,
    roughness: 1,
    metalness: 0.62,
    color: 0x9aa398,
    envMapIntensity: 1,
  });
  const metal = new THREE.MeshStandardMaterial({
    map: gunWear.map,
    normalMap: gunWear.normal,
    normalScale: new THREE.Vector2(0.25, 0.25),
    roughnessMap: gunWear.rough,
    roughness: 0.55,
    metalness: 0.92,
    color: 0xd5d8da,
    envMapIntensity: 1.2,
  });
  const poly = new THREE.MeshStandardMaterial({ color: 0x1c1f1c, roughness: 0.58, metalness: 0.18, envMapIntensity: 0.55 });
  const accent = new THREE.MeshStandardMaterial({ color: 0xc9841a, roughness: 0.42, metalness: 0.28, envMapIntensity: 0.6 });
  const glove = new THREE.MeshStandardMaterial({ color: 0x3a342e, roughness: 0.8 });
  const woodGun = new THREE.MeshStandardMaterial({ color: 0x6b432c, roughness: 0.66, metalness: 0.06 });
  const glass = new THREE.MeshStandardMaterial({
    color: 0x12343a,
    emissive: 0x0c6a64,
    emissiveIntensity: 0.45,
    roughness: 0.08,
    metalness: 0.25,
  });

  type GunView = {
    root: THREE.Group;
    mag: THREE.Mesh | null;
    rest: number;
    pump: boolean;
    flash: THREE.Mesh;
  };
  const guns: GunView[] = [];

  const addMesh = (
    parent: THREE.Object3D,
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    x: number,
    y: number,
    z: number,
    rx = 0,
    ry = 0,
    rz = 0,
  ) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    parent.add(mesh);
    return mesh;
  };

  const tube = (r0: number, r1: number, len: number) => {
    const geo = new THREE.CylinderGeometry(r0, r1, len, 12);
    geo.rotateX(Math.PI / 2);
    return geo;
  };

  const muzzleFlash = (parent: THREE.Group, y: number, z: number, size: number) => {
    const flash = new THREE.Mesh(new THREE.PlaneGeometry(size * 1.8, size * 1.8), flashMat);
    flash.position.set(0, y, z);
    flash.visible = false;
    parent.add(flash);
    return flash;
  };

  const pushGun = (
    build: (root: THREE.Group) => { mag: THREE.Mesh | null; rest: number; pump: boolean; flash: THREE.Mesh },
  ) => {
    const root = new THREE.Group();
    root.visible = guns.length === 0;
    gunRoot.add(root);
    guns.push({ root, ...build(root) });
  };

  pushGun((root) => {
    addMesh(root, new THREE.BoxGeometry(0.05, 0.08, 0.24), poly, 0, 0.01, 0.18);
    addMesh(root, new THREE.BoxGeometry(0.07, 0.1, 0.34), dark, 0, 0.02, -0.06);
    addMesh(root, new THREE.BoxGeometry(0.018, 0.02, 0.2), metal, 0, 0.09, -0.05);
    addMesh(root, new THREE.BoxGeometry(0.042, 0.12, 0.048), poly, 0, -0.08, 0.03, 0.22);
    const mag = addMesh(root, new THREE.BoxGeometry(0.046, 0.16, 0.048), dark, 0, -0.14, -0.06);
    addMesh(root, new THREE.BoxGeometry(0.06, 0.072, 0.26), dark, 0, 0.018, -0.36);
    addMesh(root, tube(0.014, 0.016, 0.34), metal, 0, 0.034, -0.64);
    addMesh(root, tube(0.02, 0.02, 0.05), dark, 0, 0.034, -0.84);
    addMesh(root, new THREE.BoxGeometry(0.048, 0.04, 0.07), accent, 0, 0.02, -0.2);
    addMesh(root, new THREE.BoxGeometry(0.07, 0.075, 0.09), glove, 0, -0.02, -0.32, 0.45);
    addMesh(root, new THREE.BoxGeometry(0.055, 0.085, 0.07), glove, 0.012, -0.06, 0.02, 0.35);
    return { mag, rest: -0.14, pump: false, flash: muzzleFlash(root, 0.034, -0.9, 0.2) };
  });

  pushGun((root) => {
    addMesh(root, new THREE.BoxGeometry(0.055, 0.09, 0.16), poly, 0, 0, 0.08);
    addMesh(root, new THREE.BoxGeometry(0.064, 0.085, 0.28), dark, 0, 0.015, -0.12);
    const mag = addMesh(root, new THREE.BoxGeometry(0.04, 0.2, 0.05), dark, 0, -0.16, -0.04);
    addMesh(root, tube(0.013, 0.015, 0.16), metal, 0, 0.03, -0.34);
    addMesh(root, new THREE.BoxGeometry(0.03, 0.09, 0.03), poly, 0.02, -0.08, -0.28);
    addMesh(root, new THREE.BoxGeometry(0.05, 0.03, 0.08), accent, 0, 0.06, -0.02);
    addMesh(root, new THREE.BoxGeometry(0.06, 0.07, 0.08), glove, 0.03, -0.03, -0.16, 0.4);
    addMesh(root, new THREE.BoxGeometry(0.05, 0.07, 0.06), glove, 0, -0.05, 0.04, 0.3);
    return { mag, rest: -0.16, pump: false, flash: muzzleFlash(root, 0.03, -0.44, 0.16) };
  });

  pushGun((root) => {
    addMesh(root, new THREE.BoxGeometry(0.05, 0.07, 0.28), woodGun, 0, 0, 0.2);
    addMesh(root, new THREE.BoxGeometry(0.07, 0.09, 0.22), dark, 0, 0.02, -0.04);
    addMesh(root, tube(0.02, 0.022, 0.62), metal, 0, 0.04, -0.46);
    const pump = addMesh(root, new THREE.BoxGeometry(0.055, 0.055, 0.16), woodGun, 0, 0.0, -0.32);
    addMesh(root, new THREE.BoxGeometry(0.04, 0.11, 0.045), poly, 0, -0.08, 0.02, 0.18);
    addMesh(root, new THREE.BoxGeometry(0.06, 0.07, 0.1), glove, 0.02, -0.02, -0.18, 0.4);
    addMesh(root, new THREE.BoxGeometry(0.05, 0.08, 0.07), glove, 0, -0.05, 0.08, 0.25);
    return { mag: pump, rest: -0.32, pump: true, flash: muzzleFlash(root, 0.04, -0.8, 0.28) };
  });

  pushGun((root) => {
    root.scale.setScalar(0.86);
    root.position.set(0.05, -0.02, 0.05);
    addMesh(root, new THREE.BoxGeometry(0.045, 0.14, 0.05), poly, 0, -0.08, 0.02, 0.28);
    addMesh(root, new THREE.BoxGeometry(0.048, 0.07, 0.18), dark, 0, 0.03, -0.04);
    addMesh(root, tube(0.012, 0.013, 0.14), metal, 0, 0.045, -0.18);
    const mag = addMesh(root, new THREE.BoxGeometry(0.03, 0.07, 0.04), dark, 0, -0.02, 0.0);
    addMesh(root, new THREE.BoxGeometry(0.05, 0.06, 0.07), glove, 0.02, -0.04, 0.0, 0.35);
    return { mag, rest: -0.02, pump: false, flash: muzzleFlash(root, 0.045, -0.28, 0.14) };
  });

  pushGun((root) => {
    addMesh(root, new THREE.BoxGeometry(0.048, 0.075, 0.3), poly, 0, 0.01, 0.22);
    addMesh(root, new THREE.BoxGeometry(0.055, 0.08, 0.36), dark, 0, 0.025, -0.08);
    addMesh(root, tube(0.011, 0.013, 0.52), metal, 0, 0.04, -0.5);
    addMesh(root, tube(0.018, 0.02, 0.16), dark, 0, 0.105, -0.02);
    addMesh(root, tube(0.012, 0.012, 0.04), metal, 0, 0.105, 0.08);
    addMesh(root, new THREE.CircleGeometry(0.016, 12), glass, 0, 0.105, -0.1);
    const mag = addMesh(root, new THREE.BoxGeometry(0.04, 0.1, 0.04), dark, 0, -0.08, -0.02);
    addMesh(root, new THREE.BoxGeometry(0.04, 0.11, 0.042), poly, 0, -0.07, 0.06, 0.2);
    addMesh(root, new THREE.BoxGeometry(0.05, 0.03, 0.1), accent, 0, 0.07, -0.22);
    addMesh(root, new THREE.BoxGeometry(0.06, 0.07, 0.09), glove, 0.01, -0.02, -0.16, 0.4);
    addMesh(root, new THREE.BoxGeometry(0.05, 0.08, 0.06), glove, 0, -0.05, 0.08, 0.3);
    return { mag, rest: -0.08, pump: false, flash: muzzleFlash(root, 0.04, -0.78, 0.18) };
  });

  // GL-0 GLACIAR: pintura polar (hielo azul/blanco) + partículas de escarcha.
  const iceMat = new THREE.MeshStandardMaterial({ color: 0xbfe6ff, emissive: 0x2a8cff, emissiveIntensity: 0.32, roughness: 0.14, metalness: 0.35, envMapIntensity: 1.4 });
  const snowMat = new THREE.MeshStandardMaterial({ color: 0xd6e4f0, roughness: 0.85, metalness: 0.05 });
  const crystalMat = new THREE.MeshStandardMaterial({ color: 0x9fe9ff, emissive: 0x47d4ff, emissiveIntensity: 1.1, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.85 });
  let frostPts: THREE.Points | null = null;
  pushGun((root) => {
    root.scale.setScalar(0.74);
    root.position.set(0.02, -0.01, 0.05);
    addMesh(root, new THREE.BoxGeometry(0.05, 0.08, 0.26), snowMat, 0, 0.01, 0.2);
    addMesh(root, new THREE.BoxGeometry(0.07, 0.1, 0.36), iceMat, 0, 0.02, -0.07);
    addMesh(root, tube(0.014, 0.018, 0.46), iceMat, 0, 0.04, -0.46);
    for (let i = 0; i < 4; i++) addMesh(root, new THREE.OctahedronGeometry(0.022 - i * 0.003), crystalMat, 0, 0.04, -0.3 - i * 0.09, 0, i, 0.6);
    addMesh(root, new THREE.ConeGeometry(0.02, 0.08, 6), crystalMat, 0.03, 0.1, -0.1, 0.3, 0, -0.5);
    addMesh(root, new THREE.ConeGeometry(0.016, 0.06, 6), crystalMat, -0.03, 0.09, -0.02, 0.2, 0, 0.5);
    addMesh(root, new THREE.BoxGeometry(0.02, 0.03, 0.22), snowMat, 0, 0.09, -0.06);
    const mag = addMesh(root, new THREE.BoxGeometry(0.04, 0.16, 0.06), crystalMat, 0, -0.12, -0.05, 0.15);
    addMesh(root, new THREE.BoxGeometry(0.04, 0.11, 0.042), snowMat, 0, -0.07, 0.07, 0.2);
    addMesh(root, new THREE.BoxGeometry(0.06, 0.07, 0.09), glove, 0.01, -0.02, -0.18, 0.4);
    addMesh(root, new THREE.BoxGeometry(0.05, 0.08, 0.06), glove, 0, -0.05, 0.08, 0.3);
    const n = 22;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.14;
      pos[i * 3 + 1] = Math.random() * 0.16 - 0.02;
      pos[i * 3 + 2] = -Math.random() * 0.7 + 0.1;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    frostPts = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xdff6ff, size: 0.005, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
    root.add(frostPts);
    return { mag, rest: -0.12, pump: false, flash: muzzleFlash(root, 0.04, -0.72, 0.2) };
  });
  const frost = new Map<Bot, number>();

  const enemyMuzzle = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffe2a0, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  enemyMuzzle.visible = false;
  scene.add(enemyMuzzle);

  function poolBox(count: number, geo: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D): PoolMesh[] {
    const list: PoolMesh[] = [];
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      parent.add(mesh);
      list.push({ mesh, vx: 0, vy: 0, vz: 0, life: 0 });
    }
    return list;
  }

  const shells = poolBox(
    12,
    new THREE.BoxGeometry(0.025, 0.05, 0.025),
    new THREE.MeshStandardMaterial({ color: 0xc6a15a, metalness: 0.7, roughness: 0.35 }),
    scene,
  );
  const sparks = poolBox(
    16,
    new THREE.BoxGeometry(0.05, 0.05, 0.05),
    new THREE.MeshBasicMaterial({ color: 0xffc56a }),
    scene,
  );
  const tracerMat = new THREE.MeshBasicMaterial({
    color: 0xffc14a,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const tracers = poolBox(14, new THREE.BoxGeometry(0.018, 0.018, 1), tracerMat, scene);
  const decals = poolBox(
    24,
    new THREE.PlaneGeometry(0.16, 0.16),
    new THREE.MeshBasicMaterial({
      color: 0x241e16,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    }),
    scene,
  );

  const player = {
    x: 0,
    y: 0,
    z: 21,
    vx: 0,
    vy: 0,
    vz: 0,
    yaw: 0,
    pitch: 0,
    hp: 100,
    armor: 50,
    mag: WEAPONS[0].magSize,
    reserve: WEAPONS[0].reserve,
    reload: 0,
    nextShot: 0,
    spray: 0,
    recoilP: 0,
    recoilY: 0,
    bob: 0,
    grounded: true,
    alive: true,
    down: 0,
    invuln: 0,
    crouch: 0,
    ads: 0,
    draw: 0,
    kills: 0,
    deaths: 0,
  };
  let wep = 0;
  let loadout: number[] = [0, 1, 3];
  let slot = 0;
  const mdl = (i: number) => WEAPONS[i].model ?? i;
  type AbilId = "dash" | "escudo" | "cura" | "radar";
  const ABIL_CD: Record<AbilId, number> = { dash: 6, escudo: 18, cura: 20, radar: 15 };
  let abils: { id: AbilId; cd: number }[] = [{ id: "dash", cd: 0 }];
  let shieldT = 0;
  let radarT = 0;
  let dashT = 0;
  function useAbility(i: number) {
    const a = abils[i];
    if (!a || a.cd > 0 || phase !== "play" || !player.alive || player.down > 0) return false;
    a.cd = ABIL_CD[a.id];
    if (a.id === "dash") {
      dashT = 0.2;
      say("DASH", 0.6);
    } else if (a.id === "escudo") {
      shieldT = 4;
      say("ESCUDO ACTIVO", 1.2);
    } else if (a.id === "cura") {
      player.hp = Math.min(100, player.hp + 50);
      say("+50 VIDA", 1);
    } else if (a.id === "radar") {
      radarT = 7;
      say("RADAR: ENEMIGOS EN EL MAPA", 1.4);
    }
    audio.blip();
    return true;
  }
  const ammo = WEAPONS.map((w) => ({ mag: w.magSize, reserve: w.reserve }));
  let semiLatch = false;
  let wheelLock = 0;

  function liveWeapon() {
    return WEAPONS[wep];
  }

  function pushAmmo() {
    ammo[wep].mag = player.mag;
    ammo[wep].reserve = player.reserve;
  }

  function pullAmmo() {
    player.mag = ammo[wep].mag;
    player.reserve = ammo[wep].reserve;
  }

  function showGun() {
    const mi = mdl(wep);
    for (let i = 0; i < guns.length; i++) guns[i].root.visible = i === mi;
  }

  function selectWeapon(index: number) {
    const n = loadout.length;
    const ns = ((index % n) + n) % n;
    const next = loadout[ns];
    if (next === wep || player.down > 0) return;
    slot = ns;
    pushAmmo();
    wep = next;
    pullAmmo();
    player.reload = 0;
    player.spray = 0;
    player.draw = liveWeapon().draw;
    semiLatch = true;
    showGun();
    audio.blip();
  }

  function aimSpread() {
    const w = liveWeapon();
    let spread = w.spread + player.spray * w.sprayGrow;
    spread += Math.hypot(player.vx, player.vz) * w.moveSpread;
    if (!player.grounded) spread += w.air;
    if (player.crouch > 0.75) spread *= 0.72;
    spread *= 1 - player.ads * w.adsTight;
    return spread;
  }

  function blocked(x: number, z: number, r: number) {
    if (x < -34.15 || x > 34.15 || z < -23.7 || z > 27.7) return true;
    for (let i = 0; i < colliders.length; i++) {
      const b = colliders[i];
      if (b.maxY < 0.45) continue;
      const cx = clamp(x, b.minX, b.maxX);
      const cz = clamp(z, b.minZ, b.maxZ);
      const dx = x - cx;
      const dz = z - cz;
      if (dx * dx + dz * dz < r * r) return true;
    }
    return false;
  }

  function moveCircle(x: number, z: number, dx: number, dz: number, r: number) {
    let nx = x;
    let nz = z;
    if (!blocked(x + dx, z, r)) nx = x + dx;
    if (!blocked(nx, z + dz, r)) nz = z + dz;
    return { x: nx, z: nz };
  }

  function rayWorld(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number) {
    let best: { t: number; nx: number; ny: number; nz: number } | null = null;
    for (let i = 0; i < colliders.length; i++) {
      const hit = rayBox(ox, oy, oz, dx, dy, dz, colliders[i]);
      if (!hit || hit.t < 0) continue;
      if (!best || hit.t < best.t) best = hit;
    }
    return best;
  }

  function eyeY() {
    return player.y + lerp(1.62, 1.0, player.crouch);
  }

  function forwardOf(yaw: number, pitch: number) {
    const cp = Math.cos(pitch);
    return {
      x: -Math.sin(yaw) * cp,
      y: Math.sin(pitch),
      z: -Math.cos(yaw) * cp,
    };
  }

  function say(text: string, time = 2.2) {
    banner = text;
    bannerT = time;
  }

  function pushFeed(line: string) {
    feed.unshift(line);
    if (feed.length > 4) feed.pop();
  }

  function info(): PhaseInfo {
    return {
      phase,
      kills: player.kills,
      deaths: player.deaths,
      elapsed: ROUND - timer,
      best: save.best,
      wins: save.wins,
      reason,
      map: activeMap.id,
      basesTaken: bases.filter((b) => b.p >= 100).length,
    };
  }

  function setPhase(next: Phase) {
    if (phase === next) return;
    phase = next;
    onPhase(info());
  }

  function requestLock() {
    try {
      const ret = canvas.requestPointerLock({ unadjustedMovement: true });
      if (ret && typeof (ret as Promise<void>).catch === "function") {
        void (ret as Promise<void>).catch(() => {
          try {
            canvas.requestPointerLock();
          } catch {
            /* no pointer lock */
          }
        });
      }
    } catch {
      try {
        canvas.requestPointerLock();
      } catch {
        /* no pointer lock */
      }
    }
  }

  function diffMul() {
    if (diff === "recluta") return { spread: 1.55, cool: 1.4, dmg: 0.62, react: 0.42 };
    if (diff === "veterano") return { spread: 0.58, cool: 0.7, dmg: 1.35, react: 0.06 };
    return { spread: 1, cool: 1, dmg: 1, react: 0.2 };
  }

  function humanIn(base: { x: number; z: number; r: number }) {
    const me = player.alive && player.down <= 0 && Math.hypot(player.x - base.x, player.z - base.z) < base.r;
    const friend = remote.alive && remote.seen && Math.hypot(remote.x - base.x, remote.z - base.z) < base.r;
    return me || friend;
  }

  function resetRound() {
    player.x = activeMap.spawn.x;
    player.y = 0;
    player.z = activeMap.spawn.z;
    player.vx = 0;
    player.vy = 0;
    player.vz = 0;
    player.yaw = activeMap.spawn.yaw;
    player.pitch = 0;
    player.hp = 100;
    player.armor = 50;
    slot = 0;
    wep = loadout[0];
    shieldT = 0;
    radarT = 0;
    for (const a of abils) a.cd = 0;
    for (let i = 0; i < WEAPONS.length; i++) {
      ammo[i].mag = WEAPONS[i].magSize;
      ammo[i].reserve = WEAPONS[i].reserve;
    }
    pullAmmo();
    player.reload = 0;
    player.nextShot = 0;
    player.spray = 0;
    player.recoilP = 0;
    player.recoilY = 0;
    player.bob = 0;
    player.grounded = true;
    player.alive = true;
    player.down = 0;
    player.invuln = 1.4;
    player.crouch = 0;
    player.ads = 0;
    player.draw = 0;
    player.kills = 0;
    player.deaths = 0;
    crouchToggle = false;
    semiLatch = false;
    showGun();
    timer = ROUND;
    simT = 0;
    feed.length = 0;
    hurt = 0;
    for (const base of bases) {
      base.p = 0;
      base.half = false;
      base.held = false;
    }
    for (const bot of bots) {
      bot.x = bot.spawnX;
      bot.z = bot.spawnZ;
      bot.y = 0;
      bot.vx = 0;
      bot.vz = 0;
      bot.hp = 100;
      bot.alive = true;
      bot.respawn = 0;
      bot.alert = 0;
      bot.react = 0;
      bot.cooldown = 0.3;
      bot.enabled = bot.id < botCount;
      bot.group.visible = bot.enabled;
      bot.group.position.set(bot.x, 0, bot.z);
    }
    say(`${activeMap.name} — CAPTURA ALFA Y BRAVO`, 3.4);
  }

  function finish(next: "win" | "lose", why: string, remoteOrigin = false) {
    if (phase !== "play") return;
    reason = why;
    if (next === "win") {
      const elapsed = ROUND - timer;
      save.wins += 1;
      if (save.best === null || elapsed < save.best) save.best = elapsed;
      writeSave(save);
    }
    if (!remoteOrigin && net?.role === "host") net.send({ t: "end", result: next, why });
    setPhase(next);
    try {
      document.exitPointerLock();
    } catch {
      /* ignore */
    }
  }

  function canSee(bot: Bot) {
    if (!player.alive || player.invuln > 0) return false;
    const ox = bot.x;
    const oy = 1.5;
    const oz = bot.z;
    const tx = player.x;
    const ty = eyeY() - 0.15;
    const tz = player.z;
    let dx = tx - ox;
    let dy = ty - oy;
    let dz = tz - oz;
    const dist = Math.hypot(dx, dy, dz);
    if (dist > 34) return false;
    dx /= dist;
    dy /= dist;
    dz /= dist;
    const wall = rayWorld(ox, oy, oz, dx, dy, dz);
    if (wall && wall.t < dist - 0.45) return false;
    return true;
  }

  function damagePlayer(amount: number, head: boolean, srcX: number, srcZ: number) {
    if (!player.alive || player.invuln > 0 || phase !== "play") return;
    let dmg = shieldT > 0 ? amount * 0.25 : amount;
    if (!head && player.armor > 0) {
      const absorbed = Math.min(player.armor, dmg * 0.5);
      player.armor -= absorbed;
      dmg -= absorbed;
    }
    player.hp = Math.max(0, player.hp - dmg);
    hurt = 1;
    shake = Math.min(1.2, shake + 0.7);
    const dx = srcX - player.x;
    const dz = srcZ - player.z;
    const fx = -Math.sin(player.yaw);
    const fz = -Math.cos(player.yaw);
    const rx = Math.cos(player.yaw);
    const rz = -Math.sin(player.yaw);
    const front = dx * fx + dz * fz;
    const side = dx * rx + dz * rz;
    const ang = Math.atan2(side, front);
    hurtN = Math.max(0, Math.cos(ang));
    hurtE = Math.max(0, Math.sin(ang));
    hurtS = Math.max(0, -Math.cos(ang));
    hurtW = Math.max(0, -Math.sin(ang));
    audio.hurt();
    if (player.hp <= 0) {
      player.alive = false;
      player.down = 2.5;
      player.deaths += 1;
      say("HAS CAÍDO — REINSERTANDO", 2.4);
    }
  }

  function respawnPlayer() {
    player.x = activeMap.spawn.x + (Math.random() - 0.5) * 1.5;
    player.z = activeMap.spawn.z;
    player.y = 0;
    player.vx = 0;
    player.vy = 0;
    player.vz = 0;
    player.pitch = 0;
    player.hp = 100;
    player.armor = 40;
    player.alive = true;
    player.down = 0;
    player.invuln = 1.6;
    player.mag = Math.max(player.mag, Math.ceil(liveWeapon().magSize * 0.45));
    pushAmmo();
  }

  function hurtBot(bot: Bot, dmg: number, head: boolean, credit: "local" | "ally" = "local") {
    if (!bot.alive || !bot.enabled) return;
    bot.hp -= dmg;
    bot.flash = 0.12;
    if (credit === "local" && WEAPONS[wep].id === "glaciar") frost.set(bot, 1.4);
    bot.alert = 3.2;
    bot.lx = credit === "ally" ? remote.x : player.x;
    bot.lz = credit === "ally" ? remote.z : player.z;
    if (credit === "local") {
      hitAlpha = 1;
      hitHead = head;
      audio.hit(head);
    }
    if (bot.hp <= 0) {
      bot.alive = false;
      bot.group.visible = false;
      fx.burst(bot.x, bot.y, bot.z);
      bot.respawn = 5.5;
      const who = credit === "local" ? "Eliminaste" : `${remote.name || "Aliado"} eliminó`;
      if (credit === "local") player.kills += 1;
      pushFeed(`${who} a ${bot.name}`);
      audio.down();
    }
  }

  function shoot() {
    const w = liveWeapon();
    player.mag -= 1;
    pushAmmo();
    player.spray = Math.min(1.6, player.spray + w.sprayAdd);
    const kick = w.recoil + player.spray * w.recoil * 0.35;
    player.pitch = clamp(player.pitch + kick * 0.28, -PITCH_LIMIT, PITCH_LIMIT);
    player.recoilP += kick * 0.72;
    player.recoilY += (Math.random() - 0.5) * w.yawKick;
    gunKick = w.kick;
    flashLife = w.id === "shot" ? 0.07 : 0.045;
    shake = Math.min(1.2, shake + (w.id === "shot" ? 0.72 : w.id === "dmr" ? 0.48 : 0.32));
    audio.shot(0.55 + w.kick * 0.28, 0, w.snd ?? (w.id as BaseSound));
    const gun = guns[mdl(wep)];
    gun.flash.scale.setScalar((w.id === "shot" ? 1.65 : w.id === "pistol" ? 0.7 : w.id === "smg" ? 0.85 : 1.1) * (0.85 + Math.random() * 0.3));
    gun.flash.rotation.z = Math.random() * Math.PI * 2;
    tracerMat.color.set(w.id === "dmr" ? 0xff9a3c : w.id === "smg" ? 0xffe08a : w.id === "pistol" ? 0xffd27a : 0xffc14a);
    const dir0 = forwardOf(player.yaw + player.recoilY, player.pitch + player.recoilP);
    const spread = aimSpread();
    const ox = player.x;
    const oy = eyeY();
    const oz = player.z;
    {
      const f0 = forwardOf(player.yaw, player.pitch);
      fx.muzzle(ox + f0.x * 0.9, oy + f0.y * 0.9 - 0.1, oz + f0.z * 0.9, w.id === "shot");
    }
    const landed = new Map<Bot, { dmg: number; head: boolean }>();
    for (let pellet = 0; pellet < w.pellets; pellet++) {
      const dir = jitter(dir0.x, dir0.y, dir0.z, spread);
      let bestT = 80;
      let hitBot: Bot | null = null;
      let head = false;
      for (const bot of bots) {
        if (!bot.alive || !bot.enabled) continue;
        const hs = raySphere(ox, oy, oz, dir.x, dir.y, dir.z, bot.x, bot.y + 1.64, bot.z, 0.2);
        if (hs !== null && hs < bestT) {
          bestT = hs;
          hitBot = bot;
          head = true;
        }
        const body = rayBox(ox, oy, oz, dir.x, dir.y, dir.z, {
          minX: bot.x - 0.38,
          maxX: bot.x + 0.38,
          minY: bot.y + 0.68,
          maxY: bot.y + 1.45,
          minZ: bot.z - 0.38,
          maxZ: bot.z + 0.38,
        });
        if (body && body.t < bestT) {
          bestT = body.t;
          hitBot = bot;
          head = false;
        }
      }
      const wall = rayWorld(ox, oy, oz, dir.x, dir.y, dir.z);
      let hitN: [number, number, number] = [0, 1, 0];
      if (wall && wall.t < bestT) {
        hitN = [wall.nx, wall.ny, wall.nz];
        bestT = wall.t;
        hitBot = null;
        if (pellet < 3) {
          const d = decals[decalI++ % decals.length];
          d.life = 30;
          d.mesh.visible = true;
          const px = ox + dir.x * wall.t;
          const py = oy + dir.y * wall.t;
          const pz = oz + dir.z * wall.t;
          d.mesh.position.set(px + wall.nx * 0.03, py + wall.ny * 0.03, pz + wall.nz * 0.03);
          d.mesh.lookAt(px + wall.nx, py + wall.ny, pz + wall.nz);
        }
      }
      if (pellet === 0 && w.pellets === 1) {
        const tr = tracers[tracerI++ % tracers.length];
        tr.life = 0.07;
        tr.mesh.visible = true;
        const t0 = Math.min(1.4, bestT * 0.5);
        const tl = Math.max(0.01, bestT - t0);
        tr.mesh.scale.set(1, 1, tl);
        const tm = t0 + tl * 0.5;
        tr.mesh.position.set(ox + dir.x * tm, oy + dir.y * tm - 0.06, oz + dir.z * tm);
        tr.mesh.lookAt(ox + dir.x * bestT, oy + dir.y * bestT, oz + dir.z * bestT);
      }
      if (pellet < 2) {
        const hx = ox + dir.x * bestT;
        const hy = oy + dir.y * bestT;
        const hz = oz + dir.z * bestT;
        if (bestT < 79.9) fx.impact(hx, hy, hz, hitN[0], hitN[1], hitN[2], Boolean(hitBot));
        for (let i = 0; i < 3; i++) {
          const s = sparks[sparkI++ % sparks.length];
          s.life = 0.16 + Math.random() * 0.1;
          s.mesh.visible = true;
          s.mesh.position.set(hx, hy, hz);
          s.vx = (Math.random() - 0.5) * 3;
          s.vy = Math.random() * 2.5;
          s.vz = (Math.random() - 0.5) * 3;
        }
      }
      if (hitBot) {
        const fall = bestT > w.fallStart ? clamp(1 - (bestT - w.fallStart) / w.fallDist, w.fallMin, 1) : 1;
        const dmg = (head ? w.head : w.damage) * fall;
        const prev = landed.get(hitBot);
        landed.set(hitBot, { dmg: (prev?.dmg ?? 0) + dmg, head: head || Boolean(prev?.head) });
      }
    }
    if (net?.role === "guest") {
      const hits = [...landed.entries()].map(([bot, hit]) => ({ id: bot.id, dmg: hit.dmg, head: hit.head }));
      if (hits.length) net.send({ t: "hit", hits });
    } else {
      for (const [bot, hit] of landed) hurtBot(bot, hit.dmg, hit.head);
    }
    for (const bot of bots) {
      if (!bot.alive) continue;
      const d = Math.hypot(bot.x - player.x, bot.z - player.z);
      if (d < 26) {
        bot.alert = Math.max(bot.alert, 1.8);
        bot.lx = player.x;
        bot.lz = player.z;
      }
    }
    const rx = Math.cos(player.yaw);
    const rz = -Math.sin(player.yaw);
    const shell = shells[shellI++ % shells.length];
    shell.life = 0.8;
    shell.mesh.visible = true;
    shell.mesh.position.set(player.x + rx * 0.28, eyeY() - 0.2, player.z + rz * 0.28);
    shell.vx = rx * 2.4;
    shell.vy = 1.8;
    shell.vz = rz * 2.4;
    shell.mesh.scale.setScalar(w.id === "shot" ? 1.6 : w.id === "pistol" ? 0.7 : 1);
    if (player.mag <= 0 && player.reserve > 0) beginReload();
  }

  function beginReload() {
    const w = liveWeapon();
    if (player.reload > 0 || player.mag >= w.magSize || player.reserve <= 0 || player.down > 0 || player.draw > 0) return;
    player.reload = w.reloadTime;
    audio.reload();
  }

  function enemyShoot(bot: Bot, dist: number) {
    const ox = bot.x;
    const oy = 1.45;
    const oz = bot.z;
    const tx = player.x;
    const ty = player.y + lerp(1.15, 0.75, player.crouch);
    const tz = player.z;
    let dx = tx - ox;
    let dy = ty - oy;
    let dz = tz - oz;
    const len = Math.hypot(dx, dy, dz) || 1;
    dx /= len;
    dy /= len;
    dz /= len;
    const tune = diffMul();
    const spread = (0.04 + dist * 0.0022) * tune.spread;
    const dir = jitter(dx, dy, dz, spread);
    const wall = rayWorld(ox, oy, oz, dir.x, dir.y, dir.z);
    let pHit: number | null = null;
    let head = false;
    const hs = raySphere(ox, oy, oz, dir.x, dir.y, dir.z, player.x, eyeY(), player.z, 0.18);
    if (hs !== null) {
      pHit = hs;
      head = true;
    }
    const body = rayBox(ox, oy, oz, dir.x, dir.y, dir.z, {
      minX: player.x - 0.36,
      maxX: player.x + 0.36,
      minY: player.y + 0.35,
      maxY: eyeY() - 0.05,
      minZ: player.z - 0.36,
      maxZ: player.z + 0.36,
    });
    if (body && (pHit === null || body.t < pHit)) {
      pHit = body.t;
      head = false;
    }
    if (pHit !== null && (!wall || pHit < wall.t)) damagePlayer((head ? 16 : 8) * tune.dmg, head, bot.x, bot.z);
    const fx = -Math.sin(bot.yaw);
    const fz = -Math.cos(bot.yaw);
    enemyMuzzle.position.set(bot.x + fx * 0.6, 1.32, bot.z + fz * 0.6);
    enemyMuzzle.visible = true;
    muzzleLife = 0.05;
    const rdx = bot.x - player.x;
    const rdz = bot.z - player.z;
    const rd = Math.hypot(rdx, rdz);
    const rightx = Math.cos(player.yaw);
    const rightz = -Math.sin(player.yaw);
    const pan = clamp((rdx * rightx + rdz * rightz) / (rd + 0.001), -1, 1);
    audio.shot(Math.min(1, 9 / (rd + 3)) * 0.55, pan);
  }

  function updatePlayer(dt: number) {
    player.invuln = Math.max(0, player.invuln - dt);
    player.recoilP = lerp(player.recoilP, 0, 1 - Math.exp(-7 * dt));
    player.recoilY = lerp(player.recoilY, 0, 1 - Math.exp(-7 * dt));
    player.spray = Math.max(0, player.spray - dt * 2.1);
    gunKick = Math.max(0, gunKick - dt * 8);
    if (player.down > 0) {
      player.down -= dt;
      player.vx *= Math.max(0, 1 - dt * 6);
      player.vz *= Math.max(0, 1 - dt * 6);
      player.pitch = lerp(player.pitch, -0.9, 1 - Math.exp(-3 * dt));
      if (player.down <= 0) respawnPlayer();
      return;
    }
    const adsTarget = adsHeld ? 1 : 0;
    player.ads = lerp(player.ads, adsTarget, 1 - Math.exp(-12 * dt));
    const crouchTarget = keysWantCrouch() || crouchToggle ? 1 : 0;
    player.crouch = lerp(player.crouch, crouchTarget, 1 - Math.exp(-10 * dt));

    let forward = 0;
    let strafe = 0;
    if (held("KeyW") || held("ArrowUp")) forward += 1;
    if (held("KeyS") || held("ArrowDown")) forward -= 1;
    if (held("KeyD") || held("ArrowRight")) strafe += 1;
    if (held("KeyA") || held("ArrowLeft")) strafe -= 1;
    forward += touchY;
    strafe += touchX;
    const il = Math.hypot(forward, strafe);
    if (il > 1) {
      forward /= il;
      strafe /= il;
    }
    const firing = wantFire();
    const sprinting =
      (sprintHeld || held("ShiftLeft") || held("ShiftRight")) &&
      forward > 0.5 &&
      player.crouch < 0.35 &&
      player.ads < 0.25 &&
      player.grounded &&
      !firing;
    const speed = player.crouch > 0.5 ? 2.65 : sprinting ? 7.25 : player.ads > 0.45 ? 3.25 : 5.2;
    const yaw = player.yaw;
    const fx = -Math.sin(yaw);
    const fz = -Math.cos(yaw);
    const rx = Math.cos(yaw);
    const rz = -Math.sin(yaw);
    let wx = fx * forward + rx * strafe;
    let wz = fz * forward + rz * strafe;
    const wl = Math.hypot(wx, wz);
    if (wl > 0) {
      wx /= wl;
      wz /= wl;
    }
    if (player.grounded) {
      const sp = Math.hypot(player.vx, player.vz);
      if (sp > 0) {
        const drop = Math.max(sp, 1.5) * 9.5 * dt;
        const ns = Math.max(0, sp - drop);
        player.vx = (player.vx / sp) * ns;
        player.vz = (player.vz / sp) * ns;
      }
      if (wl > 0) {
        const current = player.vx * wx + player.vz * wz;
        const add = speed - current;
        if (add > 0) {
          let accel = 46 * dt * speed;
          if (accel > add) accel = add;
          player.vx += wx * accel;
          player.vz += wz * accel;
        }
      }
    } else {
      player.vy -= 19.5 * dt;
      if (wl > 0) {
        player.vx += wx * 10 * dt;
        player.vz += wz * 10 * dt;
        const sp = Math.hypot(player.vx, player.vz);
        const cap = 7.4;
        if (sp > cap) {
          player.vx = (player.vx / sp) * cap;
          player.vz = (player.vz / sp) * cap;
        }
      }
    }
    const step = moveCircle(player.x, player.z, player.vx * dt, player.vz * dt, 0.34);
    player.x = step.x;
    player.z = step.z;
    if (!player.grounded) {
      player.y += player.vy * dt;
      if (player.y <= 0) {
        player.y = 0;
        player.vy = 0;
        player.grounded = true;
      }
    }
    if (jumpQueued && player.grounded) {
      player.vy = 6.45;
      player.grounded = false;
      player.y = 0.02;
    }
    jumpQueued = false;
    const moving = Math.hypot(player.vx, player.vz);
    if (player.grounded && moving > 0.6) player.bob += dt * moving * 2.15;
    if (player.draw > 0) player.draw = Math.max(0, player.draw - dt);

    const reloadEdge = held("KeyR") || false;
    if (reloadEdge && !prevReload) beginReload();
    prevReload = reloadEdge;
    if (player.reload > 0) {
      player.reload -= dt;
      if (player.reload <= 0) {
        const need = liveWeapon().magSize - player.mag;
        const take = Math.min(need, player.reserve);
        player.mag += take;
        player.reserve -= take;
        player.reload = 0;
        pushAmmo();
      }
    }
    const w = liveWeapon();
    const trigger = w.auto ? firing : firing && !semiLatch;
    if (!firing) semiLatch = false;
    if (trigger && player.reload <= 0 && player.draw <= 0) {
      if (!w.auto) semiLatch = true;
      if (player.mag <= 0) {
        if (!emptyLatch) {
          emptyLatch = true;
          if (player.reserve > 0) beginReload();
          else audio.empty();
        }
      } else if (simT >= player.nextShot) {
        emptyLatch = false;
        shoot();
        player.nextShot = simT + w.interval;
      }
    } else if (!firing) {
      emptyLatch = false;
    }
  }

  function updateBases(dt: number) {
    for (const base of bases) {
      const pIn = humanIn(base);
      let eIn = false;
      for (const bot of bots) {
        if (bot.enabled && bot.alive && Math.hypot(bot.x - base.x, bot.z - base.z) < base.r) eIn = true;
      }
      const prev = base.p;
      if (pIn && !eIn) base.p = Math.min(100, base.p + 20 * dt);
      else if (eIn && !pIn) base.p = Math.max(0, base.p - 14 * dt);
      if (!base.half && prev < 50 && base.p >= 50) {
        base.half = true;
        audio.blip();
      }
      if (base.p < 40) base.half = false;
      if (!base.held && base.p >= 100) {
        base.held = true;
        say(`BASE ${base === bases[0] ? "ALFA" : "BRAVO"} ASEGURADA`, 2.2);
        audio.secure();
      }
      if (base.p < 98) base.held = false;
    }
    if (bases[0].p >= 100 && bases[1].p >= 100) finish("win", "Las dos bases son del equipo.");
  }

  function shootAlly(bot: Bot, dist: number) {
    if (net?.role !== "host" || !remote.alive) return;
    const tune = diffMul();
    const ox = bot.x;
    const oy = 1.45;
    const oz = bot.z;
    let dx = remote.x - ox;
    let dy = 1.25 - oy;
    let dz = remote.z - oz;
    const len = Math.hypot(dx, dy, dz) || 1;
    dx /= len;
    dy /= len;
    dz /= len;
    const dir = jitter(dx, dy, dz, (0.045 + dist * 0.0022) * tune.spread);
    const wall = rayWorld(ox, oy, oz, dir.x, dir.y, dir.z);
    let pHit: number | null = null;
    let head = false;
    const hs = raySphere(ox, oy, oz, dir.x, dir.y, dir.z, remote.x, 1.55, remote.z, 0.18);
    if (hs !== null) {
      pHit = hs;
      head = true;
    }
    const body = rayBox(ox, oy, oz, dir.x, dir.y, dir.z, {
      minX: remote.x - 0.36,
      maxX: remote.x + 0.36,
      minY: 0.35,
      maxY: 1.45,
      minZ: remote.z - 0.36,
      maxZ: remote.z + 0.36,
    });
    if (body && (pHit === null || body.t < pHit)) {
      pHit = body.t;
      head = false;
    }
    if (pHit !== null && (!wall || pHit < wall.t)) {
      net.send({ t: "pain", dmg: (head ? 16 : 8) * tune.dmg, head, x: bot.x, z: bot.z });
    }
    const fx = -Math.sin(bot.yaw);
    const fz = -Math.cos(bot.yaw);
    enemyMuzzle.position.set(bot.x + fx * 0.6, 1.32, bot.z + fz * 0.6);
    enemyMuzzle.visible = true;
    muzzleLife = 0.05;
  }

  function updateBot(bot: Bot, dt: number) {
    if (!bot.enabled) {
      bot.group.visible = false;
      return;
    }
    if (!bot.alive) {
      bot.respawn -= dt;
      if (bot.respawn <= 0) {
        bot.alive = true;
        bot.hp = 100;
        bot.x = bot.spawnX;
        bot.z = bot.spawnZ;
        bot.alert = 0;
        bot.group.visible = true;
      }
      return;
    }
    const seePlayer = canSee(bot);
    const dist = Math.hypot(player.x - bot.x, player.z - bot.z);
    const allyDist = remote.alive && remote.seen ? Math.hypot(remote.x - bot.x, remote.z - bot.z) : 999;
    let aimAlly = false;
    if (remote.alive && remote.seen && allyDist < 32 && (!seePlayer || allyDist < dist)) {
      let dx = remote.x - bot.x;
      let dy = 1.4 - 1.5;
      let dz = remote.z - bot.z;
      const len = Math.hypot(dx, dy, dz) || 1;
      dx /= len;
      dy /= len;
      dz /= len;
      const wall = rayWorld(bot.x, 1.5, bot.z, dx, dy, dz);
      if (!wall || wall.t > allyDist - 0.45) aimAlly = true;
    }
    const see = seePlayer || aimAlly;
    if (see) {
      if (bot.alert <= 0) bot.react = diffMul().react;
      bot.alert = 2.6;
      bot.lx = aimAlly ? remote.x : player.x;
      bot.lz = aimAlly ? remote.z : player.z;
    } else bot.alert = Math.max(0, bot.alert - dt);
    bot.react = Math.max(0, bot.react - dt);
    bot.cooldown = Math.max(0, bot.cooldown - dt);
    const base = bases[bot.home];
    let tx: number;
    let tz: number;
    if (bot.alert > 0) {
      tx = bot.lx;
      tz = bot.lz;
    } else if (base.p > 10 && base.p < 100) {
      tx = base.x;
      tz = base.z;
    } else {
      const wps = ways[bot.home];
      const w = wps[bot.wp];
      tx = w[0];
      tz = w[1];
      if (Math.hypot(bot.x - tx, bot.z - tz) < 1.15) bot.wp = (bot.wp + 1) % wps.length;
    }
    let dx = tx - bot.x;
    let dz = tz - bot.z;
    let dl = Math.hypot(dx, dz) || 1;
    dx /= dl;
    dz /= dl;
    for (const other of bots) {
      if (other === bot || !other.alive) continue;
      const sx = bot.x - other.x;
      const sz = bot.z - other.z;
      const sl = Math.hypot(sx, sz);
      if (sl > 0.001 && sl < 1.3) {
        dx += (sx / sl) * 1.1;
        dz += (sz / sl) * 1.1;
      }
    }
    if (bot.nudge > 0) {
      bot.nudge -= dt;
      dx += -dz * bot.side;
      dz += dx * bot.side * 0.2;
    }
    const len = Math.hypot(dx, dz) || 1;
    dx /= len;
    dz /= len;
    if (see && dist < 8) {
      const strafe = Math.sin(simT * 1.8 + bot.id * 2);
      const px = -dz;
      const pz = dx;
      dx = dx * 0.25 + px * strafe;
      dz = dz * 0.25 + pz * strafe;
      const l2 = Math.hypot(dx, dz) || 1;
      dx /= l2;
      dz /= l2;
    }
    const speed = (see ? 4.5 : 3.15) * ((frost.get(bot) ?? 0) > 0 ? 0.5 : 1);
    const beforeX = bot.x;
    const beforeZ = bot.z;
    const moved = moveCircle(bot.x, bot.z, dx * speed * dt, dz * speed * dt, 0.36);
    bot.x = moved.x;
    bot.z = moved.z;
    bot.vx = (bot.x - beforeX) / dt;
    bot.vz = (bot.z - beforeZ) / dt;
    const travelled = Math.hypot(bot.x - beforeX, bot.z - beforeZ);
    if (travelled < 0.004 && dl > 1.2) bot.stuck += dt;
    else bot.stuck = 0;
    if (bot.stuck > 0.55) {
      bot.stuck = 0;
      bot.side *= -1;
      bot.nudge = 0.45;
      bot.wp = (bot.wp + 1) % ways[bot.home].length;
    }
    const faceX = see ? (aimAlly ? remote.x : player.x) - bot.x : dx;
    const faceZ = see ? (aimAlly ? remote.z : player.z) - bot.z : dz;
    const desired = Math.atan2(-faceX, -faceZ);
    bot.yaw = dampAngle(bot.yaw, desired, dt, see ? 8 : 5);
    bot.walk += travelled * 9;
    if (see && bot.react <= 0 && bot.cooldown <= 0 && (aimAlly ? allyDist : dist) < 34) {
      bot.cooldown = (0.42 + Math.random() * 0.22) * diffMul().cool;
      if (aimAlly) shootAlly(bot, allyDist);
      else enemyShoot(bot, dist);
    }
  }

  function updateEffects(dt: number) {
    for (const s of shells) {
      if (s.life <= 0) continue;
      s.life -= dt;
      s.vy -= 12 * dt;
      s.mesh.position.x += s.vx * dt;
      s.mesh.position.y += s.vy * dt;
      s.mesh.position.z += s.vz * dt;
      s.mesh.rotation.x += dt * 9;
      s.mesh.rotation.z += dt * 6;
      if (s.mesh.position.y < 0.03) {
        s.mesh.position.y = 0.03;
        s.vy *= -0.28;
        s.vx *= 0.55;
        s.vz *= 0.55;
      }
      if (s.life <= 0) s.mesh.visible = false;
    }
    for (const s of sparks) {
      if (s.life <= 0) continue;
      s.life -= dt;
      s.vy -= 10 * dt;
      s.mesh.position.x += s.vx * dt;
      s.mesh.position.y += s.vy * dt;
      s.mesh.position.z += s.vz * dt;
      if (s.life <= 0) s.mesh.visible = false;
    }
    for (const t of tracers) {
      if (t.life <= 0) continue;
      t.life -= dt;
      if (t.life <= 0) t.mesh.visible = false;
    }
    muzzleLife -= dt;
    if (muzzleLife <= 0) enemyMuzzle.visible = false;
    bannerT = Math.max(0, bannerT - dt);
    hurt = Math.max(0, hurt - dt * 1.5);
    hurtN = Math.max(0, hurtN - dt * 1.8);
    hurtE = Math.max(0, hurtE - dt * 1.8);
    hurtS = Math.max(0, hurtS - dt * 1.8);
    hurtW = Math.max(0, hurtW - dt * 1.8);
    hitAlpha = Math.max(0, hitAlpha - dt * 4.5);
    shake = Math.max(0, shake - dt * 4.5);
  }

  function sim(dt: number) {
    simT += dt;
    if (net?.role !== "guest") timer -= dt;
    updatePlayer(dt);
    if (phase !== "play") return;
    if (net?.role === "guest") {
      updateEffects(dt);
      return;
    }
    updateBases(dt);
    if (phase !== "play") return;
    for (const bot of bots) updateBot(bot, dt);
    updateEffects(dt);
    if (phase === "play" && timer <= 0) finish("lose", "Se agotó el tiempo. Faltó una base.");
  }

  function poseBot(bot: Bot, idle: boolean) {
    if (!bot.enabled || !bot.alive) {
      bot.group.visible = false;
      return;
    }
    bot.group.visible = true;
    bot.group.position.set(bot.x, 0, bot.z);
    bot.group.rotation.y = bot.yaw;
    const swing = idle ? Math.sin(simT * 1.6 + bot.id) * 0.06 : Math.sin(bot.walk) * 0.7;
    bot.legL.rotation.x = swing;
    bot.legR.rotation.x = -swing;
    bot.armL.rotation.x = idle ? 0.15 : -swing * 0.45;
    bot.armR.rotation.x = bot.alert > 0 ? 1.25 : 0.55;
    const e = bot.flash > 0 ? bot.flash / 0.12 : 0;
    for (const m of bot.bodyMats) m.emissive.setRGB(e, e * 0.25, e * 0.12);
    if (bot.flash > 0) bot.flash = Math.max(0, bot.flash - 0.016);
  }

  function zoneColor(p: number, contested: boolean) {
    const c = new THREE.Color();
    if (contested) {
      const f = 0.5 + Math.sin(simT * 10) * 0.5;
      c.setRGB(lerp(0.85, 0.95, f), lerp(0.45, 0.85, f), lerp(0.2, 0.3, f));
      return c;
    }
    const t = p / 100;
    c.setRGB(lerp(0.24, 0.89, t), lerp(0.72, 0.64, t), lerp(0.7, 0.13, t));
    return c;
  }

  function updateZones() {
    for (const base of bases) {
      let eIn = false;
      for (const bot of bots) {
        if (bot.enabled && bot.alive && Math.hypot(bot.x - base.x, bot.z - base.z) < base.r) eIn = true;
      }
      const pIn = humanIn(base);
      const contested = pIn && eIn && phase === "play";
      const col = zoneColor(base.p, contested);
      (base.ring.material as THREE.MeshBasicMaterial).color.copy(col);
      (base.disc.material as THREE.MeshBasicMaterial).color.copy(col);
      (base.beam.material as THREE.MeshBasicMaterial).color.copy(col);
      base.light.color.copy(col);
      base.light.intensity = 0.55 + Math.sin(simT * (contested ? 14 : 2) + base.x) * (contested ? 0.45 : 0.08);
      base.sign.lookAt(camera.position.x, base.sign.position.y, camera.position.z);
    }
  }

  function paintHud(dt: number) {
    for (const [b, t] of frost) if (t - dt <= 0) frost.delete(b); else frost.set(b, t - dt);
    if (frostPts && frostPts.parent?.visible) {
      const a = frostPts.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < a.count; i++) {
        let y = a.getY(i) + dt * (0.03 + (i % 5) * 0.012);
        if (y > 0.16) y = -0.02;
        a.setY(i, y);
        a.setX(i, a.getX(i) + Math.sin(performance.now() * 0.002 + i) * dt * 0.01);
      }
      a.needsUpdate = true;
    }
    shieldT = Math.max(0, shieldT - dt);
    radarT = Math.max(0, radarT - dt);
    if (dashT > 0 && phase === "play") {
      const st = Math.min(dt, dashT);
      dashT -= st;
      const f = forwardOf(player.yaw, 0);
      const m = moveCircle(player.x, player.z, f.x * 22 * st, f.z * 22 * st, 0.38);
      player.x = m.x;
      player.z = m.z;
    }
    if (phase === "play") for (const a of abils) a.cd = Math.max(0, a.cd - dt);
    const playing = phase === "play" || phase === "pause";
    hud.root.classList.toggle("hidden", !playing);
    setText(hud.hp, String(Math.max(0, Math.ceil(player.hp))));
    hud.hp.classList.toggle("is-low", player.hp < 35);
    setText(hud.armor, String(Math.max(0, Math.ceil(player.armor))));
    setText(hud.weaponName, `${liveWeapon().name} · ${liveWeapon().blurb}`);
    const slotNodes = hud.slots.children;
    for (let i = 0; i < slotNodes.length; i++) slotNodes[i].classList.toggle("is-on", i === slot);
    setText(hud.mag, player.reload > 0 ? "—" : String(player.mag));
    setText(hud.reserve, String(player.reserve));
    setText(hud.timer, fmtTime(timer));
    setText(hud.kills, `${player.kills} / ${player.deaths}`);
    hud.alfaFill.style.transform = `scaleX(${bases[0].p / 100})`;
    hud.bravoFill.style.transform = `scaleX(${bases[1].p / 100})`;
    const stateOf = (p: number, contested: boolean) =>
      contested ? "CONTESTADA" : p >= 100 ? "TUYA" : p <= 1 ? "HOSTIL" : "CAPTURANDO";
    const contest = (base: (typeof bases)[0]) => {
      if (phase !== "play" || !player.alive) return false;
      const pIn = humanIn(base);
      let eIn = false;
      for (const bot of bots) if (bot.alive && Math.hypot(bot.x - base.x, bot.z - base.z) < base.r) eIn = true;
      return pIn && eIn;
    };
    setText(hud.alfaState, stateOf(bases[0].p, contest(bases[0])));
    setText(hud.bravoState, stateOf(bases[1].p, contest(bases[1])));
    setText(hud.banner, bannerT > 0 ? banner : "");
    hud.banner.style.opacity = bannerT > 0 ? "1" : "0";
    setText(hud.feed, feed.join("\n"));
    const qName = quality === 2 ? "ALTO" : quality === 1 ? "MEDIO" : "BAJO";
    setText(hud.fps, `${Math.round(fps)} FPS · ${qName}`);
    setText(hud.quality, qName);
    const spreadNow = aimSpread();
    hud.cross.style.setProperty("--gap", `${5 + spreadNow * 220}px`);
    const scoped = liveWeapon().id === "dmr" && player.ads > 0.62 && phase === "play";
    hud.cross.style.opacity = scoped || player.ads > 0.72 ? "0" : "0.92";
    hud.scope.style.opacity = scoped ? String(Math.min(1, (player.ads - 0.62) / 0.25)) : "0";
    hud.cross.classList.toggle("is-hit", hitAlpha > 0 && !hitHead);
    hud.cross.classList.toggle("is-head", hitAlpha > 0 && hitHead);
    hud.hit.style.opacity = String(hitAlpha);
    hud.hit.classList.toggle("is-head", hitHead);
    hud.hurt.style.opacity = String(hurt * 0.8);
    hud.dmgN.style.opacity = String(hurt * hurtN);
    hud.dmgE.style.opacity = String(hurt * hurtE);
    hud.dmgS.style.opacity = String(hurt * hurtS);
    hud.dmgW.style.opacity = String(hurt * hurtW);
    const reloadP = player.reload > 0 ? 1 - player.reload / liveWeapon().reloadTime : 0;
    hud.reloadBar.style.transform = `scaleX(${reloadP})`;
    hud.reloadBar.style.opacity = player.reload > 0 ? "1" : "0";
    fpsAcc += dt;
    fpsFrames += 1;
    if (fpsAcc >= 0.35) {
      fps = fpsFrames / fpsAcc;
      fpsFrames = 0;
      fpsAcc = 0;
      if (performance.now() - boot > 2800) {
        fpsSamples.push(fps);
        if (fpsSamples.length > 8) fpsSamples.shift();
        const avg = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
        if (qualityPref === "auto" && avg < 52 && quality > 0 && performance.now() - lastDrop > 2200) {
          quality -= 1;
          lastDrop = performance.now();
          fpsSamples.length = 0;
          applyQuality();
        }
      }
    }
    drawMap();
  }

  function drawMap() {
    const map = hud.minimap;
    const ctx = map.getContext("2d");
    if (!ctx) return;
    if (map.width !== 180) {
      map.width = 180;
      map.height = 180;
    }
    const w = map.width;
    const h = map.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(20,24,16,0.72)";
    ctx.fillRect(0, 0, w, h);
    const project = (x: number, z: number) => ({
      px: ((x + activeMap.mini.ox) / activeMap.mini.w) * w,
      py: ((z + activeMap.mini.oz) / activeMap.mini.h) * h,
    });
    ctx.fillStyle = "rgba(243,236,220,0.18)";
    for (const b of colliders) {
      if (b.maxY < 0.8) continue;
      const a = project(b.minX, b.minZ);
      const c = project(b.maxX, b.maxZ);
      ctx.fillRect(a.px, a.py, c.px - a.px, c.py - a.py);
    }
    for (const base of bases) {
      const p = project(base.x, base.z);
      ctx.beginPath();
      ctx.arc(p.px, p.py, 10, 0, Math.PI * 2);
      ctx.fillStyle = base.p >= 100 ? "rgba(226,163,34,0.9)" : "rgba(60,184,178,0.85)";
      ctx.fill();
    }
    for (const bot of bots) {
      if (!bot.enabled || !bot.alive) continue;
      if (radarT <= 0 && Math.hypot(bot.x - player.x, bot.z - player.z) > 24 && phase === "play") continue;
      const p = project(bot.x, bot.z);
      ctx.fillStyle = "#9ff4ef";
      ctx.fillRect(p.px - 2, p.py - 2, 4, 4);
    }
    if (remote.seen && remote.alive) {
      const ap = project(remote.x, remote.z);
      ctx.fillStyle = "#7dffb2";
      ctx.fillRect(ap.px - 2, ap.py - 2, 5, 5);
    }
    const pp = project(player.x, player.z);
    ctx.save();
    ctx.translate(pp.px, pp.py);
    const ang = Math.atan2(-Math.cos(player.yaw), -Math.sin(player.yaw));
    ctx.rotate(ang);
    ctx.fillStyle = "#e2a322";
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(-5, 4.5);
    ctx.lineTo(-5, -4.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "rgba(243,236,220,0.35)";
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
  }

  function render(dt: number) {
    if (remote.seen) {
      const k = 1 - Math.exp(-14 * Math.max(dt, 0.001));
      remote.x = lerp(remote.x, remote.tx, k);
      remote.y = lerp(remote.y, remote.ty, k);
      remote.z = lerp(remote.z, remote.tz, k);
      remote.yaw = dampAngle(remote.yaw, remote.tyaw, Math.max(dt, 0.016), 12);
      ally.visible = remote.alive && phase !== "menu";
      ally.position.set(remote.x, 0, remote.z);
      ally.rotation.y = remote.yaw;
    } else ally.visible = false;
    if (phase === "menu") {
      orbit += dt * 0.13;
      camera.position.set(Math.sin(orbit) * 30, 13.5, Math.cos(orbit) * 24);
      camera.lookAt(0, 1.2, -2);
      for (const bot of bots) poseBot(bot, true);
    } else {
      const bobY = Math.sin(player.bob) * (player.crouch > 0.5 ? 0.012 : 0.045);
      const bobX = Math.cos(player.bob * 0.5) * 0.02 * (1 - player.crouch);
      const rx = Math.cos(player.yaw);
      const rz = -Math.sin(player.yaw);
      const sh = shake * 0.03;
      camera.position.set(
        player.x + rx * bobX + (Math.random() - 0.5) * sh,
        eyeY() + bobY + (Math.random() - 0.5) * sh,
        player.z + rz * bobX + (Math.random() - 0.5) * sh,
      );
      camera.rotation.y = player.yaw + player.recoilY;
      camera.rotation.x = player.pitch + player.recoilP;
      camera.rotation.z = Math.sin(player.bob * 0.5) * 0.012 * (1 - player.crouch);
      const wpn = liveWeapon();
      const targetFov = lerp(baseFov, wpn.adsFov, player.ads);
      if (Math.abs(camera.fov - targetFov) > 0.05) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
        viewCamera.fov = targetFov;
        viewCamera.updateProjectionMatrix();
      }
      for (const bot of bots) poseBot(bot, Math.hypot(bot.vx, bot.vz) < 0.4);
      const a = player.ads;
      const drawK = player.draw > 0 ? player.draw / wpn.draw : 0;
      gunRoot.position.set(
        lerp(0.24, 0, a) + swayX,
        lerp(-0.26, -0.2, a) + bobY * 0.8 + swayY - drawK * 0.2,
        lerp(-0.5, -0.38, a) - gunKick * 0.08 - drawK * 0.16,
      );
      gunRoot.rotation.set(player.recoilP * 0.4 + swayY, swayX * 0.8, -swayX * 0.5);
      const gun = guns[mdl(wep)];
      if (gun.mag) {
        const rt = wpn.reloadTime;
        const t = player.reload > 0 ? Math.sin((player.reload / rt) * Math.PI) : 0;
        if (gun.pump) gun.mag.position.z = gun.rest + t * 0.14;
        else gun.mag.position.y = gun.rest - t * 0.16;
      }
      gun.flash.visible = flashLife > 0;
      flashLife = Math.max(0, flashLife - dt);
      swayX *= Math.exp(-8 * dt);
      swayY *= Math.exp(-8 * dt);
    }
    updateZones();
    const dustArr = dust.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < 80; i++) {
      let y = dustArr.getY(i) + dt * 0.15;
      if (y > 3.6) y = 0.3;
      dustArr.setY(i, y);
    }
    dustArr.needsUpdate = true;
    fx.update(dt);
    fx.setHurt(phase === "menu" ? 0 : Math.min(1, hurt));
    renderer.autoClear = true;
    fx.render();
    if (phase !== "menu") {
      renderer.autoClear = false;
      renderer.clearDepth();
      renderer.render(viewScene, viewCamera);
      renderer.autoClear = true;
    }
    paintHud(dt);
  }

  function applyLook() {
    if (phase !== "play" || player.down > 0) {
      lookDX = 0;
      lookDY = 0;
      return;
    }
    const sens = baseSens * (1 - player.ads * 0.45);
    player.yaw -= lookDX * sens;
    player.pitch = clamp(player.pitch - lookDY * sens, -PITCH_LIMIT, PITCH_LIMIT);
    swayX = clamp(swayX - lookDX * 0.0016, -0.09, 0.09);
    swayY = clamp(swayY + lookDY * 0.0008, -0.05, 0.05);
    lookDX = 0;
    lookDY = 0;
  }

  function applyQuality() {
    const cap = quality === 2 ? (qualityPref === "realista" ? 1.75 : 1.5) : quality === 1 ? 1.15 : 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
    sun.castShadow = quality > 0;
    renderer.shadowMap.enabled = quality > 0;
    if (quality > 0) {
      const size = quality === 2 ? (qualityPref === "realista" ? 2048 : 1024) : 512;
      sun.shadow.mapSize.set(size, size);
      if (sun.shadow.map) {
        sun.shadow.map.dispose();
        (sun.shadow as { map: THREE.WebGLRenderTarget | null }).map = null;
      }
    }
    for (const mesh of shadowMeshes) mesh.castShadow = quality > 0;
    fx.setPost(quality === 2);
    fx.setLow(quality === 0);
    resize();
  }

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    if (w < 2 || h < 2) return;
    renderer.setSize(w, h, false);
    fx.resize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    viewCamera.aspect = w / h;
    viewCamera.updateProjectionMatrix();
  }

  function publishNet(dt: number) {
    if (!net || phase !== "play") return;
    netAcc += dt;
    if (netAcc < 0.07) return;
    netAcc = 0;
    const msg: Record<string, unknown> = {
      t: "st",
      x: player.x,
      y: player.y,
      z: player.z,
      yaw: player.yaw,
      pitch: player.pitch,
      hp: player.hp,
      alive: player.alive && player.down <= 0,
    };
    if (net.role === "host") {
      msg.timer = timer;
      msg.bases = [bases[0].p, bases[1].p];
      msg.bots = bots.map((b) => ({
        x: b.x,
        z: b.z,
        yaw: b.yaw,
        hp: b.hp,
        a: b.alive && b.enabled ? 1 : 0,
      }));
    }
    net.broadcast(msg);
  }

  function ingest(msg: unknown, from?: string) {
    if (!msg || typeof msg !== "object") return;
    const m = msg as Record<string, unknown>;
    if (from && !allyId) {
      allyId = from;
      remote.name = typeof m.name === "string" ? m.name : remote.name;
    }
    if (from && allyId && from !== allyId && m.t !== "go") return;
    if (m.t === "st") {
      remote.tx = Number(m.x) || 0;
      remote.ty = Number(m.y) || 0;
      remote.tz = Number(m.z) || 0;
      remote.tyaw = Number(m.yaw) || 0;
      remote.alive = Boolean(m.alive);
      remote.seen = true;
      if (net?.role === "guest") {
        if (typeof m.timer === "number") timer = m.timer;
        if (Array.isArray(m.bases) && m.bases.length === 2) {
          const prevA = bases[0].p;
          const prevB = bases[1].p;
          bases[0].p = Number(m.bases[0]) || 0;
          bases[1].p = Number(m.bases[1]) || 0;
          if (prevA < 100 && bases[0].p >= 100) {
            say("BASE ALFA ASEGURADA", 2);
            audio.secure();
          }
          if (prevB < 100 && bases[1].p >= 100) {
            say("BASE BRAVO ASEGURADA", 2);
            audio.secure();
          }
        }
        if (Array.isArray(m.bots)) {
          m.bots.forEach((raw, i) => {
            const bot = bots[i];
            const row = raw as { x: number; z: number; yaw: number; hp: number; a: number };
            if (!bot || !row) return;
            bot.x = row.x;
            bot.z = row.z;
            bot.yaw = row.yaw;
            bot.hp = row.hp;
            bot.alive = row.a === 1;
            bot.enabled = i < botCount;
          });
        }
      }
      return;
    }
    if (m.t === "go" && net?.role === "guest") {
      const id = m.map;
      if (id === "complejo" || id === "deposito" || id === "muelle") {
        botCount = m.bots === 4 || m.bots === 8 ? Number(m.bots) : 6;
        diff = m.diff === "recluta" || m.diff === "veterano" ? m.diff : "regular";
        save.map = id;
        writeSave(save);
        rebuildLevel(MAPS[id]);
      }
      resetRound();
      hadLock = false;
      setPhase("play");
      requestLock();
      return;
    }
    if (m.t === "hit" && net && net.role === "host" && Array.isArray(m.hits)) {
      let any = false;
      let head = false;
      for (const raw of m.hits) {
        const hit = raw as { id: number; dmg: number; head: boolean };
        const bot = bots[hit.id];
        if (!bot) continue;
        const before = bot.hp;
        hurtBot(bot, Number(hit.dmg) || 0, Boolean(hit.head), "ally");
        if (bot.hp < before) any = true;
        head = head || Boolean(hit.head);
      }
      if (any) net.send({ t: "mark", head });
      return;
    }
    if (m.t === "mark") {
      hitAlpha = 1;
      hitHead = Boolean(m.head);
      audio.hit(Boolean(m.head));
      return;
    }
    if (m.t === "pain") {
      damagePlayer(Number(m.dmg) || 8, Boolean(m.head), Number(m.x) || 0, Number(m.z) || 0);
      return;
    }
    if (m.t === "end" && net?.role === "guest") {
      finish(m.result === "win" ? "win" : "lose", String(m.why || ""), true);
    }
  }

  function frame(now: number) {
    if (disposed) return;
    const dt = Math.min(0.05, (now - last) / 1000) || 0;
    last = now;
    if (phase === "menu") {
      render(dt);
    } else if (phase === "play") {
      applyLook();
      acc += dt;
      let steps = 0;
      while (acc >= STEP && steps < 3) {
        sim(STEP);
        acc -= STEP;
        steps += 1;
      }
      if (acc > STEP) acc = 0;
      render(dt);
      publishNet(dt);
    } else {
      lookDX = 0;
      lookDY = 0;
      render(0);
    }
    raf = requestAnimationFrame(frame);
  }

  function held(code: string) {
    if (qaKeys) return qaKeys.has(code);
    return keys.has(code);
  }

  function keysWantCrouch() {
    return held("ControlLeft") || held("ControlRight") || held("KeyC");
  }

  function wantFire() {
    return fireHeld || qaFire || held("Mouse0");
  }

  function onWheel(e: WheelEvent) {
    if (phase !== "play") return;
    e.preventDefault();
    if (performance.now() < wheelLock) return;
    wheelLock = performance.now() + 180;
    selectWeapon(slot + (e.deltaY > 0 ? 1 : -1));
  }

  function onKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
    if (KEYS.has(e.code)) e.preventDefault();
    keys.add(e.code);
    if (e.code === "Space") jumpQueued = true;
    if (phase === "play" && player.down <= 0) {
      if (e.code === "Digit1") selectWeapon(0);
      else if (e.code === "Digit2") selectWeapon(1);
      else if (e.code === "Digit3") selectWeapon(2);
      else if (e.code === "KeyQ") selectWeapon(slot + 1);
      else if (e.code === "KeyE") useAbility(0);
      else if (e.code === "KeyF") useAbility(1);
    }
    if ((e.code === "Escape" || e.code === "KeyP") && phase === "play") {
      pause();
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    keys.delete(e.code);
  }

  function onMouseMove(e: MouseEvent) {
    if (document.pointerLockElement !== canvas) return;
    lookDX += e.movementX;
    lookDY += e.movementY;
  }

  function onMouseDown(e: MouseEvent) {
    if (document.pointerLockElement !== canvas || phase !== "play") return;
    if (e.button === 0) fireHeld = true;
    if (e.button === 2) adsHeld = true;
  }

  function onMouseUp(e: MouseEvent) {
    if (e.button === 0) fireHeld = false;
    if (e.button === 2) adsHeld = false;
  }

  function onLockChange() {
    const locked = document.pointerLockElement === canvas;
    onLock(locked);
    if (qa) return;
    if (locked) {
      hadLock = true;
      if (phase === "pause") setPhase("play");
    } else {
      fireHeld = false;
      adsHeld = false;
      if (hadLock && phase === "play") setPhase("pause");
    }
  }

  function onVis() {
    if (document.visibilityState === "visible") audio.unlock();
    else keys.clear();
  }

  function start() {
    audio.unlock();
    audio.setMuted(save.muted);
    if (net?.role === "guest") return;
    if (net?.role === "host") net.send({ t: "go", map: activeMap.id, diff, bots: botCount });
    resetRound();
    hadLock = false;
    setPhase("play");
    requestLock();
  }

  function pause() {
    if (phase !== "play") return;
    try {
      document.exitPointerLock();
    } catch {
      /* ignore */
    }
    setPhase("pause");
  }

  function resume() {
    if (phase !== "pause") return;
    audio.unlock();
    setPhase("play");
    requestLock();
  }

  function toMenu() {
    try {
      document.exitPointerLock();
    } catch {
      /* ignore */
    }
    hadLock = false;
    setPhase("menu");
  }

  const listeners: [EventTarget, string, EventListener][] = [
    [window, "keydown", onKeyDown as EventListener],
    [window, "keyup", onKeyUp as EventListener],
    [window, "mousemove", onMouseMove as EventListener],
    [window, "mousedown", onMouseDown as EventListener],
    [window, "mouseup", onMouseUp as EventListener],
    [window, "blur", () => keys.clear()],
    [document, "pointerlockchange", onLockChange as EventListener],
    [document, "visibilitychange", onVis as EventListener],
    [window, "resize", resize as EventListener],
    [window, "wheel", onWheel as EventListener],
    [canvas, "contextmenu", ((e: Event) => e.preventDefault()) as EventListener],
  ];
  for (const [target, type, fn] of listeners) {
    if (type === "wheel") target.addEventListener(type, fn, { passive: false });
    else target.addEventListener(type, fn);
  }

  applyQuality();
  if (qualityPref === "rendimiento") quality = 0;
  else if (qualityPref === "realista") quality = 2;
  applyQuality();
  resize();
  audio.setMuted(save.muted);
  audio.setVolume(save.volume);
  let raf = requestAnimationFrame(frame);

  const api: GameApi = {
    dispose() {
      disposed = true;
      fx.dispose();
      cancelAnimationFrame(raf);
      for (const [target, type, fn] of listeners) target.removeEventListener(type, fn);
      try {
        document.exitPointerLock();
      } catch {
        /* ignore */
      }
      renderer.dispose();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else if (material) material.dispose();
      });
      viewScene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      Object.values(tex).forEach((pair) => {
        pair.map.dispose();
        pair.normal.dispose();
        pair.rough.dispose();
      });
      groundMaps.map.dispose();
      groundMaps.normal.dispose();
      groundMaps.rough.dispose();
      gunWear.map.dispose();
      gunWear.normal.dispose();
      gunWear.rough.dispose();
      camo.map.dispose();
      camo.normal.dispose();
      camo.rough.dispose();
      envTex.dispose();
      renderer.forceContextLoss();
      delete window.__controlsTest;
    },
    start,
    resume,
    pause,
    toMenu,
    setTouchMove(x, y) {
      touchX = x;
      touchY = y;
    },
    addLook(dx, dy) {
      lookDX += dx;
      lookDY += dy;
    },
    setFireHeld(v) {
      fireHeld = v;
    },
    setAdsHeld(v) {
      adsHeld = v;
    },
    setSprintHeld(v) {
      sprintHeld = v;
    },
    toggleCrouch() {
      crouchToggle = !crouchToggle;
    },
    reload() {
      beginReload();
    },
    jump() {
      jumpQueued = true;
    },
    setMuted(v) {
      save.muted = v;
      writeSave(save);
      audio.setMuted(v);
    },
    setSens(v) {
      baseSens = v;
      save.sens = v;
      writeSave(save);
    },
    setMap(id) {
      if (phase === "play") return;
      if (!MAPS[id]) return;
      save.map = id;
      writeSave(save);
      rebuildLevel(MAPS[id]);
      onPhase(info());
    },
    setQualityPref(q) {
      qualityPref = q;
      save.quality = q;
      writeSave(save);
      if (q === "rendimiento") quality = 0;
      else if (q === "realista") quality = 2;
      else quality = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 820 ? 1 : 2;
      applyQuality();
      applyAtmosphere(activeMap);
    },
    setFov(fov) {
      baseFov = clamp(fov, 60, 100);
      save.fov = baseFov;
      writeSave(save);
      camera.fov = baseFov;
      camera.updateProjectionMatrix();
    },
    setBotCount(n) {
      botCount = n === 4 || n === 8 ? n : 6;
      save.bots = botCount;
      writeSave(save);
      for (const bot of bots) {
        bot.enabled = bot.id < botCount;
        if (!bot.enabled) bot.group.visible = false;
      }
    },
    setDiff(d) {
      diff = d;
      save.diff = d;
      writeSave(save);
    },
    setVolume(v) {
      save.volume = clamp(v, 0, 1);
      writeSave(save);
      audio.setVolume(save.volume);
    },
    attachNet(io) {
      net = io;
      allyId = null;
      remote.seen = false;
      remote.alive = false;
      remote.name = "Aliado";
      ally.visible = false;
    },
    setAllyName(name) {
      remote.name = name.slice(0, 16) || "Aliado";
    },
    ingest,
    announce() {
      if (net?.role === "host" && phase === "play") net.send({ t: "go", map: activeMap.id, diff, bots: botCount });
    },
    isMuted: () => save.muted,
    getSens: () => baseSens,
    selectWeapon,
    cycleWeapon() {
      selectWeapon(slot + 1);
    },
    setLoadout(ids: string[]) {
      const idx = ids.map((id) => WEAPONS.findIndex((w) => w.id === id)).filter((i) => i >= 0).slice(0, 3);
      for (const d of [0, 1, 3]) if (idx.length < 3 && !idx.includes(d)) idx.push(d);
      loadout = idx;
      if (phase !== "play") {
        slot = 0;
        wep = loadout[0];
        pullAmmo();
        showGun();
      }
    },
    setAbilities(ids: string[]) {
      abils = ids.filter((id): id is AbilId => id in ABIL_CD).slice(0, 2).map((id) => ({ id, cd: 0 }));
    },
    useAbility,
    getAbilities: () => abils.map((a) => ({ id: a.id, cd: a.cd, max: ABIL_CD[a.id] })),
    getLoadoutNames: () => loadout.map((i) => WEAPONS[i].name),
    setSkin(hex: number | null) {
      poly.color.setHex(hex ?? 0x1c1f1c);
      accent.emissive.setHex(hex ?? 0x000000);
      accent.emissiveIntensity = hex === null ? 0 : 0.35;
    },
  };

  window.__controlsTest = {
    qaWin(kills = 3) {
      for (let i = 0; i < kills && i < bots.length; i++) if (bots[i].alive) hurtBot(bots[i], 999, false);
      bases[0].p = 100;
      bases[1].p = 100;
      finish("win", "QA");
    },
    getLoadout: () => loadout.map((i) => WEAPONS[i].id),
    getWeapon: () => WEAPONS[wep].id,
    getYaw: () => player.yaw,
    getSpeed: () => Math.hypot(player.vx, player.vz),
    getPos: () => ({ x: player.x, y: player.y, z: player.z }),
    getFps: () => fps,
    getPhase: () => phase,
    getPlayer: () => ({
      hp: player.hp,
      armor: player.armor,
      mag: player.mag,
      alive: player.alive,
      down: player.down,
      pitch: player.pitch,
      yaw: player.yaw,
    }),
    getBots: () => bots.map((b) => ({ name: b.name, hp: Math.round(b.hp), alive: b.alive, x: b.x, z: b.z })),
    setKeys(codes: string[]) {
      qa = true;
      qaKeys = new Set(codes);
      if (phase === "pause") setPhase("play");
      else if (phase !== "play") {
        resetRound();
        setPhase("play");
      }
    },
    setFire(v: boolean) {
      qa = true;
      qaFire = v;
      if (phase !== "play") {
        resetRound();
        setPhase("play");
      }
    },
    teleport(x: number, z: number) {
      player.x = x;
      player.z = z;
      player.y = 0;
      player.vx = 0;
      player.vz = 0;
    },
    lookAt(x: number, z: number) {
      player.yaw = Math.atan2(-(x - player.x), -(z - player.z));
      player.pitch = 0;
      player.recoilP = 0;
      player.recoilY = 0;
    },
    nearestBot() {
      let best = bots[0];
      let bestD = Infinity;
      for (const bot of bots) {
        const d = Math.hypot(bot.x - player.x, bot.z - player.z);
        if (d < bestD) {
          best = bot;
          bestD = d;
        }
      }
      return { x: best.x, z: best.z, hp: best.hp, alive: best.alive, name: best.name };
    },
    deploy: () => start(),
    getRemote: () => (remote.seen ? { x: remote.tx, z: remote.tz, name: remote.name } : null),
    getMap: () => activeMap.id,
    toMenu: () => toMenu(),
  };

  return api;
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      getPos: () => { x: number; y: number; z: number };
      getFps: () => number;
      getPhase: () => string;
      getPlayer: () => {
        hp: number;
        armor: number;
        mag: number;
        alive: boolean;
        down: number;
        pitch: number;
        yaw: number;
      };
      getBots: () => { name: string; hp: number; alive: boolean; x: number; z: number }[];
      setKeys: (codes: string[]) => void;
      setFire: (v: boolean) => void;
      teleport: (x: number, z: number) => void;
      lookAt: (x: number, z: number) => void;
      nearestBot: () => { x: number; z: number; hp: number; alive: boolean; name: string };
      deploy: () => void;
      qaWin: (kills?: number) => void;
      getLoadout: () => string[];
      getWeapon: () => string;
      getRemote: () => { x: number; z: number; name: string } | null;
      getMap: () => string;
      toMenu: () => void;
    };
  }
}
