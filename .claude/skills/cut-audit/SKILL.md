---
name: cut-audit
description: Stage 2. Use after any rough cut or re-cut to check the audio itself at every cut edge - words chopped in half, repeated phrases the transcript hid, clicks. Runs scripts/check_cut_edges.py.
---
# cut-audit (stage 2)

**In plain words:** listen, do not read. The transcript can look perfect while the sound is broken. This step checks the real sound at the start and end of every cut.

## Steps
1. Run `python3 .claude/skills/cut-audit/scripts/check_cut_edges.py work/cuts.json`.
   It reads the audio around each in/out point and flags an edge when speech is still running through it, and suggests the nearest quiet moment.
2. Move each flagged edge to the suggested time, rebuild the preview, run again. Repeat until it prints `0 flagged`.
3. Repeats check: compare each line's text with the two lines before it; if 3+ words in a row repeat, one take was left in by mistake.
4. Join check: where two cuts meet, the loudness on both sides should be within 6 dB; a bigger jump sounds like a jolt.
5. **Clipped-word check on the cut itself**: re-transcribe the rough cut (shortform-cutaway step 7), then
   `python3 -I toolkit/scripts/verify_cut.py out/rough.mp4 work/rough_words.json`. It flags a last word with no release,
   a word that ends after the file does, and suspiciously short words. Listen to every flag; if a word is chopped,
   extend that cut's out-point (+0.2–0.4 s takes in the breath) and re-cut.
6. **On the final export too** (render-ops): `verify_cut.py out/<final>.mp4` checks A/V sync (drift < 1 frame), that the
   file is `+faststart` (otherwise Instagram/QuickTime may not open it: `ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4`),
   and true peak ≤ −1 dBTP. Also look at the first and the last word and their captions.

## Rules
- The transcript is not evidence. Speech recognition merges a repeated phrase into one, and it **auto-completes a word the cut chopped**
  (the file says "out", the transcript still says "output"). *Why: the question is not "is there speech at the edge?" but "is a word cut in half?". The famous-reel-editor skill lost three fix rounds to this.*
- Never mark the audit passed without the script's output in front of you.
- Re-run after ANY change to cuts.json, however small.
