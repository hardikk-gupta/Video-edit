// Render several stills of one composition from a single bundle (faster than one `remotion still` per frame).
//   node scripts/stills.mjs <entry> <compId> <outDir> <seconds,comma,separated> ['{"props":1}'] [scale]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
const [entry, id, out, times, props = '{}', scale = '0.5'] = process.argv.slice(2);
mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: entry});
const inputProps = JSON.parse(props), browserExecutable = process.env.REMOTION_BROWSER;
const composition = await selectComposition({serveUrl, id, inputProps, browserExecutable});
for (const s of times.split(',').map(Number)) {
  const frame = Math.round(s * composition.fps);
  await renderStill({composition, serveUrl, output: `${out}/t${s.toFixed(2)}.png`, frame, inputProps, scale: +scale, browserExecutable});
  console.log('still', s);
}
