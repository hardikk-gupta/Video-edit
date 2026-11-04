#!/usr/bin/env python3
"""Mix the film's sound bed from sfx-kit (CC0, vendor/sfx-kit) at the composition's own events.

    python3 sound/mix.py comp.html sound/sfx.wav          (needs playwright + ffmpeg; run from this folder)

comp.html's window.__events() returns [moment, sfx-kit id, volume]; each sound starts at moment − its sync point
(sounds.json), so the hit lands on the frame that causes it. Mixed without normalisation, limited at −1 dBTP.
"""
import asyncio, json, os, subprocess, sys
from playwright.async_api import async_playwright
comp, out = sys.argv[1], sys.argv[2]
GAIN = 1.8   # +5 dB: the bed alone around -32 LUFS, still well under a -14 LUFS voice
KIT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../../vendor/sfx-kit')
db = json.load(open(f'{KIT}/sounds.json')); db = db if isinstance(db, list) else db.get('sounds', db); by = {x['id']: x for x in db}
async def events():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1080, 'height': 1920})
        await pg.goto('file://' + os.path.abspath(comp)); await pg.evaluate('window.__ready')
        ev = await pg.evaluate('window.__events()'); dur = await pg.evaluate('window.__meta.dur'); await b.close(); return ev, dur
ev, dur = asyncio.run(events())
inputs, chains = [], []
for i, (t, sid, vol) in enumerate(ev):
    s = by[sid]; start = max(0.0, t - s['sync']['at'])
    inputs += ['-i', f"{KIT}/{s['file']}"]
    ms = int(round(start * 1000)); chains.append(f"[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={vol*GAIN:.3f},adelay={ms}|{ms}[s{i}]")
n = len(ev)
fc = ';'.join(chains) + ';' + ''.join(f'[s{i}]' for i in range(n)) + f'amix=inputs={n}:normalize=0:duration=longest,apad=whole_dur={dur},atrim=0:{dur},alimiter=limit=0.891:level=false[a]'
subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', fc, '-map', '[a]', '-ar', '48000', out], check=True)
print(f'{n} sounds -> {out}')
