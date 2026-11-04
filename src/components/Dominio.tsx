import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Crosshair, Flag, RotateCcw, Shield, Timer, Users, Volume2, VolumeX } from "lucide-react";
import type { GameApi, PhaseInfo } from "@/game/engine";
import { MAP_LIST, type MapId } from "@/game/maps";
import { P2PRoom, type PeerInfo } from "@/lib/multiplayer/peerjs-room";
import { loadSave, type Diff, type QualityPref } from "@/game/save";
import { ABILITIES, SKINS, loadProfile, matchReward, saveProfile, type Profile } from "@/game/profile";
import { Arsenal, Wallet, type ArsenalTab } from "@/components/Arsenal";
import { UnlockShow } from "@/components/Unlock";
import type { Unlock } from "@/game/profile";

function fmtElapsed(total: number) {
  const s = Math.max(0, Math.round(total));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function Dominio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<GameApi | null>(null);
  const [screen, setScreen] = useState<PhaseInfo>({
    phase: "menu",
    kills: 0,
    deaths: 0,
    elapsed: 0,
    best: null,
    wins: 0,
    reason: "",
    map: "complejo",
    basesTaken: 0,
  });
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const [arsenal, setArsenal] = useState<ArsenalTab | null>(null);
  const [unlocks, setUnlocks] = useState<Unlock[]>([]);
  const [earned, setEarned] = useState<{ coins: number; special: number; xp: number; unlocked: string[] } | null>(null);
  const [abilState, setAbilState] = useState<{ id: string; cd: number; max: number }[]>([]);
  const prevPhase = useRef("menu");
  const [locked, setLocked] = useState(false);
  const [sens, setSens] = useState(0.0022);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);
  const [bootError, setBootError] = useState("");
  const [mapId, setMapId] = useState<MapId>("complejo");
  const [quality, setQuality] = useState<QualityPref>("auto");
  const [fov, setFov] = useState(78);
  const [botN, setBotN] = useState(6);
  const [diff, setDiff] = useState<Diff>("regular");
  const [volume, setVolume] = useState(0.85);
  const [callsign, setCallsign] = useState("Operador");
  const [advanced, setAdvanced] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [netRole, setNetRole] = useState<"solo" | "host" | "guest">("solo");
  const [netStatus, setNetStatus] = useState("");
  const [peerLabel, setPeerLabel] = useState("");
  const p2pRef = useRef<P2PRoom | null>(null);

  const hpRef = useRef<HTMLSpanElement>(null);
  const armorRef = useRef<HTMLSpanElement>(null);
  const magRef = useRef<HTMLSpanElement>(null);
  const reserveRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);
  const killsRef = useRef<HTMLSpanElement>(null);
  const alfaRef = useRef<HTMLDivElement>(null);
  const bravoRef = useRef<HTMLDivElement>(null);
  const alfaStateRef = useRef<HTMLSpanElement>(null);
  const bravoStateRef = useRef<HTMLSpanElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const hurtRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<HTMLDivElement>(null);
  const dmgNRef = useRef<HTMLDivElement>(null);
  const dmgERef = useRef<HTMLDivElement>(null);
  const dmgSRef = useRef<HTMLDivElement>(null);
  const dmgWRef = useRef<HTMLDivElement>(null);
  const reloadRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLCanvasElement>(null);
  const qualityRef = useRef<HTMLSpanElement>(null);
  const weaponRef = useRef<HTMLSpanElement>(null);
  const slotsRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const lookLast = useRef({ x: 0, y: 0, on: false });
  const stickPtr = useRef<number | null>(null);
  const stickOrigin = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const save = loadSave();
    setSens(save.sens);
    setMuted(save.muted);
    setMapId(save.map);
    setQuality(save.quality);
    setFov(save.fov);
    setBotN(save.bots);
    setDiff(save.diff);
    setVolume(save.volume);
    setCallsign(save.name);
    setScreen((prev) => ({ ...prev, best: save.best, wins: save.wins, map: save.map }));
    const canvas = canvasRef.current;
    const hudRoot = hudRef.current;
    if (
      !canvas ||
      !hudRoot ||
      !hpRef.current ||
      !armorRef.current ||
      !magRef.current ||
      !reserveRef.current ||
      !timerRef.current ||
      !killsRef.current ||
      !alfaRef.current ||
      !bravoRef.current ||
      !alfaStateRef.current ||
      !bravoStateRef.current ||
      !bannerRef.current ||
      !fpsRef.current ||
      !feedRef.current ||
      !crossRef.current ||
      !hurtRef.current ||
      !hitRef.current ||
      !dmgNRef.current ||
      !dmgERef.current ||
      !dmgSRef.current ||
      !dmgWRef.current ||
      !reloadRef.current ||
      !mapRef.current ||
      !qualityRef.current ||
      !weaponRef.current ||
      !slotsRef.current ||
      !scopeRef.current
    ) {
      return;
    }
    let dead = false;
    let dispose = () => {};
    void import("@/game/engine")
      .then(({ createGame }) => {
        if (dead) return;
        const game = createGame(
          canvas,
          {
            hp: hpRef.current!,
            armor: armorRef.current!,
            mag: magRef.current!,
            reserve: reserveRef.current!,
            timer: timerRef.current!,
            kills: killsRef.current!,
            alfaFill: alfaRef.current!,
            bravoFill: bravoRef.current!,
            alfaState: alfaStateRef.current!,
            bravoState: bravoStateRef.current!,
            banner: bannerRef.current!,
            fps: fpsRef.current!,
            feed: feedRef.current!,
            cross: crossRef.current!,
            hurt: hurtRef.current!,
            hit: hitRef.current!,
            dmgN: dmgNRef.current!,
            dmgE: dmgERef.current!,
            dmgS: dmgSRef.current!,
            dmgW: dmgWRef.current!,
            reloadBar: reloadRef.current!,
            minimap: mapRef.current!,
            quality: qualityRef.current!,
            weaponName: weaponRef.current!,
            slots: slotsRef.current!,
            scope: scopeRef.current!,
            root: hudRoot,
          },
          (info) => setScreen(info),
          (isLocked) => setLocked(isLocked),
        );
        game.setSens(save.sens);
        game.setMuted(save.muted);
        game.setVolume(save.volume);
        api.current = game;
        dispose = () => game.dispose();
        setReady(true);
      })
      .catch((err: unknown) => {
        setBootError(err instanceof Error ? err.message : "No se pudo iniciar el mapa");
      });
    return () => {
      dead = true;
      dispose();
      api.current = null;
      p2pRef.current?.close();
      p2pRef.current = null;
    };
  }, []);

  useEffect(() => {
    const g = api.current;
    if (!g) return;
    g.setLoadout(profile.loadout);
    g.setAbilities(profile.equipped);
    const sk = SKINS.find((s) => s.id === profile.skin);
    g.setSkin(!sk || sk.color < 0 ? null : sk.color);
  }, [profile, ready]);

  useEffect(() => {
    const prev = prevPhase.current;
    prevPhase.current = screen.phase;
    if ((screen.phase === "win" || screen.phase === "lose") && prev === "play") {
      const cur = loadProfile();
      const r = matchReward(cur, screen.kills, screen.basesTaken, screen.phase === "win");
      saveProfile(r.profile);
      setProfile(r.profile);
      setEarned({ coins: r.coins, special: r.special, xp: r.xp, unlocked: r.unlocked });
      if (r.unlocks.length) setUnlocks(r.unlocks);
    } else if (screen.phase === "play") setEarned(null);
  }, [screen]);

  useEffect(() => {
    if (screen.phase !== "play") return;
    const id = window.setInterval(() => setAbilState(api.current?.getAbilities() ?? []), 150);
    return () => window.clearInterval(id);
  }, [screen.phase]);

  const loadoutNames = profile.loadout.map((id) => ({ rifle: "R-47", smg: "VX-9", shot: "SC-12", pistol: "P-19", dmr: "M-90", lmg: "AM-60", revolver: "RV-44", carbine: "K-4", glaciar: "GL-0" })[id]);

  const announced = useRef(new Set<string>());

  function closeRoom() {
    p2pRef.current?.close();
    p2pRef.current = null;
    announced.current.clear();
    api.current?.attachNet(null);
    setRoomCode("");
    setNetRole("solo");
    setNetStatus("");
    setPeerLabel("");
  }

  function openRoom(code: string, role: "host" | "guest") {
    const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
    if (clean.length < 4) {
      setNetStatus("El código tiene 4 caracteres.");
      return;
    }
    p2pRef.current?.close();
    announced.current.clear();
    const room = new P2PRoom({
      room: clean,
      role,
      onError: (msg) => setNetStatus(msg),
      name: callsign.trim().slice(0, 16) || "Operador",
      onPeersChanged: (peers: PeerInfo[]) => {
        const linked = peers.find((p) => p.connectionState === "connected");
        if (linked) {
          setPeerLabel(linked.name || "Aliado");
          setNetStatus(`Enlace con ${linked.name || "aliado"}${linked.rttMs != null ? ` · ${linked.rttMs} ms` : ""}`);
          api.current?.setAllyName(linked.name || "Aliado");
          if (role === "host" && !announced.current.has(linked.id)) {
            announced.current.add(linked.id);
            api.current?.announce();
          }
        } else if (peers.some((p) => p.connectionState === "failed")) {
          setPeerLabel("");
          setNetStatus("Sin enlace directo. Prueben en la misma red Wi-Fi.");
        } else if (peers.length) {
          setNetStatus("Conectando…");
        } else {
          setPeerLabel("");
          setNetStatus(role === "host" ? "Sala abierta. Pasa el código." : "Buscando al anfitrión…");
        }
      },
      onMessage: (from, data) => {
        api.current?.ingest(data, from);
      },
      onConnected: () => {
        setNetStatus((prev) => prev || (role === "host" ? "Sala abierta. Pasa el código." : "Dentro de la sala."));
      },
    });
    p2pRef.current = room;
    setRoomCode(clean);
    setNetRole(role);
    api.current?.attachNet({
      role,
      name: callsign.trim().slice(0, 16) || "Operador",
      broadcast: (data) => room.broadcast(data),
      send: (data) => room.send(data),
    });
    void room.join();
  }

  const playing = screen.phase === "play";
  const showTouch = playing && !locked;

  return (
    <div className="relative h-dvh w-full touch-none overflow-hidden bg-bg text-fg">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="vignette" />
      <div ref={scopeRef} className="scope-overlay" />

      <div ref={hudRef} className="pointer-events-none absolute inset-0 hidden">
        <div ref={hurtRef} className="hurt-vignette" />
        <div ref={dmgNRef} className="dmg-edge n" />
        <div ref={dmgERef} className="dmg-edge e" />
        <div ref={dmgSRef} className="dmg-edge s" />
        <div ref={dmgWRef} className="dmg-edge w" />
        <div ref={crossRef} className="crosshair">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div ref={hitRef} className="hitmark" />

        <div className="absolute inset-x-0 top-3 flex justify-center px-16">
          <div className="flex items-stretch gap-2 rounded-md border border-line bg-surface/80 px-2 py-1.5 backdrop-blur-sm">
            <BaseBar name="ALFA" fillRef={alfaRef} stateRef={alfaStateRef} />
            <div className="flex w-16 flex-col items-center justify-center">
              <Timer className="size-3.5 text-amber" aria-hidden />
              <span ref={timerRef} className="font-display text-xl leading-none tracking-wide">
                3:30
              </span>
            </div>
            <BaseBar name="BRAVO" fillRef={bravoRef} stateRef={bravoStateRef} />
          </div>
        </div>

        <div
          ref={bannerRef}
          className="absolute inset-x-0 top-20 text-center font-display text-lg tracking-wide text-amber"
        />

        <canvas ref={mapRef} className="hud-map rounded-md border border-line" />

        <div className="hud-hp">
          <p className="font-display text-4xl leading-none">
            <span ref={hpRef}>100</span>
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted">
            <Shield className="size-3.5 text-cyan" aria-hidden />
            <span ref={armorRef}>50</span>
            <span className="ml-2">
              <span ref={killsRef}>0 / 0</span>
            </span>
          </p>
        </div>

        <div className="hud-ammo">
          <p className="font-display text-xs tracking-widest text-muted">
            <span ref={weaponRef}>R-47 · FUSIL</span>
          </p>
          <p className="font-display text-4xl leading-none">
            <span ref={magRef}>30</span>
            <span className="text-muted"> / </span>
            <span ref={reserveRef} className="text-2xl text-muted">
              120
            </span>
          </p>
          <div className="mt-1 h-1 w-24 overflow-hidden bg-line md:ml-auto">
            <div ref={reloadRef} className="h-full origin-left bg-amber" />
          </div>
          <div ref={slotsRef} className="pointer-events-auto relative z-30 mt-2 flex justify-end gap-1">
            {loadoutNames.map((n, i) => (
              <button
                key={i}
                type="button"
                className="wep-slot"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  api.current?.selectWeapon(i);
                }}
              >
                {i + 1} {n}
              </button>
            ))}
          </div>
          <div className="pointer-events-auto relative z-30 mt-1 hidden justify-end gap-1 md:flex">
            {abilState.map((a, i) => (
              <button key={a.id} type="button" className="wep-slot abil-btn" onClick={(e) => { e.stopPropagation(); api.current?.useAbility(i); }}>
                {i === 0 ? "E" : "F"} {ABILITIES.find((x) => x.id === a.id)?.name}
                <span className="cd" style={{ transform: `scaleY(${a.max ? a.cd / a.max : 0})` }} />
              </button>
            ))}
          </div>
        </div>

        <div ref={feedRef} className="absolute right-4 top-24 whitespace-pre text-right text-xs text-muted" />
        <span ref={fpsRef} className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted" />
        <span ref={qualityRef} className="hidden" />

        <button
          type="button"
          className="pointer-events-auto absolute right-3 top-3 z-30 rounded-md border border-line bg-surface/80 px-3 py-2 text-xs tracking-widest"
          onClick={() => api.current?.pause()}
        >
          PAUSA
        </button>
      </div>

      {showTouch && (
        <>
          <div
            className="look-pad z-10"
            onPointerDown={(e) => {
              lookLast.current = { x: e.clientX, y: e.clientY, on: true };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!lookLast.current.on) return;
              const dx = e.clientX - lookLast.current.x;
              const dy = e.clientY - lookLast.current.y;
              lookLast.current.x = e.clientX;
              lookLast.current.y = e.clientY;
              if (dx !== 0 || dy !== 0) api.current?.addLook(dx, dy);
            }}
            onPointerUp={() => {
              lookLast.current.on = false;
            }}
            onPointerCancel={() => {
              lookLast.current.on = false;
            }}
          />
          <div
            className="absolute bottom-6 left-4 z-20"
            onPointerDown={(e) => {
              stickPtr.current = e.pointerId;
              stickOrigin.current = { x: e.clientX, y: e.clientY };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (stickPtr.current !== e.pointerId) return;
              const dx = e.clientX - stickOrigin.current.x;
              const dy = e.clientY - stickOrigin.current.y;
              const len = Math.hypot(dx, dy) || 1;
              const m = Math.min(1, len / 56);
              api.current?.setTouchMove((dx / len) * m, (-dy / len) * m);
            }}
            onPointerUp={() => {
              stickPtr.current = null;
              api.current?.setTouchMove(0, 0);
            }}
            onPointerCancel={() => {
              stickPtr.current = null;
              api.current?.setTouchMove(0, 0);
            }}
          >
            <div className="stick-base" />
          </div>
          <div className="absolute bottom-5 right-4 z-20 flex flex-col items-end gap-2">
            <HoldButton label="FUEGO" primary onDown={() => api.current?.setFireHeld(true)} onUp={() => api.current?.setFireHeld(false)} />
            <div className="flex gap-2">
              <HoldButton label="MIRA" onDown={() => api.current?.setAdsHeld(true)} onUp={() => api.current?.setAdsHeld(false)} />
              <TapButton label="RECARGAR" onClick={() => api.current?.reload()} />
              <TapButton label="ARMA" onClick={() => api.current?.cycleWeapon()} />
            </div>
            <div className="flex gap-2">
              {abilState.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  className="abil-btn h-12 min-w-16 rounded-md border border-cyan/70 bg-surface/85 px-3 text-xs tracking-wide text-cyan"
                  onPointerDown={(e) => { e.stopPropagation(); api.current?.useAbility(i); }}
                >
                  {a.cd > 0 ? Math.ceil(a.cd) : ABILITIES.find((x) => x.id === a.id)?.name}
                  <span className="cd" style={{ transform: `scaleY(${a.max ? a.cd / a.max : 0})` }} />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <TapButton label="SALTO" onClick={() => api.current?.jump()} />
              <TapButton label="AGACHAR" onClick={() => api.current?.toggleCrouch()} />
              <HoldButton label="CORRER" onDown={() => api.current?.setSprintHeld(true)} onUp={() => api.current?.setSprintHeld(false)} />
            </div>
          </div>
        </>
      )}

      {screen.phase === "menu" && (
        <div className="absolute inset-0 flex items-end p-4 md:items-center md:p-10">
          <section className="max-h-full w-full max-w-xl overflow-y-auto rounded-lg border border-line bg-surface/90 p-5 shadow-lg backdrop-blur-md md:p-7">
            <p className="flex items-center gap-2 text-xs tracking-widest text-amber">
              <Flag className="size-3.5" aria-hidden />
              FUERZA TÁCTICA · CAPTURA
            </p>
            <h1 className="dominio-title mt-2 font-display text-5xl leading-none tracking-wide md:text-6xl [@media(max-height:500px)]:text-4xl">DOMINIO</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Elegí mapa, ajustá la operación y capturá ALFA y BRAVO. En cooperativo, un amigo entra con el código y
              disparan juntos.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {MAP_LIST.map((map) => (
                <button
                  key={map.id}
                  type="button"
                  className={`map-card map-${map.id} relative overflow-hidden rounded-md border px-2 py-2 text-left transition ${mapId === map.id ? "border-amber bg-amber/15 ring-1 ring-amber/60" : "border-line hover:border-amber/50"}`}
                  onClick={() => {
                    setMapId(map.id);
                    api.current?.setMap(map.id);
                  }}
                >
                  <span className="block font-display text-sm tracking-wide">{map.name}</span>
                  <span className="mt-1 block text-[11px] leading-snug text-muted">{map.blurb}</span>
                </button>
              ))}
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md border border-line px-2 py-2">
                <dt className="text-xs text-muted">Bases</dt>
                <dd className="font-display text-xl">2</dd>
              </div>
              <div className="rounded-md border border-line px-2 py-2">
                <dt className="text-xs text-muted">Guardias</dt>
                <dd className="font-display text-xl">{botN}</dd>
              </div>
              <div className="rounded-md border border-line px-2 py-2">
                <dt className="text-xs text-muted">Mejor</dt>
                <dd className="font-display text-xl">{screen.best === null ? "—" : fmtElapsed(screen.best)}</dd>
              </div>
            </dl>
            <div className="mt-3 rounded-md border border-line p-3" data-testid="perfil">
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-widest text-muted">TU EQUIPO</p>
                <Wallet p={profile} />
              </div>
              <p className="mt-1 text-xs text-muted">
                Armas: <b className="text-fg">{loadoutNames.join(" · ")}</b> · Habilidades:{" "}
                <b className="text-fg">{profile.equipped.map((a) => ABILITIES.find((x) => x.id === a)?.name).join(" · ")}</b>
              </p>
              <div className="mt-2 grid grid-cols-4 gap-1">
                {([["armeria", "ARMERÍA"], ["habilidades", "HABILIDADES"], ["pase", "PASE"], ["codigos", "CÓDIGOS"]] as [ArsenalTab, string][]).map(([id, label]) => (
                  <button key={id} type="button" className="h-9 rounded-md border border-line text-[11px] tracking-widest hover:border-amber" onClick={() => setArsenal(id)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 rounded-md border border-line p-3">
              <p className="flex items-center gap-2 text-xs tracking-widest text-muted">
                <Users className="size-3.5" aria-hidden />
                MULTIJUGADOR
              </p>
              <label className="mt-2 flex flex-col gap-1 text-xs text-muted">
                Indicativo
                <input
                  value={callsign}
                  maxLength={16}
                  suppressHydrationWarning
                  className="h-9 rounded-md border border-line bg-bg px-2 text-sm text-fg"
                  onChange={(e) => setCallsign(e.target.value)}
                />
              </label>
              {netRole === "solo" ? (
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    className="h-10 flex-1 rounded-md bg-cyan/20 font-display tracking-widest text-fg"
                    onClick={() => {
                      const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
                      let c = "";
                      for (let i = 0; i < 4; i++) c += abc[Math.floor(Math.random() * abc.length)];
                      openRoom(c, "host");
                    }}
                  >
                    CREAR SALA
                  </button>
                  <input
                    value={joinCode}
                    maxLength={4}
                    placeholder="CÓDIGO"
                    suppressHydrationWarning
                    className="h-10 w-24 rounded-md border border-line bg-bg px-2 text-center font-display tracking-widest uppercase"
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  />
                  <button
                    type="button"
                    className="h-10 rounded-md border border-line px-3 font-display tracking-widest"
                    onClick={() => openRoom(joinCode, "guest")}
                  >
                    UNIRSE
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="font-display text-2xl tracking-[0.3em]">{roomCode}</p>
                  <button type="button" className="h-9 rounded-md border border-line px-3 text-xs" onClick={closeRoom}>
                    SALIR
                  </button>
                </div>
              )}
              {netStatus && <p className="mt-2 text-xs text-amber">{netStatus}</p>}
              {peerLabel && <p className="text-xs text-muted">Compañero: {peerLabel}</p>}
              <p className="mt-2 text-[11px] leading-snug text-muted">
                Abrí DOMINIO en otro dispositivo (compu, iPad o celu), poné el código y tocá UNIRSE. Después el
                anfitrión toca DESPLEGAR COOP. Sin cuentas: el juego va directo entre los dos.
              </p>
            </div>
            <button
              type="button"
              disabled={!ready || netRole === "guest"}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-amber font-display text-lg tracking-widest text-bg disabled:opacity-60"
              onClick={() => api.current?.start()}
            >
              <Crosshair className="size-5" aria-hidden />
              {!ready ? "CARGANDO" : netRole === "guest" ? "ESPERA AL ANFITRIÓN" : netRole === "host" ? "DESPLEGAR COOP" : "DESPLEGAR"}
            </button>
            {bootError && <p className="mt-2 text-sm text-danger">{bootError}</p>}
            <button type="button" className="mt-3 text-xs tracking-widest text-muted" onClick={() => setAdvanced((v) => !v)}>
              {advanced ? "OCULTAR OPCIONES" : "OPCIONES AVANZADAS"}
            </button>
            {advanced && (
              <div className="mt-3 grid gap-3">
                <Choice
                  label="Calidad"
                  value={quality}
                  options={[
                    ["auto", "AUTO"],
                    ["rendimiento", "RENDIMIENTO"],
                    ["realista", "REALISTA"],
                  ]}
                  onPick={(id) => {
                    const next = id as QualityPref;
                    setQuality(next);
                    api.current?.setQualityPref(next);
                  }}
                />
                <Choice
                  label="Dificultad"
                  value={diff}
                  options={[
                    ["recluta", "RECLUTA"],
                    ["regular", "REGULAR"],
                    ["veterano", "VETERANO"],
                  ]}
                  onPick={(id) => {
                    const next = id as Diff;
                    setDiff(next);
                    api.current?.setDiff(next);
                  }}
                />
                <Choice
                  label="Guardias"
                  value={String(botN)}
                  options={[
                    ["4", "4"],
                    ["6", "6"],
                    ["8", "8"],
                  ]}
                  onPick={(id) => {
                    const next = Number(id);
                    setBotN(next);
                    api.current?.setBotCount(next);
                  }}
                />
                <label className="flex flex-col gap-1 text-xs text-muted">
                  Campo de visión {Math.round(fov)}
                  <input
                    type="range"
                    min={60}
                    max={100}
                    step={1}
                    value={fov}
                    suppressHydrationWarning
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setFov(value);
                      api.current?.setFov(value);
                    }}
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-muted">
                  Volumen
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    suppressHydrationWarning
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setVolume(value);
                      api.current?.setVolume(value);
                    }}
                  />
                </label>
              </div>
            )}
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted">
              <li>WASD — mover</li>
              <li>Ratón — apuntar</li>
              <li>Clic — disparar</li>
              <li>Clic derecho — mira</li>
              <li>1–5 — armas</li>
              <li>Q / rueda — cambiar</li>
              <li>R — recargar</li>
              <li>Shift — correr</li>
              <li>Ctrl — agacharse</li>
              <li>Espacio — saltar</li>
            </ul>
            <div className="mt-4 flex items-center gap-3">
              <label className="flex flex-1 flex-col gap-1 text-xs text-muted">
                Sensibilidad
                <input
                  type="range"
                  min={0.0008}
                  max={0.0055}
                  step={0.0001}
                  value={sens}
                  suppressHydrationWarning
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setSens(value);
                    api.current?.setSens(value);
                  }}
                />
              </label>
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-md border border-line"
                aria-label={muted ? "Activar sonido" : "Silenciar"}
                onClick={() => {
                  const next = !muted;
                  setMuted(next);
                  api.current?.setMuted(next);
                }}
              >
                {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
            </div>
            <p className="mt-3 text-xs text-muted">
              {screen.wins > 0 ? `${screen.wins} captura${screen.wins === 1 ? "" : "s"} completada${screen.wins === 1 ? "" : "s"}. ` : ""}
              Si el cursor no se captura, arrastra con el dedo o el ratón y usa los botones.
            </p>
          </section>
        </div>
      )}

      {screen.phase === "pause" && (
        <Overlay
          kicker="EN ESPERA"
          title="PAUSA"
          body="El asalto está congelado. Vuelve al fuego o retírate al briefing."
          primary="VOLVER AL FUEGO"
          onPrimary={() => api.current?.resume()}
          secondary="MENÚ"
          onSecondary={() => api.current?.toMenu()}
        />
      )}

      {arsenal && screen.phase === "menu" && (
        <Arsenal profile={profile} setProfile={setProfile} tab={arsenal} setTab={setArsenal} onClose={() => setArsenal(null)} onUnlocks={setUnlocks} />
      )}
      {unlocks.length > 0 && <UnlockShow key={unlocks.map((u) => u.text).join("|")} items={unlocks} onDone={() => setUnlocks([])} />}

      {(screen.phase === "win" || screen.phase === "lose") && (
        <Overlay
          kicker={screen.phase === "win" ? "OBJETIVO CUMPLIDO" : "RONDA PERDIDA"}
          title={screen.phase === "win" ? "BASES ASEGURADAS" : "TIEMPO AGOTADO"}
          body={screen.reason}
          extra={earned && (
            <div className="mt-3 rounded-md border border-amber/50 bg-amber/10 p-2 text-sm" data-testid="earned">
              <p className="font-display tracking-wide text-amber">+{earned.coins} monedas · +{earned.special} ✦ · +{earned.xp} XP</p>
              {earned.unlocked.map((u) => <p key={u} className="text-xs text-cyan">🎁 {u}</p>)}
            </div>
          )}
          primary="OTRA RONDA"
          onPrimary={() => api.current?.start()}
          secondary="MENÚ"
          onSecondary={() => api.current?.toMenu()}
          stats={[
            ["Tiempo", fmtElapsed(screen.elapsed)],
            ["Bajas", String(screen.kills)],
            ["Caídas", String(screen.deaths)],
            ["Mejor", screen.best === null ? "—" : fmtElapsed(screen.best)],
          ]}
        />
      )}
    </div>
  );
}

function Choice({
  label,
  value,
  options,
  onPick,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onPick: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <div className="mt-1 flex gap-1">
        {options.map(([id, text]) => (
          <button
            key={id}
            type="button"
            className={`h-8 flex-1 rounded-md border text-[11px] tracking-wide ${value === id ? "border-amber bg-amber/15" : "border-line text-muted"}`}
            onClick={() => onPick(id)}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function BaseBar({
  name,
  fillRef,
  stateRef,
}: {
  name: string;
  fillRef: RefObject<HTMLDivElement | null>;
  stateRef: RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div className="w-24 md:w-36">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display text-sm tracking-widest">{name}</span>
        <span ref={stateRef} className="text-xs text-muted">
          HOSTIL
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden bg-cyan/30">
        <div ref={fillRef} className="h-full origin-left scale-x-0 bg-amber" />
      </div>
    </div>
  );
}

function Overlay({
  kicker,
  title,
  body,
  primary,
  onPrimary,
  secondary,
  onSecondary,
  stats,
  extra,
}: {
  extra?: ReactNode;
  kicker: string;
  title: string;
  body: string;
  primary: string;
  onPrimary: () => void;
  secondary: string;
  onSecondary: () => void;
  stats?: [string, string][];
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-bg/55 p-4 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-lg border border-line bg-surface p-6 text-center">
        <p className="text-xs tracking-widest text-amber">{kicker}</p>
        <h2 className="mt-2 font-display text-4xl tracking-wide">{title}</h2>
        <p className="mt-2 text-sm text-muted">{body}</p>
        {extra}
        {stats && (
          <dl className="mt-4 grid grid-cols-4 gap-2">
            {stats.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="font-display text-xl">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <button
          type="button"
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-amber font-display text-lg tracking-widest text-bg"
          onClick={onPrimary}
        >
          <RotateCcw className="size-4" aria-hidden />
          {primary}
        </button>
        <button type="button" className="mt-2 h-11 w-full rounded-md border border-line text-sm" onClick={onSecondary}>
          {secondary}
        </button>
      </section>
    </div>
  );
}

function HoldButton({
  label,
  primary,
  onDown,
  onUp,
}: {
  label: string;
  primary?: boolean;
  onDown: () => void;
  onUp: () => void;
}) {
  return (
    <button
      type="button"
      className={
        primary
          ? "h-16 min-w-28 rounded-full bg-danger px-4 font-display tracking-widest text-fg"
          : "h-12 min-w-16 rounded-md border border-line bg-surface/85 px-3 text-xs tracking-wide"
      }
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        e.stopPropagation();
        onDown();
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        onUp();
      }}
      onPointerCancel={onUp}
    >
      {label}
    </button>
  );
}

function TapButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="h-12 min-w-16 rounded-md border border-line bg-surface/85 px-3 text-xs tracking-wide"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {label}
    </button>
  );
}
