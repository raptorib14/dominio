// Progreso local: monedas, armería, habilidades, pase de batalla y códigos. Todo en localStorage.
export type WeaponKey = "rifle" | "smg" | "shot" | "pistol" | "dmr" | "lmg" | "revolver" | "carbine" | "glaciar";
export type AbilKey = "dash" | "escudo" | "cura" | "radar";

export const ARMORY: { id: WeaponKey; name: string; kind: string; price: number; note: string }[] = [
  { id: "rifle", name: "R-47", kind: "FUSIL", price: 0, note: "Todo terreno, ráfaga precisa." },
  { id: "smg", name: "VX-9", kind: "SUBFUSIL", price: 0, note: "Cadencia altísima a corta distancia." },
  { id: "pistol", name: "P-19", kind: "PISTOLA", price: 0, note: "Liviana y certera." },
  { id: "shot", name: "SC-12", kind: "ESCOPETA", price: 300, note: "Demoledora de cerca." },
  { id: "revolver", name: "RV-44", kind: "REVÓLVER", price: 350, note: "6 tiros, pega como un camión." },
  { id: "dmr", name: "M-90", kind: "TIRADOR", price: 450, note: "Mira larga, mata de lejos." },
  { id: "carbine", name: "K-4", kind: "CARABINA", price: 500, note: "Rápida y estable." },
  { id: "lmg", name: "AM-60", kind: "AMETRALLADORA", price: 650, note: "60 balas para no parar." },
  { id: "glaciar", name: "GL-0 GLACIAR", kind: "CRIOFUSIL", price: -1, note: "Exclusiva del pase POLAR. Congela y frena a quien le pega." },
];

export const ABILITIES: { id: AbilKey; name: string; price: number; cd: number; note: string }[] = [
  { id: "dash", name: "DASH", price: 0, cd: 6, note: "Impulso rápido hacia adelante." },
  { id: "cura", name: "CURA", price: 250, cd: 20, note: "+50 de vida al instante." },
  { id: "radar", name: "RADAR", price: 350, cd: 15, note: "Ves a todos los enemigos en el minimapa 7 s." },
  { id: "escudo", name: "ESCUDO", price: 400, cd: 18, note: "Recibís 75% menos daño durante 4 s." },
];

export type Skin = { id: string; name: string; color: number; cost: number; currency: "monedas" | "especiales" | "pase" };
export const SKINS: Skin[] = [
  { id: "base", name: "ESTÁNDAR", color: -1, cost: 0, currency: "monedas" },
  { id: "arena", name: "ARENA", color: 0x8a6d3b, cost: 150, currency: "monedas" },
  { id: "bosque", name: "BOSQUE", color: 0x3d5a2a, cost: 150, currency: "monedas" },
  { id: "artico", name: "ÁRTICO", color: 0xb8c7d4, cost: 0, currency: "pase" },
  { id: "carmesi", name: "CARMESÍ", color: 0x8c1c24, cost: 0, currency: "pase" },
  { id: "neon", name: "NEÓN ✦", color: 0x18d6c8, cost: 25, currency: "especiales" },
  { id: "oro", name: "ORO ✦", color: 0xd4a020, cost: 40, currency: "especiales" },
  { id: "galaxia", name: "GALAXIA ✦", color: 0x6a2fd0, cost: 60, currency: "especiales" },
  { id: "escarcha", name: "ESCARCHA", color: 0x7fb4d8, cost: 0, currency: "pase" },
  { id: "aurora", name: "AURORA", color: 0x2fd6a0, cost: 0, currency: "pase" },
  { id: "polar", name: "POLAR ❄", color: 0xd8f0ff, cost: 0, currency: "pase" },
];

export type Reward = { coins?: number; special?: number; weapon?: WeaponKey; skin?: string; abil?: AbilKey; final?: boolean };
export const SEASON = "POLAR";
export const TIER_XP = 120;
/** Precio del pase premium en ✦ especiales (nunca plata real). */
export const PREMIUM_PRICE = 950;
/** Pista gratis: 200 ✦ en total. */
export const PASS: Reward[] = [
  { coins: 100 }, { special: 10 }, { coins: 150 }, { skin: "artico" }, { special: 15 },
  { weapon: "shot" }, { coins: 200 }, { special: 20 }, { abil: "cura" }, { coins: 250 },
  { special: 25 }, { weapon: "revolver" }, { coins: 300 }, { skin: "carmesi" }, { special: 30 },
  { abil: "radar" }, { coins: 400 }, { weapon: "carbine" }, { special: 40 }, { coins: 500, special: 60 },
];
/** Pista premium: devuelve 400 ✦ a lo largo de la temporada y termina con POLAR + GL-0 GLACIAR. */
export const PREMIUM: Reward[] = [
  { special: 50 }, { coins: 300 }, { special: 40 }, { coins: 300 }, { skin: "escarcha" },
  { special: 60 }, { coins: 400 }, { special: 30 }, { abil: "escudo" }, { special: 40 },
  { coins: 500 }, { skin: "aurora" }, { special: 40 }, { weapon: "dmr" }, { special: 40 },
  { coins: 600 }, { special: 50 }, { weapon: "lmg" }, { special: 50, coins: 800 }, { skin: "polar", weapon: "glaciar", final: true },
];
/** Cada nivel extra después del 20 da ✦. */
export const BONUS_TIER_SPECIAL = 10;

const CODES: Record<string, Reward> = {
  "9502fced30c80010e7a67d033287e0ac1b76bc38d92e7807683f2388f2bc77d3": { coins: 500 },
  "e0a54ebe5c081429c35d5b1375a972d04e90fea84026a9453cf56a571cfc473a": { special: 300 },
  "535d5d6a5bbd8a2d0a39fb0b99d67d9f10c419d7360eceab29f3a9f19cf95cde": { coins: 300, abil: "escudo" },
  "c8fc1d5b11281c3dc1d5352df7f79637273fa912e1bf4a60ec311ddf31e6e12c": { weapon: "lmg" },
  "e54b15c4e215ec0b957c2cc508deba4e4983a87c20a95e3687c870670c8a845f": { skin: "oro", special: 20 },
};

export type Profile = {
  v: 1;
  coins: number;
  special: number;
  xp: number;
  weapons: WeaponKey[];
  loadout: WeaponKey[];
  abilities: AbilKey[];
  equipped: AbilKey[];
  skins: string[];
  skin: string;
  codes: string[];
  matches: number;
  premium: boolean;
  freeClaimed: number;
  premClaimed: number;
  bonusClaimed: number;
};

const KEY = "dominio-perfil";
const DEF: Profile = {
  v: 1, coins: 0, special: 0, xp: 0,
  weapons: ["rifle", "smg", "pistol"], loadout: ["rifle", "smg", "pistol"],
  abilities: ["dash"], equipped: ["dash"], skins: ["base"], skin: "base", codes: [], matches: 0,
  premium: false, freeClaimed: 0, premClaimed: 0, bonusClaimed: 0,
};

const arr = <T,>(v: unknown, ok: (x: unknown) => boolean, d: T[]): T[] =>
  Array.isArray(v) ? (v.filter(ok) as T[]) : d.slice();

export function loadProfile(): Profile {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) || "{}") as Partial<Profile>;
    const isW = (x: unknown) => ARMORY.some((a) => a.id === x);
    const isA = (x: unknown) => ABILITIES.some((a) => a.id === x);
    const n = (x: unknown) => (typeof x === "number" && x >= 0 ? Math.floor(x) : 0);
    const weapons = Array.from(new Set([...DEF.weapons, ...arr<WeaponKey>(p.weapons, isW, [])]));
    let loadout = arr<WeaponKey>(p.loadout, (x) => isW(x) && weapons.includes(x as WeaponKey), DEF.loadout);
    if (new Set(loadout).size !== 3) loadout = DEF.loadout.slice();
    const abilities = Array.from(new Set(["dash" as AbilKey, ...arr<AbilKey>(p.abilities, isA, [])]));
    const equipped = arr<AbilKey>(p.equipped, (x) => abilities.includes(x as AbilKey), DEF.equipped).slice(0, 2);
    const skins = Array.from(new Set(["base", ...arr<string>(p.skins, (x) => SKINS.some((s) => s.id === x), [])]));
    return {
      v: 1, coins: n(p.coins), special: n(p.special), xp: n(p.xp), weapons, loadout, abilities,
      equipped: equipped.length ? equipped : ["dash"], skins,
      skin: typeof p.skin === "string" && skins.includes(p.skin) ? p.skin : "base",
      codes: arr<string>(p.codes, (x) => typeof x === "string", []), matches: n(p.matches),
      premium: p.premium === true,
      // Partidas viejas: los niveles gratis alcanzados ya se cobraron.
      freeClaimed: typeof p.freeClaimed === "number" ? Math.min(PASS.length, n(p.freeClaimed)) : tierOf(n(p.xp)),
      premClaimed: p.premium === true ? Math.min(PREMIUM.length, n(p.premClaimed)) : 0,
      bonusClaimed: typeof p.bonusClaimed === "number" ? n(p.bonusClaimed) : bonusTiers(n(p.xp)),
    };
  } catch {
    return structuredClone(DEF);
  }
}

export function saveProfile(p: Profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* sin espacio */
  }
}

export function grant(p: Profile, r: Reward): Profile {
  const q = { ...p, weapons: [...p.weapons], abilities: [...p.abilities], skins: [...p.skins] };
  q.coins += r.coins ?? 0;
  q.special += r.special ?? 0;
  if (r.weapon && !q.weapons.includes(r.weapon)) q.weapons.push(r.weapon);
  if (r.abil && !q.abilities.includes(r.abil)) q.abilities.push(r.abil);
  if (r.skin && !q.skins.includes(r.skin)) q.skins.push(r.skin);
  return q;
}

export function describe(r: Reward): string {
  const out: string[] = [];
  if (r.coins) out.push(`${r.coins} monedas`);
  if (r.special) out.push(`${r.special} ✦ especiales`);
  if (r.weapon) out.push(`arma ${ARMORY.find((a) => a.id === r.weapon)?.name}`);
  if (r.abil) out.push(`habilidad ${ABILITIES.find((a) => a.id === r.abil)?.name}`);
  if (r.skin) out.push(`aspecto ${SKINS.find((s) => s.id === r.skin)?.name}`);
  return out.join(" + ");
}

export const tierOf = (xp: number) => Math.min(PASS.length, Math.floor(xp / TIER_XP));
export const bonusTiers = (xp: number) => Math.max(0, Math.floor(xp / TIER_XP) - PASS.length);

export type Unlock = { tier: number; track: "gratis" | "premium" | "extra"; reward: Reward; text: string };

/** Cobra todo lo alcanzado y no cobrado todavía (gratis, premium si lo tiene y niveles extra). */
export function claimPass(p: Profile): { profile: Profile; unlocks: Unlock[] } {
  let q = { ...p };
  const unlocks: Unlock[] = [];
  const t = tierOf(q.xp);
  for (let i = q.freeClaimed; i < t; i++) {
    q = grant(q, PASS[i]);
    unlocks.push({ tier: i + 1, track: "gratis", reward: PASS[i], text: `Nivel ${i + 1}: ${describe(PASS[i])}` });
  }
  q.freeClaimed = Math.max(q.freeClaimed, t);
  if (q.premium) {
    for (let i = q.premClaimed; i < t; i++) {
      q = grant(q, PREMIUM[i]);
      unlocks.push({ tier: i + 1, track: "premium", reward: PREMIUM[i], text: `Premium ${i + 1}: ${describe(PREMIUM[i])}` });
    }
    q.premClaimed = Math.max(q.premClaimed, t);
  }
  const b = bonusTiers(q.xp);
  if (b > q.bonusClaimed) {
    const r = { special: (b - q.bonusClaimed) * BONUS_TIER_SPECIAL };
    q = grant(q, r);
    unlocks.push({ tier: PASS.length + b, track: "extra", reward: r, text: `Niveles extra: ${describe(r)}` });
    q.bonusClaimed = b;
  }
  return { profile: q, unlocks };
}

export function buyPremium(p: Profile): { profile: Profile; unlocks: Unlock[]; ok: boolean; msg: string } {
  if (p.premium) return { profile: p, unlocks: [], ok: false, msg: "Ya tenés el pase premium." };
  if (p.special < PREMIUM_PRICE) return { profile: p, unlocks: [], ok: false, msg: `Te faltan ${PREMIUM_PRICE - p.special} ✦. Jugá, subí niveles gratis o canjeá códigos.` };
  const r = claimPass({ ...p, special: p.special - PREMIUM_PRICE, premium: true, premClaimed: 0 });
  return { ...r, ok: true, msg: "¡Pase premium POLAR activado!" };
}

/** Recompensa de partida. Devuelve el perfil nuevo y un resumen. */
export function matchReward(p: Profile, kills: number, bases: number, win: boolean) {
  const coins = kills * 5 + bases * 20 + (win ? 60 : 10);
  const special = Math.floor(kills / 5) + (win ? 8 : 3);
  const xp = kills * 15 + bases * 40 + (win ? 100 : 30);
  const q = grant(p, { coins, special });
  q.xp += xp;
  q.matches += 1;
  const r = claimPass(q);
  return { profile: r.profile, coins, special, xp, unlocked: r.unlocks.map((u) => u.text), unlocks: r.unlocks };
}

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function redeem(p: Profile, raw: string): Promise<{ profile: Profile; msg: string; ok: boolean }> {
  const code = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!code) return { profile: p, msg: "Escribí un código.", ok: false };
  let h: string;
  try {
    h = await sha256("dominio:" + code);
  } catch {
    return { profile: p, msg: "Tu navegador no puede verificar códigos acá.", ok: false };
  }
  const r = CODES[h];
  if (!r) return { profile: p, msg: "Código inválido.", ok: false };
  if (p.codes.includes(h)) return { profile: p, msg: "Ya usaste este código.", ok: false };
  const q = grant(p, r);
  q.codes = [...p.codes, h];
  return { profile: q, msg: `¡Listo! Ganaste ${describe(r)}.`, ok: true };
}
