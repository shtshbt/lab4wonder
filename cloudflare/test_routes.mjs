// Usage: node --test cloudflare/test_routes.mjs [uses the built dist-pages]
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const root = new URL('../dist-pages/', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
const files = JSON.parse(readFileSync(new URL('./runtime_files.json', import.meta.url)));
const entries = ['index.html', 'explore.html', 'kids-index.html'];
const apps = files.filter(name => name.endsWith('.html') && !entries.includes(name));

test('both catalogs contain exactly the 184 runtime apps', () => {
  for (const name of ['explore.html', 'kids-index.html']) {
    const catalog = [...read(name).matchAll(/"f":"([^"]+\.html)"/g)].map(match => match[1]);
    assert.deepEqual(catalog.sort(), [...apps].sort());
  }
});

test('both runtime dispatchers preserve identity for all 184 apps and roots', () => {
  assert.equal(apps.length, 184);
  for (const name of ['lab4wonder_v1_1.js', 'direct_play_patch.js']) {
    // Execute the actual initialization before the first DOM-dependent section.
    const prefix = read(name).split(/\n  const (?:explorationPages|byId)\b/)[0];
    assert(prefix.includes('const page ='), 'Identity initialization not found');
    const identity = pathname => vm.runInNewContext(`${prefix}\nreturn page; })();`, { location: { pathname } });
    for (const base of ['/', '/lab4wonder/']) {
      assert.equal(identity(base), '', `${name}: ${base}`);
      for (const app of [...apps, ...entries]) {
        assert.equal(identity(base + app), app);
        assert.equal(identity(base + app.slice(0, -5)), app);
      }
    }
    assert.equal(identity('/asset.js'), 'asset.js');
  }
});

function serviceWorker(base, redirected = false) {
  const scope = `https://example.test${base}`;
  const handlers = new Map();
  const cache = new Map();
  let online = false;
  const key = input => {
    const url = new URL(typeof input === 'string' ? input : input.url, scope);
    url.search = '';
    return url.href;
  };
  const storage = {
    addAll: async targets => targets.forEach(target => cache.set(key(target), read(target === './' ? 'index.html' : target))),
    match: async input => {
      if (!cache.has(key(input))) return undefined;
      const response = new Response(cache.get(key(input)), { headers: { 'content-type': 'text/html' } });
      Object.defineProperty(response, 'redirected', { value: redirected });
      return response;
    },
    put: async (input, response) => cache.set(key(input), await response.text()),
  };
  vm.runInNewContext(read('sw.js'), {
    URL, Response,
    self: { location: { origin: 'https://example.test' }, addEventListener: (name, fn) => handlers.set(name, fn),
      skipWaiting: async () => {}, clients: { claim: async () => {} } },
    caches: { open: async () => storage },
    fetch: async request => {
      if (!online) throw new Error('offline');
      const response = new Response(`network:${new URL(request.url).pathname}`);
      Object.defineProperty(response, 'type', { value: 'basic' });
      return response;
    },
  });
  return { cache, key, handlers, setOnline: value => { online = value; }, scope };
}

async function dispatch(worker, path, mode = 'navigate', method = 'GET') {
  let response;
  const pending = [];
  worker.handlers.get('fetch')({
    request: { url: new URL(path, worker.scope).href, method, mode },
    respondWith: value => { response = value; }, waitUntil: value => pending.push(value),
  });
  const result = await response;
  await Promise.all(pending);
  return result;
}

test('redirect-followed precache responses remain usable for browser navigation', async () => {
  const worker = serviceWorker('/', true);
  let installed;
  worker.handlers.get('install')({ waitUntil: promise => { installed = promise; } });
  await installed;
  for (const path of ['ant-colony', 'ant-colony.html']) {
    const response = await dispatch(worker, path);
    assert.equal(response.redirected, false, 'Navigation must not return a redirect-followed cached Response');
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'text/html');
    assert.equal(await response.text(), read('ant-colony.html'));
  }
});

for (const base of ['/', '/lab4wonder/']) {
  test(`cold offline precache resolves all apps at both URL forms under ${base}`, async () => {
    const worker = serviceWorker(base);
    let installed;
    worker.handlers.get('install')({ waitUntil: promise => { installed = promise; } });
    await installed;
    for (const app of [...apps, ...entries]) {
      const extensionless = app.slice(0, -5);
      assert(!worker.cache.has(worker.key(extensionless)), 'Must start without a warmed extensionless key');
      for (const path of [extensionless, app, `${extensionless}?mode=test`, `${app}?mode=test`]) {
        assert.equal(await (await dispatch(worker, path)).text(), read(app), path);
      }
    }
    assert.equal(await (await dispatch(worker, './')).text(), read('index.html'));
    assert.equal(await (await dispatch(worker, 'unknown')).text(), read('index.html'));
    assert.equal((await dispatch(worker, 'unknown', 'cors')).type, 'error');
    assert.equal(await dispatch(worker, 'ant-colony', 'navigate', 'POST'), undefined);
    assert.equal(await dispatch(worker, 'https://example.test.evil/ant-colony'), undefined);
  });

  test(`online requests retain cache-first refresh and network fallback under ${base}`, async () => {
    const worker = serviceWorker(base);
    let installed;
    worker.handlers.get('install')({ waitUntil: promise => { installed = promise; } });
    await installed;
    worker.setOnline(true);
    for (const path of ['ant-colony', 'ant-colony.html']) {
      assert.equal(await (await dispatch(worker, path)).text(), read('ant-colony.html'));
      assert.equal(worker.cache.get(worker.key(path)), `network:${base}${path}`);
    }
    assert.equal(await (await dispatch(worker, 'uncached')).text(), `network:${base}uncached`);
  });
}
