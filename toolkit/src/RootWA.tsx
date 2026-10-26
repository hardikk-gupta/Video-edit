import {Composition} from 'remotion';
import {PD_FRAMES, PD_H, PD_W, PaperDrawerWA} from './PaperDrawerWA';
import {SM_FRAMES, SM_H, SM_W, SplitMixWA} from './SplitMixWA';

export const WaRoot = () => (
  <>
    <Composition id="PaperDrawerWA" component={PaperDrawerWA} durationInFrames={PD_FRAMES} fps={30} width={PD_W} height={PD_H} />
    <Composition id="SplitMixWA" component={SplitMixWA} durationInFrames={SM_FRAMES} fps={30} width={SM_W} height={SM_H} />
  </>
);
