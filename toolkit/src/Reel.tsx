import React, {useEffect, useLayoutEffect, useRef} from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import words from './words.json';
import {__hlStep, exploded, loupe, phosphor, query, slow, terrain, type Figure} from './vendor/hairline';

// Two references merged:
// - Smart Studios grid reel: dashed red guides with dots, condensed Anton headlines, red cells, mono labels.
// - Jitter "Showcase": black canvas, glass UI cards, slate statement pills over a blurred stage,
//   blur-to-sharp entrances, tiny mono frame furniture, grain.
// Explainers are Hairline line figures. Rules from Hardik: the face is only ever one small tile;
// nothing typed crosses a guide line; no stock photography (image slots take his own images).

const BG = '#0B0B0B';
const RED = '#C2220F';
const WHITE = '#F2F0EC';
const GRAY = '#7A7A7F';
const DIM = '#3C3C40';
const SLATE = '#8FA3B8';
const PAPER = '#ECE9E3';
const GLASS = 'rgba(28,28,30,.94)';
const LINE = 'rgba(194,34,15,.6)';
const DISPLAY = "'Anton', sans-serif";
const SANS = "'Inter', sans-serif";
const MONO = "'Space Mono', monospace";

// Image slots. Drop your own files in public/imagery/ and point a slot at one (e.g. 'imagery/models.jpg');
// a filled slot takes the cell the face tile uses in that scene.
const IMAGERY: Record<'models' | 'crazy', string | null> = {
  models: null,
  crazy: null,
};

export const W = 1920;
export const H = 1080;
const FPS = 30;
const TALK_END = 56.76; // length of public/talk.mp4 (the cut talking head)
const END_CARD = 2.8;
export const REEL_FRAMES = Math.ceil((TALK_END + END_CARD) * FPS);
const PAD = 40; // minimum gap between anything and a guide line
const TOP = 96;
const BAND = 984; // bottom guide; captions and the index live below it

const fontHandle = delayRender('fonts');
Promise.all(
  [
    ['Anton', 'Anton.woff2', '400'],
    ['Inter', 'Inter-Regular.otf', '400'],
    ['Inter', 'Inter-Medium.otf', '500'],
    ['Inter', 'Inter-SemiBold.otf', '600'],
    ['Inter', 'Inter-Bold.otf', '700'],
    ['Space Mono', 'SpaceMono-400.woff2', '400'],
    ['Space Mono', 'SpaceMono-700.woff2', '700'],
  ].map(([family, file, weight]) =>
    new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, {weight}).load().then((ff) => document.fonts.add(ff)),
  ),
).then(() => continueRender(fontHandle));

const f = (s: number) => Math.round(s * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const useT = () => useCurrentFrame() / FPS;
const OUT_EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const IN_OUT = Easing.bezier(0.83, 0, 0.17, 1);
const IN_EXPO = Easing.bezier(0.7, 0, 0.84, 0);
const ease = (t: number, a: number, d: number, e = OUT_EXPO) => interpolate(t, [a, a + d], [0, 1], {...clamp, easing: e});

// ---------- Grid system ----------
type Layout = {v: number[]; h: number[]};
type Rect = [number, number, number, number];
type CellRef = [number, number, number, number]; // v-index from, v-index to, h-index from, h-index to

const L_HOOK: Layout = {v: [96, 900, 900, 1380, 1824], h: [TOP, 640, BAND, BAND]};
const L_MODELS: Layout = {v: [96, 560, 1300, 1300, 1824], h: [TOP, 500, BAND, BAND]};
const L_CRAZY: Layout = {v: [96, 1100, 1100, 1500, 1824], h: [TOP, 620, BAND, BAND]};
const L_AUTO: Layout = {v: [96, 600, 1380, 1380, 1824], h: [TOP, 560, BAND, BAND]};
const L_CH1: Layout = {v: [96, 1000, 1000, 1440, 1824], h: [TOP, 420, BAND, BAND]};
const L_CH2: Layout = {v: [96, 700, 700, 1824, 1824], h: [TOP, 520, BAND, BAND]};
const L_CH3: Layout = {v: [96, 1240, 1240, 1824, 1824], h: [TOP, 430, BAND, BAND]};
const L_FIGMA: Layout = {v: [96, 1360, 1360, 1824, 1824], h: [TOP, BAND, BAND, BAND]};
const L_OUT: Layout = {v: [96, 1240, 1240, 1824, 1824], h: [TOP, 640, BAND, BAND]};

const T = {hook: 0, models: 6.51, crazy: 11.0, auto: 15.27, ch1: 17.32, ch2: 26.27, ch3: 39.92, figma: 48.92, out: 51.31, end: TALK_END};
// Guides move at these times; chapter changes happen under a statement pill.
const SCENES: [number, Layout][] = [
  [T.hook, L_HOOK],
  [T.models, L_MODELS],
  [11.15, L_CRAZY],
  [T.auto, L_AUTO],
  [17.45, L_CH1],
  [26.4, L_CH2],
  [40.05, L_CH3],
  [T.figma, L_FIGMA],
  [T.out, L_OUT],
];
const MOVE = 0.8;

const sceneIndex = (t: number) => {
  let i = 0;
  while (i + 1 < SCENES.length && t >= SCENES[i + 1][0]) i++;
  return i;
};
const moveP = (t: number) => {
  const i = sceneIndex(t);
  return i ? ease(t, SCENES[i][0], MOVE, IN_OUT) : 1;
};
const lerp = (a: number[], b: number[], p: number) => a.map((v, k) => v + (b[k] - v) * p);
const layoutAt = (t: number): Layout => {
  const i = sceneIndex(t);
  const to = SCENES[i][1];
  if (!i) return to;
  const from = SCENES[i - 1][1];
  const p = moveP(t);
  return {v: lerp(from.v, to.v, p), h: lerp(from.h, to.h, p)};
};
const cellRect = (l: Layout, [a, b, c, d]: CellRef): Rect => [l.v[a], l.h[c], l.v[b] - l.v[a], l.h[d] - l.h[c]];

const GridLines = () => {
  const t = useT();
  const l = layoutAt(t);
  const draw = ease(t, 0, 1.1, IN_OUT);
  const land = SCENES[sceneIndex(t)][0] + MOVE;
  const dotR = 4 + 2.5 * Math.max(0, 1 - Math.abs(t - land) * 4);
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      {l.v.map((x, i) => (
        <line key={`v${i}`} x1={x} x2={x} y1={TOP} y2={TOP + (BAND - TOP) * draw} stroke={LINE} strokeWidth={1.6} strokeDasharray="6 7" />
      ))}
      {l.h.map((y, i) => (
        <line key={`h${i}`} y1={y} y2={y} x1={0} x2={W * draw} stroke={LINE} strokeWidth={1.6} strokeDasharray="6 7" />
      ))}
      {l.v.flatMap((x, i) => l.h.map((y, j) => <circle key={`${i}-${j}`} cx={x} cy={y} r={dotR * draw} fill={WHITE} />))}
    </svg>
  );
};

// ---------- Cell-bound elements ----------
// A block anchored inside a grid cell: it enters blur-to-sharp after the guides land, and leaves before they move.
const InCell: React.FC<{
  at: number;
  until: number;
  cell: CellRef;
  place?: React.CSSProperties;
  anim?: 'rise' | 'none';
  children: React.ReactNode;
}> = ({at, until, cell, place = {left: PAD, top: PAD}, anim = 'rise', children}) => {
  const t = useT();
  if (t < at || t >= until) return null;
  const [x, y, w, h] = cellRect(layoutAt(t), cell);
  const pin = ease(t, at, 0.8);
  const pout = ease(t, until - 0.3, 0.3, IN_EXPO);
  const rise = anim === 'rise';
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      <div
        style={{
          position: 'absolute',
          ...place,
          opacity: rise ? Math.min(1, pin * 1.4) * (1 - pout) : 1,
          transform: rise ? `translateY(${(1 - pin) * 40 - pout * 24}px)` : undefined,
          filter: rise && (pin < 1 || pout > 0) ? `blur(${(1 - pin) * 12 + pout * 10}px)` : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// A red cell that wipes up from its bottom guide, and away upward.
const RedCell: React.FC<{at: number; until: number; cell: CellRef}> = ({at, until, cell}) => {
  const t = useT();
  if (t < at || t >= until) return null;
  const [x, y, w, h] = cellRect(layoutAt(t), cell);
  const pin = ease(t, at, 0.6, IN_OUT);
  const pout = ease(t, until - 0.4, 0.4, IN_OUT);
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: RED, clipPath: `inset(${pout * 100}% 0 ${(1 - pin) * 100}% 0)`}} />;
};

// Condensed headline; each line rises out of its own mask, staggered, and sinks on exit.
type Line = string | [string, string];
const Display: React.FC<{lines: Line[]; at: number; until: number; size: number; color?: string}> = ({lines, at, until, size, color = WHITE}) => {
  const t = useT();
  return (
    <div style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 0.98, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
      {lines.map((l, i) => {
        const [text, c] = typeof l === 'string' ? [l, color] : l;
        const pin = ease(t, at + i * 0.08, 0.85);
        const pout = ease(t, until - 0.34 + i * 0.03, 0.28, IN_EXPO);
        return (
          <div key={i} style={{overflow: 'hidden', paddingTop: size * 0.04}}>
            <div style={{color: c, transform: `translateY(${(1 - pin) * 110 - pout * 110}%)`}}>{text}</div>
          </div>
        );
      })}
    </div>
  );
};

const Mono: React.FC<{lines: string[]; color?: string; align?: 'left' | 'right' | 'center'; size?: number}> = ({lines, color = GRAY, align = 'left', size = 15}) => (
  <div style={{fontFamily: MONO, fontSize: size, lineHeight: 1.4, color, textAlign: align, whiteSpace: 'pre'}}>
    {lines.map((l, i) => (
      <div key={i}>{l}</div>
    ))}
  </div>
);

const Glass: React.FC<{w?: number; h?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({w, h, style, children}) => (
  <div style={{width: w, height: h, background: GLASS, border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, boxSizing: 'border-box', ...style}}>{children}</div>
);

const Txt: React.FC<{size?: number; w?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode}> = ({size = 30, w = 500, color = WHITE, style, children}) => (
  <div style={{fontFamily: SANS, fontWeight: w, fontSize: size, color, letterSpacing: -0.025 * size, whiteSpace: 'nowrap', ...style}}>{children}</div>
);

const U: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{color: WHITE, borderBottom: `3px dashed ${RED}`}}>{children}</span>;

const Typed = ({text, from, to}: {text: string; from: number; to: number}) => {
  const t = useT();
  const n = Math.round(interpolate(t, [from, to], [0, text.length], clamp));
  return (
    <>
      {text.slice(0, n)}
      <span style={{opacity: Math.floor(t * 2.6) % 2 ? 0 : 1, color: RED}}>|</span>
    </>
  );
};

const Check = ({at, size = 54}: {at: number; size?: number}) => {
  const p = ease(useT(), at, 0.45);
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" style={{flex: 'none'}}>
      <circle cx={28} cy={28} r={25} fill={p > 0.05 ? SLATE : 'none'} stroke={p > 0.05 ? SLATE : DIM} strokeWidth={3} />
      <path d="M17 29 L25 37 L40 20" fill="none" stroke={BG} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={36} strokeDashoffset={36 * (1 - p)} />
    </svg>
  );
};

// An image slot: fills its cell, drifts slowly, labelled like a contact sheet.
const Imagery: React.FC<{src: string; at: number; until: number; cell: CellRef; label: string}> = ({src, at, until, cell, label}) => {
  const t = useT();
  if (t < at || t >= until) return null;
  const [x, y, w, h] = cellRect(layoutAt(t), cell);
  const pin = ease(t, at, 0.9, IN_OUT);
  const pout = ease(t, until - 0.35, 0.35, IN_OUT);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', clipPath: `inset(${pout * 100}% 0 ${(1 - pin) * 100}% 0)`}}>
      <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.08 - (t - at) * 0.006})`}} />
      <div style={{position: 'absolute', left: 16, bottom: 12}}>
        <Mono size={13} color={WHITE} lines={[label]} />
      </div>
    </div>
  );
};

// ---------- Hairline explainers, stepped frame by frame ----------
const FIGS = {exploded, loupe, phosphor, query, slow, terrain};
const STEP = 1 / 60;

const HairFig: React.FC<{fig: keyof typeof FIGS; at: number; w: number; intensity?: number}> = ({fig, at, w, intensity = 0.7}) => {
  const host = useRef<HTMLDivElement>(null);
  const st = useRef<{f: Figure | null; sim: number}>({f: null, sim: 0});
  const lt = Math.max(0, useT() - at);
  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    const s = st.current;
    if (!s.f || lt < s.sim - 1e-6) {
      s.f?.destroy();
      __hlStep(el, 0, 0);
      s.f = FIGS[fig](el, {play: true, theme: 'dark', intensity});
      s.sim = 0;
    }
    while (s.sim + STEP <= lt + 1e-9) {
      s.sim += STEP;
      __hlStep(el, STEP, s.sim * 1000);
    }
  });
  useEffect(() => () => st.current.f?.destroy(), []);
  return (
    <div
      ref={host}
      style={
        {
          width: w,
          height: w * 0.8,
          '--hairline-plate': BG,
          '--hairline-hi': WHITE,
          '--hairline-edge': '#D2D2D6',
          '--hairline-mid': '#7C7C82',
          '--hairline-lo': '#3A3A3F',
          '--hairline-stroke': 1.6,
        } as React.CSSProperties
      }
    />
  );
};

// ---------- Face tile: one live video, one place, small, natural colour ----------
const SRC = {w: 848, h: 478, fx: 430, fy: 185};
const FACE: [number, CellRef | ((l: Layout) => Rect) | null][] = [
  [T.hook, [2, 3, 0, 1]],
  [T.models, IMAGERY.models ? null : [0, 1, 1, 2]],
  [11.15, IMAGERY.crazy ? null : [2, 3, 0, 1]],
  [T.auto, [0, 1, 0, 1]],
  [17.45, [2, 3, 0, 1]],
  [26.4, null],
  [40.05, [2, 3, 0, 1]],
  [T.figma, (l) => [l.v[2], l.h[0], l.v[3] - l.v[2], 380]],
  [T.out, [2, 3, 0, 1]],
  [T.end, null],
];
const SHOTS = [0, 6.51, 15.27, 17.32, 20.2, 26.27, 30.5, 36.78, 39.92, 44.72, 51.31, 53.85];
const PUNCH = [1, 1.05, 1, 1.04, 1, 1.05, 1, 1.04, 1, 1.05, 1, 1.05];

const FaceTile = () => {
  const t = useT();
  let i = 0;
  while (i + 1 < FACE.length && t >= FACE[i + 1][0]) i++;
  const [at, spec] = FACE[i];
  const prev = i ? FACE[i - 1][1] : null;
  const l = layoutAt(t);
  const rectOf = (s: (typeof FACE)[number][1]) => (s ? (typeof s === 'function' ? s(l) : cellRect(l, s)) : null);
  const now = rectOf(spec);
  const before = rectOf(prev);
  // Shown: opens after the guides land. Hidden: closes in place.
  const open = now ? ease(t, at + (i ? 0.5 : 0.2), 0.8, IN_OUT) : 0;
  const close = !now && before ? 1 - ease(t, at - 0.35, 0.35, IN_OUT) : 0;
  const reveal = Math.max(open, close);
  const r = now ?? before;
  if (!r || reveal <= 0.001) return null;
  const [x, y, w, h] = r;
  let s = 0;
  while (s + 1 < SHOTS.length && t >= SHOTS[s + 1]) s++;
  const zoom = PUNCH[s] * (1 + (t - SHOTS[s]) * 0.002);
  const k = Math.max(w / SRC.w, h / SRC.h) * zoom;
  const left = Math.min(0, Math.max(w - SRC.w * k, w / 2 - SRC.fx * k));
  const top = Math.min(0, Math.max(h - SRC.h * k, h * 0.46 - SRC.fy * k));
  const tc = `${String(Math.floor(t)).padStart(2, '0')}:${String(Math.floor((t % 1) * FPS)).padStart(2, '0')}`;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', background: BG, clipPath: `inset(${(1 - reveal) * 100}% 0 0 0)`}}>
      <OffthreadVideo muted src={staticFile('talk.mp4')} style={{position: 'absolute', width: SRC.w * k, height: SRC.h * k, left, top, filter: 'contrast(1.06) saturate(.95) brightness(1.04)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.5), transparent 30%)'}} />
      <div style={{position: 'absolute', left: 16, bottom: 12, display: 'flex', gap: 10, alignItems: 'center'}}>
        <div style={{width: 9, height: 9, borderRadius: 5, background: WHITE, opacity: Math.floor(t * 1.6) % 2 ? 0.3 : 1}} />
        <Mono size={13} color={WHITE} lines={['Cam 01 · Hardik']} />
      </div>
      <div style={{position: 'absolute', right: 16, bottom: 12}}>
        <Mono size={13} color={WHITE} lines={[tc]} />
      </div>
    </div>
  );
};

// ---------- Scenes ----------
const Scenes = () => {
  const t = useT();
  const toggleOn = ease(t, 30.06, 0.45, IN_OUT);
  const fly = ease(t, 43.9, 0.7, IN_OUT);
  const counter = Math.round(interpolate(t, [22.6, 23.5], [0, 24], {...clamp, easing: OUT_EXPO}));
  const ring = ease(t, 18.6, 1.4) * 0.78;
  return (
    <>
      {/* HOOK 0 → 6.51 */}
      <InCell at={0.15} until={T.models} cell={[0, 1, 0, 1]} anim="none" place={{left: PAD, bottom: PAD - 6}}>
        <Display lines={['3 AI', 'automations', ['I use daily', RED]]} at={0.2} until={T.models} size={140} />
      </InCell>
      <InCell at={0.7} until={T.models} cell={[3, 4, 0, 1]} place={{right: PAD, top: PAD}}>
        <Mono align="right" lines={['Hardik Gupta', 'Designer × AI', 'Frame 01']} />
      </InCell>
      {['A personal one?', 'A math problem?', 'A general discussion?'].map((txt, i) => (
        <InCell key={txt} at={3.6 + i * 0.55} until={T.models} cell={[0, 1, 1, 2]} place={{left: PAD + i * 36, top: PAD + i * 86}}>
          <Glass style={{borderRadius: 40, padding: '14px 26px', display: 'flex', gap: 14, alignItems: 'center'}}>
            <div style={{width: 10, height: 10, borderRadius: 5, background: [RED, SLATE, WHITE][i]}} />
            <Txt size={30}>{txt}</Txt>
          </Glass>
        </InCell>
      ))}
      <InCell at={1.2} until={T.models} cell={[2, 3, 1, 2]} place={{left: (480 - 400) / 2, top: 12}}>
        <HairFig fig="query" at={1.2} w={400} />
      </InCell>
      <RedCell at={2.15} until={T.models} cell={[3, 4, 1, 2]} />
      <InCell at={2.4} until={T.models} cell={[3, 4, 1, 2]} anim="none" place={{left: PAD, bottom: PAD - 6}}>
        <Display lines={['We all', 'ask AI']} at={2.45} until={T.models} size={100} />
      </InCell>

      {/* MODELS 6.51 → 11.0 */}
      <InCell at={T.models + 0.45} until={11.0} cell={[0, 1, 0, 1]} place={{left: PAD, bottom: PAD}}>
        <Mono lines={['What AI can do', 'Today', 'Frame 02']} />
      </InCell>
      {IMAGERY.models && <Imagery src={IMAGERY.models} at={T.models + 0.5} until={11.0} cell={[0, 1, 1, 2]} label="Img 02" />}
      <InCell at={T.models + 0.4} until={11.0} cell={[1, 2, 0, 1]} anim="none" place={{left: PAD, bottom: PAD - 6}}>
        <Display lines={['The models', ['of today', RED]]} at={T.models + 0.42} until={11.0} size={140} />
      </InCell>
      <InCell at={8.4} until={11.0} cell={[1, 2, 1, 2]}>
        <Glass w={660} h={404} style={{padding: 28, position: 'relative'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>
              <Txt size={28} w={600}>Capabilities</Txt>
              <Mono lines={['2022 → today']} />
            </div>
            <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 13, color: BG, background: SLATE, borderRadius: 20, padding: '6px 12px', height: 18}}>Live</div>
          </div>
          <div style={{position: 'absolute', left: 28, right: 28, bottom: 28, display: 'flex', flexWrap: 'wrap', gap: 10}}>
            {['Write', 'Code', 'Design', 'Research', 'See', 'Speak', 'Automate'].map((c, i) => {
              const p = ease(t, 8.84 + i * 0.16, 0.6);
              return (
                <div key={c} style={{fontFamily: SANS, fontWeight: 500, fontSize: 26, color: WHITE, background: i === 6 ? RED : '#2A2A2E', borderRadius: 30, padding: '10px 22px', opacity: p, transform: `translateY(${(1 - p) * 20}px)`, filter: `blur(${(1 - p) * 6}px)`}}>
                  {c}
                </div>
              );
            })}
          </div>
        </Glass>
      </InCell>
      <InCell at={7.6} until={11.0} cell={[3, 4, 1, 2]} place={{left: (524 - 470) / 2, top: 10}}>
        <HairFig fig="terrain" at={7.6} w={470} />
      </InCell>
      <InCell at={7.8} until={11.0} cell={[3, 4, 1, 2]} place={{right: PAD, bottom: PAD}}>
        <Mono align="right" lines={['Fig. 02 — capability, rising']} />
      </InCell>

      {/* CRAZY (after the pill) 11.0 → 15.27 */}
      <RedCell at={12.3} until={T.auto} cell={[0, 1, 0, 1]} />
      <InCell at={12.45} until={T.auto} cell={[0, 1, 0, 1]} anim="none" place={{left: PAD, bottom: PAD - 6}}>
        <Display lines={['Extremely', 'crazy things']} at={12.5} until={T.auto} size={165} />
      </InCell>
      {IMAGERY.crazy && <Imagery src={IMAGERY.crazy} at={12.6} until={T.auto} cell={[2, 3, 0, 1]} label="Img 03" />}
      <InCell at={12.8} until={T.auto} cell={[3, 4, 0, 1]} place={{right: PAD, top: PAD}}>
        <Mono align="right" lines={['Not imagined', 'earlier', 'Rec. 03']} />
      </InCell>
      <InCell at={13.5} until={T.auto} cell={[0, 1, 1, 2]}>
        <Txt size={54} color={GRAY} style={{letterSpacing: -1.6, whiteSpace: 'normal', width: 900, lineHeight: 1.4}}>
          Things we might <U>not have imagined</U> earlier.
        </Txt>
      </InCell>

      {/* AUTOMATION 15.27 → 17.32 */}
      <InCell at={T.auto + 0.35} until={17.0} cell={[1, 2, 0, 1]} anim="none" place={{left: PAD, bottom: PAD - 6}}>
        <Display lines={['Automation', 'helped me', ['a lot', RED]]} at={T.auto + 0.37} until={17.0} size={124} />
      </InCell>
      <InCell at={T.auto + 0.4} until={17.0} cell={[3, 4, 0, 1]} place={{left: 22, top: 40}}>
        <HairFig fig="slow" at={T.auto + 0.4} w={400} />
      </InCell>
      <InCell at={T.auto + 0.6} until={17.0} cell={[3, 4, 1, 2]} place={{right: PAD, bottom: PAD}}>
        <Mono align="right" lines={['Fig. 03 — the belt keeps moving', 'Frame 03']} />
      </InCell>

      {/* 01 · DAILY AI BRIEF (after the pill) 17.32 → 26.27 */}
      <RedCell at={18.25} until={26.27} cell={[0, 1, 0, 1]} />
      <InCell at={18.4} until={26.27} cell={[0, 1, 0, 1]} anim="none" place={{left: PAD, bottom: PAD - 6}}>
        <Display lines={['01 / Daily', 'AI brief']} at={18.42} until={26.27} size={124} />
      </InCell>
      <InCell at={18.6} until={26.27} cell={[3, 4, 0, 1]} place={{right: PAD, top: PAD}}>
        <Mono align="right" lines={['Automation 01', 'Runs 08:00', 'Every day']} />
      </InCell>
      <InCell at={18.5} until={26.27} cell={[0, 1, 1, 2]}>
        <Glass w={400} h={484} style={{position: 'relative', overflow: 'hidden'}}>
          <Txt size={24} style={{position: 'absolute', left: 26, top: 22}}>Brief time</Txt>
          <svg width={400} height={400} style={{position: 'absolute', left: 0, top: 46}}>
            <circle cx={200} cy={200} r={128} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={16} />
            <circle cx={200} cy={200} r={128} fill="none" stroke={SLATE} strokeWidth={16} strokeLinecap="round" strokeDasharray={2 * Math.PI * 128} strokeDashoffset={2 * Math.PI * 128 * (1 - ring)} transform="rotate(-90 200 200)" />
            <circle cx={200} cy={200} r={100} fill="none" stroke={RED} strokeWidth={4} strokeDasharray={2 * Math.PI * 100} strokeDashoffset={2 * Math.PI * 100 * (1 - ring * 0.8)} transform="rotate(-90 200 200)" />
          </svg>
          <div style={{position: 'absolute', width: 400, textAlign: 'center', top: 196, fontFamily: DISPLAY, fontSize: 96, lineHeight: 1, color: WHITE}}>8AM</div>
          <div style={{position: 'absolute', width: 400, top: 430, textAlign: 'center'}}>
            <Mono align="center" lines={['every single day']} />
          </div>
        </Glass>
      </InCell>
      <InCell at={20.3} until={26.27} cell={[0, 1, 1, 2]} place={{left: PAD + 428, top: PAD}}>
        <Glass w={396} style={{padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'center'}}>
          <div style={{width: 52, height: 52, borderRadius: 12, background: WHITE, display: 'grid', placeItems: 'center', flex: 'none', fontFamily: SANS, fontWeight: 700, fontSize: 19, color: BG}}>AI</div>
          <div>
            <Mono size={13} lines={['ChatGPT · 08:00']} />
            <Txt size={24} w={600}>Your AI brief is ready</Txt>
          </div>
        </Glass>
      </InCell>
      {['Model launches', 'Tools worth trying', 'Design updates'].map((r, i) => (
        <InCell key={r} at={24.24 + i * 0.26} until={26.27} cell={[0, 1, 1, 2]} place={{left: PAD + 436, top: PAD + 150 + i * 66}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <Check at={24.32 + i * 0.26} size={38} />
            <Txt size={30}>{r}</Txt>
          </div>
        </InCell>
      ))}
      <RedCell at={22.5} until={26.27} cell={[2, 3, 1, 2]} />
      <InCell at={22.6} until={26.27} cell={[2, 3, 1, 2]} place={{left: PAD, bottom: PAD - 12}}>
        <div style={{fontFamily: DISPLAY, fontSize: 230, lineHeight: 0.9, color: WHITE}}>{counter}H</div>
      </InCell>
      <InCell at={22.8} until={26.27} cell={[2, 3, 1, 2]} place={{left: PAD, top: PAD}}>
        <Mono color={WHITE} lines={['Past 24 hours', 'of AI news,', 'summarised']} />
      </InCell>
      <InCell at={19.0} until={26.27} cell={[3, 4, 1, 2]} place={{left: 20, top: 30}}>
        <HairFig fig="phosphor" at={19.0} w={344} />
      </InCell>
      <InCell at={19.2} until={26.27} cell={[3, 4, 1, 2]} place={{right: PAD, bottom: PAD}}>
        <Mono align="right" lines={['Fig. 04 — the morning feed', 'Frame 04']} />
      </InCell>

      {/* 02 · A NEW COMPONENT (after the pill) 26.27 → 39.92 */}
      <RedCell at={27.75} until={39.92} cell={[0, 1, 0, 1]} />
      <InCell at={27.9} until={39.92} cell={[0, 1, 0, 1]} anim="none" place={{left: PAD, bottom: PAD - 6}}>
        <Display lines={['02 / A new', 'component']} at={27.92} until={39.92} size={112} />
      </InCell>
      <InCell at={28.0} until={31.35} cell={[0, 1, 1, 2]} place={{left: (604 - 540) / 2, top: 16}}>
        <HairFig fig="exploded" at={28.0} w={540} />
      </InCell>
      <InCell at={31.45} until={39.92} cell={[0, 1, 1, 2]} place={{left: (604 - 540) / 2, top: 16}}>
        <HairFig fig="loupe" at={31.45} w={540} />
      </InCell>
      <InCell at={28.1} until={29.25} cell={[1, 4, 0, 1]} place={{right: PAD, top: PAD}}>
        <Mono align="right" lines={['Automation 02', 'One new learning', 'Every day']} />
      </InCell>
      <InCell at={29.3} until={31.4} cell={[1, 4, 0, 1]}>
        <Glass style={{padding: '30px 36px', display: 'flex', alignItems: 'center', gap: 32}}>
          <div style={{width: 170, height: 92, borderRadius: 46, background: toggleOn > 0.5 ? RED : '#2A2A2E', position: 'relative'}}>
            <div style={{position: 'absolute', top: 8, left: 8 + toggleOn * 78, width: 76, height: 76, borderRadius: 38, background: WHITE, transform: `scaleX(${1 + Math.sin(toggleOn * Math.PI) * 0.2})`}} />
          </div>
          <div>
            <Mono lines={['Component of the day']} />
            <Txt size={46} w={600}>Toggle switch</Txt>
          </div>
        </Glass>
      </InCell>
      <InCell at={31.4} until={39.92} cell={[1, 4, 0, 1]}>
        <Glass w={1040} style={{padding: 26}}>
          <div style={{background: BG, borderRadius: 40, padding: '14px 24px', display: 'flex', gap: 14, alignItems: 'center', border: '1px solid rgba(255,255,255,.1)'}}>
            <svg width={26} height={26} viewBox="0 0 40 40">
              <circle cx={17} cy={17} r={11} fill="none" stroke={GRAY} strokeWidth={4} />
              <path d="M25 25 L35 35" stroke={GRAY} strokeWidth={4} strokeLinecap="round" />
            </svg>
            <Txt size={30}>
              <Typed text="best toggle interactions" from={31.75} to={33.15} />
            </Txt>
          </div>
          {[
            ['Read ', 'Micro-interaction patterns'],
            ['Read ', 'Spring physics for toggles'],
            ['Saved', 'Accessible switch states'],
          ].map(([k, r], i) => {
            const p = ease(t, 33.3 + i * 0.3, 0.6);
            return (
              <div key={r} style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 18, opacity: p, transform: `translateX(${(1 - p) * 24}px)`, filter: `blur(${(1 - p) * 6}px)`}}>
                <Mono lines={[k]} />
                <Txt size={28} style={{borderBottom: `2px dashed ${RED}`, paddingBottom: 2}}>{r}</Txt>
              </div>
            );
          })}
        </Glass>
      </InCell>
      <InCell at={29.5} until={36.6} cell={[1, 4, 1, 2]}>
        <Txt size={58} color={GRAY} style={{letterSpacing: -1.8, lineHeight: 1.42, whiteSpace: 'normal', width: 1000}}>
          One <U>component</U>. One <U>new learning</U>. It searches the <U>internet</U> for the best interaction.
        </Txt>
      </InCell>
      {[
        ['Where to build it.', 37.46],
        ['How to build it.', 38.58],
      ].map(([txt, at], i) => (
        <InCell key={txt as string} at={36.78 + i * 0.12} until={39.92} cell={[1, 4, 1, 2]} place={{left: PAD, top: PAD + i * 112}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
            <Check at={at as number} size={70} />
            <Txt size={76} w={600} color={t >= (at as number) ? WHITE : DIM} style={{letterSpacing: -3}}>{txt as string}</Txt>
          </div>
        </InCell>
      ))}
      <InCell at={29.6} until={39.92} cell={[1, 4, 1, 2]} place={{right: PAD, bottom: PAD}}>
        <Mono align="right" lines={['Fig. 05 — layers, then the loupe', 'Frame 05']} />
      </InCell>

      {/* 03 · CLIENT BRIEF → DESIGNS (after the pill) 39.92 → 48.92 */}
      <RedCell at={41.35} until={48.92} cell={[0, 1, 0, 1]} />
      <InCell at={41.5} until={48.92} cell={[0, 1, 0, 1]} anim="none" place={{left: PAD, bottom: PAD - 6}}>
        <Display lines={['03 / Client brief', '→ designs']} at={41.52} until={48.92} size={120} />
      </InCell>
      <InCell at={41.76} until={44.65} cell={[0, 1, 1, 2]} place={{left: PAD + fly * 60, top: PAD + fly * 330}}>
        <div style={{width: 380, padding: 26, boxSizing: 'border-box', background: PAPER, borderRadius: 14, transform: `scale(${1 - fly * 0.72})`, transformOrigin: 'left top', opacity: 1 - fly * 0.85}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 24, color: BG}}>client-brief.pdf</div>
            <div style={{fontFamily: MONO, fontSize: 12, color: '#8A867E'}}>4 pp</div>
          </div>
          <div style={{height: 110, borderRadius: 8, marginTop: 18, background: RED}} />
          {[1, 0.86, 0.92, 0.7, 0.8].map((w, i) => (
            <div key={i} style={{height: 10, width: `${w * 100}%`, background: 'rgba(0,0,0,.13)', borderRadius: 5, marginTop: 15}} />
          ))}
        </div>
      </InCell>
      <InCell at={44.7} until={48.92} cell={[0, 1, 1, 2]}>
        <Txt size={54} color={GRAY} style={{lineHeight: 1.45, letterSpacing: -1.6, whiteSpace: 'normal', width: 1060}}>
          Paste any <U>client brief</U> into <U>ChatGPT</U>, ask for designs, get them <U>in Figma</U>.
        </Txt>
      </InCell>
      <InCell at={43.6} until={48.92} cell={[0, 1, 1, 2]} place={{left: PAD, bottom: PAD}}>
        <Glass w={1064} style={{padding: '16px 16px 16px 24px', borderRadius: 60, display: 'flex', alignItems: 'center', gap: 16}}>
          {t >= 44.6 && <div style={{background: PAPER, borderRadius: 10, padding: '7px 14px', fontFamily: SANS, fontWeight: 600, fontSize: 20, color: BG, flex: 'none'}}>client-brief.pdf</div>}
          <Txt size={30} style={{flex: 1, overflow: 'hidden'}}>{t < 45.62 ? <span style={{color: GRAY}}>Message ChatGPT</span> : <Typed text="Help me create the designs out of this" from={45.7} to={47.0} />}</Txt>
          <div style={{width: 60, height: 60, borderRadius: 30, background: t >= 47.1 ? WHITE : '#2A2A2E', display: 'grid', placeItems: 'center', flex: 'none'}}>
            <svg width={24} height={24} viewBox="0 0 30 30">
              <path d="M15 25 V6 M7 13 L15 5 L23 13" fill="none" stroke={t >= 47.1 ? BG : GRAY} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Glass>
      </InCell>
      {[
        ['Client brief', 41.76],
        ['ChatGPT', 44.72],
        ['Figma', 47.1],
      ].map(([txt, at], i) => (
        <InCell key={txt as string} at={41.9 + i * 0.1} until={48.92} cell={[2, 4, 1, 2]} place={{left: PAD, top: PAD + i * 120}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <div style={{width: 60, height: 60, borderRadius: 30, border: `2px solid ${t >= (at as number) ? RED : DIM}`, background: t >= (at as number) ? RED : 'transparent', display: 'grid', placeItems: 'center', fontFamily: MONO, fontSize: 20, color: WHITE}}>{i + 1}</div>
            <Txt size={42} color={t >= (at as number) ? WHITE : DIM}>{txt as string}</Txt>
          </div>
          {i < 2 && <div style={{position: 'absolute', left: 29, top: 66, width: 2, height: 48, background: DIM}} />}
        </InCell>
      ))}
      <InCell at={42.2} until={48.92} cell={[2, 4, 1, 2]} place={{right: PAD, bottom: PAD}}>
        <Mono align="right" lines={['Brief → ChatGPT → Figma', 'Frame 06']} />
      </InCell>

      {/* FIGMA 48.92 → 51.31 */}
      <InCell at={T.figma + 0.4} until={T.out} cell={[0, 1, 0, 1]}>
        <Glass w={1184} h={808} style={{padding: 28, position: 'relative', overflow: 'hidden'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Mono color={WHITE} lines={['Figma  ·  Client project']} />
            <Mono lines={['generated by ChatGPT']} />
          </div>
          {[
            ['Landing', 49.6],
            ['Product', 49.9],
            ['Checkout', 50.2],
          ].map(([name, at], i) => {
            const p = ease(t, at as number, 0.6);
            return (
              <div key={name as string} style={{position: 'absolute', left: 28 + i * 376, top: 84, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 40}px)`, filter: `blur(${(1 - p) * 8}px)`}}>
                <Mono lines={[name as string]} />
                <div style={{width: 352, height: 660, marginTop: 10, background: '#141416', borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)', position: 'relative'}}>
                  <div style={{height: 330, background: [SLATE, RED, PAPER][i], display: 'flex', alignItems: 'flex-end', padding: 22, boxSizing: 'border-box', position: 'relative'}}>
                    {i === 2 && <div style={{position: 'absolute', right: 26, top: 26, width: 120, height: 120, borderRadius: 60, background: RED}} />}
                    <div style={{fontFamily: DISPLAY, fontSize: 92, lineHeight: 0.92, color: i === 1 ? WHITE : BG}}>
                      {['HELLO,', 'NEW', 'SAY'][i]}
                      <br />
                      {['STUDIO', 'DROP', 'YES'][i]}
                    </div>
                  </div>
                  <div style={{padding: 24}}>
                    <Txt size={32} w={600} style={{whiteSpace: 'normal'}}>{['Built with intent.', 'Made to move.', 'Ready when you are.'][i]}</Txt>
                    <div style={{height: 10, width: '70%', background: DIM, borderRadius: 5, marginTop: 22}} />
                    <div style={{height: 10, width: '52%', background: DIM, borderRadius: 5, marginTop: 12}} />
                  </div>
                  <div style={{position: 'absolute', left: 24, right: 24, bottom: 24, height: 62, borderRadius: 31, background: WHITE, display: 'grid', placeItems: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 21, color: BG}}>
                    {i === 2 ? 'Pay now' : 'Get started'}
                  </div>
                </div>
              </div>
            );
          })}
          {t >= 50.4 && (
            <div style={{position: 'absolute', left: interpolate(t, [50.4, 51.0], [1100, 690], {...clamp, easing: OUT_EXPO}), top: interpolate(t, [50.4, 51.0], [780, 560], {...clamp, easing: OUT_EXPO}), display: 'flex', alignItems: 'flex-start'}}>
              <svg width={30} height={36} viewBox="0 0 34 40">
                <path d="M3 3 L3 33 L12 25 L19 38 L25 35 L18 22 L30 22 Z" fill={WHITE} stroke={BG} strokeWidth={2} />
              </svg>
              <div style={{background: SLATE, borderRadius: 8, padding: '4px 12px', marginTop: 26, fontFamily: SANS, fontWeight: 600, fontSize: 20, color: BG}}>ChatGPT</div>
            </div>
          )}
        </Glass>
      </InCell>
      <InCell at={T.figma + 0.6} until={T.out} cell={[2, 4, 0, 1]} anim="none" place={{left: PAD, top: 380 + PAD}}>
        <Display lines={['Done', ['in Figma', RED]]} at={T.figma + 0.62} until={T.out} size={120} />
      </InCell>
      <InCell at={T.figma + 0.8} until={T.out} cell={[2, 4, 0, 1]} place={{right: PAD, bottom: PAD}}>
        <Mono align="right" lines={['Output · designs in Figma', 'Frame 07']} />
      </InCell>

      {/* OUTRO 51.31 → 56.76 */}
      <InCell at={51.55} until={54.55} cell={[0, 1, 0, 1]} anim="none" place={{left: PAD, bottom: PAD - 8}}>
        <Display lines={['Things are', ['evolving', RED]]} at={51.6} until={54.55} size={210} />
      </InCell>
      <InCell at={54.6} until={T.end + 0.3} cell={[0, 1, 0, 1]} anim="none" place={{left: PAD, bottom: PAD - 8}}>
        <Display lines={['That’s how', 'we should']} at={54.62} until={T.end + 0.3} size={210} />
      </InCell>
      <RedCell at={55.9} until={T.end + 1.6} cell={[0, 1, 1, 2]} />
      <InCell at={56.0} until={T.end + 0.4} cell={[0, 1, 1, 2]} anim="none" place={{left: PAD, bottom: PAD - 10}}>
        <Display lines={['Evolve.']} at={56.02} until={T.end + 0.4} size={250} />
      </InCell>
      <InCell at={52.0} until={T.end} cell={[2, 4, 1, 2]} place={{left: (584 - 400) / 2, top: 12}}>
        <HairFig fig="terrain" at={52.0} w={400} intensity={0.9} />
      </InCell>
      <InCell at={52.2} until={T.end} cell={[2, 4, 1, 2]} place={{right: PAD, bottom: PAD}}>
        <Mono align="right" lines={['The takeaway', 'Frame 08']} />
      </InCell>
    </>
  );
};

// ---------- Statement pills: slate, Anton, over a blurred stage ----------
const PILLS: [number, number, string][] = [
  [11.0, 12.45, 'Crazy'],
  [17.0, 18.4, '08:00'],
  [26.27, 27.85, 'Learn'],
  [39.92, 41.45, 'Design'],
];
const pillAmount = (t: number) => {
  let a = 0;
  for (const [s, e] of PILLS) a = Math.max(a, ease(t, s - 0.12, 0.4, IN_OUT) * (1 - ease(t, e - 0.35, 0.35, IN_OUT)));
  return a;
};
const Pill = () => {
  const t = useT();
  const cur = PILLS.find(([a, b]) => t >= a - 0.1 && t < b);
  if (!cur) return null;
  const [a, b, word] = cur;
  const pin = ease(t, a, 0.75);
  const pout = ease(t, b - 0.35, 0.35, IN_EXPO);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          background: SLATE,
          borderRadius: 220,
          padding: '6px 120px 2px',
          fontFamily: DISPLAY,
          fontSize: 260,
          lineHeight: 1.12,
          color: BG,
          textTransform: 'uppercase',
          opacity: Math.min(1, pin * 1.5) * (1 - pout),
          transform: `translateX(${(t - a) * 12}px) scale(${(0.84 + 0.16 * pin) * (1 - pout * 0.06)})`,
          filter: `blur(${(1 - pin) * 16 + pout * 14}px)`,
        }}
      >
        {word}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Frame furniture (top bar, index, timecode) ----------
const CHAPTERS: [number, string][] = [
  [0, 'Intro'],
  [17.32, 'Daily brief'],
  [26.27, 'Component'],
  [39.92, 'Brief → Figma'],
  [51.31, 'Outro'],
];
const Chrome = () => {
  const t = useT();
  let c = 0;
  while (c + 1 < CHAPTERS.length && t >= CHAPTERS[c + 1][0]) c++;
  const tc = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}:${String(Math.floor((t % 1) * FPS)).padStart(2, '0')}`;
  const idx = ['08:00 news brief,', 'component study,', 'brief → figma'];
  return (
    <AbsoluteFill style={{opacity: ease(t, 0.1, 1.0)}}>
      <div style={{position: 'absolute', left: 96, right: 96, top: 34, display: 'grid', gridTemplateColumns: '1fr 1fr 140px 1fr', alignItems: 'baseline'}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 24, color: WHITE, letterSpacing: -0.8}}>hardik.</div>
        <Mono color={WHITE} lines={['AI Automations']} />
        <Mono color={WHITE} lines={[String(c).padStart(2, '0')]} />
        <Mono color={WHITE} align="right" lines={[CHAPTERS[c][1]]} />
      </div>
      <div style={{position: 'absolute', left: 96, top: BAND + 14}}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 13, color: WHITE, lineHeight: 1.4}}>Automations(3):</div>
        {idx.map((l, i) => (
          <div key={l} style={{fontFamily: MONO, fontSize: 13, lineHeight: 1.4, color: c === i + 1 ? WHITE : GRAY}}>
            {l}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', right: 96, top: BAND + 14}}>
        <Mono align="right" size={13} lines={[tc, 'YR26']} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- Captions: in the band under the bottom guide ----------
type Wd = {t: string; s: number; e: number};
const chunks: Wd[][] = [];
{
  let cur: Wd[] = [];
  (words as Wd[]).forEach((w, i) => {
    const next = (words as Wd[])[i + 1];
    cur.push(w);
    const len = cur.reduce((n, x) => n + x.t.length + 1, 0);
    if (!next || /[.,]$/.test(w.t) || next.s - w.e > 0.35 || cur.length >= 6 || len > 34) {
      chunks.push(cur);
      cur = [];
    }
  });
}
const Captions = () => {
  const t = useT();
  if (t >= T.end) return null;
  const idx = chunks.findIndex((c, i) => t >= c[0].s - 0.05 && (i + 1 >= chunks.length || t < chunks[i + 1][0].s - 0.05));
  if (idx < 0) return null;
  const c = chunks[idx];
  if (t > c[c.length - 1].e + 0.5) return null;
  const p = ease(t, c[0].s - 0.05, 0.4);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: BAND + 24, display: 'flex', justifyContent: 'center', gap: 9, opacity: p, filter: `blur(${(1 - p) * 6}px)`}}>
      {c.map((w, i) => (
        <span key={i} style={{fontFamily: SANS, fontWeight: 500, fontSize: 34, letterSpacing: -0.7, color: t >= w.s - 0.03 ? WHITE : '#4A4A4E'}}>
          {w.t}
        </span>
      ))}
    </div>
  );
};

// ---------- End card: every cell turns red in a stagger ----------
const EndCard = () => {
  const t = useT();
  if (t < T.end) return null;
  return (
    <>
      <RedCell at={T.end + 0.05} until={99} cell={[0, 1, 0, 1]} />
      <RedCell at={T.end + 0.15} until={99} cell={[2, 4, 0, 1]} />
      <RedCell at={T.end + 0.25} until={99} cell={[2, 4, 1, 2]} />
      <InCell at={T.end + 0.4} until={99} cell={[0, 1, 0, 1]} anim="none" place={{left: PAD, bottom: PAD - 8}}>
        <Display lines={['Follow for more', 'AI workflows']} at={T.end + 0.45} until={99} size={150} />
      </InCell>
      <InCell at={T.end + 0.8} until={99} cell={[0, 1, 1, 2]} place={{left: PAD, top: PAD}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div style={{background: SLATE, borderRadius: 40, padding: '4px 26px 0', fontFamily: DISPLAY, fontSize: 44, color: BG}}>FOLLOW</div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: WHITE, letterSpacing: -1}}>hardik.</div>
        </div>
      </InCell>
      <InCell at={T.end + 0.7} until={99} cell={[2, 4, 1, 2]} place={{right: PAD, bottom: PAD}}>
        <Mono color={WHITE} align="right" size={18} lines={['Hardik Gupta', 'Designer × AI', 'End frame']} />
      </InCell>
    </>
  );
};

const Grain = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile('grain.png')})`,
        backgroundPosition: `${(frame * 73) % 256}px ${(frame * 151) % 256}px`,
        opacity: 0.035,
        mixBlendMode: 'screen',
      }}
    />
  );
};

// ---------- Sound design ----------
const SFX: [number, string, number][] = [
  [0.0, 'swoosh', 0.35],
  [0.2, 'impact', 0.3],
  [2.15, 'whip', 0.28],
  [3.6, 'pop', 0.22],
  [4.15, 'pop', 0.22],
  [4.7, 'pop', 0.22],
  [6.45, 'whoosh', 0.4],
  [8.84, 'tick', 0.16],
  [9.0, 'tick', 0.16],
  [9.16, 'tick', 0.16],
  [9.32, 'tick', 0.16],
  [9.48, 'tick', 0.16],
  [10.9, 'whip', 0.35],
  [11.0, 'impact', 0.45],
  [12.3, 'swoosh', 0.28],
  [15.2, 'whoosh', 0.38],
  [16.9, 'whip', 0.32],
  [17.0, 'impact', 0.38],
  [18.25, 'swoosh', 0.26],
  [18.6, 'ding', 0.2],
  [20.3, 'switch', 0.3],
  [22.5, 'whip', 0.25],
  [24.24, 'tick', 0.2],
  [24.5, 'tick', 0.2],
  [24.76, 'tick', 0.2],
  [26.17, 'whip', 0.35],
  [26.27, 'impact', 0.42],
  [27.75, 'swoosh', 0.26],
  [29.3, 'pop', 0.24],
  [30.06, 'switch', 0.45],
  [31.4, 'swoosh', 0.26],
  [33.3, 'tick', 0.2],
  [33.6, 'tick', 0.2],
  [33.9, 'tick', 0.2],
  [36.78, 'swoosh', 0.26],
  [37.46, 'pop', 0.28],
  [38.58, 'pop', 0.28],
  [39.82, 'whip', 0.35],
  [39.92, 'impact', 0.42],
  [41.35, 'swoosh', 0.26],
  [41.76, 'page-turn', 0.38],
  [43.9, 'whoosh', 0.3],
  [44.6, 'pop', 0.24],
  [47.1, 'mouse-click', 0.4],
  [48.87, 'whoosh', 0.38],
  [49.6, 'pop', 0.24],
  [49.9, 'pop', 0.24],
  [50.2, 'pop', 0.24],
  [50.5, 'shutter-modern', 0.24],
  [51.26, 'whoosh', 0.4],
  [54.4, 'riser', 0.38],
  [55.9, 'impact', 0.62],
  [56.76, 'swoosh', 0.35],
  [57.6, 'ding', 0.2],
];
for (let t = 31.75; t < 33.15; t += 0.11) SFX.push([t, 'mouse-click', 0.08]);
for (let t = 45.7; t < 47.0; t += 0.1) SFX.push([t, 'mouse-click', 0.08]);

const SoundDesign = () => (
  <>
    <Audio src={staticFile('talk.mp4')} />
    {SFX.map(([t, file, vol], i) => (
      <Sequence key={i} from={f(t)} durationInFrames={f(2)} layout="none">
        <Audio src={staticFile(`sfx/${file}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </>
);

export const Reel = () => {
  const t = useT();
  const p = pillAmount(t);
  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill style={{filter: p > 0.01 ? `blur(${p * 20}px) brightness(${1 - p * 0.45})` : undefined}}>
        <GridLines />
        <Scenes />
        <FaceTile />
        <EndCard />
      </AbsoluteFill>
      <Pill />
      <Chrome />
      <Captions />
      <Grain />
      <SoundDesign />
    </AbsoluteFill>
  );
};
