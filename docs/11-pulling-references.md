# 11 · Pulling references and imagery from the web

When a video is about real products, launches or people, the visuals should be **their real material**:
official key art, product UI, launch-film frames, logos and copy. This is the method from the dots vs Claude
Duet piece (`projects/2026-10-dots-vs-duet/`).

This is not "stock imagery". The rule against random web photos ([04](04-motion-rules.md)) stands; this is
sourcing the actual subject.

## 1. Research the subject first

- `WebSearch` (mode `extended` for anything recent) to learn what the thing is, its launch date, model and key
  claims. Facts on screen must come from sources; write down the URLs.
- Prefer the company's own page, then reputable press. Note where sources disagree and avoid those facts.

## 2. Find the assets

| Where | How |
|---|---|
| Official product page | `curl -A "<browser UA>"` it; grep `og:image` / `twitter:image`; grep `src|href|poster` for `.svg/.png/.webp/.mp4` and `/static/` paths. claude.com/duet exposed its app icon as an SVG. |
| Page copy | grep `<h1|h2|p>` from the HTML. Real product copy (e.g. Duet's "Morning, Maya. 5 things in progress and 2 that need you.") makes UI cards authentic. |
| Press articles | Their `og:image` is usually the official press image at 1200px+. Try several outlets: some 403 (fastcompany, technology.org, openai.com), others don't (techcrunch, gizmodo, sfstandard, designcompass, igeeksblog). |
| Launch film | Design blogs often embed the official film as a plain `.mp4` (`designcompass.org/.../openai-dots.mp4`). Tile 24 frames to find clean shots, then pull exact frames with `ffmpeg -ss <t>`. |
| Blocked page | `WebFetch` sometimes gets through when curl doesn't (Unsplash), but openai.com blocked both. Go to press copies instead. |

## 3. Look before you use

Tile everything you downloaded into one contact sheet and `Read` it. Pick by quality and meaning. Sample brand
colours from the assets (PIL `getpixel`): e.g. Duet cream `#F1EEE7`, coral `#D97757`, ink `#141413`; dots UI
yellow `#FFC233`.

## 4. Prepare

- Crop to purpose with ffmpeg (`crop=w:h:x:y`): wordmark and mascots out of one key-art poster; each mascot
  out of its film frame.
- **Vectors beat bitmaps.** With an SVG you can animate the parts: the Duet icon's blob scales in and its loop
  wipes on (it's a filled shape, so reveal it with an animated `clipPath` rect, not a stroke dash).
- Match backgrounds: key art on pure black → put it on `#000`, not the canvas grey-black, or the edge shows.
- Put the whole fetch-and-crop in a script (`toolkit/scripts/fetch_refs_<project>.sh`) so any agent can rebuild
  the assets. Outputs go to `public/refs/` and are **never committed** (third-party material).

## 5. Show the sourcing on screen (when it's the point)

A captioned reference board is a strong opener: a guide grid fills card by card, each card captioned in mono
with its source ("OpenAI · launch film", "claude.com/duet · icon"), plus a "refs 07 / 09" counter. Keep
"source · openai.com" style credits on the final layout too.

## Rights

Official press material is used here for commentary/comparison of the products. Don't alter logos or put
words in a brand's mouth. Don't publish a page or graphic that could pass as the brand's own.
