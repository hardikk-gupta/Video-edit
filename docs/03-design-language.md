# 03 · Design language

This is an evolving design record, not a fixed brand. Hardik's latest feedback (2026-10-22) supersedes the
old assumption that the first project's palette, fonts and layout should be the default. Read
[instruction.md](../instruction.md) and [the feedback log](10-feedback-log.md) before choosing a direction.

## Current guidance: natural type and composed layouts

- Choose typography from the current story and relevant campaign/reel references. The font used for
  "You log off. They keep going." (Inter) is a positive starting direction: natural sans serif, readable
  weight and spacing. Try that kind of type at headline scale, rather than switching to condensed display
  type merely because a line is large. Inter itself is not a permanent brand requirement.
- The Anton styling of "ALWAYS ON" and "DUET × DOTS" in the retry felt generic to Hardik. Do not reuse it
  as the default headline system. Do not add a decorative cross or VS badge automatically.
- Establish a restrained type scale in the chosen family. Test real words and line lengths at several
  sizes, then select a small number of useful levels. Check the final phone-sized crop, not only 1080 px
  stills. A square insert inside a vertical reel must remain readable in that smaller panel.
- Do not add a tiny pre-header such as "TWO TAKES ON ALWAYS-ON AI" above the actual heading. Meaningful
  hierarchy is not a stack of decorative labels, overlines and counters.
- Compose each beat. Two stacked rounded comparison cards are not the default. Consider grids,
  asymmetry, changes of viewpoint and deliberate negative space. Hardik suggested a 3 × 3 grid with six
  cells occupied and three empty, including one or two comparison cells. Treat that as a useful option,
  not a compulsory replacement template.
- Keep the useful mechanics from earlier work: intentional placement, readable type, whitespace,
  restrained easing and motion that shows the idea. Merge those with the current inspirations.

## Historical v3 system (implementation reference only)

The following records the first project, approved as "cool enough", combining Smart Studios and Jitter
([reference studies](07-references.md)). Its tokens, exact sizes, fonts, grid coordinates and furniture
describe that video. They are available to reuse when justified, not instructions to repeat its look.

## Tokens

| Token | Value | Use |
|---|---|---|
| `BG` | `#0B0B0B` | canvas, Hairline plate |
| `RED` | `#C2220F` | guides, red cells, accent headline line, typed caret, active nodes. **Never on the person.** |
| `WHITE` | `#F2F0EC` | headlines, spoken caption words, dots at guide crossings |
| `GRAY` | `#7A7A7F` | mono labels, secondary copy |
| `DIM` | `#3C3C40` | not-yet-active states (unchecked list items, future nodes) |
| `SLATE` | `#8FA3B8` | statement pills, check circles, "Live"/"New" tags, cursor label |
| `PAPER` | `#ECE9E3` | documents (client brief), attachment chips |
| `GLASS` | `rgba(28,28,30,.94)` + 1px `rgba(255,255,255,.08)` border, 18px radius | UI cards |
| `LINE` | `rgba(194,34,15,.6)`, 1.6px, dash `6 7` | guides |

That video's palette discipline was black, white, gray, one red and one slate. For a new brief, choose a
restrained palette from the current inspirations and subject; do not preserve these colours by default.

## Historical type choices

| Family | Role | Rules |
|---|---|---|
| **Anton** | v3 headlines, chapter titles, big numbers (8AM, 24H), pills | Used uppercase at 100–250px in v3. This is historical, not the current default; the Duet/Dots retry's use was rejected. |
| **Inter** 400–700 | UI cards, sentences, captions | Tight tracking (-2.5% of size). Sentences in `GRAY` with key words in `WHITE` and a 3px dashed red underline. |
| **Space Mono** 400/700 | v3 frame furniture, labels, figure captions | Historical 13–18px labels. Do not repeat tiny pre-headers or decorative metadata in future reels. |

Fonts ship in `toolkit/public/fonts/` (Anton and Space Mono via `@fontsource`, Inter from the system). Load them
with `FontFace` + `delayRender` so no frame renders before they're ready.

## The historical v3 grid

- Frame: 1920×1080. Margins 96px. Guides run between y=96 and y=984 (vertical) and edge to edge (horizontal).
- Five vertical guides and four horizontal guides; coincident guides read as one, which is how a layout has
  fewer columns.
- **Every beat has its own layout** (`Layout = {v: [5], h: [4]}`). On a beat change the guides glide to the
  new layout over 0.8s (`IN_OUT`), and the dots at the crossings swell as they land.
- Content is placed by cell (`CellRef = [vFrom, vTo, hFrom, hTo]`) with `PAD = 40` from every guide. Because
  content is anchored to cells, it moves with the guides.
- The band under the bottom guide (984–1080) holds captions (centre), the chapter index (left) and the
  timecode (right). The top margin holds the top bar.

Layouts used in v3 (x of the inner verticals / y of the middle horizontal):

| Beat | v | h | Notes |
|---|---|---|---|
| Hook | 900, 900, 1380 | 640 | title / face / meta; chips / explainer / red cell |
| Models | 560, 1300, 1300 | 500 | meta + face / title + card / explainer |
| Crazy | 1100, 1100, 1500 | 620 | red title / face / meta; sentence |
| Automation | 600, 1380, 1380 | 560 | face / title / explainer |
| Ch.01 | 1000, 1000, 1440 | 420 | red title / face / meta; cards / red 24H / explainer |
| Ch.02 | 700, 700, 1824 | 520 | red title / wide UI row; explainer / sentence → checklist |
| Ch.03 | 1240, 1240, 1824 | 430 | red title / face; brief + chat / numbered flow |
| Figma | 1360, 1360, 1824 | none | one big canvas card / face + "Done in Figma" |
| Outro | 1240, 1240, 1824 | 640 | big type / face; red EVOLVE. / explainer |

## Building blocks (all in `toolkit/src/Reel.tsx`)

| Block | What it is |
|---|---|
| `GridLines` | Draws the current interpolated layout. |
| `InCell` | Anchors any content in a cell; enters blur-to-sharp + rise, leaves with blur + rise. |
| `RedCell` | A cell that fills red, wiping up from its bottom guide and away upward. Chapter titles sit on red cells. |
| `Display` | Anton headline, per-line mask reveal, staggered 0.08s, optional per-line colour. |
| `Mono` | Space Mono label block, left/right/centre. |
| `Glass`, `Txt`, `U`, `Typed`, `Check` | UI card, Inter text, dashed-underline keyword, typewriter with red caret, slate check circle that draws its tick. |
| `Pill` + `pillAmount` | Statement frame: slate pill with an Anton word, the stage behind blurs 20px and dims 45%. Used to cover chapter changes. |
| `HairFig` | A Hairline isometric line figure, stepped frame by frame (see [06-tools-skills-mcp.md](06-tools-skills-mcp.md)). |
| `FaceTile` | The single live video tile: natural colour, 1.00–1.05× framing, "Cam 01" label and timecode, opens by wiping up. |
| `Imagery` | An image slot that fills a cell; used only with the person's own images. |
| `Chrome` | Top bar (name., project, chapter number, chapter name), chapter index, timecode, "YR26". |
| `Captions` | Word-timed captions in the bottom band; spoken words white, upcoming words dark gray. |
| `Grain` | Static 256px noise tile, offset per frame, `screen` blend at 3.5% opacity. |

## Explainers (Hairline figures used, and why)

| Beat | Figure | Reads as |
|---|---|---|
| "crazy questions" | `query` | a question mark as an object |
| "models of today" / "evolve" | `terrain` | pillars rising: capability, growth |
| "automation helped me" | `slow` | crates riding a belt through a gate |
| "daily brief at 8 AM" | `phosphor` | a dot-matrix screen playing a feed |
| "create one component" | `exploded` | an app window in layers |
| "searches the internet" | `loupe` | a magnifier over a ruled sheet |

Others available: riffle, keyboard, elevator, phone, laptop, terminal, cabinet, branches, vault, lockers,
padlock, patch, dish, router, sieve, rail, plug, drawer, basket, plot, hub, relay, settle, format, rebuild,
stack, turntable. Pick by meaning, not looks.

## UI cards as storytelling

Show the automation happening instead of describing it: a "Brief time" ring that fills to 8AM, a ChatGPT
notification, a 0→24H counter, a checklist that ticks on the spoken words, a toggle that flips on
"component", a search bar typing "best toggle interactions" with results sliding in, a client-brief PDF that
flies into a chat input, a message typed and sent, three Figma screens appearing, a cursor tagged "ChatGPT".
Every card's timing is pinned to the word that motivates it.
