import type { MapId } from "@/game/maps";

export type QualityPref = "auto" | "rendimiento" | "realista";
export type Diff = "recluta" | "regular" | "veterano";

export type SaveData = {
  v: 2;
  sens: number;
  muted: boolean;
  best: number | null;
  wins: number;
  map: MapId;
  quality: QualityPref;
  fov: number;
  bots: number;
  diff: Diff;
  volume: number;
  name: string;
};

const KEY = "dominio-v2";
const LEGACY = "dominio-v1";

const DEFAULTS: SaveData = {
  v: 2,
  sens: 0.0022,
  muted: false,
  best: null,
  wins: 0,
  map: "complejo",
  quality: "auto",
  fov: 78,
  bots: 6,
  diff: "regular",
  volume: 0.85,
  name: "Operador",
};

function isMap(v: unknown): v is MapId {
  return v === "complejo" || v === "deposito" || v === "muelle";
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    const bots = typeof parsed.bots === "number" ? Math.round(parsed.bots) : DEFAULTS.bots;
    return {
      v: 2,
      sens: typeof parsed.sens === "number" ? parsed.sens : DEFAULTS.sens,
      muted: Boolean(parsed.muted),
      best: typeof parsed.best === "number" ? parsed.best : null,
      wins: typeof parsed.wins === "number" ? parsed.wins : 0,
      map: isMap(parsed.map) ? parsed.map : DEFAULTS.map,
      quality:
        parsed.quality === "rendimiento" || parsed.quality === "realista" || parsed.quality === "auto"
          ? parsed.quality
          : DEFAULTS.quality,
      fov: typeof parsed.fov === "number" ? Math.min(100, Math.max(60, parsed.fov)) : DEFAULTS.fov,
      bots: bots === 4 || bots === 8 ? bots : 6,
      diff: parsed.diff === "recluta" || parsed.diff === "veterano" || parsed.diff === "regular" ? parsed.diff : "regular",
      volume: typeof parsed.volume === "number" ? Math.min(1, Math.max(0, parsed.volume)) : DEFAULTS.volume,
      name: typeof parsed.name === "string" && parsed.name.trim() ? parsed.name.slice(0, 16) : DEFAULTS.name,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function writeSave(data: SaveData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore quota */
  }
}
