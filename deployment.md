# GitHub Pages 運用メモ

公開 URL:

- https://shtshbt.github.io/lab4wonder/
- 全アプリ一覧: https://shtshbt.github.io/lab4wonder/explore.html
- こども向け入口: https://shtshbt.github.io/lab4wonder/kids-index.html

## 公開方法

1. runtime ZIP の内容をリポジトリ直下へ展開する。
2. `index.html` と `kids-index.html` があることを確認する。
3. 変更を `main` へ push する。
4. GitHub の `Settings` → `Pages` → `Build and deployment` で Source を
   `GitHub Actions` にする。
5. `Actions` の `Deploy Pages` が成功したら公開 URL を開く。

`main` への push ごとに `.github/workflows/pages.yml` が 184 個の HTML
ファイルを確認してから Pages を更新する。手動再実行も可能。

## ファイル配置

- `index.html`: パスワードゲート付きメイン入口
- `explore.html`: 全アプリ一覧
- `kids-index.html`: こども向け入口
- `*.html`: 自己完結型アプリ
- `art-*.jpg`: 一部アプリの画像素材
- `sw.js`: オフライン用 service worker（全ページと共有アセットを precache）
- `manifest.webmanifest` / `icon-*.png` / `apple-touch-icon.png`: PWA 設定とアイコン
- `R70_RUNTIME_MANIFEST_SHA256.csv`: 配布物の整合性情報

## オフライン対応の仕組み

- 入口 3 ページと `lab4wonder_v1_1.js` が `sw.js` を登録し、初回アクセス時に
  `PRECACHE_URLS` の全ファイルを端末にキャッシュする。
- `sw.js` の `__BUILD_ID__` は deploy 時に `pages.yml` が commit id へ置換する。
  push のたびにキャッシュ名が変わり、次回オンライン時に全ファイルが更新される。
- アプリ HTML を追加・削除したら `sw.js` の `PRECACHE_URLS` も更新する。
  漏れは `scripts/validate_release.sh` の precache チェックが検出する。

## 公開しないもの

ZIP、監査資料、handoff、Dropbox 属性ファイルは `.gitignore` で除外する。
GitHub Pages は公開サイトなので、個人情報、認証情報、家庭内記録、
非公開にしたい写真は commit しない。
