import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir } from 'node:fs/promises';
import { createServer } from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = dirname(fileURLToPath(import.meta.url));
const port = await new Promise((resolvePort, reject) => {
  const probe = createServer();
  probe.once('error', reject);
  probe.listen(0, '127.0.0.1', () => {
    const address = probe.address();
    if (!address || typeof address === 'string') {
      probe.close();
      reject(new Error('Could not allocate a Web specimen port.'));
      return;
    }
    probe.close(() => resolvePort(address.port));
  });
});
const url = `http://127.0.0.1:${port}`;
const server = spawn('pnpm', ['exec', 'vite', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
await Promise.race([
  (async () => { for (let attempt = 0; attempt < 30; attempt += 1) { try { if ((await fetch(url)).ok) return; } catch {} await new Promise((resolve) => setTimeout(resolve, 250)); } throw new Error('Web specimen server did not become ready.'); })(),
  once(server, 'exit').then(([code]) => { throw new Error(`Web specimen server exited before ready (${code}).`); })
]);

try {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(url, { waitUntil: 'networkidle' });
  if (!(await page.locator('main').innerText()).includes('읽기 쉽고, 행동이 분명한 인터페이스')) throw new Error('Web specimen content is missing.');
  const save = page.getByRole('button', { name: '저장하기' }).first();
  await save.click();
  if (await save.getAttribute('aria-busy') !== 'true' || !(await save.isDisabled())) throw new Error('Loading Button must expose busy and disabled state.');
  await page.getByText('변경사항을 저장했어요.').waitFor();
  const disabledSave = page.getByRole('button', { name: '저장하기' }).last();
  if (!(await disabledSave.isDisabled())) throw new Error('Disabled Button is interactive.');
  await page.locator('body').click({ position: { x: 1, y: 1 } });
  await page.keyboard.press('Tab');
  const keyboardOutline = await page.getByRole('button', { name: '다크 모드' }).evaluate((node) => getComputedStyle(node).outlineStyle);
  if (keyboardOutline !== 'solid') throw new Error(`Keyboard focus ring is missing: ${keyboardOutline}`);
  await page.getByRole('button', { name: '다크 모드' }).click();
  if (await page.locator('html[data-theme="dark"]').count() !== 1) throw new Error('Theme toggle did not activate the document theme root.');
  const darkCanvas = await page.locator('body').evaluate((node) => getComputedStyle(node).backgroundColor);
  if (darkCanvas !== 'rgb(25, 31, 40)') throw new Error(`Dark canvas token was not applied: ${darkCanvas}`);
  await mkdir(resolve(root, 'artifacts'), { recursive: true });
  await page.screenshot({ path: resolve(root, 'artifacts/foundation-web-dark.png'), fullPage: true });
  if (errors.length) throw new Error(`Browser console errors: ${errors.join('; ')}`);
  await browser.close();
} finally {
  server.kill('SIGINT');
}
