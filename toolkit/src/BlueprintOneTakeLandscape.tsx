// "Everyone mocked it" EP. 01 — Geoffrey Hinton, Blueprint Cut as ONE TAKE, 16:9 (1920×1080) version of v7.
// Same system as BlueprintOneTake.tsx (portrait): one grid for the whole film, lines travel / split / merge, images
// dissolve inside the moving cell, type keeps 44 px clear of every guide, faces are never cropped or covered.
// Landscape layout, as in the reference: a tall centre cell holds the picture; the small set-up line sits in the
// left region (right-aligned, hugging the cell) and the big payoff word in the right region (left-aligned).
// Built silent at 2.7 words/s; BEATS[].at and the word frames re-time it to a voice-over.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {KIT} from './sfxkit';

export const LS_W = 1920;
export const LS_H = 1080;
export const LS_FPS = 30;
export const LS_FRAMES = 1272;

const PAPER = '#ebe3db';
const INK = '#100d13';
const BLACK = '#050306';
const COBALT = '#002ca8';
const COBALT_TYPE = '#183a96';
const SOFT_BLUE = '#7f93d6';
const CREAM = '#efe8df';
const WHITE = '#f6f4f5';
const PAD = 44; // minimum space between any type and any guide
const MARGIN = 100; // space between type and the frame edge

const fonts: [string, string, FontFaceDescriptors][] = [
  ['Anton', 'fonts/Anton.woff2', {}],
  ['Space Mono', 'fonts/SpaceMono-400.woff2', {weight: '400'}],
  ['Space Mono', 'fonts/SpaceMono-700.woff2', {weight: '700'}],
  ['EB Garamond', 'fonts/eb-garamond-latin-500-italic.woff2', {style: 'italic', weight: '500'}],
  ['Inter', 'fonts/Inter-SemiBold.otf', {weight: '600'}],
];
if (typeof document !== 'undefined') {
  const h = delayRender('fonts-landscape');
  Promise.all(fonts.map(([fam, file, d]) => new FontFace(fam, `url(${staticFile(file)})`, d).load().then((f) => document.fonts.add(f)))).then(() => continueRender(h));
}

const img = (f: string) => staticFile(`imagery/hinton/${f}`);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const p01 = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);

type Lines = {v: number[]; h: number[]};
type Slots = [number, number, number, number]; // v slot, v slot, h slot, h slot
const rectOf = (L: Lines, s: Slots) => {
  const x0 = Math.min(L.v[s[0]], L.v[s[1]]), x1 = Math.max(L.v[s[0]], L.v[s[1]]);
  const y0 = Math.min(L.h[s[2]], L.h[s[3]]), y1 = Math.max(L.h[s[2]], L.h[s[3]]);
  return {x: x0, y: y0, w: x1 - x0, h: y1 - y0};
};
const MAIN: Slots = [0, 1, 0, 1];
type Geo = {lo: number; hi: number; top: number; bot: number}; // the outer guides of the layout the type belongs to
const geoOf = (L: Lines): Geo => ({lo: Math.min(...L.v), hi: Math.max(...L.v), top: Math.min(...L.h), bot: Math.max(...L.h)});

// ---------- type
// set-up line: left region, right-aligned so it hugs the cell, vertically centred on the layout; words arrive one by one
const SetupL: React.FC<{f: number; G: Geo; words: string[]; at: number[]; color: string; size?: number}> = ({f, G, words, at, color, size = 38}) => (
  <div style={{position: 'absolute', left: MARGIN, top: G.top, width: G.lo - PAD - MARGIN, height: G.bot - G.top, display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
    <div style={{textAlign: 'right', fontFamily: 'Space Mono', fontSize: size, letterSpacing: '0.14em', lineHeight: '56px', color, textTransform: 'uppercase'}}>
      {words.map((w, i) => (
        <span key={i} style={{opacity: f >= Math.max(at[i], 15 + i) ? 1 : 0}}>{w} </span>
      ))}
    </div>
  </div>
);
// payoff: right region, left-aligned, stacked lines that appear on their own frames; optional mono sub-lines under them
const PayoffR: React.FC<{f: number; G: Geo; lines: [string, number][]; size: number; color: string; sub?: string; subAt?: number; subColor?: string}> = ({f, G, lines, size, color, sub, subAt = 0, subColor}) => {
  const x = G.hi + PAD;
  return (
    <div style={{position: 'absolute', left: x, top: G.top, width: LS_W - MARGIN - x, height: G.bot - G.top, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 14}}>
      {lines.map(([t, a], i) => (
        <div key={i} style={{fontFamily: 'Anton', fontSize: size, lineHeight: `${size * 0.9}px`, height: size * 0.9, color, whiteSpace: 'nowrap', opacity: f >= a ? 1 : 0}}>{t}</div>
      ))}
      {sub && <div style={{marginTop: 12, fontFamily: 'Space Mono', fontSize: 44, letterSpacing: '0.12em', lineHeight: '58px', color: subColor ?? color, whiteSpace: 'pre', textTransform: 'uppercase', opacity: f >= subAt ? 1 : 0}}>{sub}</div>}
    </div>
  );
};

const Cover: React.FC<{src: string; pos?: string; style?: React.CSSProperties}> = ({src, pos = '50% 0%', style}) => (
  <Img src={img(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, ...style}} />
);

// our own neural-network line drawing, sized to its box
const LAYERS = [3, 5, 5, 2];
const Net: React.FC<{w: number; h: number; draw: number; stroke: string; node: string}> = ({w, h, draw, stroke, node}) => {
  const pos = (l: number, i: number) => ({x: w * (0.14 + l * 0.24), y: h / 2 + (i - (LAYERS[l] - 1) / 2) * (h * 0.15)});
  const lines: React.ReactNode[] = [];
  let n = 0;
  const total = 50;
  for (let l = 0; l < 3; l++)
    for (let i = 0; i < LAYERS[l]; i++)
      for (let j = 0; j < LAYERS[l + 1]; j++) {
        const a = pos(l, i), b = pos(l + 1, j);
        if (n / total < draw) lines.push(<line key={n} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={stroke} strokeWidth={1.8} opacity={0.55} />);
        n++;
      }
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
      {lines}
      {LAYERS.map((c, l) => Array.from({length: c}).map((_, i) => (draw > l / 4 ? <circle key={`${l}-${i}`} cx={pos(l, i).x} cy={pos(l, i).y} r={Math.min(22, h * 0.03)} fill={node} stroke={stroke} strokeWidth={2.5} /> : null)))}
    </svg>
  );
};

// ---------- beats. f is the frame inside the beat. Word frames are local to the beat.
type Beat = {
  at: number;
  ground: string;
  ink: string;
  v: number[]; // 4 vertical guide slots
  h: number[]; // 4 horizontal guide slots
  main?: Slots;
  tr?: number; // frames the grid takes to reach this layout
  plain?: boolean; // content is a drawing or numbers: when leaving it, fade it out before the next image appears
  media?: (f: number, w: number, h: number) => React.ReactNode;
  extras?: {r: Slots; render: (f: number, w: number, h: number) => React.ReactNode}[];
  text?: (f: number, G: Geo, L: Lines) => React.ReactNode;
};
const FLICK = ['CRAZY.', 'NONSENSE.', 'WASTE OF TIME.', 'GIVE UP.'];
const CELL_V = [560, 1360, 1360, 1360];
const FULL_H = [100, 980, 980, 980];

const BEATS: Beat[] = [
  {
    // hook — halftone portrait builds from dots; the things they said tick through a band at the foot of the cell
    at: 0, ground: PAPER, ink: COBALT_TYPE, v: CELL_V, h: FULL_H,
    media: (f, w, h) => {
      const r = interpolate(f, [0, 10], [0, 11], clamp);
      const k = Math.min(3, Math.floor(Math.max(0, f - 12) / 15));
      return (
        <>
          <Img src={img('halftone.png')} style={{position: 'absolute', left: (w - 740) / 2, top: 0, width: 740, WebkitMaskImage: r < 10.5 ? `radial-gradient(circle, #000 ${r}px, transparent ${r + 0.8}px)` : undefined, WebkitMaskSize: '15px 15px'}} />
          {f >= 12 && (
            <div style={{position: 'absolute', left: 0, bottom: 0, width: w, height: 112, background: COBALT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono', fontWeight: 700, fontSize: 48, letterSpacing: '0.14em', color: CREAM}}>{FLICK[k]}</div>
          )}
        </>
      );
    },
    text: (f, G) => (
      <>
        <SetupL f={f} G={G} words={['For', '40', 'years', 'they', 'called', 'his', 'bet', 'a']} at={[14, 20, 26, 38, 44, 54, 60, 68]} color={COBALT_TYPE} />
        <PayoffR f={f} G={G} lines={[['DEAD', 72], ['END.', 82]]} size={176} color={COBALT_TYPE} />
      </>
    ),
  },
  {
    // nobel — the cell splits in two: portrait left, medal right
    at: 105, ground: COBALT, ink: CREAM, v: [560, 1360, 1020, 1020], h: [260, 980, 980, 980], main: [0, 2, 0, 1],
    media: (f, w) => <Img src={img('sticker.png')} style={{position: 'absolute', left: 0, bottom: -4, width: w}} />,
    extras: [
      {
        r: [2, 1, 0, 1],
        render: (f, w, h) => {
          const m = easeOut(p01(f, 30, 40));
          return m <= 0 || w < 200 ? null : (
            <div style={{position: 'absolute', left: w / 2 - 125, top: h / 2 - 125, width: 250, height: 250, borderRadius: 125, background: CREAM, transform: `scale(${0.4 + 0.6 * m}) rotate(${(1 - m) * -30}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 214, height: 214, borderRadius: 107, border: `3px solid ${COBALT_TYPE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Anton', fontSize: 76, color: COBALT_TYPE}}>2024</div>
            </div>
          );
        },
      },
    ],
    text: (f, G) => (
      <>
        <SetupL f={f} G={G} words={['In', '2024', 'it', 'won', 'the']} at={[10, 16, 28, 33, 40]} color={CREAM} />
        <PayoffR f={f} G={G} lines={[['NOBEL', 45]]} size={150} color={CREAM} sub={'PRIZE IN\nPHYSICS'} subAt={53} />
      </>
    ),
  },
  {
    // name — the cell narrows to a portrait; the name takes the wider regions either side
    at: 183, ground: INK, ink: CREAM, v: [700, 1220, 1220, 1220], h: FULL_H,
    media: () => <Cover src="c23_bw.jpg" pos="50% 0%" />,
    text: (f, G) => (
      <>
        <SetupL f={f} G={G} words={['His', 'name', 'is']} at={[16, 20, 25]} color={CREAM} />
        <PayoffR f={f} G={G} lines={[['GEOFFREY', 33], ['HINTON', 45]]} size={122} color={CREAM} />
      </>
    ),
  },
  {
    // give up — the photo holds still and pushes in slowly; nothing tears or covers it
    at: 255, ground: PAPER, ink: COBALT_TYPE, v: CELL_V, h: [160, 920, 920, 920],
    media: (f) => <Cover src="c23wide_bw.jpg" pos="92% 50%" style={{transform: `scale(${1 + 0.05 * p01(f, 0, 90)})`, transformOrigin: '60% 30%'}} />,
    text: (f, G) => (
      <>
        <SetupL f={f} G={G} words={['His', 'own', 'supervisor', 'told', 'him', 'to']} at={[16, 21, 26, 40, 46, 52]} color={COBALT_TYPE} />
        <PayoffR f={f} G={G} lines={[['GIVE', 63], ['UP.', 63]]} size={176} color={COBALT_TYPE} />
      </>
    ),
  },
  {
    // waste — two new guides split the cell into three columns; on the word the columns slip out of register
    at: 351, ground: INK, ink: CREAM, v: [560, 1360, 827, 1093], h: [160, 920, 920, 920], plain: true,
    media: (f, w, h) => {
      const brk = easeOut(p01(f, 57, 66));
      const off = [46, -58, 34];
      return (
        <>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{position: 'absolute', left: (w / 3) * i, top: 0, width: w / 3, height: h, overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: -(w / 3) * i, top: off[i] * brk, width: w, height: h}}>
                <Net w={w} h={h} draw={p01(f, 10, 44)} stroke={CREAM} node={INK} />
              </div>
            </div>
          ))}
        </>
      );
    },
    text: (f, G) => (
      <>
        <SetupL f={f} G={G} words={['They', 'said', 'neural', 'networks', 'were', 'a']} at={[10, 15, 21, 29, 42, 50]} color={CREAM} />
        <PayoffR f={f} G={G} lines={[['WASTE', 57]]} size={150} color={CREAM} sub={'OF TIME.'} subAt={69} />
      </>
    ),
  },
  {
    // toronto — the grid closes to one quiet band
    at: 438, ground: BLACK, ink: CREAM, v: [360, 1560, 1560, 1560], h: [390, 690, 690, 690],
    text: (f, G) => (
      <>
        <div style={{position: 'absolute', left: G.lo, top: G.top, width: G.hi - G.lo, height: G.bot - G.top, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'EB Garamond', fontStyle: 'italic', fontWeight: 500, fontSize: 118, lineHeight: 1, whiteSpace: 'nowrap', color: CREAM, opacity: p01(f, 10, 22)}}>So he moved to Toronto.</div>
        <div style={{position: 'absolute', left: G.lo, top: G.bot + PAD, width: G.hi - G.lo, textAlign: 'center', fontFamily: 'Space Mono', fontSize: 36, letterSpacing: '0.14em', color: CREAM, opacity: f >= 26 ? 0.9 : 0}}>UNIVERSITY OF TORONTO · 1987</div>
      </>
    ),
  },
  {
    // years — the band opens into a counter cell over a ruler cell
    at: 492, ground: PAPER, ink: COBALT_TYPE, v: CELL_V, h: [180, 900, 420, 420], main: [0, 1, 0, 2], plain: true,
    media: (f, w, h) => {
      const cur = Math.min(25, Math.floor(p01(f, 12, 62) * 26));
      return <div style={{position: 'absolute', left: PAD, top: 0, height: h, display: 'flex', alignItems: 'center', fontFamily: 'Anton', fontSize: 150, lineHeight: 1, color: INK}}>{1987 + cur}</div>;
    },
    extras: [
      {
        r: [0, 1, 2, 1],
        render: (f, w, h) => {
          const cur = Math.min(25, Math.floor(p01(f, 12, 62) * 26));
          return h < 200 ? null : (
            <div style={{position: 'absolute', left: PAD, top: 0, width: w - PAD * 2, height: h, display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', alignContent: 'center', rowGap: 24}}>
              {Array.from({length: 26}).map((_, i) => (
                <div key={i} style={{height: 140}}>
                  <div style={{width: 7, height: 88, background: i <= cur ? COBALT_TYPE : 'rgba(16,13,19,0.16)'}} />
                  <div style={{fontFamily: 'Space Mono', fontSize: 32, marginTop: 4, color: i <= cur ? COBALT_TYPE : 'rgba(16,13,19,0.32)'}}>{String((87 + i) % 100).padStart(2, '0')}</div>
                </div>
              ))}
            </div>
          );
        },
      },
    ],
    text: (f, G) => (
      <>
        <SetupL f={f} G={G} words={['And', 'kept', 'going.', 'For']} at={[10, 15, 21, 56]} color={COBALT_TYPE} />
        <PayoffR f={f} G={G} lines={[['25', 66], ['MORE', 66]]} size={150} color={COBALT_TYPE} sub="YEARS." subAt={78} />
      </>
    ),
  },
  {
    // 2012 — the cell splits down the middle: everyone else on the left, his students on the right
    at: 594, ground: INK, ink: CREAM, v: [620, 1300, 960, 960], h: [140, 940, 940, 940], main: [0, 2, 0, 1], plain: true,
    media: (f, w, h) => {
      const b = easeOut(p01(f, 82, 96));
      return (
        <>
          <div style={{position: 'absolute', left: PAD, top: PAD, fontFamily: 'Space Mono', fontSize: 36, letterSpacing: '0.08em', lineHeight: '46px', color: CREAM, opacity: 0.85, whiteSpace: 'pre'}}>{'EVERYONE\nELSE'}</div>
          <div style={{position: 'absolute', left: PAD, bottom: PAD, width: w - PAD * 2, height: 420 * b, background: 'rgba(239,232,223,0.26)'}} />
          <div style={{position: 'absolute', left: PAD, bottom: PAD + 420 * b + 8, fontFamily: 'Anton', fontSize: 92, lineHeight: 1, color: CREAM, opacity: b > 0.9 ? 0.85 : 0}}>26.2%</div>
        </>
      );
    },
    extras: [
      {
        r: [2, 1, 0, 1],
        render: (f, w, h) => {
          const b = easeOut(p01(f, 90, 104));
          return w < 200 ? null : (
            <>
              <div style={{position: 'absolute', left: PAD, top: PAD, fontFamily: 'Space Mono', fontSize: 36, letterSpacing: '0.08em', lineHeight: '46px', color: SOFT_BLUE, whiteSpace: 'pre'}}>{'HIS\nSTUDENTS'}</div>
              {f < 84 && (
                <div style={{position: 'absolute', left: 0, top: 150, width: w, height: h - 190}}>
                  <Net w={w} h={h - 190} draw={p01(f, 14, 62)} stroke={CREAM} node={INK} />
                </div>
              )}
              <div style={{position: 'absolute', left: PAD, bottom: PAD, width: w - PAD * 2, height: 245 * b, background: SOFT_BLUE}} />
              <div style={{position: 'absolute', left: PAD, bottom: PAD + 245 * b + 8, fontFamily: 'Anton', fontSize: 92, lineHeight: 1, color: SOFT_BLUE, opacity: b > 0.9 ? 1 : 0}}>15.3%</div>
            </>
          );
        },
      },
    ],
    text: (f, G) => (
      <>
        <SetupL f={f} G={G} words={['Then,', 'in', '2012,', 'two', 'students', 'built']} at={[10, 15, 20, 32, 40, 54]} color={CREAM} />
        <PayoffR f={f} G={G} lines={[['ONE', 66], ['NETWORK.', 66]]} size={112} color={CREAM} sub={'FEWER ERRORS.\nIT BEAT\nEVERY RIVAL.'} subAt={96} subColor={SOFT_BLUE} />
      </>
    ),
  },
  {
    // every AI — the two cells merge back into one tall cell
    at: 720, ground: INK, ink: CREAM, v: CELL_V, h: FULL_H,
    media: (f) => <Cover src="c24_cob.jpg" pos="50% 0%" style={{transform: `scale(${1 + 0.04 * p01(f, 0, 90)})`, transformOrigin: '50% 30%'}} />,
    text: (f, G) => (
      <>
        <SetupL f={f} G={G} words={['Today', 'that', 'idea', 'runs', 'nearly']} at={[10, 15, 20, 26, 32]} color={CREAM} />
        <PayoffR f={f} G={G} lines={[['EVERY', 42], ['AI', 48]]} size={176} color={CREAM} sub={'YOU USE.'} subAt={56} />
      </>
    ),
  },
  {
    // the pause — every guide folds into a single cross
    at: 810, ground: BLACK, ink: CREAM, v: [960, 960, 960, 960], h: [540, 540, 540, 540], tr: 12,
  },
  {
    // right — the cross opens back into the cell, his whole face
    at: 828, ground: INK, ink: CREAM, v: CELL_V, h: FULL_H,
    media: (f) => <Cover src="c24_bw.jpg" pos="50% 0%" style={{transform: `scale(${1 + 0.04 * p01(f, 0, 66)})`, transformOrigin: '50% 30%'}} />,
    text: (f, G) => (
      <>
        <SetupL f={f} G={G} words={['40', 'years', 'later,', 'he', 'was']} at={[10, 15, 21, 32, 37]} color={CREAM} />
        <PayoffR f={f} G={G} lines={[['RIGHT.', 42]]} size={176} color={CREAM} />
      </>
    ),
  },
  {
    // the question — one wide band
    at: 894, ground: COBALT, ink: CREAM, v: [260, 1660, 1660, 1660], h: [250, 830, 830, 830],
    text: (f, G) => {
      const k = Math.floor((f - 36) / 4);
      const styles: React.CSSProperties[] = [
        {fontFamily: 'Anton', fontSize: 170},
        {fontFamily: 'Space Mono', fontSize: 108},
        {fontFamily: 'Inter', fontWeight: 600, fontSize: 136},
        {fontFamily: 'EB Garamond', fontStyle: 'italic', fontWeight: 500, fontSize: 196},
      ];
      const u = easeOut(p01(f, 50, 64));
      return (
        <div style={{position: 'absolute', left: G.lo, top: G.top, width: G.hi - G.lo, height: G.bot - G.top, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, color: WHITE}}>
          <div style={{fontFamily: 'EB Garamond', fontStyle: 'italic', fontWeight: 500, fontSize: 108, lineHeight: 1.1, opacity: f >= 14 ? 1 : 0}}>How long would you</div>
          <div style={{height: 230, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', opacity: f >= 36 ? 1 : 0, ...styles[Math.max(0, Math.min(3, k))]}}>have lasted?</div>
          <div style={{width: 760 * u, height: 5, borderRadius: 3, background: WHITE, marginTop: -14}} />
        </div>
      );
    },
  },
  {
    // early — the band subdivides into a 3×3 grid; cells switch on one by one, the first one alone for a while
    at: 972, ground: PAPER, ink: COBALT_TYPE, v: [560, 1360, 827, 1093], h: [100, 980, 393, 687], plain: true,
    media: (f, w, h) => {
      const order = [4, 1, 3, 5, 7, 0, 2, 6, 8];
      const on = f < 14 ? 0 : f < 46 ? 1 : Math.min(9, 1 + Math.floor((f - 46) / 2.2));
      return (
        <>
          {order.map((c, i) => {
            const lit = i < on;
            return (
              <div key={c} style={{position: 'absolute', left: (w / 3) * (c % 3), top: (h / 3) * Math.floor(c / 3), width: w / 3, height: h / 3, background: lit ? COBALT_TYPE : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: 50, height: 50, borderRadius: 25, background: lit ? CREAM : 'transparent', border: `3px solid ${lit ? CREAM : COBALT_TYPE}`}} />
              </div>
            );
          })}
        </>
      );
    },
    text: (f, G) => (
      <>
        <SetupL f={f} G={G} words={['Your', 'idea', "isn't", 'dead.', "It's"]} at={[10, 15, 20, 26, 46]} color={COBALT_TYPE} />
        <PayoffR f={f} G={G} lines={[['EARLY.', 54]]} size={150} color={COBALT_TYPE} />
      </>
    ),
  },
  {
    at: 1056, ground: WHITE, ink: COBALT_TYPE, v: CELL_V, h: FULL_H, tr: 10,
    media: () => <Cover src="c24_poster.jpg" pos="50% 0%" />,
    text: (f, G) => <PayoffR f={f} G={G} lines={[['KEEP', 10], ['GOING.', 10]]} size={150} color={COBALT_TYPE} />,
  },
  {
    at: 1086, ground: PAPER, ink: COBALT_TYPE, v: CELL_V, h: [380, 700, 700, 700], tr: 9,
    text: (f, G) =>
      f < 10 ? null : (
        <div style={{position: 'absolute', left: G.lo, top: G.top, width: G.hi - G.lo, height: G.bot - G.top, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Anton', fontSize: 230, lineHeight: 1, color: COBALT_TYPE}}>POST.</div>
      ),
  },
  {
    at: 1110, ground: INK, ink: CREAM, v: CELL_V, h: FULL_H, tr: 12,
    media: (f) => <Cover src={f >= 9 && f < 12 ? 'c23_neg.jpg' : 'c23_bw.jpg'} pos="50% 0%" />,
    text: (f, G) => <PayoffR f={f} G={G} lines={[['LEARN.', 10]]} size={150} color={CREAM} />,
  },
  {
    at: 1134, ground: INK, ink: CREAM, v: CELL_V, h: FULL_H, tr: 9,
    media: () => <Cover src="c23_cob.jpg" pos="50% 0%" />,
    text: (f, G) => <PayoffR f={f} G={G} lines={[['AGAIN.', 10]]} size={150} color={SOFT_BLUE} />,
  },
  {
    // follow — the medal from the Nobel beat comes back as the card
    at: 1164, ground: INK, ink: CREAM, v: CELL_V, h: FULL_H,
    media: (f, w, h) => {
      const d = easeOut(p01(f, 9, 21));
      const R = Math.min(w, h) / 2 - PAD;
      const words: [string, number][] = [['FOLLOW', 18], ['FOR', 29], ['MORE.', 40]];
      if (f < 9) return null;
      return (
        <div style={{position: 'absolute', left: w / 2 - R, top: h / 2 - R, width: R * 2, height: R * 2, borderRadius: R, background: CREAM, transform: `scale(${0.4 + 0.6 * d}) rotate(${(1 - d) * -24}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: R * 2 - 44, height: R * 2 - 44, borderRadius: R, border: `4px solid ${COBALT_TYPE}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            {words.map(([wd, at]) => (
              <div key={wd} style={{fontFamily: 'Anton', fontSize: R * 0.42, lineHeight: 1.06, color: COBALT_TYPE, opacity: f >= at ? 1 : 0}}>{wd}</div>
            ))}
          </div>
        </div>
      );
    },
    text: (f, G) => (
      <>
        <SetupL f={f} G={G} words={['Everyone', 'mocked', 'it.']} at={[18, 22, 26]} color={CREAM} />
        <div style={{position: 'absolute', left: G.hi + PAD, top: G.top, width: LS_W - MARGIN - (G.hi + PAD), height: G.bot - G.top, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 34, color: CREAM, opacity: f >= 46 ? 1 : 0}}>
          <div style={{fontFamily: 'Space Mono', fontSize: 36, letterSpacing: '0.14em'}}>EP. 01</div>
          <div style={{fontFamily: 'Space Mono', fontWeight: 700, fontSize: 44, letterSpacing: '0.06em'}}>@HAHA.HARDIKK</div>
          <div style={{fontFamily: 'Space Mono', fontSize: 30, letterSpacing: '0.03em', lineHeight: 1.5, opacity: 0.95, whiteSpace: 'pre'}}>{'PHOTOS: COLLISION /\nSPORTSFILE,\nS. JURVETSON ·\nCC BY 2.0'}</div>
        </div>
      </>
    ),
  },
];

// ---------- the one grid
const Guides: React.FC<{L: Lines; color: string; o?: number}> = ({L, color, o = 1}) => {
  const dash = (dir: string) => `repeating-linear-gradient(${dir}, ${color} 0 9px, transparent 9px 18px)`;
  const va = L.v.map(Math.round), ha = L.h.map(Math.round);
  const vMin = Math.min(...va), vMax = Math.max(...va), hMin = Math.min(...ha), hMax = Math.max(...ha);
  const vs = Array.from(new Set(va)), hs = Array.from(new Set(ha));
  // the outermost lines run edge to edge; lines that subdivide a cell stop at the layout's outer guides
  const vExt = (x: number): [number, number] => (x <= vMin + 1 || x >= vMax - 1 ? [0, LS_H] : [hMin, hMax]);
  const hExt = (y: number): [number, number] => (y <= hMin + 1 || y >= hMax - 1 ? [0, LS_W] : [vMin, vMax]);
  return (
    <AbsoluteFill style={{opacity: 0.62 * o, pointerEvents: 'none'}}>
      {vs.map((x) => {
        const [a, b] = vExt(x);
        return <div key={`v${x}`} style={{position: 'absolute', left: x - 1, top: a, width: 2, height: b - a, background: dash('to bottom')}} />;
      })}
      {hs.map((y) => {
        const [a, b] = hExt(y);
        return <div key={`h${y}`} style={{position: 'absolute', top: y - 1, left: a, height: 2, width: b - a, background: dash('to right')}} />;
      })}
      {vs.map((x) =>
        hs.map((y) => {
          const [a, b] = vExt(x), [c, d] = hExt(y);
          return y >= a - 1 && y <= b + 1 && x >= c - 1 && x <= d + 1 ? <div key={`${x}-${y}`} style={{position: 'absolute', left: x - 6, top: y - 6, width: 12, height: 12, borderRadius: 6, background: color}} /> : null;
        }),
      )}
    </AbsoluteFill>
  );
};
const Grain: React.FC = () => <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '512px', opacity: 0.13, mixBlendMode: 'multiply', pointerEvents: 'none'}} />;
// content is laid out at its final size and scaled to fit the live cell, so a moving cell can never crop it
const Fit: React.FC<{r: {x: number; y: number; w: number; h: number}; fin: {w: number; h: number}; children: React.ReactNode}> = ({r, fin, children}) => {
  if (r.w < 2 || r.h < 2) return null;
  const k = Math.min(r.w / Math.max(1, fin.w), r.h / Math.max(1, fin.h));
  return (
    <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: r.w / 2 - fin.w / 2, top: r.h / 2 - fin.h / 2, width: fin.w, height: fin.h, transform: `scale(${k})`}}>{children}</div>
    </div>
  );
};
const Box: React.FC<{r: {x: number; y: number; w: number; h: number}; children: React.ReactNode}> = ({r, children}) =>
  r.w < 2 || r.h < 2 ? null : <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, overflow: 'hidden'}}>{children}</div>;

const SFX: [number, string, number][] = (() => {
  const s: [number, string, number][] = [[0, 'digital-scan-subtle', 0.5]];
  // one soft move for every grid change, on the frame the lines start to travel
  BEATS.slice(1).forEach((b, i) => s.push([b.at, i % 2 ? 'whoosh-fast-soft' : 'swipe-slow-firm', 0.4]));
  const hit = (beat: number, f: number, name = 'impact-heavy-firm', v = 0.85) => s.push([BEATS[beat].at + f, name, v]);
  hit(0, 72, 'impact-medium-soft', 0.8); hit(0, 82);
  hit(1, 34, 'shimmer-short-soft', 0.5); hit(1, 45);
  hit(2, 33, 'impact-medium-soft', 0.75); hit(2, 45);
  hit(3, 63); hit(3, 72, 'foley-paper-slide', 0.8);
  hit(4, 10, 'writing-pencil-draw', 0.45); hit(4, 57);
  hit(6, 12, 'keyboard-typing-steady-medium', 0.4); hit(6, 66);
  hit(7, 14, 'writing-pencil-draw', 0.4); hit(7, 66); hit(7, 84, 'tone-step-1', 0.45); hit(7, 96, 'tone-step-4', 0.5);
  hit(8, 42, 'boom-hit-soft', 0.9);
  hit(10, 42, 'boom-hit-soft', 0.9);
  hit(11, 36, 'keyboard-typing-quick-short', 0.45); hit(11, 50, 'writing-pencil-tick', 0.55);
  hit(12, 14, 'pop-large-in', 0.5); hit(12, 46, 'digital-process-subtle', 0.4); hit(12, 54);
  hit(13, 10); hit(14, 10, 'impact-medium-soft', 0.8); hit(15, 10); hit(15, 8, 'mechanical-shutter-light', 0.6); hit(16, 10);
  hit(17, 18, 'pop-large-in', 0.6); hit(17, 29, 'pop-large-in', 0.6); hit(17, 40, 'pop-large-bubble', 0.65); hit(17, 42, 'sting-warm-short', 0.5);
  return s;
})();

export const BlueprintHintonLandscape: React.FC<{sound?: boolean}> = ({sound = true}) => {
  const F = useCurrentFrame();
  let i = 0;
  while (i < BEATS.length - 1 && F >= BEATS[i + 1].at) i++;
  const cur = BEATS[i], prev = i > 0 ? BEATS[i - 1] : null;
  const f = F - cur.at;
  const tr = cur.tr ?? 16;
  const g = prev ? easeIO(p01(f, 0, tr)) : 1;
  const Lc: Lines = {v: cur.v, h: cur.h};
  const Lp: Lines = prev ? {v: prev.v, h: prev.h} : Lc;
  const live: Lines = {v: Lc.v.map((x, k) => Lp.v[k] + (x - Lp.v[k]) * g), h: Lc.h.map((y, k) => Lp.h[k] + (y - Lp.h[k]) * g)};
  const inTr = prev !== null && f < tr;
  const prevF = prev ? cur.at - prev.at - 1 : 0;
  const mainS = cur.main ?? MAIN;
  const main = rectOf(live, mainS);
  const q = prev ? p01(f, 0, 8) : 1; // ground and image dissolve while the lines are still travelling
  // with no new image the old one leaves before any new words arrive; at the pause it rides the closing cell
  const plain = !!prev?.plain;
  const qM = plain ? p01(f, 5, 12) : q; // after a drawing or numbers, the new image waits until they are gone
  const out = cur.media ? (plain ? 1 - p01(f, 0, 5) : 1 - q) : cur.text ? 1 - p01(f, 0, 6) : 1 - p01(f, tr * 0.45, tr);
  const pm = rectOf(Lp, prev?.main ?? MAIN);
  const fin = rectOf(Lc, mainS);
  const fade = interpolate(F, [LS_FRAMES - 10, LS_FRAMES - 1], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <AbsoluteFill style={{opacity: fade}}>
        {prev && q < 1 && <AbsoluteFill style={{background: prev.ground}} />}
        <AbsoluteFill style={{background: cur.ground, opacity: q}} />
        {prev && q < 1 && <Guides L={live} color={prev.ink} o={1 - q} />}
        <Guides L={live} color={cur.ink} o={q} />
        {cur.text?.(f, geoOf(Lc), Lc)}
        {/* the image lives in the moving cell: old and new dissolve in place, each scaled whole to the live cell */}
        {inTr && prev?.media && out > 0 && <div style={{opacity: out}}><Fit r={rectOf(live, prev.main ?? MAIN)} fin={pm}>{prev.media(prevF, pm.w, pm.h)}</Fit></div>}
        {inTr && prev?.extras?.map((e, k) => {
          const r = rectOf(live, e.r), pr = rectOf(Lp, e.r);
          const eo = 1 - p01(f, 0, 6);
          return eo > 0 ? <div key={`p${k}`} style={{opacity: eo}}><Fit r={r} fin={pr}>{e.render(prevF, pr.w, pr.h)}</Fit></div> : null;
        })}
        {cur.media && <div style={{opacity: qM}}><Fit r={main} fin={fin}>{cur.media(f, fin.w, fin.h)}</Fit></div>}
        {cur.extras?.map((e, k) => {
          const r = rectOf(live, e.r), fr = rectOf(Lc, e.r);
          return <Fit key={k} r={r} fin={fr}>{e.render(f, fr.w, fr.h)}</Fit>;
        })}
        <Grain />
      </AbsoluteFill>
      {sound &&
        SFX.map(([at, name, vol], k) => {
          const s = KIT[name];
          return (
            <Sequence key={k} from={Math.max(0, at - Math.round(s.sync * LS_FPS))} durationInFrames={Math.ceil(s.dur * LS_FPS) + 2}>
              <Audio src={staticFile(`sfx/kit/${s.file}`)} volume={vol} />
            </Sequence>
          );
        })}
    </AbsoluteFill>
  );
};
