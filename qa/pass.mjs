import { chromium, devices } from "playwright";
import fs from "fs";
const URL = process.env.URL || "http://127.0.0.1:4173/dominio/";
const CODES = fs.readFileSync("/workspace/codigos-secretos.txt", "utf8").trim().split("\n");
const args = ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"];
let fails = 0;
const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails++; };
const b = await chromium.launch({ args });
const perfil = (p) => p.evaluate(() => JSON.parse(localStorage.getItem("dominio-perfil")));

async function run(label, ctxOpts) {
  const ctx = await b.newContext(ctxOpts);
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  // Perfil de la versión anterior (sin campos de pase premium), nivel 4 ya cobrado.
  await p.addInitScript(() => {
    if (!sessionStorage.getItem("seeded")) {
      sessionStorage.setItem("seeded", "1");
      localStorage.clear();
      localStorage.setItem("dominio-perfil", JSON.stringify({ v: 1, coins: 120, special: 10, xp: 500, weapons: ["rifle", "smg", "pistol", "shot"], loadout: ["rifle", "shot", "pistol"], abilities: ["dash"], equipped: ["dash"], skins: ["base", "artico"], skin: "artico", codes: [], matches: 5 }));
    }
  });
  await p.goto(URL);
  await p.waitForFunction(() => !!window.__controlsTest, null, { timeout: 30000 });
  await p.waitForTimeout(1200);
  let pr = await perfil(p);
  const body0 = await p.innerText("body");
  ok(body0.includes("● 120") && body0.includes("✦ 10"), `${label}: old profile loads, no double tier rewards`);
  const P = p.getByTestId("perfil");
  await P.getByRole("button", { name: "PASE" }).click();
  const A = p.getByTestId("arsenal");
  await p.waitForTimeout(1200);
  ok(await A.getByTestId("pass-preview").isVisible(), `${label}: final rewards preview visible`);
  ok(/POLAR ❄/.test(await A.innerText()) && /GL-0 GLACIAR/.test(await A.innerText()), `${label}: preview names POLAR + GL-0 GLACIAR`);
  await p.screenshot({ path: `../capturas/v4-pase-${label}.png` });
  await A.getByTestId("buy-premium").click();
  ok(/Te faltan 940 ✦/.test(await p.innerText("body")), `${label}: premium blocked without enough ✦`);
  // Códigos siguen valiendo (✦ code now 300)
  await A.getByRole("button", { name: "CÓDIGOS" }).click();
  const input = p.getByPlaceholder("ESCRIBÍ TU CÓDIGO");
  const got = [];
  for (const c of CODES) {
    await input.fill(c);
    await A.getByRole("button", { name: "CANJEAR" }).click();
    await p.waitForTimeout(300);
    got.push(/Ganaste/.test(await p.innerText("body")));
  }
  ok(got.every(Boolean), `${label}: all 5 old codes still valid`);
  pr = await perfil(p);
  ok(pr.special === 10 + 300 + 20, `${label}: ✦ after codes = ${pr.special}`);
  // Jugar partidas da ✦ y XP; simulamos el progreso de una temporada (nivel 20 + 4 extra) por localStorage.
  await A.getByRole("button", { name: "CERRAR" }).click();
  await p.evaluate(() => {
    const q = JSON.parse(localStorage.getItem("dominio-perfil"));
    q.special = 1000; q.xp = 120 * 20 + 10;
    localStorage.setItem("dominio-perfil", JSON.stringify(q));
  });
  await p.reload();
  await p.waitForFunction(() => !!window.__controlsTest, null, { timeout: 30000 });
  await p.waitForTimeout(800);
  await p.getByTestId("perfil").getByRole("button", { name: "PASE" }).click();
  await p.waitForTimeout(500);
  await p.getByTestId("arsenal").getByTestId("buy-premium").click();
  await p.getByTestId("unlock-small").waitFor({ timeout: 4000 });
  await p.waitForTimeout(250);
  await p.screenshot({ path: `../capturas/v4-desbloqueo-nivel-${label}.png` });
  ok(true, `${label}: small tier unlock animation shown`);
  for (let i = 0; i < 25 && !(await p.getByTestId("unlock-final").count()); i++) {
    await p.getByTestId("unlock-small").click({ timeout: 1000 }).catch(() => {});
    await p.waitForTimeout(150);
  }
  await p.getByTestId("unlock-final").waitFor({ timeout: 8000 });
  await p.waitForTimeout(250);
  await p.screenshot({ path: `../capturas/v4-desbloqueo-final-flash-${label}.png` });
  await p.waitForTimeout(1600);
  await p.screenshot({ path: `../capturas/v4-desbloqueo-final-${label}.png` });
  ok(true, `${label}: final unlock animation shown`);
  pr = await perfil(p);
  ok(pr.premium && pr.skins.includes("polar") && pr.weapons.includes("glaciar") && pr.weapons.includes("lmg"), `${label}: premium tiers granted (polar, glaciar)`);
  ok(pr.special === 1000 - 950 + 400 + 190, `${label}: ✦ after buying = ${pr.special} (950 paid, 400 premium back + 190 free tiers 5-20)`);
  await p.getByRole("button", { name: /SEGUIR/ }).click();
  // equipar GLACIAR + skin POLAR
  const A2 = p.getByTestId("arsenal");
  await A2.getByRole("button", { name: "ARMERÍA" }).click();
  await A2.getByText("SC-12", { exact: true }).click();
  await A2.getByText("GL-0 GLACIAR", { exact: true }).click();
  await A2.getByText("POLAR ❄", { exact: true }).click();
  await p.screenshot({ path: `../capturas/v4-armeria-${label}.png` });
  await A2.getByRole("button", { name: "CERRAR" }).click();
  pr = await perfil(p);
  ok(pr.loadout.length === 3 && pr.loadout.includes("glaciar") && pr.skin === "polar", `${label}: loadout ${pr.loadout}, skin ${pr.skin}`);
  if (label === "pc") await p.getByRole("button", { name: /DESPLEGAR/ }).click().catch(() => {});
  else await p.getByRole("button", { name: /DESPLEGAR/ }).tap().catch(() => {});
  await p.waitForTimeout(1500);
  console.log(label, "phase", await p.evaluate(() => window.__controlsTest.getPhase()));
  const lo = await p.evaluate(() => window.__controlsTest.getLoadout());
  ok(lo.includes("glaciar"), `${label}: in-match loadout ${lo}`);
  for (let i = 0; i < 3 && (await p.evaluate(() => window.__controlsTest.getWeapon())) !== "glaciar"; i++) {
    if (label === "pc") await p.keyboard.press(`Digit${i + 1}`);
    else await p.locator("button.wep-slot", { hasText: "GL-0" }).first().dispatchEvent("click").catch(() => {});
    await p.waitForTimeout(500);
  }
  ok((await p.evaluate(() => window.__controlsTest.getWeapon())) === "glaciar", `${label}: GL-0 GLACIAR in hand`);
  await p.evaluate(() => { const t = window.__controlsTest; const q = t.getPos(); t.lookAt(q.x * 0.2, q.z * 0.2); });
  await p.waitForTimeout(900);
  await p.screenshot({ path: `../capturas/v4-glaciar-juego-${label}.png` });
  await p.evaluate(() => window.__controlsTest.qaWin(3));
  await p.waitForTimeout(800);
  ok(/\+\d+ ✦/.test(await p.innerText("body")), `${label}: match gives ✦`);
  await p.screenshot({ path: `../capturas/v4-recompensa-${label}.png` });
  ok(errs.length === 0, `${label}: page errors ${JSON.stringify(errs)}`);
  await ctx.close();
}
await run("pc", { viewport: { width: 1280, height: 720 } });
await run("movil", { ...devices["iPhone 13"], defaultBrowserType: undefined });
await b.close();
console.log(fails ? `${fails} FAIL` : "ALL PASS");
