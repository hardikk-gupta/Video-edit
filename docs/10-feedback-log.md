# 10 · Feedback log

Every version, what it was, what Hardik said (lightly cleaned up), and the lesson. Read this to learn the
taste. Newest at the bottom.

## Project: AI automations talk (2026-10-20)

Source: 82s WhatsApp selfie video, 848×478, 60fps, landscape. Hardik talking about three AI automations he uses.

### v1: 9:16 reel in the portfolio's style
- 1080×1920, face card centred, word-by-word captions, chapter tags, sticker callouts, SFX. Styled with the
  portfolio website's DESIGN.md (pixel grid, Geist Pixel, pillar colours) because the session started in that repo.
- **Feedback:** "Will be in the same ratio that it was given, landscape… not the vertical one… I think you are
  rendering into the theme of… the portfolio repo. But I don't want that." Sent two Pinterest references.
- **Lessons:** keep the source ratio; never borrow an unrelated design system; wait for references.

### v2: 16:9, Smart Studios grid + Base44 cards
- Grey canvas, dashed red grid, Anton, red cells, a black-and-white tile, the face filling big cells or full-frame.
- **Feedback:** "This is the work of a beginner motion designer… my face is visible at two places… my face
  block should be always in the smaller block… the text should not be overlapping the guidelines."
- **Lessons:** one small face tile; never two copies; content inside cells; layouts per beat; expo easing,
  not springs.

### v2.1: grid engine rebuild (not sent as final)
- Per-beat layouts with gliding guides, cell-anchored content, captions under the bottom guide, one face tile.
- Overtaken by a new reference before it went out.

### v2.5: Jitter-style 2.5D camera with stock photos
- Black canvas, cards at depth with depth-of-field, camera travel, slate pills, Unsplash photos (phone, sunrise,
  coffee, leaves, desk, laptop).
- **Feedback:** "the random tea, the random morning, that is not something that I am going to put in my
  videos… Why are you not merging two designs?… I will put images every time."
- **Lessons:** no stock imagery; merge references instead of replacing; leave image slots for the person.

### v3: merged system + Hairline explainers
- Grid + Anton + red cells (Smart Studios) on black with glass cards, slate pills, blur, mono furniture (Jitter),
  dashed-underlined sentences (Base44). Hairline figures as explainers (Hardik suggested the repo). First
  pass tinted the face tile red duotone with a halftone screen and punched in 1.15–1.26×.
- **Feedback:** "Please don't make me red in the whole scenario. And the camera should not be zoomed at me so much."
- **Fix shipped:** natural colour, 1.00–1.05× framing, the red-halftone stills of him removed.
- **Verdict:** "This was cool enough."
- **Lessons:** the person is never a graphic element: no tint, no treatment, no tight crop.

### After v3: this repo
- "Only the skills, only the methods… not the videos… so that if I start with some other agent, then it can
  create the same kind of video." References always come with the brief; a storyline alone can be the source;
  voice comes from TTS (ElevenLabs) when there's no footage.

## Project: dots vs Claude Duet insert (2026-10-22)

- Brief: 2–6s, 1:1, show what references can be pulled from the internet; top half of a 9:16 split; don't
  include Hardik. Built a captioned reference board (9 official assets) that splits into a black/cream versus.
- Self-review fixes before sending: key-art crop (cover → contain), dead half-frame in the split, VS pill
  over text, black mismatch on the dots side. See `projects/2026-10-dots-vs-duet/README.md`.
- Feedback: (pending)

## Cross-session feedback: Duet/Dots retry typography and layout (2026-10-22)

Hardik reviewed a separate six-second retry from this chat, following the original comparison and the
uploaded Claude example. This entry records his feedback, not blanket approval of either complete film.

### What worked

- The first screen's composition "sits quite well".
- The natural sans-serif treatment of "You log off. They keep going." is the right direction. Explore
  that kind of type at a larger, natural headline scale; this does not mandate one font forever.
- Relevant subject imagery, research and useful motion belong in the process. Keep the accumulated
  references and lessons from this GitHub library in use across projects.

### What did not work

- The condensed Anton treatment of "ALWAYS ON" and "DUET × DOTS", including the cross, felt like generic
  AI-designed work. The positive comment about the opening composition does not approve its large type.
- The next scene's two vertically stacked rectangular product cards felt formulaic.
- Tiny pre-headers such as "TWO TAKES ON ALWAYS-ON AI" above a heading create the wrong hierarchy.
  Do not keep adding small labels, overlines and metadata as design decoration.
- Repeating the same fonts, layout and brand system across videos is not the goal.

### What to do next time

- Choose a natural family, weight and coherent size scale from the current inspirations. Judge the
  typography at the size people will actually see, including an insert inside a vertical reel.
- Compose more deliberately: consider a 3 × 3 grid with six used cells and three empty ones. Distribute
  Duet/Dots material across relevant cells, with one or two for the comparison. This is an example of
  the desired judgment, not a new template every video must use.
- Hardik will supply inspirations for reels. Independently research recent social campaigns and motion
  work too; record the references, what seems effective, what does not, and the evidence for those judgments.
- Read this repo's previous approvals and rejections, combine relevant influences, and make those
  composition choices proactively rather than waiting for Hardik to specify each cell.
- After creating a video, revising it, and receiving feedback, update the project notes and the affected
  standing guidance, plus this log and the changelog. Fix old rules that conflict with the new lesson.

**Action requested now:** documentation only. Created root `instruction.md` and corrected the standing
guidance; no additional video or video revision was requested or made for this feedback round.

## Brief: split-screen explainer reference (2026-10-22)

- **Hardik's words (paraphrased closely):** the reference splits the screen: the top half is visual motion
  graphics, the bottom half the person speaking. The top half "is following, listening to the instruction,
  and seeing, analyzing what the person is saying"; e.g. if he says a repo "has 65k stars", the shot zooms
  to the 65k stars. If he talks about a GitHub repo, get the link from him or from the audio, take the
  screenshot, and do the rest. First analyse the reference; his footage comes next.
- **Agent interpretation:** a new standing format (Mode E). Speech-driven sourcing and element-level zooms
  are the requirement; the reference's branding is not. Recorded in docs/12 and the project README.
- No video was made in this round.
- Independently checked the actual upload in this chat against frames and a word-timed transcript:
  code bar at 21s, cost bar at 24s, testing statistic at 28s. The upper square occupies about 56% of the
  frame, with the speaker below in 44%. Clarified the lower-panel presenter exception to older small-tile
  rules, link identification, capture dates and factual mismatches. The 65k example is hypothetical;
  the reference says about 170,000 stars. Still analysis only for this request; awaiting this chat's footage.

## Project: jinn → dots / Claude Duet / Grok Bot (2026-10-22)

- **Hardik's brief (close paraphrase):** two copies of the same video, one with the screen pre-divided to show
  the intent; keep the audio; pick either. No white surface: black with motion graphics on top, him below,
  clip moved down so his face is visible. Caption in the centre, suggested as a white label. Graphics must be
  specific to what he says about ChatGPT/OpenAI dots, Claude Duet and Grok's bots. Check the repo for anything
  new to learn. Follow the split-screen reference. He asked for an opinion on the 2s genie opening.
- **Agent interpretation:** applied docs/12; Inter captions in a white seam label; the genie still kept but
  animated and morphed into the card; opinion and three alternatives given in the project record.
- **Feedback on v1:** pending.

### Feedback on v1 (2026-10-22)

- **Hardik's words (close paraphrase):** my face is not visible for much of the video, it's getting cut; most
  of the time my face should be visible. The first 2s ("jo hukum mere aaka") must stay exactly as they are;
  when my face comes in, the graphics should start with dots / Duet / bots. You haven't used the top half
  well: inside it you created another rectangle; don't. When I say we glimpsed the jinn when AI came into the
  picture, show all the AI logos from back then; show dots when I get to dots; you don't need dots and Duet up
  front everywhere. Show the Grok Bot logo too, and all of them in one picture. It looks unprofessional; the
  information is getting cut. In the indoor part with the posters I'm barely visible. I don't want the mails
  kind of stuff, or page text like "Get back to what needs you". Create graphics out of dots and Duet, use the
  whole space. Rework it.
- **Lessons (agent):** (1) the speaker's whole head is non-negotiable: measure head extents across every
  location and size the panel to fit them, even if graphics get less height; (2) never nest a card inside the
  graphics area; graphics are full-bleed; (3) page screenshots/crops read as "information getting cut";
  build motion graphics from brand assets (logos, marks, mascots) and the spoken words instead; (4) keep the
  creator's own opening untouched unless asked; (5) introduce each product only when it's spoken about.
- **v2 shipped** with those changes.

### Feedback on v2 (2026-10-22)

- **Hardik's words (close paraphrase, partly verbatim):** "in the morning… you created such a damn amazing
  video" (the dots vs Duet insert); in the top section, use that grid thing again. In the last frame, dots,
  Claude Duet and Grok Bot "are not properly even aligned. They are not evenly sized." "Why are you using
  swoosh sound effect everywhere? And why are the sound effects so fucking loud? The sound effects are
  supposed to be very supporting… work on the sound effects very precisely. Any other sound effect, I don't
  like." Use the Hairline skill more, like the laptop, to create the graphics. Act like the highest-paid
  editor, from whom perfect typography, scale, sizing and principles are expected.
- **Lessons (agent):** (1) a strict grid (3×2 cells with dashed guides and crossing dots) gives every beat the
  same skeleton, so alignment is structural rather than eyeballed; (2) brand sets must be built as identical
  units: same tile size and radius, names and makers on shared baselines; (3) sound is sparse and quiet by
  default (docs/05 rule); (4) Hairline line figures explain abstract claims (workflow hub, "does it for you",
  "own computer", "24/7") better than UI mocks; size them to their cell, they draw ~60% of their box;
  (5) one type scale per video (here Inter 96/64/44/28).
- **v3 shipped**; Hardik's review of v3: pending.



## 2026-10-22 · Jinn revision: Hairline instead of generated computer art

Hardik rejected the generated laptop-and-cube image and explicitly asked to use the Hairline skill linked
in this repository. His direction: the line drawing should replace that image; generated illustration is
not automatically an improvement. Earlier corrections still apply: original “Jo hukum mere aaka” opening,
whole face visible, full black upper canvas, no inner rectangles or mail/website screenshots, and graphics
introduced on the corresponding speech rather than showing the product trio immediately.

Applied in the Codex Hairline revision (not yet reviewed): existing Hairline laptop animated with the repo's deterministic patch;
measured presenter tracking; earlier AI logo grid; neutral task states without invented counts or model
versions; individual complete Dots mascots; named product beats followed by a recap. Imagegen laptop removed.


## 2026-10-22 · Rework after comparing `jinn-v3.mp4`

Hardik asked which edit was better, then explicitly requested a rework of this session's video. The agent's
comparison favoured the upload's cohesive grid, consistent Hairline illustrations and equally prominent
product tiles; it favoured this session's measured face framing and larger readable graphics. Those are
agent observations, not invented user quotes or blanket approval of the uploaded design.

Applied: combine the upload's visual system with retained face tracking, larger labels and equal identity
tiles; use linework throughout. Keep the original hook and precise spoken cues. Do not mistake technical
framing fixes for completed art direction. The resulting rework is awaiting Hardik's review.

## Repo process (2026-10-26)

- **Hardik's words:** after the skills were installed: "use their process over ours" (close paraphrase of
  "use there process over rights ouss").
- **Agent interpretation:** the installed skills (`reel-edit` and its stages) are now the default process;
  our older docs give way where they differ. His own explicit feedback still overrides a skill (it is his
  direction, e.g. the quiet-SFX rule). Recorded in docs/13 and instruction.md.

## 2026-10-26 · Renderer choice per video

- **User's words:** "every time see which is best for what remotion or hyperframes" (sent while the
  "Claude did" paper-drawer edit was being built in Remotion).
- **Agent interpretation:** no fixed default renderer. At the brief stage, weigh Remotion against
  HyperFrames for that video and record the pick and reason in its `instructions.md`. Table in docs/06;
  step added to instruction.md "Start here".

## 2026-10-26 · "Claude did" teaser v2 → v3

- **User's words (v2):** "it is good enough, but I was supposed to be at the bottom frame, everything was
  supposed to be at the top frame"; "the sound effects, pull the skill for sound effects"; the colour scheme
  "was looking like it was something given by Claude itself… no orangish kind of feel"; "create a mix of
  whiteout edit, paper drawer edit… split screen… caption edit"; add "that person working on laptop kind of
  stuff… a doodle pet kind of stuff that we are currently using"; "show me some zoom effects, zoom cuts…
  omni restyle, do it whatever the way you want".
- **Agent interpretation / rules changed:** speaker in the bottom panel with graphics on top for split beats
  (docs/12 Mode E); sound per `sfx-design` as written (docs/05, docs/13); palette must not echo the subject's
  brand (instruction.md); zoom cuts allowed on full-face lines (AGENTS.md rule 2); mixed formats in one reel
  are fine when each beat's job is clear. "Doodle pet we are currently using" was read as our own hand-drawn
  pet in the Hairline-style line language; if a specific existing mascot was meant, swap it in.
- **Applied in v3:** `toolkit/src/SplitMixWA.tsx`. Review: second model PASS; its "likely" notes (harsh sketch,
  crowded folder labels, hard-cropped push-in) fixed before sending. The user's review: pending.

## 2026-10-27 · "Claude did" v3 → v4

- **User's words:** "is thsi best you can do foret all my instrution give me one best from your side".
- **Agent interpretation:** v3 met the instructions literally but not the bar. Lessons kept for future reels
  (added to docs/04): give a recurring doodle character a job in the story instead of using it as a prop;
  connect beats with motivated transitions (zoom-through, whip pan, pencil wipe) instead of only hard cuts;
  draw doodles on and build type word by word rather than popping finished graphics; never leave the top
  panel as empty white (a quiet texture such as a dot grid); hold a punchline long enough to read (use the
  pause after it).
- **Applied in v4:** `toolkit/src/ClaudeDidV4.tsx`. Second-model review PASS. The user's review: pending.
