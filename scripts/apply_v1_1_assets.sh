#!/usr/bin/env bash
# Usage: bash scripts/apply_v1_1_assets.sh /path/to/lab4wonder

set -euo pipefail

repo_dir="${1:-}"
if [[ -z "$repo_dir" || ! -d "$repo_dir" ]]; then
  printf 'error: repository directory is required\n' >&2
  exit 2
fi

css_name="lab4wonder_v1_1.css"
js_name="lab4wonder_v1_1.js"
if [[ ! -f "$repo_dir/$css_name" || ! -f "$repo_dir/$js_name" ]]; then
  printf 'error: v1.1 shared assets are missing in %s\n' "$repo_dir" >&2
  exit 3
fi

should_skip() {
  case "$1" in
    index.html|explore.html|kids-index.html|element-sandbox.html|sand.html|paper-plane.html)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

updated=0
while IFS= read -r -d '' html_file; do
  file_name="${html_file##*/}"
  if should_skip "$file_name"; then
    continue
  fi
  if rg -q 'lab4wonder_v1_1\.(?:css|js)' "$html_file"; then
    continue
  fi
  perl -0pi -e \
    's#</head>#<link rel="stylesheet" href="lab4wonder_v1_1.css">\n</head>#i; s#</body>#<script src="lab4wonder_v1_1.js"></script>\n</body>#i' \
    "$html_file"
  updated=$((updated + 1))
done < <(find "$repo_dir" -maxdepth 1 -type f -name '*.html' -print0)

printf 'updated=%d\n' "$updated"
