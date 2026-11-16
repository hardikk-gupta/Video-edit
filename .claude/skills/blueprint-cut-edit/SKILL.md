---
name: blueprint-cut-edit
description: Edit format - "Blueprint Cut". Voice-over story essay on a paper, ink and cobalt palette, with visible dashed layout guides, images locked into grid cells, a tiny mono set-up line and one huge condensed payoff word per sentence. Use when the creator says "Blueprint Cut" or asks for the premium, precise look of the John Ottman reference.
---
# blueprint-cut-edit (edit format)

**In plain words:** a story told by a voice, where every picture sits in a ruled box you can see, and one big word
lands on screen exactly when it is said. Three colours, three kinds of lettering, a new picture trick on every sentence.

**Use when:** the creator asks for "Blueprint Cut"; the video is a story or case study told by voice-over (a person,
a brand, a moment) that ends on a lesson. Not for tool tutorials that need long screen recordings.

Measured from one reference; every number and its frame is in [docs/styles/blueprint-cut.md](../../../docs/styles/blueprint-cut.md).

## One take: the grid is the film (Hardik, 2026-11-16)
The first build cut between scenes and was rejected. These three rules come before everything else below.
- **One grid, never a cut.** A fixed set of guide lines (the Hinton reel uses 4 vertical and 5 horizontal) exists
  for the whole video. Between beats the lines travel to new positions over about 16 frames with an ease in and out
  (9 for fast command beats). Lines that a beat does not need rest on top of another line, so a new cell appears
  by a line splitting off and sliding out, and disappears by merging back. Change the number of cells often: one
  cell, two side by side, three columns, a stack, a 3×3, a single band, all lines folded into one cross for a pause.
- **Content changes inside the moving cells.** While the lines travel, the old image and the new one dissolve in
  place inside the moving cell (about 8 frames), the ground colour cross-fades over the same frames, and the last
  beat's words leave on the first frame of the move. When the next beat has no image, the old one scales down whole
  with the closing cell and is gone within 6 frames, before the next words appear; a closing cell must never crop a
  face, and no new shape may grow over a face that is still visible. Do not wipe a rectangle over the old scene and do not wipe an image sideways
  across a face: a second-model review read both as a cut and as a half face (v5, 2026-11-16). Nothing pops in on
  a static frame. This is OneTake's carry rule
  (docs/15): name what survives each boundary. Here it is always the grid.
- **Type keeps clear of the guides.** At least 40 px between any letter and any guide line, on every side. Give type
  its own cell: set-up line above the image cell, payoff word in a cell below it, a sub-line beside the word.
  Lines that subdivide an image cell (columns, a 3×3) stop at that cell's edges; only the outer lines run the full
  frame, otherwise they cut through the type above and below. Measure the gaps on full-size stills, do not trust
  the layout arithmetic: the Hinton reel's smallest measured gap is 44 px.
- **Whole faces only.** A cell never crops a face and nothing covers one: no sliver crops, no half-colour columns,
  no band over the eyes, no tear through a head. If a photo does not fit the cell with the whole head, change the cell.
- **Scale, never crop, inside a moving cell.** Lay each picture or chart out at the size of its final cell and scale
  that whole layout to fit the live cell (`Fit` in `BlueprintOneTakeLandscape.tsx`). A cell that is mid-move, or
  that collapses to a band, then shows the whole face smaller instead of a cropped one. No tears, peels or box wipes:
  two second-model reviews read the white paper-tear as a wipe; use a slow push-in on a held photo instead.
- **16:9 mapping (built and measured on the Hinton reel).** 1920×1080. A tall centre cell (800×880 at x 560–1360) holds
  the picture, like the reference's 29%–71% column. The set-up line is in the left region, right-aligned so it hugs the
  cell (38 px mono, 56 px line height); the payoff word is in the right region, left-aligned, stacked on two lines when
  it is long (150–176 px Anton), with a 44 px mono sub-line under it. Both are vertically centred on the cell. Widen a
  region by narrowing the cell (the name beat uses 700–1220). Wide texts (the Toronto line, the question, POST.) sit
  inside a wide, short band cell. Outer guides run edge to edge; guides that subdivide a cell stop at the layout's outer
  guides. Keep 100 px from the frame edge. Smallest measured type-to-guide gap: 44 px on all 17 held layouts.
- **Fade drawings before the next face appears.** Charts, networks and number rulers are `plain`: they fade out in 5 frames,
  and only then does the next image fade in. Fit an outgoing image into the live rect of its own cell slots, not the
  next beat's (that bug made a chart overlap itself and a face).
- Implementations to copy: `toolkit/src/BlueprintOneTake.tsx` (9:16) and `toolkit/src/BlueprintOneTakeLandscape.tsx` (16:9) (`BEATS[]` holds each beat's line positions, ground,
  cell content and type; one renderer interpolates the lines and runs the wipe).

## Script shape
- Paradox hook finished by 7 s ("called the worst → won the Oscar"). The claim must be readable by 2.5 s.
- Short sentences, about 2.7 words a second. Each sentence ends on, or contains, one word worth making huge.
- One silence of about half a second, placed before the payoff line. No other gaps.
- Turn to the viewer with a question, then 3 or 4 one- or two-word commands. Lesson is about a fifth of the length.
- Call to action is the last 3 to 4 seconds, built onto an object already in the shot.

## Layout
- Guides: 1 px dashed lines with a small dot at each crossing, running edge to edge. Blue on paper; white on ink or blue.
  They are never redrawn per beat: they move (see "One take" above), and the image is cropped exactly to the cell they make.
- 16:9: centre cell between 29% and 71% of the width. A narrow 13% sliver cell is the alternative for a face.
- 9:16 (our mapping, not measured from the reference; used in the Hinton reel, `toolkit/src/BlueprintOneTake.tsx`):
  cell 8% to 92% wide, 25% to 61% from the top; set-up line just above the cell, payoff word below it between 63%
  and 77%; keep the bottom 20% and the top 12% clear for the app. A set-up line must fit between the two vertical
  guides on one line; if it does not, shorten the words, never let it wrap or cross a guide.
- Payoff words sit in their own cell beside or under the image, never over a photo of a face.

## Type: three voices only
- Set-up: mono capitals, wide spacing, about 1.3% of frame height. It carries the sentence up to the payoff.
  On a 1080×1920 reel that is too small: use 34 px for set-ups and 40 px for sub-lines (second-model review, 2026-11-16).
- Payoff: heavy condensed capitals, 1 to 3 words, cap height about 9% of frame height (24% for the one full-frame word).
  It appears as a hard cut-in 0 to 2 frames after the word starts in the voice. No slide, no bounce.
- Aside: italic serif for quiet lines and for the question.
- This is the one format where condensed capitals are the brief. Elsewhere the standing rule against defaulting to
  them still holds (instruction.md).

## Colour
- Three grounds, flipped on nearly every sentence: paper, ink, cobalt. White for one or two beats. Fine grain on all.
- Photos are black and white, or cobalt duotone. Natural colour is saved for one subject at a time (a person in a
  grey crowd, the last of three versions). One other hue may appear once, on the worst moment of the story.
- Map to the creator's brand: keep the roles (warm light ground, near-black, one saturated accent) and take the
  hues from `brand.md`. The reference's cobalt is not ours by default.

## Image treatments
Give each sentence a different one, and never repeat one back to back: halftone dots building the image; sticker
cut-out with a white edge; a flicker strip across part of a still (new clip about every 4 frames); torn paper peeling away; a burn hole opening to the next shot; vertical strips sliding out of register;
1–2 frame negative flash; duotone with one subject in colour; blocks falling away; a stack of torn strips; a 3×3
mosaic assembling; blur into focus; two-tone poster; the same shot graded three ways on a repeated word.

## Pace and sound
- A new grid layout about every 1.7 s to 3 s; quiet holds of 1.3 s are allowed for an aside on black.
- A sound for each arrival, landing on the cut. Deliver at −14 LUFS (`render-ops`). Sounds come from `sfx-design`.

## Rules
- Images must be the creator's own, official material for the subject, or licensed stock, per docs/11. Film and TV
  footage, as used in the reference, is not ours to use; build the same treatments on material we can use.
- The creator's face, when it appears, is one cell in the grid and keeps natural colour (AGENTS.md rule 2).
  Duotone and halftone are for the story's images, not for the creator.
- Nothing typed crosses a guide. Motion values come from mg-kit.
- Lessons from the first build (Hinton reel, 2026-11-16): a flicker strip of words needs about half a second per
  word (footage can flick every 4 frames, words cannot); an aside on black holds 1.8 s at most; a negative flash is
  1 to 3 frames; stage photos with coloured light go black and white or duotone, never natural colour; a word over
  a photo needs a dark gradient under it; do not tear or peel a photo (see One take).
- Built once (Hinton reel) but not yet reviewed by Hardik. Until he reviews it, treat the 9:16 mapping as a first proposal.
