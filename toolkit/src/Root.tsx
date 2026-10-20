import {Composition} from 'remotion';
import {H, REEL_FRAMES, Reel, W} from './Reel';

export const RemotionRoot = () => (
  <Composition id="Reel" component={Reel} durationInFrames={REEL_FRAMES} fps={30} width={W} height={H} />
);
