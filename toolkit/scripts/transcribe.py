"""Word-level transcript with faster-whisper.

    python -I scripts/transcribe.py <audio-or-video> <out.json> [--prompt "ChatGPT, Figma"]

Writes [{start, end, text, words: [{w, s, e}]}] and prints one line per segment.
Use it twice: once on the raw footage (to choose cuts), once on public/talk.mp4 (for caption timing).
"""
import argparse, json, subprocess
import numpy as np
from faster_whisper import WhisperModel

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("out")
ap.add_argument("--prompt", default="", help="names the model tends to mishear, e.g. 'ChatGPT, Figma'")
ap.add_argument("--model", default="medium")
a = ap.parse_args()

# Decode with ffmpeg ourselves: faster-whisper's bundled PyAV decoder breaks on some builds.
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", a.src, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768

m = WhisperModel(a.model, device="cpu", compute_type="int8")
segs, info = m.transcribe(audio, word_timestamps=True, beam_size=5, initial_prompt=a.prompt or None)
print(info.language, round(info.language_probability, 3))
out = []
for s in segs:
    print(f"[{s.start:6.2f}-{s.end:6.2f}] {s.text}")
    out.append({"start": s.start, "end": s.end, "text": s.text, "words": [{"w": w.word, "s": w.start, "e": w.end} for w in s.words]})
json.dump(out, open(a.out, "w"), indent=1)
