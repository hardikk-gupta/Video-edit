import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import faceRaw from './wa1832-face.json';

// "Claude did" v3 (2026-10-26): a mix of formats from the skills, per the user's v2 notes.
// - split-screen: the speaker always in the bottom panel, graphics in the top panel
// - caption-edit: full-face lines with word-pop captions and zoom cuts
// - whiteout: two full white hits ("Claude did.", the end card)
// - paper-drawer: paper cards slide up inside the top panel
// - omni-restyle: the speaker as a pencil sketch (public/wa1832/talk_sketch.mp4, made locally) in the doodle beat
// Look: white, ink, one cool blue. No cream, no orange, no serif (the user: v2 read as Claude's own look).
// Sound is mixed afterwards from projects/2026-10-26-claude-did/sfx.json (sfx-design).

export const SM_W = 1080;
export const SM_H = 1920;
const FPS = 30;
const SPEECH = 453;
const END = 48;
export const SM_FRAMES = SPEECH + END;

const C = {white: '#FFFFFF', ink: '#111114', blue: '#2E5BFF', grey: '#6B6B76', paper: '#F4F4F1', line: '#DCDCE2'};
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
const ease = (fr: number, a: number, d: number) => interpolate(fr, [a, a + d], [0, 1], {...clamp, easing: OUT});
const snap = (fr: number, a: number, d: number) => Math.min(1, ease(fr, a, d) * 1.08);
const pop = (fr: number, a: number) => interpolate(fr, [a, a + 4, a + 6], [0.6, 1.06, 1], clamp);

// ---------- Cuts and face ----------
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
type Mode = 'face' | 'split' | 'white';
const BEATS: [number, number, Mode][] = [
  [0, f(1.1), 'face'],
  [f(1.1), f(2.56), 'split'],
  [f(2.56), 90, 'white'],
  [90, f(4.04), 'face'],
  [f(4.04), 212, 'split'],
  [212, 352, 'split'],
  [352, f(13.5), 'face'],
  [f(13.5), SPEECH, 'split'],
  [SPEECH, SM_FRAMES, 'white'],
];
const beatAt = (fr: number) => BEATS.find(([a, b]) => fr >= a && fr < b) ?? BEATS[BEATS.length - 1];

const SEAM = 920; // top panel 0–920, speaker panel 920–1920 (holds his whole head, measured: span ≤ 1000)

// Zoom cuts on the full-face lines: the scale steps on a spoken word, inside one take.
const ZOOM_CUTS: [number, number][] = [[f(0.56), 1.16], [f(3.76), 1.18], [f(12.82), 1.16]];
const zoomAt = (fr: number, from: number) => ZOOM_CUTS.filter(([z]) => z >= from && z <= fr).reduce((a, [, s]) => s, 1);

const FaceFull: React.FC<{fr: number; from: number}> = ({fr, from}) => {
  const [cx, cy] = faceAt(fr);
  const S = 1.08 * zoomAt(fr, from) * (1 + 0.012 * ((fr - from) / FPS)); // zoom cut + slow 1.2%/s drift
  const tx = Math.min(0, Math.max(SM_W - S * SM_W, SM_W / 2 - S * cx));
  const ty = Math.min(0, Math.max(SM_H - S * SM_H, 1080 - S * cy));
  return <OffthreadVideo muted src={staticFile('wa1832/talk.mp4')} style={{position: 'absolute', left: 0, top: 0, width: SM_W, height: SM_H, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${S})`}} />;
};

const SpeakerPanel: React.FC<{fr: number; from: number; sketch?: boolean}> = ({fr, from, sketch}) => {
  const [cx, cy, h] = faceAt(fr);
  const span = 1.38 * h;
  const S = Math.max(1, Math.min(1.04, 1 + 0.01 * ((fr - from) / FPS), 960 / span));
  const headTop = cy - 0.78 * h;
  const top = Math.min(SEAM, Math.max(SM_H - S * SM_H, SEAM + 34 - S * headTop)); // hair 34px under the seam
  const tx = Math.min(0, Math.max(SM_W - S * SM_W, SM_W / 2 - S * cx));
  return (
    <div style={{position: 'absolute', left: 0, top: SEAM, width: SM_W, height: SM_H - SEAM, overflow: 'hidden', background: '#000'}}>
      <OffthreadVideo muted src={staticFile(sketch ? 'wa1832/talk_sketch.mp4' : 'wa1832/talk.mp4')} style={{position: 'absolute', left: 0, top: top - SEAM, width: SM_W, height: SM_H, transformOrigin: '0 0', transform: `translate(${tx}px, 0) scale(${S})`}} />
    </div>
  );
};

// ---------- Doodle kit (our own drawings) ----------
// Line boil: the stroke wobbles to a new seed every 3 frames, like a hand-drawn loop.
const Boil: React.FC<{id: string}> = ({id}) => {
  const fr = useCurrentFrame();
  return (
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={Math.floor(fr / 3) % 5} />
      <feDisplacementMap in="SourceGraphic" scale="5" />
    </filter>
  );
};
const S_INK = {stroke: C.ink, strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none'};

const Pet: React.FC<{laptop?: boolean; wave?: boolean; at: number; question?: number[]; panic?: number; id: string}> = ({laptop, wave, at, question = [], panic, id}) => {
  const fr = useCurrentFrame();
  const lt = fr - at;
  const type = laptop ? Math.floor(lt / 3) % 2 : 0;
  const blink = lt % 75 > 71;
  const waveA = wave ? Math.sin(lt / 3) * 18 : 0;
  const lines = laptop ? Math.min(6, Math.floor(lt / 7)) : 0;
  const scribble = panic !== undefined ? ease(fr, panic, 14) : 0;
  return (
    <svg viewBox="0 0 520 400" width="100%" height="100%" style={{overflow: 'visible'}}>
      <Boil id={id} />
      <g filter={`url(#${id})`}>
        <path d="M20 364 L500 364" {...S_INK} strokeWidth={6} />
        {/* body */}
        <path d="M150 168 C 214 166 236 222 232 278 C 230 332 200 362 150 362 C 100 362 70 332 68 278 C 66 222 88 170 150 168 Z" {...S_INK} fill={C.white} />
        <path d="M104 186 L96 134 L134 172" {...S_INK} fill={C.white} />
        <path d="M196 184 L210 132 L172 170" {...S_INK} fill={C.white} />
        <path d="M70 330 C 28 334 26 290 52 284" {...S_INK} />
        {/* face: looks at the screen when typing, at us otherwise */}
        {blink ? (
          <>
            <path d={laptop ? 'M158 240 L174 240' : 'M118 240 L134 240'} {...S_INK} strokeWidth={6} />
            <path d={laptop ? 'M196 240 L212 240' : 'M164 240 L180 240'} {...S_INK} strokeWidth={6} />
          </>
        ) : (
          <>
            <circle cx={laptop ? 166 : 126} cy={240} r={10} fill={C.ink} />
            <circle cx={laptop ? 204 : 172} cy={240} r={10} fill={C.ink} />
          </>
        )}
        <path d={laptop ? 'M178 268 Q186 276 194 268' : 'M138 268 Q149 280 160 268'} {...S_INK} strokeWidth={6} />
        {/* paws */}
        {laptop ? (
          <>
            <path d={`M214 296 L262 ${328 - type * 10}`} {...S_INK} />
            <path d={`M206 312 L292 ${330 - (1 - type) * 10}`} {...S_INK} />
          </>
        ) : wave ? (
          <path d={`M214 286 L262 ${226 + waveA} l 10 -22`} {...S_INK} />
        ) : null}
        {laptop ? (
          <>
            <path d="M246 362 L494 362 L472 332 L268 332 Z" {...S_INK} fill={C.white} />
            <path d="M276 330 L300 162 L486 162 L466 330 Z" {...S_INK} fill={C.white} />
            {Array.from({length: lines}).map((_, i) => (
              <path key={i} d={`M${318 - i * 2} ${196 + i * 22} l ${[90, 120, 60, 110, 80, 100][i]} 0`} stroke={C.blue} strokeWidth={8} strokeLinecap="round" fill="none" opacity={1 - scribble} />
            ))}
            {scribble > 0 ? (
              <path d="M312 200 C 420 180 330 260 440 240 C 300 270 470 300 330 300 C 400 210 460 280 320 230 C 450 200 380 310 440 300" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - scribble} />
            ) : null}
          </>
        ) : null}
        {panic !== undefined && fr >= panic ? <path d="M92 196 C 82 214 88 226 98 226 C 108 226 112 214 92 196 Z" {...S_INK} strokeWidth={5} fill={C.white} transform={`translate(0 ${Math.min(30, (fr - panic) * 1.5)})`} /> : null}
      </g>
      {question.map((q, i) =>
        fr >= q ? (
          <text key={i} x={[96, 214][i % 2]} y={[110, 84][i % 2]} fontFamily={SANS} fontWeight={800} fontSize={86} fill={i ? C.blue : C.ink} style={{transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${pop(fr, q)}) rotate(${i ? 12 : -10}deg)`}}>?</text>
        ) : null,
      )}
    </svg>
  );
};

const Folder: React.FC<{locked: number; id: string; w: number}> = ({locked, id, w}) => {
  const fr = useCurrentFrame();
  return (
    <svg viewBox="-10 -40 200 190" width={w} height={(w * 190) / 200} style={{overflow: 'visible'}}>
      <Boil id={id} />
      <g filter={`url(#${id})`}>
        <path d="M0 20 a10 10 0 0 1 10 -10 h50 l14 16 h96 a10 10 0 0 1 10 10 v84 a10 10 0 0 1 -10 10 H10 a10 10 0 0 1 -10 -10 Z" {...S_INK} fill={C.white} />
        <path d="M0 44 H180" {...S_INK} strokeWidth={5} />
      </g>
      {fr >= locked ? (
        <g style={{transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${pop(fr, locked)})`}}>
          <path d="M70 70 V56 a20 20 0 0 1 40 0 V70" {...S_INK} strokeWidth={9} />
          <rect x={56} y={68} width={68} height={54} rx={10} fill={C.blue} stroke={C.ink} strokeWidth={6} />
          <circle cx={90} cy={92} r={7} fill={C.white} />
        </g>
      ) : null}
    </svg>
  );
};

// ---------- Type ----------
const T: React.FC<{size: number; w?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode}> = ({size, w = 700, color = C.ink, style, children}) => (
  <div style={{fontFamily: SANS, fontWeight: w, fontSize: size, lineHeight: 1.06, letterSpacing: -0.03 * size, color, ...style}}>{children}</div>
);
const Underline: React.FC<{at: number; width: number}> = ({at, width}) => {
  const fr = useCurrentFrame();
  const p = ease(fr, at, 8);
  return (
    <svg width={width} height={30} style={{display: 'block', margin: '6px auto 0'}}>
      <path d={`M6 18 C ${width * 0.3} 6, ${width * 0.6} 26, ${width - 6} 12`} stroke={C.blue} strokeWidth={11} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

// ---------- Top panels ----------
const TopCounter: React.FC<{from: number}> = ({from}) => {
  const fr = useCurrentFrame();
  const reveal = f(1.3);
  const push = 1 + 0.12 * ease(fr, reveal, 30); // push-in on the number
  const play = ease(fr, from, 40);
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 236, textAlign: 'center'}}>
        <T size={76} w={600} color={C.grey}>Seconds I edited</T>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 296, height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {fr >= reveal ? <T size={390} w={800} style={{transform: `scale(${pop(fr, reveal) * push})`}}>0</T> : null}
      </div>
      <svg width={880} height={110} style={{position: 'absolute', left: 100, top: 704, overflow: 'visible'}}>
        <Boil id="tl" />
        <g filter="url(#tl)">
          <rect x={4} y={20} width={872} height={70} rx={12} {...S_INK} strokeWidth={6} />
          {[[20, 150], [182, 120], [314, 210], [536, 130], [678, 180]].map(([x, w], i) => (
            <rect key={i} x={x} y={34} width={w} height={42} rx={8} fill={C.line} stroke={C.ink} strokeWidth={4} />
          ))}
          <path d={`M${10 + play * 860} 6 V 104`} stroke={C.blue} strokeWidth={8} strokeLinecap="round" />
        </g>
      </svg>
    </>
  );
};

const torn = (seed: number) => {
  let s = seed;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const top: string[] = [];
  for (let x = 1080; x >= 0; x -= 18) top.push(`${(x / 1080) * 100}% ${(4 + rnd() * 12).toFixed(1)}px`);
  return `polygon(0% 100%,100% 100%,${top.join(',')})`;
};
// paper-drawer inside the top panel: slides up from the seam, leaves on the cut
const Drawer: React.FC<{from: number; seed: number; children: React.ReactNode}> = ({from, seed, children}) => {
  const fr = useCurrentFrame();
  const y = interpolate(snap(fr, from, 10), [0, 1], [SEAM, 0]);
  return (
    <div style={{position: 'absolute', left: 0, top: 200, width: SM_W, height: SEAM - 200, transform: `translateY(${y}px)`, filter: 'drop-shadow(0 -10px 24px rgba(0,0,0,0.18))'}}>
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

const TopPet: React.FC<{from: number}> = ({from}) => (
  <Drawer from={from} seed={7}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 54, textAlign: 'center'}}>
      <T size={70}>How does it actually work?</T>
    </div>
    <div style={{position: 'absolute', left: 190, top: 118, width: 700, height: 538}}>
      <Pet id="pet1" laptop at={from} question={[f(5.3), f(5.72)]} panic={f(6.6)} />
    </div>
  </Drawer>
);

const FOLDERS = ['my-setup', 'reels-v7', 'final-v9', 'workflow', 'pipeline', 'the-sauce'];
const TopRepos: React.FC<{from: number}> = ({from}) => {
  const fr = useCurrentFrame();
  const swap = f(9.28);
  const zoomAt = f(10.48);
  const z = 1 + 0.6 * ease(fr, zoomAt, 18) + 0.02 * Math.max(0, (fr - zoomAt - 18) / FPS);
  // push into one locked folder (top middle) until it fills the panel
  const ox = 540;
  const oy = 300 + 96;
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 236, textAlign: 'center'}}>
        {fr < swap ? (
          <T size={66}>Everyone has their own repo.</T>
        ) : (
          <T size={66} style={{transform: `scale(${pop(fr, swap)})`}}>
            And their own <span style={{color: C.blue}}>secret</span> methods.
          </T>
        )}
      </div>
      <div style={{position: 'absolute', left: 0, top: 300, width: SM_W, height: 500, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, transformOrigin: `${ox}px ${oy - 300}px`, transform: `scale(${z})`}}>
          {FOLDERS.map((name, i) => {
            const at = f(7.58) + i * 7;
            if (fr < at) return null;
            const cx = [220, 540, 860][i % 3];
            const top = i < 3 ? 12 : 240;
            return (
              <div key={name} style={{position: 'absolute', left: cx - 130, top, width: 260, textAlign: 'center', transform: `scale(${pop(fr, at)})`}}>
                <Folder id={`fo${i}`} w={190} locked={f(10.14) + i * 3} />
                <div style={{fontFamily: MONO, fontSize: 34, color: C.ink, marginTop: -10}}>{name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const STEPS = ['Watch the footage', 'Cut, design, caption', 'A second AI reviews'];
const TopSteps: React.FC<{from: number}> = ({from}) => {
  const fr = useCurrentFrame();
  return (
    <Drawer from={from} seed={13}>
      <div style={{position: 'absolute', left: 80, top: 60}}>
        <T size={84}>How to do this</T>
        <div style={{marginTop: 34}}>
          {STEPS.map((s, i) => {
            const at = f(13.75) + i * 8;
            return (
              <div key={s} style={{display: 'flex', alignItems: 'baseline', gap: 26, height: 104, opacity: fr >= at ? 1 : 0, transform: `scale(${pop(fr, at)})`, transformOrigin: '0% 50%'}}>
                <T size={64} w={800} color={C.blue} style={{width: 40}}>{i + 1}</T>
                <T size={58} w={600}>{s}</T>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{position: 'absolute', left: 740, top: 300, width: 330, height: 254}}>
        <Pet id="pet2" wave at={from} />
      </div>
    </Drawer>
  );
};

// ---------- Seam keyword captions (split beats) ----------
const SEAM_WORDS: [number, string][] = [
  [1.1, 'single second'], [4.04, 'how'], [5.3, 'actually works'], [6.6, 'easier'],
  [7.58, 'everyone'], [8.44, 'own repo'], [10.14, 'secret'], [13.5, 'how to do this'],
];
const SeamWord: React.FC<{fr: number; a: number; b: number}> = ({fr, a, b}) => {
  let w: [number, string] | null = null;
  for (const s of SEAM_WORDS) if (f(s[0]) <= fr && f(s[0]) >= a && f(s[0]) < b) w = s;
  if (!w) return null;
  const at = f(w[0]);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: SEAM - 104, display: 'flex', justifyContent: 'center'}}>
      <div style={{transform: `scale(${pop(fr, at)})`, background: C.ink, color: C.white, fontFamily: SANS, fontWeight: 700, fontSize: 50, letterSpacing: -1, padding: '10px 30px 14px', borderRadius: 16}}>{w[1]}</div>
    </div>
  );
};

// ---------- Face captions (caption-edit: word pop) ----------
const CAPS: [number, string, boolean?][] = [
  [0.0, "I didn't"], [0.56, 'edit', true],
  [3.3, 'No one'], [3.76, 'is telling', true],
  [11.86, 'So'], [12.36, 'I will'], [12.82, 'tell you', true],
];
const FaceCaption: React.FC<{fr: number}> = ({fr}) => {
  let c: (typeof CAPS)[number] | null = null;
  for (const x of CAPS) if (f(x[0]) <= fr) c = x;
  if (!c || cutOf(f(c[0])) !== cutOf(fr)) return null;
  const at = f(c[0]);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center'}}>
      <div style={{transform: `scale(${pop(fr, at)})`, fontFamily: SANS, fontWeight: 800, fontSize: 104, letterSpacing: -3, color: C.white, background: c[2] ? C.blue : 'transparent', padding: '6px 30px 14px', borderRadius: 20, textShadow: c[2] ? 'none' : '0 4px 24px rgba(0,0,0,0.65), 0 0 4px rgba(0,0,0,0.6)'}}>{c[1]}</div>
    </div>
  );
};

// ---------- Whiteout hits ----------
const ClaudeDid: React.FC<{from: number}> = ({from}) => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.white, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{transform: `scale(${pop(fr, from) * (1 + 0.04 * ((fr - from) / 13))})`, textAlign: 'center'}}>
        <T size={164} w={800}>Claude did.</T>
        <Underline at={from + 3} width={880} />
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.white}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', transform: `scale(${pop(fr, SPEECH)})`}}>
        <T size={150} w={800}>Follow along.</T>
        <Underline at={SPEECH + 5} width={620} />
      </div>
      <div style={{position: 'absolute', left: 250, top: 830, width: 580, height: 446}}>
        <Pet id="pet3" wave at={SPEECH} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center', opacity: ease(fr, SPEECH + 10, 8)}}>
        <T size={54} w={600} color={C.grey}>This one was edited by Claude.</T>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Main ----------
export const SplitMixWA: React.FC = () => {
  const fr = useCurrentFrame();
  const [a, b, mode] = beatAt(fr);
  const vf = Math.min(fr, SPEECH - 1);
  return (
    <AbsoluteFill style={{background: C.white}}>
      {mode === 'face' ? (
        <>
          <FaceFull fr={vf} from={a} />
          <FaceCaption fr={fr} />
        </>
      ) : null}
      {mode === 'split' ? (
        <>
          <SpeakerPanel fr={vf} from={a} sketch={a === f(4.04)} />
          <div style={{position: 'absolute', left: 0, top: 0, width: SM_W, height: SEAM, background: C.white, overflow: 'hidden'}}>
            {a === f(1.1) ? <TopCounter from={a} /> : null}
            {a === f(4.04) ? <TopPet from={a} /> : null}
            {a === 212 ? <TopRepos from={a} /> : null}
            {a === f(13.5) ? <TopSteps from={a} /> : null}
          </div>
          <SeamWord fr={fr} a={a} b={b} />
        </>
      ) : null}
      {mode === 'white' && a === f(2.56) ? <ClaudeDid from={a} /> : null}
      {mode === 'white' && a === SPEECH ? <EndCard /> : null}
      <Audio src={staticFile('wa1832/voice.wav')} />
    </AbsoluteFill>
  );
};
