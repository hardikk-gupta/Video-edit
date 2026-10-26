import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import faceRaw from './wa1832-face.json';

// "Claude did" teaser (2026-10-26). Format: paper-drawer-edit, theme: Paper Craft (reel-edit/themes.md).
// Footage: public/wa1832/talk.mp4 + voice.wav, the cut from projects/2026-10-26-claude-did/cuts.json.
// Paper cards slide up over the lower half and the footage rides up with them so the face stays above.
// Cards leave on cuts; full-page moments wipe in. Captions (word pop, Classic with box) only while the
// face is alone on screen; cards carry the line otherwise.

export const PD_W = 1080;
export const PD_H = 1920;
const FPS = 30;
const SPEECH = 453; // frames in talk.mp4
const END = 48; // end card
export const PD_FRAMES = SPEECH + END;

// ---------- Theme: Paper Craft ----------
const C = {bg: '#F4EEE1', ink: '#1F1B16', accent: '#D9653B', soft: '#5E5547', line: '#D9CFBD', card: '#FBF8F1'};
const SERIF = 'Fraunces';
const SANS = 'Inter';
const MONO = 'Space Mono';

const fontsHandle = delayRender('fonts');
Promise.all(
  [
    [SERIF, 'Fraunces-var-latin.woff2', '100 900'],
    [SANS, 'Inter-SemiBold.otf', '600'],
    [SANS, 'Inter-Bold.otf', '700'],
    [MONO, 'SpaceMono-400.woff2', '400'],
  ].map(([family, file, weight]) => new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, {weight}).load().then((ff) => document.fonts.add(ff))),
).then(() => continueRender(fontsHandle));

const f = (s: number) => Math.round(s * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const ease = (fr: number, a: number, d: number, e = OUT) => interpolate(fr, [a, a + d], [0, 1], {...clamp, easing: e});
// wipes and slides: finish cleanly instead of crawling the last few pixels
const snap = (fr: number, a: number, d: number) => Math.min(1, ease(fr, a, d) * 1.08);
// mg-kit pop-in: 6 frames, slight overshoot
const pop = (fr: number, a: number) => interpolate(fr, [a, a + 4, a + 6], [0.6, 1.06, 1], clamp);

// ---------- Cuts (seconds of each kept piece, in order) ----------
const CUT_LEN = [3.0, 3.18, 0.89, 4.66, 0.6, 2.76];
const CUT_START = CUT_LEN.reduce<number[]>((a, d, i) => [...a, i ? a[i - 1] + f(CUT_LEN[i - 1]) : 0], []);
const cutOf = (fr: number) => CUT_START.filter((s) => s <= fr).length - 1;

// Face centre per frame, smoothed inside each cut only (never across a cut).
const face = faceRaw as number[][];
const centre = face.map(([x, y, w, h]) => [x + w / 2, y + h / 2, h]);
const smooth = centre.map((_, i) => {
  const c = cutOf(i);
  const lo = Math.max(CUT_START[c], i - 12);
  const hi = Math.min((CUT_START[c + 1] ?? SPEECH) - 1, i + 12);
  const s = centre.slice(lo, hi + 1);
  return [0, 1, 2].map((k) => s.reduce((a, v) => a + v[k], 0) / s.length);
});

// ---------- Beats (frames on the edited timeline) ----------
const CARD_TOP = 960; // drawers cover the lower half
type Drawer = {from: number; to: number};
const DRAWERS: Drawer[] = [
  {from: f(1.1), to: CUT_START[1]}, // "single second … Claude did."
  {from: f(4.04), to: CUT_START[3]}, // "how this actually works in an easier way"
  {from: f(13.5), to: SPEECH}, // "how to do this"
];
const PAGE = {from: CUT_START[3], to: CUT_START[4]}; // "everyone has their own repo … secret methods"

const drawerAt = (fr: number) => DRAWERS.find((d) => fr >= d.from && fr < d.to);

// Video transform: face mode keeps the face steady (light 3% push-in per face stretch);
// drawer mode rides up with the card so the face sits in the top half.
const framing = (fr: number) => {
  const [cx, cy] = smooth[Math.min(fr, SPEECH - 1)];
  const d = drawerAt(fr);
  const faceStart = Math.max(...[0, CUT_START[1], CUT_START[4]].filter((s) => s <= fr));
  const S0 = 1.08 + 0.03 * Math.min(1, (fr - faceStart) / f(3));
  const tx0 = Math.min(0, Math.max(PD_W - S0 * PD_W, PD_W / 2 - S0 * cx));
  const ty0 = Math.min(0, Math.max(PD_H - S0 * PD_H, 1060 - S0 * cy));
  if (!d) return {S: S0, tx: tx0, ty: ty0};
  const p = ease(fr, d.from, 10);
  // Keep the whole head above the card: hair 30px below the top, chin 20px above the card;
  // if both can't fit (leaning in), split the difference.
  const h = smooth[Math.min(fr, SPEECH - 1)][2];
  const tyHead = 30 - (cy - 0.78 * h);
  const tyChin = CARD_TOP - 20 - (cy + 0.6 * h);
  const want = tyHead <= tyChin ? Math.min(tyChin, Math.max(tyHead, 540 - cy)) : (tyHead + tyChin) / 2;
  const ty1 = Math.min(0, Math.max(CARD_TOP + 60 - PD_H, want));
  return {S: interpolate(p, [0, 1], [S0, 1]), tx: interpolate(p, [0, 1], [tx0, 0]), ty: interpolate(p, [0, 1], [ty0, ty1])};
};

// ---------- Paper ----------
// Deterministic torn top edge.
const torn = (seed: number) => {
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const pts = ['0% 100%', '100% 100%'];
  const top: string[] = [];
  for (let x = 1080; x >= 0; x -= 18) top.push(`${(x / 1080) * 100}% ${(4 + rnd() * 12).toFixed(1)}px`);
  return `polygon(${[...pts, ...top].join(',')})`;
};

const Grain: React.FC<{id: string; opacity?: number}> = ({id, opacity = 0.35}) => (
  <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity}}>
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="3" />
      <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0.55 0" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#${id})`} />
  </svg>
);

const Drawer: React.FC<{from: number; seed: number; children: React.ReactNode}> = ({from, seed, children}) => {
  const fr = useCurrentFrame();
  const p = snap(fr, from, 10); // mg-kit slide-up
  const y = interpolate(p, [0, 1], [PD_H - CARD_TOP + 60, 0]);
  return (
    <div style={{position: 'absolute', left: 0, top: CARD_TOP - 16, width: PD_W, height: PD_H - CARD_TOP + 16, transform: `translateY(${y}px)`, filter: 'drop-shadow(0 -14px 28px rgba(0,0,0,0.45))'}}>
      <div style={{position: 'absolute', inset: 0, background: C.bg, clipPath: torn(seed)}}>
        <Grain id={`g${seed}`} />
        <div style={{position: 'absolute', left: 84, right: 84, top: 96}}>{children}</div>
      </div>
    </div>
  );
};

const Heading: React.FC<{children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({children, size = 84, style}) => (
  <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1.06, letterSpacing: -0.5, color: C.ink, fontVariationSettings: '"opsz" 144, "SOFT" 50', ...style}}>{children}</div>
);

// mg-kit highlight: line drawn left to right in 8 frames
const Underline: React.FC<{at: number; width: number; top?: number}> = ({at, width, top = -8}) => {
  const fr = useCurrentFrame();
  const p = ease(fr, at, 8);
  return (
    <svg width={width} height={26} style={{display: 'block', marginTop: top}}>
      <path d={`M4 16 C ${width * 0.3} 6, ${width * 0.6} 22, ${width - 4} 10`} stroke={C.accent} strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

// ---------- Cards ----------
const CardSeconds: React.FC = () => {
  const fr = useCurrentFrame();
  const z = f(1.3); // "second"
  return (
    <>
      <Heading size={100}>Seconds of this video<br />I edited:</Heading>
      <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 470, lineHeight: 0.9, color: C.accent, marginTop: 30, opacity: fr >= z ? 1 : 0, transform: `scale(${pop(fr, z)})`, transformOrigin: '0% 70%', fontVariationSettings: '"opsz" 144'}}>0</div>
    </>
  );
};

const CardClaude: React.FC = () => {
  const at = f(2.56);
  return (
    <>
      <Heading size={210} style={{letterSpacing: -3, marginTop: 20}}>Claude did.</Heading>
      <Underline at={at + 6} width={640} />
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 58, color: C.soft, marginTop: 44}}>Every cut, caption and card.</div>
    </>
  );
};

const CardHow: React.FC = () => {
  const fr = useCurrentFrame();
  const z = f(6.6); // "easier"
  return (
    <>
      <Heading size={124}>How this<br />actually works…</Heading>
      <Underline at={f(5.3)} width={720} top={4} />
      <div style={{marginTop: 64, opacity: fr >= z ? 1 : 0, transform: `scale(${pop(fr, z)})`, transformOrigin: '0% 50%', fontFamily: SANS, fontWeight: 600, fontSize: 66, lineHeight: 1.2, color: C.ink}}>
        …nobody explains it <span style={{color: C.accent}}>simply.</span>
      </div>
    </>
  );
};

const STEPS = ['Claude watches the footage', 'Cuts, cards, captions', 'A second AI reviews it'];
const CardList: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      <Heading size={100}>How to do this</Heading>
      <div style={{marginTop: 34}}>
        {STEPS.map((step, i) => {
          const at = f(13.75) + i * 8;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'baseline', gap: 30, height: 100, opacity: fr >= at ? 1 : 0, transform: `scale(${pop(fr, at)})`, transformOrigin: '0% 50%'}}>
              <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 76, color: C.accent, width: 50}}>{i + 1}</div>
              <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 56, color: C.ink, letterSpacing: -0.5}}>{step}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

// ---------- Full page: everyone's own repo, everyone's secret methods ----------
const REPOS = [
  {name: 'my-reel-setup', rot: -2, x: 96, y: 640, at: 7.58},
  {name: 'edit-pipeline-v7', rot: 1.5, x: 96, y: 910, at: 8.2},
  {name: 'claude-workflow', rot: -1, x: 96, y: 1180, at: 8.68},
];

const RepoCard: React.FC<{r: (typeof REPOS)[number]; i: number}> = ({r, i}) => {
  const fr = useCurrentFrame();
  const at = f(r.at);
  if (fr < at) return null;
  const s = pop(fr, at);
  const redact = f(10.14) + i * 4; // "secret"
  return (
    <div style={{position: 'absolute', left: r.x, top: r.y, width: 680, height: 240, transform: `rotate(${r.rot}deg) scale(${s})`, background: C.card, borderRadius: 18, border: `2px solid ${C.line}`, boxShadow: '0 18px 40px rgba(60,40,20,0.18)', padding: '34px 44px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
        <svg width={46} height={38} viewBox="0 0 46 38"><path d="M2 6 a4 4 0 0 1 4-4 h12 l5 6 h17 a4 4 0 0 1 4 4 v20 a4 4 0 0 1-4 4 H6 a4 4 0 0 1-4-4z" fill="none" stroke={C.ink} strokeWidth={3} /></svg>
        <div style={{fontFamily: MONO, fontSize: 40, color: C.ink}}>{r.name}</div>
      </div>
      {[520, 400].map((w, k) => {
        const p = ease(fr, redact + k * 3, 8);
        return (
          <div key={k} style={{position: 'relative', marginTop: k ? 24 : 36, height: 22, width: w}}>
            <div style={{position: 'absolute', inset: 0, background: C.line, borderRadius: 11}} />
            <div style={{position: 'absolute', left: -6, top: -9, height: 40, width: (w + 12) * p, background: C.ink, borderRadius: 4}} />
          </div>
        );
      })}
    </div>
  );
};

const Lock: React.FC<{at: number}> = ({at}) => {
  const fr = useCurrentFrame();
  if (fr < at) return null;
  return (
    <svg width={150} height={170} viewBox="0 0 150 170" style={{position: 'absolute', left: 830, top: 1220, transform: `rotate(8deg) scale(${pop(fr, at)})`, filter: 'drop-shadow(0 10px 18px rgba(60,40,20,0.25))'}}>
      <path d="M38 72 V50 a37 37 0 0 1 74 0 V72" fill="none" stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
      <rect x={14} y={70} width={122} height={92} rx={18} fill={C.accent} />
      <circle cx={75} cy={108} r={11} fill={C.bg} />
      <rect x={70} y={112} width={10} height={26} rx={4} fill={C.bg} />
    </svg>
  );
};

const RepoPage: React.FC = () => {
  const fr = useCurrentFrame();
  const swap = f(9.28); // second "everyone"
  const wipe = snap(fr, PAGE.from, 8); // mg-kit wipe
  return (
    <AbsoluteFill style={{background: C.bg, clipPath: `inset(${(1 - wipe) * 100}% 0 0 0)`}}>
      <Grain id="gpage" />
      <div style={{position: 'absolute', left: 96, right: 96, top: 290}}>
        {fr < swap ? (
          <Heading size={104}>Everyone has<br />their own repo.</Heading>
        ) : (
          <div style={{transform: `scale(${pop(fr, swap)})`, transformOrigin: '0% 50%'}}>
            <Heading size={104}>And their own<br /><span style={{color: C.accent}}>secret</span> methods.</Heading>
          </div>
        )}
      </div>
      {REPOS.map((r, i) => <RepoCard key={r.name} r={r} i={i} />)}
      <Lock at={f(10.48)} />
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const fr = useCurrentFrame();
  const wipe = snap(fr, SPEECH, 8);
  return (
    <AbsoluteFill style={{background: C.bg, clipPath: `inset(${(1 - wipe) * 100}% 0 0 0)`}}>
      <Grain id="gend" />
      <div style={{position: 'absolute', left: 96, right: 96, top: 760}}>
        <div style={{transform: `scale(${pop(fr, SPEECH + 6)})`, transformOrigin: '0% 50%'}}>
          <Heading size={156} style={{letterSpacing: -3}}>Follow along.</Heading>
        </div>
        <Underline at={SPEECH + 12} width={520} />
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 56, color: C.soft, marginTop: 52, opacity: ease(fr, SPEECH + 14, 8)}}>This one was edited by Claude.</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Captions: word pop, Classic look with paper box ----------
type Cap = {t: number; text: string; key?: boolean};
const CAPS: Cap[] = [
  {t: 0.0, text: "I didn't"},
  {t: 0.56, text: 'edit', key: true},
  {t: 3.3, text: 'No one'},
  {t: 3.76, text: 'is telling', key: true},
  {t: 11.86, text: 'So'},
  {t: 12.36, text: 'I will'},
  {t: 12.82, text: 'tell you', key: true},
];

const Captions: React.FC = () => {
  const fr = useCurrentFrame();
  if (drawerAt(fr) || (fr >= PAGE.from && fr < PAGE.to) || fr >= SPEECH) return null;
  let i = -1;
  CAPS.forEach((c, k) => { if (f(c.t) <= fr) i = k; });
  if (i < 0) return null;
  const c = CAPS[i];
  // never across a cut to a different sentence
  if (cutOf(f(c.t)) !== cutOf(fr)) return null;
  const at = f(c.t);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center'}}>
      <div style={{transform: `scale(${pop(fr, at)})`, background: C.bg, color: c.key ? C.accent : C.ink, fontFamily: SANS, fontWeight: 700, fontSize: 92, letterSpacing: -2, padding: '14px 40px 20px', borderRadius: 22, boxShadow: '0 10px 30px rgba(0,0,0,0.35)'}}>
        {c.text}
      </div>
    </div>
  );
};

// ---------- Sound: quiet, only where something lands ----------
const SFX: [number, string, number][] = [
  [1.1, 'page-turn', 0.16],
  [2.56, 'page-turn', 0.13],
  [4.04, 'page-turn', 0.16],
  [7.07, 'page-turn', 0.14],
  [8.68, 'tap', 0.12],
  [10.14, 'tick', 0.1],
  [13.5, 'page-turn', 0.15],
  [15.1, 'bloom', 0.1],
];

export const PaperDrawerWA: React.FC = () => {
  const fr = useCurrentFrame();
  const {S, tx, ty} = framing(Math.min(fr, SPEECH - 1));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <OffthreadVideo muted src={staticFile('wa1832/talk.mp4')} style={{position: 'absolute', left: 0, top: 0, width: PD_W, height: PD_H, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${S})`}} />
      <Captions />
      {DRAWERS.map((d, k) => (
        <Sequence key={k} from={0} durationInFrames={d.to} layout="none">
          {fr >= d.from ? (
            <>
              <Drawer from={d.from} seed={11 + k}>{k === 0 ? <CardSeconds /> : k === 1 ? <CardHow /> : <CardList />}</Drawer>
              {k === 0 && fr >= f(2.56) ? <Drawer from={f(2.56)} seed={29}><CardClaude /></Drawer> : null}
            </>
          ) : null}
        </Sequence>
      ))}
      {fr >= PAGE.from && fr < PAGE.to ? <RepoPage /> : null}
      {fr >= SPEECH ? <EndCard /> : null}
      <Audio src={staticFile('wa1832/voice.wav')} />
      {SFX.map(([t, file, vol], i) => (
        <Sequence key={i} from={f(t)} durationInFrames={f(1.5)} layout="none">
          <Audio src={staticFile(`sfx/${file}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
