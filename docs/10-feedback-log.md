# 10 · Feedback log

Every version, what it was, what Hardik said (lightly cleaned up), and the lesson. Read this to learn the
taste. Newest at the bottom.

## Project: AI automations talk (2026-10-20)

Source: 82s WhatsApp selfie video, 848×478, 60fps, landscape. Hardik talking about three AI automations he uses.

### v1: 9:16 reel in the portfolio's style
- 1080×1920, face card centred, word-by-word captions, chapter tags, sticker callouts, SFX. Styled with the
  portfolio website's DESIGN.md (pixel grid, Geist Pixel, pillar colours) because the session started in that repo.
- **Feedback:** "Will be in the same ratio that it was given, landscape… not the vertical one… I think you are
  rendering into the theme of… the portfolio repo. But I don't want that." Sent two Pinterest references.
- **Lessons:** keep the source ratio; never borrow an unrelated design system; wait for references.

### v2: 16:9, Smart Studios grid + Base44 cards
- Grey canvas, dashed red grid, Anton, red cells, a black-and-white tile, the face filling big cells or full-frame.
- **Feedback:** "This is the work of a beginner motion designer… my face is visible at two places… my face
  block should be always in the smaller block… the text should not be overlapping the guidelines."
- **Lessons:** one small face tile; never two copies; content inside cells; layouts per beat; expo easing,
  not springs.

### v2.1: grid engine rebuild (not sent as final)
- Per-beat layouts with gliding guides, cell-anchored content, captions under the bottom guide, one face tile.
- Overtaken by a new reference before it went out.

### v2.5: Jitter-style 2.5D camera with stock photos
- Black canvas, cards at depth with depth-of-field, camera travel, slate pills, Unsplash photos (phone, sunrise,
  coffee, leaves, desk, laptop).
- **Feedback:** "the random tea, the random morning, that is not something that I am going to put in my
  videos… Why are you not merging two designs?… I will put images every time."
- **Lessons:** no stock imagery; merge references instead of replacing; leave image slots for the person.

### v3: merged system + Hairline explainers
- Grid + Anton + red cells (Smart Studios) on black with glass cards, slate pills, blur, mono furniture (Jitter),
  dashed-underlined sentences (Base44). Hairline figures as explainers (Hardik suggested the repo). First
  pass tinted the face tile red duotone with a halftone screen and punched in 1.15–1.26×.
- **Feedback:** "Please don't make me red in the whole scenario. And the camera should not be zoomed at me so much."
- **Fix shipped:** natural colour, 1.00–1.05× framing, the red-halftone stills of him removed.
- **Verdict:** "This was cool enough."
- **Lessons:** the person is never a graphic element: no tint, no treatment, no tight crop.

### After v3: this repo
- "Only the skills, only the methods… not the videos… so that if I start with some other agent, then it can
  create the same kind of video." References always come with the brief; a storyline alone can be the source;
  voice comes from TTS (ElevenLabs) when there's no footage.

## Project: dots vs Claude Duet insert (2026-10-22)

- Brief: 2–6s, 1:1, show what references can be pulled from the internet; top half of a 9:16 split; don't
  include Hardik. Built a captioned reference board (9 official assets) that splits into a black/cream versus.
- Self-review fixes before sending: key-art crop (cover → contain), dead half-frame in the split, VS pill
  over text, black mismatch on the dots side. See `projects/2026-10-dots-vs-duet/README.md`.
- Feedback: (pending)
