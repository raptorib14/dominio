import { useEffect, useRef, useState } from "react";
import { describe, type Unlock } from "@/game/profile";
import { mountShowcase, unlockSound, type ShowKind } from "@/game/showcase";

export function Showcase({ kind, burst, className }: { kind: ShowKind; burst: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => (ref.current ? mountShowcase(ref.current, kind, burst) : undefined), [kind, burst]);
  return <canvas ref={ref} className={className} />;
}

/** Cola de desbloqueos: los niveles normales muestran una tarjeta chica, el final la gran revelación. */
export function UnlockShow({ items, onDone }: { items: Unlock[]; onDone: () => void }) {
  const [i, setI] = useState(0);
  const finalIdx = items.findIndex((u) => u.reward.final);
  const small = items.filter((u) => !u.reward.final);
  const showFinal = finalIdx >= 0 && i >= small.length;
  const cur = small[i];
  useEffect(() => {
    if (showFinal) {
      unlockSound(true);
      return;
    }
    if (!cur) {
      onDone();
      return;
    }
    unlockSound(false);
    const id = window.setTimeout(() => setI((x) => x + 1), small.length > 4 ? 700 : 1300);
    return () => window.clearTimeout(id);
  }, [i, showFinal]); // eslint-disable-line react-hooks/exhaustive-deps

  if (showFinal) {
    return (
      <div className="unlock-final" data-testid="unlock-final" onClick={onDone}>
        <div className="unlock-rays" />
        <div className="unlock-flash" />
        <p className="unlock-kicker">PASE PREMIUM · TEMPORADA POLAR · NIVEL 20</p>
        <Showcase kind="both" burst className="unlock-canvas" />
        <h2 className="unlock-title">¡POLAR ❄ + GL-0 GLACIAR!</h2>
        <p className="text-sm text-[#cfefff]">Skin legendaria y criofusil exclusivo del pase. Congela y frena a los enemigos.</p>
        <button type="button" className="mt-3 h-11 rounded-md bg-[#bfe6ff] px-6 font-display tracking-widest text-[#062033]" onClick={onDone}>
          ¡QUÉ BESTIA! SEGUIR
        </button>
      </div>
    );
  }
  if (!cur) return null;
  const prem = cur.track === "premium";
  return (
    <div className="unlock-small" data-testid="unlock-small" key={i} onClick={() => setI((x) => x + 1)}>
      <div className={`unlock-card ${prem ? "is-prem" : ""}`}>
        <span className="unlock-burst" />
        <span className="text-[10px] tracking-widest opacity-80">
          {cur.track === "extra" ? "NIVEL EXTRA" : `${prem ? "PREMIUM" : "GRATIS"} · NIVEL ${cur.tier}`}
        </span>
        <span className="font-display text-lg leading-tight">🎁 {describe(cur.reward)}</span>
        {small.length > 1 && <span className="text-[10px] opacity-70">{i + 1}/{small.length}</span>}
      </div>
    </div>
  );
}
