#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const HOOK_MARKER = "# ojisan-guard";

const getPrePushScript = (branch: string): string => `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

${HOOK_MARKER}

current_branch=$(git symbolic-ref --short HEAD 2>/dev/null)

if [ "$current_branch" = "${branch}" ]; then
  # macOS
  if command -v osascript >/dev/null 2>&1; then
    osascript -e 'display alert "⚠️ オヂサンからの警告 ⚠️" message "アレレ〜？💦 もしかして \`${branch}\` ブランチにそのままプッシュしようとしちゃってるカナ⁉️😅\\n\\nそれはダメだゾ〜🧑‍🦲🚫\\n壊れちゃったら、オヂサン悲しくて泣いちゃうカモ😭💔\\n\\nちゃんと新しいブランチを作って、PR（プルリク）出してネ❣️\\n約束ダヨ😘💕 ナンチャッテ（笑）"' 2>/dev/null
  # Linux with zenity
  elif command -v zenity >/dev/null 2>&1; then
    zenity --warning --title="⚠️ オヂサンからの警告 ⚠️" --text="アレレ〜？💦 もしかして \`${branch}\` ブランチにそのままプッシュしようとしちゃってるカナ⁉️😅\\n\\nそれはダメだゾ〜🧑‍🦲🚫\\n壊れちゃったら、オヂサン悲しくて泣いちゃうカモ😭💔\\n\\nちゃんと新しいブランチを作って、PR（プルリク）出してネ❣️\\n約束ダヨ😘💕 ナンチャッテ（笑）" 2>/dev/null
  # Windows (Git Bash)
  elif command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('アレレ〜？💦 もしかして \`${branch}\` ブランチにそのままプッシュしようとしちゃってるカナ⁉️😅\`n\`nそれはダメだゾ〜🧑‍🦲🚫\`n壊れちゃったら、オヂサン悲しくて泣いちゃうカモ😭💔\`n\`nちゃんと新しいブランチを作って、PR（プルリク）出してネ❣️\`n約束ダヨ😘💕 ナンチャッテ（笑）', 'オヂサンからの警告', 'OK', 'Warning')" 2>/dev/null
  fi

  # Terminal fallback (always show)
  echo ""
  echo "┌──────────────────────────────────────────────────────┐"
  echo "│           ⚠️  オヂサンからの警告 ⚠️                   │"
  echo "├──────────────────────────────────────────────────────┤"
  echo "│  アレレ〜？💦 もしかして \\\`${branch}\\\` ブランチに       │"
  echo "│  そのままプッシュしようとしちゃってるカナ⁉️😅         │"
  echo "│                                                      │"
  echo "│  それはダメだゾ〜🧑‍🦲🚫                                 │"
  echo "│  壊れちゃったら、オヂサン悲しくて泣いちゃうカモ😭💔   │"
  echo "│                                                      │"
  echo "│  ちゃんと新しいブランチを作って、                     │"
  echo "│  PR（プルリク）出してネ❣️                             │"
  echo "│  約束ダヨ😘💕 ナンチャッテ（笑）                       │"
  echo "└──────────────────────────────────────────────────────┘"
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

const install = (branch: string): void => {
  const huskyDir = getHuskyDir();
  
  if (!huskyDir) {
    console.error("❌ .husky ディレクトリが見つからないゾ");
    console.error("");
    console.error("先に husky をセットアップしてネ:");
    console.error("  npm install -D husky");
    console.error("  npx husky install");
    process.exit(1);
  }

  const hookPath = path.join(huskyDir, "pre-push");

  // Check if hook already exists
  if (fs.existsSync(hookPath)) {
    const existing = fs.readFileSync(hookPath, "utf-8");
    if (existing.includes(HOOK_MARKER)) {
      console.log("🧔 オヂサンは既に見張ってるゾ");
      return;
    }
    // Backup existing hook
    const backupPath = `${hookPath}.backup`;
    fs.copyFileSync(hookPath, backupPath);
    console.log(`📦 既存の pre-push をバックアップしたゾ: ${backupPath}`);
  }

  const script = getPrePushScript(branch);
  fs.writeFileSync(hookPath, script);
  fs.chmodSync(hookPath, 0o755);

  console.log(`🧔 オヂサンが ${branch} を見張り始めました`);
  console.log(`   場所: ${hookPath}`);
  console.log("");
  console.log("💡 このファイルを git に commit してネ！");
};

const uninstall = (): void => {
  const huskyDir = getHuskyDir();
  
  if (!huskyDir) {
    console.error("❌ .husky ディレクトリが見つからないゾ");
    process.exit(1);
  }

  const hookPath = path.join(huskyDir, "pre-push");

  if (!fs.existsSync(hookPath)) {
    console.log("🧔 オヂサンはいないゾ");
    return;
  }

  const existing = fs.readFileSync(hookPath, "utf-8");
  if (!existing.includes(HOOK_MARKER)) {
    console.log("🧔 この pre-push はオヂサンじゃないゾ");
    return;
  }

  fs.unlinkSync(hookPath);

  // Restore backup if exists
  const backupPath = `${hookPath}.backup`;
  if (fs.existsSync(backupPath)) {
    fs.renameSync(backupPath, hookPath);
    console.log("📦 バックアップを復元したゾ");
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
