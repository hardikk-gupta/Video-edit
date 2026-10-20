# AI automations talk (2026-10-20)

**Brief:** Edit Hardik's selfie talk into a premium reel with motion graphics and professional SFX, cutting
the parts that don't matter. References arrived during the job (see [docs/07-references.md](../../docs/07-references.md)).

**Source:** WhatsApp video, 848×478, 60fps, 82.1s, AAC stereo 44.1kHz. Mean -35dB, peak -4.4dB.
**Delivered (v3):** 1920×1080, 30fps, 59.6s (56.76s talk + 2.8s end card), -15 LUFS, 12MB. Sent in chat; not stored.

## Original transcript (source time)

```
[ 0.00- 6.46] We all have used AI to get answers to some of our crazy questions.
[ 6.46-11.38] It could be a personal one, it could be a math problem, it could be a general discussion.
[12.00-20.50] But the models with the capabilities today can do extremely crazy things that we might not have imagined earlier.
[22.60-34.22] And automation has helped me a lot to get out of the loop of just being into the space, that there is a lot
              of news that is coming through AI every day at 8 a.m.
[35.02-41.92] ChatGPT accumulates all the data from the past 24 hours and gives me the summary of what all things are
              going in the AI that is an automation.
[42.40-51.60] And another automation is that it helps me to create one component, one design thing that I might have
              thought or that is new for me, a new learning.
[52.44-61.88] And it goes to Internet, sees what is the best thing we could create as an interaction. It guides me
              where I can create it and how can I create it.
[61.92-73.06] And the other thing is that I can just paste the brief of any client into with ChatGPT, OK, ChatGPT just
              help me out with creating the designs out of it. So it will create the designs in Figma itself.
[73.32-80.38] That is how things are evolving and that is how we should evolve till the time.
[80.38-81.44] See you soon. Bye bye.
```

## Edit decisions (`edl.json`)

| Kept (source s) | Says | Why |
|---|---|---|
| 0.00–6.51 | "We all have used AI… crazy questions." | hook |
| 11.94–20.70 | "But the models… imagined earlier." | the claim (dropped the personal/math/general list; it became on-screen chips) |
| 22.60–24.65 | "Automation has helped me a lot." | bridge (dropped "out of the loop of just being into the space…") |
| 31.40–34.28 | "Every day at 8 a.m." | automation 1 starts |
| 34.86–40.93 | "ChatGPT accumulates… going in the AI." | dropped "that is an automation" |
| 42.25–46.48 | "Another automation… one component" | dropped the "one design thing… new learning" aside |
| 52.40–73.21 | "It goes to the internet… in Figma itself." | kept as one take: splicing out "into with… OK ChatGPT" broke words |
| 73.21–75.75 | "That is how things are evolving" | takeaway |
| 76.60–79.51 | "that is how we should evolve." | dropped "and", "till the time", the goodbye |

82.1s → 56.76s. Cut points snapped to RMS minima. Joins re-transcribed to check.

## Beat timeline (cut time) and what's on screen (v3)

| t | Beat | Layout content | Pill / SFX |
|---|---|---|---|
| 0.0 | Hook | "3 AI AUTOMATIONS / I USE DAILY", face tile, question chips, `query` figure, red "WE ALL ASK AI" | impact, pops |
| 6.5 | Models | "THE MODELS / OF TODAY", capability chips card, `terrain` figure, face tile | whoosh, ticks |
| 11.0 | Crazy | red "EXTREMELY / CRAZY THINGS", sentence with "not have imagined" underlined | **CRAZY** pill |
| 15.3 | Automation | "AUTOMATION / HELPED ME / A LOT", `slow` figure | whoosh |
| 17.3 | 01 Daily brief | 8AM ring card, ChatGPT notification, 0→24H red cell, ticked summary list, `phosphor` | **08:00** pill, ding |
| 26.3 | 02 Component | toggle that flips on "component", search typing "best toggle interactions", results, Where/How checklist, `exploded` → `loupe` | **LEARN** pill, switch, clicks |
| 39.9 | 03 Brief → designs | client-brief.pdf flies into the ChatGPT input, typed prompt, numbered flow Brief → ChatGPT → Figma | **DESIGN** pill, page-turn |
| 48.9 | Figma | three generated screens + "ChatGPT" cursor, "DONE / IN FIGMA" | pops, shutter |
| 51.3 | Outro | "THINGS ARE / EVOLVING" → "THAT'S HOW / WE SHOULD" + red "EVOLVE.", `terrain` | riser → impact |
| 56.8 | End | red cells stagger in, "FOLLOW FOR MORE / AI WORKFLOWS", FOLLOW pill + "hardik." | whoosh, ding |

## Files here

- `edl.json`: the cut.
- `words.json`: word timings of the cut, hand-fixed (captions + beat timing).
- The composition is `toolkit/src/Reel.tsx` at the commit that added this folder.
