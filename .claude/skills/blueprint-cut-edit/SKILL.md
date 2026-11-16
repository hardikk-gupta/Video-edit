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

## Script shape
- Paradox hook finished by 7 s ("called the worst → won the Oscar"). The claim must be readable by 2.5 s.
- Short sentences, about 2.7 words a second. Each sentence ends on, or contains, one word worth making huge.
- One silence of about half a second, placed before the payoff line. No other gaps.
- Turn to the viewer with a question, then 3 or 4 one- or two-word commands. Lesson is about a fifth of the length.
- Call to action is the last 3 to 4 seconds, built onto an object already in the shot.

## Layout
- Guides: 1 px dashed lines with a small dot at each crossing, running edge to edge. Blue on paper; white on ink or blue.
  They are drawn in at the start of a beat and the image is cropped exactly to the cell they make.
- 16:9: centre cell between 29% and 71% of the width. A narrow 13% sliver cell is the alternative for a face.
- 9:16 (our mapping, not measured from the reference; used in the Hinton reel, `toolkit/src/BlueprintHinton.tsx`):
  cell 8% to 92% wide, 25% to 61% from the top; set-up line just above the cell, payoff word below it between 63%
  and 77%; keep the bottom 20% and the top 12% clear for the app. A set-up line must fit between the two vertical
  guides on one line; if it does not, shorten the words, never let it wrap or cross a guide.
- Payoff words sit beside or under the cell, never over the subject's face. A full-frame word (one per video) may
  overlap the photo if half of it is outline only.

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
cut-out with a white edge; a flicker strip across part of a still (new clip about every 4 frames); photo collapsing
to a sliver; torn paper peeling away; a burn hole opening to the next shot; vertical strips sliding out of register;
1–2 frame negative flash; duotone with one subject in colour; blocks falling away; a stack of torn strips; a 3×3
mosaic assembling; blur into focus; two-tone poster; the same shot graded three ways on a repeated word.

## Pace and sound
- A new set-up about every 1.7 s; quiet holds of 1.3 s are allowed for an aside on black.
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
  a photo needs a dark gradient under it; a tear or peel starts after the payoff word has landed.
- Built once (Hinton reel) but not yet reviewed by Hardik. Until he reviews it, treat the 9:16 mapping as a first proposal.
