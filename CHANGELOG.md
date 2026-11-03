# Changelog

- 2026-10-26 · Built draft v2 for “Claude edits this reel” in Remotion: one continuous take, a measured 9:16
  presenter split, word-timed captions, and Hairline diagrams matched to the spoken beats. A second-model
  review found and helped fix face-overlapping captions and a title outside the safe area; the revised frame
  review passed. Created project instructions and validation notes. Awaiting Hardik's feedback before final.

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
- 2026-10-26 · Pulled in the front-page README of ritu-dadhwal4/instagram-video-skills (`0b7daf3`, MIT) as `docs/16-skills-guide.md`: how one edit goes, the seven brief questions, editing and caption styles, b-roll order, notes, limits. Skill links repointed to `.claude/skills/`; added a note on local differences (install already done, Remotion/faster-whisper, Hardik's overrides). Skills not re-copied: already identical to that commit. Linked from README.md, AGENTS.md and docs/13.
- 2026-10-26 · Renderer is now chosen per video (user): Remotion vs HyperFrames decision table in docs/06, step in instruction.md, note in docs/13, feedback log entry. Started project `projects/2026-10-26-claude-did/` (paper-drawer, Paper Craft, Remotion chosen and why), `toolkit/src/PaperDrawerWA.tsx`, Fraunces font, face/word data; footage stays out of Git (`public/wa1832/` ignored). Render pending.
- 2026-10-26 · "Claude did" teaser v2 rendered (paper-drawer, Paper Craft, Remotion): v1 failed reel-review (placeholder list, wipe slivers, card overlaps, contrast), fixed; v2 passed. −14.7 LUFS. Added a separate Remotion entry (`src/entry-wa1832.ts`) so one comp bundles without other projects' generated files; review-checklist lesson on clean wipes. Awaiting the user's review.
- 2026-10-26 · "Claude did" v3 per the user's v2 notes: `SplitMixWA` mixes split-screen (speaker bottom), caption-edit with zoom cuts, whiteout hits, paper drawers with our own doodle pet, local pencil-sketch restyle; white/ink/blue, Inter. Sound by sfx-design via new `toolkit/scripts/mix_sfx.py` + `sfx.json`. Rules updated: docs/05 + docs/13 (follow sfx-design), AGENTS rule 2 (zoom-cut exception), instruction.md (don't echo the subject's brand palette); feedback logged; asset plan + geometry in the project folder. Second-model review PASS.
- 2026-10-27 · "Claude did" v4 (`ClaudeDidV4`): the pet becomes the editor across every beat; zoom-through, whip pan and pencil-wipe transitions; draw-on doodles, word-by-word headlines and captions, dot-grid top panel; smoother sketch restyle; sfx-v4 cue sheet. Lessons added to docs/04; feedback logged; project record updated. Second-model review PASS.
- 2026-11-02 · Followed up the six creator reels (tool inventory from chat). Found and pinned the real projects: Claude Animation Base (JohnHeibel, MIT), gbro-collage-broll (MIT), lemo-opuscar (MIT, 66 styles, not 43/51 as the reels said), OneTake (PolyForm Noncommercial) and HyperFrames (Apache-2.0). Added `toolkit/scripts/fetch_vendor.sh` (clones them into gitignored `vendor/` and links their skills into `.claude/skills/`), `docs/15-mascot-and-collage.md` (status table, the character-sheet method for making a mascot act, routes A/B/C, Clawd brand caution, collage B-roll in Claude Code, lip-sync mouth chart), our own `mascot-animate` skill and `projects/_template/character-sheet.md`. Pointers in docs/13, docs/14, AGENTS.md, instruction.md and README.md. No vendored code was run (npm install not yet approved) and no video was made.
- 2026-11-02 · Route A (Clawd as-is) chosen. Installed and smoke-tested Claude Animation Base in vendor/ (demo sheet rendered; ~35–55 s/frame with --soft-gl on 4 CPUs). Recorded the decision, render speed and how the Gemini key is kept out of Git in docs/15.
- 2026-11-02 · Built "Editing with Claude" v1 (45 s, 1080×1920): a match-cut hook ("Claude" locked through 10 page
  designs, resolving to "Editing with Claude"), then Clawd on a cinematic night stage (Claude Animation Base, route A,
  drawn on threes) acting out the six-step process beside clean UI cards, one-word captions, quiet SFX and a
  "Comment EDIT" close. Code: `toolkit/src/EditWithClaude.tsx`, `toolkit/src/ewc.ts`, `toolkit/clawd/`. Project
  record and VO script in `projects/2026-11-02-edit-with-claude/`. Rendered (not committed); Hardik's review pending.
- 2026-11-03 · "Editing with Claude" v2 at Hardik's request: one persistent workspace window, a carry at every step
  boundary, Clawd moving with the UI under a follow spot, the hook resolving onto the lit stage, a holding camera and
  speed blur. Reel-review (second model) failed the first v2 render; its fixes are applied and the re-render passed.
  Updated the project README and instructions, docs/10 (feedback) and docs/15 (v2 lessons). Render not committed.
- 2026-11-03 · "Editing with Claude" v3 at Hardik's request: a new storyboard (`storyboard-v3.md`) of nine full-bleed
  scenes in different styles (feed and torn paper, paper-cut folder, film strip with shutter, paper desk with stamp,
  the real Remotion Studio timeline, review terminal and chat, notebook log, system grid). Clawd is now cut-out
  clips sitting inside each scene (`toolkit/clawd/ewc-v3-cast.js`, `setup_cast.sh`, `key_cast.sh`). Sound comes from
  `wyzowl/sfx-kit` (CC0, pinned in `fetch_vendor.sh`, `src/sfxkit.ts`). Fluent VO script. Caveat font (OFL) added.
  Updated docs/05 (sound rule), docs/10, docs/15 and the project README. Reel-review passed. Render not committed.
- 2026-11-03 · Upgraded Remotion and all its packages from 4.0.537 to 4.0.540 (latest; newer Studio timeline). Added
  `@remotion/bundler` and `@remotion/renderer` as direct dependencies for `scripts/stills.mjs`. v3 still renders;
  docs/06 updated.
- 2026-11-03 · Merged the other Claude session's branch (`claude/brave-bohr-e8eh7y`: skills guide, renderer choice per
  video, "Claude did" teaser v2–v4, `mix_sfx.py`) into this one so both reach `main`. Its `docs/15-skills-guide.md` is
  now `docs/16-skills-guide.md` (15 was already the mascot doc) and its links are updated. In the docs/05 sound rules,
  the 2026-11-03 sfx-kit rule sits on top of the 2026-10-26 `sfx-design` rule, which still sets levels and spacing.
- 2026-11-03 · docs/07: logged the five "Editing with Claude" reference reels and the repos found for it (OneTake, sfx-kit, CAB, HyperFrames).
