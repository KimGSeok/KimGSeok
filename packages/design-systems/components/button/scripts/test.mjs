import { readFile } from 'node:fs/promises';
const web = await readFile(new URL('../src/web-button.tsx', import.meta.url), 'utf8');
const native = await readFile(new URL('../src/native-button.tsx', import.meta.url), 'utf8');
for (const [name, source, required] of [
  ['web', web, ['aria-busy', 'bgDisabled', 'bgHover', 'bgPressed', 'disabled={inactive}']],
  ['native', native, ['accessibilityState', 'Platform.OS', 'disabled={inactive}', 'NativeButtonLoadingIndicator', 'setPending(true)', 'busy: loading || pending']]
]) {
  const missing = required.filter((value) => !source.includes(value));
  if (missing.length) throw new Error(`${name} Button contract missing: ${missing.join(', ')}`);
}
if (!web.includes('onPointerCancel') || !web.includes('motion-duration-press') || !web.includes('<Spinner decorative')) throw new Error('Web Button motion or pointer-cancel contract missing.');
if (!native.includes('useReducedMotion') || !native.includes('<ActivityIndicator accessible={false}')) throw new Error('Native Button busy indicator must preserve contrast and respect reduced motion.');
