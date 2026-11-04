# Storyboard v1 — One connected design map

**Runtime:** about 55 seconds  
**Canvas:** 9:16. Upper 58% is the visual map; lower 42% is Hardik speaking. Footage has not been supplied yet, so the lower panel is a placeholder.  
**Story rule:** one map, one route, one flow. The camera travels along the same vermilion line for the entire reel. No unrelated scenes, card resets, or visual detours.

## The one-map storyline

The map begins as a Figma frame. The same pencil line leaves that frame, becomes a user flow, collects the questions a designer must answer, passes through a small reference board, enters an AI coding-agent lane, then returns to a human decision. The final pullback shows that Figma is one useful node in a larger design practice.

Every storyboard frame below is a closer view of that same map. The small panel drawings in storyboard.svg are original illustrative diagrams, not real product screenshots.

## Beat map

| Time | Script line | What the image shows | Motion that carries the flow |
|---|---|---|---|
| 0:00–0:04.5 | L1 · “Figma is useful. But knowing Figma isn't the same as knowing design.” | One Figma-like artboard is drawn on warm paper. A cursor completes a button; the route leaves the frame and ends at a large handwritten “Why?” The map makes the gap visible: tool skill ends, design judgment begins. | Begin with the cursor; the vermilion route draws out of the artboard toward “Why?” |
| 0:04.5–0:11.2 | L2 · Hardik's introduction | The camera follows the route through two simple outline marks: an experience path and a screen. “AI / DESIGN / LIFE” are attached as destinations on the same line, not as a bio card. Hardik remains visible below. | Route continues without resetting. The two outline marks draw on as it passes. |
| 0:11.2–0:15.3 | L3 · “Figma helps you explore ideas, map flows, and think together.” | The Figma node opens into a compact working board: three idea notes connect into one user flow. One note moves, the flow updates, and the artboard remains visible as the starting point. | Camera tracks along the existing path; the idea notes grow from its next node. |
| 0:15.3–0:24.5 | L4 · “What problem is this screen solving? What does someone need next? Why is this button here?” | The flow becomes one original illustrative interface. Three questions appear beside the actual elements they refer to: problem, next step, button purpose. A single route follows the user through the interface. | The path draws through the screen; each question is revealed at its matching element. |
| 0:24.5–0:32.8 | L5 · “That takes UX thinking and judgment. You can sharpen your taste by studying references…” | The route arrives at three source thumbnails. One shared detail is circled across them, then the flow continues through a “why does this work?” decision. Real references are to be selected and credited in the project notes before any are used. | The same line connects the thumbnails; a pencil mark compares one choice, then returns to the main route. |
| 0:32.8–0:43.0 | L6 · Claude Code, Codex, and Cursor can help make a prototype | The chosen flow moves into a clean implementation lane. A short prompt becomes code marks, then the code resolves into a working-looking prototype of the same screen. Agent names appear as plain labels; no invented product UI or capability claim. | The route passes through the names, turns into code, and resolves into the already-seen interface. |
| 0:43.0–0:49.2 | L7 · “You still choose the direction, pick the references, and judge whether the result works.” | Three prototype options appear as branches from the same flow. A human pencil selects one and checks it against the original problem. The chosen option reconnects to the main route. | One branch is traced and kept; the others stay faint. The line returns to the central map. |
| 0:49.2–0:55.0 | L8 · “So learn Figma. Just don't stop there. Learn to observe, question, and decide. Stay curious.” | The camera pulls back to reveal the full map. Figma remains clearly visible as one node. The route ends at three large words: **OBSERVE · QUESTION · DECIDE**. Hardik remains in the lower panel. | Slow pullback follows the same route; final words draw on in sequence and hold for the sign-off. |

## Persistent layout

- Hardik appears once, in natural colour, in the lower panel. No face crop can be finalized until footage is supplied.
- The map occupies the full upper panel; no screen inside another card.
- Captions are planned as short English karaoke groups at the seam. Exact timing and placement wait for the recorded delivery and face geometry.
- The route, node markers, question marks, and original interface are drawn elements. Only the reference thumbnails need external sources.

## Sound plan

- Original spoken voice is the lead.
- No music is planned.
- A few quiet, licensed effects may follow visible causes: pencil line draw, note landing, code resolving, final decision mark. Select exact sounds from the repo's CC0 sfx-kit after the motion timings exist; no effect will be added just to decorate a cut.

## HyperFrames plan

- One 1080×1920 root composition, with one persistent presenter track and one continuous SVG map track.
- Use data-timed media and one registered, paused GSAP timeline. Every motion must be seekable and deterministic.
- Build the map's settled layout first; then animate nodes and camera movement along the route.
- Use continuous camera moves as transitions between beats. Keep the map path visibly connected at every handoff.
- Run HyperFrames lint, inspect, and validate before rendering. The source footage, reference assets, and voice are not available yet.

## Reference and asset status

- Hardik provided no design-reference video or image for this topic.
- The repo's previous split-screen explainer and the HyperFrames house rules inform the 58/42 layout and deterministic motion, but their exact visual styles are not copied.
- The attempted live requests to Figma, Anthropic, OpenAI, and Cursor returned proxy 403 responses. No external page or image was downloaded or represented as reviewed.
- The storyboard's reference thumbnails are placeholders until real references can be accessed and checked. The rest of the imagery is original explanatory artwork.
