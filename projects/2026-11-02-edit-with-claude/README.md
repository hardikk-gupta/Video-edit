# Editing with Claude (2026-11-02)

A 45 s, 1080×1920 reel. Clawd, the Claude Code mascot, walks into a spotlight and acts out our six-step process while
UI cards explain each step. It opens with a 2.7 s match-cut hook. Brief, answers and rules: [instructions.md](instructions.md).
Voice-over script with times: [script.md](script.md). **Status: v1 rendered 2026-11-02 (341 Clawd frames, ~1 h on 4 CPUs; final MP4 kept outside Git). Hardik's review pending.**

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
