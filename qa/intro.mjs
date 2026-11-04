import { chromium, devices } from "playwright";
const URL = process.env.URL || "http://127.0.0.1:4173/dominio/";
let fails = 0;
const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails++; };
const b = await chromium.launch({ channel: "chrome", args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--autoplay-policy=no-user-gesture-required"] });
for (const [label, opts, skip] of [["pc", { viewport: { width: 1366, height: 768 } }, "key"], ["movil", { ...devices["iPhone 13"] }, "tap"]]) {
  const ctx = await b.newContext(opts); const p = await ctx.newPage(); const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  // 1) plays fully then fades to menu
  await p.goto(URL);
  await p.getByTestId("intro").waitFor({ timeout: 10000 });
  await p.waitForFunction(() => { const v = document.querySelector('[data-testid=intro] video'); return v && v.currentTime > 1.5; }, null, { timeout: 10000 }).catch(() => {});
  const st = await p.evaluate(() => { const v = document.querySelector('[data-testid=intro] video'); return v ? { t: v.currentTime, muted: v.muted, pi: v.playsInline, bg: getComputedStyle(v.parentElement).backgroundColor } : null; });
  ok(st && st.t > 1.5 && st.muted && st.pi && st.bg === "rgb(255, 255, 255)", `${label}: intro plays muted/inline on white ${JSON.stringify(st)}`);
  await p.screenshot({ path: `../capturas/v5-intro-${label}.png` });
  await p.getByTestId("intro").waitFor({ state: "detached", timeout: 10000 });
  ok(true, `${label}: intro ends and fades out by itself`);
  await p.waitForTimeout(800);
  ok((await p.innerText("body")).includes("ARMER"), `${label}: menu visible`);
  await p.screenshot({ path: `../capturas/v5-intro-${label}-menu.png` });
  // 2) skip
  await p.reload();
  await p.getByTestId("intro").waitFor({ timeout: 10000 }); await p.waitForTimeout(700);
  const t0 = Date.now();
  if (skip === "key") await p.keyboard.press("Space"); else await p.getByTestId("intro").tap();
  await p.getByTestId("intro").waitFor({ state: "detached", timeout: 3000 });
  ok(Date.now() - t0 < 2000, `${label}: ${skip} skips intro (${Date.now() - t0}ms)`);
  if (label === "pc") { await p.reload(); await p.getByTestId("intro").waitFor(); await p.waitForTimeout(500); await p.mouse.click(600, 400); await p.getByTestId("intro").waitFor({ state: "detached", timeout: 3000 }); ok(true, "pc: click skips intro"); }
  // 3) autoplay failure
  await p.addInitScript(() => { HTMLMediaElement.prototype.play = function () { return Promise.reject(new Error("NotAllowed")); }; });
  await p.reload(); await p.waitForTimeout(600);
  ok((await p.getByTestId("intro").count()) === 0, `${label}: autoplay blocked -> straight to menu`);
  ok(errs.length === 0, `${label}: page errors ${JSON.stringify(errs)}`);
  await ctx.close();
}
await b.close();
console.log(fails ? `${fails} FAIL` : "ALL PASS"); process.exit(fails ? 1 : 0);
