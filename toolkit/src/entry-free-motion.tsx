// Isolated entry: works without any past project's private/generated media.
import {Composition, registerRoot} from 'remotion';
import {FreeMotionDemo} from './free-stack/FreeMotionDemo';

registerRoot(() => <Composition id="FreeMotionKit" component={FreeMotionDemo} width={640} height={360} fps={30} durationInFrames={60} />);
