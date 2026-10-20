# 06 · Tools, skills, MCP servers, libraries and repos

Everything used to make the first video, so another agent can reproduce it.

## Agent harness: Claude Code (cloud session)

| Tool | How it was used |
|---|---|
| `Bash` | ffmpeg/ffprobe, Python scripts, npm, Remotion CLI, curl downloads, git. Most of the work. |
| `Read` | Viewing images: contact sheets of the source, of each reference video and of Remotion stills. This is how the agent "watches". |
| `Write` / `Edit` | Writing `Reel.tsx`, scripts and docs. |
| `ToolSearch` | Loading deferred tools (WebSearch, WebFetch, task tools, GitHub MCP tools) before calling them. |
| `WebSearch` | Finding image pages on unsplash.com (used in the rejected v2.5) and checking libraries. |
| `WebFetch` | Reading pages that block curl: Unsplash photo pages (to get `images.unsplash.com/photo-…` URLs) and the Hairline GitHub README. |
| `SendUserFile` | Delivering each render in the chat (`display: "render"`). Videos never go to git. |
| `AskUserQuestion` | Decisions only the person can make (e.g. where this playbook lives). |
| `TaskCreate` / `TaskUpdate` | Tracking the multi-step rebuild. |
| `mcp__claude-code-remote__read_documentation` | When GitHub refused to create a repo (403), to give the person the right fix. |
| `mcp__github__create_repository` | Tried for this repo; needs the Claude GitHub App to have repo-creation rights. Otherwise the person creates it. |

**Skills (Claude Code `Skill` tool):** none were needed for the video itself. The person suggested
Hairline's agent skills (`hairline-create`, `hairline-adopt`, installed with `npx skills add lucasmarkes/hairline`);
we used the Hairline library directly instead. Use `hairline-create` when a beat needs a figure that doesn't
exist (it writes a new figure on the same engine).

**MCP servers:** GitHub (repo creation attempt). Notion, Gmail and Google Drive were connected but not used.
Don't use connected services unless the brief needs them.

**Memory / context files:** the session was started from Hardik's portfolio repo, whose `CLAUDE.md` →
`AGENTS.md` → `DESIGN.md` → `CHANGELOG.md` define an update rule (log every change in the same commit). This
repo follows the same pattern ([CLAUDE.md](../CLAUDE.md), [AGENTS.md](../AGENTS.md), [CHANGELOG.md](../CHANGELOG.md)).
No other memory was used. Lesson: don't borrow a repo's website design system for a video unless asked (v1 did).

## Rendering and media

| Tool | Version | Why |
|---|---|---|
| **Remotion** (`remotion`, `@remotion/cli`) | 4.0.537 | React → video. Frame-exact, code-driven motion; best for type, UI and data-driven graphics. `npx remotion still` for single frames, `npx remotion render` for the video. Free for individuals and small teams; companies need a licence (remotion.dev/license). |
| React | 19.1 | Remotion's renderer. |
| TypeScript | 7.x (`tsc -p .`) | Type-check before every render. |
| Chromium headless shell | preinstalled at `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell` | Remotion's browser in the cloud container (see gotchas). |
| ffmpeg / ffprobe | system | Probing, cutting, voice chain, contact sheets, loudness, mastering. |
| faster-whisper | latest (pip), model `medium`, int8 on CPU | Word-level transcripts. ~1 min for 80s of speech on 4 cores. |
| numpy, PIL | system/venv | Cut snapping (RMS), SFX synthesis, colour sampling. |

Alternatives considered: **HyperFrames** (HTML-based video framework) exists and is fine for HTML-first
templates; Remotion was chosen for its maturity, React component model and frame-exact control.

## Libraries and assets brought in

| What | Where from | Licence | Notes |
|---|---|---|---|
| Hairline 0.5.1 (33 isometric line figures) | github.com/lucasmarkes/hairline, npm `@lucasmarkes/hairline` | MIT | Vendored and patched in `toolkit/src/vendor/hairline.js` (see below). |
| SFX: whoosh, whip, ding, mouse-click, page-turn, shutter-modern, switch | `@remotion/sfx` → `https://remotion.media/<name>.wav` | per Remotion | Downloaded once into `public/sfx/`. |
| SFX: riser, impact, swoosh, pop, tick | synthesized by `toolkit/scripts/synth_sfx.py` | ours | Filtered noise sweeps, sub drop, pitch-drop blip. |
| Anton, Space Mono | `npm pack @fontsource/anton`, `@fontsource/space-mono` → `files/*-latin-*-normal.woff2` | OFL | GitHub raw font URLs were blocked; Fontsource via npm works. |
| Inter | system fonts (`/usr/share/fonts/opentype/inter/`) | OFL | Regular, Medium, SemiBold, Bold. |
| Grain | generated (numpy → PNG) | ours | 256px tile. |

### The Hairline patch (important)

Hairline animates from one shared `requestAnimationFrame` loop timed by `performance.now()`, and only ticks
figures that an `IntersectionObserver` reports as visible. In a video render that gives different frames on
every run. The vendored copy:

1. replaces every `performance.now()` with a virtual clock `__hlNow()`;
2. replaces `requestAnimationFrame(frame)` with `0`, so nothing schedules itself;
3. stubs `IntersectionObserver` and registers every board as visible;
4. removes the per-mount stagger in the auto tour (`RESUME + STAGGER * (started++ % 4)` → `RESUME`);
5. exports `__hlStep(root, dt, nowMs)`, which ticks only the boards inside one host element.

`HairFig` mounts the figure with `play: true` (its auto tour), then on every frame steps it from its
start time at 1/60s until it reaches the frame's time. If Remotion asks for an earlier frame, it rebuilds and
re-simulates, so any frame renders the same way. Theme with CSS variables: `--hairline-plate` (must equal the
background behind it), `--hairline-hi`, `--hairline-edge`, `--hairline-mid`, `--hairline-lo`, `--hairline-stroke`.

To re-vendor a new version, re-run the five replacements (the Node snippet is in the toolkit README).

## Reference fetching

- Pinterest pin pages are readable with curl and a browser User-Agent; the video URL is in the HTML as
  `https://v1.pinimg.com/videos/iht/expMp4/…_720w.mp4`.
- Unsplash search and download endpoints sit behind a bot wall (401); `WebFetch` on the photo page returns
  the `images.unsplash.com/photo-…` URL, which curl can download. (Kept for reference; we don't use stock now.)
