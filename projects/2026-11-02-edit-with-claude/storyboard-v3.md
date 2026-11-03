# Storyboard v3: "Editing with Claude" (2026-11-03)

Hardik on v2: the sound is just one tap and one bloom everywhere. Clawd walking left and right under the cards reads as a
presenter giving a talk, with a card on his head. He wants a new storyboard in different styles: paper, conversation,
images, the real timeline of how we edit (a screenshot), full-bleed content, and the mascot *sitting on something,
thinking*. Proper SFX (squash, sweep, camera zoom, shutter) from a GitHub library, each placed where it fits.

**Rules for v3**
- Every scene is full-bleed and has its own style. No persistent window, no headline-over-a-card.
- Clawd is a cast member *inside* each scene, small, never the presenter. He never walks across the frame. He sits on
  a ledge, pops out of a folder, wears headphones at the film strip, waits for the stamp, perches on the timeline,
  writes in the log. A second Clawd in a fedora, with a magnifying glass, is the reviewer. He stands square-on to camera only at the end.
- Show real material: frames of our own v1 and v2, the real Remotion Studio timeline of this composition, the reviewer's
  actual findings from v2, and real lines from `docs/10-feedback-log.md`.
- Sound comes from `wyzowl/sfx-kit` (CC0, `vendor/sfx-kit`). Each sound starts at the moment minus its sync point, and
  each one belongs to a visible event. It stays quiet under the voice-over.
- VO is the fluent script (`script.md`, v3). The same times as v1 and v2, so the windows still hold.

| # | Time | Style | What happens | Clawd (cut-out clip) | Sound (sfx-kit id) |
|---|---|---|---|---|---|
| 0 | 0–2.75 | Match cut | Pages flip, "Claude" stays locked, resolves to "Editing with Claude" | — | `mechanical-shutter-light` on flips, `reverse-whoosh-short-soft` into the resolve, `boom-hit-soft` |
| 1 | 2.75–7.5 | Feed + torn paper | Zoom through into a feed of finished reels (our own frames) that scrolls fast and stops. The feed dims, a paper strip slaps on: "Nobody shows the process." A Save pill pops | sits on the paper strip, hand to chin, then points up at "save it" | `move-zoom-in`, `swipe-slow-firm`, `foley-paper-touch` + `impact-medium-soft`, `pop-large-in` |
| 2 | 7.5–12.45 | Paper-cut folder | Whip pan in. Footage, references and an export drop into one clay folder, which squashes on each landing. Clawd pops out. A terminal slides up: `claude` → Claude Code | pops up out of the folder, looks around, waves | `whoosh-medium-medium`, `whoosh-fast-soft` + `impact-light-soft` ×3, `pop-large-bubble`, `keyboard-typing-quick-short`, `keyboard-return-soft` |
| 3 | 12.45–17.85 | Dark film strip | Zoom into the folder. A strip of our own frames runs through a viewfinder, and the shutter fires on each frame. The transcript fills in word by word | headphones on, sitting on the transcript panel, watching | `move-zoom-in`, `mechanical-shutter-light` ×6, `digital-scan-subtle`, `digital-process-subtle` |
| 4 | 17.85–23.45 | Paper desk | Paper slides up. A typed style sheet, a storyboard drawn in pencil with frames taped in, a two-line chat ("Approve?" / "Approved."), then an APPROVED stamp slams down | sits on the storyboard sheet, nervous; relieved at the stamp | `foley-paper-slide`, `keyboard-typing-steady-medium`, `writing-pencil-draw`, `foley-card-touch` ×4, `notification-message-in-soft`, `notification-message-out-soft`, `impact-heavy-firm` |
| 5 | 23.45–29.25 | Real Remotion Studio | Zoom out to a real screenshot of this composition in Remotion Studio, then zoom into its timeline and pan. Callouts land on cuts, captions, motion and sound | perched on the screenshot's top edge, eyes follow the pan | `move-zoom-out`, `move-zoom-in`, `whoosh-slow-soft`, `click-mouse-soft` ×4 |
| 6 | 29.25–34.85 | Conversation / terminal | Whip pan. The reviewer's real v2 findings type out, FAIL, each line gets ticked, PASS. Then a plain-English note and "Done. v2 is ready." | the reviewer Clawd (fedora, magnifying glass) inspects, then hops | `whoosh-fast-medium`, `digital-hacker`, `notification-failure-knock`, `writing-pen-tick` ×3, `notification-success-soft`, `notification-message-out-soft`, `notification-message-in-soft` |
| 7 | 34.85–40.3 | Notebook | A paper notebook, the real feedback-log lines, a new line handwritten. The page turns to the next video, whose first box ("read the log first") gets ticked | sits on the notebook, writing with a pencil, proud at "smarter" | `foley-paper-slide`, `writing-pen-write`, `props-page-turn`, `writing-pencil-tick`, `shimmer-short-soft` |
| 8 | 40.3–45 | System grid → comment | Zoom out to the six scenes as one grid ("the whole system"). "Comment EDIT", typed and sent, posted with a heart | stands below for the only square-on shot; claps at the send, love | `move-zoom-out`, `tone-step-1…5`, `keyboard-letter-soft` ×4, `notification-message-out-clear`, `sting-warm-short` |
