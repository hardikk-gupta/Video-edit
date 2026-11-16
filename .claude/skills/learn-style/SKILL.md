---
name: learn-style
description: Use when the creator shares a video they like and says "learn this edit", "make mine like this", or "copy this style". Watches the reference at 2 frames per second, measures the layout and pacing, and writes a new edit-format skill.
---
# learn-style (teach it any style)

**In plain words:** show it a reel you love and it works out the recipe: how often the face is shown, how fast the cuts are, where the text sits. Then it saves that recipe as a new format skill.

## Steps
1. Sample the reference: `.claude/skills/learn-style/scripts/sample_frames.sh <video> work/ref 2`.
2. Transcribe it for pacing (words per second, where pauses fall).
3. Look at every frame and label what is on screen: face / split / screen / card / full canvas / b-roll. Count them into percentages of screen time.
4. Measure: average seconds per cut, caption position and words per chunk, face size and side, colours, how things enter and leave, where sounds land.
5. Write `docs/styles/<name>.md` with those numbers and 6 example frames.
6. Create `.claude/skills/<name>-edit/SKILL.md` in the same shape as the other format skills, and add a row for it in reel-edit's table.

## Rules
- **Find what carries each boundary (2026-11-16).** Scene detection is not a cut count. Take 15 fps strips of at least four transitions and write what survives each one (a grid, a subject, a container) before writing any number. The first Blueprint Cut study missed that the whole grid was one moving object and the reel built from it cut between scenes.
- Learn the STRUCTURE (timing, layout, proportions). Never copy another creator's footage, logo, music or exact graphics.
- Every number in the new skill must come from a measurement, with the frame it came from.
- Fonts and colours are mapped to the nearest colours and fonts in `brand.md`, not copied.
- Test the new skill on one of the creator's own clips before calling it done.
