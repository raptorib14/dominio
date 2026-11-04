# DOMINIO — notas para el host
Juego FPS 3D (three.js + React) estilo CS: capturar bases ALFA y BRAVO contra bots, 5 armas, 3:30 de tiempo.
Original: TanStack Start + servidor (Vercel/nitro) con relay WebRTC en /api/rtc -> no sirve en hosting estático. Backup: /workspace/juego-grok-original.

## Cambios
- Multijugador: src/lib/multiplayer/peerjs-room.ts (PeerJS broker público, código de sala, sin cuentas, máx 2 jugadores, host autoritativo).
- Gráficos: src/game/fx.ts (chispas, humo, luz de disparo, destello solar, bloom+viñeta en calidad ALTO), fixes en engine.ts (flash, trazadoras, cartel ALFA).
- 3 mapas con selector: COMPLEJO, DEPÓSITO, MUELLE.
- Build estático: static/ + vite.static.config.ts -> dist-static/.

## Build y test
npx vite build -c vite.static.config.ts
npx vite preview -c vite.static.config.ts --port 4173
MAP=MUELLE THIRD=1 node qa/mp-test.mjs   # test coop 2 navegadores (+3ro rechazado)
node qa/play-shots.mjs despues            # capturas en capturas/

## Hosting (pendiente de aprobación de Nico)
GitHub Pages en un repo de raptorib14 sirviendo dist-static/. Gratis.
