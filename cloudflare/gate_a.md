# Cloudflare runtime artifact: Gate A STOP

Session: `20260919_cloudflare_gate_a`.
Base: `1d991c60d3cbaa55b75db5acb9fcdbde864d3350` (remote main).
Branch: `feat/cloudflare_runtime_artifact`.
Worktree: `/tmp/lab4wonder_cloudflare_gate_a`.
Write scope: this dedicated worktree only. Existing local main and the aborted
LongRun worktree are preserved. Fresh preflight found no open PR and no dirty
tracked/untracked files in the original worktree.

## Reproduce

```bash
bash scripts/validate_release.sh "$PWD"
node cloudflare/build-static.mjs
node cloudflare/validate_artifact.mjs
node --check cloudflare/build-static.mjs
node --check cloudflare/validate_artifact.mjs
git diff --check
```

Run source validation first. Its failure remains a failure even when independent
artifact checks pass. PR CI preserves that distinction and has no deploy job,
credentials, or Cloudflare connection. CI itself has not run remotely because
Gate A has not passed and no PR has been created.

## Artifact contract

The build requires Node and a Git checkout. It copies the exact reviewed
`runtime_files.json` list to `dist-pages`, replacing any previous output.
No glob or repository-directory copy determines publication scope. Additions
require deliberate allowlist review. Symlinks and empty files are rejected.
The only byte transformation is stamping every `__BUILD_ID__` in the copied
service worker with the first 12 characters of `git rev-parse HEAD`, matching
the existing GitHub Pages cache name convention. Source stamping never occurs.

Artifact: 201 files (187 HTML, 3 JS, 1 CSS, 3 PNG, 6 JPG, 1 webmanifest).
All 201 precache URLs resolve locally (the root URL and `index.html` refer to
the same file). All runtime files except the service worker are precached.
Manifest start URL and icons resolve. All 1,051 inline scripts and standalone
runtime JS pass syntax checks. Rebuilding yields identical names and bytes.

The exact file-set check excludes `.git`, `.github`, `.agents`, `.codex`,
`docs`, `scripts`, `tests`, `cloudflare`, internal Markdown/planning material,
CSV audit manifests, archives, filesystem metadata, and any unexpected file.
`dist-pages` is ignored by Git. `.github/workflows/pages.yml` remains unchanged
and remains the deploy authority.

## Existing source failures and bounded repair

The unmodified base failed `scripts/validate_release.sh` with five issues:

| Check | Expected | Base actual | This branch |
| --- | --- | --- | --- |
| Root apps | 183 | 184 | 184 (FAIL) |
| Adult catalog entries | 183 | 184 | 184 (FAIL) |
| Kids catalog entries | 183 | 184 | 184 (FAIL) |
| Apps using shared v1.1 JS | 183 | 182 | 182 (FAIL) |
| Precache gaps | 0 | 1 | 0 (PASS) |

The missing precache entry was `honeybee-colony.html`; this branch adds it.
`honeybee-colony.html` and `pillbug-maze.html` do not load the shared JS.
The quality audit remains a historical 183-row table and passes its existing
check. No source acceptance count or validator has been changed. Adding shared
behavior to applications requires behavior review; changing the expected count
to 182 merely to pass migration is not acceptable.

## URL compatibility remains unresolved

Cloudflare Pages redirects `.html` URLs to extensionless routes. Current
`lab4wonder_v1_1.js` uses the literal last pathname component to select
`.html`-keyed application behavior. Extensionless navigation can therefore skip
page-specific behavior. Offline cache keys also remain `.html`-based. Local
file resolution and byte parity do not establish online/offline compatibility
under those redirects. No runtime normalization or provider routing rule has
been introduced or tested here.

Before declaring Gate A PASS, resolve the source acceptance inconsistencies and
the extensionless route behavior with bounded regression evidence. Then rerun
the gates and create a PR, without merging it.

## Gate B handoff (not executed)

Only after Gate A and human review: Cloudflare Git integration would use no
framework preset, repository root, build command
`node cloudflare/build-static.mjs`, and output directory `dist-pages`.
Never select the repository root as the publish output. Human integration and
preview testing must check navigation, application-specific behavior, service
worker installation/update, and offline reload for both canonical and `.html`
URLs. No project, privacy change, GitHub Pages shutdown, or merge is authorized
by this artifact preparation.

References:
- [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Serving Pages and HTML redirects](https://developers.cloudflare.com/pages/configuration/serving-pages/)
