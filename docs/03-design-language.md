# 03 · Design language

The system from the first project (v3, approved as "cool enough"). It merges two references: the Smart Studios
grid reel and the Jitter "Showcase" template ([07-references.md](07-references.md)). Treat it as the default
until a brief's references say otherwise. When they do, merge, don't replace.

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

Palette discipline: black, white, gray, one red, one slate. If the person gives brand colours, swap `RED` and
`SLATE` and keep the rest.

## Type

| Family | Role | Rules |
|---|---|---|
| **Anton** | headlines, chapter titles, big numbers (8AM, 24H), pills | Uppercase, line-height 0.98, 100–250px. Two or three lines; one accent line in `RED`. Each line rises from its own mask. |
| **Inter** 400–700 | UI cards, sentences, captions | Tight tracking (-2.5% of size). Sentences in `GRAY` with key words in `WHITE` and a 3px dashed red underline. |
| **Space Mono** 400/700 | frame furniture, labels, figure captions | 13–18px, sentence case or as written ("Fig. 03 — the belt keeps moving", "Frame 05"). |

Fonts ship in `toolkit/public/fonts/` (Anton and Space Mono via `@fontsource`, Inter from the system). Load them
with `FontFace` + `delayRender` so no frame renders before they're ready.

## The grid

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
