import { chromium } from "playwright";
const tag = process.argv[2] || "despues";
const b = await chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const errs = [];
for (const [vw, vh, mobile, suffix, q] of [[1280,720,false,"pc-alto","realista"],[844,390,true,"movil-medio","auto"]]) {
  const p = await b.newPage({ viewport: { width: vw, height: vh }, isMobile: mobile, hasTouch: mobile });
  p.on("pageerror", e => errs.push(e.message));
  await p.addInitScript((q) => { const k="dominio-v2"; const d=JSON.parse(localStorage.getItem(k)||"{}"); d.quality=q; d.introSeen=true; localStorage.setItem(k, JSON.stringify(d)); sessionStorage.setItem("introSeen","1"); }, q);
  await p.goto("http://localhost:4173/dominio/");
  await p.waitForTimeout(800); if (mobile) await p.mouse.click(400,200).catch(()=>{}); else await p.keyboard.press("Escape"); await p.getByTestId("intro").waitFor({ state: "detached", timeout: 15000 }).catch(()=>{});
  await p.waitForFunction(() => !!window.__controlsTest, null, { timeout: 60000 });
  await p.waitForTimeout(1500);
  if (process.argv[2] !== "antes") await p.evaluate((qq) => window.__controlsTest.setQuality(qq), q === "realista" ? 2 : 1);
  await p.waitForTimeout(2500);
  for (const map of ["COMPLEJO","DEPÓSITO","MUELLE"]) {
    await p.getByText(map, { exact: true }).first().click({ force: true });
    await p.waitForTimeout(600);
    await p.evaluate(() => window.__controlsTest.deploy());
    await p.waitForTimeout(2500);
    const bot = await p.evaluate(() => { const t = window.__controlsTest; const bb = t.getBots().filter(b=>b.alive)[0]; return {bb}; });
    await p.evaluate(({bb}) => { const t = window.__controlsTest; t.teleport(bb.x+4, bb.z + 10); t.lookAt(bb.x, bb.z); }, bot);
    await p.waitForTimeout(1500);
    const m = map.normalize("NFD").replace(/[^A-Z]/g,"").toLowerCase();
    await p.screenshot({ path: `capturas/v6-${tag}-${m}-${suffix}.png` });
    console.log(suffix, map, "fps", await p.evaluate(() => window.__controlsTest.getFps()), "q", await p.evaluate(() => document.body.innerText.match(/ALTO|MEDIO|BAJO/)?.[0]));
    await p.evaluate(() => window.__controlsTest.toMenu());
    await p.waitForTimeout(500);
  }
  await p.close();
}
console.log("pageerrors:", errs);
await b.close();
