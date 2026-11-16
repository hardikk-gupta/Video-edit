# Free motion and SFX integration · 2026-11-16

Hardik: "import the free ones directly into our list, into our system itself repo"; choose the best free SFX library; "nothing premium we are going to import".

Installed GSAP 3.15.1, Paper Shaders React 0.0.82, Three.js 0.187.0, React Three Fiber 9.8.2, and the official Remotion GSAP/Three adapters. Pinned the renderer and all direct Remotion packages together at 4.0.544. Chose Wyzowl SFX Kit: 320 CC0 WAVs with semantic selection, sync and mix metadata. No premium assets, subscriptions, account access or paid generation used.

[Setup and usage](../../docs/free-motion-stack.md). A focused setup script restores only the pinned free SFX source and verifies all file hashes; npm's lockfile restores motion dependencies. The complete searchable sound catalogue, cue helper, frame-controlled Paper wrapper, and standalone GSAP/Paper/Three/SFX demonstration are committed. Downloaded assets, installed packages and test renders remain outside Git.

Validation completed:
- `npm run setup:sfx`: 320 WAV checksums verified; repeated setup also passed.
- `REMOTION_BROWSER=/usr/bin/chromium npm run check:free`: isolated TypeScript check, catalogue/source consistency, deterministic out-of-order rendered frames, and H.264 export with a non-silent decoded sound effect all passed.
- Production npm audit: zero vulnerabilities reported.
- Existing whole-toolkit typecheck still requires older videos' missing `captions.json` and `duet-paths.json`; the new entry/check is isolated from those private/generated inputs.

This is a tooling integration, not a new creative edit. Browser frames were visually inspected as integration evidence, not presented as an approved design. Audio was verified by decoding/export measurements, not auditioned. Existing video projects and their media are unchanged. Source is on `codex/free-motion-stack`, based on `main` to keep unrelated Hinton edits out of the change.
