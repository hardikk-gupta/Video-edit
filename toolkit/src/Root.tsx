import {Composition} from 'remotion';
import {DVD_FRAMES, DVD_SIZE, DotsVsDuet} from './DotsVsDuet';
import {H, REEL_FRAMES, Reel, W} from './Reel';

export const RemotionRoot = () => (
  <>
    <Composition id="Reel" component={Reel} durationInFrames={REEL_FRAMES} fps={30} width={W} height={H} />
    <Composition id="DotsVsDuet" component={DotsVsDuet} durationInFrames={DVD_FRAMES} fps={30} width={DVD_SIZE} height={DVD_SIZE} />
  </>
);
