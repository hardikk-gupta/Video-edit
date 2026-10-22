# dots vs Claude Duet: 1:1 insert (2026-10-22)

**Brief:** A 2–6s motion graphic showing what references can be pulled from the internet, featuring OpenAI
**dots** vs Anthropic's **Claude Duet**. It goes in the top half of Hardik's 9:16 video (he talks in the bottom
half), but this deliverable is 1:1 and doesn't include him.

**Delivered:** 1080×1080, 30fps, 5.1s, -14 LUFS target, ~0.9MB. Sent in chat; not stored.
**Composition:** `toolkit/src/DotsVsDuet.tsx` (`npx remotion render DotsVsDuet …`). Assets: `scripts/fetch_refs_dots_duet.sh`.

## Facts used (and sources)

| Product | On screen | Source |
|---|---|---|
| dots | OpenAI · Sep 29 · DevDay · GPT-6 Astra · always-on agents | techcrunch.com/2026/09/29/openai-launches-dots-its-bubbly-agentic-avatar, tech.yahoo.com, lindy.ai |
| Claude Duet | Anthropic · Oct 21 · research preview · Opus 5.5 · proactive agent | claude.com/duet, macrumors.com/2026/10/21/anthropic-claude-duet |

The brief card copy ("Morning, Maya. 5 things in progress and 2 that need you.") is verbatim from claude.com/duet.

## References pulled

| Asset | From |
|---|---|
| dots key art (wordmark + 4 mascots), 2048×2560 | designcompass.org (OpenAI image) |
| dots product UI (integrations list, yellow) | igeeksblog.com og:image (OpenAI image) |
| Blue beret, green pear, "Alfred", purple heart | frames 24.6s / 29.5s / 30.8s / 33.2s of the official launch film (designcompass.org mp4) |
| Claude Duet app icon (SVG paths) | claude.com/static/claude-duet/app-icon-flat.svg |
| Claude Duet wordmark | claude.com/static/claude-duet/og.jpg |
| Brand colours | sampled: Duet `#F1EEE7` / `#D97757` / `#141413` / `#FAFAF8` |

## Timeline

| t | What |
|---|---|
| 0.0–1.8 | Guide grid draws; 9 reference cards land every 0.13s (blur → sharp, mask up), each captioned with its source; "refs 09 / 09" counter. Tick/pop per card. |
| 1.7–2.4 | Board drifts apart (dots cards left, Duet cards right) and blurs out while the two panels close in from the edges: black (dots) and cream (Duet). Whoosh + whip. |
| 2.0–3.0 | Left: glowing dots wordmark, facts, mascots rise and bob. Right: the Duet icon's blob grows and its loop draws on, then the wordmark and facts. Slate Anton "VS" pill on the seam (impact). |
| 2.75–5.1 | Duet "7:30 AM brief" card rises. Slow push-in, hold. |

## What worked / lessons

- A captioned reference board shows the sourcing better than saying it.
- The SVG icon let the Duet mark animate; raster logos can only fade.
- The first pass cropped the key art to "ot" (cover fit): wordmarks need `contain`.
- First split left ~0.5s of an empty half-frame: start the new content with the wipe, not after it.
- The VS pill first sat on the facts: give it its own clear band.
