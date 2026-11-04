import { useEffect, useRef, useState } from "react";

export function Intro({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [fading, setFading] = useState(false);
  const done = useRef(false);
  const finish = (instant = false) => {
    if (done.current) return;
    done.current = true;
    if (instant) return onDone();
    setFading(true);
    setTimeout(onDone, 500);
  };
  useEffect(() => {
    const v = ref.current;
    if (!v) return finish(true);
    v.muted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => finish(true));
    const key = () => finish();
    window.addEventListener("keydown", key);
    const guard = setTimeout(() => finish(), 9000);
    return () => { window.removeEventListener("keydown", key); clearTimeout(guard); };
  }, []);
  return (
    <div
      data-testid="intro"
      onPointerDown={() => finish()}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", opacity: fading ? 0 : 1, transition: "opacity .5s ease", cursor: "pointer" }}
    >
      <video
        ref={ref}
        src={`${import.meta.env.BASE_URL}forge-games-intro.mp4`}
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={() => finish()}
        onError={() => finish(true)}
        style={{ width: "min(80vw, 80vh, 480px)", height: "auto", pointerEvents: "none" }}
      />
    </div>
  );
}
