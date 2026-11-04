#!/usr/bin/env bash
# Install Hardik's "viral video skills" upload (2026-11-04) locally: viral-video-writing + famous-reel-editor.
#   toolkit/scripts/install_viral_skills.sh <path/to/viral-video-skills.zip>
# The zip has no licence file, so it lives in gitignored vendor/ and is linked into .claude/skills (also gitignored),
# like fetch_vendor.sh. What we use from them, and what we don't, is in docs/13-skills.md.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
ZIP=${1:?path to viral-video-skills.zip}
DEST=vendor/viral-video-skills
rm -rf "$DEST.tmp" && mkdir -p "$DEST.tmp" && unzip -q "$ZIP" -d "$DEST.tmp"
rm -rf "$DEST" && mv "$DEST.tmp" "$DEST"
for s in viral-video-writing famous-reel-editor; do
  [[ -f $DEST/$s/SKILL.md ]] || { echo "missing $s/SKILL.md in the zip"; exit 1; }
  ln -sfn "../../$DEST/$s" ".claude/skills/$s"; echo "  skill: .claude/skills/$s -> $DEST/$s"
done
# Our router is reel-edit. Narrow famous-reel-editor's trigger in the local copy so "edit this reel" doesn't pick it.
python3 - "$DEST/famous-reel-editor/SKILL.md" <<'PY'
import re, sys
p = sys.argv[1]; s = open(p).read()
s = re.sub(r"^description: .*$", 'description: Only when the user names "famous-reel-editor". For "edit this reel" use the reel-edit router (our pipeline). Its green look, music bed, Higgsfield AI B-roll and ElevenLabs SFX are not our defaults (docs/13); its lessons are folded into shortform-cutaway and cut-audit.', s, count=1, flags=re.M)
open(p, "w").write(s)
PY
echo "Done. famous-reel-editor's defaults (green look, music, Higgsfield B-roll, ElevenLabs SFX) are NOT ours: see docs/13."
