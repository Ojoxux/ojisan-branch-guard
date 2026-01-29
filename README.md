# 🧔 ｵﾁﾞｻﾝ😎が、ｷﾐの、ﾌﾞﾗﾝﾁを、守るﾖ💪

> main/masterﾌﾞﾗﾝﾁへの直接commit/pushを防ぐｵﾁﾞｻﾝ警告git hook

![npm version](https://img.shields.io/npm/v/ojisan-branch-guard)
![license](https://img.shields.io/npm/l/ojisan-branch-guard)

## これは何？

`main`や`master`ﾌﾞﾗﾝﾁに直接commit/pushしようとすると、ｵﾁﾞｻﾝ😎が警告してくれます。


## インストール

### 方法1: curl（どの環境でも使える）

```bash
curl -fsSL https://raw.githubusercontent.com/Ojoxux/ojisan-branch-guard/main/install.sh | sh
```

Node.js不要。個人利用向け。

### 方法2: npm + husky（チーム共有向け）

```bash
# 1. husky をセットアップ（まだの場合）
npm install -D husky
npx husky init

# 2. ojisan-branch-guard をインストール
npm install -D ojisan-branch-guard
npx ojisan-branch-guard install

# 3. git に追加
git add .husky/pre-commit .husky/pre-push
git commit -m "feat: ｵﾁﾞｻﾝを配置😎"
```

## 使い方

### ｵﾁﾞｻﾝを配置

```bash
# main/masterﾌﾞﾗﾝﾁを自動検出
npx ojisan-branch-guard install

# ﾌﾞﾗﾝﾁを指定
npx ojisan-branch-guard install --branch=develop
```

### ｵﾁﾞｻﾝを解除

```bash
# npm版
npx ojisan-branch-guard uninstall

# curl版
curl -fsSL https://raw.githubusercontent.com/Ojoxux/ojisan-branch-guard/main/uninstall.sh | sh
```

## 対応環境

| OS | 通知方法 |
|---|---|
| macOS | GUIアラート + ターミナル |
| Linux | zenity（あれば）+ ターミナル |
| Windows (Git Bash) | MessageBox + ターミナル |

GUIが使えない環境でも、ターミナルに警告が表示されます。

## どうしてもpushしたい場合

```bash
git push origin main --no-verify
```

または一時的に解除：

```bash
npx ojisan-branch-guard uninstall
git push origin main
npx ojisan-branch-guard install
```

## ライセンス

MIT

## 注意

これはジョークプロジェクトですが、実際に動作します。
本番環境でのブランチ保護には、GitHubのBranch Protection Rulesなど、適切なツールを使用してください。

---

🧔 「ちゃんと、PR、出してﾈ😘💕」
