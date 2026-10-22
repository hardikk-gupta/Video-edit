#!/usr/bin/env bash
# Pull and prepare every reference used by src/DotsVsDuet.tsx (project 2026-10-dots-vs-duet).
#   scripts/fetch_refs_dots_duet.sh            (run from toolkit/)
# Downloads into a scratch dir, crops into public/refs/, and writes src/duet-paths.json from
# claude.com's app-icon SVG. Third-party material: never commit the outputs.
set -euo pipefail
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
W=$(mktemp -d); OUT=public/refs; mkdir -p "$OUT"
get() { curl -sSfL -A "$UA" -o "$W/$1" "$2"; }

# OpenAI dots: key art (2048x2560: glowing wordmark over four mascots), product UI, launch film.
get keyart.jpg  "https://designcompass.org/wp-content/uploads/2026/09/openai-dots-9-scaled.jpg"
get dots-ui.jpg "https://www.igeeksblog.com/wp-content/uploads/2026/09/openai-dots-feature.jpg"
get film.mp4    "https://designcompass.org/wp-content/uploads/2026/09/openai-dots.mp4"
# Claude Duet: og image (wordmark) and the flat app icon SVG.
get duet-og.jpg   "https://claude.com/static/claude-duet/og.jpg"
get duet-icon.svg "https://claude.com/static/claude-duet/app-icon-flat.svg"

ffmpeg -v error -y -i "$W/keyart.jpg" -vf "crop=2048:820:0:660"  "$OUT/dots-word.png"
ffmpeg -v error -y -i "$W/keyart.jpg" -vf "crop=2048:800:0:1760" "$OUT/dots-mascots.png"
cp "$W/dots-ui.jpg" "$OUT/dots-ui.jpg"
# Mascots on their screens in the launch film (1276x718): time → square crop.
frame() { ffmpeg -v error -y -ss "$1" -i "$W/film.mp4" -frames:v 1 -vf "crop=$2" "$OUT/$3.png"; }
frame 24.6 560:560:440:140 blue
frame 29.5 520:520:298:60  green
frame 30.8 520:520:289:40  alfred
frame 33.2 480:480:406:70  heart
ffmpeg -v error -y -i "$W/duet-og.jpg" -vf "crop=1340:240:740:500" "$OUT/duet-word.png"
cp "$W/duet-icon.svg" "$OUT/duet-icon.svg"
python3 -I - "$W/duet-icon.svg" src/duet-paths.json <<'PY'
import json, re, sys
svg = open(sys.argv[1]).read()
json.dump([re.search(r'd="([^"]+)"', p).group(1) for p in re.findall(r"<path([^>]*)/>", svg)], open(sys.argv[2], "w"))
PY
rm -rf "$W"; ls "$OUT"
