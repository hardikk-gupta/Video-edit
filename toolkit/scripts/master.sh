#!/usr/bin/env bash
# Loudness-master and compress a Remotion render for social.
#   scripts/master.sh out/reel-raw.mp4 out/reel-final.mp4
# -14 LUFS is the usual target for Instagram/YouTube. CRF 24 + tune film keeps a 60s 1080p reel
# around 12MB even with film grain (CRF 18-19 gave 200MB+ because grain eats bitrate).
set -euo pipefail
ffmpeg -v error -y -i "$1" -c:v libx264 -crf 24 -preset slow -tune film -pix_fmt yuv420p -movflags +faststart \
  -af "loudnorm=I=-14:TP=-1.0:LRA=9" -c:a aac -b:a 256k -ar 48000 "$2"
ffmpeg -i "$2" -af ebur128 -f null - 2>&1 | grep -A1 "Integrated" | tail -1
du -h "$2"
