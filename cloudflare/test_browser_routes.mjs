// Usage: node cloudflare/test_browser_routes.mjs (requires Playwright + Chromium)
// PLAYWRIGHT_MODULE may point to an existing Playwright installation.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { once } from 'node:events';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = new URL('../dist-pages/', import.meta.url);
const files = JSON.parse(readFileSync(new URL('./runtime_files.json', import.meta.url)));
const read = name => readFileSync(new URL(name, root));
const mime = { html: 'text/html', js: 'text/javascript', css: 'text/css', png: 'image/png', jpg: 'image/jpeg', webmanifest: 'application/manifest+json' };
const examples = ['ant-colony.html', 'solubility.html', 'resonance.html', 'honeybee-colony.html', 'pillbug-maze.html'];
let base = '/';
let redirectHtml = true;

const server = createServer((request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    if (!url.pathname.startsWith(base)) { response.writeHead(404).end(); return; }
    let name = url.pathname.slice(base.length);
    if (redirectHtml && name.endsWith('.html')) {
      response.writeHead(308, { location: base + name.slice(0, -5) + url.search }).end();
      return;
    }
    name = name || 'index.html';
    if (!name.includes('.')) name += '.html';
    if (!files.includes(name)) { response.writeHead(404).end(); return; }
    response.writeHead(200, { 'content-type': mime[name.split('.').pop()], 'cache-control': 'no-store' });
    response.end(read(name));
  } catch (error) {
    console.error(error);
    response.writeHead(500).end();
  }
});

async function checkOnline(browser, origin) {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  try {
    const page = await context.newPage();
    for (const path of ['ant-colony', 'ant-colony.html']) {
      const response = await page.goto(origin + base + path);
      assert((await response.body()).equals(read('ant-colony.html')));
      assert.equal(new URL(page.url()).pathname, base + (redirectHtml ? 'ant-colony' : path));
      await page.waitForFunction(() => document.querySelector('.lw-meaning')?.textContent.includes('黄：餌を運ぶアリ'));
    }
    const response = await page.goto(origin + base);
    assert((await response.body()).equals(read('index.html')));
    console.error(`ok: browser online redirects, ant-specific legend and root at ${base}`);
  } finally {
    await context.close();
  }
}

async function checkOffline(browser, origin) {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto(origin + base);
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    const keys = await page.evaluate(async () => {
      const cache = await caches.open((await caches.keys())[0]);
      return (await cache.keys()).map(request => new URL(request.url).pathname);
    });
    assert.equal(keys.length, 201, 'Full precache must install, including redirected responses');
    for (const app of examples) {
      assert(keys.includes(base + app));
      assert(!keys.includes(base + app.slice(0, -5)), 'Extensionless key must be cold');
    }
    await context.setOffline(true);
    for (const app of examples) {
      for (const path of [app.slice(0, -5), app, app.slice(0, -5) + '?offline=1']) {
        const response = await page.goto(origin + base + path, { waitUntil: 'domcontentloaded' });
        assert(response.fromServiceWorker(), `Expected offline service worker response: ${path}`);
        assert((await response.body()).equals(read(app)), `Wrong offline document: ${path}`);
      }
    }
    const response = await page.goto(origin + base);
    assert(response.fromServiceWorker());
    assert((await response.body()).equals(read('index.html')));
    console.error(`ok: browser cold offline extensionless/canonical/query navigation for ${examples.length} apps and root at ${base}`);
  } finally {
    await context.close();
  }
}

let browser;
try {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true });
  for (const config of [{ base: '/', redirectHtml: true }, { base: '/lab4wonder/', redirectHtml: false }]) {
    ({ base, redirectHtml } = config);
    await checkOnline(browser, origin);
    await checkOffline(browser, origin);
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  server.close();
}
