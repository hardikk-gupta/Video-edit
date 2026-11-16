// Integration check: real browser frames, frame-order independence, real WAV decoding and video/audio export.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdtempSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {openBrowser, renderMedia, renderStill, selectComposition} from '@remotion/renderer';

const toolkit = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const catalogue = JSON.parse(readFileSync(join(toolkit, 'src/free-stack/sfx-catalogue.json'), 'utf8'));
assert.equal(catalogue.length, 320);
assert.equal(new Set(catalogue.map((s) => s.id)).size, 320);
const upstream = JSON.parse(readFileSync(join(toolkit, '../vendor/sfx-kit/sounds.json'), 'utf8'));
for (const sound of catalogue) {
  const original = upstream.sounds.find((s) => s.id === sound.id);
  assert.ok(original, `Unknown catalogue record: ${sound.id}`);
  assert.equal(sound.sync, original.sync.at);
  assert.equal(sound.duration, original.duration);
  const hash = createHash('sha256').update(readFileSync(join(toolkit, 'public/sfx/kit', sound.file))).digest('hex');
  assert.equal(hash, original.sha256, `WAV checksum: ${sound.id}`);
}
console.log('All 320 catalogue entries and WAV checksums match the pinned CC0 source.');

const output = mkdtempSync(join(tmpdir(), 'free-motion-check-'));
const serveUrl = await bundle({entryPoint: join(toolkit, 'src/entry-free-motion.tsx')});
const browser = await openBrowser('chrome', {
  browserExecutable: process.env.REMOTION_BROWSER,
  chromiumOptions: {gl: 'swangle'},
});
try {
  const composition = await selectComposition({serveUrl, id: 'FreeMotionKit', puppeteerInstance: browser});
  for (const [name, frame] of [['middle', 30], ['start', 0], ['middle-again', 30]]) {
    await renderStill({serveUrl, composition, frame, output: join(output, `${name}.png`), puppeteerInstance: browser});
  }
  const middle = readFileSync(join(output, 'middle.png'));
  assert.deepEqual(middle, readFileSync(join(output, 'middle-again.png')), 'Seeking backward must reproduce the same frame.');
  assert.notDeepEqual(middle, readFileSync(join(output, 'start.png')), 'Animation must change between frames.');
  console.log('GSAP, Paper and Three.js render together; out-of-order frames are deterministic.');
  await renderMedia({serveUrl, composition, codec: 'h264', outputLocation: join(output, 'smoke.mp4'), concurrency: 1, puppeteerInstance: browser});
  const streams = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-of', 'json', join(output, 'smoke.mp4')], {encoding: 'utf8'})).streams;
  assert.ok(streams.some((s) => s.codec_type === 'video' && s.width === 640 && s.height === 360));
  assert.ok(streams.some((s) => s.codec_type === 'audio'));
  const pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', join(output, 'smoke.mp4'), '-vn', '-ac', '1', '-ar', '8000', '-f', 's16le', '-']);
  let peak = 0;
  for (let i = 0; i < pcm.length - 1; i += 2) peak = Math.max(peak, Math.abs(pcm.readInt16LE(i)));
  assert.ok(peak > 100, 'The exported free SFX must be audible, not a silent audio track.');
  console.log(`Passed: H.264 video + non-silent SFX. Review artifacts: ${output}`);
} finally {
  await browser.close({silent: true});
}
