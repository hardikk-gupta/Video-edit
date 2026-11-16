import {useGsapTimeline} from '@remotion/gsap';
import {ThreeCanvas} from '@remotion/three';
import {gsap} from 'gsap';
import {DrawSVGPlugin} from 'gsap/DrawSVGPlugin';
import {MorphSVGPlugin} from 'gsap/MorphSVGPlugin';
import {SplitText} from 'gsap/SplitText';
import {AbsoluteFill, Audio, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {VideoPaper} from './VideoPaper';
import {sfxAt} from './sfx';

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin, SplitText);

const Motion = () => {
  const ref = useGsapTimeline<HTMLDivElement>(({timeline, selector, scope}) => {
    const text = SplitText.create(scope.querySelector('.title')!, {type: 'chars'});
    timeline
      .fromTo(text.chars, {opacity: 0, y: 12}, {opacity: 1, y: 0, stagger: 0.025, duration: 0.25}, 0)
      .fromTo(selector('.line'), {drawSVG: '0%'}, {drawSVG: '100%', duration: 1.2, ease: 'power2.inOut'}, 0)
      .to(selector('.shape'), {morphSVG: 'M110 20 L205 180 L15 180 Z', duration: 1, ease: 'power2.inOut'}, 0.3);
  });
  return (
    <div ref={ref} style={{position: 'absolute', left: 40, top: 32, width: 310, color: '#183a96'}}>
      <div className="title" style={{font: '600 27px sans-serif'}}>Motion, on the frame.</div>
      <svg width={300} height={240} viewBox="0 0 300 240" style={{marginTop: 20}}>
        <path className="line" d="M10 220 H290" fill="none" stroke="#183a96" strokeWidth={2} />
        <path className="shape" d="M20 20 H200 V180 H20 Z" fill="none" stroke="#183a96" strokeWidth={3} />
      </svg>
    </div>
  );
};

export const FreeMotionDemo = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cue = sfxAt('transform-morph', 30, fps);
  return (
    <AbsoluteFill style={{background: '#ebe3db'}}>
      <VideoPaper colorPaper="#ebe3db" colorShadow="#8a8178" seed={7} roughness={0.35} folds={0} style={{position: 'absolute', inset: 0}} />
      <Motion />
      <div style={{position: 'absolute', right: 20, top: 80, width: 250, height: 250}}>
        <ThreeCanvas width={250} height={250} camera={{position: [0, 0, 4], fov: 40}}>
          <mesh rotation={[frame / 90, frame / 60, 0]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color="#183a96" wireframe />
          </mesh>
        </ThreeCanvas>
      </div>
      <Sequence from={cue.from} durationInFrames={cue.durationInFrames}>
        <Audio src={cue.src} volume={0.25} />
      </Sequence>
    </AbsoluteFill>
  );
};
