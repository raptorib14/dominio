import { chromium } from "playwright";
const b = await chromium.launch({ args: ["--use-gl=swiftshader","--enable-unsafe-swiftshader"] });
const p = await b.newPage(); const errs = [];
p.on("pageerror", e => errs.push(e.message)); p.on("console", m => m.type()==="error" && errs.push(m.text()));
p.on("response", r => r.status() >= 400 && errs.push(r.status()+" "+r.url()));
await p.goto("https://raptorib14.github.io/dominio/"); await p.waitForTimeout(6000);
console.log("title:", await p.title(), "| has DOMINIO:", (await p.innerText("body")).includes("DOMINIO"), "| errors:", JSON.stringify(errs));
await b.close();
