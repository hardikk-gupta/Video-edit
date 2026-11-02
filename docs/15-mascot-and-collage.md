# 15 · Mascot animation, collage B-roll and the projects from the six reels

Written 2026-11-02, after a summary of six creator reels about editing video with Claude. It covers what each
tool in those reels is, where its code is, how to pull it into this repo, and how to make a mascot (Claude's
**Clawd** or one of our own) act out many different things on screen, using character sheets.

Nothing below has been run end to end in our container yet. The projects were downloaded and read, but
running vendored code (`npm install`, renders) still needs Hardik's go-ahead each time. Treat every
vendored project as third-party code.

## 1. The reels' tools: where each one stands

Run `toolkit/scripts/fetch_vendor.sh` (add `--small` to skip HyperFrames) to pull these into `vendor/`,
pinned to the commits below. The script links their skills into `.claude/skills/`. Both `vendor/` and the
links are gitignored, so a fresh clone has to run the script again.

| From the reels | Real project | Pinned | Licence | Status here |
|---|---|---|---|---|
| Claude Animation Base (Clawd cartoons) | [JohnHeibel/ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) (many forks exist; this is the original) | `0ac8bf2` | MIT for the code. Clawd is Anthropic's mascot (see §3) | `vendor/claude-animation-base`, used by the `mascot-animate` skill |
| Collage B-roll (halftone paper cut-outs, Gemini) | [pyang5166/gbro-collage-broll](https://github.com/pyang5166/gbro-collage-broll) | `a1a4ee2` | MIT | Linked as skill `gbro-collage-broll`. Needs `GEMINI_API_KEY`, and its Gate 2 stills use Codex's built-in image tool (see §4) |
| OneTake (one continuous camera, no cuts) | [feitangyuan/onetake](https://github.com/feitangyuan/onetake) | `013a61a` | **PolyForm Noncommercial 1.0.0** | Linked as skill `onetake`. **Not for paid, sponsored or client videos.** Hardik can still study its moves library and its continuity checker. |
| Lemo-Opuscar (film styles) | [lemomo-ai/lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) | `bebbbe1` | MIT | Linked as skill `lemo-opuscar`. **66 styles** at this commit (`styles/`, without `_template`). The reels said 43 and 51 because it keeps growing. |
| HyperFrames (HTML → video) | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | `2bdc866` | Apache-2.0 | Linked as skills `hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use`, `remotion-to-hyperframes`, `reverse-any-video` and `slideshow`. We still render in Remotion (docs/14). Use these when a skill expects HyperFrames or a reference is pure HTML/GSAP. |
| FFmpeg, Whisper, yt-dlp | already in use | — | — | `toolkit/scripts/`, plus the `watch` skill (faster-whisper rather than whisper.cpp) |
| Gemini | Google API | — | paid API | No key in this repo. Collage B-roll and character-sheet image generation need it. Ask before spending credits. |
| ElevenLabs | API | — | paid API | No key in this repo. Optional for voice and SFX (docs/05, docs/14). |

Workflow ideas from the reels that we already cover: matching a style from 3–5 reels (`watch` + `learn-style`),
storyboarding before the final (`asset-plan` approval stop; Claude Animation Base's `STORYBOARD.md`), revising
in plain language (`editor-handoff`), and separate folders for each job (`projects/<date>-<name>/`). The
demo transitions (spinning carousel, liquid-glass graph, match cut, digital screen push, over-the-shoulder
zoom) are not ready-made. Build them in Remotion when a brief needs one, and borrow the camera and carry
moves from `vendor/onetake/lib` as method.

## 2. How a mascot "does several things": the character sheet is the asset

What the reels show is a **rig plus a model sheet**, not one generated picture per scene. Claude Animation Base
draws Clawd in code (`src/clawd.js`). Every pose comes from the same few drawings, so Clawd stays on model
whatever it does:

| Sheet | In Claude Animation Base | What it gives you |
|---|---|---|
| **Turnaround** (key views) | `front`, `q` (¾), `side`, `qback`, `back`, with `turn()`/`spinView()` stepping between them | It can turn, walk across the frame, and face the camera or something on screen |
| **Expression sheet** | 31 emotions in `EMO`, in families joy / sly / low / hot / alarm / mind. Each one sets eyes, mouth, tint and an idle body motion. `emotions(t, keys)` acts out each change with anticipation, a take and overshoot. | Reactions that read without words |
| **Parts** | 24 eye shapes, 16 mouths, lid (the "lunchbox" bite), blush, gloom, tints | Any new face you need |
| **Costume and props** | 15 hats plus face pieces. `draw()`/`armL()`/`armR()` hooks put props in its hands. | "Clawd as a builder / wizard / DJ" holding a laptop, a phone or a logo |
| **Action sheet** | `jump`, `stroll`/`walk`, smears, `move()` dances (bounce, hop, wave, run, spin…) | Verbs: it walks in, jumps, celebrates, panics |
| **Emotes** | `! ? zzz`, sweat, bulb, hearts, steam, stars… | Painted reaction marks instead of text |

The model sheets themselves are at `vendor/claude-animation-base/docs/views.jpg` (views, motion, hats) and
`docs/emotions.jpg` (all 31 emotions). `studio.html?loop=views` / `?loop=emotions` plays them.

**So to make a mascot do many things:** write a storyboard where each beat is *event → reaction*, and
compose the sheet's entries for each beat: view + emotion + action + prop + emote. Do not prompt each
scene from scratch.

### Lip sync to Hardik's voice (our addition; not in the base)

Clawd has no mouth at rest, so it can react to speech without lip sync. For a mascot that *talks*, add a
**mouth chart** to the sheet: rest, A/I, E, O, U, M/B/P, F/V, L. Drive it from the word timings our transcript
already produces (`toolkit/scripts/transcribe.py` / `watch`), one mouth shape per syllable and holding rest in the
pauses. Keep the body acting from `emotions()` underneath.

## 3. Three routes, and which to use

| Route | When | How |
|---|---|---|
| **A. Clawd as-is** | A video *about* Claude or Claude Code, where the mascot is commentary | `mascot-animate` skill → Claude Animation Base. p5.brush, hand-painted, 1080p, MP4 or PNG frames. |
| **B. Hardik's own mascot, built like Clawd** (recommended for his channel) | A recurring character that's his, on any topic | First design the character sheet (template: `projects/_template/character-sheet.md`) and get Hardik's approval on it as a still. Then write a `mascot.js` that copies `clawd.js`'s API (`VIEWS`, `EMO`, parts, hooks) and render its own `?loop=views` / `?loop=emotions` sheets before any scene. |
| **C. Generated-image sheet** | The look needs painterly or 3D rendering that code can't draw | Generate a turnaround and expression sheet (Gemini / nano-banana, with credits approved). Pass that sheet as the reference image for every later still or clip (`gbro-collage-broll`, `omni-restyle`, `genvideo`). It drifts off model more than A or B, so check every shot against the sheet. |

**About Clawd and the brand:** the repo's MIT licence covers the code. It does not cover Anthropic's mascot as a
trademark. Using Clawd to talk about Claude is commentary. Avoid anything that implies Anthropic endorses the
video, don't use Clawd in ads for another product, and don't put it in thumbnails sold as merchandise. Route B
avoids the question entirely. This is a caution, not legal advice: if a video is paid or sponsored, ask Hardik
before using Clawd.

**Putting it in our edits:** Claude Animation Base renders a full frame with a painted paper background, so there is no
alpha. Use a shot as a full-screen insert or as the top panel of a split-screen (docs/12). For an overlay on
other footage, paint a flat key colour as the background, render `--png` frames and key it out in Remotion. Keep
the rule from the guide: **no text inside the cartoon**. Captions go on top, in our layout.

## 4. Animated collage B-roll

`gbro-collage-broll` turns a ~5-second line into a halftone paper-collage clip in three approval gates:

1. Visual metaphor only.
2. A colour collage still, then a contact sheet.
3. Gemini Omni Flash animates from the first and last frames, followed by frame QA.

In Claude Code, Gate 2's "built-in image tool" doesn't exist. Use a Gemini image model through the API with
the same prompt, or build the still by hand from cut-outs (photos Hardik supplies, our own vectors, mascot
poses rendered as PNG). Then apply a halftone and paper-edge treatment in ffmpeg or Remotion.
Related builds to borrow from: [tmoody1973/pasteup](https://www.claudepluginhub.com/plugins/tmoody1973-pasteup)
(halftone collage stop-motion with a local compositor) and the papercut/risograph repos in docs/14.

**Mascot + collage:** render mascot poses from the sheet as PNGs, print-treat them (halftone, torn edge,
drop shadow), and let them enter as paper cut-outs. This gives Hardik a recurring character inside the
collage style.

The no-stock rule in AGENTS.md still applies: collage elements come from Hardik's images, official
subject imagery (docs/11) or generated pieces he approved, never random web photos.

## 5. Decisions and setup so far

- **Route A chosen (2026-11-02):** Clawd as-is. Use it for videos about Claude, under the brand caution in §3.
- **Smoke test passed (2026-11-02):** `npm install` ran in `vendor/claude-animation-base`, and a 4-frame sheet of the
  demo rendered correctly with `node render.mjs --soft-gl --chrome=/usr/bin/google-chrome --sheet=1,4,7,10`.
- **Render speed in this container (4 CPUs, no GPU, software GL):** about **35–55 s per frame** on watercolour
  scenes. A 15 s clip at 24 fps is 360 frames, which is roughly 1–1.5 h with `--frames --workers=4`. So iterate on
  `--sheet` and `--strip` stills, and render the full clip only once the storyboard and key poses are approved. For
  drafts, drop the watercolour `fill` backgrounds (README advice) or render a lower `--fps`.
- **Gemini key:** kept out of Git. In a session it lives in `~/.config/video-edit/gemini.env`
  (`. ~/.config/video-edit/gemini.env`). Long term it belongs in the cloud environment settings as `GEMINI_API_KEY`.
  Ask before spending any credits.

## 6. Making a Clawd video in this repo (learned on "Editing with Claude", 2026-11-02)

- **Portrait working copy:** `toolkit/clawd/setup.sh <scene.js> <workdir> <duration> <bpm>` copies the pinned base into a
  gitignored workdir and makes the canvas 1080×1920. It also drops the Google Fonts request, removes page-load
  timeouts and patches in a warm-up frame (`toolkit/clawd/patch_render.py`). Scenes live in `toolkit/clawd/` (committed).
- **Split of labour:** Clawd and its painted world come from the base, with no text in them. Remotion
  (`toolkit/src/EditWithClaude.tsx`, entry `src/ewc.ts`) adds the hook, UI cards, captions and SFX on top of the
  frames, using a symlink `toolkit/public/edits/ewc → <workdir>/out`.
- **Render speed under software GL (4 CPUs):**
  - a page renders ~5 frames fast, then settles at **~12–20 s per frame**;
  - opening a page costs 40–60 s, so recycling pages doesn't help;
  - `--workers=4` in one browser share one GPU process and gain nothing.

  What works: **2 separate processes** with `--workers=1` on disjoint `--range` spans, and Clawd drawn **on threes (8 fps)**.
  That's ~10 s per frame overall, so 45 s of Clawd takes about an hour. Check stills first with `--sheet`.
- **Never `pkill -f render.mjs`** from a command whose own text contains that string, because it kills the shell running
  it. Stopping a background task doesn't always stop its node/chrome children either: check `pgrep -x chrome`.
- **Dark (cinematic) stages:** set `PAL.paper` to the night colour at the top of the scene. A full-frame background wash
  sometimes fails under software GL and leaves a pale frame. Light comes from translucent washes (a beam), `glow()` (halo,
  dust) and a warm pool on the floor. Hardik asked for this cinematic look over the default paper.
