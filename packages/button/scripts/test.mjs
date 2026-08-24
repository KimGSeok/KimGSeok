import { readFile } from 'node:fs/promises';
const web = await readFile(new URL('../src/web-button.tsx', import.meta.url), 'utf8');
const native = await readFile(new URL('../src/native-button.tsx', import.meta.url), 'utf8');
for (const [name, source, required] of [
  ['web', web, ['aria-busy', 'bgDisabled', 'bgHover', 'bgPressed', 'disabled={inactive}']],
  ['native', native, ['accessibilityState', 'Platform.OS', 'disabled={inactive}', 'ActivityIndicator', 'setPending(true)', 'busy: loading || pending']]
]) {
  const missing = required.filter((value) => !source.includes(value));
  if (missing.length) throw new Error(`${name} Button contract missing: ${missing.join(', ')}`);
}
