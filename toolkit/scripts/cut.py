"""Snap the edit's cut points to the quietest 10ms frame nearby, then write edl.json."""
import json, sys, wave
import numpy as np

wav, out = sys.argv[1], sys.argv[2]
# Source-time segments chosen from the transcript (example values from the 2026-10 AI automations reel).
# merged into one take by hand so "into ChatGPT, okay ChatGPT…" stays intact.
SEGS = [(0.00, 6.46), (12.00, 20.50), (22.60, 24.62), (31.42, 34.22), (35.02, 40.86),
        (42.40, 46.36), (52.44, 61.88), (61.92, 66.14), (66.50, 67.00), (70.70, 73.06),
        (73.32, 75.60), (76.58, 79.34)]

w = wave.open(wav); sr = w.getframerate()
a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
hop = sr // 100
rms = np.sqrt(np.convolve(a ** 2, np.ones(hop) / hop, "same"))[::hop]


def snap(tm, lo, hi):
    i0, i1 = max(0, int((tm + lo) * 100)), min(len(rms) - 1, int((tm + hi) * 100))
    i = i0 + int(np.argmin(rms[i0:i1 + 1]))
    return round(i / 100, 2)


edl = []
for s, e in SEGS:
    s2 = snap(s, -0.18, 0.04) if s > 0 else 0.0
    e2 = snap(e, -0.04, 0.22)
    edl.append([s2, e2])
    print(f"{s:6.2f}->{s2:6.2f}  {e:6.2f}->{e2:6.2f}  rms_in={rms[int(s2*100)]:.4f} rms_out={rms[int(e2*100)]:.4f}")
json.dump(edl, open(out, "w"))
print("total", round(sum(e - s for s, e in edl), 2))
