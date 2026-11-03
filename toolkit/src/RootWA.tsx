import {Composition} from 'remotion';
import {PD_FRAMES, PD_H, PD_W, PaperDrawerWA} from './PaperDrawerWA';
import {SM_FRAMES, SM_H, SM_W, SplitMixWA} from './SplitMixWA';
import {ClaudeDidV4, V4_FRAMES, V4_H, V4_W} from './ClaudeDidV4';

export const WaRoot = () => (
  <>
    <Composition id="PaperDrawerWA" component={PaperDrawerWA} durationInFrames={PD_FRAMES} fps={30} width={PD_W} height={PD_H} />
    <Composition id="SplitMixWA" component={SplitMixWA} durationInFrames={SM_FRAMES} fps={30} width={SM_W} height={SM_H} />
    <Composition id="ClaudeDidV4" component={ClaudeDidV4} durationInFrames={V4_FRAMES} fps={30} width={V4_W} height={V4_H} />
  </>
);
