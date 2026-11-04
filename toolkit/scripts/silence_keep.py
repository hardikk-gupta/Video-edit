#!/usr/bin/env python3
"""Trim the silences left INSIDE each cut of a rough cut, without eating soft word endings.

    python3 -I toolkit/scripts/silence_keep.py work/cuts.json work/cuts_sil.json [--db -40] [--min 0.35] [--pad 0.12]

cuts.json is the shortform-cutaway format: [{"id":1,"src":"raw/a.mp4","in":12.48,"out":15.91,"text":"..."}].
For each cut, ffmpeg's silencedetect finds pauses of at least --min seconds below --db, and the cut is split around
them, keeping --pad seconds of air on each side of the speech. The last cut's tail is never trimmed (the last word's
release lives there). Output: the same format, with split cuts numbered 3a, 3b…  Then run cut-audit on it.

Defaults are the ones that survived real reels (lesson from the famous-reel-editor skill, logged in docs/10 on
2026-11-04): -40 dB, 0.35 s, 0.12 s. NEVER use -30/-32 dB: it hears a soft word ending ("out-put") as silence and cuts it.
For a very punchy short, try --min 0.30. Needs ffmpeg only.
"""
import argparse, json, re, subprocess

ap = argparse.ArgumentParser()
ap.add_argument("cuts"); ap.add_argument("out")
ap.add_argument("--db", type=float, default=-40); ap.add_argument("--min", type=float, default=0.35); ap.add_argument("--pad", type=float, default=0.12)
a = ap.parse_args()
if a.db > -35:
    raise SystemExit(f"--db {a.db} is too high: it trims soft word endings. Use -40 (or -38 at most).")

def silences(src, t0, t1):
    """(start, end) of each silence inside [t0, t1], in source time."""
    r = subprocess.run(["ffmpeg", "-v", "info", "-ss", f"{t0:.3f}", "-to", f"{t1:.3f}", "-i", src, "-vn",
                        "-af", f"silencedetect=noise={a.db}dB:d={a.min}", "-f", "null", "-"], capture_output=True, text=True)
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    en += [t1 - t0] * (len(st) - len(en))          # a silence that runs to the end of the range
    return [(t0 + s, t0 + e) for s, e in zip(st, en)]

cuts = json.load(open(a.cuts)); out = []; saved = 0.0
for k, c in enumerate(cuts):
    last = k == len(cuts) - 1
    keep, cur = [], c["in"]
    for s, e in silences(c["src"], c["in"], c["out"]):
        if last and e >= c["out"] - 0.05: continue    # protect the final word's release
        cut_from, cut_to = s + a.pad, e - a.pad
        if cut_to - cut_from < 0.08: continue          # not worth a cut
        if cut_from > cur: keep.append((cur, cut_from))
        cur = max(cur, cut_to)
    keep.append((cur, c["out"]))
    keep = [(x, y) for x, y in keep if y - x > 0.05]
    saved += (c["out"] - c["in"]) - sum(y - x for x, y in keep)
    for j, (x, y) in enumerate(keep):
        out.append({**c, "id": c["id"] if len(keep) == 1 else f"{c['id']}{'abcdefghij'[j]}", "in": round(x, 3), "out": round(y, 3)})
    print(f"cut {c['id']}: {len(keep)} piece(s)")
json.dump(out, open(a.out, "w"), indent=1)
print(f"{len(cuts)} cuts -> {len(out)} pieces, {saved:.2f} s of silence removed -> {a.out}. Now run cut-audit on it.")
