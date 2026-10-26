# Claude edits this reel

**Status: draft v2 rendered for creator review.**

Hardik's 18.875-second take says Claude edited the video, then promises a clearer explanation than private repos and methods. The edit keeps one continuous take and maps that story to a speech-driven 9:16 split: his face below; Hairline line drawings and concise labels above.

The supplied split-screen reference informs the layout only. The clip names no GitHub repo and makes no verifiable count or feature claim, so the edit uses no fetched screenshots or extra product facts.

## Decisions

- Original 720×1280 source retained from 0.34s to 18.44s; cut-audit flags: zero.
- 1080×1920, 30 fps, 18.11s output.
- Hairline exploded app → commit path → vault, followed by Plan / Cut / Frame / Caption.
- Measured presenter crop, Inter word-timed caption pill at the seam, no music, very quiet reveal sound.
- The “no one is telling…” phrase remains the speaker's opinion.

See [the project instructions](instructions.md) and [the asset plan](asset-plan.md). Draft media and source footage stay out of Git.

## Validation

- Remotion TypeScript check passed.
- Cut audit: 1 continuous cut, 0 flagged.
- Sampled frame checks and second-model review caught and fixed label/diagram collisions, opening captions over the presenter's face, and a title too close to the top edge.
- Draft measures 18.133s on both streams, −13.86 LUFS and −1.72 dBTP. Second-model frame review and creator feedback are pending.
