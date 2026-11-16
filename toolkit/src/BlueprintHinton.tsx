// "Everyone mocked it" EP. 01 — Geoffrey Hinton, in the Blueprint Cut format (.claude/skills/blueprint-cut-edit).
// 1080×1920, 30 fps, 43 s. Built silent to a 2.7 words/s reading pace; T below holds every spoken-word time so the
// whole film re-times when Hardik's voice-over arrives. Project notes: projects/2026-11-16-hinton-blueprint/.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {KIT} from './sfxkit';

export const BP_W = 1080;
export const BP_H = 1920;
export const BP_FPS = 30;
export const BP_FRAMES = 1272;

const PAPER = '#ebe3db';
const INK = '#100d13';
const COBALT = '#002ca8';
const COBALT_TYPE = '#183a96';
const SOFT_BLUE = '#7f93d6';
const CREAM = '#efe8df';
const WHITE = '#f6f4f5';

// ---------- fonts
const fonts: [string, string, FontFaceDescriptors][] = [
  ['Anton', 'fonts/Anton.woff2', {}],
  ['Space Mono', 'fonts/SpaceMono-400.woff2', {weight: '400'}],
  ['Space Mono', 'fonts/SpaceMono-700.woff2', {weight: '700'}],
  ['EB Garamond', 'fonts/eb-garamond-latin-500-italic.woff2', {style: 'italic', weight: '500'}],
  ['Inter', 'fonts/Inter-SemiBold.otf', {weight: '600'}],
];
if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  Promise.all(
    fonts.map(([fam, file, d]) => new FontFace(fam, `url(${staticFile(file)})`, d).load().then((f) => document.fonts.add(f))),
  ).then(() => continueRender(h));
}

// ---------- beats (frames). Every payoff time lives here.
const B = {
  hook: 0, nobel: 105, name: 183, giveUp: 255, waste: 351, toronto: 438, years: 492, network: 594,
  everyAI: 720, silence: 810, right: 828, question: 894, early: 972, commands: 1056, cta: 1164,
};
const T = {
  dead: 72, end: 82, nobelWord: 150, geoffrey: 216, hinton: 228, giveUp: 318, wasteWord: 408, ofTime: 420,
  years25: 558, oneNetwork: 660, beat: 690, everyAI: 762, rightWord: 870, lasted: 930, earlyWord: 1026,
  keep: 1056, post: 1086, learn: 1110, again: 1134, follow: 1174, forW: 1186, more: 1198,
};

const img = (f: string) => staticFile(`imagery/hinton/${f}`);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const prog = (f: number, a: number, b: number) => ease(interpolate(f, [a, b], [0, 1], clamp));

// ---------- shared pieces
const Grain: React.FC<{o?: number}> = ({o = 0.16}) => (
  <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '512px', opacity: o, mixBlendMode: 'multiply', pointerEvents: 'none'}} />
);

// Dashed guides with a dot at each crossing. p draws them in from the cell outwards.
const Guides: React.FC<{xs: number[]; ys: number[]; color: string; p?: number; o?: number}> = ({xs, ys, color, p = 1, o = 0.75}) => {
  const dash = `repeating-linear-gradient(VAR, ${color} 0 9px, transparent 9px 18px)`;
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      {xs.map((x) => (
        <div key={`x${x}`} style={{position: 'absolute', left: x - 1, top: 0, width: 2, height: BP_H, background: dash.replace('VAR', 'to bottom'), transform: `scaleY(${p})`, transformOrigin: `50% ${((ys[0] + ys[ys.length - 1]) / 2 / BP_H) * 100}%`}} />
      ))}
      {ys.map((y) => (
        <div key={`y${y}`} style={{position: 'absolute', top: y - 1, left: 0, height: 2, width: BP_W, background: dash.replace('VAR', 'to right'), transform: `scaleX(${p})`, transformOrigin: '50% 50%'}} />
      ))}
      {p > 0.6 && xs.map((x) => ys.map((y) => <div key={`${x}-${y}`} style={{position: 'absolute', left: x - 6, top: y - 6, width: 12, height: 12, borderRadius: 6, background: color}} />))}
    </AbsoluteFill>
  );
};

// Tiny mono set-up line; words arrive one by one on their spoken frame.
const Setup: React.FC<{words: string[]; at: number[]; x: number; y: number; color: string; align?: 'left' | 'center' | 'right'; w?: number; size?: number}> = ({words, at, x, y, color, align = 'left', w = 900, size = 34}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: align, fontFamily: 'Space Mono', fontSize: size, letterSpacing: '0.16em', color, lineHeight: 1.5, textTransform: 'uppercase'}}>
      {words.map((wd, i) => (
        <span key={i} style={{opacity: f >= at[i] ? 1 : 0}}>{wd} </span>
      ))}
    </div>
  );
};

// Payoff word: Anton, hard cut-in on the spoken frame, no motion.
const Payoff: React.FC<{text: string; at: number; x?: number; y: number; size: number; color: string; align?: 'left' | 'center' | 'right'; w?: number; outline?: boolean; until?: number}> = ({text, at, x = 90, y, size, color, align = 'left', w = 900, outline, until}) => {
  const f = useCurrentFrame();
  if (f < at || (until !== undefined && f >= until)) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: align, fontFamily: 'Anton', fontSize: size, lineHeight: 1, color: outline ? 'transparent' : color, WebkitTextStroke: outline ? `3px ${color}` : undefined, whiteSpace: 'nowrap', letterSpacing: '0.005em'}}>
      {text}
    </div>
  );
};

const Small: React.FC<{text: string; at: number; x: number; y: number; color: string; align?: 'left' | 'center' | 'right'; w?: number; size?: number}> = ({text, at, x, y, color, align = 'left', w = 900, size = 40}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: align, fontFamily: 'Space Mono', fontSize: size, letterSpacing: '0.16em', color, textTransform: 'uppercase'}}>{text}</div>;
};

const Cell: React.FC<{x: number; y: number; w: number; h: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, w, h, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', ...style}}>{children}</div>
);
const Cover: React.FC<{src: string; pos?: string; style?: React.CSSProperties}> = ({src, pos = '50% 30%', style}) => (
  <Img src={img(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, ...style}} />
);

// the main cell used by most beats
const CX = [90, 990];
const CY = [480, 1170];
const CW = 900;
const CH = 690;
const SETUP_Y = 384;
const PAY_Y = 1218;

// neural network drawing (our own line art) inside the 900×690 cell
const LAYERS = [3, 5, 5, 2];
const nodePos = (l: number, i: number) => ({x: 110 + l * 227, y: CH / 2 + (i - (LAYERS[l] - 1) / 2) * 118});
const Net: React.FC<{draw: number; lit?: number; stroke: string; node: string; litColor?: string}> = ({draw, lit = 0, stroke, node, litColor}) => {
  const lines: React.ReactNode[] = [];
  let n = 0;
  const total = 3 * 5 + 5 * 5 + 5 * 2;
  for (let l = 0; l < LAYERS.length - 1; l++)
    for (let i = 0; i < LAYERS[l]; i++)
      for (let j = 0; j < LAYERS[l + 1]; j++) {
        const a = nodePos(l, i), b = nodePos(l + 1, j);
        const on = n / total < draw;
        const isLit = litColor && n / total < lit;
        if (on) lines.push(<line key={n} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={isLit ? litColor : stroke} strokeWidth={isLit ? 3 : 1.5} opacity={isLit ? 0.9 : 0.55} />);
        n++;
      }
  return (
    <svg width={CW} height={CH} style={{position: 'absolute', inset: 0}}>
      {lines}
      {LAYERS.map((c, l) =>
        Array.from({length: c}).map((_, i) => {
          const p = nodePos(l, i);
          const show = draw > l / LAYERS.length;
          const isLit = litColor && lit > l / (LAYERS.length - 0.5);
          return show ? <circle key={`${l}-${i}`} cx={p.x} cy={p.y} r={20} fill={isLit ? litColor : node} stroke={isLit ? litColor : stroke} strokeWidth={2.5} /> : null;
        }),
      )}
    </svg>
  );
};

// ---------- beats
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const r = interpolate(f, [0, 10], [0, 11], clamp); // halftone dots grow until the image is whole
  const flick = ['CRAZY.', 'NONSENSE.', 'WASTE OF TIME.', 'GIVE UP.'];
  const k = Math.min(3, Math.floor(Math.max(0, f - 12) / 15));
  const xs = [160, 920], ys = [596, 716];
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <Img src={img('halftone.png')} style={{position: 'absolute', left: 160, top: 300, width: 760, height: 898, WebkitMaskImage: r < 10.5 ? `radial-gradient(circle, #000 ${r}px, transparent ${r + 0.8}px)` : undefined, WebkitMaskSize: '15px 15px'}} />
      {f >= 12 && (
        <div style={{position: 'absolute', left: 160, top: 596, width: 760, height: 120, background: COBALT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono', fontWeight: 700, fontSize: 46, letterSpacing: '0.16em', color: CREAM}}>
          {flick[k % flick.length]}
        </div>
      )}
      <Guides xs={xs} ys={ys} color={COBALT_TYPE} p={prog(f, 6, 18)} />
      <Setup words={['For', '40', 'years', 'they', 'called', 'his', 'bet', 'a']} at={[14, 20, 26, 38, 44, 54, 60, 68]} x={160} y={248} w={780} size={27} color={COBALT_TYPE} />
      {f >= T.dead && (
        <div style={{position: 'absolute', left: 160, top: 1232, width: 760, fontFamily: 'Anton', fontSize: 212, lineHeight: 1, color: COBALT_TYPE, whiteSpace: 'nowrap'}}>
          DEAD <span style={{opacity: f >= T.end ? 1 : 0}}>END.</span>
        </div>
      )}
      <Grain />
    </AbsoluteFill>
  );
};

const Nobel: React.FC = () => {
  const f = useCurrentFrame() - B.nobel;
  if (f < 4) return <AbsoluteFill style={{background: INK}} />;
  const pop = prog(f, 5, 13);
  const medal = prog(f, 35, 44);
  return (
    <AbsoluteFill style={{background: COBALT}}>
      <Guides xs={CX} ys={CY} color={CREAM} p={prog(f, 4, 14)} o={0.6} />
      <Cell x={CX[0]} y={CY[0]} w={CW} h={CH}>
        <Img src={img('sticker.png')} style={{position: 'absolute', left: 100, bottom: -6, height: 700, transform: `scale(${0.82 + 0.18 * pop})`, transformOrigin: '50% 100%', opacity: pop > 0 ? 1 : 0}} />
      </Cell>
      {medal > 0 && (
        <div style={{position: 'absolute', left: 742, top: 470, width: 210, height: 210, borderRadius: 105, background: CREAM, transform: `scale(${0.4 + 0.6 * medal}) rotate(${(1 - medal) * -30}deg)`, boxShadow: '0 10px 0 rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 176, height: 176, borderRadius: 88, border: `3px solid ${COBALT_TYPE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Anton', fontSize: 62, color: COBALT_TYPE}}>2024</div>
        </div>
      )}
      <Setup words={['In', '2024', 'it', 'won', 'the']} at={[B.nobel + 8, B.nobel + 14, B.nobel + 28, B.nobel + 33, B.nobel + 40].map((v) => v - 0)} x={CX[0]} y={SETUP_Y} color={CREAM} />
      <Payoff text="NOBEL" at={T.nobelWord} y={PAY_Y} size={250} color={CREAM} />
      <Small text="Prize in Physics" at={T.nobelWord + 8} x={CX[0]} y={PAY_Y + 262} color={CREAM} />
      <Grain o={0.1} />
    </AbsoluteFill>
  );
};

const Name: React.FC = () => {
  const f = useCurrentFrame() - B.name;
  const c = prog(f, 10, 20); // full frame collapses to a sliver
  const x = interpolate(c, [0, 1], [0, 90]);
  const y = interpolate(c, [0, 1], [0, CY[0]]);
  const w = interpolate(c, [0, 1], [BP_W, 250]);
  const h = interpolate(c, [0, 1], [BP_H, 690]);
  return (
    <AbsoluteFill style={{background: INK}}>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden'}}>
        <Img src={img('c23_bw.jpg')} style={{position: 'absolute', left: -340 * (1 - c) - 232 * c, top: -120 * (1 - c) - 40 * c, height: interpolate(c, [0, 1], [2300, 1500])}} />
      </div>
      {c > 0.95 && <Guides xs={[90, 340]} ys={CY} color={CREAM} p={prog(f, 18, 28)} o={0.6} />}
      <Setup words={['His', 'name', 'is']} at={[B.name + 22, B.name + 25, B.name + 30]} x={380} y={512} w={600} color={CREAM} />
      <Payoff text="GEOFFREY" at={T.geoffrey} x={376} y={610} size={176} color={CREAM} w={620} />
      <Payoff text="HINTON" at={T.hinton} x={376} y={792} size={176} color={SOFT_BLUE} w={620} />
      <Grain o={0.1} />
    </AbsoluteFill>
  );
};

const tear = (() => {
  // jagged right edge of the torn-off piece, as % of the cell
  const pts: string[] = ['0% 0%'];
  const xs = [46, 52, 44, 55, 47, 58, 49, 60, 50, 57, 46, 54, 45];
  xs.forEach((x, i) => pts.push(`${x}% ${(i / (xs.length - 1)) * 100}%`));
  pts.push('0% 100%');
  const rest: string[] = ['100% 0%'];
  [...xs].reverse().forEach((x, i) => rest.push(`${x}% ${100 - (i / (xs.length - 1)) * 100}%`));
  // rest polygon: top-right → down the right → back up the jagged edge
  const keep = ['100% 0%', '100% 100%', ...xs.map((x, i) => `${x}% ${(i / (xs.length - 1)) * 100}%`).reverse()];
  return {off: `polygon(${pts.join(',')})`, keep: `polygon(${keep.join(',')})`};
})();

const GiveUp: React.FC = () => {
  const f = useCurrentFrame() - B.giveUp;
  const g = prog(f, 0, 14);
  const onPaper = f >= 13;
  const t = interpolate(useCurrentFrame(), [T.giveUp + 8, T.giveUp + 22], [0, 1], clamp);
  const cw = interpolate(g, [0, 1], [220, CW]), ch = interpolate(g, [0, 1], [170, CH]);
  const cx = BP_W / 2 - cw / 2, cy = 825 - ch / 2;
  const col = onPaper ? COBALT_TYPE : CREAM;
  const pic = <Cover src="j16_bw.jpg" pos="50% 22%" />;
  return (
    <AbsoluteFill style={{background: onPaper ? PAPER : INK}}>
      <div style={{position: 'absolute', left: cx, top: cy, width: cw, height: ch}}>
        <div style={{position: 'absolute', inset: 0, background: WHITE}} />
        <div style={{position: 'absolute', inset: 0, clipPath: tear.keep}}>{pic}</div>
        <div style={{position: 'absolute', inset: 0, clipPath: tear.off, transform: `translate(${-90 * t}px, ${760 * t * t}px) rotate(${-16 * t}deg)`, transformOrigin: '20% 0%', opacity: interpolate(t, [0.45, 0.95], [1, 0], clamp), filter: t > 0 ? 'drop-shadow(0 18px 14px rgba(0,0,0,0.25))' : undefined}}>{pic}</div>
      </div>
      <Guides xs={g > 0.98 ? CX : [cx, cx + cw]} ys={g > 0.98 ? CY : [cy, cy + ch]} color={col} o={0.7} />
      <Setup words={['His', 'own', 'supervisor', 'told', 'him', 'to']} at={[B.giveUp + 16, B.giveUp + 21, B.giveUp + 26, B.giveUp + 40, B.giveUp + 46, B.giveUp + 52]} x={CX[0]} y={SETUP_Y} color={col} />
      <Payoff text="GIVE UP." at={T.giveUp} y={PAY_Y} size={250} color={COBALT_TYPE} />
      <Small text="Edinburgh · 1970s" at={T.giveUp + 24} x={CX[0]} y={PAY_Y + 262} color={COBALT_TYPE} />
      <Grain />
    </AbsoluteFill>
  );
};

const Waste: React.FC = () => {
  const f = useCurrentFrame() - B.waste;
  const d = interpolate(f, [2, 40], [0, 1], clamp);
  const brk = prog(useCurrentFrame(), T.wasteWord, T.wasteWord + 9);
  const N = 9;
  const off = [64, -38, 92, -70, 30, -96, 54, -44, 78];
  return (
    <AbsoluteFill style={{background: INK}}>
      <Guides xs={CX} ys={CY} color={CREAM} p={prog(f, 0, 10)} o={0.55} />
      {Array.from({length: N}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: CX[0], top: CY[0], width: CW, height: CH, clipPath: `inset(0 ${100 - ((i + 1) / N) * 100}% 0 ${(i / N) * 100}%)`, transform: `translateY(${off[i] * brk}px)`}}>
          <div style={{position: 'absolute', inset: 0, background: i % 2 && brk > 0 ? '#1b1822' : '#15121a'}} />
          <Net draw={d} stroke={CREAM} node={INK} />
        </div>
      ))}
      <Setup words={['They', 'said', 'neural', 'networks', 'were', 'a']} at={[B.waste + 6, B.waste + 12, B.waste + 20, B.waste + 28, B.waste + 42, B.waste + 50]} x={CX[0]} y={SETUP_Y} color={CREAM} />
      <Payoff text="WASTE" at={T.wasteWord} y={PAY_Y} size={250} color={CREAM} />
      <Small text="of time." at={T.ofTime} x={CX[0]} y={PAY_Y + 262} color={CREAM} />
      <Grain o={0.1} />
    </AbsoluteFill>
  );
};

const Toronto: React.FC = () => {
  const f = useCurrentFrame() - B.toronto;
  const o = interpolate(f, [2, 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#050306', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{opacity: o, textAlign: 'center', marginTop: -160, transform: `scale(${1 + 0.05 * interpolate(f, [0, 54], [0, 1], clamp)})`}}>
        <div style={{width: 700 * prog(f, 2, 16), height: 2, background: CREAM, opacity: 0.5, margin: '0 auto 34px'}} />
        <div style={{fontFamily: 'EB Garamond', fontStyle: 'italic', fontWeight: 500, fontSize: 128, color: CREAM, lineHeight: 1.08}}>
          So he moved
          <br />
          to Toronto.
        </div>
        <div style={{width: 700 * prog(f, 2, 16), height: 2, background: CREAM, opacity: 0.5, margin: '40px auto 30px'}} />
        <div style={{fontFamily: 'Space Mono', fontSize: 36, letterSpacing: '0.14em', color: CREAM, opacity: f > 18 ? 0.9 : 0}}>UNIVERSITY OF TORONTO · 1987</div>
      </div>
    </AbsoluteFill>
  );
};

const Years: React.FC = () => {
  const f = useCurrentFrame() - B.years;
  const p = interpolate(f, [6, 62], [0, 1], clamp);
  const n = 26; // 1987 … 2012
  const cur = Math.min(n - 1, Math.floor(p * n));
  const cols = 13;
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <Guides xs={CX} ys={CY} color={COBALT_TYPE} p={prog(f, 0, 10)} />
      <Cell x={CX[0]} y={CY[0]} w={CW} h={CH}>
        <div style={{position: 'absolute', left: 36, top: 34, fontFamily: 'Anton', fontSize: 220, lineHeight: 1, color: INK}}>{1987 + cur}</div>
        <div style={{position: 'absolute', left: 36, top: 300, width: 828, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, rowGap: 30}}>
          {Array.from({length: n}).map((_, i) => (
            <div key={i} style={{height: 150, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
              <div style={{width: 6, height: 104, background: i <= cur ? COBALT_TYPE : 'rgba(16,13,19,0.16)'}} />
              <div style={{fontFamily: 'Space Mono', fontSize: 21, marginTop: 8, color: i <= cur ? COBALT_TYPE : 'rgba(16,13,19,0.3)'}}>{String((87 + i) % 100).padStart(2, '0')}</div>
            </div>
          ))}
        </div>
      </Cell>
      <Setup words={['And', 'kept', 'going.', 'For']} at={[B.years + 6, B.years + 11, B.years + 17, B.years + 54]} x={CX[0]} y={SETUP_Y} color={COBALT_TYPE} />
      <Payoff text="25 MORE" at={T.years25} y={PAY_Y} size={250} color={COBALT_TYPE} />
      <Small text="years." at={T.years25 + 12} x={CX[0]} y={PAY_Y + 262} color={COBALT_TYPE} />
      <Grain />
    </AbsoluteFill>
  );
};

const Network: React.FC = () => {
  const F = useCurrentFrame();
  const f = F - B.network;
  const d = interpolate(f, [4, 60], [0, 1], clamp);
  const bars = F >= T.beat - 14;
  const b1 = prog(F, T.beat - 14, T.beat - 2), b2 = prog(F, T.beat - 6, T.beat + 6);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Guides xs={CX} ys={CY} color={CREAM} p={prog(f, 0, 10)} o={0.55} />
      <Cell x={CX[0]} y={CY[0]} w={CW} h={CH}>
        {!bars && <Net draw={d} lit={interpolate(f, [40, 66], [0, 1], clamp)} stroke={CREAM} node={INK} litColor={SOFT_BLUE} />}
        {bars && (
          <>
            <div style={{position: 'absolute', left: 40, top: 34, fontFamily: 'Space Mono', fontSize: 31, letterSpacing: '0.1em', color: CREAM, opacity: 0.9}}>IMAGENET 2012 · FEWER ERRORS WINS</div>
            <div style={{position: 'absolute', left: 120, bottom: 96, width: 250, height: 392 * b1, background: 'rgba(239,232,223,0.28)'}} />
            <div style={{position: 'absolute', left: 530, bottom: 96, width: 250, height: 229 * b2, background: SOFT_BLUE}} />
            <div style={{position: 'absolute', left: 120, bottom: 96 + 392 * b1 + 10, fontFamily: 'Anton', fontSize: 78, color: CREAM, opacity: b1 > 0.9 ? 0.7 : 0}}>26.2%</div>
            <div style={{position: 'absolute', left: 530, bottom: 96 + 229 * b2 + 10, fontFamily: 'Anton', fontSize: 78, color: SOFT_BLUE, opacity: b2 > 0.9 ? 1 : 0}}>15.3%</div>
            <div style={{position: 'absolute', left: 120, bottom: 44, fontFamily: 'Space Mono', fontSize: 30, letterSpacing: '0.14em', color: CREAM, opacity: 0.8}}>NEXT BEST</div>
            <div style={{position: 'absolute', left: 530, bottom: 44, fontFamily: 'Space Mono', fontSize: 30, letterSpacing: '0.14em', color: SOFT_BLUE}}>HIS STUDENTS</div>
          </>
        )}
      </Cell>
      <Setup words={['Then,', 'in', '2012,', 'two', 'students', 'built']} at={[4, 12, 17, 32, 40, 54].map((v) => v + B.network)} x={CX[0]} y={SETUP_Y} color={CREAM} />
      <Payoff text="ONE NETWORK." at={T.oneNetwork} y={PAY_Y} size={164} color={CREAM} />
      <Small text="It beat every rival." at={T.beat} x={CX[0]} y={PAY_Y + 190} color={SOFT_BLUE} />
      <Grain o={0.1} />
    </AbsoluteFill>
  );
};

const EveryAI: React.FC = () => {
  const F = useCurrentFrame();
  const f = F - B.everyAI;
  return (
    <AbsoluteFill style={{background: INK}}>
      <div style={{position: 'absolute', left: 430, top: 730, width: 650, height: 790, overflow: 'hidden'}}>
        <Cover src="c24_cob.jpg" pos="50% 12%" style={{transform: `scale(${1.04 + 0.04 * prog(f, 0, 90)})`}} />
      </div>
      <Guides xs={[90]} ys={[730]} color={CREAM} p={prog(f, 0, 10)} o={0.5} />
      <Setup words={['Today', 'that', 'idea', 'runs', 'nearly']} at={[4, 10, 15, 22, 30].map((v) => v + B.everyAI)} x={90} y={262} color={CREAM} />
      <Payoff text="EVERY" at={T.everyAI} x={84} y={336} size={372} color={CREAM} w={1000} />
      <Payoff text="AI" at={T.everyAI + 6} x={96} y={762} size={372} color={CREAM} w={320} outline />
      <Small text="you use." at={T.everyAI + 16} x={96} y={1166} color={CREAM} w={320} />
      <Grain o={0.12} />
    </AbsoluteFill>
  );
};

const Right: React.FC = () => {
  const F = useCurrentFrame();
  const f = F - B.right;
  const colX = [380, 700];
  const z = 1.04 + 0.04 * prog(f, 0, 66);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Cell x={CX[0]} y={CY[0]} w={CW} h={CH}>
        <Cover src="c24_bw.jpg" pos="50% 14%" style={{transform: `scale(${z})`, filter: 'brightness(0.42)'}} />
      </Cell>
      <Cell x={colX[0]} y={CY[0]} w={colX[1] - colX[0]} h={CH}>
        <div style={{position: 'absolute', left: CX[0] - colX[0], top: 0, width: CW, height: CH}}>
          <Cover src="c24_bw.jpg" pos="50% 14%" style={{transform: `scale(${z})`}} />
        </div>
      </Cell>
      <div style={{position: 'absolute', left: colX[0] - 1, top: CY[0], width: colX[1] - colX[0], height: CH, borderLeft: `2px dashed ${CREAM}`, borderRight: `2px dashed ${CREAM}`, opacity: 0.7}} />
      <Guides xs={CX} ys={CY} color={CREAM} p={prog(f, 0, 10)} o={0.6} />
      <Setup words={['40', 'years', 'later,', 'he', 'was']} at={[4, 9, 15, 30, 35].map((v) => v + B.right)} x={CX[0]} y={SETUP_Y} color={CREAM} />
      <Payoff text="RIGHT." at={T.rightWord} y={PAY_Y} size={250} color={CREAM} />
      <Grain o={0.12} />
    </AbsoluteFill>
  );
};

const Question: React.FC = () => {
  const F = useCurrentFrame();
  const f = F - B.question;
  const g = prog(f, 0, 14);
  const k = Math.floor((F - T.lasted) / 4);
  const styles: React.CSSProperties[] = [
    {fontFamily: 'Anton', fontSize: 150},
    {fontFamily: 'Space Mono', fontSize: 100},
    {fontFamily: 'Inter', fontWeight: 600, fontSize: 122},
    {fontFamily: 'EB Garamond', fontStyle: 'italic', fontWeight: 500, fontSize: 168},
  ];
  const s = styles[Math.max(0, Math.min(3, k))];
  const u = prog(F, T.lasted + 14, T.lasted + 28);
  return (
    <AbsoluteFill style={{background: COBALT}}>
      {f < 6 ? (
        <>
          <div style={{position: 'absolute', left: BP_W / 2 - 1, top: 825 - 260 * g * 3, width: 2, height: 520 * g * 3, background: CREAM, opacity: 0.6}} />
          <div style={{position: 'absolute', top: 824, left: BP_W / 2 - 300 * g * 3, height: 2, width: 600 * g * 3, background: CREAM, opacity: 0.6}} />
        </>
      ) : (
        <Guides xs={CX} ys={CY} color={CREAM} p={g} o={0.6} />
      )}
      <div style={{position: 'absolute', left: CX[0], top: 610, width: CW, textAlign: 'center', fontFamily: 'EB Garamond', fontStyle: 'italic', fontWeight: 500, fontSize: 104, color: CREAM, opacity: f >= 13 ? 1 : 0}}>How long would you</div>
      {F >= T.lasted && (
        <div style={{position: 'absolute', left: CX[0], top: 750, width: CW, height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center', color: WHITE, whiteSpace: 'nowrap', ...s}}>have lasted?</div>
      )}
      <div style={{position: 'absolute', left: 150, top: 958, width: 780 * u, height: 5, borderRadius: 3, background: WHITE}} />
      <Grain o={0.1} />
    </AbsoluteFill>
  );
};

const Early: React.FC = () => {
  const F = useCurrentFrame();
  const f = F - B.early;
  const lit = interpolate(F, [B.early + 10, T.earlyWord + 14], [0, 1.2], clamp);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <Guides xs={CX} ys={CY} color={COBALT_TYPE} p={prog(f, 0, 10)} />
      <Cell x={CX[0]} y={CY[0]} w={CW} h={CH}>
        <Net draw={1} lit={lit} stroke={INK} node={PAPER} litColor={COBALT_TYPE} />
      </Cell>
      <Setup words={['Your', 'idea', "isn't", 'dead.', "It's"]} at={[6, 12, 18, 25, 46].map((v) => v + B.early)} x={CX[0]} y={SETUP_Y} color={COBALT_TYPE} />
      <Payoff text="EARLY." at={T.earlyWord} y={PAY_Y} size={250} color={COBALT_TYPE} />
      <Grain />
    </AbsoluteFill>
  );
};

const Commands: React.FC = () => {
  const F = useCurrentFrame();
  if (F < T.post)
    return (
      <AbsoluteFill style={{background: WHITE}}>
        <Guides xs={CX} ys={CY} color={COBALT_TYPE} />
        <Cell x={CX[0]} y={CY[0]} w={CW} h={CH}>
          <Cover src="c24_poster.jpg" pos="50% 16%" />
        </Cell>
        <Payoff text="KEEP GOING." at={T.keep} y={PAY_Y} size={182} color={COBALT_TYPE} />
        <Grain o={0.1} />
      </AbsoluteFill>
    );
  if (F < T.learn)
    return (
      <AbsoluteFill style={{background: WHITE}}>
        <Guides xs={CX} ys={CY} color={COBALT_TYPE} />
        <Payoff text="POST." at={T.post} x={CX[0]} w={CW} align="center" y={660} size={310} color={COBALT_TYPE} />
        <Grain o={0.1} />
      </AbsoluteFill>
    );
  const again = F >= T.again;
  const flash = F < T.learn + 3;
  return (
    <AbsoluteFill style={{background: INK}}>
      <Cover src={flash ? 'c23_neg.jpg' : again ? 'c23_cob.jpg' : 'c23_bw.jpg'} pos="50% 0%" />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, transparent 42%, rgba(8,6,12,0.82) 66%)'}} />
      <Payoff text={again ? 'AGAIN.' : 'LEARN.'} at={T.learn} y={1210} size={270} color={WHITE} />
      <Grain o={0.1} />
    </AbsoluteFill>
  );
};

const CTA: React.FC = () => {
  const F = useCurrentFrame();
  const f = F - B.cta;
  const d = prog(f, 0, 12);
  const fade = interpolate(F, [BP_FRAMES - 10, BP_FRAMES - 1], [1, 0], clamp);
  const R = 310;
  const words: [string, number][] = [['FOLLOW', T.follow], ['FOR', T.forW], ['MORE.', T.more]];
  return (
    <AbsoluteFill style={{background: INK, opacity: fade}}>
      <Guides xs={CX} ys={CY} color={CREAM} p={prog(f, 4, 16)} o={0.55} />
      <div style={{position: 'absolute', left: BP_W / 2 - R, top: 825 - R, width: R * 2, height: R * 2, borderRadius: R, background: CREAM, transform: `scale(${0.34 + 0.66 * d}) rotate(${(1 - d) * -24}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: R * 2 - 44, height: R * 2 - 44, borderRadius: R, border: `4px solid ${COBALT_TYPE}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          {words.map(([w, at]) => (
            <div key={w} style={{fontFamily: 'Anton', fontSize: 132, lineHeight: 1.06, color: COBALT_TYPE, opacity: F >= at ? 1 : 0}}>{w}</div>
          ))}
        </div>
      </div>
      <Small text="Everyone mocked it." at={B.cta + 16} x={CX[0]} y={SETUP_Y + 14} color={CREAM} />
      <Small text="Ep. 01" at={B.cta + 16} x={CX[0]} y={SETUP_Y + 14} color={CREAM} align="right" />
      <Small text="@haha.hardikk" at={T.more + 6} x={CX[0]} y={1212} color={CREAM} align="center" />
      <div style={{position: 'absolute', left: CX[0], top: 1436, width: CW, textAlign: 'center', fontFamily: 'Space Mono', fontSize: 22, letterSpacing: '0.03em', whiteSpace: 'nowrap', color: CREAM, opacity: f > 20 ? 0.9 : 0, lineHeight: 1.6}}>
        PHOTOS: COLLISION / SPORTSFILE, S. JURVETSON · CC BY 2.0
      </div>
      <Grain o={0.1} />
    </AbsoluteFill>
  );
};

// ---------- sound: one effect per arrival, its peak on the frame
const SFX: [number, string, number][] = [
  [0, 'digital-scan-subtle', 0.5], [12, 'mechanical-shutter-light', 0.5], [T.dead, 'impact-medium-soft', 0.8], [T.end, 'impact-heavy-firm', 0.85],
  [B.nobel + 4, 'whoosh-fast-soft', 0.5], [B.nobel + 9, 'pop-large-in', 0.6], [B.nobel + 40, 'shimmer-short-soft', 0.5], [T.nobelWord, 'impact-heavy-firm', 0.85],
  [B.name + 15, 'move-zoom-out', 0.45], [T.geoffrey, 'impact-medium-soft', 0.75], [T.hinton, 'impact-heavy-firm', 0.8],
  [B.giveUp + 6, 'whoosh-fast-soft', 0.45], [T.giveUp, 'impact-heavy-firm', 0.85], [T.giveUp + 9, 'foley-paper-slide', 0.8],
  [B.waste + 2, 'writing-pencil-draw', 0.5], [T.wasteWord, 'impact-heavy-firm', 0.85], [T.wasteWord + 1, 'swipe-slow-firm', 0.55],
  [B.toronto + 2, 'whoosh-slow-soft', 0.35],
  [B.years + 6, 'keyboard-typing-steady-medium', 0.4], [T.years25, 'impact-heavy-firm', 0.85],
  [B.network + 4, 'writing-pencil-draw', 0.45], [T.oneNetwork, 'impact-heavy-firm', 0.85], [T.beat - 8, 'tone-step-1', 0.45], [T.beat, 'tone-step-4', 0.5],
  [B.everyAI, 'whoosh-medium-medium', 0.45], [T.everyAI, 'boom-hit-soft', 0.9], [T.everyAI + 6, 'impact-medium-soft', 0.7],
  [B.right, 'reverse-whoosh-short-soft', 0.4], [T.rightWord, 'boom-hit-soft', 0.9],
  [B.question + 2, 'writing-pen-tick', 0.5], [T.lasted, 'keyboard-typing-quick-short', 0.45], [T.lasted + 14, 'writing-pencil-tick', 0.55],
  [B.early + 10, 'digital-process-subtle', 0.4], [T.earlyWord, 'impact-heavy-firm', 0.85],
  [T.keep, 'impact-heavy-firm', 0.85], [T.post, 'impact-medium-soft', 0.8], [T.learn, 'mechanical-shutter-light', 0.6], [T.learn, 'impact-medium-soft', 0.7], [T.again, 'impact-heavy-firm', 0.85],
  [B.cta + 2, 'whoosh-fast-medium', 0.45], [T.follow, 'pop-large-in', 0.6], [T.forW, 'pop-large-in', 0.6], [T.more, 'pop-large-bubble', 0.65], [T.more + 2, 'sting-warm-short', 0.5],
];

export const BlueprintHinton: React.FC<{sound?: boolean}> = ({sound = true}) => {
  const seq: [number, number, React.FC][] = [
    [B.hook, B.nobel, Hook], [B.nobel, B.name, Nobel], [B.name, B.giveUp, Name], [B.giveUp, B.waste, GiveUp], [B.waste, B.toronto, Waste],
    [B.toronto, B.years, Toronto], [B.years, B.network, Years], [B.network, B.everyAI, Network], [B.everyAI, B.silence, EveryAI],
    [B.right, B.question, Right], [B.question, B.early, Question], [B.early, B.commands, Early], [B.commands, B.cta, Commands], [B.cta, BP_FRAMES, CTA],
  ];
  const f = useCurrentFrame();
  const Cur = seq.find(([a, b]) => f >= a && f < b)?.[2];
  return (
    <AbsoluteFill style={{background: '#050306'}}>
      {Cur ? <Cur /> : null}
      {sound &&
        SFX.map(([at, name, vol], i) => {
          const k = KIT[name];
          const from = Math.max(0, at - Math.round(k.sync * BP_FPS));
          return (
            <Sequence key={i} from={from} durationInFrames={Math.ceil(k.dur * BP_FPS) + 2}>
              <Audio src={staticFile(`sfx/kit/${k.file}`)} volume={vol} />
            </Sequence>
          );
        })}
    </AbsoluteFill>
  );
};
