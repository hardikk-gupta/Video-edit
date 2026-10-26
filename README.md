# Video editing with motion graphics

The playbook for making premium, motion-designed videos with an AI agent: how we edit, how we design,
what we learned, and the code that does it. Any agent (Claude Code, Codex, Cursor, …) should be able to read
this repo and produce the same kind of video.

**No videos live here.** Footage, voice-overs, renders and client images stay in the chat or tool where the
work happens. This repo holds only methods, rules, references and code.

## Start here

| Read | What it gives you |
|---|---|
| [AGENTS.md](AGENTS.md) | The operating manual: the brief contract, the hard rules, the step-by-step loop. Read first. |
| [instruction.md](instruction.md) | Current taste, reference research, and required repo updates after every video, revision and feedback round. |
| [docs/01-inputs-and-modes.md](docs/01-inputs-and-modes.md) | What the person gives you (footage or storyline, always references) and what to do in each case. |
| [docs/02-pipeline.md](docs/02-pipeline.md) | Every step, from transcript to mastered file, with commands. |
| [docs/03-design-language.md](docs/03-design-language.md) | Current design guidance and the historical system; reuse principles without repeating one brand. |
| [docs/04-motion-rules.md](docs/04-motion-rules.md) | Do's and don'ts for motion, framing and layout, most of them learned from feedback. |
| [docs/05-sound.md](docs/05-sound.md) | Voice cleanup, SFX library, placement, loudness. |
| [docs/06-tools-skills-mcp.md](docs/06-tools-skills-mcp.md) | Every tool, MCP server, skill, library and repo we used, and how. |
| [docs/13-skills.md](docs/13-skills.md) | The skills in `.claude/skills/` (edit formats, pipeline stages, `watch`), where they came from, and where our rules override them. |
| [docs/07-references.md](docs/07-references.md) | Reference videos we studied and what we took from each. |
| [docs/08-environment-gotchas.md](docs/08-environment-gotchas.md) | Things that broke and the fix. |
| [docs/09-review-checklist.md](docs/09-review-checklist.md) | Check before you send any render. |
| [docs/11-pulling-references.md](docs/11-pulling-references.md) | Sourcing real product material (key art, UI, launch films, SVG logos, copy) from the web, and showing the sourcing on screen. |
| [docs/12-split-screen-explainer.md](docs/12-split-screen-explainer.md) | 9:16 split format: the top panel shows and zooms into the real sources of what the speaker says; the bottom panel is the speaker. |
| [docs/10-feedback-log.md](docs/10-feedback-log.md) | Version history of the first project with Hardik's feedback, in order. Learn the taste from it. |
| [toolkit/](toolkit/) | The Remotion project: grid engine, scenes, captions, pills, Hairline explainers, SFX, scripts. |
| [projects/](projects/) | One folder per finished video: brief, transcript, edit decisions, scene timeline. |

## The short version

1. Get the brief: footage **or** a storyline/script, **plus references** (Pinterest, videos, images). No references, ask.
2. No footage? Write the script, get the voice (ElevenLabs or another TTS; if you can't generate it, the person does).
3. Transcribe with word timings. Cut the talk down to the story. Clean the voice.
4. Study every reference frame by frame. Write down what to take from each, then **merge** them into one system.
5. Choose natural type and a deliberate layout from those references. Build in Remotion; use grids,
   explainers or transitions when they help the story, rather than repeating a card template.
6. Render stills at key moments, review against [docs/09-review-checklist.md](docs/09-review-checklist.md), fix, then render.
7. Master to -14 LUFS, compress, send in chat. Log what you learned here.

Maintained by Hardik Gupta. Update rule: after every video, revision or piece of feedback, update the relevant doc,
append to [docs/10-feedback-log.md](docs/10-feedback-log.md) and [CHANGELOG.md](CHANGELOG.md) in the same commit.
