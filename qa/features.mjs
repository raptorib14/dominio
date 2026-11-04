import { chromium, devices } from "playwright";
import fs from "fs";
const URL = process.env.URL || "http://127.0.0.1:4173/dominio/";
const CODES = fs.readFileSync("/workspace/codigos-secretos.txt", "utf8").trim().split("\n");
const args = ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"];
let fails = 0;
const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails++; };
const b = await chromium.launch({ args });

async function run(label, ctxOpts) {
  const ctx = await b.newContext(ctxOpts);
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  // old save from before this update
  await p.addInitScript(() => {
    if (!sessionStorage.getItem("seeded")) {
      sessionStorage.setItem("seeded", "1");
      localStorage.clear();
      localStorage.setItem("dominio-v2", JSON.stringify({ v: 2, sens: 0.003, wins: 4, best: 120, map: "muelle", name: "Nico", bots: 6, diff: "regular", quality: "auto", fov: 80, volume: 0.5, muted: false }));
    }
  });
  await p.goto(URL);
  await p.waitForFunction(() => !!window.__controlsTest, null, { timeout: 30000 });
  await p.waitForTimeout(1500);
  const body = await p.innerText("body");
  ok(body.includes("2:00") && body.includes("R-47 · VX-9 · P-19"), `${label}: old save loaded (best 2:00) + default loadout`);
  await p.screenshot({ path: `../capturas/v3-menu-${label}.png` });
  const perfil = p.getByTestId("perfil");
  await perfil.getByRole("button", { name: "ARMERÍA" }).click();
  const A = p.getByTestId("arsenal");
  await A.getByText("SC-12", { exact: true }).click();
  ok(/Te faltan monedas/.test(await p.innerText("body")), `${label}: can't buy without coins`);
  await p.screenshot({ path: `../capturas/v3-armeria-${label}.png` });
  
  await A.getByRole("button", { name: "CÓDIGOS" }).click();
  const input = p.getByPlaceholder("ESCRIBÍ TU CÓDIGO");
  await input.fill(CODES[0].toLowerCase());
  await A.getByRole("button", { name: "CANJEAR" }).click();
  await p.waitForTimeout(300);
  ok(/Ganaste 500 monedas/.test(await p.innerText("body")), `${label}: code 1 redeemed (lowercase ok)`);
  await input.fill(CODES[0]);
  await A.getByRole("button", { name: "CANJEAR" }).click();
  await p.waitForTimeout(300);
  ok(/Ya usaste/.test(await p.innerText("body")), `${label}: code is single-use`);
  await input.fill("DOMINIO-XXXXX");
  await A.getByRole("button", { name: "CANJEAR" }).click();
  await p.waitForTimeout(300);
  ok(/inválido/.test(await p.innerText("body")), `${label}: bad code rejected`);
  for (const c of CODES.slice(1)) {
    await input.fill(c);
    await A.getByRole("button", { name: "CANJEAR" }).click();
    await p.waitForTimeout(300);
    ok(/Ganaste/.test(await p.innerText("body")), `${label}: code ${c.split("-")[0]} works`);
  }
  await p.screenshot({ path: `../capturas/v3-codigos-${label}.png` });
  // armory: buy shotgun, swap pistol -> shotgun; try a 4th
  await A.getByRole("button", { name: "ARMERÍA" }).click();
  await A.getByText("SC-12", { exact: true }).click();
  await A.getByText("SC-12", { exact: true }).click();
  ok(/Ya tenés 3 armas/.test(await p.innerText("body")), `${label}: max 3 weapons enforced`);
  await A.getByText("P-19", { exact: true }).click();
  await A.getByText("SC-12", { exact: true }).click();
  await A.getByText("ORO ✦", { exact: true }).click();
  await A.getByRole("button", { name: "HABILIDADES" }).click();
  await A.getByText("ESCUDO", { exact: true }).click();
  await p.screenshot({ path: `../capturas/v3-habilidades-${label}.png` });
  await A.getByRole("button", { name: "PASE" }).click();
  await p.screenshot({ path: `../capturas/v3-pase-${label}.png` });
  await A.getByRole("button", { name: "CERRAR" }).click();
  const prof = await p.evaluate(() => JSON.parse(localStorage.getItem("dominio-perfil")));
  ok(prof.loadout.length === 3 && prof.loadout.includes("shot") && !prof.loadout.includes("pistol"), `${label}: loadout saved ${prof.loadout}`);
  // play
  if (label === "pc") await p.getByRole("button", { name: /DESPLEGAR/ }).click().catch(() => {});
  await p.evaluate(() => window.__controlsTest.setKeys([]));
  await p.waitForTimeout(1500);
  const lo = await p.evaluate(() => window.__controlsTest.getLoadout());
  ok(JSON.stringify(lo) === JSON.stringify(prof.loadout), `${label}: in-match loadout = ${lo}`);
  for (const k of ["Digit3", "Digit1", "Digit2"]) { await p.keyboard.press(k); await p.waitForTimeout(400); }
  const seen = await p.evaluate(() => window.__controlsTest.getWeapon());
  ok(prof.loadout.includes(seen), `${label}: only loadout weapons selectable (${seen})`);
  await p.keyboard.press("Digit5"); await p.waitForTimeout(300);
  ok(prof.loadout.includes(await p.evaluate(() => window.__controlsTest.getWeapon())), `${label}: key 5 no extra weapon`);
  const q0 = await p.evaluate(() => window.__controlsTest.getPos());
  if (label === "movil") {
    const btn = p.locator("button.abil-btn:visible").first();
    ok((await btn.count()) > 0, `${label}: touch ability button visible`);
    await btn.dispatchEvent("pointerdown");
  } else await p.keyboard.press("KeyE");
  await p.waitForTimeout(700);
  const q1 = await p.evaluate(() => window.__controlsTest.getPos());
  const d = Math.hypot(q1.x - q0.x, q1.z - q0.z);
  ok(d > 2, `${label}: dash ability moved ${d.toFixed(2)} m`);

  await p.keyboard.press("KeyF");
  await p.waitForTimeout(500);
  await p.screenshot({ path: `../capturas/v3-juego-${label}.png` });
  const coinsBefore = prof.coins;
  await p.evaluate(() => window.__controlsTest.qaWin(3));
  await p.waitForTimeout(800);
  ok(/monedas · \+\d+ ✦ · \+\d+ XP/.test(await p.innerText("body")), `${label}: match reward shown`);
  await p.screenshot({ path: `../capturas/v3-recompensa-${label}.png` });
  const after = await p.evaluate(() => JSON.parse(localStorage.getItem("dominio-perfil")));
  ok(after.coins > coinsBefore && after.xp > prof.xp, `${label}: coins ${coinsBefore}->${after.coins}, xp ${prof.xp}->${after.xp}`);
  const old = await p.evaluate(() => JSON.parse(localStorage.getItem("dominio-v2")));
  ok(old.wins === 5 && old.name === "Nico", `${label}: old save kept and updated (wins ${old.wins})`);
  const src = await p.evaluate(async () => (await Promise.all([...document.scripts].map((s) => s.src && fetch(s.src).then((r) => r.text())))).join(""));
  ok(!CODES.some((c) => src.includes(c)), `${label}: no plaintext codes in shipped JS`);
  ok(errs.length === 0, `${label}: page errors ${JSON.stringify(errs)}`);
  await ctx.close();
}
await run("pc", { viewport: { width: 1280, height: 720 } });
await run("movil", { ...devices["iPhone 13"], defaultBrowserType: undefined });
await b.close();
console.log(fails ? `${fails} FAIL` : "ALL PASS");
