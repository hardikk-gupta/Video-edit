---
name: mascot-animate
description: Make a mascot (Claude's Clawd, or a character of the creator's own) act out a story as a hand-painted 2D cartoon - built from a character sheet (turnaround, expression sheet, mouth chart, props, actions) so it stays on model in every shot. Uses Claude Animation Base (p5.js + p5.brush) in vendor/. Use when a reel needs "the mascot doing things", a cartoon insert, or a recurring character.
---

# mascot-animate

Written for this repo (not vendored). Full method: `docs/15-mascot-and-collage.md`.

1. **Check the base is there.** `vendor/claude-animation-base/` comes from `toolkit/scripts/fetch_vendor.sh`. Read its
   `ANIMATION_GUIDE.md` in full before drawing anything. Running `npm install` / `render.mjs` is running third-party
   code: ask the creator once per session before doing it. There's no GPU here, so pass `--soft-gl` and skip
   watercolour fills on long shots.
2. **Pick the route with the creator** (docs/15 §3):
   - **A**, Clawd as-is, only when the video is about Claude.
   - **B**, their own mascot built like Clawd (the default for a recurring character).
   - **C**, a generated-image sheet (needs credits, so ask first).

   Say the Clawd brand caution from §3 in one line when you offer A.
3. **Character sheet first** (route B or C). Fill in `projects/_template/character-sheet.md` in the project folder:
   - proportions in units
   - palette
   - 5 key views
   - which of the 31 emotions it needs, plus any new ones
   - a mouth chart if it talks
   - props, costume and verbs

   For B, write `mascot.js` with the same API as `src/clawd.js` (`VIEWS`, `EMO`, parts, `draw`/`armL`/`armR` hooks),
   render `?loop=views` and `?loop=emotions` as a contact sheet, and **stop for approval**. No scenes until the sheet
   is approved.
4. **Storyboard** in the base's `STORYBOARD.md` format: a logline, the mascot's emotional arc, and shots that each run
   *event → reaction*, with a timed list of reads. Map every shot to entries on the sheet (view + emotion + action + prop + emote).
   Tie the shots to the voice-over's word timings from the transcript. Show the creator the storyboard before you write code.
5. **Build shot by shot**, then check key poses as stills (`--sheet`), moments as strips (`--strip`) and faces as
   crops (`--crop`). Look at every sheet with `watch`-style contact sheets before a full render.
6. **Lip sync** (if it talks): pick mouth-chart shapes from the transcript word timings, hold rest in the pauses, and keep
   the body acting from `emotions()`.
7. **Bring it into the edit:** use the MP4 as a full-screen insert or a split-screen panel. For an overlay, render `--png` on a
   key colour and key it out in Remotion. No text inside the cartoon; captions go in our layout. Then run the usual
   `reel-review` → `editor-handoff`.
8. **Record** the sheet, the route and the creator's verdict in the project README, and any lesson in docs/15 and the CHANGELOG.
   Renders and frames stay out of Git.
