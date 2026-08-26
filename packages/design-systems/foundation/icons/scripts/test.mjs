import { readFile } from 'node:fs/promises';
const paths = await readFile(new URL('../src/paths.ts', import.meta.url), 'utf8');
for (const name of ['add', 'check', 'chevron-right', 'close', 'menu']) if (!paths.includes(name)) throw new Error(`Missing icon ${name}`);
if (!paths.includes("Record<IconName, string[]>")) throw new Error('Icon registry must be exhaustive.');
