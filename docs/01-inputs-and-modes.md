# 01 · Inputs and modes

## What always comes with a brief

| Input | Required | Notes |
|---|---|---|
| Source: footage **or** storyline/script | yes | One or the other (or both). |
| References | **yes** | Pinterest pins, reels, images, links. They arrive with the video or the prompt. If they're missing, ask before designing. |
| Brand colours | no | If given, they replace the palette tokens in `toolkit/src/Reel.tsx`. If not, take colours from the references. |
| Images to use | no | The person supplies their own. Put them in `toolkit/public/imagery/` and point the `IMAGERY` slots at them. Never substitute stock photos. |
| Aspect ratio / platform | no | Default: keep the source's ratio. A landscape recording stays 1920×1080. |

References can come later in the conversation, often mid-task. When a new one arrives, stop, study it, and
**merge** it into the current direction (see [04-motion-rules.md](04-motion-rules.md), "References").

## Mode A: footage

The person sends a recording (e.g. a WhatsApp video of themselves talking).

1. Probe it: `ffprobe` for resolution, fps, duration and audio. Tile frames to see the framing (is the text
   mirrored? where is the face?).
2. Transcribe with word timings (`toolkit/scripts/transcribe.py`).
3. Decide the edit from the transcript: drop the intro list, tangents, repeats and filler, keep the story.
   Typically 30–40% shorter.
4. Then the normal pipeline ([02-pipeline.md](02-pipeline.md)).

## Mode B: storyline or script only

No footage. The video is pure motion graphics over a voice-over.

1. **Script.** If you get a storyline, write a script: a hook in the first 3s, one idea per beat, chapters if
   there's a list, and a takeaway line to end on. Read it out loud: 150 words ≈ 60s. Get the person's OK on the
   script before you make audio.
2. **Voice.**
   - If you can generate speech (a TTS API or tool is available and allowed), generate it.
   - If you can't, the person makes it: they paste the script into **ElevenLabs** (text-to-speech), pick a
     voice, export an MP3/WAV, and send it. Tell them exactly that.
   - Treat the voice file as `public/talk.*` audio (no video track). Run the voice chain from
     `build_talk.py` only if it needs cleaning; TTS output usually doesn't.
3. **Timings.** Transcribe the voice file with `transcribe.py` to get word timings, so beats and captions land
   on the words.
4. **Layout.** Same grid system. With no face tile, that cell goes to an explainer figure, a UI card, or one of
   the person's images.
5. Then the normal pipeline from the design step on.

## Mode C: footage plus storyline

The person gives footage and says what story it should tell. The storyline decides the order of beats and the
chapter titles. The footage supplies the voice and the face tile. Re-order clips if the story needs it.

## Mode D: short insert / B-roll graphic

A 2–6s piece that sits inside another video (e.g. the top half of a 9:16 split with the speaker below).
No voice, no captions, no face. Deliver at the size asked (1:1 1080×1080 for a half-height 9:16 slot is fine; a
precise 1080×960 also works). If it's about real products, source their real material
([11-pulling-references.md](11-pulling-references.md)). Example: `projects/2026-10-dots-vs-duet/`.

## Questions worth asking (only if the answer changes the work)

- References missing → "Send me 1–3 references for the look (Pinterest pins or reels)."
- No voice and you can't generate one → "Paste this script into ElevenLabs, export, send me the file."
- Ratio unclear for a storyline video → "16:9 or 9:16?"
