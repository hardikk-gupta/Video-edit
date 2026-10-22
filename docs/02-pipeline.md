# 02 · Pipeline, step by step

Commands assume you're in `toolkit/` with `npm i` done, ffmpeg installed, and a Python venv with
`faster-whisper` (`python3 -m venv venv && ./venv/bin/pip install faster-whisper`). In Claude Code cloud
containers, set `REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
(see [08-environment-gotchas.md](08-environment-gotchas.md)).

## 1. Look at the source

```bash
ffprobe -v error -show_streams -show_format source.mp4 | grep -E "codec_name|width|height|duration=|r_frame_rate"
ffmpeg -v error -i source.mp4 -vf "fps=1/3,scale=424:-1,tile=4x7" -frames:v 1 sheet.jpg   # then view sheet.jpg
ffmpeg -i source.mp4 -af volumedetect -f null - 2>&1 | grep -E "mean|max_"
```

Note the resolution: a low-res source (e.g. 848×478) can't go full-frame at 1080p without looking soft, which
is one more reason the face stays a small tile.

## 2. Transcript of the source

```bash
./venv/bin/python -I scripts/transcribe.py source.mp4 raw.json --prompt "ChatGPT, Figma"
```

Print word timings (`w[s-e]`) and read them. Whisper mishears brand names: pass them in `--prompt`, and fix the
rest by hand later.

## 3. Edit decisions (EDL)

Write the cut as source-time ranges in `edl.json`: `[[start, end], …]`.

- Cut the throat-clearing intro, lists that restate the hook, tangents, "that is an automation" type
  restatements, "till the time", "see you soon, bye bye" (an end card replaces the goodbye).
- Keep whole thoughts. If a cut would break a word or leave an "into with", keep the longer natural take
  instead (we kept 52.40–73.21 as one take rather than splice "into ChatGPT").
- Snap every boundary to the quietest 10ms nearby: `scripts/cut.py` does this from a list of rough points.
- Check a suspicious join by transcribing just that range. Garbled output means a broken word.

## 4. Build the cut and clean the voice

```bash
python3 -I scripts/build_talk.py source.mp4 edl.json public/talk.mp4
```

It concatenates the ranges at 30fps with 12–15ms audio fades and runs the voice chain: high-pass 85Hz, FFT
denoise, -2dB at 200Hz, +3dB at 3.5kHz, 3:1 compression, limiter. It prints the cut times in the new
timeline; you'll use them as shot boundaries.

## 5. Transcript of the cut (caption timing)

```bash
./venv/bin/python -I scripts/transcribe.py public/talk.mp4 talk.json --prompt "ChatGPT, Figma, AI automation."
```

Convert to `src/words.json` (`[{t, s, e}]`) and fix by hand: merge "8 / a / .m." into "8 A.M.", fix misheard
names ("T" → "ChatGPT", "helped" → "help"), drop stutters. These timings drive captions **and** every beat.

## 6. Study the references

For every reference video:

```bash
curl -sSL -A "Mozilla/5.0 …" "https://in.pinterest.com/pin/<id>/" -o pin.html
grep -oE 'https://v1\.pinimg\.com/videos/[^"\\]+_720w\.mp4' pin.html | head -1   # the video file
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 ref.mp4)
ffmpeg -v error -i ref.mp4 -vf "fps=24/$d,scale=360:-1,tile=4x6" -frames:v 1 ref.jpg   # 24 frames, one image
```

View the sheet, pull 2–3 full frames, sample colours (PIL `getpixel`). Write down, separately: layout
system, type (families, weights, sizes, case), colour, motion (how things enter, exit and transition), frame
furniture (labels, counters), and what makes it feel premium. Then merge the references into one system
([03-design-language.md](03-design-language.md)).

## 7. Plan the beats

From `words.json`, list beats with times: hook, setup, each chapter, takeaway, end card. For each beat pick:
the grid layout, which cell holds the face tile (or an image or explainer), the headline, the supporting
card, and the SFX. Chapter changes go under a statement pill. Keep the plan in the project's README.

## 8. Build scenes

Use `toolkit/src/Reel.tsx` as an implementation reference for timing, layout mechanics and reusable parts;
do not copy its typography, palette, chrome or scene composition by default. Choose those from the current
brief, relevant campaign/reel references and accumulated feedback. The historical building blocks are
listed in [03-design-language.md](03-design-language.md). Rules while building:

- Times are seconds in the cut's timeline. Use word start times for anything tied to speech.
- Each beat's content enters after its guides land (`scene start + ~0.35s`) and leaves 0.3s before they move.
- Run `npx tsc -p .` after every change.

## 9. Stills review (before every full render)

```bash
for s in 1 5 10 14 16.5 21 25 30 34 39 46 50 53 56 58; do
  npx remotion still Reel out/stills/$(printf %05.1f $s).png --frame=$(python3 -c "print(round($s*30))") --log=error
done
ffmpeg -v error -y -pattern_type glob -i 'out/stills/*.png' -vf "scale=640:-1,tile=3x5" out/sheet.jpg
```

Look at the sheet against [09-review-checklist.md](09-review-checklist.md). Fix, re-still only the changed
beats, repeat.

## 10. Render and master

```bash
npx remotion render Reel out/reel-raw.mp4 --crf=18     # ~4 min for 60s at 1080p, 4 cores
scripts/master.sh out/reel-raw.mp4 out/reel-final.mp4  # -14 LUFS, CRF 24, ~12MB
ffmpeg -v error -y -i out/reel-final.mp4 -vf "fps=1/4,scale=480:-1,tile=4x4" -frames:v 1 out/final-sheet.jpg
```

Check the final contact sheet and one full-res crop for compression artefacts.

## 11. Deliver and log

Send the mastered file in the chat (Claude Code: `SendUserFile` with `display: "render"`). Say what changed, what
you couldn't verify (you can't listen), and what's next. Then update this repo: project README, feedback log
when feedback was given, CHANGELOG, and any doc a lesson changed. Repeat this after every video revision
and every feedback round, not only the final delivery. Correct contradictory older rules rather than
merely appending a note; follow [instruction.md](../instruction.md). If the request is to record feedback
only, stop at documentation: do not create or revise the video.
