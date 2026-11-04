---
name: shortform-cutaway
description: Stage 1 rough cut. Use to turn raw talking footage into a clean cut - transcribe with word timings, keep the best take of each line, remove dead air, fumbles and repeats. Produces work/cuts.json.
---
# shortform-cutaway (stage 1, the rough cut)

**In plain words:** throw away the bad bits. The creator says a line three times; keep the cleanest one. Remove the silences and the "umm". What is left is the skeleton of the video.

## Steps
1. Transcribe with word-level timings: `whisperx raw/<file> --model small --output_format json --output_dir work/`. If whisperx is missing, tell the creator the install command (`pip3 install whisperx`) and do not guess timings.
   No whisperx? `python3 -I toolkit/scripts/transcribe.py raw/<file> work/raw_words.json` (faster-whisper) gives the same.
2. Read the transcript word by word, with times. Raws are often **multi-take with spoken director's notes** ("put a clip
   of…", "ok so…", "show the bit where…"). Those never go in the cut. Group words into lines; where a line is repeated,
   keep the LAST complete take unless an earlier one is clearly cleaner. Pick takes by hand for a multi-take raw.
3. If the transcriber collapsed a stretch into one very long "word" (e.g. a 4 s blob), that's a merged multi-take:
   look at that window with `silencedetect` and keep only the clean take.
4. Drop fillers and false starts. Write `work/cuts.json`:
   `[{"id":1,"src":"raw/a.mp4","in":12.48,"out":15.91,"text":"..."}]`.
5. **Trim the silence left inside the cuts**: `python3 -I toolkit/scripts/silence_keep.py work/cuts.json work/cuts.json.sil`
   (−40 dB, 0.35 s, 0.12 s pad, last word protected), check it, then use it as `work/cuts.json`.
6. Build a preview with ffmpeg (trim + concat) into `out/rough.mp4`.
7. **Re-transcribe the rough cut** (`toolkit/scripts/transcribe.py out/rough.mp4 work/rough_words.json`). Every later stage
   (captions, cards, b-roll) times itself to THESE words, never to the raw transcript plus arithmetic. *Why: times worked
   out on paper drift by the end of the reel.* When a word appears twice, anchor to the occurrence after the
   previous beat, not the first one in the file.

## Rules
- The out-point is where the last word RELEASES (sound has died), not where it starts. Add 0.08 s after the word's end time. *Why: a cut placed at the start of the last word drops that word; "edited using AI" plays as "edited using".*
- The in-point sits 0.04 s before the first word, so the first consonant is not clipped.
- Never cut inside a word to save time.
- Silence detection at −30/−32 dB hears soft word endings as silence ("output" → "out"). Use −40 dB (`silence_keep.py`
  refuses anything above −35). A gap of more than 0.30 s between two sentences in the re-transcribed cut is a pause to tighten.
- Keep their meaning: do not remove a line that a later line refers to.
- Then run cut-audit. A rough cut is not done until the audit passes.

*Lessons in steps 2–7 come from the famous-reel-editor skill (Hardik's upload, 2026-11-04; docs/13).*
