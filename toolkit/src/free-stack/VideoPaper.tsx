import {PaperTexture, type PaperTextureProps} from '@paper-design/shaders-react';
import type {PaperShaderElement} from '@paper-design/shaders';
import {useLayoutEffect, useRef} from 'react';
import {continueRender, delayRender, useCurrentFrame, useVideoConfig} from 'remotion';

/** Paper's frame unit is milliseconds. Stop its wall clock and wait for the WebGL mount. */
export const VideoPaper = (props: Omit<PaperTextureProps, 'speed' | 'frame' | 'ref'>) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ref = useRef<PaperShaderElement>(null);
  useLayoutEffect(() => {
    const handle = delayRender('Paper shader frame');
    let pending = 0;
    const draw = () => {
      const mount = ref.current?.paperShaderMount;
      if (!mount) {
        pending = requestAnimationFrame(draw);
        return;
      }
      mount.setSpeed(0);
      mount.setFrame((frame / fps) * 1000);
      pending = requestAnimationFrame(() => continueRender(handle));
    };
    draw();
    return () => {
      cancelAnimationFrame(pending);
      continueRender(handle);
    };
  }, [frame, fps]);
  return <PaperTexture {...props} ref={ref} speed={0} frame={(frame / fps) * 1000} />;
};
