# Hinton · Blueprint Cut · instructions for this video

## Brief (Hardik's words)

- "a Blueprint Cut story of one real person or product in AI with a paradox in it, ending on a lesson for creators.
  The pattern is 'everyone mocked X, then X won'. do this in blueprint style" (2026-11-16).
- Answers to the up-front questions: story = Geoffrey Hinton; voice = build now, re-time to his recording later;
  language = English; accent = cobalt blue.
- No footage. Reference for the look: `Video-29078.mp4`, studied in [docs/styles/blueprint-cut.md](../../docs/styles/blueprint-cut.md).
- Format: 9:16, 1080×1920, 30 fps, about 42 s, Instagram reel.

## Chosen format and skills

- `blueprint-cut-edit`. Renderer: Remotion (the toolkit is already Remotion; every word time is a constant in one
  file, which makes the later re-time simple). `reel-review` by a second model before sending.
- Not run: the seven `reel-edit` brief questions beyond the four above (no footage to cut, no captions beyond the
  format's own type), `editor-handoff`.

## Rules for this video

- Layout: cell x 90–990, y 480–1170. Set-up line at y 384, payoff word at y 1218. Nothing typed above y 230 or
  below y 1536. Hook and "EVERY AI" have their own guides.
- Type: Space Mono capitals 34 px for set-ups, 40 px for sub-lines; Anton for payoff words (164–372 px);
  EB Garamond italic for the Toronto aside and the question.
- Colour: paper `#ebe3db`, ink `#100d13`, cobalt field `#002ca8`, cobalt type on paper `#183a96`, soft blue on ink
  `#7f93d6`, white `#f6f4f5`. No other hue. His stage photos are purple-lit, so they are only used in black and
  white or cobalt.
- Image treatment per beat: halftone build + word strip · sticker cut-out + medal · full frame collapsing to a
  sliver · torn paper · network drawing breaking into strips · italic on black · year ruler · network then bar
  chart · cobalt duotone with the one full-frame word · bright column in a dimmed photo · guides from a cross and
  typeface cycle · network lighting up · two-tone poster, empty grid, negative flash, duotone · medal returns as
  the follow card.
- Sound: wyzowl/sfx-kit (CC0), one sound per arrival on its frame. No music. Effects-only file measures
  −23.6 LUFS, −2.9 dBTP; master to −14 LUFS once the voice is in.
- Voice timing: built silent at 2.7 words/s. All beat starts (`B`) and spoken-word frames (`T`) are at the top of
  `toolkit/src/BlueprintHinton.tsx`. When the recording arrives: transcribe with word times, replace `B` and `T`.

## Facts used and their sources (checked 2026-11-16)

| Line | Source |
| --- | --- |
| Supervisor (Christopher Longuet-Higgins, Edinburgh) kept telling him to give up neural networks | Edinburgh AI history interview with Hinton; Toronto Life profile; his remarks at the 2024 Nobel announcement |
| Peers called the work "nonsense", "crazy", a waste of time | Toronto Star, 2015 |
| Moved to the University of Toronto, 1987 | Wikipedia / Britannica |
| 2012: students Alex Krizhevsky and Ilya Sutskever built AlexNet; top-5 error 15.3% against 26.2% for the runner-up | ImageNet 2012 results as reported on Wikipedia |
| Nobel Prize in Physics 2024, shared with John Hopfield | Britannica |
| "Forty years": PhD work began in the early 1970s; the breakthrough was 2012 | derived |

Wording kept loose on purpose: "his bet" (neural networks were not his idea alone), "nearly every AI".

## Images (not in Git; in `toolkit/public/imagery/hinton/`, which is ignored)

All from Wikimedia Commons, CC BY 2.0, converted to black and white, duotone, halftone or cut-out:
- "Geoffrey Hinton at Collision 2024 in Toronto (cropped)": Vaughn Ridley / Collision via Sportsfile.
- "Geoffrey Hinton - Collision 2023 - Centre Stage RCZ 1307 (cropped)": Ramsey Cardy / Collision via Sportsfile.
- "Deep Thinkers on Deep Learning (cropped to Geoffrey Hinton)": Steve Jurvetson (298×418, soft when enlarged).
Credit is on the end card and must also go in the post caption. The cut-out was made with a brightness key in
PIL (the photo has a black background); the ML background remover was not available in this session.
The network drawing, bar chart, year ruler and medal disc are our own.

## Feedback rounds

### v1 → v3 (2026-11-16, before Hardik saw anything)
- Second-model review failed v1 (set-up type too small, hook words flicking every 0.13 s, split-colour face with a
  set-up in the top safe zone, "EVERY AI" over the face, a 1 s negative face, a magenta frame).
- It failed v2 on smaller points (sub-lines, Toronto hold of 2.4 s, "LEARN." on a light shirt, question undersized,
  tear flap over "GIVE UP.", set-ups crossing guides). v3 applies those fixes. Review of v3: see README.
- Hardik's review: pending.
