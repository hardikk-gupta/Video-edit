# Changelog

One dated entry per change, oldest first. Append in the same commit as the change.

- 2026-10-20 · Created the playbook from the first project (AI automations talk, v1→v3): AGENTS.md operating
  manual, docs 01–10 (inputs and modes incl. storyline-only + ElevenLabs voice, pipeline with commands,
  design language, motion do's and don'ts, sound, tools/skills/MCP/repos, references, environment gotchas,
  review checklist, feedback log), the Remotion toolkit (v3 composition as template, patched Hairline,
  SFX library, fonts, scripts: transcribe, cut snapping, build cut, synth SFX, master), and the project
  record. No footage or renders are stored.
- 2026-10-22 · Added the dots vs Claude Duet insert: `toolkit/src/DotsVsDuet.tsx` (5s, 1:1, a reference board that splits into a versus, with the Duet SVG icon animated), `scripts/fetch_refs_dots_duet.sh` to rebuild all assets from the web (outputs gitignored), `docs/11-pulling-references.md` (sourcing method), Mode D (short inserts) in docs/01, and the project record.
- 2026-10-22 · Recorded Hardik's typography, hierarchy and layout feedback from the Duet/Dots retry.
  Added root `instruction.md` and linked it from the agent entry points. Reframed the old visual system
  as historical, removed automatic condensed headlines/tiny overlines/stacked-card defaults, documented
  natural type and purposeful grid options, and required current reference research plus repo updates
  after every creation, revision and feedback round. Updated the project record and review checklist.
  Documentation only; no video or video revision was made for this request.
- 2026-10-22 · docs/11: sourcing meme/reaction clips from Tenor (Motu Patlu "Kya hukum hai mere aaka" jinn clips for Hardik).
- 2026-10-22 · Analysed Hardik's split-screen reference (@SHAI.HQ, Ponytail repo): beat map, measured layout and transcript in `projects/2026-10-split-screen-explainer/`. Added `docs/12-split-screen-explainer.md` (format, sync rule, camera language, pipeline, asks), Mode E in docs/01, a reference entry in docs/07, the brief in the feedback log, and `toolkit/scripts/web_shot.mjs` (Playwright page capture returning element boxes by visible text; tested on GitHub). No video yet.
- 2026-10-22 · Built the jinn → dots/Claude Duet/Grok Bot split-screen video (`toolkit/src/GrokDotsDuet.tsx`, 1080×1920, 56.3s; unreviewed). Added `scripts/web_capture.mjs` (overlay-free full-page captures), `scripts/web_phrases.mjs` (phrase-level rects) and `scripts/fetch_refs_gdd.sh`; lessons in docs/12; project record in `projects/2026-10-22-jinn-agents/`; brief in the feedback log.
- 2026-10-22 · Cross-checked the uploaded 49.1s split-screen reference with word timings and exact frames.
  Clarified its 56/44 layout, speech-to-element focus, link verification and current-source discrepancies.
  Updated the standing instructions, presenter-panel exception and reference record. Analysis only;
  no new video was made or edited in this chat for this request.
- 2026-10-22 · Jinn video v2 after Hardik's feedback: whole head always visible (panel 55%, measured), his opening untouched, full-bleed graphics with no inner card and no page screenshots, AI logos / products introduced when spoken, all three products in one picture. Rules recorded in docs/12, feedback in docs/10, v2 notes in the project README. Assets: logos from Simple Icons and Wikimedia (gitignored), wordmarks keyed from official images.
- 2026-10-22 · Jinn video v3 after Hardik's v2 feedback: `GrokDotsDuet.tsx` rebuilt on the dots-vs-Duet guide grid (3×2 cells), an identical-size trio of brand tiles on shared baselines, eight Hairline figures as explainers, one Inter scale, and quiet sparse SFX (new synthesized `tap`/`bloom`; no swooshes). Feedback and lessons in docs/10, a sound rule in docs/05, rules in docs/12, v3 section in the project record, tile generation in `fetch_refs_gdd.sh`.


- 2026-10-22 · Jinn Codex Hairline revision: corrected presenter crops with measured tracking, kept the original animated hook
  and its audio, used full-field speech-led graphics without page screenshots, removed invented counts/model
  versions and premature product recap, and replaced the generated computer art with Hairline's animated
  laptop at Hardik's request. Added framing metadata, reusable audio preparation and framing audit scripts;
  corrected contradictory split-screen guidance and recorded feedback. Review pending.

- 2026-10-22 · Validated Codex Hairline export:1080×1920,30fps,1687frames,56.233s,H.264/AAC;
  full decode passed,106 sampled face bounds retained, original hook PCM preserved before AAC.
  Quiet tap/bloom master measures−16.18LUFS after the hook,−1.31dBTP. Review pending.

- 2026-10-22 · Reworked `JinnHairlineRevision` after comparison with Hardik's uploaded `jinn-v3.mp4`:
  coherent guide grid and Hairline scenes, larger explanatory labels, equal product tiles/baselines, complete
  Dots mascot, measured face tracking retained. Kept original hook, centre captions and quiet mastered audio.
  Updated asset restoration, reference study, project record and feedback/review guidance. Review pending.

- 2026-10-22 · Validated the jinn rework export:1080×1920,30fps,1687frames,56.233s; full decode
  and TypeScript passed,16 beat stills and final28-frame contact sheet reviewed. Existing mastered AAC
  stream preserved exactly; presenter framing/captions unchanged. Published code and learnings; review pending.
- 2026-10-26 · Copied the 28 skills from ritu-dadhwal4/instagram-video-skills (MIT) into `skills/vendor/instagram-video-skills/` for study, after Hardik shared a screenshot of the same skill names. Added `skills/README.md` (source, commit, licence, status) and a pointer in AGENTS.md. Not yet merged into our rules.
- 2026-10-26 · Installed the skills where agents load them: the 28 instagram-video-skills (MIT) and the `watch` skill from victor-shulga/watch (MIT) in `.claude/skills/`, with `.agents/skills` as a symlink for Codex and others; licences in `.claude/skills/_licenses/`. Replaced the earlier `skills/vendor` copy. Added `docs/13-skills.md` (index, edit formats, stages, sources, conflicts with our rules), a "Start here" protocol at the top of instruction.md (read, check skills, watch first, write the project's instructions.md, push durable lessons back into instruction.md), `projects/_template/instructions.md`, and pointers in AGENTS.md, CLAUDE.md and README.md.
- 2026-10-26 · Precedence flipped per Hardik: the installed skills' process (`reel-edit` and its stages) is the default and overrides our older docs; only Hardik's explicit feedback overrides a skill. Updated instruction.md, docs/13, AGENTS.md and the feedback log.
- 2026-10-26 · Researched how other creators edit short-form video with Claude Code/Codex: added `docs/14-ecosystem.md` (renderers in use, repos by need incl. orbs/glow/shaders, overlays, background removal, auto-reframe, captions, beat sync, Lottie, collage, CC0 sound, QA; gap list and priorities). Nothing installed yet. Pointers in instruction.md, AGENTS.md and README.md.
- 2026-10-26 · Pulled in the front-page README of ritu-dadhwal4/instagram-video-skills (`0b7daf3`, MIT) as `docs/15-skills-guide.md`: how one edit goes, the seven brief questions, editing and caption styles, b-roll order, notes, limits. Skill links repointed to `.claude/skills/`; added a note on local differences (install already done, Remotion/faster-whisper, Hardik's overrides). Skills not re-copied: already identical to that commit. Linked from README.md, AGENTS.md and docs/13.
