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
- **Status:** v6, the one-take build. Built silent to a reading pace; to be re-timed to Hardik's recording.
- **v4 → v5 → v6 (Hardik's feedback, docs/10):** v4 cut between scenes, let type touch guides and cropped faces.
  v5 moved to one continuous grid but still wiped a rectangle over each old scene, wiped images sideways across
  faces, and ran inner guides through the type; a second-model review failed it. v6: 4 vertical and 5 horizontal
  guides travel, split and merge between 18 layouts; images dissolve inside the moving cell and grounds cross-fade;
  inner guides stop at the cell; payoff words are centred in their own cells.
- **Measured on v6:** smallest gap between any type and any guide on the 17 held layouts is 44 px (full-size
  stills, pixel scan). A scene detector at threshold 0.25 finds one large change in 42 s (the deliberate 3-frame
  negative flash at 37.4 s); v4 had 20 or more. Sound effects only: −24.1 LUFS, −2.9 dBTP.
- **Review:** second model failed v1–v3 and v5. v6 review result: see the chat for this round.
- Hardik's review of v6: pending.
