# 🧔 ｵﾁﾞｻﾝ😎が、ｷﾐの、ﾌﾞﾗﾝﾁを、守るﾖ💪

> main/masterﾌﾞﾗﾝﾁへの直接commit/pushを防ぐｵﾁﾞｻﾝ警告git hook

## インストール

```bash
curl -fsSL https://raw.githubusercontent.com/Ojoxux/ojisan-branch-guard/main/install.sh | sh
```

以上。

## これは何？

`main`や`master`ﾌﾞﾗﾝﾁに直接commit/pushしようとすると、ｵﾁﾞｻﾝ😎が警告してくれます。

```
⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️

ｱﾚﾚ〜❓💦 ﾁｮｯﾄ、待ってよ〜😅
もしかして、ｷﾐ、「main」ﾌﾞﾗﾝﾁに、そのまま、ﾌﾟｯｼｭしようと、しちゃってるのｶﾅ🤔❓
ｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦

それは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗
壊れちゃったら、ｵﾁﾞｻﾝ😎、悲しくて、泣いちゃうｶﾓ😭💔

ちゃんと、新しい、ﾌﾞﾗﾝﾁを、作って、PR（ﾌﾟﾙﾘｸ）、出してﾈ❣️
ｵﾁﾞｻﾝ😎との、約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)
```

macOSではGUIアラートも表示されます。

## アンインストール

```bash
curl -fsSL https://raw.githubusercontent.com/Ojoxux/ojisan-branch-guard/main/uninstall.sh | sh
```

## 対応環境

| OS | 通知方法 |
|---|---|
| macOS | GUIアラート + ターミナル |
| Linux | zenity（あれば）+ ターミナル |
| Windows (Git Bash) | MessageBox + ターミナル |

## どうしてもpushしたい場合

```bash
git push origin main --no-verify
```

## ライセンス

MIT

---

🧔 「ちゃんと、PR、出してﾈ😘💕」
