#!/usr/bin/env bash
# Key the chroma-green cast frames (ewc-v3-cast.js) to transparent PNGs.  key_cast.sh <in-dir> <out-dir>
set -euo pipefail
in=${1:?in}; out=${2:?out}; mkdir -p "$out"
for f in "$in"/f*.png; do
  ffmpeg -v error -y -i "$f" -vf "colorkey=0x00FF00:0.30:0.12,despill=type=green:mix=0.6:expand=0.2,format=rgba" "$out/$(basename "$f")"
done
echo "keyed $(ls "$out" | wc -l) frames → $out"
