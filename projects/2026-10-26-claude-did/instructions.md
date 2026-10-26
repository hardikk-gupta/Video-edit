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
  "…nobody explains it simply"), generic repo names on the full page, the end card "Follow along."

## Feedback rounds

### v1 (2026-10-26)
- In progress.
