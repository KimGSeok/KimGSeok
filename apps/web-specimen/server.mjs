import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname);
const files = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/specimen.css': ['specimen.css', 'text/css; charset=utf-8'],
  '/tokens.css': ['../../packages/design-systems/foundation/tokens/dist/css/variables.css', 'text/css; charset=utf-8']
};

createServer(async (request, response) => {
  const entry = files[request.url];
  if (!entry) return response.writeHead(404).end('Not found');
  const file = resolve(root, entry[0]);
  try {
    await stat(file);
    response.writeHead(200, { 'content-type': entry[1] });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end('Run pnpm --filter @kimgseok/design-tokens build first.');
  }
}).listen(4173, () => console.log('Web specimen: http://localhost:4173'));
