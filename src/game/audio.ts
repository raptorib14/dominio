export type AudioBus = {
  unlock: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  shot: (volume?: number, pan?: number, profile?: "rifle" | "smg" | "shot" | "pistol" | "dmr") => void;
  hit: (head: boolean) => void;
  hurt: () => void;
  reload: () => void;
  empty: () => void;
  secure: () => void;
  blip: () => void;
  down: () => void;
};

export function createAudio(): AudioBus {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let sfx: GainNode | null = null;
  let noise: AudioBuffer | null = null;
  let muted = false;
  let volume = 0.85;
  let windStarted = false;

  function ensure() {
    if (ctx) return ctx;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctx({ latencyHint: "interactive" });
    master = ctx.createGain();
    master.gain.value = muted ? 0 : volume;
    sfx = ctx.createGain();
    sfx.gain.value = 1;
    sfx.connect(master);
    master.connect(ctx.destination);
    const len = ctx.sampleRate;
    noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return ctx;
  }

  function unlock() {
    const ac = ensure();
    if (ac.state === "suspended") void ac.resume();
    if (!windStarted && noise && sfx && ctx) {
      windStarted = true;
      const src = ctx.createBufferSource();
      src.buffer = noise;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 320;
      const g = ctx.createGain();
      g.gain.value = 0.018;
      src.connect(filter);
      filter.connect(g);
      g.connect(sfx);
      src.start();
    }
  }

  function setMuted(next: boolean) {
    muted = next;
    if (master && ctx) master.gain.setTargetAtTime(next ? 0 : volume, ctx.currentTime, 0.03);
  }

  function setVolume(next: number) {
    volume = Math.max(0, Math.min(1, next));
    if (master && ctx && !muted) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.03);
  }

  function tone(
    freq: number,
    dur: number,
    type: OscillatorType,
    gain: number,
    slideTo?: number,
    pan = 0,
  ) {
    if (!ctx || !sfx || muted) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const p = ctx.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    osc.connect(g);
    g.connect(p);
    p.connect(sfx);
    osc.start(t);
    osc.stop(t + dur + 0.02);
    osc.onended = () => {
      osc.disconnect();
      g.disconnect();
      p.disconnect();
    };
  }

  function burst(freq: number, q: number, dur: number, gain: number, pan = 0) {
    if (!ctx || !sfx || !noise || muted) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq;
    filter.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const p = ctx.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    src.connect(filter);
    filter.connect(g);
    g.connect(p);
    p.connect(sfx);
    src.start(t);
    src.stop(t + dur + 0.02);
    src.onended = () => {
      src.disconnect();
      filter.disconnect();
      g.disconnect();
      p.disconnect();
    };
  }

  return {
    unlock,
    setMuted,
    setVolume,
    shot(volume = 1, pan = 0, profile: "rifle" | "smg" | "shot" | "pistol" | "dmr" = "rifle") {
      unlock();
      const v = volume * (0.9 + Math.random() * 0.15);
      if (profile === "shot") {
        burst(180, 0.45, 0.2, 0.62 * v, pan);
        burst(640, 0.7, 0.07, 0.28 * v, pan);
        tone(80, 0.18, "triangle", 0.32 * v, 36, pan);
        return;
      }
      if (profile === "smg") {
        burst(1900 + Math.random() * 300, 0.85, 0.04, 0.3 * v, pan);
        tone(240, 0.045, "triangle", 0.1 * v, 90, pan);
        return;
      }
      if (profile === "pistol") {
        burst(1500, 1.15, 0.055, 0.38 * v, pan);
        tone(260, 0.07, "triangle", 0.16 * v, 70, pan);
        tone(1900, 0.02, "square", 0.035 * v, 700, pan);
        return;
      }
      if (profile === "dmr") {
        burst(820, 0.55, 0.13, 0.48 * v, pan);
        tone(100, 0.16, "triangle", 0.3 * v, 42, pan);
        tone(2300, 0.035, "square", 0.05 * v, 420, pan);
        return;
      }
      burst(1400 + Math.random() * 400, 0.7, 0.09, 0.55 * v, pan);
      tone(160 + Math.random() * 30, 0.12, "triangle", 0.28 * v, 55, pan);
      tone(2200, 0.03, "square", 0.05 * v, 800, pan);
    },
    hit(head) {
      unlock();
      burst(head ? 2800 : 1800, 2.4, 0.05, head ? 0.28 : 0.16);
      tone(head ? 880 : 520, 0.06, "square", head ? 0.08 : 0.04, 200);
    },
    hurt() {
      unlock();
      burst(240, 0.6, 0.18, 0.35);
      tone(90, 0.2, "sawtooth", 0.12, 40);
    },
    reload() {
      unlock();
      tone(420, 0.05, "square", 0.05, 180);
      window.setTimeout(() => tone(640, 0.04, "square", 0.04, 300), 160);
      window.setTimeout(() => burst(900, 1.2, 0.04, 0.08), 280);
    },
    empty() {
      unlock();
      tone(180, 0.03, "square", 0.06, 80);
    },
    secure() {
      unlock();
      tone(523, 0.08, "triangle", 0.08);
      window.setTimeout(() => tone(784, 0.12, "triangle", 0.08), 90);
    },
    blip() {
      unlock();
      tone(660, 0.05, "sine", 0.04);
    },
    down() {
      unlock();
      tone(220, 0.1, "triangle", 0.07, 110);
    },
  };
}
