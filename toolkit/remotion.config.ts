import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setConcurrency(4);
// In Claude Code cloud containers Chromium is preinstalled; elsewhere leave REMOTION_BROWSER unset
// and Remotion downloads its own headless shell.
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
