# 09 · Review checklist (run on the stills sheet before every full render)

## Story
- [ ] The first 3s state the hook in type.
- [ ] Every beat shows the idea (card, explainer, type), not just the speaker.
- [ ] Chapters are numbered and named the same way in the headline, top bar and index.
- [ ] Ends on the takeaway; add an end card only when the brief calls for it. No "bye bye".

## The person
- [ ] Face appears in at most one place in every frame (check mock-ups and image slots too).
- [ ] Face is a small tile, natural colour, framing ≤1.05×.
      For an explicit Mode E brief, check the requested lower-panel presenter instead of requiring a small
      tile; keep one instance, stable headroom and natural colour.
- [ ] No stock or random images. Use the person's images or the actual subject's relevant official
      material, with recorded sources; leave unnecessary slots empty.

## Layout
- [ ] No text, card or caption crosses a guide line. Padding ≥40px.
- [ ] Nothing collides with the top bar, the bottom band or the frame edge.
- [ ] Headlines don't wrap mid-phrase; two-tone lines break where intended.
- [ ] Useful alignments repeat within the film, so the system reads; no corner position is compulsory.
- [ ] Alignment is deliberate within this film; it does not mechanically repeat the previous reel's template.
- [ ] No tiny pre-header, decorative cross/VS badge or metadata line above the actual heading.
- [ ] Natural type proportions, weights and a coherent size hierarchy remain readable at phone size and
      inside the intended panel of a vertical reel. Anton/all-caps is not an automatic large-text choice.
- [ ] The comparison layout was chosen for the story; it is not two stacked rounded cards by default.
- [ ] Negative space is purposeful. Grid cells are not filled merely because they exist.

## Motion
- [ ] Content leaves before the guides move; enters after they land.
- [ ] No bouncy springs on type/UI; entrances blur → sharp.
- [ ] Reveals land on their words (compare with `words.json`).
- [ ] At most one statement pill per ~8s.

## Sound and file
- [ ] Voice plays once; visual copies are muted.
- [ ] SFX on fast events only; nothing louder than the voice.
- [ ] Final: 1920×1080 (or the brief's ratio), 30fps, -14 to -15 LUFS integrated, ~12MB/min.
- [ ] Tell the person what you couldn't verify (you can't hear it).

## Learning and delivery

- [ ] Current references, viewing dates, sources and design decisions are recorded in the project notes.
- [ ] Hardik's specific positive and negative feedback is logged without inventing approval.
- [ ] The relevant guidance and changelog are updated after creation, revision or feedback; old defaults
      do not contradict the new lesson. Follow [instruction.md](../instruction.md).
- [ ] Work stayed within the request. Documentation-only feedback did not trigger another video.


## Cohesion check for the jinn rework

- Compare representative scenes beside each other: do grid, type and drawing treatment belong together?
- Inspect the visible figure bounds throughout its motion. A large SVG host can still draw a tiny object;
  enlarging it can also put moving parts behind text or captions. Inspect both outcomes at phone size.
- Match optical weight as well as equal tile dimensions. Transparent mascot posters may need deliberate
  upscaling; `thumbnail()` alone never enlarges a small source.
- Preserve framing corrections when adopting a stronger reference's visual direction.

- **Wipes and slide-ups must finish clean** (reel-review, 2026-10-26): an ease-out tail leaves a few pixels
  of the previous picture showing for several frames, which reads as a glitch. Snap the last few percent
  (`snap()` in `toolkit/src/PaperDrawerWA.tsx`). A numbered list with empty lines reads as unfinished:
  give each row real content.
