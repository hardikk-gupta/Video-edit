# "Jinn" → dots, Claude Duet, Grok Bot (2026-10-22)

**Status:** original v3 delivered and Codex Hairline revision rendered separately; both await review. History below.
**Format:** split-screen explainer ([docs/12](../../docs/12-split-screen-explainer.md)), following the
@SHAI.HQ reference studied in [the reference project](../2026-10-split-screen-explainer/README.md).
**Composition:** `toolkit/src/GrokDotsDuet.tsx` (`npx remotion render GrokDotsDuet …`).
**Assets:** `scripts/fetch_refs_dots_duet.sh` then `scripts/fetch_refs_gdd.sh <footage>` (outputs gitignored).
**Delivered (v3):** 1080×1920, 30fps, 56.2s, −14.5 LUFS integrated, 30MB.

## v3 (after Hardik's v2 feedback) — delivered, review pending

- **Grid stage:** the top section is the dots-vs-Duet grid: dashed red guides (`rgba(194,34,15,.6)`, 1.6px,
  dash 6/7) at x 60/380/700/1020 and y 150/480/810 (3 columns × 2 rows of 320×330), white dots at the
  crossings, drawn in at 1.85s. Every element sits in a cell or merged cells (24px padding), entering
  blur-to-sharp. Caption label stays on the seam at y 858; speaker unchanged from v2.
- **Trio fixed:** three identical 196px tiles (radius 22.5%), each centred in a top-row cell: dots mascot
  (crop of the key art), Duet icon (SVG, animated), Grok Bot orb on xAI's blue. Names 44px and makers 28px
  grey centred on shared baselines in the row below. Used at the opening (1.85–3.5) and from each product's
  name (42.46 / 44.56 / 46.68) to the end.
- **Hairline does the explaining:** hub (workflow / mails / calendars), phosphor (morning brief), settle
  (does it for you + tick list), slow (you log off, it keeps going), terminal (prompt typed + sent), riffle
  (5 in progress / 2 need you), laptop (own virtual computer), branches (24/7 on the backend).
- **Type:** Inter only, one scale 96 / 64 / 44 / 28 (plus the 150px counters).
- **Sound:** only `tap` (11×, 0.035–0.05) and `bloom` (3×, 0.07, the product reveals). No swoosh/whoosh/riser/
  impact. Two-pass loudnorm to −14.5 LUFS.
- **Checks:** stills at 13 beats in a contact sheet; Hairline figures were too small in their cells and were
  enlarged (settle/phosphor/riffle 360, slow/terminal 470); face fully visible in every location checked.

## Codex Hairline revision — review pending

Composition: `JinnHairlineRevision` in `toolkit/src/JinnHairlineRevision.tsx`. Kept separate from
`GrokDotsDuet` because another edit was published while this session was rendering. Both implementations
remain available; this session does not replace the other edit or claim Hardik approved either.

- Source: normal 478×850 copy; the white-header copy has identical decoded audio. Original animated
  opening plays full-frame until 1.85s, without captions, graphics or SFX. Earlier notes calling it a
  still, and describing its first spoken line incorrectly, were mistaken.
- Presenter: y 858–1920. Full source width retained, measured vertical tracking from `gdd-framing.json`,
  constant viewport height per location (550 / 610 / 510 source px). The old y225 crop cut hair around
  18–19s. Audit 106 detected samples, estimating hair-top and chin; camera-whip misses at 10.5 and19.5s
  require manual inspection. Original edge crops cannot be recovered.
- Upper field: black, no inner card or website/mail screenshots. Earlier AI logos during the AI-history
  line; workflow nodes for the spoken workflow/mail/calendar terms; neutral task states without fabricated
  counts; no unspoken model versions. Individual Dots mascots remain complete at their named beat.
- Product timing: Dots42.35s, Duet44.5s, Grok Bot46.35s, all three48.15s. No early product trio.
- Computer28.3–30.38s: Hairline's built-in `laptop`, deterministic 1/60s stepping and1.2s pre-roll to
  reach the lid-opening gesture. Large1000×800 stage, no nested panel. Hardik rejected the generated
  laptop/cube illustration; it is removed from the composition and is not a dependency.
- Captions: white seam label, Inter44, short Hinglish chunks. Natural headline type, no tiny overlines.
- Audio: `scripts/prepare_gdd_audio.py SOURCE public/refs/gdd/voice.wav` preserves the original1.85s
  sample-for-sample before AAC export, then levels only following speech with measured two-pass loudnorm
  (target−16LUFS,−1.5dBTP,70Hz high-pass). No whole-track normalization after joining. Quiet sparse `tap`/`bloom` SFX, following the latest repo sound feedback; no swooshes.
- Validation: TypeScript, reviewed beat stills, framing audit, opening PCM assertion; final export checks
  recorded after rendering. Audio assessed through transcript and measurements, not a listening review.

### Reproduce this revision

From `toolkit/`, use a Python environment with Pillow and NumPy, plus system FFmpeg:
`python scripts/prepare_jinn_hairline.py SOURCE`. It restores official marks, complete transparent mascot
posters, the Lobe Icons masks and the prepared voice. Outputs are gitignored. URLs are in the script;
the generated computer illustration is not required. TypeScript and the existing Hairline vendor need
only the normal `npm ci`.

For the optional face audit, install `opencv-python-headless` in a separate Python environment and download
OpenCV Zoo's `face_detection_yunet_2023mar.onnx`. Run
`python scripts/audit_gdd_framing.py SOURCE MODEL /tmp/faces.json` from `toolkit/`.
The audit checks source samples against the committed crop plan; it does not invent missing image content.

Render: `REMOTION_BROWSER=/usr/bin/chromium npx remotion render src/index.ts JinnHairlineRevision output.mp4 --concurrency=4 --crf=21 --audio-bitrate=192k`.

## v2 (after Hardik's v1 feedback) — delivered, review pending

What changed and why (his feedback is in docs/10-feedback-log.md):
- **Face (historical, insufficient):** speaker window y225–695 (13-frame check missed cropped hair at18–19s);
  panel y 858–1920 (55%). v1's 372-px window (y 195–567) cut his head, worst indoors.
- **Opening:** his first 1.85s now play untouched, full frame, no captions. Graphics start when his face does.
- **Graphics area:** full-bleed black, y 0–858, no inner card, no page screenshots.
- **Beats:** 1.85 dots / Claude Duet / Grok Bot in one picture (official marks, OpenAI/Anthropic/xAI) →
  3.6 a slit of light ("jhalak") opens on drifting AI logos → 6.1 grid of 9 AI logos (ChatGPT, Claude, Gemini,
  Grok, Copilot, Perplexity, Meta AI, Mistral, DeepSeek; Simple Icons + Wikimedia SVGs as white masks) →
  8.6 logos fold into a glowing orb ("closer to this jinn") → 10.3 orb with "workflow / mails / calendars"
  nodes → 14.45 Duet icon + "Morning, Maya. / 2 things need you." → 17 tick list → 20 "You log off. / It
  keeps going." → 23.8 a prompt typed and sent → 25.7 counters 5 in progress / 2 need you → 28.3 Hairline
  laptop "its own computer" → 30.4 "GPT-6 Astra · dots", "Opus 5.5 · Claude Duet" → 34 "24/7" ring →
  42.4 dots wordmark + mascots → 44.5 Duet icon draws on + wordmark → 46.4 Grok Bot lockup on a blue glow →
  48.2 all three in one picture to the end.
- **Kept:** seam caption (white label, Inter), audio, two-pass loudness (−14.8 LUFS).
- **Checks repeated:** stills at 20 beats and a 1-in-3s contact sheet of the final; layout fixes for the
  dots label overlap and the logo grid under the caption.
- **Known:** his footage has a one-frame camera whip at 10.4–10.5s (kept).

## v1

## Brief (Hardik)

Two copies of the same 56.2s, 478×850 recording: one with a white band on top (to show the intended split),
one normal; identical audio (checked by hashing the decoded PCM). Make the edit on either. No white anywhere:
black, with motion graphics on top and him below, his face visible (move the clip down). Captions in the
centre (his suggestion: a white label), not at the bottom. Graphics must be specific to what he says: OpenAI
dots, Claude Duet, Grok Bot. He also asked for an opinion on the first ~2s (an animated genie clip with
"ye jinn to hum sabko yaad hai") and whether something better is possible.

## Decisions

- **Source:** the normal (full-frame) copy, cropped by us. It gives control over framing; the white-band copy
  had his face scaled down.
- **Layout:** black frame; card x 90–990, y 236–1020, radius 30; speaker panel y 1080–1920 (source window
  478×372, y0 = 225 outdoors, 195 indoors, switching at the 19.55s location change).
- **Opening:** his genie still full-frame (0–1.5s, slow push) then the frame morphs into the top card while he
  slides in below (1.5–2.25s). His own blur transition (1.55–1.85s) is hidden by the morph.
- **Captions:** ≤4 words in a white rounded label centred on the seam (y≈1050), Inter SemiBold 44, upcoming
  words grey. Hinglish kept as spoken; "jalak" → "jhalak", the misheard "BitSpots" → "Grok Bots".
- **Type:** Inter only, no condensed display type, no overlines (per instruction.md).

## Beat map (word time → what the card shows)

| t | Said | Card | Point at |
|---|---|---|---|
| 0.0 | "Ye jinn to hum sabko yaad hai" | his genie still, full frame → card | push to the genie |
| 5.8 | "when AI came into the picture" | a built chat: "Ek email likh do, boss ke liye" typed, answer streams | |
| 7.3 | "closer to this jinn" | OpenAI dots key art, the mascots | push in |
| 10.4 | "sits on your workflow, your mails, your calendars" | dots product UI (integrations) | box: integrations list at "workflow", then "Google Calendar · Read and manage Gmail" at "mails" |
| 14.45 | "lets you know what can be done" | claude.com/duet, "Knows what needs you" | box: "briefs you every morning, drafts next steps" |
| 16.95 | "actually does it on your behalf" | TechCrunch's dots screenshot, "Alfred's computer" | box: "Alfred has control · Take over" |
| 19.95 | "doesn't need your presence at all" | claude.com/duet hero | box: "keeps working while you're away" |
| 23.75 | "prompt in… tell it the task" | x.ai Grok Bot page | box: "You can message them like a colleague and hand off the work" |
| 25.7 | "what is pending or has to be done" | claude.com/duet phone mock + rebuilt notification ("Morning, Maya. 5 things in progress and 2 that need you." verbatim from the page) | |
| 28.3 | "its own virtual computer" | x.ai page | box: "A computer of its own" |
| 30.38 | "best brain, best model" | claude.com/duet hero | box: "Powered by Opus 5.5" |
| 34.05 | "your own time… work on the backend" | x.ai hero | box: "…keep working 24/7" |
| 40.1 | "ChatGPT dots" | dots key art (wordmark + mascots) | |
| 44.5 | "Claude just launched Duet" | Claude Duet og image | |
| 46.4 | "from Grok we have Grok Bots" | Grok Bot launch image | |
| 48.2 | "go and check it out" | recap: dots · OpenAI in ChatGPT / Claude Duet · claude.com/duet / Grok Bot · x.ai | |
| 53.9 | "see you soon, bye bye" | the genie again (bookend) → fade | |

Sources: [x.ai/news/introducing-grok-bot](https://x.ai/news/introducing-grok-bot), [claude.com/duet](https://claude.com/duet),
[TechCrunch on dots](https://techcrunch.com/2026/09/29/openai-launches-dots-its-bubbly-agentic-avatar/),
designcompass.org and igeeksblog.com copies of OpenAI's dots images (openai.com returned 403 to the browser).
Grok Bot facts: always-on agents with their own computer, beta since Aug 11, 2026 (x.ai page).

## Agent's view of the opening (given to Hardik, not yet answered)

The idea is right: the jinn is a strong, familiar hook and it pays off at the end. The earlier agent mistakenly described the clip as a still and judged its
first frame: it's static for 1.5s, generic AI art, and the line "ye jinn to hum sabko yaad hai" lands before
anything moves. Options offered: (1) keep the still but animate it (lamp smoke, glow, push), as done in v1;
(2) open on a short recognisable "Jo hukum mere aaka" clip (Motu Patlu, Nick, silent; rights risk) and cut to
him; (3) open on him saying the line with the jinn appearing in the top panel from a lamp. Not decided.

## Validation done

Stills reviewed at every beat in two rounds; fixes: speaker headroom, phrase-level boxes (paragraph boxes made
text unreadably small), zoom widths so body text renders ~25–40px, the Grok Bot title clipped by an off-centre
view, "away" cut by a narrow box. Loudness: single-pass loudnorm left it at −17.5 LUFS; two-pass gave −14.7.

## Known limits

- The source is 478×850; the speaker panel is upscaled 2.26×, so it's soft.
- His own footage has blurry transitions at ~1.6s, ~10.5s and ~19.5s; kept as he shot them.
- The Grok Bot launch film on media.x.ai is blocked outside a real visit; only the og image and page were used.
