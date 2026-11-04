export type MapId = "complejo" | "deposito" | "muelle";
export type Kind = "concrete" | "wood" | "metal" | "sand" | "hazard";

export type Box = {
  k: Kind;
  x: number;
  z: number;
  w: number;
  h: number;
  d: number;
  tint?: number;
  y?: number;
  hit?: boolean;
};

export type Cyl = { k: Kind; x: number; z: number; r: number; h: number; tint?: number };

export type GameMap = {
  id: MapId;
  name: string;
  blurb: string;
  spawn: { x: number; z: number; yaw: number };
  bases: [{ x: number; z: number }, { x: number; z: number }];
  ways: [number, number][][];
  bots: { home: 0 | 1; x: number; z: number }[];
  lamps: [number, number][];
  boxes: Box[];
  cyls: Cyl[];
  sky: { top: string; hor: string; bot: string };
  fog: { color: number; near: number; far: number };
  clear: number;
  ground: number;
  sun: { x: number; y: number; z: number; color: number; intensity: number };
  hemi: { sky: number; ground: number; intensity: number };
  mini: { ox: number; oz: number; w: number; h: number };
  dust: number;
};

const b = (
  k: Kind,
  x: number,
  z: number,
  w: number,
  h: number,
  d: number,
  tint?: number,
  y?: number,
  hit?: boolean,
): Box => ({ k, x, z, w, h, d, tint, y, hit });

export const MAP_LIST: GameMap[] = [
  {
    id: "complejo",
    name: "COMPLEJO",
    blurb: "Patio industrial al sol. Contenedores, sacos y dos bases enfrentadas.",
    spawn: { x: 0, z: 21, yaw: 0 },
    bases: [
      { x: -22, z: -9 },
      { x: 22, z: -9 },
    ],
    ways: [
      [
        [-22, -9],
        [-19, -7],
        [-25, -11],
        [-22, -12],
        [-18, -11],
      ],
      [
        [22, -9],
        [19, -7],
        [25, -11],
        [22, -12],
        [18, -11],
      ],
    ],
    bots: [
      { home: 0, x: -20, z: -12 },
      { home: 0, x: -24.5, z: -8 },
      { home: 0, x: -18.5, z: -10.5 },
      { home: 0, x: -21, z: -5.5 },
      { home: 1, x: 20, z: -12 },
      { home: 1, x: 24.5, z: -8 },
      { home: 1, x: 18.5, z: -10.5 },
      { home: 1, x: 21, z: -5.5 },
    ],
    lamps: [
      [-12.4, 8.6],
      [12.4, 8.2],
    ],
    boxes: [
      b("concrete", 0, -24.6, 70, 3.4, 0.8),
      b("concrete", 0, 28.6, 70, 3.4, 0.8),
      b("concrete", -35.2, 2, 0.8, 3.4, 54),
      b("concrete", 35.2, 2, 0.8, 3.4, 54),
      b("concrete", -22, 15, 18, 3.2, 0.75),
      b("concrete", 22, 15, 18, 3.2, 0.75),
      b("concrete", 0, 7, 7.2, 3.1, 0.7),
      b("concrete", -9.2, 1.2, 4.2, 2.5, 0.7),
      b("concrete", 9.2, 1.2, 4.2, 2.5, 0.7),
      b("concrete", -16.5, -14.2, 0.75, 3.2, 0.75),
      b("concrete", 16.5, -14.2, 0.75, 3.2, 0.75),
      b("concrete", 0, -16.5, 8, 2.2, 0.6),
      b("metal", -31.3, -9, 2.5, 2.6, 8, 0x8a4630),
      b("metal", -22, -18.4, 7.2, 2.6, 2.45, 0x3e5566),
      b("metal", 31.3, -9, 2.5, 2.6, 8, 0x3e5566),
      b("metal", 22, -18.4, 7.2, 2.6, 2.45, 0x8a4630),
      b("metal", -6, 20.5, 2.4, 2.2, 1.3, 0x4d5962),
      b("metal", 6.4, 22.4, 1.6, 1.4, 2.8, 0x8a4630),
      b("wood", -8.2, 18.2, 1.35, 1.15, 1.35),
      b("wood", 8.4, 17.6, 1.35, 1.15, 1.35),
      b("wood", 0, 11.2, 1.3, 1.15, 1.3),
      b("wood", -5.2, 3.2, 1.25, 1.1, 1.25),
      b("wood", 5.4, 2.6, 1.25, 1.1, 1.25),
      b("wood", 0, -2.2, 1.35, 1.15, 1.35),
      b("wood", 0, -2.2, 1.15, 1.05, 1.15),
      b("wood", -15.6, -5.6, 1.3, 1.15, 1.3),
      b("wood", 15.6, -5.6, 1.3, 1.15, 1.3),
      b("wood", -28.4, 6.2, 1.2, 1.1, 1.2),
      b("wood", -28.2, -1.4, 1.2, 1.1, 1.2),
      b("wood", 28.4, 6.4, 1.2, 1.1, 1.2),
      b("wood", 28.2, -1.2, 1.2, 1.1, 1.2),
      b("wood", -12.5, -16.5, 1.2, 1.1, 1.2),
      b("wood", 12.5, -16.5, 1.2, 1.1, 1.2),
      b("wood", 0, -2.2, 1.05, 1, 1.05, undefined, 1.15, false),
      b("wood", -15.6, -5.6, 1.15, 1.05, 1.15, undefined, 1.15),
      b("wood", 15.6, -5.6, 1.15, 1.05, 1.15, undefined, 1.15),
      b("sand", -22, -3.15, 3.8, 1.05, 0.85),
      b("sand", 22, -3.15, 3.8, 1.05, 0.85),
      b("sand", -14.2, 9.4, 2.4, 0.85, 0.7),
      b("sand", 14.2, 9.4, 2.4, 0.85, 0.7),
      b("hazard", -4.6, 13.6, 2.3, 0.9, 0.55),
      b("hazard", 4.8, 13.2, 2.3, 0.9, 0.55),
      b("hazard", -18.4, 4.6, 2.2, 0.9, 0.55),
      b("hazard", 18.4, 4.4, 2.2, 0.9, 0.55),
      b("hazard", 0, -12.2, 2.4, 0.9, 0.55),
    ],
    cyls: [
      { k: "metal", x: -26.2, z: -5.2, r: 0.38, h: 1.05, tint: 0x6a5438 },
      { k: "metal", x: -25.5, z: -5.9, r: 0.38, h: 1.05, tint: 0x5c4a34 },
      { k: "metal", x: 26.2, z: -5.2, r: 0.38, h: 1.05, tint: 0x4e5960 },
      { k: "metal", x: 25.5, z: -5.9, r: 0.38, h: 1.05, tint: 0x5a656c },
      { k: "metal", x: -2.2, z: 21.6, r: 0.42, h: 1.15, tint: 0x6a5438 },
      { k: "metal", x: 2.3, z: 21.2, r: 0.42, h: 1.15, tint: 0x5c6368 },
    ],
    sky: { top: "#2f6ea8", hor: "#f0d2a4", bot: "#b7a07e" },
    fog: { color: 0xcbbda6, near: 24, far: 92 },
    clear: 0xc9bba4,
    ground: 0xd8c6a6,
    sun: { x: 26, y: 42, z: 18, color: 0xfff0d0, intensity: 2.65 },
    hemi: { sky: 0x9eb6d4, ground: 0x8d734c, intensity: 0.42 },
    mini: { ox: 36, oz: 26, w: 72, h: 56 },
    dust: 0.35,
  },
  {
    id: "deposito",
    name: "DEPÓSITO",
    blurb: "Nave cerrada, pasillos de estanterías y luz fría. Las bases están en los extremos.",
    spawn: { x: 0, z: 13.2, yaw: 0 },
    bases: [
      { x: -8, z: -12 },
      { x: 8, z: 6 },
    ],
    ways: [
      [
        [-8, -12],
        [-4, -10],
        [-11, -8],
        [-6, -14],
        [-12, -13],
      ],
      [
        [8, 6],
        [4, 4],
        [11, 8],
        [6, 9],
        [12, 3],
      ],
    ],
    bots: [
      { home: 0, x: -5, z: -13 },
      { home: 0, x: -11, z: -10 },
      { home: 0, x: -6, z: -8.5 },
      { home: 0, x: -12, z: -14 },
      { home: 1, x: 5, z: 8 },
      { home: 1, x: 11, z: 5 },
      { home: 1, x: 6.5, z: 3.2 },
      { home: 1, x: 12, z: 8.5 },
    ],
    lamps: [
      [-4, 0],
      [4, 0],
      [0, -8],
      [0, 8],
      [-10, 2],
      [10, -4],
    ],
    boxes: [
      b("concrete", 0, -17.2, 34, 4.4, 0.7, 0x6a6e72),
      b("concrete", 0, 16.4, 34, 4.4, 0.7, 0x6a6e72),
      b("concrete", -16.4, 0, 0.7, 4.4, 34, 0x5c6166),
      b("concrete", 16.4, 0, 0.7, 4.4, 34, 0x5c6166),
      b("metal", -10.5, -2, 1.4, 2.8, 7.5, 0x3e4a55),
      b("metal", -10.5, 8, 1.4, 2.4, 4.2, 0x8a4630),
      b("metal", 10.5, -6, 1.4, 2.8, 6.5, 0x8a4630),
      b("metal", 10.5, 10, 1.4, 2.2, 3.2, 0x3e4a55),
      b("metal", 0, -4.2, 2.2, 1.6, 1.2, 0x4d5962),
      b("wood", -3.2, -2.2, 1.3, 1.15, 1.3),
      b("wood", 3.4, 2.4, 1.3, 1.15, 1.3),
      b("wood", -2.2, 4.6, 1.2, 1.05, 1.2),
      b("wood", 2.4, -7.2, 1.25, 1.1, 1.25),
      b("wood", 0, 10.2, 1.3, 1.15, 1.3),
      b("hazard", -3.5, 11.4, 2.2, 0.9, 0.55),
      b("hazard", 3.6, -9.6, 2.2, 0.9, 0.55),
      b("sand", -13.2, 4.5, 2.2, 0.9, 0.7),
      b("sand", 13.2, -2.2, 2.2, 0.9, 0.7),
      b("concrete", -4.8, -6.5, 0.45, 2.6, 3.2, 0x8d9296),
      b("concrete", 4.8, 1.2, 0.45, 2.6, 3.2, 0x8d9296),
    ],
    cyls: [
      { k: "metal", x: -1.2, z: 1.1, r: 0.4, h: 1.1, tint: 0x4e5960 },
      { k: "metal", x: 1.4, z: -1.2, r: 0.4, h: 1.1, tint: 0x6a5438 },
      { k: "metal", x: -6.4, z: 6.2, r: 0.36, h: 1, tint: 0x5c4a34 },
      { k: "metal", x: 6.2, z: -5.4, r: 0.36, h: 1, tint: 0x4e5960 },
    ],
    sky: { top: "#141c28", hor: "#2a3848", bot: "#1b242e" },
    fog: { color: 0x2a3542, near: 10, far: 46 },
    clear: 0x24303c,
    ground: 0x6a6e6a,
    sun: { x: 8, y: 22, z: 6, color: 0xd5e2f4, intensity: 0.55 },
    hemi: { sky: 0x8ea4be, ground: 0x3a403c, intensity: 0.55 },
    mini: { ox: 18, oz: 18, w: 36, h: 36 },
    dust: 0.12,
  },
  {
    id: "muelle",
    name: "MUELLE",
    blurb: "Dársena abierta, viento y contenedores. Líneas de tiro largas y poca cobertura.",
    spawn: { x: 0, z: 16, yaw: 0 },
    bases: [
      { x: -22, z: -4 },
      { x: 22, z: -4 },
    ],
    ways: [
      [
        [-22, -4],
        [-18, -2],
        [-26, -6],
        [-20, -8],
        [-16, -5],
      ],
      [
        [22, -4],
        [18, -2],
        [26, -6],
        [20, -8],
        [16, -5],
      ],
    ],
    bots: [
      { home: 0, x: -20, z: -8 },
      { home: 0, x: -25, z: -2 },
      { home: 0, x: -17, z: -6 },
      { home: 0, x: -23, z: 1 },
      { home: 1, x: 20, z: -8 },
      { home: 1, x: 25, z: -2 },
      { home: 1, x: 17, z: -6 },
      { home: 1, x: 23, z: 1 },
    ],
    lamps: [
      [-8, 6],
      [8, 6],
      [0, -10],
    ],
    boxes: [
      b("concrete", 0, -20, 64, 1.55, 0.7, 0x8d9490),
      b("concrete", 0, 22, 64, 1.55, 0.7, 0x8d9490),
      b("concrete", -32, 1, 0.7, 1.55, 42, 0x8d9490),
      b("concrete", 32, 1, 0.7, 1.55, 42, 0x8d9490),
      b("metal", -14, 2, 2.4, 2.5, 6.2, 0x8a4630),
      b("metal", 14, 2, 2.4, 2.5, 6.2, 0x2f4f62),
      b("metal", -8, -8, 6.2, 2.5, 2.4, 0x3e5566),
      b("metal", 8, -8, 6.2, 2.5, 2.4, 0x8a4630),
      b("metal", 0, 8.5, 2.2, 1.3, 1.4, 0x4d5962),
      b("wood", -4, 4, 1.3, 1.1, 1.3),
      b("wood", 4.2, 3.4, 1.3, 1.1, 1.3),
      b("wood", 0, -1.5, 1.25, 1.1, 1.25),
      b("wood", -28, 8, 1.2, 1.05, 1.2),
      b("wood", 28, 8, 1.2, 1.05, 1.2),
      b("sand", -22, 2.2, 3.4, 0.95, 0.8),
      b("sand", 22, 2.2, 3.4, 0.95, 0.8),
      b("sand", 0, 12.5, 4.2, 0.85, 0.7),
      b("hazard", -6, 12, 2.4, 0.9, 0.55),
      b("hazard", 6, 11.4, 2.4, 0.9, 0.55),
      b("concrete", -30, -12, 3.2, 0.7, 3.2, 0x9aa39a),
      b("concrete", 30, -12, 3.2, 0.7, 3.2, 0x9aa39a),
    ],
    cyls: [
      { k: "metal", x: -2.4, z: -6, r: 0.42, h: 1.15, tint: 0x5c4a34 },
      { k: "metal", x: 2.2, z: -5.4, r: 0.42, h: 1.15, tint: 0x4e5960 },
      { k: "metal", x: -12, z: 10, r: 0.34, h: 1.3, tint: 0x6a5438 },
      { k: "metal", x: 12, z: 10, r: 0.34, h: 1.3, tint: 0x5a656c },
      { k: "metal", x: 0, z: -14, r: 0.5, h: 1.2, tint: 0x4a5550 },
    ],
    sky: { top: "#1d74b8", hor: "#d5eef8", bot: "#8fbfc9" },
    fog: { color: 0xb7d0d6, near: 28, far: 120 },
    clear: 0xb7d0d6,
    ground: 0xb9c8c2,
    sun: { x: -18, y: 48, z: 22, color: 0xfff6e4, intensity: 2.85 },
    hemi: { sky: 0xb7d7ee, ground: 0x6d7c74, intensity: 0.5 },
    mini: { ox: 36, oz: 24, w: 72, h: 52 },
    dust: 0.22,
  },
];

export const MAPS: Record<MapId, GameMap> = {
  complejo: MAP_LIST[0],
  deposito: MAP_LIST[1],
  muelle: MAP_LIST[2],
};
