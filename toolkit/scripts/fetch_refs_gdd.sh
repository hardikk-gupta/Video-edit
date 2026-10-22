#!/usr/bin/env bash
# Rebuild public/refs/gdd/ for src/GrokDotsDuet.tsx (project 2026-10-22-jinn-agents).
#   scripts/fetch_refs_gdd.sh <hardik-footage.mp4>      (run from toolkit/, after npm i)
# Needs the dots/Duet assets from fetch_refs_dots_duet.sh (run it first). Outputs are never committed.
set -euo pipefail
SRC=${1:?pass Hardik's full-frame footage (the version without the white header)}
P=public/refs/gdd; W=$(mktemp -d); mkdir -p "$P"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"

cp "$SRC" "$P/hardik.mp4"
ffmpeg -v error -y -ss 0.8 -i "$SRC" -frames:v 1 "$P/genie.png"           # his opening jinn still

# Official pages, dark mode, overlays removed (boxes printed for reference; the composition hard-codes them).
node scripts/web_capture.mjs https://x.ai/news/introducing-grok-bot "$W/xai.png" "$W/xai.json" "Introducing Grok Bot"
node scripts/web_capture.mjs https://claude.com/duet "$W/duet.png" "$W/duet.json" "Get back to what needs you"
node scripts/web_phrases.mjs https://x.ai/news/introducing-grok-bot "$W/xai-ph.json" "You can message them like a colleague and hand off the work" "A computer of its own" "keep working 24/7"
node scripts/web_phrases.mjs https://claude.com/duet "$W/duet-ph.json" "keeps working while you" "Powered by Opus 5.5" "briefs you every morning, drafts next steps"
cat "$W"/*-ph.json
python3 -I - "$W" "$P" <<'PY'
import sys
from PIL import Image
w, p = sys.argv[1], sys.argv[2]
Image.open(f"{w}/xai.png").convert("RGB").crop((0, 0, 2560, 3600)).save(f"{p}/xai.jpg", quality=92)
Image.open(f"{w}/duet.png").convert("RGB").crop((0, 0, 2560, 6400)).save(f"{p}/duet.jpg", quality=92)
PY

# Grok Bot launch image; dots key art, product UI and TechCrunch's "Alfred's computer" screenshot; Duet og.
curl -sSfL -A "$UA" -o "$W/grokbot.png" https://x.ai/images/news/introducing-grok-bot-og-2.png
ffmpeg -v error -y -i "$W/grokbot.png" "$P/grokbot.jpg"
curl -sSfL -A "$UA" -o "$P/dots-keyart.jpg" "https://designcompass.org/wp-content/uploads/2026/09/openai-dots-9-scaled.jpg"
curl -sSfL -A "$UA" -o "$P/dots-ui.jpg" "https://www.igeeksblog.com/wp-content/uploads/2026/09/openai-dots-feature.jpg"
curl -sSfL -A "$UA" -o "$P/dots-computer.jpg" "https://techcrunch.com/wp-content/uploads/2026/09/Screenshot-2026-09-29-at-1.16.22-PM.jpg?w=988"
curl -sSfL -A "$UA" -o "$P/duet-og.jpg" "https://claude.com/static/claude-duet/og.jpg"
rm -rf "$W"; ls "$P"
