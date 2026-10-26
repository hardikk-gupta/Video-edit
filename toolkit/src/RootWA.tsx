import {Composition} from 'remotion';
import {PD_FRAMES, PD_H, PD_W, PaperDrawerWA} from './PaperDrawerWA';

export const WaRoot = () => <Composition id="PaperDrawerWA" component={PaperDrawerWA} durationInFrames={PD_FRAMES} fps={30} width={PD_W} height={PD_H} />;
