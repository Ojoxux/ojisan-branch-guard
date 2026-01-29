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
    osascript -e 'display alert "⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️" message "ｱﾚｱﾚ〜❓💦 ﾁｮｯﾄ待ってよ〜😅\\nもしかして、ｷﾐ、「${branch}」ﾌﾞﾗﾝﾁに、直接、ｺﾐｯﾄしようと、しちゃってるのｶﾅ🤔❓\\nｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦\\n\\nそれは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗\\n\\nちゃんと、新しい、ﾌﾞﾗﾝﾁを、作ってから、作業してﾈ❣️\\n約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)"' 2>/dev/null
  # Linux with zenity
  elif command -v zenity >/dev/null 2>&1; then
    zenity --warning --title="⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️" --text="ｱﾚｱﾚ〜❓💦 ﾁｮｯﾄ待ってよ〜😅\\nもしかして、ｷﾐ、「${branch}」ﾌﾞﾗﾝﾁに、直接、ｺﾐｯﾄしようと、しちゃってるのｶﾅ🤔❓\\nｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦\\n\\nそれは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗\\n\\nちゃんと、新しい、ﾌﾞﾗﾝﾁを、作ってから、作業してﾈ❣️\\n約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)" 2>/dev/null
  # Windows (Git Bash / WSL)
  elif command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -Command 'Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show("ｱﾚｱﾚ〜❓💦 ﾁｮｯﾄ待ってよ〜😅" + [char]10 + "もしかして、ｷﾐ、「${branch}」ﾌﾞﾗﾝﾁに、直接、ｺﾐｯﾄしようと、しちゃってるのｶﾅ🤔❓" + [char]10 + "ｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦" + [char]10 + [char]10 + "それは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗" + [char]10 + [char]10 + "ちゃんと、新しい、ﾌﾞﾗﾝﾁを、作ってから、作業してﾈ❣️" + [char]10 + "約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)", "⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️", "OK", "Warning")' 2>/dev/null
  fi

  # Terminal fallback (always show)
  echo ""
  echo "⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️"
  echo ""
  echo "ｱﾚｱﾚ〜❓💦 ﾁｮｯﾄ待ってよ〜😅"
  echo "もしかして、ｷﾐ、「${branch}」ﾌﾞﾗﾝﾁに、直接、ｺﾐｯﾄしようと、しちゃってるのｶﾅ🤔❓"
  echo "ｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦"
  echo ""
  echo "それは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗"
  echo ""
  echo "ちゃんと、新しい、ﾌﾞﾗﾝﾁを、作ってから、作業してﾈ❣️"
  echo "約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)"
  echo ""

  exit 1
fi
`;

const getPrePushScript = (branch: string): string => `${HOOK_MARKER}

current_branch=$(git symbolic-ref --short HEAD 2>/dev/null)

if [ "$current_branch" = "${branch}" ]; then
  # macOS
  if command -v osascript >/dev/null 2>&1; then
    osascript -e 'display alert "⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️" message "ｱﾚﾚ〜❓💦 ﾁｮｯﾄ、待ってよ〜😅\\nもしかして、ｷﾐ、「${branch}」ﾌﾞﾗﾝﾁに、そのまま、ﾌﾟｯｼｭしようと、しちゃってるのｶﾅ🤔❓\\nｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦\\n\\nそれは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗\\n壊れちゃったら、ｵﾁﾞｻﾝ😎、悲しくて、泣いちゃうｶﾓ😭💔\\n\\nちゃんと、新しい、ﾌﾞﾗﾝﾁを、作って、PR（ﾌﾟﾙﾘｸ）、出してﾈ❣️\\nｵﾁﾞｻﾝ😎との、約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)"' 2>/dev/null
  # Linux with zenity
  elif command -v zenity >/dev/null 2>&1; then
    zenity --warning --title="⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️" --text="ｱﾚﾚ〜❓💦 ﾁｮｯﾄ、待ってよ〜😅\\nもしかして、ｷﾐ、「${branch}」ﾌﾞﾗﾝﾁに、そのまま、ﾌﾟｯｼｭしようと、しちゃってるのｶﾅ🤔❓\\nｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦\\n\\nそれは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗\\n壊れちゃったら、ｵﾁﾞｻﾝ😎、悲しくて、泣いちゃうｶﾓ😭💔\\n\\nちゃんと、新しい、ﾌﾞﾗﾝﾁを、作って、PR（ﾌﾟﾙﾘｸ）、出してﾈ❣️\\nｵﾁﾞｻﾝ😎との、約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)" 2>/dev/null
  # Windows (Git Bash / WSL)
  elif command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -Command 'Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show("ｱﾚﾚ〜❓💦 ﾁｮｯﾄ、待ってよ〜😅" + [char]10 + "もしかして、ｷﾐ、「${branch}」ﾌﾞﾗﾝﾁに、そのまま、ﾌﾟｯｼｭしようと、しちゃってるのｶﾅ🤔❓" + [char]10 + "ｵﾁﾞｻﾝ😎、ﾋﾞｯｸﾘしちゃったﾖ💦" + [char]10 + [char]10 + "それは、ﾁｮｯﾄ、ﾀﾞﾒだゾ〜🙅❌❗" + [char]10 + "壊れちゃったら、ｵﾁﾞｻﾝ😎、悲しくて、泣いちゃうｶﾓ😭💔" + [char]10 + [char]10 + "ちゃんと、新しい、ﾌﾞﾗﾝﾁを、作って、PR（ﾌﾟﾙﾘｸ）、出してﾈ❣️" + [char]10 + "ｵﾁﾞｻﾝ😎との、約束ﾀﾞﾖ😘💕 ﾅﾝﾁｬｯﾃ😂(笑)", "⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️", "OK", "Warning")' 2>/dev/null
  fi

  # Terminal fallback (always show)
  echo ""
  echo "⚠️ ｵﾁﾞｻﾝ😎からの、警告⚠️"
  echo ""
  echo "ｱﾚﾚ〜❓💦 ﾁｮｯﾄ、待ってよ〜😅"
  echo "もしかして、ｷﾐ、「${branch}」ﾌﾞﾗﾝﾁに、そのまま、ﾌﾟｯｼｭしようと、しちゃってるのｶﾅ🤔❓"
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
`;

const getProjectRoot = (): string => {
  try {
    return execSync("git rev-parse --show-toplevel", { encoding: "utf-8" }).trim();
  } catch {
    return process.cwd();
  }
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
🧔 ojisan-guard - mainブランチへの直接pushを防ぐオヂサン

使い方:
  npx ojisan-guard install [--branch=main]   オヂサンを配置
  npx ojisan-guard uninstall                 オヂサンを解除

オプション:
  --branch=<name>   監視するブランチ名 (デフォルト: main)
  --help, -h        このヘルプを表示

例:
  npx ojisan-guard install
  npx ojisan-guard install --branch=master
  npx ojisan-guard uninstall
`);
};

// Parse arguments
const args = process.argv.slice(2);
const command = args[0];

// Parse --branch option
let branch = "main";
for (const arg of args) {
  if (arg.startsWith("--branch=")) {
    branch = arg.split("=")[1];
  }
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
