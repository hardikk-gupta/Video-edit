// EditWithClaude: "How to edit videos with Claude", 45 s, 1080×1920 (projects/2026-11-02-edit-with-claude).
// Layers: a 2.7 s match-cut hook (pages flip, "Claude" stays locked), then Clawd's hand-painted performance
// (8 fps frames on a cinematic night stage, rendered by toolkit/clawd, symlinked to public/edits/ewc/frames) under crisp UI cards, one-word
// captions timed to the voice-over script, and sparse quiet SFX. Hardik records the VO to SCRIPT below.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, getInputProps, interpolate, staticFile, useCurrentFrame} from 'remotion';

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
const PAGES: {font: string; size: number; weight: number; italic?: boolean; color: string; bg: string; left: string; right: string; lines: string[]}[] = [
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
const BOX = {w: 330, h: 112, y: 860};          // the locked word sits here on every page

const ClaudeBox: React.FC<{s?: number}> = ({s = 1}) => (
  <div style={{width: BOX.w * s, height: BOX.h * s, background: CLAY, borderRadius: 10 * s, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: '"Bitstream Charter", serif', fontWeight: 700, fontSize: 84 * s, color: '#FFF6EE', letterSpacing: -1 * s, boxShadow: '0 10px 30px rgba(120,50,25,.25)'}}>Claude</div>
);

const Page: React.FC<{p: typeof PAGES[number]; t: number}> = ({p, t}) => {
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

const Hook: React.FC = () => {
  const t = useT(); if (t >= HOOK_END + .4) return null;
  const idx = Math.min(PAGES.length - 1, Math.floor(t / FLIP) % PAGES.length);
  const page = PAGES[t < HOOK_FLIPS_END ? idx : (Math.floor(HOOK_FLIPS_END / FLIP) - 1) % PAGES.length];
  const push = interpolate(t, [0, RESOLVE], [1.0, 1.1], clamp);
  const settle = ease(t, RESOLVE, .5);                 // page dissolves to paper, the sentence assembles
  const out = ease(t, HOOK_END - .2, .45);             // hand-off to Clawd's stage
  // final line "Editing with [Claude]" is centred: text ~450 px + 26 gap + box 330
  const TEXT_W = 450, GAP = 34, LEFT0 = (W - TEXT_W - GAP - BOX.w) / 2, BOX_X = LEFT0 + TEXT_W + GAP;
  const slide = ease(t, RESOLVE, .4), lead = ease(t, RESOLVE + .32, .5);
  const boxX = interpolate(slide, [0, 1], [(W - BOX.w) / 2, BOX_X]);
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <AbsoluteFill style={{transform: `scale(${push})`, opacity: 1 - settle}}><Page p={page} t={t} /></AbsoluteFill>
      <AbsoluteFill style={{background: NIGHT, opacity: settle}} />
      <div style={{position: 'absolute', left: BOX_X - GAP - 520, top: BOX.y + 10, width: 520, textAlign: 'right', fontFamily: SANS, fontWeight: 600, fontSize: 86,
        letterSpacing: -2.6, color: LIGHT, opacity: lead, transform: `translateX(${(1 - lead) * 30}px)`, lineHeight: '92px', whiteSpace: 'nowrap'}}>Editing with</div>
      <div style={{position: 'absolute', left: boxX, top: BOX.y, transform: `scale(${t < RESOLVE ? push : 1})`, transformOrigin: 'center'}}><ClaudeBox /></div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Clawd's painted stage (8 fps frames)
const Stage: React.FC = () => {
  const t = useT(); if (t < 2.4) return null;
  // --props='{"stageFrame":24}' pins one frame: layout stills while the Clawd frames are still rendering
  const pin = (getInputProps() as {stageFrame?: number}).stageFrame;
  const i = pin ?? Math.max(19, Math.min(359, Math.floor(t * CLAWD_FPS + 1e-6)));
  return <Img src={staticFile(`edits/ewc/frames/f${String(i).padStart(5, '0')}.jpg`)} style={{position: 'absolute', inset: 0, width: W, height: H}} />;
};

// ---------------------------------------------------------------- shared UI
const BEATS = [[2.75, 7.5], [7.5, 12.45], [12.45, 17.85], [17.85, 23.45], [23.45, 29.25], [29.25, 34.85], [34.85, 40.3], [40.3, 45.2]] as const;
const inBeat = (t: number, a: number, b: number) => t >= a - .05 && t < b + .4;
// enter from below with a soft spring, leave upward
const beatStyle = (t: number, a: number, b: number, delay = 0): React.CSSProperties => {
  const i = ease(t, a + delay, .55), o = ease(t, b - .05, .35);
  return {opacity: Math.min(i, 1 - o), transform: `translateY(${(1 - i) * 50 - o * 40}px)`};
};

const Window: React.FC<{title: string; top: number; height: number; children: React.ReactNode; style?: React.CSSProperties}> = ({title, top, height, children, style}) => (
  <div style={{position: 'absolute', left: M, top, width: CW, height, background: CARD, borderRadius: 30, border: `1.5px solid ${LINE}`,
    boxShadow: '0 40px 80px -24px rgba(0,0,0,.6), 0 2px 8px rgba(0,0,0,.25)', overflow: 'hidden', ...style}}>
    <div style={{height: 64, display: 'flex', alignItems: 'center', gap: 10, padding: '0 28px', borderBottom: `1.5px solid ${LINE}`}}>
      {[0, 1, 2].map(k => <div key={k} style={{width: 14, height: 14, borderRadius: 7, background: '#E4DDD2'}} />)}
      <div style={{marginLeft: 14, fontFamily: MONO, fontSize: 22, color: MUTED}}>{title}</div>
    </div>
    <div style={{position: 'relative', height: height - 64}}>{children}</div>
  </div>
);

const Headline: React.FC<{n?: number; text: string; a: number; b: number}> = ({n, text, a, b}) => {
  const t = useT(); if (!inBeat(t, a, b)) return null;
  return (
    <div style={{position: 'absolute', left: M, top: 214, width: CW, fontFamily: SANS, fontWeight: 600, fontSize: 76, letterSpacing: -2.4, lineHeight: '82px', color: LIGHT, ...beatStyle(t, a, b)}}>
      {n ? <span style={{color: CLAY_ON_DARK, marginRight: 22, fontVariantNumeric: 'tabular-nums'}}>{n}</span> : null}{text}
    </div>
  );
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

const Check: React.FC<{on: number; size?: number}> = ({on, size = 34}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, border: `2px solid ${on > .5 ? CLAY : 'rgba(31,30,29,.25)'}`, background: on > .5 ? CLAY : 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + .18 * Math.sin(Math.min(1, on) * Math.PI)})`}}>
    <svg width={size * .55} height={size * .55} viewBox="0 0 20 20"><path d="M4 10.5l4 4 8-9" fill="none" stroke="#FFF6EE" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray={24} strokeDashoffset={24 * (1 - Math.min(1, on))} /></svg>
  </div>
);

const FolderIcon: React.FC<{size: number; color?: string}> = ({size, color = CLAY}) => (
  <svg width={size} height={size * .8} viewBox="0 0 100 80"><path d="M6 14a6 6 0 0 1 6-6h24l8 9h44a6 6 0 0 1 6 6v45a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6z" fill={color} />
    <path d="M6 28h88v40a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6z" fill="#fff" opacity=".18" /></svg>
);

// ---------------------------------------------------------------- beats
const Intro: React.FC = () => {     // the process at a glance + "save it"
  const t = useT(); const [a, b] = BEATS[0]; if (!inBeat(t, a, b)) return null;
  const items = ['One folder', 'Claude watches first', 'Style sheet + storyboard', 'The edit', 'A second review', 'It learns'];
  const save = ease(t, 6.45, .4);
  return (
    <div style={beatStyle(t, a, b, .1)}>
      <Window title="the-process.md" top={440} height={700}>
        {items.map((x, i) => { const k = ease(t, 5.15 + i * .16, .4); return (
          <div key={x} style={{position: 'absolute', left: 40, top: 34 + i * 96, display: 'flex', alignItems: 'center', gap: 26, opacity: k, transform: `translateY(${(1 - k) * 16}px)`}}>
            <div style={{width: 52, fontFamily: MONO, fontSize: 26, color: CLAY}}>{String(i + 1).padStart(2, '0')}</div>
            <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 500, letterSpacing: -.8, color: INK}}>{x}</div>
          </div>); })}
      </Window>
      <div style={{position: 'absolute', right: M + 26, top: 470, transform: `scale(${.6 + .4 * save})`, opacity: save, display: 'flex', alignItems: 'center', gap: 12,
        background: CLAY, color: '#FFF6EE', borderRadius: 999, padding: '14px 26px', fontFamily: SANS, fontWeight: 600, fontSize: 30}}>
        <svg width={22} height={28} viewBox="0 0 22 28"><path d="M2 3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v23l-9-6-9 6z" fill='#FFF6EE' /></svg>Save this
      </div>
    </div>
  );
};

const StepFolder: React.FC = () => {
  const t = useT(); const [a, b] = BEATS[1]; if (!inBeat(t, a, b)) return null;
  const names = ['raw', 'references', 'exports'], at = [8.75, 9.35, 9.95];
  const term = ease(t, 10.9, .45), typed = 'claude'.slice(0, Math.max(0, Math.floor((t - 11.15) * 14)));
  return (
    <div style={beatStyle(t, a, b, .1)}>
      <Window title="~/AI Video Editor" top={440} height={700}>
        {names.map((n, i) => { const k = ease(t, at[i] - .25, .5); return (
          <div key={n} style={{position: 'absolute', left: 48 + i * 300, top: 70, width: 240, textAlign: 'center', opacity: k, transform: `translateY(${(1 - k) * -90}px)`}}>
            <FolderIcon size={190} color={i === 0 ? CLAY : i === 1 ? '#D98A6A' : '#B5543A'} />
            <div style={{fontFamily: SANS, fontSize: 32, fontWeight: 500, color: INK, marginTop: 14}}>{n}</div>
          </div>); })}
        <div style={{position: 'absolute', left: 40, right: 40, bottom: 44, height: 110, borderRadius: 20, background: INK, opacity: term, transform: `translateY(${(1 - term) * 20}px)`,
          display: 'flex', alignItems: 'center', padding: '0 34px', fontFamily: MONO, fontSize: 34, color: '#F5EEE6'}}>
          <span style={{color: CLAY_LT, marginRight: 18}}>~/AI Video Editor ›</span>{typed}<span style={{opacity: Math.floor(t * 2) % 2 ? 1 : 0, marginLeft: 2}}>▍</span>
        </div>
      </Window>
    </div>
  );
};

const THUMBS = [3.2, 4.7, 6.9, 9.0, 10.0, 11.2, 13.4, 15.7];
const StepWatch: React.FC = () => {
  const t = useT(); const [a, b] = BEATS[2]; if (!inBeat(t, a, b)) return null;
  const cols = 4, tw = 196, th = 176, gx = 18;
  const words = 'Every reference, frame by frame, with a transcript.'.split(' ');
  const scan = interpolate(t, [13.0, 15.5], [0, 1], clamp);
  return (
    <div style={beatStyle(t, a, b, .1)}>
      <Window title="watch · contact sheet" top={440} height={700}>
        {THUMBS.map((s, i) => { const k = ease(t, 13.0 + i * .3, .35); const x = 40 + (i % cols) * (tw + gx), y = 34 + Math.floor(i / cols) * (th + 54);
          return <div key={i} style={{position: 'absolute', left: x, top: y, opacity: k, transform: `scale(${.92 + .08 * k})`}}>
            <div style={{width: tw, height: th, borderRadius: 12, overflow: 'hidden', border: `1.5px solid ${LINE}`, background: PAPER}}>
              <Img src={staticFile(`edits/ewc/frames/f${String((getInputProps() as {stageFrame?: number}).stageFrame ?? Math.round(s * CLAWD_FPS)).padStart(5, '0')}.jpg`)} style={{width: tw, height: tw * 16 / 9, marginTop: -tw * 16 / 9 * .6}} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 18, color: MUTED, marginTop: 8}}>00:{String(Math.floor(s)).padStart(2, '0')}.{Math.round((s % 1) * 10)}</div>
          </div>; })}
        <div style={{position: 'absolute', left: 40 + scan * (cols * (tw + gx) - 4), top: 26, width: 3, height: 2 * (th + 54) - 30, background: CLAY, opacity: scan > 0 && scan < 1 ? .8 : 0, borderRadius: 2}} />
        <div style={{position: 'absolute', left: 40, right: 40, bottom: 34, height: 92, borderRadius: 18, background: '#F4EEE5', display: 'flex', alignItems: 'center', padding: '0 26px', gap: 12, flexWrap: 'nowrap', overflow: 'hidden'}}>
          <span style={{fontFamily: MONO, fontSize: 20, color: MUTED, marginRight: 8}}>transcript</span>
          {words.map((w, i) => { const on = t > 15.6 + i * .22; return <span key={i} style={{fontFamily: SANS, fontSize: 28, fontWeight: 500, color: on ? INK : 'rgba(31,30,29,.25)'}}>{w}</span>; })}
        </div>
      </Window>
    </div>
  );
};

const StepStyle: React.FC = () => {
  const t = useT(); const [a, b] = BEATS[3]; if (!inBeat(t, a, b)) return null;
  const rows: [string, React.ReactNode][] = [
    ['Type', <span style={{fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: -1}}>Aa <span style={{fontWeight: 400, fontSize: 30, color: MUTED, letterSpacing: 0}}>Inter, 2 sizes</span></span>],
    ['Colour', <div style={{display: 'flex', gap: 10}}>{[PAPER, INK, CLAY, '#E8AA38'].map(c => <div key={c} style={{width: 44, height: 44, borderRadius: 12, background: c, border: `1.5px solid ${LINE}`}} />)}</div>],
    ['Pacing', <span style={{fontFamily: SANS, fontSize: 32, color: INK}}>a cut every 1.6 s</span>],
    ['Sound', <span style={{fontFamily: SANS, fontSize: 32, color: INK}}>quiet taps, no swooshes</span>],
  ];
  const sb = ease(t, 20.0, .5), on = ease(t, 22.2, .3);
  return (
    <div style={beatStyle(t, a, b, .1)}>
      <Window title="style_sheet.md" top={420} height={400}>
        {rows.map(([k, v], i) => { const e = ease(t, 18.35 + i * .3, .4); return (
          <div key={k} style={{position: 'absolute', left: 40, right: 40, top: 22 + i * 76, height: 64, display: 'flex', alignItems: 'center', opacity: e, transform: `translateX(${(1 - e) * 24}px)`, borderBottom: i < 3 ? `1.5px solid ${LINE}` : 'none'}}>
            <div style={{width: 190, fontFamily: MONO, fontSize: 24, color: MUTED}}>{k}</div>{v}
          </div>); })}
      </Window>
      <Window title="storyboard" top={846} height={300} style={{opacity: sb, transform: `translateY(${(1 - sb) * 30}px)`}}>
        {[0, 1, 2, 3].map(i => <div key={i} style={{position: 'absolute', left: 40 + i * 116, top: 30, width: 96, height: 140, borderRadius: 10, border: `2px dashed rgba(31,30,29,.3)`,
          display: 'flex', alignItems: 'flex-end', padding: 8, fontFamily: MONO, fontSize: 18, color: MUTED, opacity: ease(t, 20.2 + i * .15, .3)}}>{i + 1}</div>)}
        <div style={{position: 'absolute', right: 40, top: 58, display: 'flex', alignItems: 'center', gap: 20}}>
          <span style={{fontFamily: SANS, fontSize: 32, fontWeight: 500, color: INK}}>Approve</span>
          <div style={{width: 96, height: 56, borderRadius: 28, background: on > .5 ? CLAY : 'rgba(31,30,29,.16)', position: 'relative'}}>
            <div style={{position: 'absolute', top: 4, left: 4 + on * 40, width: 48, height: 48, borderRadius: 24, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.2)'}} /></div>
        </div>
      </Window>
    </div>
  );
};

const StepEdit: React.FC = () => {
  const t = useT(); const [a, b] = BEATS[4]; if (!inBeat(t, a, b)) return null;
  const close = ease(t, 24.7, .6), cap = (i: number) => ease(t, 25.7 + i * .14, .25), kfs = ease(t, 27.0, .4), aud = ease(t, 27.9, .4);
  const play = interpolate(t, [24.0, 29.0], [0, 1], clamp);
  const clips = [[0, 150], [190, 140], [370, 210], [620, 120], [780, 90]];           // raw, with gaps
  let x = 0; const tight = clips.map(([, w]) => { const o = x; x += w; return o; });
  const L = 40, laneW = CW - 80, lane = (y: number, label: string, child: React.ReactNode) => (
    <div style={{position: 'absolute', left: L, top: y, width: laneW, height: 96}}>
      <div style={{fontFamily: MONO, fontSize: 20, color: MUTED, marginBottom: 8}}>{label}</div>
      <div style={{position: 'relative', height: 64, borderRadius: 12, background: '#F4EEE5'}}>{child}</div>
    </div>);
  return (
    <div style={beatStyle(t, a, b, .1)}>
      <Window title="timeline · v1" top={440} height={700}>
        {lane(30, 'video', clips.map(([o, w], i) => <div key={i} style={{position: 'absolute', top: 8, height: 48, borderRadius: 8, background: i % 2 ? '#D98A6A' : CLAY,
          left: interpolate(close, [0, 1], [o, tight[i]]) * (laneW / 900) + 8, width: w * (laneW / 900) - 6}} />))}
        {lane(170, 'captions', ['Step', 'four.', 'The', 'edit:', 'clean', 'cuts'].map((w, i) => <div key={i} style={{position: 'absolute', top: 12, left: 10 + i * 128, height: 40, padding: '0 14px', borderRadius: 8,
          background: INK, color: '#F5EEE6', fontFamily: SANS, fontSize: 22, lineHeight: '40px', opacity: cap(i), transform: `scale(${.8 + .2 * cap(i)})`}}>{w}</div>))}
        {lane(310, 'motion', [0.12, 0.34, 0.56, 0.8].map((p, i) => <div key={i} style={{position: 'absolute', top: 20, left: p * laneW, width: 24, height: 24, background: CLAY, transform: `rotate(45deg) scale(${kfs})`, borderRadius: 4}} />))}
        {lane(450, 'sound  −14 LUFS', <svg width={laneW} height={64} style={{opacity: aud}}>{Array.from({length: 70}, (_, i) => { const h = 6 + 14 * Math.abs(Math.sin(i * 1.7) * Math.sin(i * .37)); return <rect key={i} x={10 + i * ((laneW - 20) / 70)} y={32 - h / 2} width={5} height={h} rx={2.5} fill={INK} opacity={.55} />; })}</svg>)}
        <div style={{position: 'absolute', left: L + play * laneW, top: 20, width: 3, height: 560, background: CLAY, borderRadius: 2}} />
      </Window>
    </div>
  );
};

const StepReview: React.FC = () => {
  const t = useT(); const [a, b] = BEATS[5]; if (!inBeat(t, a, b)) return null;
  const checks = ['Every cut lands on a word', 'Captions inside the safe zone', 'Loudness at −14 LUFS', 'Nothing covers the face'];
  const note = ease(t, 32.85, .4), reply = ease(t, 33.75, .4);
  return (
    <div style={beatStyle(t, a, b, .1)}>
      <Window title="review · second pass" top={420} height={420}>
        {checks.map((c, i) => <div key={c} style={{position: 'absolute', left: 40, top: 30 + i * 86, display: 'flex', alignItems: 'center', gap: 24}}>
          <Check on={ease(t, 30.7 + i * .38, .3)} /><span style={{fontFamily: SANS, fontSize: 34, fontWeight: 500, letterSpacing: -.5, color: INK}}>{c}</span></div>)}
      </Window>
      <div style={{position: 'absolute', right: M, top: 880, maxWidth: 700, background: CLAY, color: '#FFF6EE', borderRadius: '30px 30px 8px 30px', padding: '22px 30px',
        fontFamily: SANS, fontSize: 36, fontWeight: 500, opacity: note, transform: `translateY(${(1 - note) * 24}px)`}}>make the font bigger</div>
      <div style={{position: 'absolute', left: M, top: 1010, background: CARD, border: `1.5px solid ${LINE}`, color: INK, borderRadius: '30px 30px 30px 8px', padding: '22px 30px',
        fontFamily: SANS, fontSize: 36, fontWeight: 500, opacity: reply, transform: `translateY(${(1 - reply) * 24}px)`, boxShadow: '0 12px 30px -12px rgba(80,55,30,.25)'}}>Done. v2 is ready.</div>
    </div>
  );
};

const StepLearn: React.FC = () => {
  const t = useT(); const [a, b] = BEATS[6]; if (!inBeat(t, a, b)) return null;
  const rows = [['v1', 'font bigger'], ['v2', 'sound quieter'], ['v3', 'hook faster'], ['v4', 'approved']];
  const next = ease(t, 38.4, .45);
  return (
    <div style={beatStyle(t, a, b, .1)}>
      <Window title="feedback-log.md" top={440} height={700}>
        {rows.map(([v, n], i) => { const e = ease(t, 35.6 + i * .5, .4); return (
          <div key={v} style={{position: 'absolute', left: 40, right: 40, top: 30 + i * 96, height: 76, display: 'flex', alignItems: 'center', gap: 26, borderRadius: 16,
            background: i === 3 ? '#F7E6DC' : '#F4EEE5', padding: '0 26px', opacity: e, transform: `translateY(${(1 - e) * -30}px)`}}>
            <span style={{fontFamily: MONO, fontSize: 24, color: CLAY}}>{v}</span><span style={{fontFamily: SANS, fontSize: 34, fontWeight: 500, color: INK}}>{n}</span>
            {i === 3 ? <div style={{marginLeft: 'auto'}}><Check on={ease(t, 37.3, .3)} size={36} /></div> : null}
          </div>); })}
        <div style={{position: 'absolute', left: 40, right: 40, bottom: 44, height: 120, borderRadius: 20, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 34px', opacity: next, transform: `translateY(${(1 - next) * 20}px)`}}>
          <span style={{fontFamily: SANS, fontSize: 38, fontWeight: 600, color: '#F5EEE6', letterSpacing: -.8}}>Next video starts here</span>
          <svg width={54} height={54} viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" stroke={CLAY_LT} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </Window>
    </div>
  );
};

const Outro: React.FC = () => {
  const t = useT(); const [a] = BEATS[7]; if (t < a - .05) return null;
  const head = ease(t, 40.45, .55), field = ease(t, 41.0, .45), typed = 'EDIT'.slice(0, Math.max(0, Math.floor((t - 41.6) * 9))), sent = ease(t, 42.4, .35);
  return (
    <>
      <div style={{position: 'absolute', left: M, top: 300, width: CW, textAlign: 'center', opacity: head, transform: `translateY(${(1 - head) * 30}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 112, letterSpacing: -4, lineHeight: '116px', color: LIGHT}}>Comment <span style={{color: CLAY_ON_DARK}}>EDIT</span></div>
        <div style={{fontFamily: SANS, fontWeight: 400, fontSize: 40, letterSpacing: -.6, color: LIGHT_MUTED, marginTop: 26}}>I'll send you the whole setup.</div>
      </div>
      <div style={{position: 'absolute', left: M + 60, width: CW - 120, top: 690, height: 104, borderRadius: 52, background: CARD, border: `1.5px solid ${LINE}`, boxShadow: '0 20px 40px -18px rgba(80,55,30,.25)',
        display: 'flex', alignItems: 'center', padding: '0 16px 0 40px', opacity: field * (1 - sent), transform: `translateY(${(1 - field) * 24 - sent * 30}px)`}}>
        <span style={{fontFamily: SANS, fontSize: 36, fontWeight: typed ? 600 : 400, color: typed ? INK : 'rgba(31,30,29,.35)', flex: 1}}>{typed || 'Add a comment…'}</span>
        <div style={{width: 74, height: 74, borderRadius: 37, background: typed.length === 4 ? CLAY : 'rgba(31,30,29,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={30} height={30} viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
      </div>
      <div style={{position: 'absolute', right: M + 60, top: 720, background: CLAY, color: '#FFF6EE', borderRadius: '30px 30px 8px 30px', padding: '20px 34px',
        fontFamily: SANS, fontSize: 42, fontWeight: 600, opacity: sent, transform: `translateY(${(1 - sent) * 30}px) scale(${.9 + .1 * sent})`}}>EDIT</div>
    </>
  );
};

// ---------------------------------------------------------------- captions: one word, centred under Clawd
const Captions: React.FC = () => {
  const t = useT(); if (t < 2.75) return null;
  const i = WORDS.findIndex((w, k) => t >= w.s && t < (WORDS[k + 1] && WORDS[k + 1].s - w.e < .3 ? WORDS[k + 1].s : w.e + .12));
  if (i < 0) return null;
  const w = WORDS[i], k = ease(t, w.s, .12);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1592, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 66, letterSpacing: -1.6,
      color: STRESS.test(w.w) ? CLAY_ON_DARK : LIGHT, textShadow: '0 4px 24px rgba(0,0,0,.45)', opacity: .4 + .6 * k, transform: `translateY(${(1 - k) * 8}px)`}}>{w.w.replace(/[.,:]$/, '')}</div>
  );
};

// ---------------------------------------------------------------- sound: quiet, only where something lands
const SFX: [number, string, number][] = [
  ...Array.from({length: Math.floor(HOOK_FLIPS_END / FLIP)}, (_, i) => [i * FLIP, 'tick', .07] as [number, string, number]),
  [RESOLVE + .1, 'bloom', .22],
  [2.85, 'tap', .14], [5.2, 'tap', .1], [6.5, 'tap', .14],
  [8.6, 'tap', .14], [9.2, 'tap', .14], [9.8, 'tap', .14], [11.0, 'tap', .1],
  [12.6, 'tap', .14], [18.0, 'tap', .14], [22.25, 'bloom', .2],
  [23.6, 'tap', .14], [24.75, 'tap', .12], [29.4, 'tap', .14], [32.85, 'tap', .14], [33.75, 'tap', .1],
  [35.0, 'tap', .14], [37.3, 'bloom', .16], [40.45, 'tap', .14], [42.4, 'bloom', .24],
];

export const EditWithClaude: React.FC = () => (
  <AbsoluteFill style={{background: NIGHT}}>
    <Stage />
    <Progress />
    <Headline text="The whole process."  a={BEATS[0][0]} b={BEATS[0][1]} />
    <Headline n={1} text="One folder." a={BEATS[1][0]} b={BEATS[1][1]} />
    <Headline n={2} text="Claude watches first." a={BEATS[2][0]} b={BEATS[2][1]} />
    <Headline n={3} text="Style sheet, then storyboard." a={BEATS[3][0]} b={BEATS[3][1]} />
    <Headline n={4} text="The edit." a={BEATS[4][0]} b={BEATS[4][1]} />
    <Headline n={5} text="A second Claude reviews." a={BEATS[5][0]} b={BEATS[5][1]} />
    <Headline n={6} text="It learns every round." a={BEATS[6][0]} b={BEATS[6][1]} />
    <Intro /><StepFolder /><StepWatch /><StepStyle /><StepEdit /><StepReview /><StepLearn /><Outro />
    <Captions />
    <Hook />
    {SFX.map(([at, name, v], i) => <Sequence key={i} from={Math.round(at * FPS)} durationInFrames={Math.round(1.2 * FPS)}><Audio src={staticFile(`sfx/${name}.wav`)} volume={v} /></Sequence>)}
  </AbsoluteFill>
);
