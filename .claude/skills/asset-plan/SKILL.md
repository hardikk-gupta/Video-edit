---
name: asset-plan
description: Stage 0 of a video edit. Use before any cutting to list every visual the video needs, classify each one, and fact-check every claim spoken in the footage. Ends with an approval stop.
---
# asset-plan (stage 0)

**In plain words:** a shopping list before cooking. Before one cut is made, write down every picture, screen recording and graphic the video will need, and check that every fact the creator says on camera is true today.

## Before filming: the script (when the creator has no script yet, or asks for one)
Use the `viral-video-writing` skill (installed by `toolkit/scripts/install_viral_skills.sh`; docs/13). Facts sheet first,
5 hooks judged with its `hook-craft.md`, 3 drafts, then score and rewrite until 90+ with no hard fails:
`python3 -I .claude/skills/viral-video-writing/scripts/score.py script.txt`. Deliver the script with times, 2 spare hooks
and the caption. The creator films from that; this plan starts when the footage arrives.

## Steps
0. **Script check on the footage** (2 minutes, even when the creator wrote it): put the spoken lines in a text file
   and run the `score.py` above. Then check by hand what the scorer can't: is the topic clear in the first 2 s, is there
   a re-hook every 5–8 s, is there a **proof** beat (a real result, number or footage near the end), one CTA.
   List anything weak at the top of the plan as a suggestion. Never rewrite the creator's words without asking.
1. Transcribe the footage (see shortform-cutaway step 1) and read all of it.
2. Match the extra clips (they come before any stock or generated footage):
   - Number the script lines L1, L2, L3... from the transcript.
   - Look at every clip in `raw/extra/` (`.claude/skills/learn-style/scripts/sample_frames.sh <clip> work/extra-frames 1`) and describe each in under 8 words.
   - Use the file name as a hint: a clip named `github.mp4` or `typing-L2.mov` goes where that word or line is.
   - Place each clip on the line it fits best. Any placement the creator already gave wins.
3. For each remaining sentence, decide what is on screen. Classify as exactly one of:
   `face` · `screen` (recording of a real site/app) · `card` (designed graphic) · `broll` · `generated` (AI clip) · `text-only`.
4. For every claim (a price, a number, a feature, a name, "free", "new"), open the live page and check it. Record the URL and what the page says today. Never fact-check from memory.
5. Write `work/asset-plan.md`: a table of `time · line · visual type · what exactly · source/URL · status (have / to capture / to make)`, then an "Extra clips" table of `clip · what it shows · placed at · or why not used`, then a "Claims" table of `claim · verdict · URL`.
6. List anything wrong or unverifiable at the top.
7. Show the CLIP MAP first in the message, before the plan, exactly in this short form:
   ```
   Your clips
   1. laptop typing       -> L2 "I just typed: edit this reel"
   2. GitHub page scroll  -> L6 "28 skills, all free on GitHub"
   3. coffee cup          -> not used (nothing in the script fits)

   Reply "ok", or change any line like:  "1 -> L3"  ·  "3 -> L5"  ·  "drop 2"
   ```
   Under it, the numbered script lines (L1, L2...) so changes are easy to give. Apply any changes, then continue with the rest of the plan.

## Rules
- Every extra clip the creator gave is either used or listed with the reason it was left out. Never drop one silently. *Why: they filmed it for this reel.*
- STOP after writing the plan. Show it to the creator. Do nothing else until they say yes. *Why: a wrong claim found after render costs a full re-edit.*
- A claim that cannot be verified is flagged, never silently kept.
- The creator's own prices and product names come from their live site, not from memory.
- Every number in the script has a source on the facts sheet. *Why: viral-video-writing's rule, and ours: never invent
  results, quotes or struggles.*
