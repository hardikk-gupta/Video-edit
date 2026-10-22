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
