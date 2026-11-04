#!/usr/bin/env python3
"""Check a finished (or rough) cut for the faults that a transcript hides.

    python3 -I toolkit/scripts/verify_cut.py out/reel.mp4 [work/final_words.json]

1. A/V sync: the video and audio streams must end within one frame of each other.
2. +faststart: the moov atom must come before mdat, or Instagram/QuickTime may refuse the file
   (fix: ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4).
3. Peak: true peak at or below -1 dBTP.
4. Clipped words (needs a transcript OF THIS FILE, from toolkit/scripts/transcribe.py): speech recognition
   "auto-completes" a word the cut chopped ("out" is still written "output"), so the text looks fine. Flags: the last
   word ending within 30 ms of the end of the file, any word ending past the file's end, and suspiciously short
   words (< 70 ms). Listen to each flagged spot; extend that cut's out-point and re-cut.
Lessons from the famous-reel-editor skill (docs/10, 2026-11-04). Needs ffmpeg/ffprobe.
"""
import json, re, subprocess, sys

f = sys.argv[1]; words_json = sys.argv[2] if len(sys.argv) > 2 else None
bad = 0
def probe(args): return subprocess.run(["ffprobe", "-v", "error", *args, f], capture_output=True, text=True).stdout

# 1 · A/V sync
streams = json.loads(probe(["-show_entries", "stream=codec_type,duration,r_frame_rate", "-of", "json"]))["streams"]
v = next((s for s in streams if s["codec_type"] == "video"), None); au = next((s for s in streams if s["codec_type"] == "audio"), None)
dur = float(probe(["-show_entries", "format=duration", "-of", "csv=p=0"]).strip())
if v and au and v.get("duration") and au.get("duration"):
    n, d = map(float, v["r_frame_rate"].split("/")); frame = d / n
    drift = abs(float(v["duration"]) - float(au["duration"]))
    ok = drift <= frame + 1e-3; bad += not ok
    print(f"{'ok  ' if ok else 'FAIL'} A/V sync: video {float(v['duration']):.3f}s, audio {float(au['duration']):.3f}s, drift {drift*1000:.0f} ms (limit {frame*1000:.0f} ms)")
else:
    print("note A/V sync: no audio stream (or no durations) to compare")

# 2 · faststart: moov before mdat in the first top-level atoms
with open(f, "rb") as fh:
    pos, order = 0, []
    while len(order) < 8:
        fh.seek(pos); h = fh.read(16)
        if len(h) < 8: break
        size = int.from_bytes(h[:4], "big"); typ = h[4:8].decode("latin1")
        if size == 1: size = int.from_bytes(h[8:16], "big")
        order.append(typ)
        if size < 8: break
        pos += size
fast = "moov" in order and ("mdat" not in order or order.index("moov") < order.index("mdat")); bad += not fast
print(f"{'ok  ' if fast else 'FAIL'} faststart: top-level atoms {order}")

# 3 · true peak
if au:
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", f, "-af", "loudnorm=print_format=summary", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.search(r"Input True Peak:\s+([-\d.inf]+)", r); i = re.search(r"Input Integrated:\s+([-\d.inf]+)", r)
    if m:
        tp = float(m.group(1)); ok = tp <= -1.0; bad += not ok
        print(f"{'ok  ' if ok else 'FAIL'} true peak {tp} dBTP (limit -1), integrated {i.group(1) if i else '?'} LUFS")

# 4 · clipped words, from a transcript of THIS file
if words_json:
    segs = json.load(open(words_json)); W = [w for s in segs for w in s.get("words", [])]
    if W:
        last = W[-1]
        if last["e"] > dur + 0.01: print(f"FAIL last word '{last['w']}' ends at {last['e']:.2f}s, after the file ends ({dur:.2f}s): it is cut off"); bad += 1
        elif dur - last["e"] < 0.03: print(f"FAIL last word '{last['w']}' ends {1000*(dur-last['e']):.0f} ms before the end: no release, likely clipped"); bad += 1
        else: print(f"ok   last word '{last['w']}' ends {dur-last['e']:.2f}s before the end")
        short = [w for w in W if w["e"] - w["s"] < 0.07]
        for w in short[:10]: print(f"warn short word '{w['w']}' at {w['s']:.2f}s ({1000*(w['e']-w['s']):.0f} ms): listen for a chopped word")
print("PASS" if not bad else f"{bad} problem(s)")
sys.exit(1 if bad else 0)
