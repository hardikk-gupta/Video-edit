// "Everyone mocked it" EP. 01 — Geoffrey Hinton, Blueprint Cut as ONE TAKE (v5).
// One grid lives for the whole film: 4 vertical and 5 horizontal guide lines that slide, split and merge between
// beats. Nothing cuts. A new ground colour grows out of the main cell, the new image wipes in inside the moving
// cell, and all type sits at least 40 px away from every guide. Faces are never cropped.
// 1080×1920, 30 fps. Built silent at 2.7 words/s; BEATS[].at and the word frames re-time it to a voice-over.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {KIT} from './sfxkit';

export const BP_W = 1080;
export const BP_H = 1920;
export const BP_FPS = 30;
export const BP_FRAMES = 1272;

const PAPER = '#ebe3db';
const INK = '#100d13';
const BLACK = '#050306';
const COBALT = '#002ca8';
const COBALT_TYPE = '#183a96';
const SOFT_BLUE = '#7f93d6';
const CREAM = '#efe8df';
const WHITE = '#f6f4f5';
const PAD = 44; // minimum space between any type and any guide
const CAP = 0.74; // Anton cap height as a share of font size (measured on a render)
const SHIFT = 0.0; // vertical correction so the caps sit centred in that box (measured on a render)

const fonts: [string, string, FontFaceDescriptors][] = [
  ['Anton', 'fonts/Anton.woff2', {}],
  ['Space Mono', 'fonts/SpaceMono-400.woff2', {weight: '400'}],
  ['Space Mono', 'fonts/SpaceMono-700.woff2', {weight: '700'}],
  ['EB Garamond', 'fonts/eb-garamond-latin-500-italic.woff2', {style: 'italic', weight: '500'}],
  ['Inter', 'fonts/Inter-SemiBold.otf', {weight: '600'}],
];
if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
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

// ---------- type
const Setup: React.FC<{f: number; L: Lines; words: string[]; at: number[]; color: string; size?: number}> = ({f, L, words, at, color, size = 32}) => (
  <div style={{position: 'absolute', left: L.v[0] + PAD, top: L.h[0] - PAD - 46, width: 820, fontFamily: 'Space Mono', fontSize: size, letterSpacing: '0.16em', color, lineHeight: '46px', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
    {words.map((w, i) => (
      <span key={i} style={{opacity: f >= at[i] ? 1 : 0}}>{w} </span>
    ))}
  </div>
);
// payoff word centred between the two guides of its text cell; optional sub-line beside it, or a caption under it
const Payoff: React.FC<{f: number; at: number; text: string; top: number; bottom: number; size: number; color: string; sub?: string; subAt?: number; subColor?: string; caption?: string; capAt?: number}> = ({f, at, text, top, bottom, size, color, sub, subAt = 0, subColor, caption, capAt = 0}) =>
  f < at ? null : (
    <div style={{position: 'absolute', left: 90 + PAD, top, height: bottom - top, width: 900 - PAD * 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, whiteSpace: 'nowrap'}}>
        <div style={{fontFamily: 'Anton', fontSize: size, lineHeight: `${size * CAP}px`, height: size * CAP, color, display: 'flex', alignItems: 'center'}}>
          <span style={{display: 'block', lineHeight: 1, transform: `translateY(${size * SHIFT}px)`}}>{text}</span>
        </div>
        {sub && <div style={{fontFamily: 'Space Mono', fontSize: 40, letterSpacing: '0.14em', lineHeight: 1.15, color: subColor ?? color, textTransform: 'uppercase', whiteSpace: 'pre', opacity: f >= subAt ? 1 : 0}}>{sub}</div>}
      </div>
      {caption && <div style={{fontFamily: 'Space Mono', fontSize: 34, letterSpacing: '0.1em', lineHeight: 1, color: subColor ?? color, whiteSpace: 'nowrap', opacity: f >= capAt ? 1 : 0}}>{caption}</div>}
    </div>
  );

const Cover: React.FC<{src: string; pos?: string; style?: React.CSSProperties}> = ({src, pos = '50% 10%', style}) => (
  <Img src={img(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, ...style}} />
);

// our own neural-network line drawing, sized to its box
const LAYERS = [3, 5, 5, 2];
const Net: React.FC<{w: number; h: number; draw: number; stroke: string; node: string}> = ({w, h, draw, stroke, node}) => {
  const pos = (l: number, i: number) => ({x: w * (0.14 + l * 0.24), y: h / 2 + (i - (LAYERS[l] - 1) / 2) * (h * 0.165)});
  const lines: React.ReactNode[] = [];
  let n = 0;
  const total = 50;
  for (let l = 0; l < 3; l++)
    for (let i = 0; i < LAYERS[l]; i++)
      for (let j = 0; j < LAYERS[l + 1]; j++) {
        const a = pos(l, i), b = pos(l + 1, j);
        if (n / total < draw) lines.push(<line key={n} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={stroke} strokeWidth={1.6} opacity={0.55} />);
        n++;
      }
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
      {lines}
      {LAYERS.map((c, l) => Array.from({length: c}).map((_, i) => (draw > l / 4 ? <circle key={`${l}-${i}`} cx={pos(l, i).x} cy={pos(l, i).y} r={Math.min(20, h * 0.03)} fill={node} stroke={stroke} strokeWidth={2.5} /> : null)))}
    </svg>
  );
};

// ---------- beats. f is the frame inside the beat. Word frames are local to the beat.
type Beat = {
  at: number;
  ground: string;
  ink: string;
  v: number[];
  h: number[];
  tr?: number; // frames the grid takes to reach this layout
  media?: (f: number, w: number, h: number) => React.ReactNode; // main cell
  extras?: {r: Slots; render: (f: number, w: number, h: number) => React.ReactNode}[];
  text?: (f: number, L: Lines) => React.ReactNode;
};
const V2 = [90, 990, 90, 990];
const FLICK = ['CRAZY.', 'NONSENSE.', 'WASTE OF TIME.', 'GIVE UP.'];
const tearOff = 'polygon(0% 0%, 30% 0%, 24% 9%, 33% 18%, 25% 29%, 34% 40%, 26% 52%, 35% 63%, 27% 75%, 34% 87%, 28% 100%, 0% 100%)';
const tearKeep = 'polygon(100% 0%, 100% 100%, 28% 100%, 34% 87%, 27% 75%, 35% 63%, 26% 52%, 34% 40%, 25% 29%, 33% 18%, 24% 9%, 30% 0%)';

const BEATS: Beat[] = [
  {
    // hook — halftone portrait builds from dots; the things they said tick through a band under his face
    at: 0, ground: PAPER, ink: COBALT_TYPE, v: V2, h: [330, 1010, 1310, 1310, 1310],
    media: (f, w) => {
      const r = interpolate(f, [0, 10], [0, 11], clamp);
      const k = Math.min(3, Math.floor(Math.max(0, f - 12) / 15));
      return (
        <>
          <Img src={img('halftone.png')} style={{position: 'absolute', left: (w - 720) / 2, top: 0, width: 720, WebkitMaskImage: r < 10.5 ? `radial-gradient(circle, #000 ${r}px, transparent ${r + 0.8}px)` : undefined, WebkitMaskSize: '15px 15px'}} />
          {f >= 12 && (
            <div style={{position: 'absolute', left: 0, bottom: 0, width: w, height: 112, background: COBALT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono', fontWeight: 700, fontSize: 48, letterSpacing: '0.16em', color: CREAM}}>{FLICK[k]}</div>
          )}
        </>
      );
    },
    text: (f, L) => (
      <>
        <Setup f={f} L={L} words={['For', '40', 'years', 'they', 'called', 'his', 'bet', 'a']} at={[14, 20, 26, 38, 44, 54, 60, 68]} color={COBALT_TYPE} size={31} />
        {f >= 72 && (
          <div style={{position: 'absolute', left: 90 + PAD, top: L.h[1], height: L.h[2] - L.h[1], display: 'flex', alignItems: 'center', fontFamily: 'Anton', fontSize: 214, lineHeight: 1, color: COBALT_TYPE, whiteSpace: 'nowrap'}}>
            <span style={{transform: `translateY(${214 * SHIFT}px)`}}>
              DEAD <span style={{opacity: f >= 82 ? 1 : 0}}>END.</span>
            </span>
          </div>
        )}
      </>
    ),
  },
  {
    // nobel — the cell splits in two: portrait left, medal right
    at: 105, ground: COBALT, ink: CREAM, v: [90, 640, 90, 990], h: [400, 1090, 1400, 1400, 1400],
    media: (f, w) => <Img src={img('sticker.png')} style={{position: 'absolute', left: (w - 542) / 2, bottom: -4, height: 640}} />,
    extras: [
      {
        r: [1, 3, 0, 1],
        render: (f, w, h) => {
          const m = easeOut(p01(f, 30, 40));
          return m <= 0 || w < 200 ? null : (
            <div style={{position: 'absolute', left: w / 2 - 120, top: h / 2 - 120, width: 240, height: 240, borderRadius: 120, background: CREAM, transform: `scale(${0.4 + 0.6 * m}) rotate(${(1 - m) * -30}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 204, height: 204, borderRadius: 102, border: `3px solid ${COBALT_TYPE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Anton', fontSize: 72, color: COBALT_TYPE}}>2024</div>
            </div>
          );
        },
      },
    ],
    text: (f, L) => (
      <>
        <Setup f={f} L={L} words={['In', '2024', 'it', 'won', 'the']} at={[10, 16, 28, 33, 40]} color={CREAM} />
        <Payoff f={f} at={45} text="NOBEL" top={L.h[1]} bottom={L.h[2]} size={230} color={CREAM} sub={'PRIZE IN\nPHYSICS'} subAt={53} />
      </>
    ),
  },
  {
    // name — one wide cell with his whole face, then two type cells stack under it
    at: 183, ground: INK, ink: CREAM, v: V2, h: [330, 870, 1150, 1430, 1430],
    media: () => <Cover src="c23_bw.jpg" pos="50% 0%" />,
    text: (f, L) => (
      <>
        <Setup f={f} L={L} words={['His', 'name', 'is']} at={[16, 20, 25]} color={CREAM} />
        <Payoff f={f} at={33} text="GEOFFREY" top={L.h[1]} bottom={L.h[2]} size={206} color={CREAM} />
        <Payoff f={f} at={45} text="HINTON" top={L.h[2]} bottom={L.h[3]} size={206} color={SOFT_BLUE} />
      </>
    ),
  },
  {
    // give up — a corner of the photo tears away after the word lands (never the face)
    at: 255, ground: PAPER, ink: COBALT_TYPE, v: V2, h: [420, 1020, 1330, 1330, 1330],
    media: (f) => {
      const t = p01(f, 71, 86);
      return (
        <>
          <div style={{position: 'absolute', inset: 0, background: WHITE}} />
          <div style={{position: 'absolute', inset: 0, clipPath: tearKeep}}><Cover src="c23wide_bw.jpg" pos="50% 50%" /></div>
          <div style={{position: 'absolute', inset: 0, clipPath: tearOff, transform: `translate(${-70 * t}px, ${60 * t * t}px) rotate(${-9 * t}deg)`, transformOrigin: '0% 0%', opacity: 1 - p01(f, 78, 88)}}><Cover src="c23wide_bw.jpg" pos="50% 50%" /></div>
        </>
      );
    },
    text: (f, L) => (
      <>
        <Setup f={f} L={L} words={['His', 'own', 'supervisor', 'told', 'him', 'to']} at={[16, 21, 26, 40, 46, 52]} color={COBALT_TYPE} />
        <Payoff f={f} at={63} text="GIVE UP." top={L.h[1]} bottom={L.h[2]} size={236} color={COBALT_TYPE} />
      </>
    ),
  },
  {
    // waste — two new guides split the cell into three columns; on the word the columns slip out of register
    at: 351, ground: INK, ink: CREAM, v: [90, 990, 390, 690], h: [420, 1100, 1410, 1410, 1410],
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
    text: (f, L) => (
      <>
        <Setup f={f} L={L} words={['They', 'said', 'neural', 'networks', 'were', 'a']} at={[10, 15, 21, 29, 42, 50]} color={CREAM} />
        <Payoff f={f} at={57} text="WASTE" top={L.h[1]} bottom={L.h[2]} size={236} color={CREAM} sub={'OF\nTIME.'} subAt={69} />
      </>
    ),
  },
  {
    // toronto — the grid closes to one quiet band
    at: 438, ground: BLACK, ink: CREAM, v: V2, h: [640, 1060, 1060, 1060, 1060],
    text: (f, L) => (
      <>
        <div style={{position: 'absolute', left: 90, top: L.h[0], width: 900, height: L.h[1] - L.h[0], display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'EB Garamond', fontStyle: 'italic', fontWeight: 500, fontSize: 134, lineHeight: 1.06, color: CREAM, opacity: f >= 12 ? 1 : 0}}>
          So he moved
          <br />
          to Toronto.
        </div>
        <div style={{position: 'absolute', left: 90, top: L.h[1] + PAD, width: 900, textAlign: 'center', fontFamily: 'Space Mono', fontSize: 36, letterSpacing: '0.14em', color: CREAM, opacity: f >= 26 ? 0.9 : 0}}>UNIVERSITY OF TORONTO · 1987</div>
      </>
    ),
  },
  {
    // years — the band opens into a counter cell over a ruler cell
    at: 492, ground: PAPER, ink: COBALT_TYPE, v: V2, h: [420, 720, 1090, 1400, 1400],
    media: (f, w, h) => {
      const cur = Math.min(25, Math.floor(p01(f, 12, 62) * 26));
      return <div style={{position: 'absolute', left: PAD, top: (h - 210) / 2 - 8, fontFamily: 'Anton', fontSize: 210, lineHeight: 1, color: INK}}>{1987 + cur}</div>;
    },
    extras: [
      {
        r: [0, 1, 1, 2],
        render: (f, w, h) => {
          const cur = Math.min(25, Math.floor(p01(f, 12, 62) * 26));
          return h < 200 ? null : (
            <div style={{position: 'absolute', left: PAD, top: PAD, width: w - PAD * 2, display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', rowGap: 26}}>
              {Array.from({length: 26}).map((_, i) => (
                <div key={i} style={{height: 126}}>
                  <div style={{width: 7, height: 88, background: i <= cur ? COBALT_TYPE : 'rgba(16,13,19,0.16)'}} />
                  <div style={{fontFamily: 'Space Mono', fontSize: 22, marginTop: 6, color: i <= cur ? COBALT_TYPE : 'rgba(16,13,19,0.32)'}}>{String((87 + i) % 100).padStart(2, '0')}</div>
                </div>
              ))}
            </div>
          );
        },
      },
    ],
    text: (f, L) => (
      <>
        <Setup f={f} L={L} words={['And', 'kept', 'going.', 'For']} at={[10, 15, 21, 56]} color={COBALT_TYPE} />
        <Payoff f={f} at={66} text="25 MORE" top={L.h[2]} bottom={L.h[3]} size={178} color={COBALT_TYPE} sub="YEARS." subAt={78} />
      </>
    ),
  },
  {
    // 2012 — the cell splits down the middle: everyone else on the left, his students on the right
    at: 594, ground: INK, ink: CREAM, v: [90, 540, 90, 990], h: [420, 1100, 1410, 1410, 1410],
    media: (f, w) => {
      const b = easeOut(p01(f, 82, 96));
      return (
        <>
          <div style={{position: 'absolute', left: PAD, top: PAD, fontFamily: 'Space Mono', fontSize: 32, letterSpacing: '0.12em', color: CREAM, opacity: 0.85}}>EVERYONE ELSE</div>
          <div style={{position: 'absolute', left: PAD, bottom: PAD, width: w - PAD * 2, height: 392 * b, background: 'rgba(239,232,223,0.26)'}} />
          <div style={{position: 'absolute', left: PAD, bottom: PAD + 392 * b + 8, fontFamily: 'Anton', fontSize: 92, color: CREAM, opacity: b > 0.9 ? 0.85 : 0}}>26.2%</div>
        </>
      );
    },
    extras: [
      {
        r: [1, 3, 0, 1],
        render: (f, w, h) => {
          const b = easeOut(p01(f, 90, 104));
          return w < 200 ? null : (
            <>
              <div style={{position: 'absolute', left: PAD, top: PAD, fontFamily: 'Space Mono', fontSize: 32, letterSpacing: '0.12em', color: SOFT_BLUE}}>HIS STUDENTS</div>
              {f < 84 && (
                <div style={{position: 'absolute', left: 0, top: 110, width: w, height: h - 150}}>
                  <Net w={w} h={h - 150} draw={p01(f, 14, 62)} stroke={CREAM} node={INK} />
                </div>
              )}
              <div style={{position: 'absolute', left: PAD, bottom: PAD, width: w - PAD * 2, height: 229 * b, background: SOFT_BLUE}} />
              <div style={{position: 'absolute', left: PAD, bottom: PAD + 229 * b + 8, fontFamily: 'Anton', fontSize: 92, color: SOFT_BLUE, opacity: b > 0.9 ? 1 : 0}}>15.3%</div>
            </>
          );
        },
      },
    ],
    text: (f, L) => (
      <>
        <Setup f={f} L={L} words={['Then,', 'in', '2012,', 'two', 'students', 'built']} at={[10, 15, 20, 32, 40, 54]} color={CREAM} />
        <Payoff f={f} at={66} text="ONE NETWORK." top={L.h[1]} bottom={L.h[2]} size={150} color={CREAM} caption="FEWER ERRORS. IT BEAT EVERY RIVAL." capAt={96} subColor={SOFT_BLUE} />
      </>
    ),
  },
  {
    // every AI — the two cells merge back into one tall cell
    at: 720, ground: INK, ink: CREAM, v: V2, h: [330, 1090, 1400, 1400, 1400],
    media: (f) => <Cover src="c24_cob.jpg" pos="50% 6%" style={{transform: `scale(${1 + 0.04 * p01(f, 0, 90)})`, transformOrigin: '50% 30%'}} />,
    text: (f, L) => (
      <>
        <Setup f={f} L={L} words={['Today', 'that', 'idea', 'runs', 'nearly']} at={[10, 15, 20, 26, 32]} color={CREAM} />
        <Payoff f={f} at={42} text="EVERY AI" top={L.h[1]} bottom={L.h[2]} size={204} color={CREAM} sub={'YOU\nUSE.'} subAt={56} />
      </>
    ),
  },
  {
    // the pause — every guide folds into a single cross
    at: 810, ground: BLACK, ink: CREAM, v: [540, 540, 540, 540], h: [840, 840, 840, 840, 840], tr: 12,
  },
  {
    // right — the cross opens back into the cell, his whole face
    at: 828, ground: INK, ink: CREAM, v: V2, h: [420, 1100, 1410, 420, 1100],
    media: (f) => <Cover src="c24_bw.jpg" pos="50% 6%" style={{transform: `scale(${1 + 0.04 * p01(f, 0, 66)})`, transformOrigin: '50% 30%'}} />,
    text: (f, L) => (
      <>
        <Setup f={f} L={L} words={['40', 'years', 'later,', 'he', 'was']} at={[10, 15, 21, 32, 37]} color={CREAM} />
        <Payoff f={f} at={42} text="RIGHT." top={L.h[1]} bottom={L.h[2]} size={236} color={CREAM} />
      </>
    ),
  },
  {
    // the question — one band
    at: 894, ground: COBALT, ink: CREAM, v: V2, h: [590, 1110, 1110, 590, 1110],
    text: (f, L) => {
      const k = Math.floor((f - 36) / 4);
      const styles: React.CSSProperties[] = [
        {fontFamily: 'Anton', fontSize: 140},
        {fontFamily: 'Space Mono', fontSize: 88},
        {fontFamily: 'Inter', fontWeight: 600, fontSize: 108},
        {fontFamily: 'EB Garamond', fontStyle: 'italic', fontWeight: 500, fontSize: 152},
      ];
      const u = easeOut(p01(f, 50, 64));
      return (
        <>
          <div style={{position: 'absolute', left: 90, top: L.h[0] + PAD + 20, width: 900, textAlign: 'center', fontFamily: 'EB Garamond', fontStyle: 'italic', fontWeight: 500, fontSize: 96, color: CREAM, opacity: f >= 14 ? 1 : 0}}>How long would you</div>
          {f >= 36 && <div style={{position: 'absolute', left: 90 + PAD, top: L.h[0] + 200, width: 900 - PAD * 2, height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center', color: WHITE, whiteSpace: 'nowrap', ...styles[Math.max(0, Math.min(3, k))]}}>have lasted?</div>}
          <div style={{position: 'absolute', left: 170, top: L.h[0] + 404, width: 740 * u, height: 5, borderRadius: 3, background: WHITE}} />
        </>
      );
    },
  },
  {
    // early — the band subdivides into a 3×3 grid; cells switch on one by one, the first one alone for a while
    at: 972, ground: PAPER, ink: COBALT_TYPE, v: [90, 990, 390, 690], h: [420, 1110, 1420, 650, 880],
    media: (f, w, h) => {
      const order = [4, 1, 3, 5, 7, 0, 2, 6, 8];
      const on = f < 14 ? 0 : f < 46 ? 1 : Math.min(9, 1 + Math.floor((f - 46) / 2.2));
      return (
        <>
          {order.map((c, i) => {
            const lit = i < on;
            return (
              <div key={c} style={{position: 'absolute', left: (w / 3) * (c % 3), top: (h / 3) * Math.floor(c / 3), width: w / 3, height: h / 3, background: lit ? COBALT_TYPE : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: 46, height: 46, borderRadius: 23, background: lit ? CREAM : 'transparent', border: `3px solid ${lit ? CREAM : COBALT_TYPE}`}} />
              </div>
            );
          })}
        </>
      );
    },
    text: (f, L) => (
      <>
        <Setup f={f} L={L} words={['Your', 'idea', "isn't", 'dead.', "It's"]} at={[10, 15, 20, 26, 46]} color={COBALT_TYPE} />
        <Payoff f={f} at={54} text="EARLY." top={L.h[1]} bottom={L.h[2]} size={236} color={COBALT_TYPE} />
      </>
    ),
  },
  {
    at: 1056, ground: WHITE, ink: COBALT_TYPE, v: V2, h: [420, 1100, 1410, 420, 1100], tr: 10,
    media: () => <Cover src="c24_poster.jpg" pos="50% 8%" />,
    text: (f, L) => <Payoff f={f} at={4} text="KEEP GOING." top={L.h[1]} bottom={L.h[2]} size={176} color={COBALT_TYPE} />,
  },
  {
    at: 1086, ground: PAPER, ink: COBALT_TYPE, v: V2, h: [690, 1110, 1110, 690, 1110], tr: 9,
    text: (f, L) => (f < 3 ? null : <div style={{position: 'absolute', left: 90, top: L.h[0], width: 900, height: L.h[1] - L.h[0], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Anton', fontSize: 300, lineHeight: 1, color: COBALT_TYPE}}>POST.</div>),
  },
  {
    at: 1110, ground: INK, ink: CREAM, v: V2, h: [330, 1090, 1400, 330, 1090], tr: 9,
    media: (f) => <Cover src={f >= 9 && f < 12 ? 'c23_neg.jpg' : 'c23_bw.jpg'} pos="50% 0%" />,
    text: (f, L) => <Payoff f={f} at={3} text="LEARN." top={L.h[1]} bottom={L.h[2]} size={236} color={CREAM} />,
  },
  {
    at: 1134, ground: INK, ink: CREAM, v: V2, h: [330, 1090, 1400, 330, 1090], tr: 9,
    media: () => <Cover src="c23_cob.jpg" pos="50% 0%" />,
    text: (f, L) => <Payoff f={f} at={3} text="AGAIN." top={L.h[1]} bottom={L.h[2]} size={236} color={SOFT_BLUE} />,
  },
  {
    // follow — the medal from the Nobel beat comes back as the card
    at: 1164, ground: INK, ink: CREAM, v: V2, h: [420, 1100, 1410, 420, 1100],
    media: (f, w, h) => {
      const d = easeOut(p01(f, 4, 16));
      const R = Math.min(w, h) / 2 - PAD;
      const words: [string, number][] = [['FOLLOW', 12], ['FOR', 24], ['MORE.', 36]];
      return (
        <div style={{position: 'absolute', left: w / 2 - R, top: h / 2 - R, width: R * 2, height: R * 2, borderRadius: R, background: CREAM, transform: `scale(${0.4 + 0.6 * d}) rotate(${(1 - d) * -24}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: R * 2 - 44, height: R * 2 - 44, borderRadius: R, border: `4px solid ${COBALT_TYPE}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            {words.map(([wd, at]) => (
              <div key={wd} style={{fontFamily: 'Anton', fontSize: R * 0.44, lineHeight: 1.06, color: COBALT_TYPE, opacity: f >= at ? 1 : 0}}>{wd}</div>
            ))}
          </div>
        </div>
      );
    },
    text: (f, L) => (
      <>
        <div style={{position: 'absolute', left: 90 + PAD, top: L.h[0] - PAD - 46, width: 900 - PAD * 2, display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Mono', fontSize: 32, letterSpacing: '0.16em', lineHeight: '46px', color: CREAM, opacity: f >= 18 ? 1 : 0}}>
          <span>EVERYONE MOCKED IT.</span>
          <span>EP. 01</span>
        </div>
        <div style={{position: 'absolute', left: 90, top: L.h[1], width: 900, height: L.h[2] - L.h[1], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, color: CREAM, opacity: f >= 42 ? 1 : 0}}>
          <div style={{fontFamily: 'Space Mono', fontWeight: 700, fontSize: 52, letterSpacing: '0.12em'}}>@HAHA.HARDIKK</div>
          <div style={{fontFamily: 'Space Mono', fontSize: 27, letterSpacing: '0.06em', textAlign: 'center', lineHeight: 1.5, opacity: 0.9}}>
            PHOTOS: COLLISION / SPORTSFILE,
            <br />
            S. JURVETSON · CC BY 2.0
          </div>
        </div>
      </>
    ),
  },
];

// ---------- the one grid
const Guides: React.FC<{L: Lines; color: string; o?: number}> = ({L, color, o = 1}) => {
  const dash = (dir: string) => `repeating-linear-gradient(${dir}, ${color} 0 9px, transparent 9px 18px)`;
  const vs = Array.from(new Set(L.v.map((x) => Math.round(x)))), hs = Array.from(new Set(L.h.map((y) => Math.round(y))));
  const vMin = Math.min(...vs), vMax = Math.max(...vs);
  const m0 = Math.round(Math.min(L.h[0], L.h[1])), m1 = Math.round(Math.max(L.h[0], L.h[1]));
  const innerV = (x: number) => x > vMin + 2 && x < vMax - 2;
  const innerH = (y: number) => y > m0 + 2 && y < m1 - 2;
  return (
    <AbsoluteFill style={{opacity: 0.62 * o, pointerEvents: 'none'}}>
      {vs.map((x) => <div key={`v${x}`} style={{position: 'absolute', left: x - 1, top: innerV(x) ? m0 : 0, width: 2, height: innerV(x) ? m1 - m0 : BP_H, background: dash('to bottom')}} />)}
      {hs.map((y) => <div key={`h${y}`} style={{position: 'absolute', top: y - 1, left: innerH(y) ? vMin : 0, height: 2, width: innerH(y) ? vMax - vMin : BP_W, background: dash('to right')}} />)}
      {vs.map((x) => hs.map((y) => ((innerV(x) && (y < m0 || y > m1)) || (innerH(y) && (x < vMin || x > vMax)) ? null : <div key={`${x}-${y}`} style={{position: 'absolute', left: x - 6, top: y - 6, width: 12, height: 12, borderRadius: 6, background: color}} />)))}
    </AbsoluteFill>
  );
};
const Grain: React.FC = () => <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '512px', opacity: 0.13, mixBlendMode: 'multiply', pointerEvents: 'none'}} />;
const Box: React.FC<{r: {x: number; y: number; w: number; h: number}; children: React.ReactNode; clip?: string; bg?: string}> = ({r, children, clip, bg}) =>
  r.w < 2 || r.h < 2 ? null : <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, overflow: 'hidden', clipPath: clip, background: bg}}>{children}</div>;

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
  hit(13, 4); hit(14, 3, 'impact-medium-soft', 0.8); hit(15, 3); hit(15, 8, 'mechanical-shutter-light', 0.6); hit(16, 3);
  hit(17, 12, 'pop-large-in', 0.6); hit(17, 24, 'pop-large-in', 0.6); hit(17, 36, 'pop-large-bubble', 0.65); hit(17, 38, 'sting-warm-short', 0.5);
  return s;
})();

export const BlueprintHinton: React.FC<{sound?: boolean}> = ({sound = true}) => {
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
  const main = rectOf(live, MAIN);
  const q = prev ? p01(f, 0, 8) : 1; // ground and image dissolve while the lines are still travelling
  const out = cur.media ? 1 - q : 1 - p01(f, tr * 0.45, tr); // with no new image, the old one rides the closing cell
  const fade = interpolate(F, [BP_FRAMES - 10, BP_FRAMES - 1], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <AbsoluteFill style={{opacity: fade}}>
        {prev && q < 1 && <AbsoluteFill style={{background: prev.ground}} />}
        <AbsoluteFill style={{background: cur.ground, opacity: q}} />
        {prev && q < 1 && <Guides L={live} color={prev.ink} o={1 - q} />}
        <Guides L={live} color={cur.ink} o={q} />
        {cur.text?.(f, Lc)}
        {/* the image lives in the moving cell: old and new dissolve in place, so a face is never half covered */}
        {inTr && prev?.media && out > 0 && <div style={{opacity: out}}><Box r={main}>{prev.media(prevF, main.w, main.h)}</Box></div>}
        {inTr && prev?.extras?.map((e, k) => {
          const r = rectOf(live, e.r);
          const eo = 1 - p01(f, 0, 6);
          return eo > 0 ? <div key={`p${k}`} style={{opacity: eo}}><Box r={r}>{e.render(prevF, r.w, r.h)}</Box></div> : null;
        })}
        {cur.media && <div style={{opacity: q}}><Box r={main}>{cur.media(f, main.w, main.h)}</Box></div>}
        {cur.extras?.map((e, k) => {
          const r = rectOf(live, e.r);
          return <Box key={k} r={r}>{e.render(f, r.w, r.h)}</Box>;
        })}
        <Grain />
      </AbsoluteFill>
      {sound &&
        SFX.map(([at, name, vol], k) => {
          const s = KIT[name];
          return (
            <Sequence key={k} from={Math.max(0, at - Math.round(s.sync * BP_FPS))} durationInFrames={Math.ceil(s.dur * BP_FPS) + 2}>
              <Audio src={staticFile(`sfx/kit/${s.file}`)} volume={vol} />
            </Sequence>
          );
        })}
    </AbsoluteFill>
  );
};
