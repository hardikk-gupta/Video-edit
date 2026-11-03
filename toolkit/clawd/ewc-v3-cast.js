// ewc-v3-cast.js: Clawd as a cut-out cast member for "Editing with Claude" v3 (projects/2026-11-02-edit-with-claude).
// v3 drops the stage: every scene is full-bleed UI or paper made in Remotion, and Clawd is a small character placed
// INTO it (sitting on a ledge, popping out of a folder, watching, waiting for a stamp, writing in the log). This file
// paints only Clawd, on a transparent 640×640 canvas, timed to video time; Remotion places each clip
// (toolkit/src/EditWithClaude.tsx, CAST). Render: toolkit/clawd/setup_cast.sh, then --png per clip range.
(() => {
  // ---- keyable output: flat chroma-green paper, no grain (toolkit/clawd/key_cast.sh keys it to alpha) ----
  // A truly transparent canvas doesn't work: p5.brush's watercolour fills blend against "nothing" and leave white blots.
  const KEY = '#00FF00';
  PAL.paper = KEY;
  makePaper = function () { const g = createGraphics(W, H); g.pixelDensity(1); g.background(KEY); return g; };
  makeGrain = function () { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); return c; };

  const U = 24, X = 320, G = 600;   // body 240 px wide; feet at y 600. Sitting: body bottom (G - 2U = 552) is the ledge.
  const sum = (...ps) => ps.reduce((a, p) => { for (const k in p) a[k] = (typeof p[k] === 'number' && typeof a[k] === 'number') ? a[k] + p[k] : p[k]; return a; }, {});
  // sitting on a ledge: no ground shadow, legs dangle and kick slowly (the walk cycle, slowed, reads as swinging feet)
  const sit = (t, rate = .35) => ({ noShadow: true, walk: t * rate });
  const breathe = t => ({ sq: .025 * Math.sin(t * 2.4) });

  // a pencil held at the arm tip (arm space: x runs out along the arm)
  const pencil = (u, sw) => {
    paint(rectPts(-.4 * u, -3.8 * u, .8 * u, 4.4 * u, u * .03), { wash: '#E8AA38', washOp: 255, ink: PAL.ink, sw: sw * .6 });
    paint([[-.4 * u, .6 * u], [.4 * u, .6 * u], [0, 1.7 * u]], { wash: '#F3D9B8', washOp: 255, ink: PAL.ink, sw: sw * .6 });
  };
  // a magnifying glass for the reviewer
  const glass = (u, sw) => {
    paint(rectPts(-.25 * u, -.2 * u, .5 * u, 2.2 * u, u * .03), { wash: '#6B4A33', washOp: 255, ink: PAL.ink, sw: sw * .6 });
    paint(ellPts(0, -1.9 * u, 1.9 * u, 1.9 * u, 24), { wash: '#CFE6F2', washOp: 170, ink: PAL.ink, sw: sw * .9 });
  };

  // ---- the clips, in video time (each one is one shot; Remotion shows it only inside its window) ----
  // C1 2.9–7.6  the intro: sits on the paper strip, thinks about "the process", has the idea at "save it"
  function c1(t) {
    const mood = emotions(t, [[2.9, 'thinking', { lookX: -.6, lookY: -.3 }], [4.9, 'confused', { lookX: -.8 }], [6.05, 'idea']]);
    let arms = { aL: .2, aR: .2 };
    if (t > 3.2 && t < 5.9) arms.aR = 1.15;                                                     // hand to chin, thinking
    if (t > 6.05) arms.aR = lerp(.2, 1.5, backOut(seg(t, 6.05, 6.3)));                          // points up: save it
    clawd(X, G, U, sum(mood, sit(t), breathe(t), arms, take(t, 6.05, .5)));
  }
  // C2 9.75–12.5  pops up out of the folder, looks around, waves at "Claude Code"
  function c2(t) {
    const up = backOut(seg(t, 9.8, 10.15));
    const mood = emotions(t, [[9.75, 'surprised'], [10.4, 'excited'], [11.4, 'happy']]);
    let arms = { aL: lerp(-.3, .9, up), aR: lerp(-.3, .9, up) };
    if (t > 11.3) arms.aR = 1.1 + .45 * Math.sin((t - 11.3) * 16);
    clawd(X, G + (1 - up) * 260, U, sum(mood, { noShadow: true }, arms, take(t, 10.15, .7)));
  }
  // C3 12.55–17.9  headphones on, watching the frames go past, starstruck when the transcript lights up
  function c3(t) {
    const mood = emotions(t, [[12.55, 'thinking', { lookY: -.7, lookX: .3 }], [14.2, 'determined', { lookY: -.6, lookX: -.4 }], [15.7, 'starstruck']]);
    clawd(X, G, U, sum(mood, sit(t, .25), breathe(t), { hat: 'headphones', aL: .25, aR: .25, lookX: .6 * Math.sin((t - 12.55) * 1.6) }, take(t, 15.7, .5)));
  }
  // C4 17.95–23.5  waits nervously while the storyboard is drawn; relieved when the stamp lands; small hop
  function c4(t) {
    const mood = emotions(t, [[17.95, 'thinking', { lookX: .7, lookY: -.5 }], [20.1, 'nervous', { lookX: .8, lookY: -.4 }], [22.35, 'relieved'], [22.9, 'excited']]);
    let arms = { aL: .2, aR: .2 };
    if (t > 20.1 && t < 22.3) { arms.aL = .5 + .1 * Math.sin(t * 9); arms.aR = .5 - .1 * Math.sin(t * 9); }   // fidgeting
    clawd(X, G, U, sum(mood, sit(t, t < 22.3 ? .6 : .3), breathe(t), arms, take(t, 22.35, .9), jump(t, 22.95, 23.3, 1.2)));
  }
  // C5 23.6–29.3  sits on the timeline, eyes follow the playhead, nods along, cool at the end
  function c5(t) {
    const mood = emotions(t, [[23.6, 'determined', { lookY: .4 }], [26.2, 'happy', { lookY: .3 }], [28.1, 'cool']]);
    const nod = Math.max(0, Math.sin((t - 24) * 2 * Math.PI * 1.1)) * .05;
    clawd(X, G, U, sum(mood, sit(t, .3), { lookX: -.8 + 1.6 * seg(t, 24.6, 28.9), sq: nod, aL: .2, aR: .2 }));
  }
  // C6 29.35–34.9  the reviewer: a second Clawd in a fedora with a magnifying glass, suspicious → satisfied
  function c6(t) {
    const mood = emotions(t, [[29.35, 'suspicious', { lookX: .8, lookY: -.3 }], [31.0, 'thinking', { lookX: .9, lookY: -.5 }], [32.4, 'happy']], { take: .7 });
    const peer = 1.05 + .15 * Math.sin(t * 3);
    clawd(X, G, U, sum(mood, breathe(t), { hat: 'fedora', seed: 7, view: 'q', noShadow: true, aL: t < 32.4 ? peer : lerp(peer, .3, seg(t, 32.4, 32.7)), armL: glass },   // L is the front arm in 3/4 view
      take(t, 32.4, .6), jump(t, 32.55, 32.95, 1.4)));
  }
  // C7 35.0–40.35  sits on the open notebook writing the note down, proud at "smarter"
  function c7(t) {
    const mood = emotions(t, [[35.0, 'determined', { lookY: .6, lookX: .5 }], [37.6, 'thinking', { lookY: -.6 }], [38.9, 'proud']]);
    const scribble = t < 37.4 ? .75 + .18 * Math.sin(t * 22) : .5;
    clawd(X, G, U, sum(mood, sit(t, .2), breathe(t), { aR: scribble, armR: pencil, aL: .2 }, take(t, 38.9, .5)));
  }
  // C8 40.4–45  the close: standing, the only time he faces us square on; claps at the send, love, waves bye
  function c8(t) {
    const mood = emotions(t, [[40.4, 'happy'], [42.4, 'excited'], [43.2, 'love']]);
    let arms = { aL: .2, aR: .2 };
    if (t > 42.3 && t < 43.0) { arms.aL = 1.3; arms.aR = 1.3; }
    if (t > 43.8) arms.aR = 1.1 + .45 * Math.sin((t - 43.8) * 15);
    clawd(X, G, U, sum(mood, breathe(t), arms, { noShadow: true }, jump(t, 42.45, 42.95, 2.4)));
  }

  const CLIPS = [[2.9, 7.6, c1], [9.75, 12.5, c2], [12.55, 17.9, c3], [17.95, 23.5, c4], [23.6, 29.3, c5], [29.35, 34.9, c6], [35.0, 40.35, c7], [40.4, 45.1, c8]];
  window.CAST = CLIPS.map(([a, b]) => [a, b]);
  function main(t) {
    for (const [a, b, f] of CLIPS) if (t >= a && t < b) { f(t); break; }
  }
  shots([[0, main]]);
})();
