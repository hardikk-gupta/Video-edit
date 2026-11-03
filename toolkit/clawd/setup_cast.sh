#!/usr/bin/env bash
# Like setup.sh, but for cut-out character clips: a square, transparent canvas (no paper, grain or stage; the scene
# file overrides makePaper/makeGrain/composite) rendered as PNG with --png. Remotion places the clips.
#   toolkit/clawd/setup_cast.sh <scene.js> <workdir> [duration] [size]
# Render a clip:  cd <workdir> && node render.mjs --soft-gl --chrome=/usr/bin/google-chrome --png --fps=8 --range=2.9:7.6 --workers=1 --out=out/cast
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
SCENE=${1:?scene.js}; WORK=${2:?workdir}; DUR=${3:-45}; S=${4:-640}
toolkit/clawd/setup.sh "$SCENE" "$WORK" "$DUR" 110
sed -i "s/^const W = 1080, H = 1920;/const W = $S, H = $S;/" "$WORK/src/core.js"
sed -i "s/width=\"1080\" height=\"1920\"/width=\"$S\" height=\"$S\"/; s#aspect-ratio: 9 / 16#aspect-ratio: 1 / 1#" "$WORK/studio.html"
sed -i "s/--window-size=1080,1920/--window-size=$S,$S/" "$WORK/render.mjs"
# --png names frames from 0 within the range; name them by video frame instead so clips line up with video time
sed -i 's#writeFileSync(`${out}/f${String(i).padStart(4, '"'"'0'"'"')}.png`, await frameOf(page, a + i / fps, '"'"'image/png'"'"'));#writeFileSync(`${out}/f${String(Math.round(a * fps) + i).padStart(5, '"'"'0'"'"')}.png`, await frameOf(page, a + i / fps, '"'"'image/png'"'"'));#' "$WORK/render.mjs"
grep -q "const W = $S, H = $S" "$WORK/src/core.js" && grep -q 'Math.round(a \* fps) + i' "$WORK/render.mjs" && echo "cast ready: $WORK ($S×$S)"
