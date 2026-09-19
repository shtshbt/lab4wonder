// Usage: node cloudflare/validate_artifact.mjs
// Validates an existing artifact, then rebuilds and compares every byte.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, lstatSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist-pages');
const read = (name) => readFileSync(join(output, name));
const files = JSON.parse(readFileSync(new URL('./runtime_files.json', import.meta.url), 'utf8'));

function resolveTarget(target) {
  assert.equal(typeof target, 'string');
  const name = target === './' ? 'index.html' : target.replace(/^\.\//, '');
  assert(!name.includes('/') && !name.includes('..'), `Unsafe target: ${target}`);
  assert(files.includes(name), `Target outside allowlist: ${target}`);
  assert(lstatSync(join(output, name)).isFile(), `Target is not a regular file: ${target}`);
  assert(read(name).length, `Empty target: ${target}`);
  return name;
}

function validateFiles() {
  assert.deepEqual(readdirSync(output).sort(), [...files].sort(), 'Unexpected or missing artifact material');
  const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  for (const name of files) {
    resolveTarget(name);
    let source = readFileSync(join(root, name));
    if (name === 'sw.js') source = Buffer.from(source.toString().replaceAll('__BUILD_ID__', sha.slice(0, 12)));
    assert(read(name).equals(source), `Artifact differs from source: ${name}`);
    if (name.endsWith('.js')) execFileSync(process.execPath, ['--check', join(output, name)]);
  }
  for (const name of readdirSync(root).filter(name => name.endsWith('.html'))) resolveTarget(name);
  for (const name of ['index.html', 'explore.html', 'kids-index.html', 'manifest.webmanifest',
    'icon-192.png', 'icon-512.png', 'apple-touch-icon.png']) resolveTarget(name);
  assert(read('sw.js').toString().includes(`const CACHE_NAME = "lab4wonder-${sha.slice(0, 12)}";`));
  assert(!read('sw.js').includes(Buffer.from('__BUILD_ID__')));
}

function validatePwa() {
  const sw = read('sw.js').toString();
  const match = sw.match(/const PRECACHE_URLS = (\[[\s\S]*?\]);/);
  assert(match, 'Missing precache array');
  const targets = JSON.parse(match[1].replace(/,\s*\]/, ']'));
  const cached = new Set(targets.map(resolveTarget));
  for (const name of files.filter(name => name !== 'sw.js')) {
    assert(cached.has(name), `Runtime file not precached: ${name}`);
  }
  const manifest = JSON.parse(read('manifest.webmanifest'));
  resolveTarget(manifest.start_url);
  assert.equal(manifest.scope, './');
  assert(manifest.icons.length >= 2);
  for (const icon of manifest.icons) resolveTarget(icon.src);
  console.error(`ok: ${targets.length} precache targets resolve; manifest and icons present`);
}

function main() {
  validateFiles();
  validatePwa();
  execFileSync(process.execPath, [join(root, 'scripts/check_inline_js.js'), output], { stdio: 'inherit' });
  const before = files.map(read);
  execFileSync(process.execPath, [join(root, 'cloudflare/build-static.mjs')], { stdio: 'inherit' });
  validateFiles();
  files.forEach((name, index) => assert(read(name).equals(before[index]), `Nondeterministic rebuild: ${name}`));
  console.error(`ok: ${files.length} files; internal exclusions, source parity, JS syntax and deterministic rebuild passed`);
}

try {
  main();
} catch (error) {
  console.error(`error: ${error.message}`);
  process.exitCode = 1;
}
