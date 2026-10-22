import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import duetPaths from './duet-paths.json';

// 5s, 1:1 insert for the top half of a 9:16 talking-head video: "dots vs Claude Duet".
// Act 1 shows the references pulled from the web as a captioned board; act 2 splits into a versus.
// Reference images live in public/refs/ (not committed: third-party press material).

export const DVD_SIZE = 1080;
export const DVD_FRAMES = 150;
const FPS = 30;

const BG = '#0B0B0B';
const WHITE = '#F2F0EC';
const GRAY = '#7A7A7F';
const SLATE = '#8FA3B8';
const LINE = 'rgba(194,34,15,.6)';
// Taken from the brands' own assets.
const DUET_CREAM = '#F1EEE7';
const DUET_CARD = '#FAFAF8';
const DUET_CORAL = '#D97757';
const DUET_INK = '#141413';
const DISPLAY = "'Anton', sans-serif";
const SANS = "'Inter', sans-serif";
const MONO = "'Space Mono', monospace";

const fontHandle = delayRender('fonts');
Promise.all(
  [
    ['Anton', 'Anton.woff2', '400'],
    ['Inter', 'Inter-Medium.otf', '500'],
    ['Inter', 'Inter-SemiBold.otf', '600'],
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

const Mono: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 13, color = GRAY, style}) => (
  <div style={{fontFamily: MONO, fontSize: size, lineHeight: 1.4, color, whiteSpace: 'pre', ...style}}>{children}</div>
);

// The Duet app icon, rebuilt from claude.com's SVG so its parts can move: the blob grows, the loop draws on.
const DuetIcon: React.FC<{size: number; t: number; at: number; tile?: boolean}> = ({size, t, at, tile = true}) => {
  const blob = ease(t, at, 0.7);
  const loop = ease(t, at + 0.25, 0.8, IN_OUT);
  const id = `loop-${at}`;
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024">
      <defs>
        <clipPath id={id}>
          <rect x={0} y={0} width={1024 * loop} height={1024} />
        </clipPath>
      </defs>
      {tile && <rect width={1024} height={1024} rx={230.4} fill={DUET_CARD} />}
      <path d={duetPaths[0]} fill={DUET_CORAL} style={{transformOrigin: '512px 512px', transform: `scale(${0.6 + 0.4 * blob})`, opacity: Math.min(1, blob * 2)}} />
      <path d={duetPaths[1]} fill={DUET_INK} fillRule="evenodd" clipPath={`url(#${id})`} />
    </svg>
  );
};

// ---------- Act 1: the reference board ----------
const GX = [60, 380, 700, 1020];
const GY = [110, 400, 690, 980];
type Card = {src?: string; kind: 'img' | 'icon' | 'word' | 'copy'; caption: string; side: 'dots' | 'duet'; pos?: string; fit?: 'contain'};
const CARDS: Card[] = [
  {src: 'refs/dots-word.png', kind: 'img', caption: 'OpenAI · key art', side: 'dots', fit: 'contain'},
  {kind: 'icon', caption: 'claude.com/duet · icon', side: 'duet'},
  {src: 'refs/blue.png', kind: 'img', caption: 'OpenAI · launch film', side: 'dots'},
  {kind: 'copy', caption: 'claude.com/duet · copy', side: 'duet'},
  {src: 'refs/heart.png', kind: 'img', caption: 'OpenAI · launch film', side: 'dots'},
  {src: 'refs/dots-ui.jpg', kind: 'img', caption: 'OpenAI · product UI', side: 'dots', pos: '40% 50%'},
  {src: 'refs/alfred.png', kind: 'img', caption: 'OpenAI · "Alfred"', side: 'dots'},
  {src: 'refs/duet-word.png', kind: 'word', caption: 'claude.com/duet · wordmark', side: 'duet'},
  {src: 'refs/green.png', kind: 'img', caption: 'OpenAI · launch film', side: 'dots'},
];
const CARD_AT = (i: number) => 0.12 + i * 0.13;
const BOARD_OUT = 1.72;

const BoardCard: React.FC<{c: Card; i: number}> = ({c, i}) => {
  const t = useT();
  const at = CARD_AT(i);
  if (t < at || t > BOARD_OUT + 0.45) return null;
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = GX[col] + 14;
  const y = GY[row] + 14;
  const w = GX[col + 1] - GX[col] - 28;
  const h = GY[row + 1] - GY[row] - 28;
  const pin = ease(t, at, 0.7);
  const pout = ease(t, BOARD_OUT + i * 0.015, 0.4, IN_EXPO);
  const drift = (c.side === 'dots' ? -1 : 1) * pout * 60;
  const light = c.kind !== 'img';
  return (
    <div
      style={{
        position: 'absolute',
        left: x + drift,
        top: y + (1 - pin) * 30,
        width: w,
        height: h,
        borderRadius: 10,
        overflow: 'hidden',
        background: light ? DUET_CREAM : '#000',
        opacity: Math.min(1, pin * 1.4) * (1 - pout),
        filter: pin < 1 || pout > 0 ? `blur(${(1 - pin) * 14 + pout * 12}px)` : undefined,
        clipPath: `inset(${(1 - pin) * 100}% 0 0 0)`,
      }}
    >
      {c.kind === 'img' && <Img src={staticFile(c.src!)} style={{width: '100%', height: '100%', objectFit: c.fit ?? 'cover', objectPosition: c.pos ?? 'center', transform: `scale(${1.12 - 0.12 * pin + (t - at) * 0.02})`}} />}
      {c.kind === 'icon' && (
        <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'}}>
          <DuetIcon size={150} t={t} at={at} />
        </div>
      )}
      {c.kind === 'word' && (
        <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'}}>
          <Img src={staticFile(c.src!)} style={{width: '82%'}} />
        </div>
      )}
      {c.kind === 'copy' && (
        <div style={{position: 'absolute', left: 20, right: 20, top: 40, background: DUET_CARD, borderRadius: 16, padding: '16px 18px', boxShadow: '0 1px 0 rgba(0,0,0,.05), 0 10px 24px rgba(0,0,0,.06)'}}>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 19, color: DUET_INK, letterSpacing: -0.3, lineHeight: 1.3}}>Morning, Maya.</div>
          <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 17, color: '#5E5D59', letterSpacing: -0.2, lineHeight: 1.35, marginTop: 4}}>5 things in progress and 2 that need you.</div>
        </div>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '22px 12px 10px', background: light ? 'none' : 'linear-gradient(to top, rgba(0,0,0,.7), transparent)'}}>
        <Mono size={12} color={light ? '#6B6A66' : WHITE}>{c.caption}</Mono>
      </div>
    </div>
  );
};

const BoardGuides = () => {
  const t = useT();
  const draw = ease(t, 0, 0.8, IN_OUT);
  const out = ease(t, BOARD_OUT, 0.4, IN_EXPO);
  return (
    <svg width={DVD_SIZE} height={DVD_SIZE} style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
      {GX.map((x) => (
        <line key={`v${x}`} x1={x} x2={x} y1={GY[0]} y2={GY[0] + (GY[3] - GY[0]) * draw} stroke={LINE} strokeWidth={1.6} strokeDasharray="6 7" />
      ))}
      {GY.map((y) => (
        <line key={`h${y}`} y1={y} y2={y} x1={0} x2={DVD_SIZE * draw} stroke={LINE} strokeWidth={1.6} strokeDasharray="6 7" />
      ))}
      {GX.flatMap((x) => GY.map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={4 * draw} fill={WHITE} />))}
    </svg>
  );
};

const BoardHeader = () => {
  const t = useT();
  const pin = ease(t, 0.05, 0.6);
  const out = ease(t, BOARD_OUT, 0.35, IN_EXPO);
  const n = CARDS.filter((_, i) => t >= CARD_AT(i)).length;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 44, display: 'flex', justifyContent: 'space-between', opacity: pin * (1 - out)}}>
      <Mono color={WHITE} size={15}>{'Pulling references…'}</Mono>
      <Mono color={WHITE} size={15}>{`refs ${String(n).padStart(2, '0')} / ${String(CARDS.length).padStart(2, '0')}`}</Mono>
    </div>
  );
};

// ---------- Act 2: the versus ----------
const SPLIT = 1.85;

const Fact: React.FC<{lines: string[]; at: number; color: string; dim: string}> = ({lines, at, color, dim}) => {
  const t = useT();
  return (
    <div>
      {lines.map((l, i) => {
        const p = ease(t, at + i * 0.1, 0.6);
        return (
          <div key={l} style={{fontFamily: i === 0 ? SANS : MONO, fontWeight: i === 0 ? 600 : 400, fontSize: i === 0 ? 30 : 18, letterSpacing: i === 0 ? -0.6 : 0, lineHeight: i === 0 ? 1.3 : 1.55, color: i === 0 ? color : dim, opacity: p, transform: `translateY(${(1 - p) * 16}px)`, filter: `blur(${(1 - p) * 6}px)`}}>
            {l}
          </div>
        );
      })}
    </div>
  );
};

const Versus = () => {
  const t = useT();
  if (t < SPLIT) return null;
  const open = ease(t, SPLIT, 0.5, IN_OUT);
  const push = 1 + Math.max(0, t - SPLIT - 0.6) * 0.012;
  const word = ease(t, SPLIT + 0.1, 0.8);
  const mascots = ease(t, SPLIT + 0.2, 0.9);
  const bob = Math.sin((t - SPLIT) * 4.2) * 6 * mascots;
  const duetWord = ease(t, SPLIT + 0.4, 0.8);
  const bubble = ease(t, SPLIT + 0.9, 0.7);
  const pill = ease(t, SPLIT + 0.45, 0.6);
  return (
    <AbsoluteFill style={{transform: `scale(${push})`}}>
      {/* dots side: black, like OpenAI's key art */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: DVD_SIZE, overflow: 'hidden', background: '#000', clipPath: `inset(0 ${(1 - open) * 100}% 0 0)`}}>
        <div style={{position: 'absolute', left: 50, top: 150, width: 440, opacity: word, filter: `blur(${(1 - word) * 16}px)`, transform: `scale(${0.92 + 0.08 * word})`}}>
          <Img src={staticFile('refs/dots-word.png')} style={{width: 440}} />
        </div>
        <div style={{position: 'absolute', left: 60, top: 420}}>
          <Fact lines={['OpenAI', 'Sep 29 · DevDay', 'GPT-6 Astra', 'always-on agents']} at={SPLIT + 0.4} color={WHITE} dim="#A2A2A8" />
        </div>
        <div style={{position: 'absolute', left: -10, top: 700 + (1 - mascots) * 300 + bob, width: 560}}>
          <Img src={staticFile('refs/dots-mascots.png')} style={{width: 560}} />
        </div>
        <Mono size={12} color={GRAY} style={{position: 'absolute', left: 60, top: 60, opacity: word}}>{'source · openai.com'}</Mono>
      </div>

      {/* Duet side: Claude's cream, wiping in from the right */}
      <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: DVD_SIZE, background: DUET_CREAM, clipPath: `inset(0 0 0 ${(1 - open) * 100}%)`}}>
        <div style={{position: 'absolute', left: 50, top: 130}}>
          <DuetIcon size={150} t={t} at={SPLIT + 0.2} />
        </div>
        <div style={{position: 'absolute', left: 50, top: 300, opacity: duetWord, filter: `blur(${(1 - duetWord) * 12}px)`, transform: `translateY(${(1 - duetWord) * 20}px)`}}>
          <Img src={staticFile('refs/duet-word.png')} style={{width: 420}} />
        </div>
        <div style={{position: 'absolute', left: 60, top: 420}}>
          <Fact lines={['Anthropic', 'Oct 21 · research preview', 'Opus 5.5', 'proactive agent']} at={SPLIT + 0.5} color={DUET_INK} dim="#5E5D59" />
        </div>
        <div style={{position: 'absolute', left: 50, right: 50, top: 760 + (1 - bubble) * 60, opacity: bubble, filter: `blur(${(1 - bubble) * 10}px)`, background: DUET_CARD, borderRadius: 22, padding: '22px 26px', boxShadow: '0 1px 0 rgba(0,0,0,.05), 0 16px 34px rgba(0,0,0,.07)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10}}>
            <DuetIcon size={34} t={t} at={SPLIT + 0.9} tile={false} />
            <Mono size={13} color="#6B6A66">{'Duet · 7:30 AM brief'}</Mono>
          </div>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 26, color: DUET_INK, letterSpacing: -0.5}}>Morning, Maya.</div>
          <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 22, color: '#5E5D59', letterSpacing: -0.3, marginTop: 4}}>5 things in progress and 2 that need you.</div>
        </div>
        <Mono size={12} color="#6B6A66" style={{position: 'absolute', right: 60, top: 60, opacity: duetWord}}>{'source · claude.com/duet'}</Mono>
      </div>

      {/* the seam */}
      <div style={{position: 'absolute', left: 540, top: 0, width: 1, height: DVD_SIZE, background: 'rgba(255,255,255,.12)', opacity: open}} />
      <div style={{position: 'absolute', left: 540, top: 655, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * pill}) rotate(${(1 - pill) * -8}deg)`, opacity: Math.min(1, pill * 1.6), filter: `blur(${(1 - pill) * 10}px)`}}>
        <div style={{background: SLATE, color: BG, fontFamily: DISPLAY, fontSize: 92, lineHeight: 1.12, padding: '2px 40px 0', borderRadius: 120, boxShadow: '0 20px 50px rgba(0,0,0,.35)'}}>VS</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Sound ----------
const SFX: [number, string, number][] = [
  [0.0, 'swoosh', 0.3],
  ...CARDS.map((_, i): [number, string, number] => [CARD_AT(i), i % 3 === 1 ? 'pop' : 'tick', 0.22]),
  [1.7, 'whoosh', 0.4],
  [SPLIT + 0.05, 'whip', 0.32],
  [SPLIT + 0.45, 'impact', 0.55],
  [SPLIT + 0.5, 'tick', 0.18],
  [SPLIT + 0.6, 'tick', 0.18],
  [SPLIT + 0.9, 'ding', 0.2],
];

export const DotsVsDuet = () => (
  <AbsoluteFill style={{background: BG}}>
    <BoardGuides />
    {CARDS.map((c, i) => (
      <BoardCard key={i} c={c} i={i} />
    ))}
    <BoardHeader />
    <Versus />
    {SFX.map(([t, file, vol], i) => (
      <Sequence key={i} from={f(t)} durationInFrames={f(2)} layout="none">
        <Audio src={staticFile(`sfx/${file}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
