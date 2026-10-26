# "Claude did" teaser · instructions for this video

## Brief (the user's words)

- Source footage: `WhatsApp Video 2026-10-26 at 18.32.10.mp4` (not in the repo).
- "edit this in the best way you can"; then "use the paper one style"; then "every time see which is best
  for what remotion or hyperframes".
- References sent: none. Look taken from `reel-edit/themes.md` (Paper Craft) to match the paper style.
- Platform: Instagram reel, 9:16 (source aspect). Length: about 16.6 s (15.1 s speech + 1.6 s end card).

## What watching showed (`watch` skill)

- 18.9 s selfie talking head, handheld, dim room (grey wall, dark curtain), 478×850 at 49 fps (WhatsApp-compressed).
- Face found in every sample (YuNet); centre sits low and large: y 1080–1280 of 1920, face height 300–725 px.
- Lines: L1 0.6 s "I didn't edit a single second of this video, Claude did." (hook) · L2 4.8 s "no one is
  telling how this actually works in an easier way, because everyone has their own repo, everyone has their
  own secret methods" · L3 15.7 s "So I will tell you how to do this." (teaser/CTA).
- No fumbles; pauses of 0.3–0.8 s and a breath/"uh" at 4.3 s. Whisper's word boundaries were off by up to
  0.3 s on the raw file, so caption timing comes from a second transcription of the cut.

## Chosen format, renderer and skills

- Format: `paper-drawer-edit` (user's pick). Theme: Paper Craft (cream #F4EEE1, ink #1F1B16, terracotta
  #D9653B; Fraunces headings, Inter body).
- **Renderer: Remotion.** Why (docs/06 table): the drawer layout is driven by per-frame face data (the
  footage rides up with each card so the face stays above it), captions come from word-timing JSON, and the
  toolkit's render path is proven in this container. HyperFrames would win if the user wants to hand-trim on a
  timeline afterwards; nothing here needs its templates.
- Pipeline: cuts (6 pieces, `cuts.json`), cut-audit (3 edges left flagged where the suggested edge equals the
  current one: already the quietest frame, −70 to −88 dB vs speech at −20 dB), take-geometry via YuNet.

## Rules for this video

- Layout: drawers cover the lower half (top at y 960) with a torn edge; one full-page moment for the repo
  line; end card. Face mode: face steadied per cut (smoothed inside a cut only), 3% push-in.
- Type: Fraunces 600 at 80–200 px for headings, Inter 600/700 at 46–92 px.
- Captions: word pop, Classic with paper box, only while the face is alone; cards carry the line otherwise.
- Sound: quiet page-turns where a card lands, one tap, one tick, one bloom; no swooshes (docs/05).
- Unreviewed choices: card wording ("Seconds of this video I edited: 0", "Every cut, caption and card",
  "…nobody explains it simply"), generic repo names on the full page, the three steps on the last card
  (the real steps of this edit: watch, cut/cards/captions, second-model review), the end card "Follow along."

## Feedback rounds

### v1 (2026-10-26, internal, not shown)
- reel-review (separate model) FAILED it: empty numbered list read as a placeholder; video slivers at the top
  of page wipes (long ease-out tail); overlapping repo cards and a stuck-on padlock; low-contrast grey
  sublines; list rows inside the bottom 22%.
- Fixed in v2: list carries the three real steps; wipes/slides snap closed (`snap()`); repo cards in a clean
  column with the lock beside them; sublines #5E5547; captions moved up; list lifted.

### v2 (2026-10-26, sent)
- reel-review PASS (no sure problems). Left as is: the face grows at 14.0–14.5 s because he leans into the
  camera (source, not a zoom); repo page is left-weighted with empty right side.
- Render: 1080×1920, 30 fps, 16.7 s, −14.7 LUFS, true peak −2.0 dB, audio = video length, full decode OK.
- Built in Remotion: `npx remotion render src/entry-wa1832.ts PaperDrawerWA` (entry registers only this
  composition). Hand edits: `npx remotion studio src/entry-wa1832.ts`.
- The user's review (v2): see v3 below.

### v3 (2026-10-26, sent)
- The user's words: see docs/10 (bottom-panel speaker, sfx-design, no Claude-like palette, mix of whiteout /
  paper-drawer / split / caption-edit, doodle pet on a laptop, zoom cuts, omni-restyle).
- Built: `SplitMixWA` (Remotion again: per-frame face data drives both the full-face zoom cuts and the
  bottom-panel crop; the doodles are frame-stepped SVG with a 3-frame line boil). Palette white #FFFFFF,
  ink #111114, blue #2E5BFF; Inter only; Space Mono for folder names.
- Beats: face+captions (zoom cut "edit") → split counter "0" → whiteout "Claude did." → face (zoom cut
  "telling") → split + paper drawer, pet typing, speaker as pencil sketch (omni-restyle done locally with
  OpenCV `pencilSketch`, no credits) → split, six folders, padlocks, push-in → face (zoom cut "tell you") →
  split + drawer steps → whiteout end card with waving pet.
- Sound: `sfx.json` (8 cues by sfx-design) mixed by `toolkit/scripts/mix_sfx.py`. −14.6 LUFS, TP −1.9 dB.
- Review: second model PASS; fixed its likely notes (sketch look, folder labels, push-in crop, underline).
- Promoted: sound rule, palette rule, zoom-cut exception (docs/05, docs/13, instruction.md, AGENTS.md).
- The user's review: pending.
