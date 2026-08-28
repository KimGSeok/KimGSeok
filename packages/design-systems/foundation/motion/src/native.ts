import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
export { motionDistance, motionDuration, motionEasing, motionRecipe, resolveMotionRecipe } from './contracts';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => { if (mounted) setReduced(value); });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => { mounted = false; subscription.remove(); };
  }, []);
  return reduced;
}
