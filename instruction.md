# Instructions for every video and every feedback round

Read this file with [AGENTS.md](AGENTS.md) before starting. Hardik's latest brief and feedback take precedence
over older examples. This repo is a growing record of taste and methods, not a fixed brand or a template
to repeat. The October 2026 reel is a past result, not the look every future video must have.

## Start here: every agent, every video (Claude, Codex or any other)

Do these in order before cutting or designing anything:

1. **Read this file and [AGENTS.md](AGENTS.md)**, then [the feedback log](docs/10-feedback-log.md).
2. **See which skills exist:** [docs/13-skills.md](docs/13-skills.md) indexes every skill in `.claude/skills/`
   (also reachable as `.agents/skills/`), including the edit formats (split-screen, paper-drawer, whiteout,
   caption, layered-head, b-roll-style, card-list, vlog, long-form, board-build). Open the `SKILL.md` of each
   one you will use. **The skills' process is the default way to work** (Hardik, 2026-10-26: use their process
   over ours): start from `reel-edit` and run its stages. Only Hardik's own explicit feedback (docs/10) overrides a skill.
   When a video needs something no skill covers (orbs, overlays, background removal, reframing, a new caption
   or collage style), look it up in [docs/14-ecosystem.md](docs/14-ecosystem.md): other creators' repos and libraries, by need.
3. **Watch first.** Use the `watch` skill on Hardik's footage and on every reference he sent: contact sheets +
   transcript (`--model medium` for Hinglish), then a written breakdown (hook, beats, on-screen text, layout,
   pacing, what makes it work). Use `learn-style` when a reference is the style to match. Never design from
   the file name or the brief alone.
4. **Write this video's own instructions** in `projects/<date>-<name>/instructions.md` (template:
   [projects/_template/instructions.md](projects/_template/instructions.md)). It holds Hardik's brief in his
   words, what was learned from watching, the chosen format skill(s), and the rules for this video. It is the
   working file for the job; update it with every round of feedback.
   Also decide the renderer for this video, **Remotion or HyperFrames**, using the table in
   [docs/06](docs/06-tools-skills-mcp.md#remotion-or-hyperframes-decide-per-video), and record the choice and reason there.
5. **Edit, then watch your own render** (the `watch` and `reel-review` steps) before Hardik sees it.
6. **Push lessons up into this file.** When feedback or an approval shows a rule that should hold for future
   videos, move it from the project's `instructions.md` into this file (and the affected doc), in the same
   commit. A rule that only fits this one video stays in the project file. This file is the main one: it
   should get better with every video.

## What not to do

- Do not default to Anton, condensed all-caps headlines, an oversized cross/VS badge, the same palette,
  or the previous video's layout. A font being installed does not make it the right choice.
- Do not make ordinary product names look like display logos by squeezing or over-styling them.
- Do not put a tiny eyebrow above a headline to make the frame look designed. In particular, do not
  repeat lines such as "TWO TAKES ON ALWAYS-ON AI" or "THE NEXT AI SHIFT / 01" as generic decoration.
- Do not build every comparison as two stacked rounded rectangles, or fill every available grid cell.
- Do not use stock filler, unrelated imagery, decorative counters, or motion that adds no meaning.
- Do not treat a working render, a downloaded asset, or a previous approval as proof of good design.
- Do not call something "trending" or "working" without current examples and supporting evidence.
- Do not leave lessons only in chat, an agent's memory, or a generic changelog entry.
- Do not make another video just because feedback arrived. Follow the requested scope: documentation-only
  feedback means update the repo, without rendering or changing the video.

- Do not make a video about Claude look like Claude's own branding: no cream/terracotta/orange palette and no
  serif headings that echo it (user, 2026-10-26: v2 "was looking like it was something given by Claude itself").
  Pick a palette that is the creator's, not the subject's.

## What to do

### 1. Read the accumulated taste before choosing a style

Read [the feedback log](docs/10-feedback-log.md), [motion rules](docs/04-motion-rules.md), and
[reference studies](docs/07-references.md), then the relevant project record. Separate what Hardik liked,
what he rejected, and what has not been reviewed. Preserve useful principles across projects, not a
permanent visual identity. Reuse the toolkit's mechanics without automatically copying its visual styling.

### 2. Find references for this particular reel

Start with Hardik's inspirations and the story. Then actively look for recent, relevant social campaigns,
reels and motion work on Instagram, Pinterest, Behance, Vimeo, creators' portfolios and motion galleries
such as Jitter. Prefer original work over template roundups. Use official product pages and launch films
for the subject's real imagery and facts; see [the sourcing method](docs/11-pulling-references.md).

For each useful reference, record its URL, creator, date viewed, relevant timecodes, and what its typography,
scale, whitespace, grid and motion accomplish. Distinguish visible engagement from a claim of performance:
views alone do not prove the design caused success. If current browsing or metrics are unavailable, say
what was actually inspected instead of inventing a trend. Do not require Hardik to do all the research.

Merge the strongest relevant ideas with this repo's lessons. Do not blindly replace earlier references
with the newest one or copy another creator's exact composition.

### 3. Make type and scale feel natural

The Inter treatment in "You log off. They keep going." is a positive reference from this chat. Explore a
similarly natural sans serif at headline scale, with appropriate weight, width, spacing and line height.
This is a direction, not a permanent requirement to use Inter. The Anton treatment of "ALWAYS ON" and
"DUET × DOTS" in the retry is a negative reference.

Choose a small, coherent type scale for the actual canvas and viewing size. Start with a headline and
readable supporting text; add a third level only if needed. For a 1080-wide frame, a restrained starting
study might compare 48, 64, 88 and 112 px in the chosen family, then retain only the useful sizes. These
are test sizes, not a universal preset. Check actual word lengths, weights, line breaks and the final
phone-sized crop, especially when this graphic occupies only one panel of a vertical video.

### 4. Compose instead of filling a template

Explore a grid or another point of view that suits the story. Hardik's example: a 3 × 3 grid with six
occupied cells and three left empty; distribute Duet and Dots imagery across cells, with one or two cells
for the comparison. This is an option to explore, not the next compulsory template. Empty cells can
provide rhythm and focus. Keep a clear reading order, readable text and intentional motion between beats.

Show the idea or the work happening. Product marks, screenshots and motion should contribute to the
story rather than sit inside interchangeable cards. Review stills at the intended viewing size before
committing to a long render.

### 5. When the brief calls for a split-screen explainer

Follow [the split-screen method](docs/12-split-screen-explainer.md): the speaker occupies the bottom panel,
and the top panel illustrates the current spoken point using the treatment Hardik requested. Transcribe, identify entities and
claims, obtain the exact link from the brief/audio or ask when ambiguous, then map each word to its visual.
Capture a page when showing evidence such as a repo count; use full-field marks and line graphics when the
brief rejects screenshots. For this jinn edit, Hardik chose Hairline over the generated laptop/cube image. Do not treat the top as decorative
B-roll or a slideshow on an unrelated timer. Keep source dates and flag material factual mismatches.
The requested bottom-panel presenter is an exception to the older small-face-tile layout; retain one
natural-colour instance and stable framing. Study a supplied reference first when asked; wait for the
footage before starting its edit.

## Update the repo after each event, before ending the task

| Event | Required record |
| --- | --- |
| Video created | Project brief, sources, design decisions, validation and unreviewed choices; update any method learned. |
| Video revised | What changed and why, what stayed, which checks were repeated, and whether Hardik has reviewed it. |
| Hardik gives feedback | His specific positive and negative examples, the lesson, and the rule that must change. |

For each event:

1. Update the relevant `projects/<date>-<name>/README.md` without presenting an unreviewed choice as approved.
2. Append feedback to `docs/10-feedback-log.md` when feedback was given. Separate Hardik's words from agent interpretation.
3. Correct the affected guidance in `docs/03-design-language.md`, `docs/04-motion-rules.md`,
   `docs/07-references.md`, `docs/09-review-checklist.md`, or `docs/11-pulling-references.md` as appropriate.
   An appended lesson does not fix a contradictory old default.
4. Update this file or `AGENTS.md` when the lesson changes the standing workflow; append `CHANGELOG.md`.
5. Check links and contradictions. Keep footage, voice, renders and downloaded third-party assets outside
   Git. Save methods, source URLs, decisions and code.
6. Keep unrelated user changes intact. Include the relevant documentation with the associated commit;
   for a documentation-only request, publish only the requested notes and instructions. Report whether
   changes are local, committed, or actually pushed to GitHub. Never claim remote persistence from a local edit.

The 2026-10-22 feedback round requested repo updates only, not another Duet/Dots video. This records that
request's scope; a later explicit request can authorize a new revision.
