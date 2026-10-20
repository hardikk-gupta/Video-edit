"""Cut the source by an EDL and clean the voice: writes public/talk.mp4 (30fps, 48kHz).

    python -I scripts/build_talk.py <source.mp4> <edl.json> public/talk.mp4

edl.json is [[start, end], ...] in source seconds (see scripts/cut.py for snapping cut points).
Every piece gets a 12–15ms audio fade so the joins don't click.
"""
import json, subprocess, sys

src, edl, out = sys.argv[1:4]
e = json.load(open(edl))
fc = []
for i, (s, t) in enumerate(e):
    d = t - s
    fc.append(f"[0:v]trim={s}:{t},setpts=PTS-STARTPTS,fps=30[v{i}]")
    fc.append(f"[0:a]atrim={s}:{t},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st={d - 0.015:.3f}:d=0.015[a{i}]")
fc.append("".join(f"[v{i}][a{i}]" for i in range(len(e))) + f"concat=n={len(e)}:v=1:a=1[v][a0]")
# Voice chain: rumble out, broadband denoise, less mud, more presence, gentle compression, safety limiter.
fc.append("[a0]highpass=f=85,afftdn=nf=-28:tn=1,equalizer=f=200:t=q:w=1:g=-2,equalizer=f=3500:t=q:w=1.2:g=3,"
          "acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=4,alimiter=limit=0.9[a]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", ";".join(fc), "-map", "[v]", "-map", "[a]",
                "-c:v", "libx264", "-crf", "14", "-preset", "medium", "-c:a", "aac", "-b:a", "256k", "-ar", "48000", out], check=True)
acc = 0
for s, t in e:
    acc += t - s
    print(f"cut at {acc:.2f}s")
