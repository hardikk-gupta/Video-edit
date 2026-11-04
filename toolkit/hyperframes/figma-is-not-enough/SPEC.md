# SPEC: "Only learning Figma? You're dead." (storyline A, "The desk")

GOAL:    a design newcomer stops treating Figma as the career, and goes to train their taste and UX judgment,
         then comments DESIGN.
OUTPUT:  HyperFrames 0.9.11, 1080 x 1920, 30 fps. Faceless VO (Hardik), captions burned in.
TIME:    46 s x 30 = 1380 frames. The VO is the clock (projects/2026-11-04-figma-is-not-enough/script.md).
LOOK:    ground: a self-healing cutting mat, #2F6B55, a 1 px grid every 36 px at 16% white and every 180 px at 30%,
           a 45° guide at 8%, mat texture 4% noise. Top-down only, never a perspective void.
         objects cast one light from the upper left: shadow 0 14 px, blur 28 px, 0.32 black; papers lift to 0 26/44/0.38.
         paper: #FAF8F2 with 3% fibre grain; sticky notes #FFE36E, square, 2° random tilt.
         laptop: silver #D7D9DC aluminium, 18 px black bezel, screen radius 14 px.
         big lines: label-maker tape, black #151515, white embossed caps, Archivo Black 64-92 px, tracking +2%,
           at most 5 words a strip, slightly tilted (−3° to 3°).
         handwriting: Caveat 600, 44-64 px: white paint marker #F4F1E8 on the mat (red on the green mat is 1.6:1, unreadable,
           found by `check`), red pen #E0362C only on paper, prints and screens. Accent = red ONLY (circles, ticks, the
           heart line, "DEAD", DESIGN), one focus per shot.
         UI text inside screens: Inter 400/700 at its real size. Captions: one word on black tape at y 1210-1290.
OBJECTS: the laptop (bezel, hinge shadow, keyboard edge visible when pulled back); printed screenshots with a white
         border and torn tape corners; sticky notes; a red felt-tip line; Figma's toolbar as physical keycaps; a
         chalk-white head outline drawn on the mat; a phone (black slab, 40 px radius) showing the built screen.
MOTION:  camera: pushes and pulls only, on power3.inOut, 18-24 frames; never rotates over 4°.
         objects: dealt/slid in from off-mat on power4.out 10-14 frames, landing with a 2-frame 3% squash.
         tape: printed out letter by letter (2 frames a letter), then pressed (scaleY 1.04 → 1, 4 frames).
         pen: strokes draw on with stroke-dashoffset, 8-14 frames a stroke.
         One hero move per shot; secondary moves at 50-70% travel, 4-6 frames later; the rest holds still.
SHOTS:   see STORYBOARD.md (12 shots, one per VO line).
BANNED:  the hyperframes defaults (dark void, glow, particles, purple gradients, glass cards, cream paper + serif +
         mono labels + pill chips, everything centred, fade-and-slide-up everywhere, three cards in a row, corner HUD
         labels, docked logo) and, from our last films: a card above with a mascot below every beat; the same
         entrance on every shot; text that drifts after it lands.
QA:      frame 0 reads on mute (canvas + tape + flatline); every tape ≤ 5 words, ≥ 64 px; all text inside 168-1330 px;
         one red focus per shot; the Figma Make capture readable; "0 results" readable; captions match the VO.
