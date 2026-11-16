// Entry that registers only the Blueprint Cut reels, so it bundles without other projects' generated files.
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {BP_FPS, BP_FRAMES, BP_H, BP_W, BlueprintHinton} from './BlueprintOneTake';
import {BlueprintHintonLandscape, LS_FPS, LS_FRAMES, LS_H, LS_W} from './BlueprintOneTakeLandscape';
registerRoot(() => (
  <>
    <Composition id="BlueprintHinton" component={BlueprintHinton} durationInFrames={BP_FRAMES} fps={BP_FPS} width={BP_W} height={BP_H} defaultProps={{sound: true}} />
    <Composition id="BlueprintHintonLandscape" component={BlueprintHintonLandscape} durationInFrames={LS_FRAMES} fps={LS_FPS} width={LS_W} height={LS_H} defaultProps={{sound: true}} />
  </>
));
