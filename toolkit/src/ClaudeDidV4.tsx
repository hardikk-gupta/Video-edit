import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import faceRaw from './wa1832-face.json';

// "Claude did" v4 (2026-10-27). Same brief as v3 (speaker in the bottom panel, graphics on top; split +
// caption-edit + whiteout + paper-drawer; doodle pet; zoom cuts; omni-restyle; sfx-design), told as one story:
// the doodle pet is the editor.
//   "a single second of this video"  -> the pet drops the last clip into the timeline; counter shows 0
//   "Claude did."                     -> the camera zooms through the 0 into the white hit (held through the pause)
//   "how this actually works"         -> a pencil line redraws the speaker as a sketch; the pet is stuck at its laptop
//   "own repo … secret methods"       -> folders draw on, padlocks snap shut, push-in, the pet peeks
//   "I will tell you how to do this"  -> the pet's key opens the padlock and the steps write on
// Every doodle draws on stroke by stroke and boils (3-frame wobble); headlines arrive word by word.

export const V4_W = 1080;
export const V4_H = 1920;
const FPS = 30;
const SPEECH = 453;
const END = 48;
export const V4_FRAMES = SPEECH + END;

const C = {white: '#FFFFFF', ink: '#111114', blue: '#2E5BFF', grey: '#6B6B76', paper: '#F4F4F1', line: '#DCDCE2', dot: '#D3D6E0'};
const SANS = 'Inter';
const MONO = 'Space Mono';

const fontsHandle = delayRender('fonts');
Promise.all(
  [
    [SANS, 'Inter-SemiBold.otf', '600'],
    [SANS, 'Inter-Bold.otf', '700'],
    [SANS, 'Inter-Bold.otf', '800'],
    [MONO, 'SpaceMono-400.woff2', '400'],
  ].map(([family, file, weight]) => new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, {weight}).load().then((ff) => document.fonts.add(ff))),
).then(() => continueRender(fontsHandle));

const f = (s: number) => Math.round(s * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const IN = Easing.bezier(0.55, 0, 0.9, 0.3);
const ease = (fr: number, a: number, d: number, e = OUT) => interpolate(fr, [a, a + d], [0, 1], {...clamp, easing: e});
const snap = (fr: number, a: number, d: number) => Math.min(1, ease(fr, a, d) * 1.08);
const pop = (fr: number, a: number) => interpolate(fr, [a, a + 4, a + 6], [0.6, 1.06, 1], clamp);

// ---------- Cuts, face ----------
const CUT_START = [0, 90, 185, 212, 352, 370];
const cutOf = (fr: number) => CUT_START.filter((s) => s <= fr).length - 1;
const centre = (faceRaw as number[][]).map(([x, y, w, h]) => [x + w / 2, y + h / 2, h]);
const smooth = centre.map((_, i) => {
  const c = cutOf(i);
  const lo = Math.max(CUT_START[c], i - 12);
  const hi = Math.min((CUT_START[c + 1] ?? SPEECH) - 1, i + 12);
  const s = centre.slice(lo, hi + 1);
  return [0, 1, 2].map((k) => s.reduce((a, v) => a + v[k], 0) / s.length);
});
const faceAt = (fr: number) => smooth[Math.max(0, Math.min(fr, SPEECH - 1))];

// ---------- Beats ----------
const B = {
  hook: [0, f(1.1)],
  counter: [f(1.1), f(2.56)],
  did: [f(2.56), f(3.3)], // held through the pause before "No one"
  noOne: [f(3.3), f(4.04)],
  how: [f(4.04), 212],
  repos: [212, 352],
  so: [352, f(13.5)],
  steps: [f(13.5), SPEECH],
  end: [SPEECH, V4_FRAMES],
} as const;
type BeatKey = keyof typeof B;
const beatAt = (fr: number): BeatKey => (Object.keys(B) as BeatKey[]).find((k) => fr >= B[k][0] && fr < B[k][1]) ?? 'end';
const SPLIT: BeatKey[] = ['counter', 'how', 'repos', 'steps'];
const FACE: BeatKey[] = ['hook', 'noOne', 'so'];

const SEAM = 920;

// ---------- Footage ----------
const ZOOM_CUTS: [number, number][] = [[f(0.56), 1.16], [f(3.76), 1.18], [f(12.82), 1.16]];
const zoomAt = (fr: number, from: number) => ZOOM_CUTS.filter(([z]) => z >= from && z <= fr).reduce((a, [, s]) => s, 1);

const FaceFull: React.FC<{fr: number; from: number}> = ({fr, from}) => {
  const [cx, cy] = faceAt(fr);
  const S = 1.08 * zoomAt(fr, from) * (1 + 0.012 * ((fr - from) / FPS));
  const tx = Math.min(0, Math.max(V4_W - S * V4_W, V4_W / 2 - S * cx));
  const ty = Math.min(0, Math.max(V4_H - S * V4_H, 1080 - S * cy));
  return <OffthreadVideo muted src={staticFile('wa1832/talk.mp4')} style={{position: 'absolute', left: 0, top: 0, width: V4_W, height: V4_H, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${S})`}} />;
};

const panelFrame = (fr: number, from: number) => {
  const [cx, cy, h] = faceAt(fr);
  const S = Math.max(1, Math.min(1.04, 1 + 0.01 * ((fr - from) / FPS), 960 / (1.38 * h)));
  const top = Math.min(SEAM, Math.max(V4_H - S * V4_H, SEAM + 34 - S * (cy - 0.78 * h)));
  const tx = Math.min(0, Math.max(V4_W - S * V4_W, V4_W / 2 - S * cx));
  return {S, top, tx};
};

// Speaker in the bottom panel. In the "how" beat a pencil line sweeps left→right and redraws him as a sketch.
const SpeakerPanel: React.FC<{fr: number; from: number; sketchFrom?: number}> = ({fr, from, sketchFrom}) => {
  const {S, top, tx} = panelFrame(fr, from);
  const vs = {position: 'absolute' as const, left: 0, top: top - SEAM, width: V4_W, height: V4_H, transformOrigin: '0 0', transform: `translate(${tx}px, 0) scale(${S})`};
  const p = sketchFrom === undefined ? 0 : ease(fr, sketchFrom, 14, Easing.bezier(0.45, 0, 0.25, 1));
  return (
    <div style={{position: 'absolute', left: 0, top: SEAM, width: V4_W, height: V4_H - SEAM, overflow: 'hidden', background: '#000'}}>
      <OffthreadVideo muted src={staticFile('wa1832/talk.mp4')} style={vs} />
      {sketchFrom !== undefined ? (
        <>
          <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}}>
            <OffthreadVideo muted src={staticFile('wa1832/talk_sketch.mp4')} style={vs} />
          </div>
          {p > 0 && p < 1 ? <Pencil x={p * V4_W} /> : null}
        </>
      ) : null}
    </div>
  );
};

const Pencil: React.FC<{x: number}> = ({x}) => (
  <svg width={120} height={1000} style={{position: 'absolute', left: x - 22, top: 0, overflow: 'visible'}}>
    <path d="M22 0 V1000" stroke={C.ink} strokeWidth={6} />
    <g transform="translate(22 470) rotate(-28)">
      <rect x={-18} y={-210} width={36} height={170} rx={6} fill={C.white} stroke={C.ink} strokeWidth={6} />
      <rect x={-18} y={-240} width={36} height={34} rx={6} fill={C.blue} stroke={C.ink} strokeWidth={6} />
      <path d="M-18 -40 L0 0 L18 -40 Z" fill={C.white} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-6 -14 L0 0 L6 -14 Z" fill={C.ink} />
    </g>
  </svg>
);

// ---------- Doodle kit ----------
const Boil: React.FC<{id: string}> = ({id}) => {
  const fr = useCurrentFrame();
  return (
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={Math.floor(fr / 3) % 5} />
      <feDisplacementMap in="SourceGraphic" scale="5" />
    </filter>
  );
};
// stroke that draws on as d goes 0→1
const ink = (d: number, w = 7) => ({stroke: C.ink, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - d});
const fillIn = (d: number) => ({fill: C.white, fillOpacity: interpolate(d, [0.5, 1], [0, 1], clamp)});

type Pose = 'type' | 'push' | 'wave' | 'peek';
const Pet: React.FC<{pose: Pose; at: number; id: string; q?: number[]; panic?: number; block?: number}> = ({pose, at, id, q = [], panic, block}) => {
  const fr = useCurrentFrame();
  const lt = fr - at;
  const d = ease(fr, at, 14);
  const typing = pose === 'type' ? Math.floor(lt / 3) % 2 : 0;
  const blink = lt % 75 > 71;
  const look = pose === 'type' || pose === 'push' ? 40 : pose === 'peek' ? -14 : 0;
  const lines = pose === 'type' ? Math.max(0, Math.min(6, Math.floor((lt - 10) / 6))) : 0;
  const scrib = panic !== undefined ? ease(fr, panic, 14) : 0;
  const wave = pose === 'wave' ? Math.sin(lt / 3) * 16 : 0;
  // push: the clip block is held up, then dropped at `block`
  const drop = block !== undefined ? ease(fr, block, 7, IN) : 0;
  return (
    <svg viewBox="0 0 520 400" width="100%" height="100%" style={{overflow: 'visible'}}>
      <Boil id={id} />
      <g filter={`url(#${id})`}>
        <path d="M20 364 L500 364" {...ink(d, 6)} fill="none" />
        <path d="M150 168 C 214 166 236 222 232 278 C 230 332 200 362 150 362 C 100 362 70 332 68 278 C 66 222 88 170 150 168 Z" {...ink(d)} {...fillIn(d)} />
        <path d="M104 186 L96 134 L134 172" {...ink(d)} {...fillIn(d)} />
        <path d="M196 184 L210 132 L172 170" {...ink(d)} {...fillIn(d)} />
        <path d="M70 330 C 28 334 26 290 52 284" {...ink(d)} fill="none" />
        {d > 0.6 ? (
          blink ? (
            <>
              <path d={`M${118 + look} 240 h16`} {...ink(1, 6)} />
              <path d={`M${164 + look} 240 h16`} {...ink(1, 6)} />
            </>
          ) : (
            <>
              <circle cx={126 + look} cy={240} r={10} fill={C.ink} />
              <circle cx={172 + look} cy={240} r={10} fill={C.ink} />
            </>
          )
        ) : null}
        {d > 0.6 ? <path d={panic !== undefined && fr >= panic ? `M${138 + look} 274 Q${149 + look} 264 ${160 + look} 274` : `M${138 + look} 268 Q${149 + look} 280 ${160 + look} 268`} {...ink(1, 6)} fill="none" /> : null}
        {pose === 'type' ? (
          <>
            <path d={`M214 296 L262 ${328 - typing * 10}`} {...ink(d)} fill="none" />
            <path d={`M206 312 L292 ${330 - (1 - typing) * 10}`} {...ink(d)} fill="none" />
            <path d="M246 362 L494 362 L472 332 L268 332 Z" {...ink(d)} {...fillIn(d)} />
            <path d="M276 330 L300 162 L486 162 L466 330 Z" {...ink(d)} {...fillIn(d)} />
            {Array.from({length: lines}).map((_, i) => (
              <path key={i} d={`M${318 - i * 2} ${196 + i * 22} l ${[90, 120, 60, 110, 80, 100][i]} 0`} stroke={C.blue} strokeWidth={8} strokeLinecap="round" fill="none" opacity={1 - scrib} />
            ))}
            {scrib > 0 ? <path d="M312 200 C 420 180 330 260 440 240 C 300 270 470 300 330 300 C 400 210 460 280 320 230 C 450 200 380 310 440 300" {...ink(scrib, 6)} fill="none" /> : null}
          </>
        ) : null}
        {pose === 'push' ? (
          <>
            <path d={`M214 280 L300 ${236 + drop * 40}`} {...ink(d)} fill="none" />
            <path d={`M210 300 L300 ${266 + drop * 40}`} {...ink(d)} fill="none" />
          </>
        ) : null}
        {pose === 'wave' ? <path d={`M214 286 L262 ${226 + wave} l 10 -22`} {...ink(d)} fill="none" /> : null}
        {panic !== undefined && fr >= panic ? <path d="M92 196 C 82 214 88 226 98 226 C 108 226 112 214 92 196 Z" {...ink(1, 5)} fill={C.white} transform={`translate(0 ${Math.min(30, (fr - panic) * 1.5)})`} /> : null}
      </g>
      {q.map((t, i) =>
        fr >= t ? (
          <text key={i} x={[96, 214][i % 2]} y={[110, 84][i % 2]} fontFamily={SANS} fontWeight={800} fontSize={86} fill={i ? C.blue : C.ink} style={{transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${pop(fr, t)}) rotate(${i ? 12 : -10}deg)`}}>?</text>
        ) : null,
      )}
    </svg>
  );
};

const Lock: React.FC<{snapAt?: number; openAt?: number; size: number; id: string}> = ({snapAt, openAt, size, id}) => {
  const fr = useCurrentFrame();
  // shackle: lifted until snapAt, closed after, lifted and swung after openAt
  const closed = snapAt === undefined ? 1 : ease(fr, snapAt, 5, IN);
  const open = openAt === undefined ? 0 : ease(fr, openAt, 10);
  const lift = (1 - closed) * 26 + open * 30;
  const swing = open * -28;
  return (
    <svg viewBox="0 0 120 140" width={size} height={(size * 140) / 120} style={{overflow: 'visible'}}>
      <Boil id={id} />
      <g filter={`url(#${id})`}>
        <g transform={`translate(0 ${-lift}) rotate(${swing} 92 62)`}>
          <path d="M28 66 V44 a32 32 0 0 1 64 0 V66" stroke={C.ink} strokeWidth={11} fill="none" strokeLinecap="round" />
        </g>
        <rect x={10} y={60} width={100} height={74} rx={14} fill={C.blue} stroke={C.ink} strokeWidth={7} />
        <circle cx={60} cy={92} r={9} fill={C.white} />
        <rect x={56} y={96} width={8} height={18} rx={3} fill={C.white} />
      </g>
    </svg>
  );
};

const Folder: React.FC<{at: number; id: string; w: number; children?: React.ReactNode}> = ({at, id, w, children}) => {
  const fr = useCurrentFrame();
  const d = ease(fr, at, 12);
  return (
    <div style={{position: 'relative', width: w, height: (w * 150) / 200}}>
      <svg viewBox="-10 -10 200 150" width={w} height={(w * 150) / 200} style={{overflow: 'visible', position: 'absolute', inset: 0}}>
        <Boil id={id} />
        <g filter={`url(#${id})`}>
          <path d="M0 20 a10 10 0 0 1 10 -10 h50 l14 16 h96 a10 10 0 0 1 10 10 v84 a10 10 0 0 1 -10 10 H10 a10 10 0 0 1 -10 -10 Z" {...ink(d)} {...fillIn(d)} />
          <path d="M0 44 H180" {...ink(d, 5)} fill="none" />
        </g>
      </svg>
      {children}
    </div>
  );
};

// ---------- Type ----------
// Kinetic headline: each word rises out of a blur, 2 frames apart.
const KT: React.FC<{text: string; at: number; size: number; w?: number; color?: string; accent?: string[]; align?: 'left' | 'center'}> = ({text, at, size, w = 700, color = C.ink, accent = [], align = 'left'}) => {
  const fr = useCurrentFrame();
  return (
    <div style={{fontFamily: SANS, fontWeight: w, fontSize: size, lineHeight: 1.08, letterSpacing: -0.03 * size, color, textAlign: align}}>
      {text.split(' ').map((word, i) => {
        const p = ease(fr, at + i * 2, 9);
        return (
          <span key={i} style={{display: 'inline-block', marginRight: '0.24em', opacity: p, transform: `translateY(${(1 - p) * 0.45 * size}px)`, filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined, color: accent.includes(word.replace(/[.,?]/g, '')) ? C.blue : undefined}}>
            {word}
          </span>
        );
      })}
    </div>
  );
};

const Underline: React.FC<{at: number; width: number}> = ({at, width}) => {
  const fr = useCurrentFrame();
  return (
    <svg width={width} height={30} style={{display: 'block', margin: '6px auto 0'}}>
      <path d={`M6 18 C ${width * 0.3} 6, ${width * 0.6} 26, ${width - 6} 12`} stroke={C.blue} strokeWidth={11} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(fr, at, 8)} />
    </svg>
  );
};

// Notebook dot grid behind the top panel, so it never reads as an empty slide.
const DotGrid: React.FC<{h: number; opacity?: number}> = ({h, opacity = 1}) => (
  <svg width={V4_W} height={h} style={{position: 'absolute', left: 0, top: 0, opacity}}>
    <defs>
      <pattern id="dots" width={44} height={44} patternUnits="userSpaceOnUse">
        <circle cx={22} cy={22} r={2.4} fill={C.dot} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

const torn = (seed: number) => {
  let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const top: string[] = [];
  for (let x = 1080; x >= 0; x -= 18) top.push(`${(x / 1080) * 100}% ${(4 + rnd() * 12).toFixed(1)}px`);
  return `polygon(0% 100%,100% 100%,${top.join(',')})`;
};
const Drawer: React.FC<{from: number; seed: number; children: React.ReactNode}> = ({from, seed, children}) => {
  const fr = useCurrentFrame();
  const y = interpolate(snap(fr, from, 10), [0, 1], [SEAM, 0]);
  return (
    <div style={{position: 'absolute', left: 0, top: 200, width: V4_W, height: SEAM - 200, transform: `translateY(${y}px)`, filter: 'drop-shadow(0 -10px 24px rgba(0,0,0,0.16))'}}>
      <div style={{position: 'absolute', inset: 0, background: C.paper, clipPath: torn(seed)}}>
        <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.28}}>
          <filter id={`gr${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="2" /><feColorMatrix values="0 0 0 0 0.4  0 0 0 0 0.4  0 0 0 0 0.42  0 0 0 0.5 0" /></filter>
          <rect width="100%" height="100%" filter={`url(#gr${seed})`} />
        </svg>
        {children}
      </div>
    </div>
  );
};

// ---------- Top scenes ----------
const SLOT_X = [70, 250, 430, 610, 790];
const SceneCounter: React.FC = () => {
  const fr = useCurrentFrame();
  const [from, to] = B.counter;
  const reveal = f(1.3);
  const drop = f(2.1);
  // zoom-through: the camera falls into the "0" until it is all white
  const zt = ease(fr, to - 9, 9, IN);
  const zScale = 1 + 22 * zt;
  const play = ease(fr, from, to - from, Easing.linear);
  const blockY = interpolate(ease(fr, drop, 7, IN), [0, 1], [-170, 0]);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - zt}}>
        <DotGrid h={SEAM} />
        <div style={{position: 'absolute', left: 80, top: 236}}>
          <KT text="Seconds I edited" at={from} size={66} w={600} color={C.grey} />
        </div>
        <div style={{position: 'absolute', left: 560, top: 250, width: 470, height: 362}}>
          <Pet pose="push" at={from + 2} id="pc" block={drop} />
        </div>
        {/* the timeline */}
        <svg width={V4_W} height={170} style={{position: 'absolute', left: 0, top: 640, overflow: 'visible'}}>
          <Boil id="tl" />
          <g filter="url(#tl)">
            <rect x={56} y={20} width={968} height={96} rx={14} {...ink(ease(fr, from, 12), 6)} fill="none" />
            {SLOT_X.slice(0, 4).map((x, i) => (
              <rect key={i} x={x} y={36} width={164} height={64} rx={10} fill={C.line} stroke={C.ink} strokeWidth={4} opacity={ease(fr, from + 4 + i * 2, 6)} />
            ))}
            <rect x={SLOT_X[4]} y={36} width={214} height={64} rx={10} fill="none" stroke={C.ink} strokeWidth={3} strokeDasharray="10 10" />
            <path d={`M${62 + play * 950} 4 V 132`} stroke={C.blue} strokeWidth={8} strokeLinecap="round" />
          </g>
        </svg>
        {/* the clip the pet drops in */}
        <div style={{position: 'absolute', left: SLOT_X[4], top: 676 + blockY, width: 214, height: 64, borderRadius: 10, background: C.blue, border: `4px solid ${C.ink}`, boxSizing: 'border-box'}} />
      </div>
      {/* digit centred in a fixed box, so the zoom-through falls exactly through the hole of the 0 */}
      <div style={{position: 'absolute', left: 70, top: 326, width: 260, height: 320, transformOrigin: '130px 160px', transform: `scale(${zScale})`}}>
        {fr >= reveal ? (
          <svg width={260} height={320} style={{transform: `scale(${pop(fr, reveal)})`, opacity: 1 - zt * 0.9}}>
            <ellipse cx={130} cy={160} rx={92} ry={128} fill="none" stroke={C.ink} strokeWidth={62} />
          </svg>
        ) : null}
      </div>
    </>
  );
};

const SceneHow: React.FC = () => {
  const [from] = B.how;
  return (
    <>
      <DotGrid h={SEAM} />
      <Drawer from={from} seed={7}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 50}}>
          <KT text="How does it actually work?" at={from + 6} size={70} align="center" accent={['actually']} />
        </div>
        <div style={{position: 'absolute', left: 190, top: 118, width: 700, height: 538}}>
          <Pet pose="type" at={from + 4} id="ph" q={[f(5.3), f(5.72)]} panic={f(6.6)} />
        </div>
      </Drawer>
    </>
  );
};

const FOLDERS = ['my-setup', 'reels-v7', 'final-v9', 'workflow', 'pipeline', 'the-sauce'];
const SceneRepos: React.FC = () => {
  const fr = useCurrentFrame();
  const [from] = B.repos;
  const whip = ease(fr, from, 7);
  const swap = f(9.28);
  const push = f(10.48);
  const ze = ease(fr, push, 18);
  const z = 1 + 1.4 * ze + 0.02 * Math.max(0, (fr - push - 18) / FPS);
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - whip) * 700}px)`, filter: whip < 1 ? `blur(${(1 - whip) * 14}px)` : undefined}}>
      <DotGrid h={SEAM} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 230}}>
        {fr < swap ? <KT text="Everyone has their own repo." at={from + 4} size={66} align="center" accent={['own']} /> : <KT text="And their own secret methods." at={swap} size={66} align="center" accent={['secret']} />}
      </div>
      <div style={{position: 'absolute', left: 0, top: 310, width: V4_W, height: 490, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, transformOrigin: '540px 84px', transform: `translateY(${ze * 110}px) scale(${z})`}}>
          {FOLDERS.map((name, i) => {
            const at = f(7.58) + i * 6;
            const cx = [220, 540, 860][i % 3];
            const top = i < 3 ? 12 : 250;
            const chars = Math.max(0, Math.min(name.length, Math.floor((fr - at - 6) / 1.2)));
            return (
              <div key={name} style={{position: 'absolute', left: cx - 130, top, width: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: i === 1 ? 1 : 1 - 0.85 * ze}}>
                <Folder at={at} id={`fo${i}`} w={190}>
                  {fr >= f(10.14) + i * 3 - 4 ? (
                    <div style={{position: 'absolute', left: 58, top: 26, transform: `scale(${pop(fr, f(10.14) + i * 3 - 4)})`}}>
                      <Lock size={74} id={`lk${i}`} snapAt={f(10.14) + i * 3} />
                    </div>
                  ) : null}
                </Folder>
                <div style={{fontFamily: MONO, fontSize: 32, color: C.ink, marginTop: 4, height: 40}}>{name.slice(0, chars)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const STEPS = ['Watch the footage', 'Cut, design, caption', 'A second AI reviews'];
const SceneSteps: React.FC = () => {
  const fr = useCurrentFrame();
  const [from] = B.steps;
  const open = f(13.77);
  return (
    <>
      <DotGrid h={SEAM} />
      <Drawer from={from} seed={13}>
        <div style={{position: 'absolute', left: 110, top: 70}}>
          <Lock size={190} id="bigl" openAt={open} />
        </div>
        {/* key: slides into the keyhole from the right, then turns (seen as a flip about its shaft) */}
        <svg width={200} height={80} style={{position: 'absolute', left: 205, top: 176, overflow: 'visible', transformOrigin: '0px 40px', transform: `translateX(${(1 - ease(fr, from + 4, 9)) * 220}px) scaleY(${Math.cos(ease(fr, open - 5, 5) * Math.PI * 0.85)})`}}>
          <path d="M0 40 H118" stroke={C.ink} strokeWidth={12} strokeLinecap="round" />
          <path d="M22 40 v20 h14 v-12 h12 v16" stroke={C.ink} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" fill="none" />
          <circle cx={150} cy={40} r={32} fill={C.white} stroke={C.ink} strokeWidth={10} />
          <circle cx={150} cy={40} r={10} fill={C.blue} />
        </svg>
        <div style={{position: 'absolute', left: 40, top: 360, width: 330, height: 254}}>
          <Pet pose="wave" at={from + 2} id="pw" />
        </div>
        <div style={{position: 'absolute', left: 430, top: 80, right: 40}}>
          <KT text="How to do this" at={from + 6} size={78} />
          <div style={{marginTop: 30}}>
            {STEPS.map((s, i) => {
              const at = f(13.9) + i * 7;
              const chars = Math.max(0, Math.min(s.length, Math.floor((fr - at) * 2.6)));
              return (
                <div key={s} style={{display: 'flex', alignItems: 'baseline', gap: 22, height: 96, opacity: fr >= at ? 1 : 0}}>
                  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 58, color: C.blue, width: 36, transform: `scale(${pop(fr, at)})`}}>{i + 1}</div>
                  <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 52, letterSpacing: -1.5, color: C.ink, whiteSpace: 'nowrap'}}>{s.slice(0, chars)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Drawer>
    </>
  );
};

// ---------- Seam ----------
const SEAM_WORDS: [number, string][] = [
  [1.1, 'single second'], [4.04, 'how'], [5.3, 'actually works'], [6.6, 'easier'],
  [7.58, 'everyone'], [8.44, 'own repo'], [10.14, 'secret'], [13.5, 'how to do this'],
];
const SeamWord: React.FC<{fr: number; a: number; b: number}> = ({fr, a, b}) => {
  let w: [number, string] | null = null;
  for (const s of SEAM_WORDS) if (f(s[0]) <= fr && f(s[0]) >= a && f(s[0]) < b) w = s;
  if (!w) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: SEAM - 104, display: 'flex', justifyContent: 'center'}}>
      <div style={{transform: `scale(${pop(fr, f(w[0]))})`, background: C.ink, color: C.white, fontFamily: SANS, fontWeight: 700, fontSize: 50, letterSpacing: -1, padding: '10px 30px 14px', borderRadius: 16}}>{w[1]}</div>
    </div>
  );
};
const SeamLine: React.FC = () => (
  <svg width={V4_W} height={20} style={{position: 'absolute', left: 0, top: SEAM - 10, overflow: 'visible'}}>
    <Boil id="seam" />
    <path d="M-10 10 C 300 4, 700 16, 1090 8" stroke={C.ink} strokeWidth={8} fill="none" filter="url(#seam)" />
  </svg>
);

// ---------- Full-face captions: the line builds word by word ----------
type W = [number, string, boolean?];
const LINES: {from: number; to: number; words: W[]}[] = [
  {from: B.hook[0], to: B.hook[1], words: [[0.0, 'I'], [0.3, "didn't"], [0.56, 'edit', true]]},
  {from: B.noOne[0], to: B.noOne[1], words: [[3.3, 'No'], [3.4, 'one'], [3.58, 'is'], [3.76, 'telling', true]]},
  {from: B.so[0], to: f(12.36), words: [[11.86, 'So']]},
  {from: f(12.36), to: B.so[1], words: [[12.36, 'I'], [12.6, 'will'], [12.82, 'tell', true], [13.06, 'you', true]]},
];
const FaceCaption: React.FC<{fr: number}> = ({fr}) => {
  const line = LINES.find((l) => fr >= l.from && fr < l.to);
  if (!line) return null;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 300, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 22px'}}>
      {line.words.map(([t, word, key]) => {
        const at = f(t);
        if (fr < at) return null;
        return (
          <div key={word + t} style={{transform: `scale(${pop(fr, at)})`, fontFamily: SANS, fontWeight: 800, fontSize: 100, letterSpacing: -3, color: C.white, background: key ? C.blue : 'transparent', padding: key ? '4px 24px 12px' : '4px 0 12px', borderRadius: 18, textShadow: key ? 'none' : '0 4px 24px rgba(0,0,0,0.7), 0 0 4px rgba(0,0,0,0.6)'}}>
            {word}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Whiteout hits ----------
const SceneDid: React.FC = () => {
  const fr = useCurrentFrame();
  const [from, to] = B.did;
  return (
    <AbsoluteFill style={{background: C.white}}>
      <DotGrid h={V4_H} opacity={ease(fr, from + 4, 10) * 0.7} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 820, transform: `scale(${1 + 0.05 * ((fr - from) / (to - from))})`}}>
        <KT text="Claude did." at={from} size={170} w={800} align="center" />
        <Underline at={from + 6} width={880} />
      </div>
    </AbsoluteFill>
  );
};

const SceneEnd: React.FC = () => {
  const fr = useCurrentFrame();
  const [from] = B.end;
  return (
    <AbsoluteFill style={{background: C.white}}>
      <DotGrid h={V4_H} opacity={0.7} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 540}}>
        <KT text="Follow along." at={from} size={150} w={800} align="center" />
        <Underline at={from + 5} width={640} />
      </div>
      <div style={{position: 'absolute', left: 250, top: 830, width: 580, height: 446}}>
        <Pet pose="wave" at={from + 2} id="pe" />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', opacity: ease(fr, from + 12, 8)}}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 54, letterSpacing: -1.5, color: C.grey}}>This one was edited by Claude.</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Main ----------
export const ClaudeDidV4: React.FC = () => {
  const fr = useCurrentFrame();
  const k = beatAt(fr);
  const [a, b] = B[k];
  const vf = Math.min(fr, SPEECH - 1);
  return (
    <AbsoluteFill style={{background: C.white}}>
      {FACE.includes(k) ? (
        <>
          <FaceFull fr={vf} from={a} />
          <FaceCaption fr={fr} />
        </>
      ) : null}
      {SPLIT.includes(k) ? (
        <>
          <SpeakerPanel fr={vf} from={a} sketchFrom={k === 'how' ? a : undefined} />
          <div style={{position: 'absolute', left: 0, top: 0, width: V4_W, height: SEAM, background: C.white, overflow: 'hidden'}}>
            {k === 'counter' ? <SceneCounter /> : null}
            {k === 'how' ? <SceneHow /> : null}
            {k === 'repos' ? <SceneRepos /> : null}
            {k === 'steps' ? <SceneSteps /> : null}
          </div>
          <SeamLine />
          <SeamWord fr={fr} a={a} b={b} />
          {k === 'counter' && fr >= b - 9 ? <AbsoluteFill style={{background: C.white, opacity: ease(fr, b - 6, 6, IN)}} /> : null}
        </>
      ) : null}
      {k === 'did' ? <SceneDid /> : null}
      {k === 'end' ? <SceneEnd /> : null}
      <Audio src={staticFile('wa1832/voice.wav')} />
    </AbsoluteFill>
  );
};
