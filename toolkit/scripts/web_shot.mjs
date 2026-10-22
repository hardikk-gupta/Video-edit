// Page capture for the split-screen format (docs/12). Run from toolkit/ after `npm i playwright-core`.
// In Claude Code cloud containers Chromium is at /opt/pw-browsers; elsewhere set CHROME_PATH.
// node shot.mjs <url> <out.png> [css-selector...]  → screenshot + bounding boxes (CSS px; image is 2x)
import {chromium} from 'playwright-core';
const [url, out, ...selectors] = process.argv.slice(2);
const b = await chromium.launch({executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p = await b.newPage({viewport: {width: 1280, height: 800}, deviceScaleFactor: 2, colorScheme: 'dark'});
await p.goto(url, {waitUntil: 'domcontentloaded', timeout: 60000});
await p.waitForTimeout(2500);
await p.screenshot({path: out});
const res = {};
for (const s of selectors) {
  const l = p.locator(s);
  res[s] = [];
  for (let i = 0; i < await l.count(); i++) res[s].push({box: await l.nth(i).boundingBox(), text: (await l.nth(i).innerText()).trim().replace(/\s+/g, ' ')});
}
console.log(JSON.stringify(res, null, 1));
await b.close();
