"""Synthesize the cinematic SFX the Remotion pack lacks (riser, impact, pop, swoosh, tick)."""
import sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)
out = sys.argv[1]


def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    st = np.stack([x, x], 1)
    with wave.open(f"{out}/{name}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


def t(d):
    return np.arange(int(SR * d)) / SR


def lp(x, a):  # one-pole low-pass, a can be an array (time-varying)
    y = np.empty_like(x); s = 0.0
    a = np.broadcast_to(a, x.shape)
    for i in range(len(x)):
        s += a[i] * (x[i] - s); y[i] = s
    return y


def bp(x, a):
    return lp(x, a) - lp(lp(x, a), a * 0.35)


# Swoosh: band-passed noise sweeping up then down, bell envelope
d = 0.55; tt = t(d); n = rng.standard_normal(len(tt))
sweep = 0.02 + 0.25 * np.sin(np.pi * tt / d) ** 2
env = np.sin(np.pi * (tt / d) ** 0.7) ** 3
save("swoosh", bp(n, sweep) * env)

# Riser: noise + rising saw-ish tone, exponential build, hard stop
d = 1.6; tt = t(d); n = rng.standard_normal(len(tt))
f = 180 * (2 ** (tt / d * 3))
tone = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
env = (tt / d) ** 2.4
save("riser", (bp(n, 0.02 + 0.3 * tt / d) * 1.2 + tone * 0.35) * env)

# Impact: sub drop 90->38 Hz + click transient + noise tail
d = 1.4; tt = t(d)
f = 38 + 52 * np.exp(-tt * 9)
sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 3.2)
click = rng.standard_normal(len(tt)) * np.exp(-tt * 140)
tail = lp(rng.standard_normal(len(tt)), 0.05) * np.exp(-tt * 6) * 0.6
save("impact", np.tanh(1.6 * (sub + 0.5 * click + tail)))

# Pop: fast pitch-dropping sine blip
d = 0.16; tt = t(d)
f = 900 * np.exp(-tt * 28) + 260
save("pop", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 30) * (1 - np.exp(-tt * 2000)))

# Tick: tiny high click for word-by-word text
d = 0.05; tt = t(d)
save("tick", (np.sin(2 * np.pi * 3200 * tt) + 0.5 * rng.standard_normal(len(tt))) * np.exp(-tt * 180))

# Quiet supporting sounds (2026-10-22, after "the SFX are taking over"): a soft tap for things landing in
# the grid and a low, short bloom for the three product reveals. Both are mastered quiet on purpose.
d = 0.09; tt = t(d)
tap = np.sin(2 * np.pi * 1850 * tt) * np.exp(-tt * 70) + 0.15 * lp(rng.standard_normal(len(tt)), 0.2) * np.exp(-tt * 120)
save("tap", tap * (1 - np.exp(-tt * 3000)))
d = 0.7; tt = t(d)
bloom = (np.sin(2 * np.pi * 196 * tt) + 0.5 * np.sin(2 * np.pi * 294 * tt) + 0.25 * np.sin(2 * np.pi * 392 * tt))
save("bloom", bloom * (1 - np.exp(-tt * 18)) * np.exp(-tt * 4.5))
