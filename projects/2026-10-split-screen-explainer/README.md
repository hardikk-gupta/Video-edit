# Split-screen explainer: reference study (2026-10-22)

**Status:** reference analysed; waiting for Hardik's footage. No video made yet.
**Brief (Hardik):** a 9:16 video where the top part is motion graphics that follow what he says (e.g. he
mentions a GitHub repo and its stars → the shot zooms to the star count), and the bottom part is him
speaking. Links come from him or from the audio; screenshots are taken by the agent.

## The reference

- Supplied by Hardik as a WhatsApp video, 478×850, 30fps, 49.1s. Creator handle on screen: **@SHAI.HQ**;
  series label "Claude for Designers EP38 (Optimize code)". Subject: the **Ponytail** GitHub repo.
- Method used to study it: 1fps contact sheet (50 frames), 22 full frames at beat times, pixel measurement
  of the panels, and a faster-whisper transcript.

### Transcript (reference)

```
[ 0.00- 2.90] This GitHub repo has 170,000 stars.
[ 3.04- 5.86] It teaches your AI coding agent to write less code.
[ 5.96- 6.86] It's called Ponytail.
[ 7.00- 7.96] The idea is simple.
[ 8.08-11.22] Make your AI agent think more like an experienced developer.
[11.34-19.02] So, instead of building everything from scratch, it looks for simpler solutions, reuses what's
              already existing and avoids unnecessary complexity.
[19.08-24.62] It also reports up to 53% less code and 26% lesser cost in benchmark.
[24.72-26.66] But here's what makes it even more interesting.
[26.72-29.52] It doesn't sacrifice testing to write less code.
[29.52-35.50] It can review your code for bugs, security issue or audit your entire code base to find what needs fixing.
[35.68-40.32] It works with Claude Code, Codex, Cursor, GitHub Copilot and 15 plus other coding agents.
[40.46-42.40] It's completely open source and free to use.
[42.56-44.82] Go ahead to comment Pony and I'll send you the GitHub repo.
```

### Beat map: what was said → what the top panel showed

| t | Said | Top panel | Seam |
|---|---|---|---|
| 0.0 | "This GitHub repo…" | GitHub repo page (Star 171k, About) | series label |
| 1.5–2.9 | "…170,000 stars" | star-history chart, line draws up to 171k | series label |
| 3.0–5.9 | "write less code" | project site before/after: "335 lines → 10 lines" | "write" |
| 6.0 | "It's called Ponytail" | mascot illustration + name label | |
| 8.0–11.2 | "experienced developer" | site section describing the persona; sentence highlighted | |
| 11.3–19.0 | "instead of building… reuses… avoids complexity" | "How it works" ladder; highlight box steps to "Already in this codebase?" etc. | "building", "reuses"… |
| 19.1–24.6 | "53% less code and 26% lesser cost" | benchmark bars; box jumps -53% → -26% | "53%", "26%", "cost" |
| 24.7–29.5 | "doesn't sacrifice testing" | "Half the code. And yet better. 98% / 66%", box on 98% | "testing" |
| 29.5–35.5 | "review… bugs, security… audit" | "The review, rebuilt" 100%/100%, then "Your whole repo, ranked" | "bugs" |
| 35.7–40.3 | "Claude Code, Codex, Cursor, Copilot…" | install docs; boxes on "Claude Code," then "Copilot, Cursor" | |
| 40.5–42.4 | "open source and free" | "#1 Repository of the Day" badge, MIT license chip | "completely" |
| 42.6–44.8 | "comment Pony" | back to the repo page, Star push; chat input typing "Pony"; white "Comment "Pony"" label | CTA |
| 44.8–49.1 | | frame dims; Instagram glyph + @SHAI.HQ | |

### Measured layout

Top margin black 0–110; card x 44–434, y 110–455 (≈9% side margins, ~10px radius, faint border); seam ≈455–478;
speaker 478–850 (≈44% of height), tight and steady. Details and the reusable method:
[docs/12-split-screen-explainer.md](../../docs/12-split-screen-explainer.md).

## Capability check done for this format

- `toolkit/scripts/web_shot.mjs` (Playwright + preinstalled Chromium) captured github.com/remotion-dev/remotion
  at 2× and returned the bounding boxes of the text "66.2k" (Star button at x≈1199,y≈198 and sidebar at
  x≈1000,y≈604, CSS px). Matching by visible text worked; an old GitHub element id did not.

## Not decided yet (Hardik's call)

- His series label, handle and CTA keyword; caption font; whether the speaker panel has jump cuts.
- Which links to use for anything he names (ask if not in the brief or unclear from audio).

## Independent check of the upload in this chat (2026-10-22)

- File: `WhatsApp Video 2026-10-22 at 15.15.46.mp4`, 5,211,172 bytes; 478 × 850, 30 fps,
  49.106458 seconds, video and audio streams.
- SHA-256: `c0997c700c83944681cf760e8c46b93ec8683b4330c787327fe527066494747a`.
- Rechecked with a three-second-interval contact sheet, exact frames at 0/21/24/28/36 seconds, and a
  word-timed faster-whisper `tiny.en` transcript. Audio was decoded for transcription; it was not auditioned.
  Names and claims from speech are reference content, not independently established product facts.
- Speech-to-evidence checks: "53" at ~20.64s → the code-reduction bar is boxed at 21s; "cost" at ~23.54s
  → the cost bar is boxed at 24s; "testing" at ~27.80s → 98% is enlarged and framed at 28s. The movement
  identifies the exact evidence being discussed, rather than substituting a generic graphic.
- The visual region is a square at y 0–478; the bottom speaker region is y 478–850. Thus the file is
  approximately 56/44, not an exact 50/50 split. Its card uses the black margin and internal crop to keep
  focus on one point. The presenter remains the human anchor beneath it.
- The reference speaks of about 170,000 stars. Hardik's 65k example describes how to edit his future
  footage, not a number that should be copied into this reference's transcript.
- Hardik says this reference was AI-edited. Its production toolchain cannot be established from the export;
  the observed layout and speech-driven editing method are the useful reference.
- Current request is analysis first. No edit of Hardik's upcoming footage has been started in this chat.
