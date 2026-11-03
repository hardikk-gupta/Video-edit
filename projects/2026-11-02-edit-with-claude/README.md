# Editing with Claude (2026-11-02)

A 45 s, 1080×1920 reel. Clawd, the Claude Code mascot, walks into a spotlight and acts out our six-step process while
UI cards explain each step. It opens with a 2.7 s match-cut hook. Brief, answers and rules: [instructions.md](instructions.md).
Voice-over script with times: [script.md](script.md). **Status: v2 rendered 2026-11-03 and passed reel-review (second model); Hardik's review pending. v1 kept as history below.**

## How it's built

| Layer | Where | Notes |
|---|---|---|
| Hook (0–2.75 s) | `toolkit/src/EditWithClaude.tsx` `Hook` | 10 page designs in different system typefaces, a new page every 3 frames, the clay "Claude" box locked at y 860, line blur rising with distance, push-in 1.0→1.1. It resolves to a centred "Editing with [Claude]" on the night colour, which hands off to Clawd's stage. All page text is our own writing. |
| Clawd + stage | `toolkit/clawd/edit-with-claude.js` → frames via `toolkit/clawd/setup.sh` | Claude Animation Base (route A), portrait. Night stage, warm spotlight beam, floor pool, dust. 24 mood keys, hat changes on hops (headphones, hard hat, wizard, party), a reviewer Clawd in a fedora for step 5. Drawn on threes (8 fps). |
| UI cards, headlines, progress | `EditWithClaude.tsx` | Cream cards on the dark stage, Inter, one card per step, every card event timed to a spoken word. |
| Captions | `EditWithClaude.tsx` `Captions` | One word, centred at y 1592, keywords in clay. Word times are spread over each line's window in `SCRIPT`. |
| Sound | `public/sfx` tick / tap / bloom | Sparse and quiet (volume 0.07–0.24). No swooshes. Hardik's VO is added later. |

## Rebuild

```bash
toolkit/scripts/fetch_vendor.sh --small && (cd vendor/claude-animation-base && npm install)
toolkit/clawd/setup.sh toolkit/clawd/edit-with-claude.js edits/2026-11-02-edit-with-claude/clawd 45 110
cd edits/2026-11-02-edit-with-claude/clawd   # two processes, ~1 h on 4 CPUs
node render.mjs --soft-gl --chrome=/usr/bin/google-chrome --frames --fps=8 --range=2.4:23.8 --workers=1 &
node render.mjs --soft-gl --chrome=/usr/bin/google-chrome --frames --fps=8 --range=23.8:45 --workers=1 & wait
cd ../../../toolkit && ln -sfn ../../../edits/2026-11-02-edit-with-claude/clawd/out public/edits/ewc
REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell \
  ./node_modules/.bin/remotion render src/ewc.ts EditWithClaude out/edit-with-claude.mp4 --crf=18
```

## Decisions not yet reviewed by Hardik

- The six steps and their wording (folder → watch → style sheet + storyboard → edit → second review → feedback log).
- Night-indigo stage with a warm beam (his "cinematic" note), and cream cards over it.
- Clawd drawn on threes (8 fps) to fit the render budget; the UI and camera stay at 30 fps.
- No repo URL on screen (his choice: "Comment EDIT" only).

## v2 (2026-11-03)

What changed from v1, and why (Hardik approved the critique: v1 read as a slideshow):
- **One workspace window** (`Workspace`): born from the hook's "Claude" box, changes shape per step (`SHAPES`), ends as the
  comment field. Step content rises in and lifts out inside it (`Scene`).
- **Carries** (`Carries`, `Fly`): list row → headline; "references" folder → contact sheet; 4 frames → storyboard;
  storyboard → timeline clips; "make the font bigger" → feedback-log line v1. Speed-based blur on anything that flies.
- **Clawd moves with the UI** (`MOVES` in `toolkit/clawd/edit-with-claude.js`, `scanX`/`playX` in the TSX: same screen x,
  same smoothstep) and a **follow spot** trails him. The hook resolves onto the lit stage.
- **Camera** holds, then nudges in 0.5 % at each step change, and pushes in for the close.
- **Review:** reel-review (a second model) failed the first v2 render: the window covered Clawd's hats, two windows sat
  empty for about 1 s, the transcript was clipped, the captions sat too low, and the final "EDIT" floated. All fixed. The
  re-render passed with only "maybe" notes (hat tips touch the window edge at about 27 s and 37 s).
- **OneTake oracle** (`verify_promo.py`, rhythm legs only; continuity needs a OneTake HTML comp): cadence, burst and audio
  pass. Rest has 22 % still frames against its 25 % target, because Clawd's painted boil changes 8×/s; accepted.
- Loudness is −27.7 LUFS with SFX only, on purpose: master to −14 LUFS after the voice-over goes in.
