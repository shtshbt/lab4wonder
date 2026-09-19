// Usage: node cloudflare/build-static.mjs
// Copies only the reviewed runtime allowlist; never publishes the repository.
import { execFileSync } from 'node:child_process';
import { readFileSync, lstatSync, mkdirSync, rmSync, copyFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist-pages');

function main() {
  const files = JSON.parse(readFileSync(new URL('./runtime_files.json', import.meta.url), 'utf8'));
  if (!Array.isArray(files) || !files.length || new Set(files).size !== files.length) {
    throw new Error('Runtime allowlist must be a nonempty array without duplicates');
  }
  for (const name of files) {
    if (typeof name !== 'string' || !/^[a-z0-9][a-z0-9_.-]*\.(html|js|css|png|jpg|webmanifest)$/.test(name)) {
      throw new Error(`Invalid runtime filename: ${name}`);
    }
    const stat = lstatSync(join(root, name));
    if (!stat.isFile() || !stat.size) throw new Error(`Not a nonempty regular file: ${name}`);
  }
  const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('Expected a full Git commit SHA');
  const source = readFileSync(join(root, 'sw.js'), 'utf8');
  if (!files.includes('sw.js') || !source.includes('const CACHE_NAME = "lab4wonder-__BUILD_ID__";')) {
    throw new Error('Missing service worker cache version template');
  }
  if (existsSync(output) && !lstatSync(output).isDirectory()) {
    throw new Error('Output must be a regular directory, never a symlink');
  }
  rmSync(output, { recursive: true, force: true });
  mkdirSync(output);
  for (const name of files) copyFileSync(join(root, name), join(output, name));
  writeFileSync(join(output, 'sw.js'), source.replaceAll('__BUILD_ID__', sha.slice(0, 12)));
  console.error(`ok: ${files.length} runtime files in dist-pages; BUILD_ID=${sha.slice(0, 12)}`);
}

try {
  main();
} catch (error) {
  console.error(`error: ${error.message}`);
  process.exitCode = 1;
}
