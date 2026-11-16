# Installed free motion and sound stack

Added at Hardik's request on 2026-11-16: import the free motion libraries and choose a free SFX library. No premium packs, subscriptions, hosted generation services or account credentials are part of this setup.

## Install and open

From a fresh clone, run:

```bash
cd toolkit
npm ci --ignore-scripts
npm run setup:sfx
npm run studio:free
```

Node 20+ and Git are required. `setup:sfx` downloads only Wyzowl SFX Kit, pins its Git revision, verifies all 320 WAV checksums and links it into `public/sfx/kit`. It is safe to rerun and refuses to overwrite a different sound library. The WAVs and npm packages stay gitignored; the lockfile, setup script, catalogue and licence record are committed so a new clone can restore them.

The isolated Studio entry works without previous videos' private footage or generated JSON. It demonstrates the actual libraries together, rather than depending on those older projects.

## Available libraries

| Library | Installed version | Use | Licence |
| --- | --- | --- | --- |
| GSAP | 3.15.1 | Timelines, type, SVG drawing and shape morphs | Standard No Charge licence; free permitted commercial use, not MIT |
| @remotion/gsap | 4.0.544 | Seek paused GSAP timelines from video frames | MIT |
| Paper Shaders React | 0.0.82 | Paper, grain, dithering and other procedural treatments | Apache-2.0 |
| Three.js | 0.187.0 | Scene-specific 3D illustrations | MIT |
| React Three Fiber | 9.8.2 | React scene authoring for Three.js | MIT |
| @remotion/three | 4.0.544 | Frame-driven Three.js rendering | MIT |
| Wyzowl SFX Kit | 1.0.0, commit `92780e7ab0cdfb557497a988089c47f46e8c7412` | 320 sounds with semantic tags, sync points and mix metadata | CC0-1.0 |

All direct Remotion packages are pinned together at 4.0.544. Remotion itself was already the renderer and retains its own [licence eligibility](https://www.remotion.dev/docs/license/pricing); adding these libraries does not change it. None of these additions requires a premium account. Formerly paid GSAP plugins DrawSVG, MorphSVG and SplitText are included and exercised by the demo.

## Motion usage

- Copy the scoped timeline pattern in `toolkit/src/free-stack/FreeMotionDemo.tsx`. Use `useGsapTimeline` from `@remotion/gsap`; do not start the GSAP ticker or put side-effect callbacks in a render timeline.
- Use `VideoPaper` from `toolkit/src/free-stack/VideoPaper.tsx` for the paper shader. It stops the wall clock, converts Remotion frames to Paper's millisecond frame units and waits for the WebGL mount before allowing a render. Keep a fixed seed.
- Derive Three.js mesh/camera properties from `useCurrentFrame()`. Do not accumulate rotation in a free-running `useFrame` loop. See the demo's `ThreeCanvas`.
- The demo is an integration reference, not a mandatory visual template. Use each library only where the story needs it. Existing type, framing, guide-padding and transition rules still apply.

## Sound usage

Wyzowl is the default free shelf for this workflow because it supplies not just WAVs but `use_for`, `avoid_for`, tags, explicit sync moments and loudness guidance. Its guide is `vendor/sfx-kit/GUIDE.md`; its full manifest is `vendor/sfx-kit/sounds.json`. A searchable, committed catalogue with all 320 entries is exported as `freeSfx` from `toolkit/src/free-stack/sfx.ts`.

```tsx
import {Audio, Sequence, useVideoConfig} from 'remotion';
import {sfxAt} from './free-stack/sfx';

// Inside a composition: put the sound's intended moment on frame 45.
const {fps} = useVideoConfig();
const cue = sfxAt('foley-paper-slide', 45, fps);

<Sequence from={cue.from} durationInFrames={cue.durationInFrames}>
  <Audio src={cue.src} volume={0.25} />
</Sequence>;
```

`from` can be negative when an effect needs a lead-in before frame zero; Sequence handles the trim. The cue does not guess a mix gain: inspect `cue.sound.underVoiceoverDb` and `levelLufs`, follow the speech-relative mix rules in [05-sound.md](05-sound.md), and measure the final file. Never change a tuned effect's rate without checking the upstream `adapt` metadata. Existing `KIT` imports in older compositions remain compatible with the same downloaded files.

## Verification

```bash
# ffmpeg + ffprobe are required for export/audio verification.
# Set REMOTION_BROWSER only when using an existing Chromium installation.
REMOTION_BROWSER=/usr/bin/chromium npm run check:free
```

This runs the isolated TypeScript check, checks all 320 file hashes/catalogue timings, bundles the real composition, renders frames 30 → 0 → 30 and compares them, then exports a two-second H.264/AAC clip and checks decoded audio is non-silent. Artifacts are written to a temporary directory, not Git. Software WebGL is selected for the portable check; production rendering can use a GPU.

Verified here: all checks above passed, and the npm production dependency audit reported zero vulnerabilities. The full legacy `npm run typecheck` still has pre-existing missing-input errors for `captions.json` and `duet-paths.json` belonging to older videos. `typecheck:free` is scoped to the new entry and does not change or suppress those legacy errors. Three.js currently emits an upstream `Clock` deprecation warning via the R3F runtime; it does not prevent rendering.

## Sources and licences

- [GSAP](https://github.com/greensock/GSAP) · [Standard licence](https://gsap.com/community/standard-license/) · [commercial/free announcement](https://webflow.com/updates/gsap-becomes-free)
- [Official Remotion GSAP adapter](https://www.remotion.dev/docs/gsap)
- [Paper Shaders](https://github.com/paper-design/shaders) — preserve its LICENSE/NOTICE when redistributing code.
- [Three.js](https://github.com/mrdoob/three.js) · [React Three Fiber](https://github.com/pmndrs/react-three-fiber) · [Remotion Three](https://www.remotion.dev/docs/three)
- [Wyzowl SFX Kit](https://github.com/wyzowl/sfx-kit/tree/92780e7ab0cdfb557497a988089c47f46e8c7412) — CC0 text is retained in `toolkit/third-party/WYZOWL-SFX-KIT-CC0.txt`.
