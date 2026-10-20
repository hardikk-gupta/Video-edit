# Toolkit

The Remotion project. `src/Reel.tsx` is the last approved video (AI automations, v3): copy it as the starting
point and replace the scene content.

## Setup

```bash
npm i
python3 -m venv venv && ./venv/bin/pip install faster-whisper   # transcripts
# Claude Code cloud container only:
export REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

## Files

| Path | What |
|---|---|
| `src/Reel.tsx` | Composition: tokens, grid engine, building blocks, scenes, pills, chrome, captions, SFX timeline. |
| `src/Root.tsx`, `src/index.ts` | Registers the `Reel` composition (1920×1080, 30fps). |
| `src/words.json` | Word timings of the current cut. Replace per project. |
| `src/vendor/hairline.*` | Hairline 0.5.1 (MIT), patched for frame-exact rendering. |
| `public/talk.mp4` | The cut + cleaned voice. **Not committed**: build it with `scripts/build_talk.py`. |
| `public/sfx/` | SFX library ([docs/05-sound.md](../docs/05-sound.md)). |
| `public/fonts/` | Anton, Inter, Space Mono. |
| `public/imagery/` | The person's own images for image slots. **Not committed.** |
| `public/grain.png` | Film grain tile. |
| `scripts/transcribe.py` | faster-whisper word timings. |
| `scripts/cut.py` | Snap rough cut points to the quietest 10ms. |
| `scripts/build_talk.py` | EDL → `public/talk.mp4` with voice cleanup. |
| `scripts/synth_sfx.py` | Generate riser, impact, swoosh, pop, tick. |
| `scripts/master.sh` | Loudness (-14 LUFS) + compression for delivery. |

## Commands

```bash
npx tsc -p .                                              # type-check
npx remotion studio                                       # preview in a browser (local machines)
npx remotion still Reel out/x.png --frame=300             # one frame
npx remotion render Reel out/reel-raw.mp4 --crf=18        # full render
scripts/master.sh out/reel-raw.mp4 out/reel-final.mp4     # deliverable
```

## Re-vendoring Hairline

```bash
npm pack @lucasmarkes/hairline && tar xzf lucasmarkes-hairline-*.tgz
node - <<'EOF'
const fs = require('fs');
let s = fs.readFileSync('package/dist/index.js', 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('missing ' + a); s = s.split(a).join(b); };
rep('performance.now()', '__hlNow()');
rep('requestAnimationFrame(frame)', '0');
rep('new IntersectionObserver(', 'new __HLIO(');
rep('const b = { stage, tick, vis: false, awake: true };', 'const b = { stage, tick, vis: true, awake: true };');
rep('RESUME + STAGGER * (started++ % 4)', 'RESUME');
s = s.replace(/\/\/# sourceMappingURL=.*$/m, '');
const head = `let __hlT = 0;\nconst __hlNow = () => __hlT;\nclass __HLIO { observe() {} unobserve() {} disconnect() {} }\n`;
const tail = `\nexport function __hlStep(root, dt, nowMs) {\n  __hlT = nowMs;\n  for (const [stage, set] of byStage) {\n    if (!root.contains(stage)) continue;\n    for (const b of set) if (b.awake) b.awake = !!b.tick(dt, nowMs);\n  }\n}\n`;
fs.writeFileSync('src/vendor/hairline.js', head + s + tail);
EOF
cp package/dist/index.d.ts src/vendor/hairline.d.ts
echo 'export declare function __hlStep(root: Element, dt: number, nowMs: number): void;' >> src/vendor/hairline.d.ts
```

If a replacement throws "missing", the library changed; read its `frame()`, `wake()`, `register()` and `tour()`
and re-apply the same idea.
