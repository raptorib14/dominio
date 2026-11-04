import { chromium } from "playwright";
const tag = process.argv[2] || "despues";
const b = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const errs = [];
for (const [vw, vh, mobile, suffix] of [[1280,720,false,"pc"],[844,390,true,"movil"]]) {
  const p = await b.newPage({ viewport: { width: vw, height: vh }, isMobile: mobile, hasTouch: mobile });
  p.on("pageerror", e => errs.push(e.message));
  if (process.env.Q) await p.addInitScript((q) => { const k="dominio-v2"; const d=JSON.parse(localStorage.getItem(k)||"{}"); d.quality=q; localStorage.setItem(k, JSON.stringify(d)); }, process.env.Q);
  await p.goto("http://127.0.0.1:4173/");
  await p.waitForFunction(() => !!window.__controlsTest, null, { timeout: 30000 });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `capturas/${tag}-menu-${suffix}.png` });
  for (const map of (suffix === "pc" ? ["COMPLEJO","DEPÓSITO","MUELLE"] : ["DEPÓSITO"])) {
    await p.getByText(map, { exact: true }).first().click();
    await p.waitForTimeout(600);
    await p.evaluate(() => window.__controlsTest.deploy());
    await p.waitForTimeout(800);
    const bot = await p.evaluate(() => { const t = window.__controlsTest; const bb = t.getBots().filter(b=>b.alive)[0]; const pos = t.getPos(); return {bb,pos}; });
    await p.evaluate(({bb}) => { const t = window.__controlsTest; t.teleport(bb.x, bb.z + 7); t.lookAt(bb.x, bb.z); }, bot);
    await p.evaluate(() => window.__controlsTest.setFire(true));
    await p.waitForTimeout(260);
    await p.screenshot({ path: `capturas/${tag}-juego-${map.normalize("NFD").replace(/[^A-Z]/g,"").toLowerCase()}-${suffix}.png` });
    await p.evaluate(() => window.__controlsTest.setFire(false));
    console.log(suffix, map, "fps", await p.evaluate(() => window.__controlsTest.getFps()), "map", await p.evaluate(() => window.__controlsTest.getMap()));
    await p.evaluate(() => window.__controlsTest.setKeys([]));
    // back to menu via api hook
    await p.evaluate(() => window.__controlsTest.toMenu());
  }
  await p.close();
}
console.log("pageerrors:", errs);
await b.close();
