# "Only learning Figma? You're dead." · the OneTake film

Hardik (2026-11-04) asked for the motion-graphics quality of two Pinterest references (docs/07), built as a one take
with the OneTake skill, without ref 1's green. This is that film. The HyperFrames storyboard in
`toolkit/hyperframes/figma-is-not-enough/` was the first round (v0); its script and timings carry over.

**Concept (OneTake §2, "one element transforms through everything"):** one design-tool selection box carries the
whole film. It selects "Figma?", is abandoned when the AI builds the app by itself (tag "you · not needed", the box and
cursor drop out of frame: *why* you're dead), then frames the real Figma Make page, the toolbar, one sketched screen,
"you", the references (as a viewfinder), the user (in UX judgment), the agent's output, the handoff, this film's own
folder (".fig: 0 results"), and finally the comment field. Alternatives not built: a camera dive through scale
(Figma's prompt box down into the designer's head), and a before/after split.

**Look:** black `#06060A` with a blue-violet bloom from below and thin light rings (ref 2's light, ref 1's arcs,
recoloured), Inter paired with Instrument Serif italic (ref 2), one accent `#7B83FF`, and `#FF5A3C` once for "dead."
A paper flood for the sketchbook beat (ref 2's theme flip). Content is centred on the frame (DY = 190), because Hardik
flagged v0 as top-heavy. Captions sit in a dark pill at y 1420.

**Measured from the refs (OneTake `analyze_ref.py`):** ref 1 is 31 % low-motion, its longest hold is 3.25 s, with a
burst every ~3.6 s; ref 2 is 39 % low-motion, with hard-cut bursts at 5–6/s on reveals. Here, the bursts land on: the
build, the verdict, the tools scattering, the reference flick, the tabs, the handoff fold.

## Files
- `comp.html`: the composition (`__seek`, `__meta`, `__motion`, `__events`). It loads OneTake's `motion.js` from
  `vendor/onetake/lib/` (PolyForm Noncommercial; not copied here) and the Figma Make / reference captures from
  `../../hyperframes/figma-is-not-enough/assets/captures/` (gitignored, re-capture with the script in that project's notes).
- `fonts/`: Instrument Serif regular + italic (OFL, Fontsource). Inter comes from the system.
- `sound/mix.py`: the sound bed from `wyzowl/sfx-kit`, one sound per visible cause from `__events()`.

## Render (needs a venv with playwright 1.63, numpy, scipy, pillow)
```bash
python3 sound/mix.py comp.html sound/sfx.wav
python3 ../../../vendor/onetake/scripts/render.py comp.html --out draft.mp4 --width 1080 --height 1920 \
  --sfx sound/sfx.wav --samples-max 16 --gap 10 --workers 3      # 1080×1920, 30 fps, 180° shutter
```
Licence note: OneTake is noncommercial-only. If this reel becomes paid or sponsored, swap `motion.js` and `render.py`
for our own (docs/15).
