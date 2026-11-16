import {staticFile} from 'remotion';
import catalogue from './sfx-catalogue.json';

/** Full free shelf, including semantic tags, suggested use and original mix levels. */
export const freeSfx = catalogue;

/** Align the sound's sync point with a visible event. Negative Sequence starts are intentional. */
export const sfxAt = (id: string, hitFrame: number, fps: number) => {
  const sound = freeSfx.find((entry) => entry.id === id);
  if (!sound) throw new Error(`Unknown free SFX: ${id}`);
  return {
    src: staticFile(`sfx/kit/${sound.file}`),
    from: hitFrame - Math.round(sound.sync * fps),
    durationInFrames: Math.ceil(sound.duration * fps),
    sound,
  };
};
