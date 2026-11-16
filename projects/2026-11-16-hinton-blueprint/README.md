# 2026-11-16 · "Everyone mocked it" EP. 01 · Geoffrey Hinton (Blueprint Cut)

**Brief:** a Blueprint Cut story of one real person in AI with a paradox, ending on a lesson for creators.
Brief, answers, rules, facts and image credits: [instructions.md](instructions.md). Voice-over script and post
caption: [script.md](script.md).

- **Code:** `toolkit/src/BlueprintOneTake.tsx` (composition `BlueprintHinton`; v1–v4 lived in `BlueprintHinton.tsx`, removed), entry `toolkit/src/entry-blueprint.tsx`.
- **Render:** 1080×1920, 30 fps, 42.4 s, H.264. Sound effects only (no voice yet): −23.6 LUFS, −2.9 dBTP.
  The file is local in `edits/2026-11-16-hinton-blueprint/out/` and was sent in chat; it is not in Git.
- **Re-render:** fetch the three Commons photos named in instructions.md into `toolkit/public/imagery/hinton/`,
  rebuild the variants (halftone, sticker, duotone, negative, poster), link `public/sfx/kit` to sfx-kit's `sounds`,
  then `npx remotion render src/entry-blueprint.tsx BlueprintHinton out.mp4 --crf=18`.
- **Status:** v7, the one-take build. Built silent to a reading pace; to be re-timed to Hardik's recording.
- **v4 → v5 → v6 (Hardik's feedback, docs/10):** v4 cut between scenes, let type touch guides and cropped faces.
  v5 moved to one continuous grid but still wiped a rectangle over each old scene, wiped images sideways across
  faces, and ran inner guides through the type; a second-model review failed it. v6: 4 vertical and 5 horizontal
  guides travel, split and merge between 18 layouts; images dissolve inside the moving cell and grounds cross-fade;
  inner guides stop at the cell; payoff words are centred in their own cells.
- **Measured on v6:** smallest gap between any type and any guide on the 17 held layouts is 44 px (full-size
  stills, pixel scan). A scene detector at threshold 0.25 finds one large change in 42 s (the deliberate 3-frame
  negative flash at 37.4 s); v4 had 20 or more. Sound effects only: −24.1 LUFS, −2.9 dBTP.
- **Review:** second model failed v1–v3 and v5, and failed v6 narrowly: one take passed, type padding passed
  (its own measurements: 45 px or more everywhere), but a face was cropped by a closing cell at 30.1 s and covered
  by the follow disc at 38.9 s. v7 fixes both (an image with no successor scales whole and fades in 6 frames; the
  disc starts after the fade) and delays "POST." until the poster face has gone. v7 was checked by the editor on
  frame strips of those three transitions and re-measured (smallest gap 44 px); it was not re-reviewed by the second model.
  Open polish notes from the review: ground changes are whole-frame fades, the paper tear at 11 s is a graphic
  effect rather than a grid move, and about 0.4 s of near-empty frame at the cross is deliberate.
- Hardik's review of v7: pending.

## 16:9 landscape version (Hardik, 2026-11-16: "make the version 7 in landscape")

- **Code:** `toolkit/src/BlueprintOneTakeLandscape.tsx`, composition `BlueprintHintonLandscape` (registered in
  `toolkit/src/entry-blueprint.tsx` next to the portrait one). 1920×1080, 30 fps, 42.4 s, same beats, same word frames
  and sound effects as the portrait v7, so one voice-over re-time serves both.
- **Not a stretch:** a re-layout. Tall centre cell with the set-up line to its left and the payoff word to its right
  (the reference's arrangement); layout numbers are in the skill's "16:9 mapping".
- **Differences from the portrait v7:** the paper tear on "give up" is replaced by a slow push-in; images and charts
  are scaled whole inside a moving cell (the portrait still crops during a move); set-up type 38 px, sub-lines 44 px.
  These are not back-ported to the portrait build.
- **Checks:** pixel scan of 17 held layouts, smallest type-to-guide gap 44 px, nearest frame edge 115 px; a scene
  detector finds only the deliberate flash at 37.4 s. Sound effects only, no voice. First landscape build failed
  the second-model review (36.9 s face cropped by a collapsing cell, 10.9 s tear read as a wipe, 6.0 s badge over the
  head); the second build fixes those. Re-review result: see the chat for this round.
- Hardik's review: pending.
