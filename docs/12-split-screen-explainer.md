# 12 · Split-screen explainer (graphics on top, speaker below)

A 9:16 format where the **top panel shows the real things being talked about** (repo pages, charts, product
sites), driven moment by moment by what the speaker says, and the **bottom panel is the speaker**.
Studied from a reference Hardik supplied on 2026-10-22 (breakdown in
[projects/2026-10-split-screen-explainer](../projects/2026-10-split-screen-explainer/README.md)).

The core idea, in Hardik's words: the top half "is following, listening to the instruction, and seeing,
analyzing what the person is saying. On that basis, the graphics are there… if he says this repo has 65k
stars, the shot will be zoomed towards the 65k stars."

## Layout (measured on the reference, 478×850 → scale ×2.26 for 1080×1920)

| Zone | Reference (px of 850 tall) | At 1080×1920 | Notes |
|---|---|---|---|
| Top margin | 0–110 | 0–250 | Pure black, empty. Keeps clear of the platform's top UI. |
| Graphics card | x 44–434, y 110–455 | x 100–980, y 250–1030 | One dark "browser card": ~9% side margins, ~10px radius, 1px faint border. |
| Seam | ~455–478 | ~1030–1080 | Where the keyword caption and labels sit, straddling both panels. |
| Speaker | 478–850 | 1080–1920 | Tight medium close-up, face centred, natural colour, no zooms. |

The card is the only thing in the top panel. Everything moves *inside* the card; the frame stays calm.

## The sync rule: say it → show it → point at it

Every spoken claim gets the real source on screen, timed to the word:

1. **Name** ("This GitHub repo…") → the actual page, full card.
2. **Number** ("…has 170,000 stars") → push into the element that shows that number (Star counter), and/or
   an animated chart (star-history line drawing up to 171k).
3. **Concept** ("think like an experienced developer") → the section of the project's own site that says
   it, scrolled into view, the relevant sentence highlighted.
4. **List / steps** ("reuses what's already existing") → the list on the page, highlight box stepping to
   the matching item as it's said.
5. **Stats** ("53% less code, 26% lesser cost") → the benchmark bars; highlight box jumps bar to bar on
   each number.
6. **Compatibility** ("works with Claude Code, Codex, Cursor…") → install docs, highlight each name.
7. **Free / open source** → the license / badge.
8. **CTA** ("comment Pony") → a chat input that types the keyword, then a white CTA label, then the
   handle/logo outro with the frame dimming.

Beats change every 1.5–3s; within a beat the camera is never fully still (slow scroll or push).

## Camera language inside the card

- **Push-in to an element**: ease the card's content transform so the target's bounding box fills ~60–70% of
  the card width, over 0.5–0.8s (OUT_EXPO). Keep the push continuous at ~1–2%/s after landing.
- **Highlight**: 2px white rounded rectangle (radius ~6px) around the target, the rest of the page dimmed
  to ~35–45% brightness. The box moves between items (list rungs, bars) rather than fading out and in.
- **Scroll**: pan vertically through a full-page screenshot between sections instead of cutting.
- **Between pages**: quick blur/cross-dissolve (~0.25s).

## Type on the seam

- **Keyword caption**: one emphasised word or number at a time ("write", "53%", "26%", "testing",
  "bugs", "completely"), centred on the seam, a readable serif with a soft shadow, ~0.5s each. It is not a
  full transcript.
- **Series label** at the start: a white rounded label in the same serif ("Claude for Designers / EP38
  (Optimize code)" in the reference).
- **Handle watermark**: small Instagram glyph + handle, either on the card's top-right or in the speaker
  panel.

Use Hardik's own series name, handle and font choices; the reference's are not to be copied.

## Pipeline

1. **Transcript** (`scripts/transcribe.py`, prompt with product names). Word timings drive every beat.
2. **Entity pass**: list every repo, product, URL, number, list item and name mentioned, with its word time.
   If Hardik gave links, use them; otherwise find them (search) and **confirm with Hardik when unsure**.
3. **Capture** with `toolkit/scripts/web_shot.mjs` (Playwright + preinstalled Chromium, 1280-wide viewport,
   2× scale, dark mode):
   `node scripts/web_shot.mjs <url> out.png 'text=/^171k/' 'text=Already in this codebase'`
   It returns each match's bounding box in CSS px (image is 2×) → these are the zoom/highlight targets.
   Match by **visible text** (the number or phrase spoken); CSS ids on sites like GitHub change.
   Use full-page captures for scroll beats; star history from star-history.com.
4. **Shot list**: a table of word time → page → target box → move (push / highlight / scroll) → keyword
   caption. Get the numbers right: if the page says 171k and the speaker says 170,000, show the page.
5. **Build** in Remotion at 1080×1920: card component that takes a screenshot + keyframed camera
   (scale/translate) + highlight box; speaker video in the bottom panel; seam captions; CTA outro.
6. **Stills review** at phone size: every beat's target is readable, and the highlight lands on the word.

## Asks for Hardik (only what changes the work)

- Links to anything named in the audio, if he has them.
- Series label text, handle, and the CTA keyword.
- Whether the bottom panel should cut (jump cuts) or run continuous.

## Don'ts

- Don't show a generic or stock visual for a specific claim; capture the real source.
- Don't let the top panel lag the speech; the highlight lands on the word, not a beat later.
- Don't fill the top margin or add decorative furniture; one card, one point at a time.
- Don't zoom or tint the speaker (standing rule from [04](04-motion-rules.md)).
