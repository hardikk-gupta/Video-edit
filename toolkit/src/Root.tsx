import {CreatorHowExplainer, FRAME_END as HOW_FRAMES, H as HOW_H, W as HOW_W} from './CreatorHowExplainer';
import {GDD_FRAMES as JINN_FRAMES, GDD_H as JINN_H, GDD_W as JINN_W, GrokDotsDuet as JinnHairlineRevision} from './JinnHairlineRevision';
import {Composition} from 'remotion';
import {DVD_FRAMES, DVD_SIZE, DotsVsDuet} from './DotsVsDuet';
import {GDD_FRAMES, GDD_H, GDD_W, GrokDotsDuet} from './GrokDotsDuet';
import {H, REEL_FRAMES, Reel, W} from './Reel';

export const RemotionRoot = () => (
  <>
    <Composition id="CreatorHowExplainer" component={CreatorHowExplainer} durationInFrames={HOW_FRAMES} fps={30} width={HOW_W} height={HOW_H} />
    <Composition id="Reel" component={Reel} durationInFrames={REEL_FRAMES} fps={30} width={W} height={H} />
    <Composition id="DotsVsDuet" component={DotsVsDuet} durationInFrames={DVD_FRAMES} fps={30} width={DVD_SIZE} height={DVD_SIZE} />
    <Composition id="JinnHairlineRevision" component={JinnHairlineRevision} durationInFrames={JINN_FRAMES} fps={30} width={JINN_W} height={JINN_H} />
    <Composition id="GrokDotsDuet" component={GrokDotsDuet} durationInFrames={GDD_FRAMES} fps={30} width={GDD_W} height={GDD_H} />
  </>
);
