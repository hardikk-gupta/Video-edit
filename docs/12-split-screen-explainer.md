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

The top region is a square (478 × 478), about 56% of this particular portrait frame; the presenter occupies
the remaining 44%. "Half screen" describes the arrangement, not an exact 50/50 measurement. At 1080 × 1920,
this corresponds to a 1080-square visual region and an 840-pixel presenter region. An exact 50/50 version
would use 1080 × 960 panels. Match the brief rather than distorting footage to force either ratio.

For this requested format, the presenter deliberately fills the bottom panel. That is an explicit exception
to the older small-face-tile layout, not a new rule for all videos. Keep one natural-colour speaker instance,
stable headroom and a considered crop; reserve the attention-directing camera moves for the evidence above.

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

Many reference beats change roughly every 1.5–3s, but speech and comprehension determine the timing. Do not
move on a mechanical timer or add continuous drift just to keep pixels moving. A useful hold can be still.

**Checked against this upload:** the generated word timings put "53" at about 20.64s, "26" at 22.30s,
"cost" at 23.54s, and "testing" at 27.80s. The inspected frames show the line-of-code row boxed at 21s,
the cost row boxed at 24s, and the 98% testing statistic enlarged at 28s. These are reference observations,
not independent verification of the project's benchmark claims. Hardik's "65k stars" is a hypothetical
editing example; the reference's transcript says approximately 170,000 stars.

## Camera language inside the card

- **Push-in to an element**: ease the card's content transform so the target's bounding box fills ~60–70% of
  the card width, over 0.5–0.8s (OUT_EXPO). Keep the push continuous at ~1–2%/s after landing.
- **Highlight**: 2px white rounded rectangle (radius ~6px) around the target, the rest of the page dimmed
  to ~35–45% brightness. The box moves between items (list rungs, bars) rather than fading out and in.
- **Scroll**: pan vertically through a full-page screenshot between sections instead of cutting.
- **Between pages**: quick blur/cross-dissolve (~0.25s).
- **Use the space for the claim**: a whole webpage is useful for orientation, but its tiny text is not the
  shot. Crop or push to the relevant phrase, row, figure or control so it can be read at phone size. Keep
  enough context to avoid misrepresenting the source. Highlight the exact supporting element, not a large
  generic panel or an unrelated cursor location.

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
   A clearly spoken URL can be used directly. If only a repo name is spoken, identify the owner and verify
   the match; ask for the exact link if ambiguous. Do not select a different popular repo by guesswork.
3. **Capture** with `toolkit/scripts/web_shot.mjs` (Playwright + preinstalled Chromium, 1280-wide viewport,
   2× scale, dark mode):
   `node scripts/web_shot.mjs <url> out.png 'text=/^171k/' 'text=Already in this codebase'`
   It returns each match's bounding box in CSS px (image is 2×) → these are the zoom/highlight targets.
   Match by **visible text** (the number or phrase spoken); CSS ids on sites like GitHub change.
   Use full-page captures for scroll beats; star history from star-history.com.
4. **Shot list**: a table of word time → page → target box → move (push / highlight / scroll) → keyword
   caption. Get the numbers right: if the page says 171k and the speaker says 170,000, show the page.
   Record the capture date. Distinguish ordinary rounding from a substantive discrepancy; flag a material
   mismatch instead of altering the screenshot or inventing a matching historical count. Check automatic
   transcription of product names, numbers and URLs against the source before building the shot list.
5. **Build** in Remotion at 1080×1920: card component that takes a screenshot + keyframed camera
   (scale/translate) + highlight box; speaker video in the bottom panel; seam captions; CTA outro.
6. **Stills review** at phone size: every beat's target is readable, and the highlight lands on the word.

## Lessons from the first build (2026-10-22, jinn → dots/Duet/Grok Bot)

- **Box phrases, not paragraphs.** A paragraph box forces a wide view and body text becomes unreadable.
  `scripts/web_phrases.mjs` returns the exact rect of a phrase (Range rects over text nodes); zoom so body text
  renders at ~25–40px on the 1080 canvas (view width ≈ 800–1150 image px for 2× captures of 15px text).
- **Capture clean.** `scripts/web_capture.mjs` clicks "Reject all"/"Accept all" and removes fixed/sticky
  overlays (cookie banners, promo popups, sticky headers) before a full-page 2× dark-mode capture.
- **Animated page elements may be blank in a capture** (Duet's phone notification). Rebuild them in code with
  the page's exact copy and place them in image coordinates so the camera treats them like the page.
- **Some sources block automation** (openai.com 403 even in a real browser; media.x.ai video). Use reputable
  press copies of the official images and say so in the project record.
- **One card, morphing opening:** a full-frame opener can shrink into the card while the speaker slides in;
  it hides the source's own transitions.
- **Speaker framing per location:** set the crop window's top (y0) per shot location so the face sits in the
  upper half of the panel with headroom.
- **Loudness:** phone audio needs two-pass loudnorm (measure, then apply with `linear=true`); single pass undershot by 3dB.

## Asks for Hardik (only what changes the work)

- Links to anything named in the audio, if he has them.
- Series label text, handle, and the CTA keyword.
- Whether the bottom panel should cut (jump cuts) or run continuous.

## Don'ts

- Don't show a generic or stock visual for a specific claim; capture the real source.
- Don't let the top panel lag the speech; the highlight lands on the word, not a beat later.
- Don't fill the top margin or add decorative furniture; one card, one point at a time.
- Don't zoom or tint the speaker (standing rule from [04](04-motion-rules.md)).
