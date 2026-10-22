// node scripts/web_phrases.mjs <url> <out.json> "phrase"...  exact rects of each phrase (CSS px, page coords) after the same cleanup as web_capture
import {chromium} from 'playwright-core';
import fs from 'fs';
const [url, jout, ...phrases] = process.argv.slice(2);
const b = await chromium.launch({executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p = await b.newPage({viewport: {width: 1280, height: 800}, deviceScaleFactor: 2, colorScheme: 'dark', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36'});
await p.goto(url, {waitUntil: 'domcontentloaded', timeout: 60000});
await p.waitForTimeout(3000);
for (const name of [/reject all/i, /accept all/i]) { const btn = p.getByRole('button', {name}); if (await btn.count()) { await btn.first().click().catch(() => {}); break; } }
for (let y = 0; y < 30000; y += 700) { await p.evaluate(v => window.scrollTo(0, v), y); await p.waitForTimeout(100); }
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800);
await p.evaluate(() => { for (const el of document.querySelectorAll('body *')) { const cs = getComputedStyle(el); if ((cs.position === 'fixed' || cs.position === 'sticky') && el.getBoundingClientRect().height < 700) el.remove(); } });
await p.waitForTimeout(500);
const res = await p.evaluate((phrases) => {
  const out = {};
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = []; let n; while ((n = walker.nextNode())) nodes.push(n);
  for (const ph of phrases) {
    out[ph] = null;
    for (const node of nodes) {
      const i = node.textContent.replace(/[’]/g, "'").indexOf(ph.replace(/[’]/g, "'"));
      if (i < 0) continue;
      const r = document.createRange(); r.setStart(node, i); r.setEnd(node, i + ph.length);
      const rs = [...r.getClientRects()].filter(q => q.width > 0);
      if (!rs.length) continue;
      const x0 = Math.min(...rs.map(q => q.left)), y0 = Math.min(...rs.map(q => q.top)), x1 = Math.max(...rs.map(q => q.right)), y1 = Math.max(...rs.map(q => q.bottom));
      out[ph] = {x: x0 + scrollX, y: y0 + scrollY, w: x1 - x0, h: y1 - y0, lines: rs.length};
      break;
    }
  }
  return out;
}, phrases);
fs.writeFileSync(jout, JSON.stringify(res, null, 1));
await b.close();
