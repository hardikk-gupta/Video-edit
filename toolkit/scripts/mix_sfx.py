"""Mix sound effects under a rendered video by the sfx-design rules.

    python3 scripts/mix_sfx.py <video.mp4> <sfx.json> <sfx-dir> <out.mp4>

sfx.json: {"target_peak_dbfs": -35, "events": [{"t": 0.56, "sfx": "whip"}, ...]}
Each effect is gained so its loudest 100 ms (RMS) lands at target_peak_dbfs (set it ~12 dB under the
voice's speech median), and shifted so that loudest moment falls on t. Video is copied untouched.
"""
import array, json, math, subprocess, sys

video, spec, sdir, out = sys.argv[1:5]
spec = json.load(open(spec))
RATE = 48000

def peak(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(RATE), "-f", "s16le", "-"], capture_output=True, check=True).stdout
    s = array.array("h"); s.frombytes(raw[: len(raw) // 2 * 2])
    n = min(4800, max(480, len(s) // 4))
    best, at = -120.0, 0.0
    for i in range(0, max(1, len(s) - n), n // 4):
        r = math.sqrt(sum(x * x for x in s[i:i + n]) / n) / 32768
        db = 20 * math.log10(r + 1e-9)
        if db > best: best, at = db, (i + n / 2) / RATE
    return best, at

inputs, chains = ["-i", video], []
for k, e in enumerate(spec["events"]):
    path = f"{sdir}/{e['sfx']}.wav"
    lvl, off = peak(path)
    start = max(0.0, e["t"] - off)
    gain = spec["target_peak_dbfs"] - lvl
    inputs += ["-i", path]
    chains.append(f"[{k + 1}:a]aresample={RATE},volume={gain:.1f}dB,adelay={int(start * 1000)}:all=1[s{k}]")
    print(f"{e['t']:6.2f}s {e['sfx']:8s} peak {lvl:6.1f} dBFS at +{off:.2f}s -> gain {gain:+.1f} dB, starts {start:.2f}s")
n = len(spec["events"])
mix = "".join(f"[s{k}]" for k in range(n))
chains.append(f"[0:a]aresample={RATE}[v];[v]{mix}amix=inputs={n + 1}:normalize=0:duration=first[a]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(chains), "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "pcm_s16le", out], check=True)
