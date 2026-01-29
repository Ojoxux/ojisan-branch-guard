#!/bin/sh
# ojisan-branch-guard installer (non-Node.js version)

set -e

HOOK_MARKER="# ojisan-guard"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ ここは、git ﾘﾎﾟｼﾞﾄﾘ、じゃないゾ😅💦"
  exit 1
fi

# Detect default branch
detect_branch() {
  if git show-ref --verify --quiet refs/heads/main 2>/dev/null; then
    echo "main"
  elif git show-ref --verify --quiet refs/heads/master 2>/dev/null; then
    echo "master"
  else
    echo "main"
  fi
}

BRANCH=$(detect_branch)
HOOKS_DIR=$(git rev-parse --git-dir)/hooks

# Create hooks directory if it doesn't exist
mkdir -p "$HOOKS_DIR"

# pre-commit hook
PRE_COMMIT="$HOOKS_DIR/pre-commit"
cat > "$PRE_COMMIT" << 'HOOK'
#!/bin/sh
# ojisan-guard

BRANCH="__BRANCH__"
current_branch=$(git symbolic-ref --short HEAD 2>/dev/null)

if [ "$current_branch" = "$BRANCH" ]; then
  # macOS
  if command -v osascript >/dev/null 2>&1; then
    osascript -e 'display alert "⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️" message "ｱﾚｱﾚ〜❓💦 ﾁｮｯﾄ待ってよ〜😅\nもしかして、ｷﾐ、「'"$BRANCH"'」ﾌﾞﾗﾝﾁに、直接、ｺﾐｯﾄしようと、しちゃってるのｶﾅ🤔❓\nｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦\n\nそれは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗\n\nちゃんと、新しい、ﾌﾞﾗﾝﾁを、作ってから、作業してﾈ❣️\n約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)"' 2>/dev/null
  # Linux with zenity
  elif command -v zenity >/dev/null 2>&1; then
    zenity --warning --title="⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️" --text="ｱﾚｱﾚ〜❓💦 ﾁｮｯﾄ待ってよ〜😅\nもしかして、ｷﾐ、「'"$BRANCH"'」ﾌﾞﾗﾝﾁに、直接、ｺﾐｯﾄしようと、しちゃってるのｶﾅ🤔❓\nｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦\n\nそれは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗\n\nちゃんと、新しい、ﾌﾞﾗﾝﾁを、作ってから、作業してﾈ❣️\n約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)" 2>/dev/null
  # Windows (Git Bash / WSL)
  elif command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -Command 'Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show("ｱﾚｱﾚ〜❓💦 ﾁｮｯﾄ待ってよ〜😅" + [char]10 + "もしかして、ｷﾐ、「'"$BRANCH"'」ﾌﾞﾗﾝﾁに、直接、ｺﾐｯﾄしようと、しちゃってるのｶﾅ🤔❓" + [char]10 + "ｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦" + [char]10 + [char]10 + "それは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗" + [char]10 + [char]10 + "ちゃんと、新しい、ﾌﾞﾗﾝﾁを、作ってから、作業してﾈ❣️" + [char]10 + "約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)", "⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️", "OK", "Warning")' 2>/dev/null
  fi

  echo ""
  echo "⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️"
  echo ""
  echo "ｱﾚｱﾚ〜❓💦 ﾁｮｯﾄ待ってよ〜😅"
  echo "もしかして、ｷﾐ、「$BRANCH」ﾌﾞﾗﾝﾁに、直接、ｺﾐｯﾄしようと、しちゃってるのｶﾅ🤔❓"
  echo "ｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦"
  echo ""
  echo "それは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗"
  echo ""
  echo "ちゃんと、新しい、ﾌﾞﾗﾝﾁを、作ってから、作業してﾈ❣️"
  echo "約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)"
  echo ""

  exit 1
fi
HOOK

# Replace __BRANCH__ placeholder
sed -i.bak "s/__BRANCH__/$BRANCH/g" "$PRE_COMMIT" && rm -f "$PRE_COMMIT.bak"
chmod +x "$PRE_COMMIT"

# pre-push hook
PRE_PUSH="$HOOKS_DIR/pre-push"
cat > "$PRE_PUSH" << 'HOOK'
#!/bin/sh
# ojisan-guard

BRANCH="__BRANCH__"
current_branch=$(git symbolic-ref --short HEAD 2>/dev/null)

if [ "$current_branch" = "$BRANCH" ]; then
  # macOS
  if command -v osascript >/dev/null 2>&1; then
    osascript -e 'display alert "⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️" message "ｱﾚﾚ〜❓💦 ﾁｮｯﾄ、待ってよ〜😅\nもしかして、ｷﾐ、「'"$BRANCH"'」ﾌﾞﾗﾝﾁに、そのまま、ﾌﾟｯｼｭしようと、しちゃってるのｶﾅ🤔❓\nｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦\n\nそれは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗\n壊れちゃったら、ｵﾁﾞｻﾝ😎、悲しくて、泣いちゃうｶﾓ😭💔\n\nちゃんと、新しい、ﾌﾞﾗﾝﾁを、作って、PR（ﾌﾟﾙﾘｸ）、出してﾈ❣️\nｵﾁﾞｻﾝ😎との、約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)"' 2>/dev/null
  # Linux with zenity
  elif command -v zenity >/dev/null 2>&1; then
    zenity --warning --title="⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️" --text="ｱﾚﾚ〜❓💦 ﾁｮｯﾄ、待ってよ〜😅\nもしかして、ｷﾐ、「'"$BRANCH"'」ﾌﾞﾗﾝﾁに、そのまま、ﾌﾟｯｼｭしようと、しちゃってるのｶﾅ🤔❓\nｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦\n\nそれは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗\n壊れちゃったら、ｵﾁﾞｻﾝ😎、悲しくて、泣いちゃうｶﾓ😭💔\n\nちゃんと、新しい、ﾌﾞﾗﾝﾁを、作って、PR（ﾌﾟﾙﾘｸ）、出してﾈ❣️\nｵﾁﾞｻﾝ😎との、約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)" 2>/dev/null
  # Windows (Git Bash / WSL)
  elif command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -Command 'Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show("ｱﾚﾚ〜❓💦 ﾁｮｯﾄ、待ってよ〜😅" + [char]10 + "もしかして、ｷﾐ、「'"$BRANCH"'」ﾌﾞﾗﾝﾁに、そのまま、ﾌﾟｯｼｭしようと、しちゃってるのｶﾅ🤔❓" + [char]10 + "ｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦" + [char]10 + [char]10 + "それは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗" + [char]10 + "壊れちゃったら、ｵﾁﾞｻﾝ😎、悲しくて、泣いちゃうｶﾓ😭💔" + [char]10 + [char]10 + "ちゃんと、新しい、ﾌﾞﾗﾝﾁを、作って、PR（ﾌﾟﾙﾘｸ）、出してﾈ❣️" + [char]10 + "ｵﾁﾞｻﾝ😎との、約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)", "⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️", "OK", "Warning")' 2>/dev/null
  fi

  echo ""
  echo "⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️"
  echo ""
  echo "ｱﾚﾚ〜❓💦 ﾁｮｯﾄ、待ってよ〜😅"
  echo "もしかして、ｷﾐ、「$BRANCH」ﾌﾞﾗﾝﾁに、そのまま、ﾌﾟｯｼｭしようと、しちゃってるのｶﾅ🤔❓"
  echo "ｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦"
  echo ""
  echo "それは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗"
  echo "壊れちゃったら、ｵﾁﾞｻﾝ😎、悲しくて、泣いちゃうｶﾓ😭💔"
  echo ""
  echo "ちゃんと、新しい、ﾌﾞﾗﾝﾁを、作って、PR（ﾌﾟﾙﾘｸ）、出してﾈ❣️"
  echo "ｵﾁﾞｻﾝ😎との、約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)"
  echo ""

  exit 1
fi
HOOK

# Replace __BRANCH__ placeholder
sed -i.bak "s/__BRANCH__/$BRANCH/g" "$PRE_PUSH" && rm -f "$PRE_PUSH.bak"
chmod +x "$PRE_PUSH"

echo "🧔 ｵﾁﾞｻﾝ😎が、$BRANCH を、見張り始めたﾖ❗💪"
echo "   場所: $HOOKS_DIR/pre-commit, $HOOKS_DIR/pre-push"
echo ""
echo "ｷﾐのこと、ｵﾁﾞｻﾝ😎、応援してるからね〜😘💕"
