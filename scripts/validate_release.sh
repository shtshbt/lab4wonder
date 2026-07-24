#!/usr/bin/env bash
# Usage: bash scripts/validate_release.sh /path/to/lab4wonder

set -euo pipefail

repo_dir="${1:-}"
if [[ -z "$repo_dir" || ! -d "$repo_dir" ]]; then
  printf 'error: repository directory is required\n' >&2
  exit 2
fi

failures=0
check_equal() {
  local label="$1"
  local actual="$2"
  local expected="$3"
  if [[ "$actual" != "$expected" ]]; then
    printf 'error: %s: expected %s, got %s\n' "$label" "$expected" "$actual" >&2
    failures=$((failures + 1))
  else
    printf 'ok: %s = %s\n' "$label" "$actual"
  fi
}

app_count=$(find "$repo_dir" -maxdepth 1 -type f -name '*.html' \
  ! -name 'index.html' ! -name 'explore.html' ! -name 'kids-index.html' | wc -l)
check_equal "root app count" "$app_count" "183"

for catalog_name in explore.html kids-index.html; do
  catalog_count=$(rg -o '"f":"[^"]+\.html"' "$repo_dir/$catalog_name" | wc -l)
  check_equal "$catalog_name entries" "$catalog_count" "183"
  drawing_count=$(rg -o '"f":"fourier_drawing\.html"' "$repo_dir/$catalog_name" | wc -l)
  check_equal "$catalog_name hand-drawn Fourier entry" "$drawing_count" "1"
done

asset_count=$(rg -l 'lab4wonder_v1_1\.js' "$repo_dir"/*.html | wc -l)
check_equal "apps using v1.1 behavior" "$asset_count" "180"

if rg -q -F '\n<link rel="stylesheet"' "$repo_dir"/*.html; then
  printf 'error: literal backslash-n remains beside a shared asset tag\n' >&2
  failures=$((failures + 1))
else
  printf 'ok: shared asset tags contain real line breaks\n'
fi

if rg -q "overlay\\(main,'主Canvas'" "$repo_dir"/*.html; then
  printf 'error: child-facing Canvas still contains an internal signature overlay\n' >&2
  failures=$((failures + 1))
else
  printf 'ok: internal Canvas signature overlays removed\n'
fi

atlas_api_count=$(rg -l 'window\.__lwAtlas=' \
  "$repo_dir/abyss.html" "$repo_dir/cave.html" "$repo_dir/constellation-guide.html" \
  "$repo_dir/fossil-formation.html" "$repo_dir/jungle.html" "$repo_dir/tidepool.html" | wc -l)
check_equal "tap-to-collect atlas APIs" "$atlas_api_count" "6"

audit_row_count=$(rg -o '^\| `[^`]+\.html` \|' "$repo_dir/docs/app_quality_audit_v1_1.md" | wc -l)
check_equal "quality audit app rows" "$audit_row_count" "183"

if ! rg -q 'この数字はなに？' "$repo_dir/paper-plane.html"; then
  printf 'error: paper-plane vocabulary guide is missing\n' >&2
  failures=$((failures + 1))
else
  printf 'ok: paper-plane vocabulary guide present\n'
fi

if rg -q '配布 r[0-9]+|r[0-9]+・|個別改修 r[0-9]+' \
  "$repo_dir/element-sandbox.html" "$repo_dir/sand.html" "$repo_dir/paper-plane.html"; then
  printf 'error: visible internal version label remains in protected apps\n' >&2
  failures=$((failures + 1))
else
  printf 'ok: protected app behavior retained with version labels removed\n'
fi

for required_name in fourier.html fourier_drawing.html pillbug-maze.html lab4wonder_v1_1.css lab4wonder_v1_1.js; do
  if [[ ! -s "$repo_dir/$required_name" ]]; then
    printf 'error: required file missing or empty: %s\n' "$required_name" >&2
    failures=$((failures + 1))
  fi
done

node --check "$repo_dir/lab4wonder_v1_1.js"
bash -n "$repo_dir/scripts/apply_v1_1_assets.sh"
bash -n "$repo_dir/scripts/validate_release.sh"
git -C "$repo_dir" diff --check

if ((failures > 0)); then
  printf 'error: release validation failed with %d issue(s)\n' "$failures" >&2
  exit 1
fi
printf 'ok: release validation passed\n'
