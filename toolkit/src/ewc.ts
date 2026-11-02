// Standalone entry for EditWithClaude, so it bundles without other projects' local (gitignored) inputs.
//   remotion still src/ewc.ts EditWithClaude out.png --frame=N
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {EditWithClaude, FRAMES, H, W} from './EditWithClaude';

const Root = () => React.createElement(Composition, {id: 'EditWithClaude', component: EditWithClaude, durationInFrames: FRAMES, fps: 30, width: W, height: H});
registerRoot(Root);
