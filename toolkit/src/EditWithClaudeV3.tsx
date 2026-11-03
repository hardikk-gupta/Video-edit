// EditWithClaudeV3: "Editing with Claude" v3, 45 s, 1080×1920 (projects/2026-11-02-edit-with-claude, storyboard-v3.md).
// Every scene is full-bleed in its own style (feed, paper-cut folder, film strip, paper desk, the real Remotion Studio,
// a review terminal and chat, a notebook, the system grid). Clawd is a cut-out cast member placed INTO each scene
// (toolkit/clawd/ewc-v3-cast.js → keyed PNGs in public/edits/ewc3/cast), never a presenter. Sound comes from
// wyzowl/sfx-kit (vendor/sfx-kit, CC0): each sound starts at its moment minus its sync point (src/sfxkit.ts).
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, continueRender, delayRender, getInputProps, interpolate, interpolateColors, staticFile, useCurrentFrame} from 'remotion';
import {BOX, BOX_X, ClaudeBox, GAP, PAGES, Page} from './EditWithClaude';
import {KIT} from './sfxkit';

export const W = 1080, H = 1920, FPS = 30, DUR = 45, FRAMES = DUR * FPS;
const NIGHT = '#16132A', DEEP = '#0C0B12', INK = '#1F1E1D', MUTED = '#6E675F', LINE = 'rgba(31,30,29,.12)', CARD = '#FFFCF6';
const PAPER = '#F1E8D6', CLAY = '#C96442', CLAY_DK = '#A84F33', CLAY_ON_DARK = '#EE9A72', LIGHT = '#F4ECE0', LIGHT_MUTED = 'rgba(244,236,224,.6)', GREEN = '#5E9E6B';
const SANS = 'Inter, sans-serif', MONO = '"JetBrains Mono", monospace', HAND = 'Caveat, cursive';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const EO = Easing.bezier(.16, 1, .3, 1), EIO = Easing.bezier(.65, 0, .35, 1);
const ease = (t: number, a: number, d = .45) => interpolate(t, [a, a + d], [0, 1], {...clamp, easing: EO});
const eio = (t: number, a: number, d = .45) => interpolate(t, [a, a + d], [0, 1], {...clamp, easing: EIO});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const useT = () => useCurrentFrame() / FPS;
const P = () => getInputProps() as {noCast?: boolean; t?: number};

// Caveat (OFL) for handwriting on the paper scenes: load before the first frame
const caveat = typeof window !== 'undefined' && typeof FontFace !== 'undefined' ? (() => {
  const h = delayRender('Caveat'), f = new FontFace('Caveat', `url(${staticFile('fonts/caveat-latin-600-normal.woff2')}) format("woff2")`, {weight: '600'});
  f.load().then(() => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
  return true;
})() : false;
void caveat;

// ---------------------------------------------------------------- script (Hardik's VO, the fluent v3 wording)
export const SCRIPT: [number, number, string][] = [
  [0.25, 2.35, 'Editing with Claude.'],
  [2.8, 7.4, 'Everyone edits with Claude right now, but nobody shows the process. This is your final stop, so save it.'],
  [7.6, 12.3, 'Step one. Put your footage, your references and your exports in one folder, and open it in Claude Code.'],
  [12.6, 17.7, 'Step two. Before it edits anything, Claude watches every reference, frame by frame, with a transcript.'],
  [18.0, 23.3, 'Step three. It writes a style sheet and a storyboard, and nothing gets cut until you approve them.'],
  [23.6, 29.1, 'Step four is the edit, with clean cuts, captions on the exact frame, smooth motion and quiet sound.'],
  [29.4, 34.7, 'Step five. A second Claude reviews every frame, and then you give your notes in plain English.'],
  [35.0, 40.1, 'Step six. Every note gets saved, so your next video starts smarter.'],
  [40.4, 44.6, "That's the whole system. Comment EDIT and I'll send it to you."],
];
type Word = {w: string; s: number; e: number; line: number};
const WORDS: Word[] = SCRIPT.slice(1).flatMap(([a, b, line], li) => {
  const ws = line.split(' '), pause = (w: string) => (/[.,:]$/.test(w) ? .22 : 0);
  const weight = ws.map(w => w.replace(/[^A-Za-z0-9']/g, '').length + 2.2);
  const total = b - a - ws.reduce((s, w) => s + pause(w), 0), sum = weight.reduce((s, x) => s + x, 0);
  let t = a; return ws.map((w, i) => { const d = total * weight[i] / sum, o = {w, s: t, e: t + d, line: li + 1}; t += d + pause(w); return o; });
});
// when a word is spoken: wt(2, 'folder') = start of "folder" in line 2 (1-based like SCRIPT rows after the hook)
const wt = (line: number, word: string, nth = 0) => {
  const m = WORDS.filter(w => w.line === line && w.w.replace(/[^A-Za-z']/g, '').toLowerCase() === word.toLowerCase());
  return (m[nth] ?? m[0]).s;
};
const STRESS = /^(Claude|EDIT|one|two|three|four|five|six|save|process|folder|approve|edit|smarter|system)[.,:]?$/i;

// ---------------------------------------------------------------- scenes and their transitions
// [start, end]; a transition of kind K sits centred on each boundary
const S = {hook: [0, 2.75], feed: [2.75, 7.5], folder: [7.5, 12.45], watch: [12.45, 17.85], paper: [17.85, 23.45],
  studio: [23.45, 29.25], review: [29.25, 34.85], log: [34.85, 40.3], end: [40.3, 45.2]} as const;
type Kind = 'zoomIn' | 'whip' | 'paperUp' | 'zoomOut';
const TR: [number, Kind, number][] = [[2.75, 'zoomIn', .5], [7.5, 'whip', .42], [12.45, 'zoomIn', .5], [17.85, 'paperUp', .55],
  [23.45, 'zoomOut', .55], [29.25, 'whip', .42], [34.85, 'paperUp', .55], [40.3, 'zoomOut', .6]];

// a moving thing gets blur by its speed (a stand-in for shutter blur)
const speedBlur = (t: number, a: number, d: number, dist: number, f = eio) => Math.min(18, Math.abs(f(t + 1 / 60, a, d) - f(t - 1 / 60, a, d)) * dist * .22);

// how a scene looks while it leaves (out) or arrives (in) through a transition
const trStyle = (kind: Kind, t: number, at: number, d: number, side: 'in' | 'out'): React.CSSProperties => {
  const a = at - d / 2, k = eio(t, a, d), b = speedBlur(t, a, d, kind === 'whip' ? W : 900);
  if (kind === 'whip') return side === 'out' ? {transform: `translateX(${-k * W}px)`, filter: `blur(${b}px)`} : {transform: `translateX(${(1 - k) * W}px)`, filter: `blur(${b}px)`};
  if (kind === 'zoomIn') return side === 'out' ? {transform: `scale(${1 + 2.2 * k})`, opacity: 1 - eio(t, a + d * .35, d * .5), filter: `blur(${b * .6}px)`}
    : {transform: `scale(${.7 + .3 * k})`, opacity: eio(t, a + d * .3, d * .55)};
  if (kind === 'zoomOut') return side === 'out' ? {transform: `scale(${1 - .35 * k})`, opacity: 1 - eio(t, a + d * .35, d * .5), filter: `blur(${b * .5}px)`}
    : {transform: `scale(${1.35 - .35 * k})`, opacity: eio(t, a + d * .25, d * .55), filter: `blur(${(1 - k) * 6}px)`};
  // paperUp: the new scene slides up over the old, which sinks and darkens a little
  return side === 'out' ? {transform: `translateY(${-k * 160}px) scale(${1 - .05 * k})`, filter: `brightness(${1 - .35 * k})`}
    : {transform: `translateY(${(1 - k) * H}px)`, boxShadow: '0 -30px 80px rgba(0,0,0,.45)'};
};

// ---------------------------------------------------------------- Clawd cut-outs
// Each clip is a keyed 640×640 PNG sequence at 8 fps, named by video frame (t·8). The body's bottom edge sits at
// (320, 552) in the clip, so `ledge` is where he sits. Standing clips have their feet 48 px lower (at 600).
const CAST_RANGES = [[23, 60], [78, 360]];
const Cast: React.FC<{t: number; a: number; b: number; x: number; ledge: number; s?: number; flip?: boolean; style?: React.CSSProperties}> = ({t, a, b, x, ledge, s = 1, flip, style}) => {
  if (P().noCast || t < a || t >= b) return null;
  const n = Math.floor(t * 8 + 1e-6); if (!CAST_RANGES.some(([p, q]) => n >= p && n <= q)) return null;
  return <Img src={staticFile(`edits/ewc3/cast/f${String(n).padStart(5, '0')}.png`)}
    style={{position: 'absolute', left: x - 320 * s, top: ledge - 552 * s, width: 640 * s, height: 640 * s, transform: flip ? 'scaleX(-1)' : undefined, ...style}} />;
};

// ---------------------------------------------------------------- shared bits
const Grain: React.FC<{o?: number}> = ({o = .55}) => <Img src={staticFile('grain.png')} style={{position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover', mixBlendMode: 'multiply', opacity: o}} />;
const Vignette: React.FC<{o?: number}> = ({o = .5}) => <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${o}) 100%)`}} />;
const Kicker: React.FC<{t: number; a: number; n: number; text: string; dark?: boolean}> = ({t, a, n, text, dark}) => {
  const k = ease(t, a + .1, .5);
  return <div style={{position: 'absolute', left: 72, top: 196, display: 'flex', alignItems: 'baseline', gap: 18, opacity: k, transform: `translateY(${(1 - k) * 18}px)`,
    fontFamily: SANS, fontWeight: 600, fontSize: 44, letterSpacing: -1, color: dark ? INK : LIGHT}}>
    <span style={{color: dark ? CLAY : CLAY_ON_DARK, fontVariantNumeric: 'tabular-nums'}}>{n}</span>{text}</div>;
};
const Thumb: React.FC<{src: string; w: number; h: number; r?: number; style?: React.CSSProperties}> = ({src, w, h, r = 14, style}) => (
  <div style={{width: w, height: h, borderRadius: r, overflow: 'hidden', background: '#222', ...style}}>
    <Img src={staticFile(`edits/ewc3/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
);
const Bubble: React.FC<{me?: boolean; k: number; children: React.ReactNode; style?: React.CSSProperties}> = ({me, k, children, style}) => (
  <div style={{alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: 680, padding: '20px 30px', borderRadius: me ? '32px 32px 8px 32px' : '32px 32px 32px 8px',
    background: me ? CLAY : CARD, color: me ? '#FFF6EE' : INK, fontFamily: SANS, fontSize: 38, fontWeight: 500, letterSpacing: -.4, lineHeight: 1.25,
    boxShadow: '0 14px 30px -14px rgba(0,0,0,.45)', opacity: k, transform: `translateY(${(1 - k) * 24}px) scale(${.92 + .08 * k})`, transformOrigin: me ? '100% 100%' : '0 100%', ...style}}>{children}</div>
);

// ================================================================ 0 · hook (match cut, as v2)
const FLIP = 3 / FPS, HOOK_FLIPS_END = 1.5, RESOLVE = 1.55;
const Hook: React.FC<{t: number}> = ({t}) => {
  const idx = Math.min(PAGES.length - 1, Math.floor(t / FLIP) % PAGES.length);
  const page = PAGES[t < HOOK_FLIPS_END ? idx : (Math.floor(HOOK_FLIPS_END / FLIP) - 1) % PAGES.length];
  const push = interpolate(t, [0, RESOLVE], [1.0, 1.1], clamp), settle = ease(t, RESOLVE, .5);
  const slide = ease(t, RESOLVE, .4), lead = ease(t, RESOLVE + .32, .5);
  const boxX = interpolate(slide, [0, 1], [(W - BOX.w) / 2, BOX_X]);
  return (
    <AbsoluteFill style={{background: NIGHT}}>
      {settle < 1 ? <AbsoluteFill style={{transform: `scale(${push})`, opacity: 1 - settle}}><Page p={page} t={t} /></AbsoluteFill> : null}
      <Vignette o={.55 * settle} />
      <div style={{position: 'absolute', left: BOX_X - GAP - 520, top: BOX.y + 10, width: 520, textAlign: 'right', fontFamily: SANS, fontWeight: 600, fontSize: 86,
        letterSpacing: -2.6, color: LIGHT, opacity: lead, transform: `translateX(${(1 - lead) * 30}px)`, lineHeight: '92px', whiteSpace: 'nowrap'}}>Editing with</div>
      <div style={{position: 'absolute', left: boxX, top: BOX.y, transform: `scale(${t < RESOLVE ? push : 1})`, transformOrigin: 'center'}}><ClaudeBox /></div>
    </AbsoluteFill>
  );
};

// ================================================================ 1 · the feed: everyone posts the result
const FEED = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't3', 't6', 't1', 't8', 't2', 't5'];
const Feed: React.FC<{t: number}> = ({t}) => {
  const [a] = S.feed, scroll = interpolate(t, [a, a + 1.35], [1700, 0], {...clamp, easing: EO});
  const dim = ease(t, wt(1, 'nobody') - .15, .5), strip = ease(t, wt(1, 'nobody') + .05, .35), save = ease(t, wt(1, 'save') - .05, .35);
  const cw = (W - 2 * 36 - 2 * 14) / 3, ch = cw * 16 / 9;
  const head = (i: number) => ease(t, a + .35 + i * .12, .45);
  return (
    <AbsoluteFill style={{background: DEEP}}>
      <div style={{position: 'absolute', left: 36, top: 140 - scroll, width: W - 72, display: 'flex', flexWrap: 'wrap', gap: 14,
        filter: `blur(${speedBlur(t, a, 1.35, 1700, ease) + dim * 6}px) brightness(${.62 - .32 * dim})`}}>
        {FEED.map((f, i) => <div key={i} style={{position: 'relative'}}>
          <Thumb src={`feed/${f}.jpg`} w={cw} h={ch} r={18} />
          <div style={{position: 'absolute', left: 16, bottom: 14, fontFamily: SANS, fontWeight: 600, fontSize: 24, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,.6)'}}>
            ▶ {['1.2M', '840K', '2.1M', '96K', '410K', '1.7M', '63K', '920K', '3.4M'][i % 9]}</div></div>)}
      </div>
      <div style={{position: 'absolute', left: 72, right: 72, top: 300, fontFamily: SANS, fontWeight: 600, fontSize: 84, letterSpacing: -3, lineHeight: '90px', color: LIGHT,
        textShadow: '0 8px 40px rgba(0,0,0,.6)'}}>
        {'Everyone posts the result.'.split(' ').map((w, i) => <span key={i} style={{display: 'inline-block', marginRight: 22, opacity: head(i), transform: `translateY(${(1 - head(i)) * 30}px)`,
          filter: `blur(${(1 - head(i)) * 8}px)`, color: w.startsWith('result') ? CLAY_ON_DARK : undefined}}>{w}</span>)}
      </div>
      {/* the torn paper strip that slaps on */}
      <div style={{position: 'absolute', left: 40, top: 880, width: W - 80, height: 210, transform: `rotate(-2.2deg) scale(${lerp(1.25, 1, strip)})`, opacity: strip,
        background: PAPER, clipPath: 'polygon(0% 8%, 4% 0%, 11% 6%, 19% 1%, 27% 7%, 36% 2%, 45% 6%, 53% 0%, 62% 5%, 71% 1%, 80% 7%, 89% 2%, 96% 6%, 100% 1%, 100% 92%, 95% 100%, 87% 94%, 78% 99%, 69% 93%, 60% 100%, 51% 95%, 42% 100%, 33% 94%, 24% 99%, 15% 93%, 7% 100%, 0% 95%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 24px 60px rgba(0,0,0,.5)'}}>
        <Grain o={.08} />
        <span style={{position: 'relative', fontFamily: HAND, fontWeight: 600, fontSize: 104, color: INK, letterSpacing: -1}}>Nobody shows the <span style={{color: CLAY}}>process.</span></span>
      </div>
      <div style={{position: 'absolute', right: 96, top: 640, display: 'flex', alignItems: 'center', gap: 14, background: CLAY, color: '#FFF6EE', borderRadius: 999, padding: '20px 34px',
        fontFamily: SANS, fontWeight: 600, fontSize: 40, opacity: save, transform: `scale(${.4 + .6 * save + .12 * Math.sin(save * Math.PI)}) rotate(${(1 - save) * -12}deg)`, boxShadow: '0 18px 40px rgba(0,0,0,.45)'}}>
        <svg width={28} height={36} viewBox="0 0 22 28"><path d="M2 3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v23l-9-6-9 6z" fill="#FFF6EE" /></svg>Save this</div>
      <Cast t={t} a={2.9} b={7.6} x={300} ledge={884} s={.95} style={{opacity: strip}} />
    </AbsoluteFill>
  );
};

// ================================================================ 2 · one folder (paper-cut)
const FolderBack: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: 0, top: 0}}>
    <path d={`M0 40 a24 24 0 0 1 24 -24 h${w * .3} l34 34 h${w - w * .3 - 82} a24 24 0 0 1 24 24 v${h - 98} a24 24 0 0 1 -24 24 h${-(w - 48)} a24 24 0 0 1 -24 -24z`} fill={CLAY_DK} /></svg>
);
const Folder: React.FC<{t: number}> = ({t}) => {
  const [a] = S.folder;
  const drops: [string, number, React.ReactNode][] = [
    ['footage', wt(2, 'footage'), <div style={{display: 'flex', gap: 6, padding: 10, background: '#111', borderRadius: 12}}>{['s2', 's5', 's8'].map(s => <Thumb key={s} src={`strip/${s}.jpg`} w={80} h={142} r={6} />)}</div>],
    ['references', wt(2, 'references'), <div style={{position: 'relative', width: 230, height: 190}}>{['t4', 't6', 't2'].map((s, i) => <Thumb key={s} src={`feed/${s}.jpg`} w={104} h={185} r={10}
      style={{position: 'absolute', left: i * 62, top: 0, transform: `rotate(${(i - 1) * 8}deg)`, boxShadow: '0 8px 20px rgba(0,0,0,.4)'}} />)}</div>],
    ['exports', wt(2, 'exports'), <div style={{width: 150, height: 190, background: CARD, borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
      <svg width={64} height={64} viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill={CLAY} /></svg><span style={{fontFamily: MONO, fontSize: 22, color: INK}}>final.mp4</span></div>],
  ];
  const FX = 150, FY = 720, FW = 780, FH = 470;              // folder
  const squash = (s: number) => { const e = t - s; return e < 0 || e > .5 ? 0 : Math.exp(-7 * e) * Math.sin(e * 26) * .06; };
  const sq = drops.reduce((acc, [, s]) => acc + squash(s + .32), 0);
  const term = ease(t, wt(2, 'open') - .1, .45), typed = 'claude'.slice(0, Math.max(0, Math.floor((t - wt(2, 'open') - .3) * 14)));
  const welcome = ease(t, wt(2, 'code') - .15, .35);
  return (
    <AbsoluteFill style={{background: NIGHT}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(244,236,224,.07) 2px, transparent 2px)', backgroundSize: '44px 44px'}} />
      <Vignette o={.55} />
      <Kicker t={t} a={a} n={1} text="One folder." />
      <div style={{position: 'absolute', left: FX, top: FY, width: FW, height: FH, transform: `scale(${1 + sq}, ${1 - sq})`, transformOrigin: '50% 100%'}}>
        <FolderBack w={FW} h={FH} />
        {drops.map(([name, s, node], i) => { const k = eio(t, s - .1, .42), x = 60 + i * 250, y = lerp(-900, 70, k);
          return <div key={name} style={{position: 'absolute', left: x, top: y, transform: `rotate(${(i - 1) * 5 + (1 - k) * 25}deg)`, filter: `blur(${speedBlur(t, s - .1, .42, 970)}px)`, opacity: k > 0 ? 1 : 0}}>{node}</div>; })}
        <Cast t={t} a={9.75} b={12.5} x={FW / 2} ledge={150} s={.95} />
        {/* the front flap: paper-cut, over the contents */}
        <div style={{position: 'absolute', left: -14, top: 150, width: FW + 28, height: FH - 150, background: CLAY, borderRadius: 26, transform: 'perspective(900px) rotateX(10deg)', transformOrigin: '50% 100%',
          boxShadow: '0 -6px 0 rgba(255,255,255,.12) inset, 0 30px 60px rgba(0,0,0,.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 46, overflow: 'hidden'}}>
          <Grain o={.08} />
          <span style={{position: 'relative', fontFamily: SANS, fontWeight: 600, fontSize: 52, letterSpacing: -1.2, color: '#FFF3EA'}}>AI Video Editor</span>
        </div>
        {drops.map(([name, s], i) => <div key={'l' + name} style={{position: 'absolute', left: 60 + i * 250, width: 220, top: FH + 22, textAlign: 'center', fontFamily: SANS, fontSize: 32, fontWeight: 500,
          color: LIGHT_MUTED, opacity: ease(t, s + .3, .3)}}>{name}</div>)}
      </div>
      {/* Claude Code in a terminal */}
      <div style={{position: 'absolute', left: 72, right: 72, top: 1250, height: 220, borderRadius: 22, background: '#0B0A0F', border: '1.5px solid rgba(244,236,224,.14)',
        padding: '26px 32px', fontFamily: MONO, fontSize: 30, color: '#E9E3DA', opacity: term, transform: `translateY(${(1 - term) * 60}px)`, boxShadow: '0 30px 60px rgba(0,0,0,.5)', overflow: 'hidden'}}>
        <div><span style={{color: CLAY_ON_DARK}}>~/AI Video Editor</span> <span style={{color: LIGHT_MUTED}}>$</span> {typed}<span style={{opacity: Math.floor(t * 2.5) % 2 ? 1 : 0}}>▍</span></div>
        <div style={{marginTop: 18, border: `2px solid ${CLAY_ON_DARK}`, borderRadius: 12, padding: '14px 22px', opacity: welcome, transform: `scale(${.96 + .04 * welcome})`, transformOrigin: '0 0'}}>
          <span style={{color: CLAY_ON_DARK}}>✻</span> Welcome to <b>Claude Code</b>!<div style={{color: LIGHT_MUTED, fontSize: 24, marginTop: 6}}>cwd: ~/AI Video Editor</div></div>
      </div>
    </AbsoluteFill>
  );
};

// ================================================================ 3 · Claude watches: film strip + shutter, transcript
const STRIP = Array.from({length: 14}, (_, i) => `strip/s${i + 1}.jpg`);
const FW3 = 240, FH3 = 427, GAP3 = 34, STEP3 = FW3 + GAP3;
const SHOTS = [13.15, 13.6, 14.05, 14.5, 14.95, 15.4];   // a frame reaches the viewfinder → the shutter fires
const stripX = (t: number) => {   // the strip moves frame by frame: glides, then stops in the viewfinder for each shot
  let x = 0; for (const s of SHOTS) x += STEP3 * eio(t, s - .28, .28);
  return 540 - FW3 / 2 - x;
};
const Watch: React.FC<{t: number}> = ({t}) => {
  const [a] = S.watch, x0 = stripX(t);
  const flash = Math.max(0, ...SHOTS.map(s => t >= s && t < s + .18 ? 1 - (t - s) / .18 : 0));
  const tr = ease(t, wt(3, 'transcript') - .6, .4);
  const lines: [string, string][] = [['00:02.8', 'Everyone edits with Claude right now,'], ['00:05.2', 'but nobody shows the process.'], ['00:07.6', 'Step one. Put your footage, your references…']];
  const lit = (li: number, wi: number) => t > wt(3, 'transcript') - .4 + (li * 6 + wi) * .07;
  return (
    <AbsoluteFill style={{background: DEEP}}>
      <Kicker t={t} a={a} n={2} text="Claude watches first." />
      {/* film strip */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 470, height: FH3 + 90, background: '#050407'}}>
        {[14, FH3 + 90 - 34].map(y => <div key={y} style={{position: 'absolute', left: x0 % 60 - 60, top: y, width: W + 120, height: 20,
          backgroundImage: 'linear-gradient(90deg, rgba(244,236,224,.35) 0 26px, transparent 26px 60px)', backgroundSize: '60px 20px', borderRadius: 4}} />)}
        {STRIP.map((s, i) => <div key={i} style={{position: 'absolute', left: x0 + i * STEP3, top: 45}}><Thumb src={s} w={FW3} h={FH3} r={6} /></div>)}
      </div>
      {/* viewfinder brackets + flash + timecode */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => { const cx = 540 + sx * (FW3 / 2 + 22), cy = 470 + 45 + FH3 / 2 + sy * (FH3 / 2 + 22);
          return <path key={i} d={`M${cx} ${cy - sy * 46} V${cy} H${cx - sx * 46}`} stroke={CLAY_ON_DARK} strokeWidth={6} fill="none" strokeLinecap="round" />; })}
      </svg>
      <div style={{position: 'absolute', left: 540 - FW3 / 2, top: 515, width: FW3, height: FH3, background: '#fff', opacity: flash * .85, borderRadius: 6}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1010, textAlign: 'center', fontFamily: MONO, fontSize: 28, color: CLAY_ON_DARK}}>
        frame {String(Math.min(6, SHOTS.filter(s => t >= s).length)).padStart(2, '0')} · 00:{String(3 + 3 * Math.min(6, SHOTS.filter(s => t >= s).length)).padStart(2, '0')}.0</div>
      {/* transcript */}
      <div style={{position: 'absolute', left: 72, right: 72, top: 1120, height: 300, borderRadius: 24, background: '#15131D', border: '1.5px solid rgba(244,236,224,.12)', padding: '26px 30px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: MONO, fontSize: 22, color: LIGHT_MUTED}}>transcript.json
          <svg width={330} height={34} style={{marginLeft: 'auto'}}>{Array.from({length: 46}, (_, i) => { const h = 6 + 24 * Math.abs(Math.sin(i * 1.3 + t * 7) * Math.sin(i * .41 + t * 2)); return <rect key={i} x={i * 7.2} y={17 - h / 2} width={4} height={h} rx={2} fill={CLAY_ON_DARK} opacity={.7} />; })}</svg></div>
        <div style={{marginTop: 18, opacity: tr}}>{lines.map(([tc, l], li) => <div key={li} style={{display: 'flex', gap: 20, marginTop: 10, fontSize: 28, fontFamily: SANS, fontWeight: 500}}>
          <span style={{fontFamily: MONO, fontSize: 22, color: CLAY_ON_DARK, paddingTop: 5}}>{tc}</span>
          <span>{l.split(' ').map((w, wi) => <span key={wi} style={{color: lit(li, wi) ? LIGHT : 'rgba(244,236,224,.22)'}}>{w} </span>)}</span></div>)}</div>
      </div>
      <Cast t={t} a={12.55} b={17.9} x={890} ledge={1122} s={.85} />
    </AbsoluteFill>
  );
};

// ================================================================ 4 · paper desk: style sheet, storyboard, approve
const PaperCard: React.FC<{x: number; y: number; w: number; h: number; rot: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, w, h, rot, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: '#FBF6EC', transform: `rotate(${rot}deg)`, boxShadow: '0 2px 0 rgba(0,0,0,.04), 0 22px 40px -18px rgba(70,50,25,.45)', ...style}}>
    <Grain o={.08} />{children}</div>
);
const Tape: React.FC<{x: number; y: number; rot: number; k?: number}> = ({x, y, rot, k = 1}) => <div style={{position: 'absolute', left: x, top: y, width: 70, height: 26, background: 'rgba(236,220,170,.8)', transform: `rotate(${rot}deg) scale(${k})`, opacity: k}} />;
const PaperDesk: React.FC<{t: number}> = ({t}) => {
  const [a] = S.paper;
  const rows: [string, React.ReactNode][] = [
    ['type', <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 38}}>Aa <span style={{fontWeight: 400, fontSize: 30, color: MUTED}}>Inter, two sizes</span></span>],
    ['colour', <div style={{display: 'flex', gap: 10}}>{[PAPER, INK, CLAY, '#E8AA38'].map(c => <div key={c} style={{width: 42, height: 42, borderRadius: 10, background: c, border: `1.5px solid ${LINE}`}} />)}</div>],
    ['pacing', <span style={{fontFamily: SANS, fontSize: 32}}>one idea per beat</span>],
    ['sound', <span style={{fontFamily: SANS, fontSize: 32}}>quiet, where things move</span>],
  ];
  const sbK = ease(t, a + .3, .5), draw = interpolate(t, [wt(4, 'storyboard'), wt(4, 'storyboard') + .9], [1, 0], clamp);
  const tapes = [0, 1, 2, 3].map(i => ease(t, wt(4, 'nothing') - .5 + i * .16, .25));
  const ask = ease(t, wt(4, 'until') - .55, .35), yes = ease(t, wt(4, 'approve') - .45, .35);
  const STAMP = wt(4, 'approve') + .15, stamp = ease(t, STAMP - .12, .14), stampSq = t > STAMP ? Math.exp(-9 * (t - STAMP)) * Math.cos((t - STAMP) * 30) * .08 : 0;
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <Grain o={.1} /><Vignette o={.22} />
      <Kicker t={t} a={a} n={3} text="Style sheet, then storyboard." dark />
      <PaperCard x={72} y={300} w={936} h={420} rot={-1.2}>
        <div style={{position: 'absolute', left: 40, top: 22, fontFamily: HAND, fontWeight: 600, fontSize: 60, color: CLAY}}>style sheet</div>
        {rows.map(([k, v], i) => { const e = ease(t, wt(4, 'style') - .2 + i * .2, .35); return (
          <div key={k} style={{position: 'absolute', left: 40, right: 40, top: 112 + i * 72, height: 64, display: 'flex', alignItems: 'center', color: INK, opacity: e, transform: `translateX(${(1 - e) * 20}px)`,
            borderBottom: i < 3 ? `1.5px dashed ${LINE}` : 'none'}}>
            <div style={{width: 170, fontFamily: MONO, fontSize: 24, color: MUTED}}>{k}</div>{v}</div>); })}
      </PaperCard>
      <PaperCard x={72} y={770} w={936} h={380} rot={1} style={{opacity: sbK, transform: `rotate(1deg) translateY(${(1 - sbK) * 60}px)`}}>
        <div style={{position: 'absolute', left: 40, top: 18, fontFamily: HAND, fontWeight: 600, fontSize: 56, color: CLAY}}>storyboard</div>
        {[0, 1, 2, 3].map(i => { const x = 40 + i * 218, y = 100; return <div key={i} style={{position: 'absolute', left: x, top: y}}>
          <svg width={196} height={236} style={{position: 'absolute', left: -4, top: -4}}><rect x={4} y={4} width={188} height={228} rx={6} fill="none" stroke={INK} strokeWidth={3}
            strokeDasharray={840} strokeDashoffset={840 * draw} style={{filter: 'url(#rough)'}} /></svg>
          <div style={{opacity: tapes[i], transform: `scale(${.9 + .1 * tapes[i]})`}}><Thumb src={`strip/s${[3, 6, 9, 12][i]}.jpg`} w={188} h={228} r={4} style={{filter: 'sepia(.25) saturate(.9)'}} /></div>
          <Tape x={60} y={-12} rot={-4 + i * 3} k={tapes[i]} />
          <div style={{position: 'absolute', left: 4, top: 238, fontFamily: HAND, fontSize: 34, color: MUTED}}>{['hook', 'the folder', 'watching', 'the edit'][i]}</div>
        </div>; })}
      </PaperCard>
      <div style={{position: 'absolute', left: 72, right: 72, top: 1210, display: 'flex', flexDirection: 'column', gap: 16}}>
        <Bubble k={ask}>Storyboard's ready. Approve?</Bubble>
        <Bubble me k={yes}>Approved.</Bubble>
      </div>
      {/* the rubber stamp */}
      <div style={{position: 'absolute', left: 300, top: 860, padding: '14px 40px', border: `8px solid ${CLAY_DK}`, borderRadius: 18, color: CLAY_DK, fontFamily: SANS, fontWeight: 800, fontSize: 92, letterSpacing: 6,
        opacity: stamp * .9, transform: `rotate(-12deg) scale(${lerp(2.2, 1, stamp) * (1 + stampSq)}, ${lerp(2.2, 1, stamp) * (1 - stampSq)})`, mixBlendMode: 'multiply'}}>APPROVED</div>
      <Cast t={t} a={17.95} b={23.5} x={905} ledge={778} s={.85} />
      <svg width={0} height={0}><filter id="rough"><feTurbulence baseFrequency=".04" numOctaves={2} seed={3} /><feDisplacementMap in="SourceGraphic" scale={4} /></filter></svg>
    </AbsoluteFill>
  );
};

// ================================================================ 5 · the real Remotion Studio timeline (this composition)
// studio.png: a 1920×1500 screenshot of Remotion Studio with this composition open at 26.5 s (README v3: how it was taken).
const STUDIO = {w: 1920, h: 1500};
const CALLOUTS: [string, number, number, number][] = [   // label, when, x and y in the screenshot (timeline area)
  ['clean cuts', wt(5, 'cuts'), 0, 0], ['captions on the frame', wt(5, 'captions'), 0, 0], ['motion', wt(5, 'motion'), 0, 0], ['quiet sound', wt(5, 'sound'), 0, 0]];
const STUDIO_SPOTS = (getInputProps() as {spots?: [number, number][]}).spots;
const VP = {x: 40, y: 340, w: 1000, h: 900};   // the viewport the screenshot is filmed through
const Studio: React.FC<{t: number}> = ({t}) => {
  const [a] = S.studio;
  // camera over the screenshot: the whole app (fit to the viewport) → into the timeline → a pan along it
  const zin = eio(t, wt(5, 'edit') + .1, .7), pan = eio(t, wt(5, 'cuts') - .3, wt(5, 'sound') - wt(5, 'cuts') + .6);
  const s0 = VP.w / STUDIO.w, s1 = 1.35, sc = lerp(s0, s1, zin);
  const fx = lerp(STUDIO.w / 2, lerp(560, 1300, pan), zin), fy = lerp(STUDIO.h / 2, 1275, zin);   // focus point in the screenshot
  const left = VP.w / 2 - fx * sc, top = VP.h / 2 - fy * sc;
  // where each callout points in the screenshot: the scene track's first cut, the captions track, the layer tracks, a sound clip
  const spots: [number, number][] = STUDIO_SPOTS ?? [[493, 1306], [880, 1330], [1090, 1218], [1262, 1376]];
  return (
    <AbsoluteFill style={{background: '#0F0F12'}}>
      <div style={{position: 'absolute', left: VP.x, top: VP.y, width: VP.w, height: VP.h, borderRadius: 26, overflow: 'hidden', background: '#1B1B1F', boxShadow: '0 40px 90px rgba(0,0,0,.6)',
        border: '1.5px solid rgba(244,236,224,.12)'}}>
        <div style={{position: 'absolute', left, top, width: STUDIO.w * sc, height: STUDIO.h * sc, filter: `blur(${speedBlur(t, wt(5, 'edit') + .1, .7, 600)}px)`}}>
          <Img src={staticFile('edits/ewc3/studio.png')} style={{width: '100%', height: '100%'}} />
          {CALLOUTS.map(([label, at], i) => { const [x, y] = spots[i], sx = left + x * sc, edge = Math.min(1, Math.max(0, Math.min(sx - 200, VP.w - 200 - sx) / 120)), k = ease(t, at - .1, .35) * edge; return (
            <div key={label} style={{position: 'absolute', left: x * sc, top: y * sc, transform: 'translate(-50%, -100%)', opacity: k}}>
              <div style={{transform: `translateY(${(1 - k) * 16}px) scale(${(.8 + .2 * k) / Math.max(1, sc)})`, transformOrigin: '50% 100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{background: CLAY, color: '#FFF6EE', borderRadius: 14, padding: '10px 20px', fontFamily: SANS, fontWeight: 600, fontSize: 40, whiteSpace: 'nowrap', boxShadow: '0 10px 24px rgba(0,0,0,.45)'}}>{label}</div>
                <div style={{width: 4, height: 40, background: CLAY}} /><div style={{width: 18, height: 18, borderRadius: 9, border: `4px solid ${CLAY}`, background: '#fff'}} /></div>
            </div>); })}
        </div>
      </div>
      <Kicker t={t} a={a} n={4} text="The edit." />
      <div style={{position: 'absolute', left: 72, top: 262, fontFamily: MONO, fontSize: 24, color: LIGHT_MUTED, opacity: ease(t, a + .3, .4)}}>remotion studio · this video's own timeline</div>
      <Cast t={t} a={23.6} b={29.3} x={870} ledge={VP.y + 2} s={.8} />
    </AbsoluteFill>
  );
};

// ================================================================ 6 · second review (terminal) and plain-English notes (chat)
const FINDINGS: [string, string, string][] = [   // the reviewer's real findings on the first v2 render (2026-11-03)
  ['07.5 s', 'step 1 window empty for a second', 'sure'], ['13.0 s', 'transcript line clipped', 'sure'],
  ['27.0 s', "hat hidden behind the window", 'sure'], ['42.0 s', '"EDIT" floats with no context', 'maybe']];
const Review: React.FC<{t: number}> = ({t}) => {
  const [a] = S.review, t0 = a + .45;
  const shown = (i: number) => ease(t, t0 + i * .32, .25), FAIL = wt(6, 'reviews') + .1, fail = ease(t, FAIL, .25);
  const ticks = [0, 1, 2, 3].map(i => ease(t, FAIL + .55 + i * .22, .2)), PASS = wt(6, 'frame') + .35, pass = ease(t, PASS, .3);
  const note = ease(t, wt(6, 'notes') - .1, .35), done = ease(t, wt(6, 'english') + .25, .35);
  const typed = 'make the hook a little faster'.slice(0, Math.max(0, Math.floor((t - wt(6, 'give')) * 34)));
  return (
    <AbsoluteFill style={{background: NIGHT}}>
      <Vignette o={.5} />
      <Kicker t={t} a={a} n={5} text="A second Claude reviews." />
      <div style={{position: 'absolute', left: 60, right: 60, top: 300, height: 520, borderRadius: 24, background: '#0B0A0F', border: '1.5px solid rgba(244,236,224,.14)', padding: '24px 30px', fontFamily: MONO, color: '#E9E3DA', overflow: 'hidden'}}>
        <div style={{display: 'flex', gap: 10, alignItems: 'center', fontSize: 22, color: LIGHT_MUTED}}>{[0, 1, 2].map(k => <div key={k} style={{width: 13, height: 13, borderRadius: 7, background: '#3A3542'}} />)}
          <span style={{marginLeft: 12}}>reel-review · a different model · edit-with-claude-v2.mp4</span></div>
        {FINDINGS.map(([tc, what, sure], i) => <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 22, fontSize: 27, opacity: shown(i), transform: `translateX(${(1 - shown(i)) * 20}px)`}}>
          <span style={{color: CLAY_ON_DARK, width: 104}}>{tc}</span>
          <span style={{flex: 1, textDecoration: ticks[i] > .5 ? 'line-through' : 'none', color: ticks[i] > .5 ? LIGHT_MUTED : '#E9E3DA'}}>{what}</span>
          <span style={{color: sure === 'sure' ? '#E07A6A' : LIGHT_MUTED, fontSize: 22}}>{sure}</span>
          <div style={{width: 34, height: 34, borderRadius: 17, background: ticks[i] > .5 ? GREEN : 'transparent', border: `2px solid ${ticks[i] > .5 ? GREEN : 'rgba(244,236,224,.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `scale(${1 + .25 * Math.sin(ticks[i] * Math.PI)})`}}>{ticks[i] > .5 ? <svg width={18} height={18} viewBox="0 0 20 20"><path d="M4 10.5l4 4 8-9" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" /></svg> : null}</div>
        </div>)}
        <div style={{position: 'absolute', left: 30, bottom: 26, display: 'flex', gap: 18, alignItems: 'center'}}>
          <div style={{padding: '8px 22px', borderRadius: 10, background: '#B23A2E', color: '#fff', fontWeight: 700, fontSize: 30, letterSpacing: 2, opacity: fail * (1 - pass), transform: `scale(${lerp(1.6, 1, fail)})`}}>FAIL</div>
          <div style={{position: 'absolute', left: 0, padding: '8px 22px', borderRadius: 10, background: GREEN, color: '#fff', fontWeight: 700, fontSize: 30, letterSpacing: 2, opacity: pass, transform: `scale(${lerp(1.6, 1, pass)})`}}>PASS</div>
          <span style={{marginLeft: 150, fontSize: 24, color: LIGHT_MUTED, opacity: pass}}>re-render · 0 sure problems</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 870, display: 'flex', flexDirection: 'column', gap: 18}}>
        <Bubble me k={note}>{typed || '…'}</Bubble>
        <Bubble k={done}>Done. v2 is ready.</Bubble>
      </div>
      <Cast t={t} a={29.35} b={34.9} x={250} ledge={1395 - 48 * .8} s={.8} />
    </AbsoluteFill>
  );
};

// ================================================================ 7 · the notebook (the real feedback log)
const LOGLINES: [string, string][] = [   // docs/10-feedback-log.md, condensed
  ['Oct 22', 'tiny overlines → real type'], ['Nov 2', 'make the stage cinematic'], ['Nov 3', 'v1 felt like slides → carry it']];
const NEWLINE: [string, string] = ['Nov 3', 'real SFX, mascot in the scene'];
const Notebook: React.FC<{t: number}> = ({t}) => {
  const [a] = S.log, writeA = wt(7, 'note') - .2, chars = Math.max(0, Math.floor((t - writeA) * 26));
  const TURN = wt(7, 'next') - .35, turn = eio(t, TURN, .7), tick = ease(t, wt(7, 'starts') - .05, .25), glow = ease(t, wt(7, 'smarter'), .4);
  const Ruled: React.FC<{children: React.ReactNode}> = ({children}) => (
    <div style={{position: 'absolute', inset: 0, background: '#FCF8EE', backgroundImage: 'repeating-linear-gradient(transparent 0 79px, rgba(90,120,170,.25) 79px 81px)', backgroundPosition: '0 150px'}}>
      <div style={{position: 'absolute', left: 110, top: 0, bottom: 0, width: 3, background: 'rgba(201,100,66,.45)'}} /><Grain o={.06} />{children}</div>
  );
  const row = (i: number, text: React.ReactNode, k = 1) => <div key={i} style={{position: 'absolute', left: 136, right: 40, top: 168 + i * 80, height: 80, display: 'flex', alignItems: 'center', fontFamily: HAND, fontWeight: 600, fontSize: 48, color: INK, opacity: k, whiteSpace: 'nowrap'}}>{text}</div>;
  return (
    <AbsoluteFill style={{background: '#E7DCC7'}}>
      <Grain o={.1} /><Vignette o={.28} />
      <Kicker t={t} a={a} n={6} text="It learns every round." dark />
      <div style={{position: 'absolute', left: 80, top: 330, width: 920, height: 1040, transform: 'rotate(-1deg)', boxShadow: '0 30px 60px -20px rgba(60,40,20,.5)', perspective: 2400}}>
        {/* the next page, under the one that turns */}
        <Ruled>
          <div style={{position: 'absolute', left: 136, top: 50, fontFamily: MONO, fontSize: 24, color: MUTED}}>projects/2026-11-04-next-video/</div>
          {row(0, <span style={{color: CLAY}}>next video</span>)}
          {row(1, <><div style={{width: 46, height: 46, border: `3px solid ${INK}`, borderRadius: 8, marginRight: 22, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width={40} height={40} viewBox="0 0 20 20"><path d="M3 10.5l4.5 4.5 9-10" stroke={CLAY} strokeWidth={3} fill="none" strokeLinecap="round" strokeDasharray={26} strokeDashoffset={26 * (1 - tick)} /></svg></div>read the feedback log first</>)}
          {row(2, <span style={{color: MUTED}}>…starts from every note so far</span>, ease(t, wt(7, 'smarter') - .2, .4))}
          <div style={{position: 'absolute', left: 120, top: 330, width: 640, height: 90, borderRadius: 45, background: 'rgba(232,170,56,.35)', opacity: glow, transform: `scaleX(${glow})`, transformOrigin: '0 50%'}} />
        </Ruled>
        {/* this page: the log, which turns over */}
        <div style={{position: 'absolute', inset: 0, transformOrigin: '0 50%', transform: `rotateY(${-turn * 175}deg)`, backfaceVisibility: 'hidden', opacity: turn > .55 ? 0 : 1, filter: `brightness(${1 - .3 * Math.sin(turn * Math.PI)})`}}>
          <Ruled>
            <div style={{position: 'absolute', left: 136, top: 50, fontFamily: MONO, fontSize: 24, color: MUTED}}>docs/10-feedback-log.md</div>
            {LOGLINES.map(([d, l], i) => row(i, <><span style={{color: CLAY, width: 150, flexShrink: 0}}>{d}</span>{l}</>))}
            {row(3, <><span style={{color: CLAY, width: 150, flexShrink: 0, opacity: chars > 0 ? 1 : 0}}>{NEWLINE[0]}</span>{NEWLINE[1].slice(0, Math.max(0, chars - 4))}</>)}
          </Ruled>
        </div>
      </div>
      <Cast t={t} a={35.0} b={40.35} x={830} ledge={340} s={.8} />
    </AbsoluteFill>
  );
};

// ================================================================ 8 · the whole system → Comment EDIT
const TILES: [React.FC<{t: number}>, number, string][] = [[Folder, 12.0, 'one folder'], [Watch, 16.9, 'it watches'], [PaperDesk, 22.9, 'style + storyboard'],
  [Studio, 28.4, 'the edit'], [Review, 34.2, 'second review'], [Notebook, 39.9, 'it learns']];
const End: React.FC<{t: number}> = ({t}) => {
  const [a] = S.end, tilesOut = ease(t, wt(8, 'comment') - .35, .45);
  const head = ease(t, wt(8, 'comment') - .1, .5), field = ease(t, wt(8, 'comment') + .2, .4);
  const typeA = wt(8, 'edit') - .05, typed = 'EDIT'.slice(0, Math.max(0, Math.floor((t - typeA) * 10))), SENT = typeA + .75, sent = ease(t, SENT, .35), heart = ease(t, SENT + .6, .3);
  const tw = 270, th = tw * 16 / 9, sc = tw / W, gx = (W - 3 * tw - 36) / 2;
  return (
    <AbsoluteFill style={{background: NIGHT}}>
      <Vignette o={.5} />
      <div style={{position: 'absolute', left: 72, right: 72, top: 230, fontFamily: SANS, fontWeight: 600, fontSize: 64, letterSpacing: -2, color: LIGHT, opacity: ease(t, a + .3, .4) * (1 - tilesOut)}}>That's the whole system.</div>
      {TILES.map(([Comp, at, label], i) => { const k = ease(t, a + .1 + i * .08, .45), x = gx + (i % 3) * (tw + 18), y = 350 + Math.floor(i / 3) * (th + 66);
        return <div key={i} style={{position: 'absolute', left: x, top: y, opacity: k * (1 - tilesOut), transform: `translateY(${(1 - k) * 40 - tilesOut * 60}px) scale(${.9 + .1 * k})`}}>
          <div style={{width: tw, height: th, borderRadius: 16, overflow: 'hidden', position: 'relative', boxShadow: '0 16px 40px rgba(0,0,0,.5)'}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${sc})`, transformOrigin: '0 0'}}><Comp t={at} /></div></div>
          <div style={{marginTop: 12, fontFamily: SANS, fontSize: 28, fontWeight: 500, color: LIGHT_MUTED}}><span style={{color: CLAY_ON_DARK, marginRight: 10}}>{i + 1}</span>{label}</div></div>; })}
      <div style={{position: 'absolute', left: 72, right: 72, top: 330, textAlign: 'center', opacity: head, transform: `translateY(${(1 - head) * 30}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 124, letterSpacing: -4.5, lineHeight: '124px', color: LIGHT}}>Comment <span style={{color: CLAY_ON_DARK}}>EDIT</span></div>
        <div style={{fontFamily: SANS, fontSize: 40, color: LIGHT_MUTED, marginTop: 24}}>I'll send you the whole setup.</div></div>
      <div style={{position: 'absolute', left: 132, width: W - 264, top: 700, height: 108, borderRadius: 54, background: CARD, display: 'flex', alignItems: 'center', padding: '0 18px 0 42px',
        opacity: field * (1 - ease(t, SENT - .05, .12)), transform: `translateY(${(1 - field) * 30 - sent * 30}px)`}}>
        <span style={{flex: 1, fontFamily: SANS, fontSize: 38, fontWeight: typed ? 700 : 400, color: typed ? INK : 'rgba(31,30,29,.35)'}}>{typed || 'Add a comment…'}</span>
        <div style={{width: 76, height: 76, borderRadius: 38, background: typed.length === 4 ? CLAY : 'rgba(31,30,29,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={32} height={32} viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></div></div>
      <div style={{position: 'absolute', left: 132, width: W - 264, top: 694, display: 'flex', alignItems: 'center', gap: 24, padding: '20px 30px', borderRadius: 32, background: 'rgba(255,252,246,.08)',
        border: '1.5px solid rgba(244,236,224,.14)', opacity: ease(t, SENT + .1, .3), transform: `translateY(${(1 - sent) * 30}px)`}}>
        <div style={{width: 74, height: 74, borderRadius: 37, background: CLAY_ON_DARK}} />
        <div><div style={{fontFamily: SANS, fontSize: 26, color: LIGHT_MUTED}}>you · just now</div><div style={{fontFamily: SANS, fontSize: 48, fontWeight: 700, color: LIGHT}}>EDIT</div></div>
        <svg style={{marginLeft: 'auto', transform: `scale(${heart + .3 * Math.sin(heart * Math.PI)})`}} width={44} height={44} viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill={CLAY_ON_DARK} /></svg></div>
      <div style={{position: 'absolute', left: 540 - 200, top: 1445, width: 400, height: 40, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,.45), rgba(0,0,0,0) 70%)', opacity: tilesOut}} />
      <Cast t={t} a={40.4} b={45.1} x={540} ledge={1460 - 48 * 1.1} s={1.1} style={{opacity: tilesOut}} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- frame furniture: progress and captions
const Progress: React.FC<{t: number}> = ({t}) => {
  if (t < S.folder[0] || t >= S.end[0]) return null;
  const steps = [S.folder, S.watch, S.paper, S.studio, S.review, S.log], cur = steps.findIndex(([a, b]) => t >= a && t < b);
  const dark = cur === 2 || cur === 5;
  return <div style={{position: 'absolute', left: 72, top: 150, width: W - 144, display: 'flex', gap: 12}}>
    {steps.map(([a, b], k) => { const fill = t < a ? 0 : t >= b ? 1 : (t - a) / (b - a); return (
      <div key={k} style={{flex: 1, height: 6, borderRadius: 3, background: dark ? 'rgba(31,30,29,.14)' : 'rgba(244,236,224,.16)', overflow: 'hidden'}}>
        <div style={{width: `${fill * 100}%`, height: '100%', background: k === cur ? (dark ? CLAY : CLAY_ON_DARK) : (dark ? INK : LIGHT), opacity: k === cur ? 1 : .55}} /></div>); })}
  </div>;
};
const Captions: React.FC<{t: number}> = ({t}) => {
  if (t < 2.75) return null;
  const i = WORDS.findIndex((w, k) => t >= w.s && t < (WORDS[k + 1] && WORDS[k + 1].s - w.e < .3 ? WORDS[k + 1].s : w.e + .12));
  if (i < 0) return null;
  const w = WORDS[i], k = ease(t, w.s, .12);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1528, display: 'flex', justifyContent: 'center'}}>
    <div style={{padding: '6px 26px 10px', borderRadius: 20, background: 'rgba(12,11,18,.72)', fontFamily: SANS, fontWeight: 600, fontSize: 62, letterSpacing: -1.4,
      color: STRESS.test(w.w) ? CLAY_ON_DARK : LIGHT, opacity: .4 + .6 * k, transform: `translateY(${(1 - k) * 8}px)`}}>{w.w.replace(/[.,:]$/, '')}</div></div>;
};

// ---------------------------------------------------------------- the film
const SCENES: [keyof typeof S, React.FC<{t: number}>][] = [['hook', Hook], ['feed', Feed], ['folder', Folder], ['watch', Watch], ['paper', PaperDesk],
  ['studio', Studio], ['review', Review], ['log', Notebook], ['end', End]];
const Film: React.FC = () => {
  const ft = useT(), t = P().t ?? ft;
  return (
    <AbsoluteFill style={{background: DEEP, overflow: 'hidden'}}>
      {SCENES.map(([id, Comp]) => {
        const [a, b] = S[id], tin = TR.find(([at]) => at === a), tout = TR.find(([at]) => at === b);
        const pre = tin ? tin[2] / 2 : 0, post = tout ? tout[2] / 2 : 0;
        if (t < a - pre || t >= b + post) return null;
        let style: React.CSSProperties = {};
        if (tin && t < a + pre) style = trStyle(tin[1], t, tin[0], tin[2], 'in');
        if (tout && t >= b - post) style = trStyle(tout[1], t, tout[0], tout[2], 'out');
        const z = tin && t < a + pre && tin[1] !== 'zoomOut' ? 2 : 1;
        return <AbsoluteFill key={id} style={{...style, zIndex: z}}><Comp t={t} /></AbsoluteFill>;
      })}
      <AbsoluteFill style={{zIndex: 5}}><Progress t={t} /><Captions t={t} /></AbsoluteFill>
      {/* named, empty markers so Remotion Studio's timeline reads like an edit (scene 5 films this very timeline) */}
      {SCENES.map(([id], i) => { const [a, b] = S[id]; return <Sequence key={'m' + id} name={`${i} · ${id}`} from={Math.round(a * FPS)} durationInFrames={Math.round((Math.min(b, DUR) - a) * FPS)} layout="none"><></></Sequence>; })}
      <Sequence name="captions · one word at a time" from={Math.round(2.8 * FPS)} durationInFrames={Math.round(41.9 * FPS)} layout="none"><></></Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- sound: sfx-kit, each placed by its sync point
// MIX: the whole SFX bed. 1.8 (+5 dB) puts the SFX-only file near −33 LUFS with peaks around −9 dBTP, under a −14 LUFS voice.
const MIX = 1.8;
const at = (id: string, moment: number, vol: number): [string, number, number] => [id, moment - (KIT[id]?.sync ?? 0), vol];
export const SFX3: [string, number, number][] = [
  // 0 · hook: a shutter on every other page, air drawn in to the resolve, a soft boom
  ...Array.from({length: Math.floor(HOOK_FLIPS_END / FLIP / 2)}, (_, i) => at('mechanical-shutter-light', i * 2 * FLIP, .16)),
  at('reverse-whoosh-short-soft', RESOLVE, .35), at('boom-hit-soft', RESOLVE + .02, .3),
  // 1 · feed
  at('move-zoom-in', 2.85, .4), at('swipe-slow-firm', 2.8, .4), at('foley-paper-touch', wt(1, 'nobody') + .1, .55), at('impact-medium-soft', wt(1, 'nobody') + .12, .45),
  at('pop-large-in', wt(1, 'save') + .05, .5),
  // 2 · folder
  at('whoosh-medium-medium', 7.5, .4),
  ...[wt(2, 'footage'), wt(2, 'references'), wt(2, 'exports')].flatMap(s => [at('whoosh-fast-soft', s + .1, .3), at('impact-light-soft', s + .32, .5)]),
  at('pop-large-bubble', 10.15, .45), at('keyboard-typing-quick-short', wt(2, 'open') + .3, .35), at('keyboard-return-soft', wt(2, 'code') - .15, .4),
  // 3 · watch
  at('move-zoom-in', 12.6, .4), ...SHOTS.map(s => at('mechanical-shutter-light', s, .4)), at('digital-scan-subtle', wt(3, 'transcript') - .6, .28),
  at('digital-process-subtle', wt(3, 'transcript') - .4, .22),
  // 4 · paper desk
  at('foley-paper-slide', 17.65, .5), at('keyboard-typing-steady-medium', wt(4, 'style') - .2, .25), at('writing-pencil-draw', wt(4, 'storyboard'), .4),
  ...[0, 1, 2, 3].map(i => at('foley-card-touch', wt(4, 'nothing') - .4 + i * .16, .45)),
  at('notification-message-in-soft', wt(4, 'until') - .5, .35), at('notification-message-out-soft', wt(4, 'approve') - .4, .35), at('impact-heavy-firm', wt(4, 'approve') + .15, .6),
  // 5 · studio
  at('move-zoom-out', 23.25, .4), at('move-zoom-in', wt(5, 'edit') + .55, .4), at('whoosh-slow-soft', wt(5, 'cuts') + .4, .3),
  ...[wt(5, 'cuts'), wt(5, 'captions'), wt(5, 'motion'), wt(5, 'sound')].map(s => at('click-mouse-soft', s - .05, .5)),
  // 6 · review
  at('whoosh-fast-medium', 29.25, .4), at('digital-hacker', 29.7, .2), at('notification-failure-knock', wt(6, 'reviews') + .1, .45),
  ...[0, 1, 2, 3].map(i => at('writing-pen-tick', wt(6, 'reviews') + .65 + i * .22, .4)), at('notification-success-soft', wt(6, 'frame') + .35, .4),
  at('keyboard-typing-quick-medium', wt(6, 'give'), .25), at('notification-message-out-soft', wt(6, 'english') - .2, .35), at('notification-message-in-soft', wt(6, 'english') + .25, .35),
  // 7 · notebook
  at('foley-paper-slide', 34.65, .5), at('writing-pen-write', wt(7, 'note') - .2, .45), at('props-page-turn', wt(7, 'next') - .35, .55),
  at('writing-pencil-tick', wt(7, 'starts') + .1, .5), at('shimmer-short-soft', wt(7, 'smarter'), .35),
  // 8 · end
  at('move-zoom-out', 40.1, .4), ...[0, 1, 2, 3, 4].map(i => at(`tone-step-${i + 1}`, 40.45 + i * .1, .18)),
  ...[0, 1, 2, 3].map(i => at('keyboard-letter-soft', wt(8, 'edit') - .05 + i * .1, .4)), at('notification-message-out-clear', wt(8, 'edit') + .7, .4),
  at('sting-warm-short', wt(8, 'edit') + 1.35, .3),
];

export const EditWithClaudeV3: React.FC = () => (
  <AbsoluteFill>
    <Film />
    {SFX3.map(([id, start, v], i) => { const k = KIT[id]; if (!k) return null; return (
      <Sequence key={i} name={`sfx · ${id}`} from={Math.max(0, Math.round(start * FPS))} durationInFrames={Math.max(2, Math.ceil(k.dur * FPS) + 2)}>
        <Audio src={staticFile(`sfx/kit/${k.file}`)} volume={Math.min(1, v * MIX)} /></Sequence>); })}
  </AbsoluteFill>
);
