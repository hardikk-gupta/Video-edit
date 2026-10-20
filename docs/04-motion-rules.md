# 04 · Motion, framing and layout: do's and don'ts

## Easing and timing

- Entrances: `OUT_EXPO = bezier(0.16, 1, 0.3, 1)`, 0.6–0.9s. Exits: `IN_EXPO = bezier(0.7, 0, 0.84, 0)`,
  0.25–0.35s. Guide moves and wipes: `IN_OUT = bezier(0.83, 0, 0.17, 1)`, 0.6–0.8s.
- **Don't** use bouncy springs for UI and type. They read as beginner work. Springs only for physical objects
  (a toggle knob).
- Stagger related items by 0.05–0.1s (headline lines, list rows, chips). More than that drags.
- Order inside a beat: old content leaves (0.3s) → guides move (0.8s) → new content enters (from +0.35s).
  Never move guides under live content.
- Entrances go blur → sharp (12px → 0) together with a 40px rise and a fade. Exits mirror it, shorter.
- Pin every reveal to the word that motivates it (a word's start time from `words.json`).

## Layout

- **Do** give every beat a layout and let the guides glide between them. That is the main motion idea.
- **Do** keep whitespace: an empty cell is fine; a cell filled with filler is not.
- **Don't** let any text, card or caption cross a guide. Anchor to cells with 40px padding; check the stills.
- **Don't** put content in the top margin or the bottom band except the frame furniture and captions.
- Headlines bottom-left in their cell, labels top-right or bottom-right. Repeat these positions so the system reads.

## The person on screen

- **One face tile, one place, small.** Never full-frame, never two copies at once (watch for the person's image
  inside a mock-up while the tile is also showing).
- **Natural colour.** No duotone, no tint, no halftone or dither of the person. (v3 tried red duotone; Hardik:
  "Please don't make me red in the whole scenario.")
- **Gentle framing.** 1.00–1.05× punch-ins on cut points, at most 0.2%/s of slow push. (v3 tried 1.15–1.26×;
  Hardik: "the camera should not be zoomed at me so much.")
- The face is optional per beat. When the story is on a card or explainer, close the tile and give the cell to
  the idea.
- Jump cuts: hide them with a small framing change (1.00 ↔ 1.05) and a layout move or pill, not a big zoom.

## Imagery

- **Don't** fill with stock photography. v2.5 used Unsplash coffee/sunrise/leaf/desk shots: rejected as
  "random imageries… not something that I am going to put in my videos".
- **Do** leave named image slots for the person's images, and design every beat to stand without them
  (type + UI + explainer).
- Line explainers (Hairline) carry the "imagery" job without photos.

## References

- **Merge, don't replace.** v2.5 dropped the grid look entirely for the newest reference and got: "why are you
  not merging two designs?" Take the system from one reference (grid, type) and the finish from another
  (black, glass, blur, pills) and make one language.
- Study references frame by frame before designing; never from the thumbnail alone.
- Copy principles, not assets: no logos, names or exact layouts from the reference.

## Statement pills

- Use them to mark chapter changes: one word (CRAZY, 08:00, LEARN, DESIGN). The pill covers the layout change
  behind it.
- Stage behind blurs to 20px and dims 45%. The pill drifts 12px/s sideways and scales 0.84 → 1 in.
- No more than one pill every ~8s.

## Captions

- In the band under the bottom guide, centred, Inter 500 34px, ≤6 words or ≤34 characters per chunk; break on
  punctuation and pauses over 0.35s.
- Spoken words white, upcoming words `#4A4A4E`. No boxes, no emoji, no bouncing words.

## What made it "beginner" (avoid)

- A big face filling the frame with text slapped on top.
- The same face in two places.
- Text over the guides.
- Bouncy springs everywhere; everything popping in at once.
- A theme borrowed from somewhere unrelated (v1 used the portfolio website's design system, unasked).
- 9:16 when the source was 16:9.
- Random stock photos.
