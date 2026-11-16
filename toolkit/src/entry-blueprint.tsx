// Entry that registers only the Blueprint Cut reel, so it bundles without other projects' generated files.
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {BP_FPS, BP_FRAMES, BP_H, BP_W, BlueprintHinton} from './BlueprintOneTake';
registerRoot(() => <Composition id="BlueprintHinton" component={BlueprintHinton} durationInFrames={BP_FRAMES} fps={BP_FPS} width={BP_W} height={BP_H} defaultProps={{sound: true}} />);
