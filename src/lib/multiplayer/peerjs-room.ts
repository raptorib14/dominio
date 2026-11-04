/**
 * Serverless room transport for static hosting (GitHub Pages).
 * Uses the free PeerJS public broker only for signaling; game data goes
 * browser-to-browser over WebRTC. Host claims id "dominio-<CODE>-h";
 * guests connect to it and the host relays guest messages to everyone (star).
 * Same surface as the old P2PRoom so Dominio.tsx barely changes.
 */
import Peer, { type DataConnection } from "peerjs";

export interface PeerInfo {
  id: string;
  name: string;
  connectionState: RTCPeerConnectionState;
  candidateType: string | null;
  rttMs: number | null;
}

export interface PeerRoomOptions {
  room: string;
  role: "host" | "guest";
  name?: string;
  onPeersChanged?: (peers: PeerInfo[]) => void;
  onMessage?: (from: string, data: unknown, channel: "state" | "reliable") => void;
  onConnected?: () => void;
  onError?: (msg: string) => void;
}

const ICE: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export class P2PRoom {
  private peer: Peer | null = null;
  private conns = new Map<string, DataConnection>();
  private info = new Map<string, PeerInfo>();
  private closed = false;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  constructor(private opts: PeerRoomOptions) {}

  private hostId() {
    return `dominio-${this.opts.room}-h`;
  }

  private emit() {
    this.opts.onPeersChanged?.([...this.info.values()]);
  }

  private wire(c: DataConnection) {
    const id = c.peer;
    const meta = (c.metadata ?? {}) as { name?: string };
    this.info.set(id, { id, name: meta.name || "Aliado", connectionState: "connecting", candidateType: null, rttMs: null });
    this.emit();
    c.on("open", () => {
      this.conns.set(id, c);
      const i = this.info.get(id);
      if (i) i.connectionState = "connected";
      // tell the other side our name
      c.send({ __hello: this.opts.name || "Operador" });
      this.emit();
    });
    c.on("data", (raw) => {
      const d = raw as Record<string, unknown> | null;
      if (d && typeof d === "object") {
        if ("__hello" in d) {
          const i = this.info.get(id);
          if (i) i.name = String(d.__hello).slice(0, 16);
          this.emit();
          return;
        }
        if ("__full" in d) {
          this.opts.onError?.("La sala está llena (máximo 2 jugadores).");
          return;
        }
        if ("__ping" in d) {
          c.send({ __pong: d.__ping });
          return;
        }
        if ("__pong" in d) {
          const i = this.info.get(id);
          if (i) i.rttMs = Math.round(performance.now() - Number(d.__pong));
          this.emit();
          return;
        }
        if ("__relay" in d) {
          // host -> guest relay of another guest's message
          const r = d as { __from: string; __relay: unknown };
          this.opts.onMessage?.(r.__from, r.__relay, "reliable");
          return;
        }
      }
      this.opts.onMessage?.(id, raw, "reliable");
      if (this.opts.role === "host") {
        for (const [oid, oc] of this.conns) if (oid !== id && oc.open) oc.send({ __from: id, __relay: raw });
      }
    });
    const drop = () => {
      this.conns.delete(id);
      this.info.delete(id);
      this.emit();
    };
    c.on("close", drop);
    c.on("error", () => {
      const i = this.info.get(id);
      if (i) i.connectionState = "failed";
      this.emit();
    });
  }

  async join(): Promise<void> {
    const { role } = this.opts;
    const peer = role === "host" ? new Peer(this.hostId(), { config: { iceServers: ICE } }) : new Peer({ config: { iceServers: ICE } });
    this.peer = peer;
    peer.on("open", () => {
      if (this.closed) return;
      this.opts.onConnected?.();
      if (role === "guest") {
        const c = peer.connect(this.hostId(), { reliable: true, metadata: { name: this.opts.name } });
        this.wire(c);
      }
      this.emit();
    });
    if (role === "host")
      peer.on("connection", (c) => {
        // co-op is 2 players (host + 1 guest): turn away extras politely
        if (this.conns.size >= 1 || [...this.info.values()].some((i) => i.connectionState === "connecting")) {
          c.on("open", () => {
            c.send({ __full: true });
            setTimeout(() => c.close(), 2000);
          });
          return;
        }
        this.wire(c);
      });
    peer.on("error", (e: { type?: string }) => {
      if (e.type === "unavailable-id") this.opts.onError?.("Ese código ya está en uso. Probá con otro.");
      else if (e.type === "peer-unavailable") this.opts.onError?.("No existe esa sala (o el anfitrión cerró).");
      else if (e.type === "network" || e.type === "server-error" || e.type === "socket-error")
        this.opts.onError?.("Sin conexión con el servidor de salas.");
      else this.opts.onError?.(`Error de red: ${e.type ?? "desconocido"}`);
    });
    this.pingTimer = setInterval(() => {
      for (const c of this.conns.values()) if (c.open) c.send({ __ping: performance.now() });
    }, 2000);
  }

  close(): void {
    this.closed = true;
    if (this.pingTimer) clearInterval(this.pingTimer);
    for (const c of this.conns.values()) c.close();
    this.conns.clear();
    this.info.clear();
    this.peer?.destroy();
    this.peer = null;
  }

  broadcast(data: unknown): void {
    for (const c of this.conns.values()) if (c.open) c.send(data);
  }

  send(data: unknown, peerId?: string): void {
    if (peerId) {
      const c = this.conns.get(peerId);
      if (c?.open) c.send(data);
    } else this.broadcast(data);
  }

  peerList(): PeerInfo[] {
    return [...this.info.values()];
  }
}
