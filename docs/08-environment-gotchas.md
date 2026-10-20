# 08 · Environment gotchas (and the fix)

| Problem | Fix |
|---|---|
| Remotion tries to download Chrome; no network for it | Point at the preinstalled shell: `REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell` (read by `remotion.config.ts`). Don't run `playwright install`. |
| `faster-whisper` crashes in `av.open(... metadata_errors=…)` | Decode audio with ffmpeg to 16kHz mono s16 and pass the numpy array (done in `transcribe.py`). |
| Whisper mishears names ("ChatGipT", "T", "figma") | `--prompt "ChatGPT, Figma"` and fix `words.json` by hand. |
| A cut lands inside a word | Snap to RMS minima (`cut.py`), then re-transcribe the joined clip around the cut. Garbled text = broken word. Prefer keeping a longer natural take. |
| GitHub raw font URLs return 403 through the proxy | `npm pack @fontsource/<font>` and copy `files/*.woff2`. |
| Unsplash search/download returns 401 (bot wall) | `WebFetch` the photo page for the `images.unsplash.com` URL. (Only if stock is explicitly allowed. By default it isn't.) |
| Hairline figures render differently every time | Use the vendored patched copy and `HairFig` ([06](06-tools-skills-mcp.md)). |
| Rendered file 200–500MB | Film grain and halftone patterns eat bitrate at CRF 18–19. Master with CRF 24 `-tune film` → ~12MB/60s. |
| `filter: blur()` on a scaled element blurs too much or too little | The filter applies before the transform: divide the blur radius by the scale. |
| Text wraps mid-phrase in two-tone headlines | Render each tone as its own nowrap line, not one wrapping flex row. |
| `Write` refuses: "file modified since read" | `Read` the file (even 3 lines) and write again. |
| GitHub MCP `create_repository` → 403 | The Claude GitHub App lacks repo-creation rights: the person creates the repo and grants the app access, then attach it. |
| Remotion `delayRender` for fonts | Load with `new FontFace(...).load()` at module level and `continueRender` when all resolve. |
| Two `OffthreadVideo`s of the same file double the voice | `muted` on every visual copy; play the voice once via `<Audio>`. |
