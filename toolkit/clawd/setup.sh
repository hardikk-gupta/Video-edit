#!/usr/bin/env bash
# Build a portrait (1080×1920) working copy of Claude Animation Base with our scene, for Remotion to composite.
#   toolkit/clawd/setup.sh <scene.js> <workdir> [duration] [bpm]
# e.g. toolkit/clawd/setup.sh toolkit/clawd/edit-with-claude.js edits/2026-11-02-edit-with-claude/clawd 45 110
# Needs vendor/claude-animation-base (toolkit/scripts/fetch_vendor.sh) with npm install done. The workdir is gitignored.
# Render frames:  cd <workdir> && node render.mjs --soft-gl --chrome=/usr/bin/google-chrome --frames --fps=12 --range=2.4:45 --workers=4
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
SCENE=${1:?scene.js}; WORK=${2:?workdir}; DUR=${3:-45}; BPM=${4:-110}
BASE=vendor/claude-animation-base
[[ -d $BASE/node_modules ]] || { echo "run npm install in $BASE first"; exit 1; }
mkdir -p "$WORK/src/scenes"
cp "$BASE"/{render.mjs,studio.html,package.json} "$WORK/"
cp "$BASE"/src/*.js "$WORK/src/"
ln -sfn "$(pwd)/$BASE/node_modules" "$WORK/node_modules"
cp "$SCENE" "$WORK/src/scenes/scene.js"
# portrait canvas
sed -i 's/^const W = 1920, H = 1080;/const W = 1080, H = 1920;/' "$WORK/src/core.js"
sed -i 's/width="1920" height="1080"/width="1080" height="1920"/; s#aspect-ratio: 16 / 9#aspect-ratio: 9 / 16#; s#src/scenes/demo.js#src/scenes/scene.js#' "$WORK/studio.html"
sed -i "s/--window-size=1920,1080/--window-size=1080,1920/" "$WORK/render.mjs"
# No lettering in our scenes: drop the Google Fonts request, which stalls parallel page loads (30 s timeout).
sed -i '/fonts.googleapis.com/d' "$WORK/studio.html"
# Software GL makes setup slow with several pages at once: no load timeouts.
sed -i "s/waitUntil: 'networkidle0' }/waitUntil: 'load', timeout: 0 }/; s/{ timeout: 60000 }/{ timeout: 0 }/" "$WORK/render.mjs"
sed -i "s/^const PROJECT = .*/const PROJECT = { duration: $DUR, bpm: $BPM, offset: 0 };/" "$WORK/src/config.js"
grep -q 'const W = 1080, H = 1920' "$WORK/src/core.js" && grep -q scene.js "$WORK/studio.html" && echo "ready: $WORK"
python3 -I toolkit/clawd/patch_render.py "$WORK/render.mjs"
