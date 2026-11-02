#!/usr/bin/env bash
# Pull the third-party animation projects from Hardik's six reference reels (docs/15) into vendor/,
# pinned to the commits we read, and link their agent skills into .claude/skills/.
#   toolkit/scripts/fetch_vendor.sh            (run from the repo root; ~850 MB with hyperframes)
#   toolkit/scripts/fetch_vendor.sh --small    (skip hyperframes, ~450 MB)
# vendor/ and the linked skill folders are gitignored: third-party code is fetched, never committed.
# Nothing here runs npm install or any vendored code. Read a project's README before running it.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
SMALL=${1:-}

# name  repo  commit  licence
REPOS=(
  "claude-animation-base JohnHeibel/ClaudeAnimationBase 0ac8bf2b31942376cb6b8c4074715595d512acd2 MIT"
  "gbro-collage-broll    pyang5166/gbro-collage-broll   a1a4ee2e2abf7d44e460026b706d0c72c2cf8a91 MIT"
  "lemo-opuscar          lemomo-ai/lemo-opuscar         bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00 MIT"
  "onetake               feitangyuan/onetake            013a61ac8d98883c73733f59c06e49e9ba444f14 PolyForm-Noncommercial-1.0.0"
  "hyperframes           heygen-com/hyperframes         2bdc866c85198acb143accaf1dedfeff22b6f9d0 Apache-2.0"
)

mkdir -p vendor
for row in "${REPOS[@]}"; do
  read -r name repo commit licence <<<"$row"
  [[ $SMALL == --small && $name == hyperframes ]] && continue
  dir=vendor/$name
  if [[ ! -d $dir/.git ]]; then
    git init -q "$dir"
    git -C "$dir" remote add origin "https://github.com/$repo.git"
  fi
  git -C "$dir" fetch -q --depth 1 origin "$commit"
  git -C "$dir" checkout -q --detach FETCH_HEAD
  echo "vendor/$name  $repo@${commit:0:7}  $licence"
done

# Skills that agents should load from .claude/skills (also seen through .agents/skills).
link() { # link <skill-name> <path inside vendor/>
  [[ -d vendor/$2 ]] || return 0
  ln -sfn "../../vendor/$2" ".claude/skills/$1"
  echo "  skill: .claude/skills/$1 -> vendor/$2"
}
link onetake            onetake
link gbro-collage-broll gbro-collage-broll
link lemo-opuscar       lemo-opuscar/plugin/skills/lemo-opuscar
for s in hyperframes hyperframes-cli hyperframes-registry media-use remotion-to-hyperframes reverse-any-video slideshow; do
  link "$s" "hyperframes/skills/$s"
done

echo "Done. onetake is noncommercial-only: do not use it on paid or sponsored videos (docs/15)."
