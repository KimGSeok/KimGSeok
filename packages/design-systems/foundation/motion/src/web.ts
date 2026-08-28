import { useEffect, useState } from 'react';
import { motionDuration } from './contracts';
export { motionDistance, motionDuration, motionEasing, motionRecipe, resolveMotionRecipe } from './contracts';

export type MotionPresencePhase = 'entering' | 'entered' | 'exiting' | 'exited';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

export function useMotionPresence(open: boolean, reduced: boolean) {
  const [rendered, setRendered] = useState(open);
  const [phase, setPhase] = useState<MotionPresencePhase>(
    open ? (reduced ? 'entered' : 'entering') : 'exited',
  );

  useEffect(() => {
    let frame: number | undefined;
    let timer: number | undefined;

    if (open) {
      if (!rendered) {
        setRendered(true);
        setPhase(reduced ? 'entered' : 'entering');
      } else if (phase === 'exiting' || phase === 'exited') {
        setPhase(reduced ? 'entered' : 'entering');
      } else if (phase === 'entering') {
        if (reduced) setPhase('entered');
        else frame = window.requestAnimationFrame(() => setPhase('entered'));
      }
    } else if (rendered && phase !== 'exiting') {
      if (reduced) {
        setPhase('exited');
        setRendered(false);
      } else setPhase('exiting');
    } else if (rendered && phase === 'exiting') {
      timer = window.setTimeout(() => {
        setPhase('exited');
        setRendered(false);
      }, reduced ? motionDuration.reduced : motionDuration.exit);
    }

    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [open, phase, reduced, rendered]);

  return { phase, rendered } as const;
}
