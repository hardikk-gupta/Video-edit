// Standalone entry for "Editing with Claude", so it bundles without other projects' local (gitignored) inputs.
//   remotion still src/ewc.ts EditWithClaude out.png --frame=N   (v2)   ·   EditWithClaudeV3 (v3)
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {EditWithClaude, FRAMES, H, W} from './EditWithClaude';
import {EditWithClaudeV3} from './EditWithClaudeV3';

const Root = () => React.createElement(React.Fragment, null,
  React.createElement(Composition, {id: 'EditWithClaude', component: EditWithClaude, durationInFrames: FRAMES, fps: 30, width: W, height: H}),
  React.createElement(Composition, {id: 'EditWithClaudeV3', component: EditWithClaudeV3, durationInFrames: FRAMES, fps: 30, width: W, height: H}));
registerRoot(Root);
