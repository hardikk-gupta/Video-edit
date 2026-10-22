// node scripts/web_capture.mjs <url> <out.png> <out.json> "text"...  full page, overlays removed, element boxes in page CSS px (image is 2x)
import {chromium} from 'playwright-core';
import fs from 'fs';
const [url, out, jout, ...texts] = process.argv.slice(2);
const b = await chromium.launch({executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p = await b.newPage({viewport: {width: 1280, height: 800}, deviceScaleFactor: 2, colorScheme: 'dark', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36'});
await p.goto(url, {waitUntil: 'domcontentloaded', timeout: 60000});
await p.waitForTimeout(3000);
for (const name of [/reject all/i, /accept all/i]) { const btn = p.getByRole('button', {name}); if (await btn.count()) { await btn.first().click().catch(() => {}); break; } }
for (let y = 0; y < 30000; y += 700) { await p.evaluate(v => window.scrollTo(0, v), y); await p.waitForTimeout(100); }
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800);
// Remove floating overlays (cookie banners, promo popups, sticky headers) so the capture is clean.
await p.evaluate(() => {
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if ((cs.position === 'fixed' || cs.position === 'sticky') && el.getBoundingClientRect().height < 700) el.remove();
  }
});
await p.waitForTimeout(500);
await p.screenshot({path: out, fullPage: true});
const res = {};
for (const t of texts) {
  const l = p.getByText(t, {exact: false});
  res[t] = [];
  for (let i = 0; i < Math.min(await l.count(), 4); i++) {
    const bb = await l.nth(i).evaluate(e => { const r = e.getBoundingClientRect(); return {x: r.x + scrollX, y: r.y + scrollY, w: r.width, h: r.height}; });
    if (bb.w) res[t].push(bb);
  }
}
fs.writeFileSync(jout, JSON.stringify(res));
await b.close();
