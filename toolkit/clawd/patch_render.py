"""Patch a working copy's render.mjs (--frames mode) for software GL: render one throwaway warm-up frame per page.
Measured 2026-11-02 (4 CPUs, SwiftShader): a page renders ~5 frames fast, then settles at ~12 s/frame; opening a page
costs ~40-60 s, so recycling pages is slower, and 4 workers in one browser share one GPU process (no speed-up).
Run 1-2 separate processes, each with --workers=1, on disjoint --range spans.
    python3 -I toolkit/clawd/patch_render.py <workdir>/render.mjs"""
import sys
p = sys.argv[1]; s = open(p).read()
old = """    const page = await openPage('#' + w);
    while (next < todo.length) {
      const i = todo[next++]"""
new = """    const page = await openPage('#' + w); await frameOf(page, 0, 'image/jpeg', .5);
    while (next < todo.length) {
      const i = todo[next++]"""
if new not in s:
    assert old in s, 'render.mjs frames loop changed upstream'
    s = s.replace(old, new)
    open(p, 'w').write(s)
print('patched', p)
