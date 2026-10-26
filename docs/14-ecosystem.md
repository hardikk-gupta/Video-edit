# 14 · What other creators use: tools, repos, and our gaps

Research done 2026-10-26 for Hardik: how other people edit Reels/Shorts with Claude Code or Codex, which
renderers and libraries they use, and what our 29 skills (docs/13) are missing. Star counts are as listed by
[awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills) or search results on
that date. **Nothing here is installed yet**, and no repo below was tested by us unless it says so. Before
installing one, check its licence, last commit and code. Every repo is third-party code.

**How to use this file:** when a video needs something our skills don't cover (an orb, an overlay, a
cut-out, a reframe, a caption style), look it up in the "By need" table, open that repo's README/SKILL.md,
and borrow the method. Record what you used in the project's `instructions.md`.

## 1. What people actually use

| Renderer / approach | Who uses it | Notes for us |
|---|---|---|
| **Remotion** (React → video) | Most Instagram-reel skills: skill-reels-editor, reels-pipeline, remotion-ads, claude-shorts, claude-youtube-editor, faceless-shorts-creator, papercut-explainer | **What we use.** Has official agent skills and built-in effects (glow, noise, light leak). Keep it. |
| **HyperFrames** (HTML + GSAP → video, by HeyGen) | heditor, kinetic-editorial-skill, professional-talking-head-reel, tiktok-ig-shorts, creator-style-kit, and our installed skills' defaults | Most-starred (~60–72k). The awesome-list test found it slow (23.5 min for a 15s brief). Useful when a reference is pure HTML/CSS/GSAP. Not needed to switch. |
| **Plain FFmpeg + Whisper** | ffmpeg-skill (42 tools + MCP), video-editing-skill, video-edit-skill, talking-video-edit, cut-video | Fast cuts, captions, loudness, reframes without a renderer. Good for stage 1–2 (cutting). |
| **NLE bridges (MCP)** | Premiere Pro MCP, After Effects MCP, Palmier Pro | Lets an agent drive a real editor. Not for us: no desktop app in the cloud container. |
| **Agentic all-in-ones** | OpenMontage (12 pipelines, 700+ skill files), hypit (clone a viral video), digitalsamba toolkit | Big method libraries to read for ideas, not to install whole. |
| **Watching first** | watch, claude-video, youtube-watch, SeeCut, smart-video-editor ("watches footage before cutting") | The pattern is spreading: frames + transcript before any edit. We have `watch` installed. |
| **Separate QA pass** | remotion-qa (safe zones, dead air, caption readability), our `reel-review` | Automatic checks before the person sees it. |

## 2. By need: where to look

| Need | Best leads | What to take |
|---|---|---|
| **Remotion best practice** | [remotion-dev/skills](https://github.com/remotion-dev/skills) (official, ~5.7k★; `npx skills add remotion-dev/skills`, installs to `.agents/skills`) | **Install next.** Correct Remotion patterns for animation, media, captions, fonts and rendering. The awesome-list test found its output plain, so take the method, not the look. |
| **Full reel editors to study** | [andrebrito16/skill-reels-editor](https://github.com/andrebrito16/skill-reels-editor) (Remotion 4: silence cuts, grading, rotoscopy, captions, SFX, 2-pass export), [antuzinski/reels-pipeline](https://github.com/antuzinski/reels-pipeline) (talking head → 9:16, phrase captions, CC0 SFX), [kurbaitaev/ghost-editor](https://github.com/kurbaitaev/ghost-editor) (7 styles, face-safe captions, reverse-engineers a reference), [krusemediallc/video-editor-agent](https://github.com/krusemediallc/video-editor-agent) (style-clone a reference reel), [kmilo93sd/agent-video-editor](https://github.com/kmilo93sd/agent-video-editor) (editing judgement + 128 CC0 sounds), [AgriciDaniel/claude-shorts](https://github.com/AgriciDaniel/claude-shorts) (long → short, Remotion captions, segment scoring) | Compare their pipelines with ours stage by stage. Borrow better cut rules, caption timing and reference-cloning steps. |
| **Motion graphics vocabulary** | [Barty-Bart/motion-graphics](https://github.com/Barty-Bart/motion-graphics) (Claude Code + Codex; "a look of its own" in the test), [iart-ai/motion-skills](https://github.com/iart-ai/motion-skills) (50 skills: kinetic type, data viz, explainers), [iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills) (timing, type, colour, composition), [vibe-motion/skills](https://github.com/vibe-motion/skills), [lemomo-ai/lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) (59 film styles as prompt + demo), [iart-ai/kinetic-typography-skills](https://github.com/iart-ai/kinetic-typography-skills) | Style references and timing rules beyond `mg-kit`. lemo-opuscar is the closest to "pick a style by name". |
| **Orbs, glows, gradients, shaders** | Remotion `@remotion/effects`: [glow()](https://www.remotion.dev/docs/effects/glow), noise(), [lightLeak()](https://www.remotion.dev/docs/effects/light-leak) (the old `@remotion/light-leaks` is deprecated); [paper-design/shaders](https://www.mintlify.com/paper-design/shaders) (28 WebGL shaders: mesh gradient and others; React wrapper; pin the version); [GordenSun/react-bits-video](https://github.com/GordenSun/react-bits-video) (React Bits effects + Remotion/HyperFrames) | Orbs and glowing backgrounds: Remotion `glow()` on a canvas, or a Paper mesh gradient seeded by frame. Must be frame-deterministic: drive the shader time from `useCurrentFrame()`, never the wall clock. |
| **Overlays: grain, light leak, film burn, vignette** | [reactvideoeditor/remotion-templates](https://github.com/reactvideoeditor/remotion-templates) (81 free Remotion templates incl. Film Burn and Noise Grain), Remotion `noise()` / `lightLeak()`, [haidrrrry/claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill) (grade + grain + vignette stacks) | Copy the component pattern into `toolkit/src/`. Use overlays sparingly, only when the reference has them. |
| **Background removal (cut-out of the person)** | Video: [MatAnyone](https://github.com/pq-yang/MatAnyone) (CVPR 2025, stable across frames; needs a first-frame mask), Robust Video Matting (RVM). Per-frame: BiRefNet ([video_bg_remover](https://github.com/htansetiawan/video_bg_remover) applies it to video via ffmpeg), rembg (easiest, rougher edges; [video-background-remover-cli](https://github.com/sunwood-ai-labs/video-background-remover-cli)) | **Missing from our skills.** `layered-head-edit` needs a cut-out but doesn't say how. Plan: rembg/BiRefNet for a quick test, MatAnyone/RVM for the final if hair flickers; output ProRes 4444 or a PNG sequence with alpha; check edges on a contact sheet. GPU makes it far faster; on CPU expect slow renders. |
| **Auto-reframe 16:9 → 9:16 (follow the face)** | Google AutoFlip (MediaPipe); DIY: face centre per frame → smoothed 9:16 crop path; [kajisho5/ffmpeg-skill](https://github.com/kajisho5/ffmpeg-skill) includes reframe | **Missing.** `take-geometry` measures the face but doesn't build a moving crop. Smooth the path (the detector is noisy), and keep the whole head in frame (Hardik's rule). |
| **Captions** | Remotion's `@remotion/captions` + official skills; HyperFrames caption styles (35); claude-shorts (animated Remotion captions); [ouerf-man/kinetic-editorial-skill](https://github.com/ouerf-man/kinetic-editorial-skill) (word-by-word kinetic) | Extra caption styles to offer in `caption-align`. |
| **Beat-synced cuts** | [ZiadAbdelkarim/beat-synced-edit](https://github.com/ZiadAbdelkarim/beat-synced-edit), [blixvip/easyedit](https://github.com/blixvip/easyedit) | For `vlog-edit` with music: detect beats, then cut on them. |
| **Lottie / logo animation** | [diffusionstudio/lottie](https://github.com/diffusionstudio/lottie) (~5.6k★), [nolangz/pixel2motion](https://github.com/nolangz/pixel2motion) (raster logo → SVG animation) | Animated logos and icons; Remotion has `@remotion/lottie`. |
| **Paper / collage styles** | [0xS4N4TG/papercut-explainer](https://github.com/0xS4N4TG/papercut-explainer) (9 skills + Remotion library), [pyang5166/gbro-collage-broll](https://github.com/pyang5166/gbro-collage-broll), [YIAN6557/eian-riso-broll](https://github.com/YIAN6557/eian-riso-broll) (risograph) | Concrete builds for `paper-drawer-edit` and collage b-roll. |
| **Sound** | Kenney UI audio (CC0), CC0 packs on itch.io (check each licence), agent-video-editor's 128 CC0 sounds, reels-pipeline's CC0 SFX library, ElevenLabs sound effects (generated) | More *quiet* options than our `tap`/`bloom`, within Hardik's sparse-SFX rule. Freesound/OpenGameArt mix licences: check every file. |
| **QA** | [GroMarketing/remotion-qa](https://github.com/GroMarketing/remotion-qa) | Automatic safe-zone, dead-air and caption-readability checks to run before `reel-review`. |
| **Finding more** | [zhuyansen/awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills) (~340 repos by type, security-graded, 16 tested end to end) | Start here when a new style comes up. |

## 3. What we should work on (priority order)

1. **Install the official Remotion skills** (`remotion-dev/skills`). We render in Remotion but have no Remotion
   skill; the installed skills assume HyperFrames.
2. **Background-removal recipe** for `layered-head-edit`: a script in `toolkit/scripts/` (rembg or BiRefNet
   first, MatAnyone/RVM if edges flicker) plus a doc section with the alpha export and edge check.
3. **Effects kit in the toolkit:** frame-driven orb/glow, mesh-gradient background, grain, light leak and
   vignette components (Remotion effects + Paper shaders), each with a still and a note on when to use it.
4. **Auto-reframe script:** face track → smoothed crop for 16:9 sources delivered as 9:16, always keeping
   the whole head (Hardik's rule).
5. **Reference cloning:** fold ghost-editor's / video-editor-agent's "reverse-engineer a reference" steps into
   `learn-style` + `watch`.
6. **Automatic QA** before `reel-review` (safe zones, dead air, caption size), as in remotion-qa.
7. **A quiet CC0 sound shelf:** a few more soft sounds from licence-checked sources.

## Sources

[awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills) ·
[HyperFrames](https://github.com/heygen-com/hyperframes) · [Remotion agent skills docs](https://www.remotion.dev/docs/ai/skills) ·
[Remotion effects](https://www.remotion.dev/docs/effects) · [Paper Shaders](https://www.mintlify.com/paper-design/shaders) ·
[background-removal landscape (blog)](https://ice-ice-bear.github.io/posts/2026-04-13-matting-libraries/) ·
[MatAnyone paper](https://arxiv.org/html/2501.14677v1) · [Google AutoFlip](https://research.google/blog/autoflip-an-open-source-framework-for-intelligent-video-reframing/) ·
plus each repo linked above.
