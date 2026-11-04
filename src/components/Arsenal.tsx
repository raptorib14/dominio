import { useState } from "react";
import {
  ABILITIES, ARMORY, BONUS_TIER_SPECIAL, PASS, PREMIUM, PREMIUM_PRICE, SEASON, SKINS, TIER_XP, buyPremium, describe, redeem, saveProfile, tierOf,
  type AbilKey, type Profile, type Unlock, type WeaponKey,
} from "@/game/profile";
import { Showcase } from "@/components/Unlock";

export type ArsenalTab = "armeria" | "habilidades" | "pase" | "codigos";

export function Wallet({ p }: { p: Profile }) {
  return (
    <span className="flex items-center gap-3 font-display text-sm tracking-wide">
      <span className="text-amber">● {p.coins}</span>
      <span className="text-cyan">✦ {p.special}</span>
    </span>
  );
}

export function Arsenal({
  profile, setProfile, tab, setTab, onClose, onUnlocks,
}: {
  onUnlocks?: (u: Unlock[]) => void;
  profile: Profile;
  setProfile: (p: Profile) => void;
  tab: ArsenalTab;
  setTab: (t: ArsenalTab) => void;
  onClose: () => void;
}) {
  const p = profile;
  const [msg, setMsg] = useState("");
  const [code, setCode] = useState("");
  const commit = (q: Profile, m = "") => {
    saveProfile(q);
    setProfile(q);
    setMsg(m);
  };
  const toggleLoadout = (id: WeaponKey) => {
    if (p.loadout.includes(id)) {
      if (p.loadout.length <= 1) return;
      commit({ ...p, loadout: p.loadout.filter((x) => x !== id) }, "Elegí 3 armas para la partida.");
    } else if (p.loadout.length >= 3) setMsg("Ya tenés 3 armas. Sacá una primero.");
    else commit({ ...p, loadout: [...p.loadout, id] });
  };
  const buyWeapon = (id: WeaponKey, price: number) => {
    if (p.coins < price) return setMsg("Te faltan monedas. ¡Jugá unas partidas!");
    commit({ ...p, coins: p.coins - price, weapons: [...p.weapons, id] }, "¡Arma desbloqueada!");
  };
  const toggleAbil = (id: AbilKey) => {
    if (p.equipped.includes(id)) {
      if (p.equipped.length <= 1) return;
      commit({ ...p, equipped: p.equipped.filter((x) => x !== id) });
    } else commit({ ...p, equipped: [...p.equipped, id].slice(-2) });
  };
  const buyAbil = (id: AbilKey, price: number) => {
    if (p.coins < price) return setMsg("Te faltan monedas.");
    commit({ ...p, coins: p.coins - price, abilities: [...p.abilities, id] }, "¡Habilidad desbloqueada!");
  };
  const tier = tierOf(p.xp);
  const tabs: [ArsenalTab, string][] = [
    ["armeria", "ARMERÍA"], ["habilidades", "HABILIDADES"], ["pase", "PASE"], ["codigos", "CÓDIGOS"],
  ];
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-bg/70 p-3 backdrop-blur-sm" data-testid="arsenal">
      <section className="flex max-h-full w-full max-w-2xl flex-col rounded-lg border border-line bg-surface p-4 md:p-6">
        <div className="flex items-center justify-between gap-2">
          <Wallet p={p} />
          <button type="button" className="h-9 rounded-md border border-line px-3 text-xs tracking-widest" onClick={onClose}>
            CERRAR
          </button>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`h-9 rounded-md border text-[11px] tracking-widest ${tab === id ? "border-amber bg-amber/15 text-amber" : "border-line text-muted"}`}
              onClick={() => { setTab(id); setMsg(""); }}
            >
              {label}
            </button>
          ))}
        </div>
        {msg && <p className="mt-2 text-xs text-amber">{msg}</p>}
        <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
          {tab === "armeria" && (
            <>
              <p className="mb-2 text-xs text-muted">
                Llevás <b className="text-fg">exactamente 3 armas</b> por partida ({p.loadout.length}/3). Tocá para equipar o comprar.
              </p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {ARMORY.map((w) => {
                  const owned = p.weapons.includes(w.id);
                  const on = p.loadout.includes(w.id);
                  return (
                    <button
                      key={w.id}
                      type="button"
                      className={`shop-card ${on ? "is-on" : ""} ${owned ? "" : "is-locked"}`}
                      onClick={() => (owned ? toggleLoadout(w.id) : w.price < 0 ? setMsg("Exclusiva del pase premium POLAR: nivel 20.") : buyWeapon(w.id, w.price))}
                    >
                      <span className="text-[10px] tracking-widest text-muted">{w.kind}</span>
                      <span className="font-display text-lg leading-tight">{w.name}</span>
                      <span className="text-[11px] leading-snug text-muted">{w.note}</span>
                      <span className="mt-auto pt-1 text-xs font-display tracking-wide">
                        {on ? `EQUIPADA · ${p.loadout.indexOf(w.id) + 1}` : owned ? "EQUIPAR" : w.price < 0 ? "❄ PASE POLAR" : `● ${w.price}`}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-xs tracking-widest text-muted">ASPECTOS DE ARMA</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {SKINS.map((s) => {
                  const owned = p.skins.includes(s.id);
                  const on = p.skin === s.id;
                  const label = on ? "PUESTO" : owned ? "USAR" : s.currency === "pase" ? "PASE" : s.currency === "especiales" ? `✦ ${s.cost}` : `● ${s.cost}`;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`shop-card ${on ? "is-on" : ""} ${owned ? "" : "is-locked"} ${s.currency === "especiales" ? "is-premium" : ""}`}
                      onClick={() => {
                        if (owned) return commit({ ...p, skin: s.id });
                        if (s.currency === "pase") return setMsg("Se desbloquea en el pase de batalla.");
                        const have = s.currency === "especiales" ? p.special : p.coins;
                        if (have < s.cost) return setMsg(s.currency === "especiales" ? "Te faltan monedas especiales ✦." : "Te faltan monedas.");
                        commit({
                          ...p,
                          coins: s.currency === "monedas" ? p.coins - s.cost : p.coins,
                          special: s.currency === "especiales" ? p.special - s.cost : p.special,
                          skins: [...p.skins, s.id],
                          skin: s.id,
                        }, "¡Aspecto nuevo!");
                      }}
                    >
                      <span className="h-5 w-full rounded-sm" style={{ background: s.color < 0 ? "#1c1f1c" : `#${s.color.toString(16).padStart(6, "0")}` }} />
                      <span className="text-[11px] font-display tracking-wide">{s.name}</span>
                      <span className="text-[10px] text-muted">{label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {tab === "habilidades" && (
            <>
              <p className="mb-2 text-xs text-muted">
                Equipás hasta 2. En PC: <b className="text-fg">E</b> y <b className="text-fg">F</b>. En celu/iPad: botones en pantalla.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ABILITIES.map((a) => {
                  const owned = p.abilities.includes(a.id);
                  const on = p.equipped.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      className={`shop-card ${on ? "is-on" : ""} ${owned ? "" : "is-locked"}`}
                      onClick={() => (owned ? toggleAbil(a.id) : buyAbil(a.id, a.price))}
                    >
                      <span className="font-display text-lg">{a.name}</span>
                      <span className="text-[11px] text-muted">{a.note}</span>
                      <span className="text-[10px] text-muted">Recarga {a.cd} s</span>
                      <span className="mt-auto pt-1 text-xs font-display">
                        {on ? `EQUIPADA · ${p.equipped.indexOf(a.id) === 0 ? "E" : "F"}` : owned ? "EQUIPAR" : `● ${a.price}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {tab === "pase" && (
            <>
              <div className="flex items-baseline justify-between">
                <p className="font-display text-xl tracking-wide">PASE DE BATALLA · TEMPORADA {SEASON} ❄</p>
                <p className="text-xs text-muted" data-testid="pass-status">{p.premium ? "PREMIUM ✔" : "GRATIS"}</p>
              </div>
              <div className="polar-hero mt-2 grid gap-2 p-3 md:grid-cols-[1fr_13rem]" data-testid="pass-preview">
                <Showcase kind="both" burst={false} className="h-48 w-full md:h-56" />
                <div className="flex flex-col justify-center gap-1 text-[#e6f8ff]">
                  <span className="text-[10px] tracking-[.3em] text-[#9fe9ff]">RECOMPENSA FINAL · NIVEL 20 PREMIUM</span>
                  <span className="font-display text-2xl leading-none">POLAR ❄</span>
                  <span className="text-xs opacity-80">Skin legendaria de la temporada.</span>
                  <span className="font-display text-lg leading-none">GL-0 GLACIAR</span>
                  <span className="text-xs opacity-80">Criofusil exclusivo con pintura polar: congela y frena a quien le pega.</span>
                  {!p.premium && (
                    <button type="button" data-testid="buy-premium" className="mt-2 h-10 rounded-md bg-[#bfe6ff] font-display tracking-widest text-[#062033]"
                      onClick={() => {
                        const r = buyPremium(p);
                        if (!r.ok) return setMsg(r.msg);
                        commit(r.profile, r.msg);
                        onUnlocks?.(r.unlocks);
                      }}>
                      PREMIUM · ✦ {PREMIUM_PRICE}
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-2 text-xs text-muted">
                Nivel <b className="text-fg">{tier}</b>/{PASS.length} · {tier >= PASS.length ? `¡Completo! Cada ${TIER_XP} XP extra: +${BONUS_TIER_SPECIAL} ✦` : `${p.xp % TIER_XP}/${TIER_XP} XP para el próximo`}
              </p>
              <div className="mt-1 h-2 overflow-hidden rounded bg-line">
                <div className="h-full bg-amber" style={{ width: `${tier >= PASS.length ? 100 : ((p.xp % TIER_XP) / TIER_XP) * 100}%` }} />
              </div>
              <div className="mt-3 overflow-x-auto pb-2">
                {([["GRATIS", PASS, false], ["PREMIUM", PREMIUM, true]] as const).map(([label, track, prem]) => (
                  <div key={label} className="pass-row mt-1">
                    <div className={`flex items-center text-[10px] tracking-widest ${prem ? "text-[#9fe9ff]" : "text-muted"}`}>{label}{prem && !p.premium ? " 🔒" : ""}</div>
                    {track.map((r, i) => {
                      const done = i < tier && (!prem || p.premium);
                      return (
                        <div key={i} className={`pass-tier ${done ? "is-done" : ""} ${prem ? "is-prem" : ""} ${prem && !p.premium ? "is-locked-track" : ""} ${r.final ? "is-final" : ""}`}>
                          <span className="text-[10px] tracking-widest text-muted">NIVEL {i + 1}</span>
                          <span className="text-[11px] leading-tight">{r.final ? "❄ POLAR + GL-0 GLACIAR" : describe(r)}</span>
                          <span className="text-[10px]">{done ? "✔ COBRADO" : "🔒"}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-2 rounded-md border border-line p-2 text-[11px] leading-snug text-muted">
                <b className="text-fg">¿Cómo junto ✦?</b> Cada partida: +3 ✦ (+8 si ganás, +1 cada 5 bajas). La pista gratis da 200 ✦.
                Después del nivel 20, cada {TIER_XP} XP suma +{BONUS_TIER_SPECIAL} ✦. Y los códigos también dan ✦. El premium te devuelve 400 ✦. Sin plata real, nunca.
              </div>
            </>
          )}
          {tab === "codigos" && (
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void redeem(p, code).then((r) => {
                  if (r.ok) { commit(r.profile, r.msg); setCode(""); } else setMsg(r.msg);
                });
              }}
            >
              <p className="text-xs text-muted">¿Tenés un código? Canjealo acá. Cada código sirve una vez por perfil.</p>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ESCRIBÍ TU CÓDIGO"
                className="h-11 rounded-md border border-line bg-bg px-3 font-display tracking-widest text-fg uppercase"
                autoCapitalize="characters"
                autoComplete="off"
              />
              <button type="submit" className="h-11 rounded-md bg-amber font-display tracking-widest text-bg">CANJEAR</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
