import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { motionDuration, motionRecipe, resolveMotionRecipe } from '../src/contracts.ts';
import { normalizeStableLoadingOptions } from '../src/loading.ts';

assert.equal(motionDuration.skeletonPulse, 1600);
assert.equal(motionRecipe.overlay.distance, 16);
assert.deepEqual(resolveMotionRecipe('overlay', true), { ...motionRecipe.overlay, duration: 0, distance: 0 });
assert.deepEqual(normalizeStableLoadingOptions({ delayMs: -1, minimumVisibleMs: Number.NaN }), { delayMs: 0, minimumVisibleMs: 400 });
const [web, native] = await Promise.all([
  readFile(new URL('../src/web.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/native.ts', import.meta.url), 'utf8'),
]);
assert.match(web, /prefers-reduced-motion: reduce/);
assert.match(web, /addEventListener\('change'/);
assert.match(web, /function useMotionPresence/);
assert.match(web, /motionDuration\.exit/);
assert.match(web, /cancelAnimationFrame/);
assert.match(native, /isReduceMotionEnabled/);
assert.match(native, /reduceMotionChanged/);
console.log('Motion contracts passed');
