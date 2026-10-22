# 05 · Sound

## Voice

- Footage: `scripts/build_talk.py` runs `highpass=85, afftdn=nf=-28, eq 200Hz -2dB, eq 3.5kHz +3dB,
  acompressor 3:1 @ -20dB, alimiter 0.9`, plus 12–15ms fades on every cut.
- TTS (ElevenLabs etc.): usually clean already; skip the chain, just loudness-master at the end.
- In Remotion the voice plays once, from `<Audio src="talk.mp4">`. Every `OffthreadVideo` of the face is `muted`.

## SFX library (`toolkit/public/sfx/`)

| File | Source | Use |
|---|---|---|
| whoosh, whip | `@remotion/sfx` (remotion.media) | guide moves, chapter changes, cards flying |
| ding | `@remotion/sfx` | notification arrives, end card |
| mouse-click | `@remotion/sfx` | send button; at 0.08 volume every ~0.1s for typing |
| page-turn | `@remotion/sfx` | a document appears |
| shutter-modern | `@remotion/sfx` | design "captured" (Figma moment) |
| switch | `@remotion/sfx` | toggles, notifications |
| riser | synthesized (`scripts/synth_sfx.py`) | 1.6s build into the final statement |
| impact | synthesized | statement pills, the final word |
| swoosh | synthesized | softer transitions, exits |
| pop | synthesized | chips, list items, frames appearing |
| tick | synthesized | counters, results rows |
| tap | synthesized | a soft, short landing: an item settling into a grid cell, a list tick, a send |
| bloom | synthesized | a low, 0.7s warm tone for a product/brand reveal (max three per video) |

To get more from Remotion's library: `npm pack @remotion/sfx`, then grep `dist` for `remotion.media/*.wav`
URLs and `curl` them. Many of them are meme sounds (vine-boom, bruh…); only the neutral ones above suit premium work.

## Hardik's sound rule (2026-10-22, jinn v2 feedback, overrides the placement defaults below)

SFX are **supporting, not decoration**. He called v2's sound "so loud" with "swoosh everywhere" and said he
doesn't like the other effects used so far. Default now:
- Only `tap` and `bloom`. No swoosh, whoosh, whip, riser, impact, ding or pop unless he asks.
- Sound only on moments that land (a reveal named in the voice, a tick in a list, a send), not on every move
  or transition. v3 of the jinn video used 11 taps and 3 blooms in 56s.
- Volumes: tap 0.035–0.05, bloom ~0.07 (files peak at 0.89); a sound must sit well under the voice.

## Placement (older default; see the rule above)

- Every visible event that moves fast gets a sound; slow drifts don't.
- Chapter change: `whip` 0.1s before + `impact` on the pill. Guide move: `whoosh` 0.05s before.
- Lists and counters: `tick`/`pop` on each item at 0.2–0.28 volume.
- Typing: `mouse-click` at 0.08 every 0.1–0.11s across the typing window.
- Build to the takeaway: `riser` ending exactly on the final word, then `impact` on it.
- Volumes 0.08–0.65. Nothing should compete with the voice.
- No music bed by default. The person adds a track in the app they post from (trending audio). Mention it.

## Loudness

`scripts/master.sh` → `loudnorm I=-14 TP=-1 LRA=9`, which lands around -15 LUFS integrated measured after AAC.
Verify with `ffmpeg -af ebur128`.

You can't listen. Say so, and say what you checked: cut points snapped to silence (RMS), each suspicious join
re-transcribed, and loudness measured.
