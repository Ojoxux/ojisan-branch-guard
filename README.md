# 🧔 オヂサンガード

> mainブランチへの直接pushを防ぐオヂサン警告システム（husky プラグイン）

![npm version](https://img.shields.io/npm/v/ojisan-guard)
![license](https://img.shields.io/npm/l/ojisan-guard)

## これは何？

`main`ブランチに直接pushしようとすると、オヂサンが警告してくれる husky プラグインです。

## 必要なもの

- Node.js >= 18
- [husky](https://typicode.github.io/husky/) がセットアップ済みであること

## インストール

```bash
# 1. husky をセットアップ（まだの場合）
pnpm add -D husky
pnpm exec husky init

# 2. ojisan-guard をインストール
pnpm add -D ojisan-guard
pnpm exec ojisan-guard install
```

## 使い方

### オヂサンを配置

```bash
# mainブランチを監視（デフォルト）
npx ojisan-guard install

# 別のブランチを監視
npx ojisan-guard install --branch=master
npx ojisan-guard install --branch=develop
```

### オヂサンを解除

```bash
npx ojisan-guard uninstall
```

## チームで共有

husky の hook は `.husky/` ディレクトリに保存されるので、git で管理できます。

```bash
# オヂサンを配置したら commit
git add .husky/pre-push
git commit -m "feat: オヂサンを配置"
```

これでチーム全員がオヂサンに守られます。

## 対応環境

| OS | 通知方法 |
|---|---|
| macOS | GUIアラート + ターミナル |
| Linux | zenity（あれば）+ ターミナル |
| Windows (Git Bash) | MessageBox + ターミナル |

GUIが使えない環境でも、ターミナルに警告が表示されます。

## どうしてもpushしたい場合

```bash
# オヂサンを一時的に解除
npx ojisan-guard uninstall

# pushする
git push origin main

# オヂサンを再配置
npx ojisan-guard install
```

または、husky をスキップ：

```bash
git push origin main --no-verify
```

## ライセンス

MIT

## 注意

これはジョークプロジェクトですが、実際に動作します。
本番環境でのブランチ保護には、GitHubのBranch Protection Rulesなど、適切なツールを使用してください。

---

🧔 「PRちゃんと出してネ💋」
