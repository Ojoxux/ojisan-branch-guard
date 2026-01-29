#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const HOOK_MARKER = "# ojisan-guard";

const getPreCommitScript = (branch: string): string => `${HOOK_MARKER}

current_branch=$(git symbolic-ref --short HEAD 2>/dev/null)

if [ "$current_branch" = "${branch}" ]; then
  # macOS
  if command -v osascript >/dev/null 2>&1; then
    osascript -e 'display alert "⚠️ オヂサンからの警告 ⚠️" message "アレ〜？💦「${branch}」ブランチで直接コミットしようとしてるノ⁉️😅\\n\\nそれはダメだゾ〜🧑‍🦲🚫\\n\\nちゃんと新しいブランチを作ってから作業してネ❣️\\n約束ダヨ😘💕 ナンチャッテ（笑）"' 2>/dev/null
  # Linux with zenity
  elif command -v zenity >/dev/null 2>&1; then
    zenity --warning --title="⚠️ オヂサンからの警告 ⚠️" --text="アレ〜？💦「${branch}」ブランチで直接コミットしようとしてるノ⁉️😅\\n\\nそれはダメだゾ〜🧑‍🦲🚫\\n\\nちゃんと新しいブランチを作ってから作業してネ❣️\\n約束ダヨ😘💕 ナンチャッテ（笑）" 2>/dev/null
  # Windows (Git Bash / WSL)
  elif command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -Command 'Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show("アレ〜？💦「${branch}」ブランチで直接コミットしようとしてるノ⁉️😅" + [char]10 + [char]10 + "それはダメだゾ〜🚫" + [char]10 + [char]10 + "ちゃんと新しいブランチを作ってから作業してネ❣️" + [char]10 + "約束ダヨ😘💕 ナンチャッテ（笑）", "⚠️ オヂサンからの警告 ⚠️", "OK", "Warning")' 2>/dev/null
  fi

  # Terminal fallback (always show)
  echo ""
  echo "⚠️ オヂサンからの警告 ⚠️"
  echo ""
  echo "アレ〜？💦「${branch}」ブランチで直接コミットしようとしてるノ⁉️😅"
  echo ""
  echo "それはダメだゾ〜🧑‍🦲🚫"
  echo "ちゃんと新しいブランチを作ってから作業してネ❣️"
  echo "約束ダヨ😘💕 ナンチャッテ（笑）"
  echo ""

  exit 1
fi
`;

const getPrePushScript = (branch: string): string => `${HOOK_MARKER}

current_branch=$(git symbolic-ref --short HEAD 2>/dev/null)

if [ "$current_branch" = "${branch}" ]; then
  # macOS
  if command -v osascript >/dev/null 2>&1; then
    osascript -e 'display alert "⚠️ オヂサンからの警告 ⚠️" message "アレレ〜？💦 もしかして「${branch}」ブランチにそのままプッシュしようとしちゃってるカナ⁉️😅\\n\\nそれはダメだゾ〜🧑‍🦲🚫\\n壊れちゃったら、オヂサン悲しくて泣いちゃうカモ😭💔\\n\\nちゃんと新しいブランチを作って、PR（プルリク）出してネ❣️\\n約束ダヨ😘💕 ナンチャッテ（笑）"' 2>/dev/null
  # Linux with zenity
  elif command -v zenity >/dev/null 2>&1; then
    zenity --warning --title="⚠️ オヂサンからの警告 ⚠️" --text="アレレ〜？💦 もしかして「${branch}」ブランチにそのままプッシュしようとしちゃってるカナ⁉️😅\\n\\nそれはダメだゾ〜🧑‍🦲🚫\\n壊れちゃったら、オヂサン悲しくて泣いちゃうカモ😭💔\\n\\nちゃんと新しいブランチを作って、PR（プルリク）出してネ❣️\\n約束ダヨ😘💕 ナンチャッテ（笑）" 2>/dev/null
  # Windows (Git Bash / WSL)
  elif command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -Command 'Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show("アレレ〜？💦 もしかして「${branch}」ブランチにそのままプッシュしようとしちゃってるカナ⁉️😅" + [char]10 + [char]10 + "それはダメだゾ〜🚫" + [char]10 + "壊れちゃったら、オヂサン悲しくて泣いちゃうカモ😭💔" + [char]10 + [char]10 + "ちゃんと新しいブランチを作って、PR（プルリク）出してネ❣️" + [char]10 + "約束ダヨ😘💕 ナンチャッテ（笑）", "⚠️ オヂサンからの警告 ⚠️", "OK", "Warning")' 2>/dev/null
  fi

  # Terminal fallback (always show)
  echo ""
  echo "⚠️ オヂサンからの警告 ⚠️"
  echo ""
  echo "アレレ〜？💦 もしかして「${branch}」ブランチにそのままプッシュしようとしちゃってるカナ⁉️😅"
  echo ""
  echo "それはダメだゾ〜🧑‍🦲🚫"
  echo "壊れちゃったら、オヂサン悲しくて泣いちゃうカモ😭💔"
  echo ""
  echo "ちゃんと新しいブランチを作って、PR（プルリク）出してネ❣️"
  echo "約束ダヨ😘💕 ナンチャッテ（笑）"
  echo ""

  exit 1
fi
`;

const getProjectRoot = (): string => {
  try {
    return execSync("git rev-parse --show-toplevel", { encoding: "utf-8" }).trim();
  } catch {
    return process.cwd();
  }
};

const getDefaultBranch = (): string => {
  // 1. Check if main branch exists
  try {
    execSync("git show-ref --verify --quiet refs/heads/main", { encoding: "utf-8" });
    return "main";
  } catch {
    // ignore
  }

  // 2. Check if master branch exists
  try {
    execSync("git show-ref --verify --quiet refs/heads/master", { encoding: "utf-8" });
    return "master";
  } catch {
    // ignore
  }

  // 3. Default to main
  return "main";
};

const getHuskyDir = (): string | null => {
  const projectRoot = getProjectRoot();
  const huskyDir = path.join(projectRoot, ".husky");
  
  if (fs.existsSync(huskyDir)) {
    return huskyDir;
  }
  return null;
};

const installHook = (
  huskyDir: string,
  hookName: string,
  script: string
): boolean => {
  const hookPath = path.join(huskyDir, hookName);

  // Check if hook already exists
  if (fs.existsSync(hookPath)) {
    const existing = fs.readFileSync(hookPath, "utf-8");
    if (existing.includes(HOOK_MARKER)) {
      return false; // Already installed
    }
    // Backup existing hook
    const backupPath = `${hookPath}.backup`;
    fs.copyFileSync(hookPath, backupPath);
    console.log(`📦 既存の ${hookName} をバックアップしたゾ: ${backupPath}`);
  }

  fs.writeFileSync(hookPath, script);
  fs.chmodSync(hookPath, 0o755);
  return true;
};

const install = (branch: string): void => {
  const huskyDir = getHuskyDir();
  
  if (!huskyDir) {
    console.error("❌ .husky ディレクトリが見つからないゾ");
    console.error("");
    console.error("先に husky をセットアップしてネ:");
    console.error("  pnpm add -D husky");
    console.error("  pnpm exec husky init");
    process.exit(1);
  }

  const preCommitInstalled = installHook(
    huskyDir,
    "pre-commit",
    getPreCommitScript(branch)
  );
  const prePushInstalled = installHook(
    huskyDir,
    "pre-push",
    getPrePushScript(branch)
  );

  if (!preCommitInstalled && !prePushInstalled) {
    console.log("🧔 オヂサンは既に見張ってるゾ");
    return;
  }

  console.log(`🧔 オヂサンが ${branch} を見張り始めました`);
  console.log(`   場所: ${huskyDir}/pre-commit, ${huskyDir}/pre-push`);
  console.log("");
  console.log("💡 .husky/ を git に commit してネ！");
};

const uninstallHook = (huskyDir: string, hookName: string): boolean => {
  const hookPath = path.join(huskyDir, hookName);

  if (!fs.existsSync(hookPath)) {
    return false;
  }

  const existing = fs.readFileSync(hookPath, "utf-8");
  if (!existing.includes(HOOK_MARKER)) {
    return false;
  }

  fs.unlinkSync(hookPath);

  // Restore backup if exists
  const backupPath = `${hookPath}.backup`;
  if (fs.existsSync(backupPath)) {
    fs.renameSync(backupPath, hookPath);
    console.log(`📦 ${hookName} のバックアップを復元したゾ`);
  }

  return true;
};

const uninstall = (): void => {
  const huskyDir = getHuskyDir();
  
  if (!huskyDir) {
    console.error("❌ .husky ディレクトリが見つからないゾ");
    process.exit(1);
  }

  const preCommitRemoved = uninstallHook(huskyDir, "pre-commit");
  const prePushRemoved = uninstallHook(huskyDir, "pre-push");

  if (!preCommitRemoved && !prePushRemoved) {
    console.log("🧔 オヂサンはいないゾ");
    return;
  }

  console.log("👋 オヂサンは去りました...");
  console.log("");
  console.log("💡 git commit で変更を反映してネ！");
};

const showHelp = (): void => {
  console.log(`
🧔 ojisan-guard - デフォルトブランチへの直接commit/pushを防ぐオヂサン

使い方:
  npx ojisan-guard install [--branch=<name>]   オヂサンを配置
  npx ojisan-guard uninstall                   オヂサンを解除

オプション:
  --branch=<name>   監視するブランチ名 (省略時: 自動検出)
  --help, -h        このヘルプを表示

例:
  npx ojisan-guard install              # デフォルトブランチを自動検出
  npx ojisan-guard install --branch=develop
  npx ojisan-guard uninstall
`);
};

// Parse arguments
const args = process.argv.slice(2);
const command = args[0];

// Parse --branch option
let branch: string | null = null;
for (const arg of args) {
  if (arg.startsWith("--branch=")) {
    branch = arg.split("=")[1];
  }
}

// Auto-detect if not specified
if (branch === null) {
  branch = getDefaultBranch();
}

switch (command) {
  case "install":
    install(branch);
    break;
  case "uninstall":
    uninstall();
    break;
  case "--help":
  case "-h":
  case undefined:
    showHelp();
    break;
  default:
    console.error(`❌ 知らないコマンドだゾ: ${command}`);
    showHelp();
    process.exit(1);
}
