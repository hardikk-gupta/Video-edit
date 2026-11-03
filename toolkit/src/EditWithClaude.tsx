// EditWithClaude: "How to edit videos with Claude", 45 s, 1080×1920 (projects/2026-11-02-edit-with-claude).
// Layers: a 2.7 s match-cut hook (pages flip, "Claude" stays locked), then Clawd's hand-painted performance
// (8 fps frames on a cinematic night stage, rendered by toolkit/clawd, symlinked to public/edits/ewc/frames) under crisp UI cards, one-word
// captions timed to the voice-over script, and sparse quiet SFX. Hardik records the VO to SCRIPT below.
// v2 (2026-11-03): one workspace window for the whole film (born from the hook's box, ends as the comment field),
// carries at every step boundary (Carries), a slow camera, speed blur on flying parts, and Clawd moving with the UI.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, getInputProps, interpolate, interpolateColors, staticFile, useCurrentFrame} from 'remotion';

export const W = 1080, H = 1920, FPS = 30, DUR = 45, FRAMES = DUR * FPS;
const CLAWD_FPS = 8;   // Clawd is drawn on threes (8 drawings/s): software-GL render cost, docs/15
const INK = '#1F1E1D', MUTED = '#6E675F', LINE = 'rgba(31,30,29,.10)', CARD = '#FFFCF6', CLAY = '#C96442', CLAY_LT = '#F1D3C4', PAPER = '#F3EBDC';
const NIGHT = '#16132A', LIGHT = '#F4ECE0', LIGHT_MUTED = 'rgba(244,236,224,.62)', CLAY_ON_DARK = '#EE9A72';
const SANS = 'Inter, sans-serif', MONO = '"JetBrains Mono", monospace';
const M = 72, CW = W - 2 * M;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const EO = Easing.bezier(.16, 1, .3, 1);
const ease = (t: number, a: number, d = .45) => interpolate(t, [a, a + d], [0, 1], {...clamp, easing: EO});
const useT = () => useCurrentFrame() / FPS;

// ---------------------------------------------------------------- script (the voice-over Hardik records)
// [start, end, line]. Times are where each line should be spoken; captions follow these.
export const SCRIPT: [number, number, string][] = [
  [0.25, 2.35, 'Editing with Claude.'],
  [2.8, 7.4, "Everyone edits with Claude now. Nobody shows the process. This is your final stop, so save it."],
  [7.6, 12.3, 'Step one. One folder: raw footage, references, exports. Open it in Claude Code.'],
  [12.6, 17.7, 'Step two. Claude watches before it edits. Every reference, frame by frame, with a transcript.'],
  [18.0, 23.3, 'Step three. It writes a style sheet and a storyboard. Nothing gets cut until you approve.'],
  [23.6, 29.1, 'Step four. The edit: clean cuts, captions on the exact frame, motion and quiet sound.'],
  [29.4, 34.7, 'Step five. A second Claude reviews every frame. Then your notes, in plain English.'],
  [35.0, 40.1, 'Step six. Every note gets saved, so the next video starts smarter.'],
  [40.4, 44.6, "That's the whole system. Comment EDIT, and I'll send it to you."],
];
type Word = {w: string; s: number; e: number};
// Spread each line's words over its window: weight by length, with a short breath after punctuation.
const WORDS: Word[] = SCRIPT.slice(1).flatMap(([a, b, line]) => {
  const ws = line.split(' '), pause = (w: string) => (/[.,:]$/.test(w) ? .22 : 0);
  const weight = ws.map(w => w.replace(/[^A-Za-z0-9']/g, '').length + 2.2);
  const total = b - a - ws.reduce((s, w) => s + pause(w), 0), sum = weight.reduce((s, x) => s + x, 0);
  let t = a; return ws.map((w, i) => { const d = total * weight[i] / sum, o = {w, s: t, e: t + d}; t += d + pause(w); return o; });
});
const STRESS = /^(Claude|EDIT|one|two|three|four|five|six|save|approve|smarter)[.,:]?$/i;

// ---------------------------------------------------------------- the hook: a match cut on one locked word
export const PAGES: {font: string; size: number; weight: number; italic?: boolean; color: string; bg: string; left: string; right: string; lines: string[]}[] = [
  {font: 'Bitstream Charter', size: 46, weight: 400, color: '#2B2620', bg: '#F4EEE3', left: 'editors now hand raw footage to', right: 'and get a cut back', lines: ['Most of the week went into trimming silences.', 'The rough cut used to take a full day,', 'then a second day for captions alone.', 'Now the first pass is ready before lunch,', 'and the editor spends the day on taste.']},
  {font: 'JetBrains Mono', size: 36, weight: 400, color: '#24292F', bg: '#F6F8FA', left: '## Edit with', right: 'Code', lines: ['git clone video-edit && cd video-edit', 'toolkit/scripts/fetch_vendor.sh', '# skills load from .claude/skills', '1. watch every reference first', '2. storyboard, then approval']},
  {font: 'Caladea', size: 50, weight: 700, color: '#1C1A17', bg: '#EFE7D8', left: 'the storyboard came from', right: 'first', lines: ['The process starts with watching.', 'Every reference, frame by frame,', 'broken into hook, beats and type.', 'Only then does anything get cut,', 'and only after a yes.']},
  {font: 'Inter', size: 44, weight: 500, color: '#1F1E1D', bg: '#FBFAF7', left: 'Ask', right: 'to cut the dead air', lines: ['Silence removed, fumbles gone,', 'and the best take of every line kept.', 'Captions land on the exact frame', 'each word is spoken.', 'Then a second pass reviews it all.']},
  {font: 'Liberation Serif', size: 52, weight: 400, italic: true, color: '#2A2420', bg: '#F2EADB', left: 'a reel cut by', right: 'in an afternoon', lines: ['It read every word of the transcript', 'and matched the pace to the speaker.', 'The feedback went into a log,', 'and the next video started there.', 'Nothing was lost between rounds.']},
  {font: 'Courier 10 Pitch', size: 40, weight: 400, color: '#262422', bg: '#F1ECE2', left: 'feedback for', right: ': font bigger', lines: ['v1  hook too slow', 'v2  sound too loud, quieter please', 'v3  approved', 'saved to docs/10-feedback-log.md', 'the next edit reads it first']},
  {font: 'DejaVu Serif', size: 42, weight: 700, color: '#201C18', bg: '#F5EFE5', left: 'the style sheet', right: 'wrote', lines: ['Type: a natural sans, two sizes.', 'Colour: paper, ink and clay.', 'Pacing: a cut every 1.6 seconds.', 'Sound: quiet taps where things land.', 'Approved before the first frame.']},
  {font: 'Carlito', size: 48, weight: 400, color: '#22201C', bg: '#FAF7F1', left: 'creators editing with', right: 'all week', lines: ['Three folders: raw, references, exports.', 'One local chat pointed at them.', 'The tools install themselves:', 'ffmpeg, whisper, yt-dlp.', 'Then the reels start coming.']},
  {font: 'FreeSerif', size: 50, weight: 400, color: '#2B241E', bg: '#EFE6D6', left: 'No one explains how', right: 'edits', lines: ['They show the result, never the system.', 'A storyboard, a review, a log.', 'That is the part that compounds.', 'Every video teaches the next.', 'This is the whole process.']},
  {font: 'Liberation Sans', size: 46, weight: 700, color: '#1D1C1A', bg: '#F7F4EE', left: 'Video editing with', right: 'is here', lines: ['Cut. Caption. Motion. Sound.', 'Reviewed before you see it.', 'Changed in plain English.', 'Saved so it gets better.', 'Shared as one repo.']},
];
const FLIP = 3 / FPS;                          // a new page every 3 frames
const HOOK_FLIPS_END = 1.5, RESOLVE = 1.55, HOOK_END = 2.75;
export const BOX = {w: 330, h: 112, y: 860};          // the locked word sits here on every page
// final line "Editing with [Claude]" is centred: text ~450 px + gap + box
export const TEXT_W = 450, GAP = 34, LEFT0 = (W - TEXT_W - GAP - BOX.w) / 2, BOX_X = LEFT0 + TEXT_W + GAP;

export const ClaudeBox: React.FC<{s?: number}> = ({s = 1}) => (
  <div style={{width: BOX.w * s, height: BOX.h * s, background: CLAY, borderRadius: 10 * s, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: '"Bitstream Charter", serif', fontWeight: 700, fontSize: 84 * s, color: '#FFF6EE', letterSpacing: -1 * s, boxShadow: '0 10px 30px rgba(120,50,25,.25)'}}>Claude</div>
);

export const Page: React.FC<{p: typeof PAGES[number]; t: number}> = ({p}) => {
  const size = p.size * 1.5, lh = size * 1.3, N = 9;   // a full page: 9 lines above and below, blurring with distance
  const pick = (i: number) => p.lines[((i % p.lines.length) + p.lines.length) % p.lines.length];
  const above = Array.from({length: N}, (_, i) => pick(i + 2)), below = Array.from({length: N}, (_, i) => pick(i + 3));
  const line = (txt: string, i: number, dist: number) => (
    <div key={i} style={{whiteSpace: 'nowrap', filter: `blur(${Math.min(7, .8 + dist * .9)}px)`, opacity: Math.max(.3, 1 - dist * .08)}}>{txt}</div>
  );
  return (
    <AbsoluteFill style={{background: p.bg, fontFamily: p.font, fontSize: size, fontWeight: p.weight, fontStyle: p.italic ? 'italic' : 'normal', color: p.color, lineHeight: `${lh}px`}}>
      <div style={{position: 'absolute', left: -60, right: -60, top: BOX.y + BOX.h / 2 - lh / 2 - lh * N}}>{above.map((x, i) => line(x, i, N - i))}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: BOX.y + (BOX.h - lh) / 2, height: lh, display: 'flex', alignItems: 'center'}}>
        <div style={{width: (W - BOX.w) / 2 - 18, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', filter: 'blur(.6px)'}}>{p.left}</div>
        <div style={{width: BOX.w + 36}} />
        <div style={{flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', filter: 'blur(.6px)'}}>{p.right}</div>
      </div>
      <div style={{position: 'absolute', left: -60, right: -60, top: BOX.y + BOX.h / 2 + lh / 2}}>{below.map((x, i) => line(x, i, i + 1))}</div>
    </AbsoluteFill>
  );
};

// v2: the page dissolves straight onto Clawd's empty, lit stage (no flat colour card). "Claude" slides into place, and
// at HOOK_END the box itself becomes the workspace window (Workspace below takes over the same rect, same colour).
const Hook: React.FC = () => {
  const t = useT(); if (t >= HOOK_END + .4) return null;
  const idx = Math.min(PAGES.length - 1, Math.floor(t / FLIP) % PAGES.length);
  const page = PAGES[t < HOOK_FLIPS_END ? idx : (Math.floor(HOOK_FLIPS_END / FLIP) - 1) % PAGES.length];
  const push = interpolate(t, [0, RESOLVE], [1.0, 1.1], clamp);
  const settle = ease(t, RESOLVE, .5);
  const slide = ease(t, RESOLVE, .4), lead = ease(t, RESOLVE + .32, .5), leave = ease(t, HOOK_END, .3);
  const boxX = interpolate(slide, [0, 1], [(W - BOX.w) / 2, BOX_X]);
  return (
    <AbsoluteFill>
      {settle < 1 ? <AbsoluteFill style={{transform: `scale(${push})`, opacity: 1 - settle}}><Page p={page} t={t} /></AbsoluteFill> : null}
      <div style={{position: 'absolute', left: BOX_X - GAP - 520, top: BOX.y + 10, width: 520, textAlign: 'right', fontFamily: SANS, fontWeight: 600, fontSize: 86,
        letterSpacing: -2.6, color: LIGHT, opacity: lead * (1 - leave), transform: `translateX(${(1 - lead) * 30}px) translateY(${-leave * 40}px)`, filter: `blur(${leave * 8}px)`,
        lineHeight: '92px', whiteSpace: 'nowrap', textShadow: '0 6px 30px rgba(0,0,0,.35)'}}>Editing with</div>
      {t < HOOK_END ? <div style={{position: 'absolute', left: boxX, top: BOX.y, transform: `scale(${t < RESOLVE ? push : 1})`, transformOrigin: 'center'}}><ClaudeBox /></div> : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Clawd's painted stage (8 fps frames)
// --props='{"stageFrame":24}' pins one frame (layout stills while frames render); "frameDir" picks another folder.
const props = () => getInputProps() as {stageFrame?: number; frameDir?: string};
const frameSrc = (i: number) => staticFile(`edits/ewc/${props().frameDir ?? 'frames'}/f${String(props().stageFrame ?? i).padStart(5, '0')}.jpg`);
const Stage: React.FC = () => {
  const t = useT(); if (t < RESOLVE) return null;
  const i = Math.max(19, Math.min(359, Math.floor(t * CLAWD_FPS + 1e-6)));
  const settle = interpolate(t, [RESOLVE, 3.6], [1.08, 1], {...clamp, easing: EO});   // the stage settles as the page dissolves
  return <Img src={frameSrc(i)} style={{position: 'absolute', inset: 0, width: W, height: H, transform: `scale(${settle})`, transformOrigin: '540px 1300px'}} />;
};

// ---------------------------------------------------------------- motion helpers
type R = {x: number; y: number; w: number; h: number; r: number};
const lerpR = (a: R, b: R, k: number): R => ({x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k, h: a.h + (b.h - a.h) * k, r: a.r + (b.r - a.r) * k});
const smooth = (x: number) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };   // = Clawd's ease()
const seg = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
// blur from speed: a stand-in for shutter blur on things that fly (px of travel per frame → px of blur)
const speedBlur = (t: number, a: number, d: number, dist: number) => {
  const h = .5 / FPS, v = Math.abs(ease(t + h, a, d) - ease(t - h, a, d)) * dist;   // px per frame
  return Math.min(14, v * .22);
};
const TITLE = 64;   // window title bar height

const BEATS = [[2.75, 7.5], [7.5, 12.45], [12.45, 17.85], [17.85, 23.45], [23.45, 29.25], [29.25, 34.85], [34.85, 40.3], [40.3, 45.2]] as const;

// ---------------------------------------------------------------- the workspace: one window for the whole film
// It is born from the hook's "Claude" box, changes shape for each step, and ends as the comment field.
const R_BOX: R = {x: BOX_X, y: BOX.y, w: BOX.w, h: BOX.h, r: 10};
const R_FULL: R = {x: M, y: 410, w: CW, h: 650, r: 30};   // bottom 1060: clear of Clawd's tallest hat
const R_STYLE: R = {x: M, y: 400, w: CW, h: 380, r: 30};
const R_REVIEW: R = {x: M, y: 400, w: CW, h: 400, r: 30};
const R_FIELD: R = {x: M + 60, y: 690, w: CW - 120, h: 104, r: 52};
const SHAPES: [number, number, R][] = [[2.75, .62, R_FULL], [17.85, .55, R_STYLE], [23.45, .55, R_FULL], [29.25, .55, R_REVIEW], [34.85, .55, R_FULL], [40.3, .65, R_FIELD]];
const rectAt = (t: number) => { let r = R_BOX; for (const [a, d, s] of SHAPES) { if (t < a) break; r = lerpR(r, s, ease(t, a, d)); } return r; };
const TITLES: [number, string][] = [[2.75, 'the-process.md'], [7.5, '~/AI Video Editor'], [12.45, 'watch · contact sheet'], [17.85, 'style_sheet.md'],
  [23.45, 'timeline · v1'], [29.25, 'review · second pass'], [34.85, 'feedback-log.md']];

// a step's content inside the window: rises in softly, lifts out with blur (the window itself stays)
const Scene: React.FC<{i: number; delay?: number; children: React.ReactNode}> = ({i, delay = .12, children}) => {
  const t = useT(); const [a, b] = BEATS[i]; if (t < a - .05 || t > b + .4) return null;
  const k = ease(t, a + delay, .5), o = ease(t, b - .05, .3);
  return <div style={{position: 'absolute', inset: 0, opacity: Math.min(k, 1 - o), transform: `translateY(${(1 - k) * 24 - o * 30}px)`, filter: `blur(${(1 - k) * 8 + o * 10}px)`}}>{children}</div>;
};

const Workspace: React.FC = () => {
  const t = useT(); if (t < HOOK_END) return null;
  const r = rectAt(t), born = ease(t, HOOK_END, .45), sent = ease(t, 42.4, .35);
  if (sent >= 1) return null;
  const bg = interpolateColors(born, [0, 1], [CLAY, CARD]);
  const chrome = ease(t, 3.05, .35) * (1 - ease(t, 40.3, .25));
  let title = TITLES[0][1]; let tk = 1;
  for (const [a, s] of TITLES) if (t >= a) { title = s; tk = ease(t, a + .1, .35); }
  const field = ease(t, 40.75, .3), typed = 'EDIT'.slice(0, Math.max(0, Math.floor((t - 41.6) * 9)));
  return (
    <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, background: bg, borderRadius: r.r, overflow: 'hidden',
      border: `1.5px solid ${born > .5 ? LINE : 'transparent'}`, boxShadow: '0 40px 80px -24px rgba(0,0,0,.6), 0 2px 8px rgba(0,0,0,.25)',
      opacity: 1 - sent, transform: `translateY(${-sent * 30}px)`}}>
      {/* the word that was in the box */}
      <div style={{position: 'absolute', left: 0, right: 0, top: (BOX.h - 100) / 2, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1 - ease(t, HOOK_END, .18),
        fontFamily: '"Bitstream Charter", serif', fontWeight: 700, fontSize: 84, color: '#FFF6EE', letterSpacing: -1}}>Claude</div>
      <div style={{height: TITLE, display: 'flex', alignItems: 'center', gap: 10, padding: '0 28px', borderBottom: `1.5px solid ${LINE}`, opacity: chrome}}>
        {[0, 1, 2].map(k => <div key={k} style={{width: 14, height: 14, borderRadius: 7, background: '#E4DDD2'}} />)}
        <div style={{marginLeft: 14, fontFamily: MONO, fontSize: 22, color: MUTED, opacity: tk, whiteSpace: 'nowrap'}}>{title}</div>
      </div>
      <div style={{position: 'absolute', left: 0, top: TITLE, width: R_FULL.w, height: R_FULL.h - TITLE}}>
        <Intro /><StepFolder /><StepWatch /><StepStyle /><StepEdit /><StepReview /><StepLearn />
      </div>
      {t >= 40.3 ? <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 16px 0 40px', opacity: field}}>
        <span style={{fontFamily: SANS, fontSize: 36, fontWeight: typed ? 600 : 400, color: typed ? INK : 'rgba(31,30,29,.35)', flex: 1}}>{typed || 'Add a comment…'}</span>
        <div style={{width: 74, height: 74, borderRadius: 37, background: typed.length === 4 ? CLAY : 'rgba(31,30,29,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={30} height={30} viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
      </div> : null}
    </div>
  );
};

// ---------------------------------------------------------------- headline: words roll in, roll out
const HEADS: [number, string][] = [[0, 'The whole process.'], [1, 'One folder.'], [2, 'Claude watches first.'], [3, 'Style sheet, then storyboard.'],
  [4, 'The edit.'], [5, 'A second Claude reviews.'], [6, 'It learns every round.']];
const HeadText: React.FC<{n?: number; text: string; k?: (i: number) => number; style?: React.CSSProperties; accent?: string}> = ({n, text, k = () => 1, style, accent}) => (
  <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 76, letterSpacing: -2.4, lineHeight: '82px', color: LIGHT, ...style}}>
    {[...(n ? [String(n)] : []), ...text.split(' ')].map((w, i) => { const e = k(i); return (
      <span key={i} style={{display: 'inline-block', marginRight: n && i === 0 ? 22 : 19, color: (n && i === 0) || w === accent ? CLAY_ON_DARK : undefined, fontVariantNumeric: 'tabular-nums',
        opacity: e, transform: `translateY(${(1 - e) * 34}px)`, filter: `blur(${(1 - e) * 8}px)`}}>{w}</span>); })}
  </div>
);
const Headlines: React.FC = () => {
  const t = useT();
  return <>{HEADS.map(([i, text]) => {
    const [a, b] = BEATS[i]; if (t < a - .05 || t > b + .4) return null;
    const flown = i === 1;                                   // step 1's headline arrives from the list (Carry1)
    if (flown && t < FLY1.a + FLY1.d) return null;
    const o = ease(t, b - .1, .3);
    return <div key={i} style={{position: 'absolute', left: M, top: 214, width: CW, opacity: 1 - o, transform: `translateY(${-o * 30}px)`, filter: `blur(${o * 8}px)`}}>
      <HeadText n={i || undefined} text={text} k={flown ? undefined : w => ease(t, a + .08 + w * .055, .45)} /></div>;
  })}</>;
};

// ---------------------------------------------------------------- steps (coordinates are inside the window body)
const Check: React.FC<{on: number; size?: number}> = ({on, size = 34}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, border: `2px solid ${on > .5 ? CLAY : 'rgba(31,30,29,.25)'}`, background: on > .5 ? CLAY : 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + .18 * Math.sin(Math.min(1, on) * Math.PI)})`}}>
    <svg width={size * .55} height={size * .55} viewBox="0 0 20 20"><path d="M4 10.5l4 4 8-9" fill="none" stroke="#FFF6EE" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray={24} strokeDashoffset={24 * (1 - Math.min(1, on))} /></svg>
  </div>
);

const FolderIcon: React.FC<{w: number; h?: number; color?: string}> = ({w, h = w * .8, color = CLAY}) => (
  <svg width={w} height={h} viewBox="0 0 100 80" preserveAspectRatio="none"><path d="M6 14a6 6 0 0 1 6-6h24l8 9h44a6 6 0 0 1 6 6v45a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6z" fill={color} />
    <path d="M6 28h88v40a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6z" fill="#fff" opacity=".18" /></svg>
);

// A frame of Clawd's own stage, cropped to him: the contact sheet and storyboard show this film's frames.
const Thumb: React.FC<{s: number; w: number | string; h: number | string; r?: number}> = ({s, w, h, r = 12}) => (
  <div style={{width: w, height: h, borderRadius: r, overflow: 'hidden', border: `1.5px solid ${LINE}`, background: PAPER}}>
    <Img src={frameSrc(Math.round(s * CLAWD_FPS))} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 70%'}} />
  </div>
);

// screen positions of things that carry across a cut (window body origin = R_FULL.x, R_FULL.y + TITLE)
const BX = R_FULL.x, BY = R_FULL.y + TITLE;
const ROW0 = {x: BX + 40, y: BY + 30};                                           // "01 One folder" in the list
const FOLDER_REF: R = {x: BX + 348 + 25, y: BY + 70, w: 190, h: 152, r: 14};     // the "references" folder
const SHEET: R = {x: BX + 18, y: BY + 18, w: CW - 36, h: R_FULL.h - TITLE - 36, r: 20};
const TW = 196, TH = 150, TGX = 18;
const BODY_H = R_FULL.h - TITLE;   // 586

const THUMBS = [3.2, 4.7, 6.9, 9.0, 10.0, 11.2, 13.4, 15.7];
const thumbR = (i: number): R => ({x: BX + 40 + (i % 4) * (TW + TGX), y: BY + 30 + Math.floor(i / 4) * (TH + 48), w: TW, h: TH, r: 12});
const PICKS = [0, 2, 5, 7];                                                       // the frames that become the storyboard
const SB = {top: 800, h: 260};
const panelR = (j: number): R => ({x: M + 40 + j * 148, y: SB.top + TITLE + 26, w: 130, h: 140, r: 10});
const LANE_W = CW - 80, CLIPS = [[0, 150], [190, 140], [370, 210], [620, 120], [780, 90]];
const clipR = (j: number): R => ({x: BX + 40 + CLIPS[j][0] * (LANE_W / 900) + 8, y: BY + 30 + 32 + 8, w: CLIPS[j][1] * (LANE_W / 900) - 6, h: 48, r: 8});
const NOTE: R = {x: W - M - 440, y: 830, w: 440, h: 88, r: 30};                  // "make the font bigger"
const LOG0: R = {x: BX + 40, y: BY + 30, w: CW - 80, h: 76, r: 16};             // feedback-log row v1
const FLY1 = {a: 7.3, d: .6}, FLY2 = {a: 12.15, d: .6}, FLY3 = {a: 17.85, d: .65}, FLY4 = {a: 23.45, d: .65}, FLY5 = {a: 34.85, d: .6};
// both Clawd (toolkit/clawd/edit-with-claude.js MOVES) and these lines travel 260→820 px on the same smoothstep
const scanX = (t: number) => 260 + 560 * smooth(seg(t, 13.4, 15.5));
const playX = (t: number) => 260 + 560 * smooth(seg(t, 24.6, 28.9));

const Intro: React.FC = () => {     // the process at a glance + "save it"
  const t = useT();
  const items = ['One folder', 'Claude watches first', 'Style sheet + storyboard', 'The edit', 'A second review', 'It learns'];
  const save = ease(t, 6.45, .4);
  return (
    <Scene i={0} delay={.3}>
      {items.map((x, i) => { const k = ease(t, 3.35 + i * .14, .4); if (i === 0 && t >= FLY1.a) return null; return (
        <div key={x} style={{position: 'absolute', left: 40, top: 30 + i * 88, display: 'flex', alignItems: 'center', gap: 26, opacity: k, transform: `translateY(${(1 - k) * 16}px)`}}>
          <div style={{width: 52, fontFamily: MONO, fontSize: 26, color: CLAY}}>{String(i + 1).padStart(2, '0')}</div>
          <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 500, letterSpacing: -.8, color: INK}}>{x}</div>
        </div>); })}
      <div style={{position: 'absolute', right: 34, top: 30, transform: `scale(${.6 + .4 * save})`, opacity: save, display: 'flex', alignItems: 'center', gap: 12,
        background: CLAY, color: '#FFF6EE', borderRadius: 999, padding: '14px 26px', fontFamily: SANS, fontWeight: 600, fontSize: 30}}>
        <svg width={22} height={28} viewBox="0 0 22 28"><path d="M2 3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v23l-9-6-9 6z" fill='#FFF6EE' /></svg>Save this
      </div>
    </Scene>
  );
};

const StepFolder: React.FC = () => {
  const t = useT();
  const names = ['raw', 'references', 'exports'], at = [8.75, 9.35, 9.95];
  const term = ease(t, 10.9, .45), typed = 'claude'.slice(0, Math.max(0, Math.floor((t - 11.15) * 14)));
  return (
    <Scene i={1}>
      {names.map((n, i) => { const k = ease(t, at[i] - .25, .5); return (
        <div key={n} style={{position: 'absolute', left: 48 + i * 300, top: 70, width: 240, textAlign: 'center', opacity: k, transform: `translateY(${(1 - k) * -90}px)`, zIndex: 1}}>
          <div style={{opacity: i === 1 && t >= FLY2.a ? 0 : 1}}><FolderIcon w={190} color={i === 0 ? CLAY : i === 1 ? '#D98A6A' : '#B5543A'} /></div>
        </div>); })}
      {names.map((n, i) => <div key={'s' + n} style={{position: 'absolute', left: 48 + i * 300 + 25, top: 70, width: 190, height: 152, borderRadius: 16, border: '2.5px dashed rgba(31,30,29,.22)',
        opacity: 1 - ease(t, at[i] - .1, .2)}} />)}
      {names.map((n, i) => <div key={'l' + n} style={{position: 'absolute', left: 48 + i * 300, top: 70 + 152 + 14, width: 240, textAlign: 'center', fontFamily: SANS, fontSize: 32, fontWeight: 500,
        color: t >= at[i] ? INK : 'rgba(31,30,29,.35)'}}>{n}</div>)}
      <div style={{position: 'absolute', left: 40, right: 40, top: BODY_H - 40 - 110, height: 110, borderRadius: 20, background: INK, opacity: term, transform: `translateY(${(1 - term) * 20}px)`,
        display: 'flex', alignItems: 'center', padding: '0 34px', fontFamily: MONO, fontSize: 34, color: '#F5EEE6'}}>
        <span style={{color: CLAY_LT, marginRight: 18}}>~/AI Video Editor ›</span>{typed}<span style={{opacity: Math.floor(t * 2) % 2 ? 1 : 0, marginLeft: 2}}>▍</span>
      </div>
    </Scene>
  );
};

const StepWatch: React.FC = () => {
  const t = useT();
  const words = 'Every reference, frame by frame, with a transcript.'.split(' ');
  const sx = scanX(t) - BX, scanning = t > 13.4 && t < 15.5;
  return (
    <Scene i={2} delay={.35}>
      <div style={{position: 'absolute', inset: 18, borderRadius: 20, background: '#F4EEE5', opacity: 1 - ease(t, 13.0, .5)}} />
      {THUMBS.map((s, i) => { const k = ease(t, 12.7 + i * .26, .35); const r = thumbR(i); if (PICKS.includes(i) && t >= FLY3.a) return null;
        return <div key={i} style={{position: 'absolute', left: r.x - BX, top: r.y - BY, opacity: k, transform: `scale(${.92 + .08 * k})`}}>
          <Thumb s={s} w={TW} h={TH} />
          <div style={{fontFamily: MONO, fontSize: 18, color: MUTED, marginTop: 8}}>00:{String(Math.floor(s)).padStart(2, '0')}.{Math.round((s % 1) * 10)}</div>
        </div>; })}
      <div style={{position: 'absolute', left: sx, top: 26, width: 3, height: 2 * (TH + 48) - 20, background: CLAY, opacity: scanning ? .85 : 0, borderRadius: 2,
        boxShadow: `0 0 18px ${CLAY}`}} />
      <div style={{position: 'absolute', left: 40, right: 40, top: BODY_H - 30 - 92, height: 92, borderRadius: 18, background: '#F4EEE5', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 9, flexWrap: 'nowrap', overflow: 'hidden'}}>
        <span style={{fontFamily: MONO, fontSize: 18, color: MUTED, marginRight: 6}}>transcript</span>
        {words.map((w, i) => { const on = t > 15.6 + i * .22; return <span key={i} style={{fontFamily: SANS, fontSize: 25, letterSpacing: -.3, fontWeight: 500, color: on ? INK : 'rgba(31,30,29,.25)'}}>{w}</span>; })}
      </div>
    </Scene>
  );
};

const StepStyle: React.FC = () => {
  const t = useT();
  const rows: [string, React.ReactNode][] = [
    ['Type', <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: -1}}>Aa <span style={{fontWeight: 400, fontSize: 30, color: MUTED, letterSpacing: 0}}>Inter, 2 sizes</span></span>],
    ['Colour', <div style={{display: 'flex', gap: 10}}>{[PAPER, INK, CLAY, '#E8AA38'].map(c => <div key={c} style={{width: 44, height: 44, borderRadius: 12, background: c, border: `1.5px solid ${LINE}`}} />)}</div>],
    ['Pacing', <span style={{fontFamily: SANS, fontSize: 32, color: INK}}>a cut every 1.6 s</span>],
    ['Sound', <span style={{fontFamily: SANS, fontSize: 32, color: INK}}>quiet taps, no swooshes</span>],
  ];
  return (
    <Scene i={3} delay={.3}>
      {rows.map(([k, v], i) => { const e = ease(t, 18.2 + i * .18, .4); return (
        <div key={k} style={{position: 'absolute', left: 40, right: 40, top: 22 + i * 76, height: 64, display: 'flex', alignItems: 'center', opacity: e, transform: `translateX(${(1 - e) * 24}px)`, borderBottom: i < 3 ? `1.5px solid ${LINE}` : 'none'}}>
          <div style={{width: 190, fontFamily: MONO, fontSize: 24, color: MUTED}}>{k}</div>{v}
        </div>); })}
    </Scene>
  );
};

// the storyboard is a second card under the style sheet; its panels arrive from the contact sheet (Carry3)
const Storyboard: React.FC = () => {
  const t = useT(); if (t < 17.9 || t > 24.0) return null;
  const k = ease(t, 17.95, .5), o = ease(t, FLY4.a + .1, .4), on = ease(t, 22.2, .3);
  return (
    <div style={{position: 'absolute', left: M, top: SB.top, width: CW, height: SB.h, background: CARD, borderRadius: 30, border: `1.5px solid ${LINE}`, overflow: 'hidden',
      boxShadow: '0 40px 80px -24px rgba(0,0,0,.6), 0 2px 8px rgba(0,0,0,.25)', opacity: Math.min(k, 1 - o), transform: `translateY(${(1 - k) * 30}px)`}}>
      <div style={{height: TITLE, display: 'flex', alignItems: 'center', gap: 10, padding: '0 28px', borderBottom: `1.5px solid ${LINE}`}}>
        {[0, 1, 2].map(q => <div key={q} style={{width: 14, height: 14, borderRadius: 7, background: '#E4DDD2'}} />)}
        <div style={{marginLeft: 14, fontFamily: MONO, fontSize: 22, color: MUTED}}>storyboard</div>
      </div>
      {PICKS.map((_, j) => { const p = panelR(j); return <div key={j} style={{position: 'absolute', left: p.x - M, top: p.y - SB.top, width: p.w, height: p.h, borderRadius: 10, border: '2px dashed rgba(31,30,29,.25)'}}>
        {t >= FLY3.a + FLY3.d + j * .06 && t < FLY4.a ? <Thumb s={THUMBS[PICKS[j]]} w={p.w - 4} h={p.h - 4} r={8} /> : null}</div>; })}
      <div style={{position: 'absolute', right: 40, top: TITLE + 68, display: 'flex', alignItems: 'center', gap: 20}}>
        <span style={{fontFamily: SANS, fontSize: 32, fontWeight: 500, color: INK}}>Approve</span>
        <div style={{width: 96, height: 56, borderRadius: 28, background: on > .5 ? CLAY : 'rgba(31,30,29,.16)', position: 'relative'}}>
          <div style={{position: 'absolute', top: 4, left: 4 + on * 40, width: 48, height: 48, borderRadius: 24, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.2)'}} /></div>
      </div>
    </div>
  );
};

const StepEdit: React.FC = () => {
  const t = useT();
  const close = ease(t, 24.7, .6), cap = (i: number) => ease(t, 25.7 + i * .14, .25), kfs = ease(t, 27.0, .4), aud = ease(t, 27.9, .4);
  let x = 0; const tight = CLIPS.map(([, w]) => { const o = x; x += w; return o; });
  const L = 40, lane = (y: number, label: string, child: React.ReactNode) => (
    <div style={{position: 'absolute', left: L, top: y, width: LANE_W, height: 96}}>
      <div style={{fontFamily: MONO, fontSize: 20, lineHeight: '24px', color: MUTED, marginBottom: 8}}>{label}</div>
      <div style={{position: 'relative', height: 64, borderRadius: 12, background: '#F4EEE5'}}>{child}</div>
    </div>);
  const landed = t >= FLY4.a + FLY4.d + .2;
  return (
    <Scene i={4}>
      {lane(30, 'video', CLIPS.map(([o, w], i) => (i < 4 && !landed) ? null : <div key={i} style={{position: 'absolute', top: 8, height: 48, borderRadius: 8, background: i % 2 ? '#D98A6A' : CLAY,
        opacity: i === 4 ? ease(t, 24.2, .3) : 1, left: interpolate(close, [0, 1], [o, tight[i]]) * (LANE_W / 900) + 8, width: w * (LANE_W / 900) - 6}} />))}
      {lane(170, 'captions', ['Step', 'four.', 'The', 'edit:', 'clean', 'cuts'].map((w, i) => <div key={i} style={{position: 'absolute', top: 12, left: 10 + i * 128, height: 40, padding: '0 14px', borderRadius: 8,
        background: INK, color: '#F5EEE6', fontFamily: SANS, fontSize: 22, lineHeight: '40px', opacity: cap(i), transform: `scale(${.8 + .2 * cap(i)})`}}>{w}</div>))}
      {lane(310, 'motion', [0.12, 0.34, 0.56, 0.8].map((p, i) => <div key={i} style={{position: 'absolute', top: 20, left: p * LANE_W, width: 24, height: 24, background: CLAY, transform: `rotate(45deg) scale(${kfs})`, borderRadius: 4}} />))}
      {lane(450, 'sound  −14 LUFS', <svg width={LANE_W} height={64} style={{opacity: aud}}>{Array.from({length: 70}, (_, i) => { const h = 6 + 14 * Math.abs(Math.sin(i * 1.7) * Math.sin(i * .37)); return <rect key={i} x={10 + i * ((LANE_W - 20) / 70)} y={32 - h / 2} width={5} height={h} rx={2.5} fill={INK} opacity={.55} />; })}</svg>)}
      <div style={{position: 'absolute', left: playX(t) - BX, top: 20, width: 3, height: 530, background: CLAY, borderRadius: 2, opacity: ease(t, 24.4, .3), boxShadow: `0 0 18px ${CLAY}`}} />
    </Scene>
  );
};

const StepReview: React.FC = () => {
  const t = useT();
  const checks = ['Every cut lands on a word', 'Captions inside the safe zone', 'Loudness at −14 LUFS', 'Text never covers Clawd'];
  return (
    <Scene i={5} delay={.15}>
      {checks.map((c, i) => <div key={c} style={{position: 'absolute', left: 40, top: 30 + i * 80, display: 'flex', alignItems: 'center', gap: 24, opacity: ease(t, 29.55 + i * .1, .35)}}>
        <Check on={ease(t, 30.7 + i * .38, .3)} /><span style={{fontFamily: SANS, fontSize: 34, fontWeight: 500, letterSpacing: -.5, color: INK}}>{c}</span></div>)}
    </Scene>
  );
};

// the note and the reply sit under the review window; the note later flies into the feedback log (Carry5)
const Conversation: React.FC = () => {
  const t = useT(); if (t < 32.6 || t > 35.3) return null;
  const note = ease(t, 32.85, .4), reply = ease(t, 33.75, .4), out = ease(t, FLY5.a, .3);
  return <>
    {t < FLY5.a ? <div style={{position: 'absolute', left: NOTE.x, top: NOTE.y, width: NOTE.w, height: NOTE.h, background: CLAY, color: '#FFF6EE', borderRadius: '30px 30px 8px 30px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: 36, fontWeight: 500, opacity: note, transform: `translateY(${(1 - note) * 24}px)`}}>make the font bigger</div> : null}
    <div style={{position: 'absolute', left: M, top: 950, background: CARD, border: `1.5px solid ${LINE}`, color: INK, borderRadius: '30px 30px 30px 8px', padding: '22px 30px',
      fontFamily: SANS, fontSize: 36, fontWeight: 500, opacity: reply * (1 - out), transform: `translateY(${(1 - reply) * 24 - out * 20}px)`, boxShadow: '0 12px 30px -12px rgba(80,55,30,.25)'}}>Done. v2 is ready.</div>
  </>;
};

const LOG = [['v1', 'font bigger'], ['v2', 'sound quieter'], ['v3', 'hook faster'], ['v4', 'approved']];
const LogRow: React.FC<{v: string; n: string; last?: boolean; check?: number}> = ({v, n, last, check = 0}) => (
  <div style={{height: 76, display: 'flex', alignItems: 'center', gap: 26, borderRadius: 16, background: last ? '#F7E6DC' : '#F4EEE5', padding: '0 26px'}}>
    <span style={{fontFamily: MONO, fontSize: 24, color: CLAY}}>{v}</span><span style={{fontFamily: SANS, fontSize: 34, fontWeight: 500, color: INK}}>{n}</span>
    {last ? <div style={{marginLeft: 'auto'}}><Check on={check} size={36} /></div> : null}
  </div>
);
const StepLearn: React.FC = () => {
  const t = useT();
  const next = ease(t, 38.4, .45), at = [FLY5.a + FLY5.d, 36.0, 36.5, 37.0];
  return (
    <Scene i={6} delay={0}>
      {LOG.map(([v, n], i) => { if (t < at[i] - (i ? .3 : 0)) return null; const e = i ? ease(t, at[i] - .3, .4) : 1; return (
        <div key={v} style={{position: 'absolute', left: 40, right: 40, top: 30 + i * 96, opacity: e, transform: `translateY(${(1 - e) * -30}px)`}}>
          <LogRow v={v} n={n} last={i === 3} check={ease(t, 37.3, .3)} /></div>); })}
      <div style={{position: 'absolute', left: 40, right: 40, top: BODY_H - 40 - 120, height: 120, borderRadius: 20, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 34px', opacity: next, transform: `translateY(${(1 - next) * 20}px)`}}>
        <span style={{fontFamily: SANS, fontSize: 38, fontWeight: 600, color: '#F5EEE6', letterSpacing: -.8}}>Next video starts here</span>
        <svg width={54} height={54} viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" stroke={CLAY_LT} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </Scene>
  );
};

// ---------------------------------------------------------------- carries: things that survive a cut and move into the next step
const Fly: React.FC<{from: R; to: R; a: number; d: number; children: (k: number) => React.ReactNode; bg?: [string, string]; delay?: number}> = ({from, to, a, d, children, bg, delay = 0}) => {
  const t = useT(), s = a + delay; if (t < s || t >= s + d) return null;
  const k = ease(t, s, d), r = lerpR(from, to, k);
  const dist = Math.hypot(to.x - from.x, to.y - from.y) + Math.abs(to.w - from.w) * .5;
  return <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: r.r, overflow: 'hidden', filter: `blur(${speedBlur(t, s, d, dist)}px)`,
    background: bg ? interpolateColors(k, [0, 1], bg) : undefined, boxShadow: `0 ${20 + 20 * Math.sin(k * Math.PI)}px 50px -20px rgba(0,0,0,.55)`}}>{children(k)}</div>;
};

const Carries: React.FC = () => {
  const t = useT();
  // 1 · "01 One folder" leaves the list and becomes the headline
  const k1 = ease(t, FLY1.a, FLY1.d), on1 = t >= FLY1.a && t < FLY1.a + FLY1.d;
  const fs = 40 + 36 * k1, b1 = speedBlur(t, FLY1.a, FLY1.d, 330);
  return <>
    {on1 ? <div style={{position: 'absolute', left: ROW0.x + (M - ROW0.x) * k1, top: ROW0.y + (214 - ROW0.y) * k1, display: 'flex', alignItems: 'baseline', whiteSpace: 'nowrap',
      fontFamily: SANS, fontWeight: 500 + 100 * k1, fontSize: fs, letterSpacing: -.8 - 1.6 * k1, lineHeight: `${fs * 1.08}px`, color: interpolateColors(k1, [0, 1], [INK, LIGHT]), filter: `blur(${b1}px)`}}>
      <span style={{position: 'relative', width: 78 * (1 - k1) + (fs * .62 + 22) * k1, color: interpolateColors(k1, [0, 1], [CLAY, CLAY_ON_DARK])}}>
        <span style={{position: 'absolute', left: 0, bottom: 0, fontFamily: MONO, fontSize: 26, fontWeight: 400, opacity: 1 - k1}}>01</span>
        <span style={{opacity: k1}}>1</span></span>
      One folder<span style={{opacity: k1}}>.</span>
    </div> : null}
    {/* 2 · the "references" folder opens into the contact sheet */}
    <Fly from={FOLDER_REF} to={SHEET} a={FLY2.a} d={FLY2.d} bg={['rgba(217,138,106,0)', '#F4EEE5']}>{k => <div style={{opacity: 1 - ease(t, FLY2.a + .15, .3)}}><FolderIcon w={lerpR(FOLDER_REF, SHEET, k).w} h={lerpR(FOLDER_REF, SHEET, k).h} color="#D98A6A" /></div>}</Fly>
    {t >= FLY2.a + FLY2.d && t < 13.6 ? <div style={{position: 'absolute', left: SHEET.x, top: SHEET.y, width: SHEET.w, height: SHEET.h, borderRadius: SHEET.r, background: '#F4EEE5', opacity: 1 - ease(t, 12.85, .6)}} /> : null}
    {/* 3 · four frames from the contact sheet become the storyboard */}
    {PICKS.map((i, j) => <Fly key={'p' + j} from={thumbR(i)} to={panelR(j)} a={FLY3.a} d={FLY3.d} delay={j * .06}>{() => <Thumb s={THUMBS[i]} w="100%" h="100%" r={0} />}</Fly>)}
    {/* 4 · the approved storyboard panels drop into the timeline as clips */}
    {PICKS.map((i, j) => <Fly key={'c' + j} from={panelR(j)} to={clipR(j)} a={FLY4.a} d={FLY4.d} delay={j * .06} bg={[CARD, j % 2 ? '#D98A6A' : CLAY]}>{k => <div style={{position: 'absolute', inset: 0, opacity: 1 - ease(t, FLY4.a + .15 + j * .06, .3)}}><Thumb s={THUMBS[i]} w="100%" h="100%" r={0} /></div>}</Fly>)}
    {/* 5 · the note becomes the first line of the feedback log */}
    <Fly from={NOTE} to={LOG0} a={FLY5.a} d={FLY5.d} bg={[CLAY, '#F4EEE5']}>{k => <>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: 36, fontWeight: 500, color: '#FFF6EE', opacity: 1 - ease(t, FLY5.a, .3), whiteSpace: 'nowrap'}}>make the font bigger</div>
      <div style={{position: 'absolute', inset: 0, opacity: ease(t, FLY5.a + .3, .3)}}><LogRow v="v1" n="font bigger" /></div></>}</Fly>
  </>;
};

const Progress: React.FC = () => {
  const t = useT(); if (t < 2.75) return null;
  const vis = ease(t, 2.8, .5) * (1 - ease(t, 40.2, .4));
  const step = BEATS.findIndex(([a, b]) => t >= a && t < b);   // 1..6 are the steps
  return (
    <div style={{position: 'absolute', left: M, top: 150, width: CW, display: 'flex', gap: 12, opacity: vis}}>
      {[1, 2, 3, 4, 5, 6].map(k => {
        const [a, b] = BEATS[k]; const fill = t < a ? 0 : t >= b ? 1 : ease(t, a, b - a - .2);
        return <div key={k} style={{flex: 1, height: 6, borderRadius: 3, background: 'rgba(244,236,224,.16)', overflow: 'hidden'}}>
          <div style={{width: `${fill * 100}%`, height: '100%', background: k === step ? CLAY_ON_DARK : LIGHT, opacity: k === step ? 1 : .6}} /></div>;
      })}
    </div>
  );
};

const Outro: React.FC = () => {
  const t = useT(); const [a] = BEATS[7]; if (t < a - .05) return null;
  const sent = ease(t, 42.4, .35);
  return (
    <>
      <div style={{position: 'absolute', left: M, top: 300, width: CW, textAlign: 'center'}}>
        <HeadText text="Comment EDIT" accent="EDIT" k={i => ease(t, 40.45 + i * .1, .5)} style={{fontSize: 112, letterSpacing: -4, lineHeight: '116px', textAlign: 'center'}} />
        <div style={{fontFamily: SANS, fontWeight: 400, fontSize: 40, letterSpacing: -.6, color: LIGHT_MUTED, marginTop: 26, opacity: ease(t, 40.8, .5)}}>I'll send you the whole setup.</div>
      </div>
      <div style={{position: 'absolute', left: R_FIELD.x, top: R_FIELD.y - 6, width: R_FIELD.w, display: 'flex', alignItems: 'center', gap: 24, padding: '20px 28px', borderRadius: 30,
        background: 'rgba(255,252,246,.08)', border: '1.5px solid rgba(244,236,224,.14)', opacity: sent, transform: `translateY(${(1 - sent) * 30}px)`}}>
        <div style={{width: 72, height: 72, borderRadius: 36, background: CLAY_ON_DARK, flexShrink: 0}} />
        <div><div style={{fontFamily: SANS, fontSize: 26, color: LIGHT_MUTED}}>you · just now</div>
          <div style={{fontFamily: SANS, fontSize: 46, fontWeight: 700, letterSpacing: -.5, color: LIGHT, marginTop: 2}}>EDIT</div></div>
        <svg style={{marginLeft: 'auto'}} width={40} height={40} viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill={CLAY_ON_DARK} opacity={ease(t, 43.0, .3)} /></svg>
      </div>
    </>
  );
};

// the camera moves everything but the captions and progress
// a camera that holds, then nudges in at each step change (a still frame between moves: OneTake's rest rule)
const cam = (t: number) => { let s = 1; for (let i = 1; i < 7; i++) s += .005 * ease(t, BEATS[i][0], .9); return s + .05 * ease(t, 40.3, 1.6); };

// ---------------------------------------------------------------- captions: one word, centred under Clawd
const Captions: React.FC = () => {
  const t = useT(); if (t < 2.75) return null;
  const i = WORDS.findIndex((w, k) => t >= w.s && t < (WORDS[k + 1] && WORDS[k + 1].s - w.e < .3 ? WORDS[k + 1].s : w.e + .12));
  if (i < 0) return null;
  const w = WORDS[i], k = ease(t, w.s, .12);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1530, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 66, letterSpacing: -1.6,
      color: STRESS.test(w.w) ? CLAY_ON_DARK : LIGHT, textShadow: '0 4px 24px rgba(0,0,0,.45)', opacity: .4 + .6 * k, transform: `translateY(${(1 - k) * 8}px)`}}>{w.w.replace(/[.,:]$/, '')}</div>
  );
};

// ---------------------------------------------------------------- sound: quiet, only where something lands
const SFX: [number, string, number][] = [
  ...Array.from({length: Math.floor(HOOK_FLIPS_END / FLIP)}, (_, i) => [i * FLIP, 'tick', .07] as [number, string, number]),
  [RESOLVE + .1, 'bloom', .22],
  [3.3, 'tap', .14], [3.45, 'tap', .08], [6.5, 'tap', .14],
  [7.85, 'tap', .12], [8.75, 'tap', .14], [9.35, 'tap', .14], [9.95, 'tap', .14], [11.0, 'tap', .1],
  [12.7, 'tap', .12], [18.4, 'tap', .14], [22.25, 'bloom', .2],
  [24.1, 'tap', .14], [24.75, 'tap', .12], [29.7, 'tap', .12], [32.85, 'tap', .14], [33.75, 'tap', .1],
  [35.4, 'tap', .14], [37.3, 'bloom', .16], [40.9, 'tap', .14], [42.4, 'bloom', .24],
];

const Camera: React.FC<{children: React.ReactNode}> = ({children}) => {
  const t = useT();
  return <AbsoluteFill style={{transform: `scale(${cam(t)})`, transformOrigin: '540px 1150px'}}>{children}</AbsoluteFill>;
};

export const EditWithClaude: React.FC = () => (
  <AbsoluteFill style={{background: NIGHT}}>
    <Camera>
      <Stage />
      <Headlines />
      <Workspace />
      <Storyboard />
      <Conversation />
      <Carries />
      <Outro />
    </Camera>
    <Progress />
    <Captions />
    <Hook />
    {SFX.map(([at, name, v], i) => <Sequence key={i} from={Math.round(at * FPS)} durationInFrames={Math.round(1.2 * FPS)}><Audio src={staticFile(`sfx/${name}.wav`)} volume={v} /></Sequence>)}
  </AbsoluteFill>
);
