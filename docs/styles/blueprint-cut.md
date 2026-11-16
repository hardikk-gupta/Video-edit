# Blueprint Cut (style study)

Name given on 2026-11-15 to the style of the reference Hardik uploaded (`Video-29078.mp4`). Say **"Blueprint Cut"**
and the format skill [`blueprint-cut-edit`](../../.claude/skills/blueprint-cut-edit/SKILL.md) applies it.

**Reference:** 1276×718 (16:9), 24 fps, 40.3 s, voice-over with no face. Topic: John Ottman and the ending of
Bohemian Rhapsody; it turns into "How do you make a good video? You won't know until you ship it." Labels on the
end card: "WHAT IS A GOOD VIDEO?", "EP. 05", and an "AutoAE Studio" mark (the tool or studio that made it).
Studied at 6 fps (242 frames, all read), with scene detection, word-level transcript, pixel colour samples and an
audio level envelope. The file stays outside Git. We learn the structure only: no footage, music or graphics are reused.

**Not heard:** the audio was measured (levels, onsets, transcript), not listened to. Music genre and the character of
the sound effects are unknown.

## What the style is, in one paragraph

A voice-over essay on a three-colour system (warm paper, near-black ink, one cobalt blue). Every shot is built on
visible **layout guides**: thin dashed lines with a dot at each crossing, like print registration marks, and every
image sits exactly in the cell those guides draw. Each sentence is split in two: the set-up is tiny spaced-out mono
capitals, and **one payoff word** lands huge in a condensed heavy typeface on the frame it is spoken. The ground
colour flips on almost every sentence, and each image arrives with a different physical treatment (halftone, sticker
cut-out, torn paper, burn-through, strips, mosaic), so no two beats look the same while the grid keeps them one film.

## Correction, 2026-11-16: it is one take

Hardik's reading of the reference, which this study missed: the frame does not cut. The guide lines are one object
that lives through the whole film; they travel, the cells grow, shrink and change in number, and the content changes
inside them (see 6.0–6.7 s, where a full-frame photo closes down to a narrow cell, 7.3–8.0 s, where a small cell grows
into the next image, and 28.0–28.3 s, where the guides open out of a cross). The "24 cuts" below is a scene-detector
count of large pixel changes, not a count of editorial cuts, and "the ground flips" describes the result, not the
device. The rules that follow from this are at the top of the `blueprint-cut-edit` skill.

## Measurements

| What | Value | Where measured |
| --- | --- | --- |
| Length, rate | 40.3 s, 24 fps | ffprobe |
| Scene cuts detected | 24, about one new set-up every 1.7 s | scene filter > 0.25 |
| Voice pace | 96 words in 36.0 s = 2.7 words/s | transcript |
| Payoff words | 19 in 36 s, one every 1.9 s; never more than 3 words big at once | frames below |
| Payoff word timing | appears 0 to 2 frames after the word starts | WORST said 1.62 → on screen 1.67; FIRED 8.14 → 8.17; DEATH 18.16 → 18.17; SHIP IT 31.44 → 31.50 |
| Centre column | guides at x = 29% and 71% of width (371 and 903 of 1276), so the cell is 42% wide | frames 5.2, 33.5, 38.5 |
| Narrow sliver cell | 12.8% wide (x 482–645) | frame 7.0 |
| Guides | 1 px dashed, small dot at every crossing; blue on paper, white on ink and blue | all gridded frames |
| Loudness | −14.3 LUFS integrated, −0.5 dBTP, range 2.7 LU | loudnorm |
| Silence | one, 25.3–25.8 s, right before the payoff line "They did." | level envelope |
| Hook complete | claim readable by 2.5 s; first image on screen at 0.17 s | frames 0.17–2.5 |
| Call to action | last 3.8 s (36.5–40.3) | frames |

**Colours sampled:** paper `#ebe3db`, cobalt type on paper `#183a96`, cobalt field `#002ca8`, ink `#100d13` to
`#131217`, white card `#f6f4f5`, soft blue on ink `#586eb1`, one red duotone moment (dark value `#5b1504`) used once,
on "failed". All grounds carry fine grain.

**Three type voices** (and nothing else):
1. Tiny mono capitals, wide letter-spacing, for the set-up phrase ("THE INTERNET CALLED THIS"). About 1.3% of frame height.
2. Heavy condensed capitals for the payoff word (WORST, OSCAR, FIRED). Cap height about 9% of frame height in the
   column layout, up to 24% when the word is the whole frame (LIVE AID, half solid and half outline over the photo).
3. Italic serif for quiet asides ("and the film ends with a", "No epilogue.", "if it failed,", "he worked on it for").

## Beat map

| Time | Said | Ground | Image and treatment | Type |
| --- | --- | --- | --- | --- |
| 0.0–3.6 | The internet called this the worst edit of 2018 | paper | Halftone face assembles from dots in 0.3 s; a strip across the eyes flickers through clips, a new one about every 4 frames, locked between two guides | mono set-up left, WORST and EDIT either side of the strip, "OF 2018" tiny |
| 3.6–5.6 | The same editor won the Oscar | 4 frames of black, then blue | Sticker cut-out portrait with white outline; head opens and smaller cut-outs pop out | OSCAR in cream |
| 5.6–7.3 | His name is John Ottman | B&W photo, then ink | Full-frame photo collapses to a 13% sliver of the face | JOHN, then OTTMAN stacked |
| 7.3–10.2 | The director was fired two weeks before shooting ended | ink → paper | Photo grows from a small cell; paper tears away on "fired"; a burn hole opens to the next image | FIRED in blue, small "TWO WEEKS BEFORE / SHOOTING ENDED" |
| 10.2–13.1 | That scene was shot in the chaos | ink | Photo in the cell breaks into vertical strips that slide out of register | CHAOS, small label under the cell |
| 13.1–14.0 | and the film ends with a | full photo | 1–2 frame negative flash, then blue duotone; the subject alone returns to natural colour | italic serif subtitle |
| 14.0–15.8 | concert. Live Aid. | ink | Blue duotone close-up bleeding off the right edge | LIVE AID at 24% height, half outline |
| 15.8–17.1 | No epilogue. | black | nothing | italic serif between two hairlines, 1.3 s hold |
| 17.1–19.1 | John called the ending the Death Star | ink → paper | B&W crop grows into the centre cell | DEATH left, STAR right of the image |
| 19.1–21.4 | If it failed, the whole film failed | red duotone photo | Image breaks into blocks and falls to black | italic "if it failed," + small caps + FAILED. |
| 21.4–23.1 | He worked on it for over a year | white | Stack of torn eye-strips, a new pair of eyes every 4 frames | italic top, OVER A YEAR. blue |
| 23.1–26.1 | and still didn't know if people would like it | ink | 3×3 mosaic of one face assembles tile by tile | LIKE and IT? either side, then silence |
| 26.1–27.9 | They did. The ending won. | B&W crowd | Only the column between the guides is in colour | WON |
| 27.9–29.8 | How do you make a good video? | blue | Guides draw themselves from a cross; "good video?" cycles 4 typefaces in 0.5 s, lands on italic with a drawn underline | italic serif |
| 29.8–32.2 | You won't know until you ship it | blue photo | Silhouette comes from blur into focus; set-up types on word by word | SHIP IT |
| 32.2–33.2 | Be brave. | 2-tone poster | Blue and white threshold image | BE BRAVE. |
| 33.2–33.9 | Post. | white | empty grid | POST. alone in the cell |
| 33.9–36.5 | Optimize and optimize and optimize | full photo | Same shot three ways: negative, blue, natural colour, one per "optimize" | OPTIMIZE. held, small italic "and" |
| 36.5–40.3 | (music) | photo | Match cut onto a round object in the shot (a drum skin) that becomes the card | FOLLOW / FOR / MORE. one word at a time; series name left, "EP. 05" right |

## Story shape (why it holds attention)

Paradox hook in 7 s (worst edit → won the Oscar) → stakes raised three times → doubt → the only silence → two-word
payoff → turn the story on the viewer with a question → four short commands → follow. The lesson is 8 s of a 40 s
video; the story earns it.

## Metro Media House (the taste reference)

Hardik named @metromedia.house as the editing style he loves. On 2026-11-15 Instagram refused every request from
this environment and YouTube would not serve the videos without a sign-in, so **none of their reels were watched**.
What was read: their website (metromediahouse.co) and the public title list of their YouTube Shorts. Their site
says "We own editing trends in the industry" and "Custom editing style for your brand". Their topics are brand and
creator case studies with a paradox or question as the title ("Netflix vs Warner Bros", "The Brand Who Broke
Marketing", "Why Going Viral Can Destroy Your Brand?"). No claim about their visual style is made here until their
reels are actually watched; add that study to this file when Hardik sends the files or links that open.
