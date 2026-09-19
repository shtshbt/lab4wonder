# Cloudflare runtime artifact: Gate A PASS

Session: `20260919_cloudflare_gate_a`.
Base: `1d991c60d3cbaa55b75db5acb9fcdbde864d3350`.
Branch: `feat/cloudflare_runtime_artifact`.
Worktree: `/tmp/lab4wonder_cloudflare_gate_a`.
Resume preflight confirmed clean local/remote head `cb61ffb`, unchanged remote
main, and no open PR. The original main and aborted LongRun worktrees remain
untouched. This record supersedes the initial Gate A STOP.

## Reproduce

Source validation requires Bash, ripgrep, Git and Node. CI explicitly installs
ripgrep rather than assuming it is included in the runner image.

```bash
bash scripts/validate_release.sh "$PWD"
node cloudflare/build-static.mjs
node cloudflare/validate_artifact.mjs
node --test cloudflare/test_routes.mjs
node --check cloudflare/build-static.mjs
node --check cloudflare/validate_artifact.mjs
node --check cloudflare/test_routes.mjs
node --check cloudflare/test_browser_routes.mjs
git diff --check
```

Browser test (Playwright 1.62.1 and its Chromium installed):

```bash
node cloudflare/test_browser_routes.mjs
```

`PLAYWRIGHT_MODULE` may select an existing Playwright `index.mjs` by absolute
path. PR CI installs the pinned dependency and Chromium outside the repository,
then runs the browser test after the source/artifact/Node gates. It has no
deployment credentials or Cloudflare connection.

## Source acceptance correction

| Check | Old expectation | Corrected expectation/result |
| --- | --- | --- |
| Root apps | 183 | 184, PASS |
| Adult catalog entries | 183 | 184, PASS |
| Kids catalog entries | 183 | 184, PASS |
| Shared v1.1 JS users | 183 | 182, PASS |
| Shared JS membership | Count only | Exactly all apps except the two named standalone apps, PASS |
| Precache gaps | 0 | 0, PASS |
| Historical quality audit rows | 183 | 183, PASS |

The unmodified base failed five checks. The initial adapter checkpoint fixed
the honeybee precache gap; the remaining four inconsistencies were pre-existing.

Historical evidence:

- `84c11a9` (2026-07-29) set shared-JS users to 183 for the then-current apps.
- `3e5d4aa` (2026-08-06), **Upgrade pillbug maze with microclimate fields**,
  replaced the pillbug app, retained shared CSS, and explicitly removed its
  shared-JS tag. The replacement owns its navigation, controls, guide and
  initialization. No later commit restored the tag.
- `1f79121` (2026-08-08), **Add Japanese honeybee colony simulation**, added
  honeybee as a standalone inline-script app and exposed it in both catalogs.
  Main continued this implementation through `1d991c6`.
- `52a4edb` immediately raised the Pages workflow HTML count from 186 to 187
  specifically for honeybee: independent evidence of 184 apps plus three entry
  pages. The source validator was not updated alongside it.
- The audit's closing paragraph explicitly retains its 183-row table as the
  historical baseline used to select improvements. Its last updates predate
  honeybee. An introductory clarification now states this scope; no unperformed
  audit result has been invented for the 184th app.

These are corrections against established main history, not removed acceptance
checks. Exact shared-JS membership and catalog identity tests strengthen the
former count-only coverage. Honeybee and pillbug HTML remain byte-identical to
base. The standalone classification follows committed implementations; no
separate design statement explaining the authors' mental intent is assumed.

## Artifact contract

The build requires Node and a Git checkout, copies only the reviewed
`runtime_files.json` list to `dist-pages`, and replaces stale output. Symlinks
and empty source files are rejected. The only build transformation stamps
`__BUILD_ID__` in the copied worker with the first 12 characters of
`git rev-parse HEAD`. Source stamping never occurs; cache naming is unchanged.

Artifact: **201 files** (187 HTML, 3 JS, 1 CSS, 3 PNG, 6 JPG, 1 webmanifest).
The **201 precache URLs** cover 200 runtime files plus the root/index alias.
`sw.js` is delivered as the worker and is not self-precached, preserving the
existing design. Every target resolves and every other runtime file is
precached, including all 184 apps. Manifest start URL/icons resolve.
All 1,051 inline scripts and standalone runtime JS pass syntax checks.
Repeated builds produce identical names and bytes for the same commit/source.

Exact membership excludes `.git`, `.github`, `.agents`, `.codex`, `docs`,
`scripts`, `tests`, `cloudflare`, internal Markdown/planning material, CSV audit
manifests, archives, and filesystem metadata. An injected internal Markdown
file was rejected by validation and removed by rebuilding. Output is ignored.

## Extensionless compatibility

Both `lab4wonder_v1_1.js` and `direct_play_patch.js` map a nonempty final
pathname component without a dot to that component plus `.html`:
`/ant-colony` and `/ant-colony.html` both identify `ant-colony.html`.
An empty component stays empty, preserving `/` and `/lab4wonder/` behavior.
Dotted paths remain unchanged. No app-specific logic is redesigned.

For same-origin GET navigation, the worker first checks the existing request
key. An extensionless miss checks the corresponding absolute `.html` cache
key with the query removed. Existing cache-first refresh, canonical requests,
root behavior and unknown-navigation fallback remain.
A redirect-followed cached Response is reconstructed with identical
body/status/headers for navigation, avoiding the browser's rejection of that
Response for a manual-redirect navigation. No redirect files, Functions or
routing framework are introduced.

## Passed regression evidence

- Seven Node tests execute actual identity initialization and worker handlers.
  Both catalogs match all 184 app filenames. Both dispatchers identify all apps
  and entry pages in both URL forms under `/` and `/lab4wonder/`.
  All app/entry documents resolve cold offline in canonical/extensionless forms,
  with and without queries. Online refresh/network fallback, root, unknown
  paths, non-navigation, non-GET, foreign origin and redirected responses pass.
- Real Chromium uses a local server emulating Cloudflare HTML redirects and
  separately the existing GitHub Pages subpath without redirects.
  Both install all 201 precache keys. Online navigation in both URL forms
  produces the ant-specific `.lw-meaning` UI generated by shared JS.
- In fresh browser contexts with only installation precache (no extensionless
  key warming), the network is disabled. Ant, solubility, resonance, honeybee
  and pillbug return the exact correct document through the worker for
  extensionless, canonical and query-bearing navigation: 30 app navigations
  plus root checks across the two hosting configurations.

Source acceptance, PWA/precache, route compatibility, exclusions, deterministic
rebuild, JS syntax and whitespace gates all PASS.
`.github/workflows/pages.yml` remains byte-identical to base and remains the
deployment authority.

## Gate B handoff (not executed)

Human Cloudflare Git integration would use no framework preset, repository
root, build command `node cloudflare/build-static.mjs`, and output directory
`dist-pages`. Never select the repository root as the publish output.

Local browser evidence does not claim a real Cloudflare deployment. Human
integration still verifies the actual preview origin, service-worker updates,
and online/offline navigation there. No Cloudflare project, merge, repository
privacy change or GitHub Pages shutdown has been performed.

References:
- [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Serving Pages and HTML redirects](https://developers.cloudflare.com/pages/configuration/serving-pages/)
