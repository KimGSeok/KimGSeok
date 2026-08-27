export const motionDuration = Object.freeze({
  press: 120,
  stateChange: 180,
  enter: 200,
  exit: 140,
  overlay: 240,
  progressLoop: 1200,
  skeletonPulse: 1600,
  reduced: 0,
} as const);

export const motionEasing = Object.freeze({
  linear: 'linear',
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  decelerate: 'cubic-bezier(0, 0, 0, 1)',
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
} as const);

export const motionDistance = Object.freeze({ short: 4, medium: 8, overlay: 16 } as const);

export const motionRecipe = Object.freeze({
  press: { duration: motionDuration.press, easing: motionEasing.standard },
  stateChange: { duration: motionDuration.stateChange, easing: motionEasing.standard },
  enter: { duration: motionDuration.enter, easing: motionEasing.decelerate, distance: motionDistance.short },
  exit: { duration: motionDuration.exit, easing: motionEasing.accelerate, distance: motionDistance.short },
  overlay: { duration: motionDuration.overlay, easing: motionEasing.decelerate, distance: motionDistance.overlay },
  progressLoop: { duration: motionDuration.progressLoop, easing: motionEasing.linear },
  skeletonPulse: { duration: motionDuration.skeletonPulse, easing: motionEasing.standard },
} as const);

export type MotionRecipeName = keyof typeof motionRecipe;

export function resolveMotionRecipe(name: MotionRecipeName, reduced: boolean) {
  const recipe = motionRecipe[name];
  return reduced ? { ...recipe, duration: motionDuration.reduced, distance: 0 } : recipe;
}
