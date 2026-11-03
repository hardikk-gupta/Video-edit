# Editing with Claude · instructions for this video

## Brief (Hardik's words, 2026-11-02, close paraphrase)

- "Create a video with captions on how to edit videos using Claude. No one is telling this, but this is your final stop.
  Save this so you don't lose it." Tell our portable process; the repo can be shared with people.
- Hook of 2–3 s, a **match cut**, with text like "Editing with Claude": short and catchy. Then **the mascot explains
  everything**. Give the **script** at the end so he can record the voice-over to it.
- Use the reference videos (the match-cut reference is one of them). "Fully well designed… a story well explained
  like a senior filmmaker… crazy taste… scenes like a UI/UX designer and design engineer." Don't stop until it's done.
  Ask everything up front, nothing in the middle or at the end.
- Mid-build: "change the bg of the Clawd mascot, keep it something like a cinematic type thing."

Answers given up front: hook text **"Editing with Claude"**; **~45 s, English**; Clawd **acts, no lip sync**; CTA
**only "Comment EDIT"** (no URL on screen); references **learn only, don't show**; captions **one word at a time, centre**;
look **painted Clawd + clean UI**; sound **quiet SFX only** (his VO and any music are added later).

## What watching showed (5 uploaded reels, `watch` frames + faster-whisper)

- **Match-cut reference** (26 s, @corbinsylk, `/match-cut`, 0:06–0:09): a new article page every 2–3 frames, different
  typefaces, the word **"Claude" in a red box locked at the same spot**, text around it blurred, slow push-in.
  Taken: the locked word, the cut rate and the blur falloff. Not taken: their pages, the red or the newsprint.
- @george.automates (60 s) and Web Lab (59 s): the five-repo list (HyperFrames, OneTake, collage B-roll, Claude
  Animation Base, Lemo-Opuscar). Taken: the numbered structure, "comment for links".
- Step-by-step tutorial (65 s): folder → tools → style sheet from 3–5 reels → storyboard first → plain-English changes.
  Taken: the step order. Our process is broader (review pass, feedback log).
- Hinglish talking head (60 s): one-word centred captions, light UI cards over the speaker, a step counter. Taken:
  the caption style and the cards-as-explainers idea.

## Format and skills

- Mascot route A (`mascot-animate`, Claude Animation Base) for Clawd. Remotion composites the hook, UI cards,
  captions and sound (`toolkit/src/EditWithClaude.tsx`). `watch` was used on every reference.
- No footage, so `shortform-cutaway` / `cut-audit` don't apply. The script times are the edit.

## Rules for this video

- **Layout (1080×1920):** 72 px margins. Progress bar at y 150, headline at y 214, cards from y 420 to 1150, Clawd's
  ground at y 1450, the caption at y 1548. Nothing goes in the bottom ~300 px, where the Instagram UI sits.
- **Type:** Inter only for UI. Headline 76/600, card text 32–40, mono labels 20–26 (JetBrains Mono), caption 66/600.
  The hook's locked word is serif (Charter Bold), as in the reference's newsprint.
- **Colour:** night stage `#16132A`, warm spotlight `#FFD9A0`, cream cards `#FFFCF6`, ink `#1F1E1D`, clay `#C96442`
  (`#EE9A72` on dark).
- **Motion:** cards rise in with a soft ease (0.55 s, bezier .16,1,.3,1) and leave upward. One idea per beat. Clawd
  reacts to every card event (cause, then reaction).
- **Sound:** soft ticks under the page flips, a tap where a card lands, a bloom on approve/resolve/send. Nothing else.
- **Captions:** one word, centred under Clawd, keywords in clay.

## Feedback rounds

### v1 (2026-11-02)
- Built to the brief above; cinematic background applied mid-build at Hardik's request. Review pending.

### v2 (2026-11-03): Hardik: "Create version 2 with all the new changes you suggested"
- **One workspace window for the whole film.** The hook's "Claude" box grows into it, it changes shape for each step,
  and it ends as the comment field. Step content rises in and lifts out inside it.
- **A carry at every step boundary** (OneTake): "01 One folder" flies up to become the headline; the "references" folder
  opens into the contact sheet; four contact-sheet frames fly into the storyboard; the approved panels drop into the
  timeline as clips; the "make the font bigger" note becomes line v1 of the feedback log.
- **Clawd moves with the UI**: under each folder as it lands, along with the scan line, over to tap Approve, along with
  the playhead (same screen x, same smoothstep). A follow spot trails him.
- **The hook lands on the lit stage** (not a flat colour); a slow camera drift (1.00→1.03) and a push-in for the close;
  speed-based blur on anything that flies; headline words roll in one by one.
- The intro card fills as soon as the window lands (no empty card). Script and timings unchanged, so a VO recorded to
  v1 fits v2.
