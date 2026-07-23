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
- `R70_RUNTIME_MANIFEST_SHA256.csv`: 配布物の整合性情報

## 公開しないもの

ZIP、監査資料、handoff、Dropbox 属性ファイルは `.gitignore` で除外する。
GitHub Pages は公開サイトなので、個人情報、認証情報、家庭内記録、
非公開にしたい写真は commit しない。
