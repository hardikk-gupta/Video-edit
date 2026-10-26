# CLAUDE.md

Read [AGENTS.md](AGENTS.md) first. It is the model-agnostic operating manual for this repo; everything a
Claude Code session needs is there and in `docs/`.

Also read [instruction.md](instruction.md) and follow its "Start here" steps (skills index in
[docs/13-skills.md](docs/13-skills.md); watch every video first with the `watch` skill in `.claude/skills/`): it defines the current taste guidance, reference research,
and required updates after every video, revision and feedback round. Older examples are not a fixed brand.

Update rule: after every action (a video, a piece of feedback, a new technique), in the same commit, update
the doc that is now wrong, append to `docs/10-feedback-log.md` if Hardik gave feedback, and append to
`CHANGELOG.md`. Never commit footage, voice-overs or renders.
