// edit-with-claude.js: Clawd's performance for projects/2026-11-02-edit-with-claude (1080×1920, video time = t).
// One continuous shot on a paper stage. Remotion composites the hook, UI cards, captions and sound on top
// (toolkit/src/EditWithClaude.tsx), so this layer has no text. Beats follow the script in the project README.
(() => {
  const G = 1450;             // ground line (screen px); captions sit below it in Remotion
  const U = 30, X0 = 540;     // Clawd's size and home position

  // A cinematic night stage (Hardik, 2026-11-02: "cinematic type" background): deep indigo, haze up top,
  // one warm spotlight cone onto Clawd's mark, a pool of light on the floor, dust drifting in the beam.
  const NIGHT = '#16132A', HAZE = '#2B2752', FLOOR = '#0E0C17', WARM = '#FFD9A0';
  // The paper itself is night-coloured (makePaper runs at setup, after this file loads): a full-frame wash for the
  // background sometimes fails to land under software GL and leaves a pale frame.
  PAL.paper = NIGHT;
  function stage(t, sx) {   // sx: where the follow spot points (it trails Clawd)
    boilSeed('bg');
    paint(ellPts(W / 2, 520, 980, 760, 30, 6), { wash: HAZE, washOp: 120, ink: null });
    paint(ellPts(W / 2, 1180, 760, 360, 30, 6), { wash: '#3A2C4E', washOp: 90, ink: null });
    boilSeed('floor');
    paint(rectPts(-80, G - 8, W + 160, H - G + 120, 2), { wash: FLOOR, ink: null });
    inkLine([[-40, G - 6], [W * .35, G - 10], [W * .7, G - 5], [W + 40, G - 8]], .8, '#4A4370', 'ink', .5);
    boilSeed('beam');
    const flick = 1 + .03 * Math.sin(t * 7.3) * Math.sin(t * 2.1);
    const tx = X0 + (sx - X0) * .35;   // the lamp hangs above centre and pivots: its top moves a third as far
    paint([[tx - 70, -60], [tx + 70, -60], [sx + 330, G + 10], [sx - 330, G + 10]], { wash: WARM, washOp: 22 * flick, ink: null });
    paint([[tx - 30, -60], [tx + 30, -60], [sx + 190, G], [sx - 190, G]], { wash: WARM, washOp: 16 * flick, ink: null });
    boilSeed('pool');
    paint(ellPts(sx, G + 34, 360, 74, 32, 3), { wash: '#C98A55', washOp: 95, fill: '#E8AA38', fillOp: 70, bleed: .25, tex: .5, border: .2, ink: null });
    glow(sx, G - 140, 470 * flick, '#FFC98A', .42);
    glow(sx, G + 30, 260, '#FFB070', .35);
    boilSeed('dust');
    for (let i = 0; i < 26; i++) {   // dust in the beam, each on its own slow drift
      const k = frac(hash(i) + t * (.025 + .02 * hash(i + 9))), y = lerp(G - 40, 120, k), half = lerp(330, 70, k / 1.05);
      const cx = lerp(sx, tx, k);
      const x = cx + (hash(i + 40) * 2 - 1) * half * .8 + 14 * Math.sin(t * .7 + i);
      glow(x, y, 7 + 9 * hash(i + 70), '#FFE7C2', .5 * Math.sin(Math.PI * k));
    }
  }

  const hop = (t, t0) => jump(t, t0, t0 + .32, 1.4);
  const sum = (...ps) => ps.reduce((a, p) => { for (const k in p) a[k] = (typeof p[k] === 'number' && typeof a[k] === 'number') ? a[k] + p[k] : p[k]; return a; }, {});

  // Main Clawd ----------------------------------------------------------------------------------------------
  const MOODS = [[0, 'excited'], [4.5, 'happy'], [5.15, 'confused'], [6.3, 'determined'],
    [7.7, 'excited'], [9.0, 'happy', { lookY: -.8 }], [11.0, 'proud'],
    [12.75, 'thinking', { lookY: -.75 }], [15.6, 'starstruck'],
    [18.15, 'idea'], [20.6, 'nervous', { lookY: -.6 }], [22.45, 'relieved'],
    [23.75, 'determined'], [26.2, 'excited'], [28.0, 'cool'],
    [29.6, 'nervous', { lookX: -.8 }], [32.9, 'surprised'], [33.6, 'happy'],
    [35.15, 'proud'], [37.2, 'thinking', { lookY: -.7 }], [38.4, 'idea'], [39.4, 'starstruck'],
    [40.55, 'excited'], [43.3, 'love']];
  const HATS = [[0, null], [12.62, 'headphones'], [18.02, null], [23.62, 'hard'], [29.4, null], [35.02, 'wizard'], [40.42, 'party']];
  const hatAt = t => { let h = null; for (const [a, v] of HATS) if (t >= a) h = v; return h; };
  const HOPS = [7.75, 12.6, 18.0, 23.6, 35.0, 40.4];

  // v2: one move per step, each tied to a UI event in EditWithClaude.tsx (same times, same screen x):
  // folders land at x 250/540/830; the scan line and the playhead travel 260→820 on the same smoothstep as stroll().
  const MOVES = [[2.45, 4.3, 1260, X0],
    [8.15, 8.65, X0, 250], [8.85, 9.3, 250, X0], [9.45, 9.9, X0, 830], [10.45, 11.3, 830, X0],   // 1 · under each folder
    [12.95, 13.4, X0, 260], [13.4, 15.5, 260, 820], [16.0, 16.9, 820, X0],                        // 2 · walks with the scan
    [20.75, 21.55, X0, 790], [22.6, 23.3, 790, X0],                                               // 3 · goes to tap Approve
    [24.0, 24.55, X0, 260], [24.6, 28.9, 260, 820],                                               // 4 · walks with the playhead
    [29.45, 30.15, 820, 700], [34.65, 35.3, 700, X0]];                                            // 5 · pushed aside, comes back
  function heroX(t) {
    let x = 1260, w = null;
    for (const m of MOVES) { if (t >= m[0]) { const s = stroll(t, m[0], m[1], m[2], m[3], U); x = s.x; w = t < m[1] ? s : null; } }
    return { x, w };
  }
  // the operator follows a beat late; before that the light waits on the mark for him to walk into it
  const spotX = t => t < 4.6 ? X0 : .5 * heroX(t - .12).x + .5 * heroX(t - .3).x;

  function hero(t) {
    const { x, w } = heroX(t);
    let pose = {};
    if (w) pose = { view: t < 4.3 ? 'side' : 'q', flip: w.flip, walk: w.walk, dy: w.dy };
    else if (t < 4.48) pose = turn(t, 4.3, 4.48, -.25, 0);
    else if (t > 30.15 && t < 34.65) {   // step 5: watches the reviewer
      if (t < 30.3) pose = turn(t, 30.15, 30.3, -.25, -.125);
      else if (t < 34.5) pose = { view: 'q', flip: true };
      else pose = turn(t, 34.5, 34.65, -.125, -.25);
    }
    const mood = emotions(t, MOODS);
    const arms = {};
    if (t > 4.5 && t < 5.15) { arms.aR = 1.1 + .45 * Math.sin((t - 4.5) * 17); }                            // hello
    if (t > 6.45 && t < 7.45) { arms.aR = lerp(.2, 1.45, backOut(seg(t, 6.45, 6.7))); }                     // "save it": points up
    if (t > 8.5 && t < 10.4) { arms.aL = .9; arms.aR = .9; }                                                  // catching folders
    if (t > 13.4 && t < 15.5) { mood.lookY = -.8; }                                                           // reading the frames above
    if (t > 21.9 && t < 22.45) { arms.aR = lerp(.2, 1.3, ease(seg(t, 21.9, 22.2))); }                       // taps approve
    if (t > 40.6 && t < 45) { arms.aL = 1.2 + .25 * Math.sin(t * 9); arms.aR = 1.2 - .25 * Math.sin(t * 9); }
    let extra = {};
    for (const h of HOPS) if (t > h - .15 && t < h + .9) extra = sum(extra, hop(t, h));
    for (const k of [8.75, 9.35, 9.95]) if (t > k - .1 && t < k + .7) extra = sum(extra, take(t, k, .35)); // each folder lands
    for (const k of [35.45, 36.0, 36.5, 37.0]) if (t > k - .1 && t < k + .6) extra = sum(extra, take(t, k, .25)); // each log row lands
    if (t > 41.3 && t < 42.2) extra = sum(extra, jump(t, 41.4, 41.95, 3));
    if (t > 42.3 && t < 43.2) extra = sum(extra, move('hop', t, 5));
    if (t > 44.0) arms.aR = 1.1 + .45 * Math.sin((t - 44) * 15);                                              // bye
    const o = sum({ ...mood }, pose, arms, extra);
    o.hat = hatAt(t);
    clawd(x, G, U, o);
  }

  // The reviewer: a second Clawd in a fedora (step 5) ---------------------------------------------------------
  function reviewer(t) {
    if (t < 29.5 || t > 35.2) return;
    const u = 20, inn = stroll(t, 29.5, 30.7, -180, 290, u), out = stroll(t, 34.0, 35.2, 290, -200, u);
    const x = t < 34 ? inn.x : out.x;
    let pose;
    if (t < 30.7) pose = { view: 'side', walk: inn.walk, dy: inn.dy };
    else if (t < 30.85) pose = turn(t, 30.7, 30.85, .25, .125);
    else if (t < 33.85) pose = { view: 'q' };
    else if (t < 34.0) pose = turn(t, 33.85, 34.0, .125, -.25);
    else pose = { view: 'side', flip: true, walk: out.walk, dy: out.dy };
    const mood = emotions(t, [[29.5, 'suspicious'], [31.2, 'thinking', { lookX: .8 }], [32.35, 'happy']], { take: .7 });
    let extra = t > 32.35 && t < 33.2 ? jump(t, 32.45, 32.8, 1.6) : {};
    const o = sum({ ...mood }, pose, extra, { seed: 7, boilKey: 'reviewer' });
    o.hat = 'fedora';
    clawd(x, G, u, o);
  }

  function main(t) {
    stage(t, spotX(t));
    reviewer(t);
    hero(t);
  }
  shots([[0, main]]);
})();
