#!/bin/sh
# ojisan-branch-guard uninstaller

set -e

HOOK_MARKER="# ojisan-guard"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ ここは git リポジトリじゃないゾ"
  exit 1
fi

HOOKS_DIR=$(git rev-parse --git-dir)/hooks
removed=0

# Remove pre-commit if it's ojisan-guard
if [ -f "$HOOKS_DIR/pre-commit" ]; then
  if grep -q "$HOOK_MARKER" "$HOOKS_DIR/pre-commit" 2>/dev/null; then
    rm "$HOOKS_DIR/pre-commit"
    removed=1
  fi
fi

# Remove pre-push if it's ojisan-guard
if [ -f "$HOOKS_DIR/pre-push" ]; then
  if grep -q "$HOOK_MARKER" "$HOOKS_DIR/pre-push" 2>/dev/null; then
    rm "$HOOKS_DIR/pre-push"
    removed=1
  fi
fi

if [ $removed -eq 0 ]; then
  echo "🧔 オヂサンはいないゾ"
else
  echo "👋 オヂサンは去りました..."
fi
