#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const ROOT = path.resolve(__dirname, "..");

function run(command, args, options = {}) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  });
  const code = result.status ?? 1;
  // spawnSync sets result.error when the binary itself cannot be launched
  // (e.g. npx/git not on PATH). Surface that instead of a bare non-zero code.
  if (result.error) {
    console.error(`  ! failed to launch ${command}: ${result.error.message}`);
  }
  return code;
}

function npxSkills(args, { fatal = true } = {}) {
  const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
  const code = run(cmd, ["skills@latest", ...args]);
  if (code !== 0 && fatal) process.exit(code);
  return code;
}

// Each target is [label, repo, skills] where skills is:
//   "*"            install every skill in the repo
//   "name"         install a single named skill
//   ["a", "b"]     install several named skills from one repo
const targets = [
  ["Anthropic frontend-design", "https://github.com/anthropics/skills", "frontend-design"],
  ["Taste Skill", "https://github.com/Leonxlnx/taste-skill", "design-taste-frontend"],
  ["Vercel Web Interface Guidelines", "https://github.com/vercel-labs/agent-skills", "web-design-guidelines"],
  ["Playwright", "https://github.com/microsoft/playwright-cli", "*"],
];

// Mobile stack — opt-in via `jimx-skills mobile`. Covers native design rules
// (framework-agnostic), React Native/Expo, and Flutter.
const mobileTargets = [
  ["Platform Design (Apple HIG + Material 3)", "https://github.com/ehmo/platform-design-skills",
    ["ios-design-guidelines", "android-design-guidelines"]],
  ["Vercel React Native", "https://github.com/vercel-labs/agent-skills",
    ["vercel-react-native-skills"]],
  ["Expo (React Native)", "https://github.com/expo/skills",
    ["expo-design-system", "expo-native-ui", "expo-ui", "expo-router", "expo-animation"]],
  ["Flutter", "https://github.com/zakariaf/Flutter-Skills",
    ["adaptive-layout", "design-system-structure", "design-review-workflow",
     "flutter-architecture", "flutter-performance", "accessibility-as-code"]],
];

// Install every target in `list`, best-effort. Returns the labels that failed.
function installTargets(list) {
  const failed = [];
  for (const [label, repo, skills] of list) {
    console.log(`\n=== ${label} ===`);
    const names = skills === "*" ? [null] : [].concat(skills);
    let ok = true;
    for (const name of names) {
      const args = ["add", repo, "-g", "--agent", "*", "-y"];
      if (name) args.push("--skill", name);
      // A single unreachable repo/skill should not abort the whole install.
      if (npxSkills(args, { fatal: false }) !== 0) ok = false;
    }
    if (!ok) failed.push(label);
  }
  return failed;
}

function install() {
  console.log("JimX AI Toolkit — global install");
  console.log("Target: compatible agents discovered by the skills CLI.");
  console.log("This uses upstream skills; no third-party code is vendored.");

  const failed = installTargets(targets);

  // The local JimX skill is the core deliverable — failing to install it is fatal.
  installLocalSkill("jimx-ui");

  reportResult("JimX UI", failed, "install");
}

function mobile() {
  console.log("JimX AI Toolkit — mobile stack (global)");
  console.log("Native design rules (HIG + Material 3), React Native/Expo, and Flutter.");

  const failed = installTargets(mobileTargets);

  // Local JimX mobile anti-slop skill — core deliverable, fatal on failure.
  installLocalSkill("jimx-mobile");

  reportResult("JimX Mobile", failed, "mobile");
}

function reportResult(localLabel, failed, command) {
  if (failed.length) {
    console.log(`\n⚠ ${localLabel} installed, but these upstream skills failed: ${failed.join(", ")}`);
    console.log(`  Re-run 'jimx-skills ${command}' or check network/upstream availability.`);
  } else {
    console.log(`\n✓ ${localLabel} stack installed.`);
  }
  console.log("Restart Claude Code / Codex / VS Code agent sessions.");
}

function installLocalSkill(name) {
  // Install a local JimX skill into the universal .agents location.
  // VS Code and Codex discover this location; the skills CLI can also link
  // it into compatible agent directories.
  const source = path.join(ROOT, "skills", name);
  if (!fs.existsSync(source)) {
    console.error(`Missing local skill: ${source}`);
    process.exit(1);
  }
  npxSkills(["add", source, "-g", "--agent", "*", "-y", "--copy"]);
}

function update() {
  npxSkills(["update", "-g", "-y"]);
  console.log("\n✓ Global skills updated.");
}

function status() {
  npxSkills(["list", "-g"]);
}

function project() {
  // --mobile adds the JimX mobile skill alongside (or instead of) jimx-ui.
  const wantMobile = process.argv.includes("--mobile");
  const wantWeb = !wantMobile || process.argv.includes("--web");
  const locals = [...(wantWeb ? ["jimx-ui"] : []), ...(wantMobile ? ["jimx-mobile"] : [])];

  for (const name of locals) {
    const source = path.join(ROOT, "skills", name);
    console.log(`Installing ${name} skill into the current project...`);
    npxSkills(["add", source, "--agent", "*", "-y", "--copy"]);
  }

  const template = path.join(ROOT, "templates", "DESIGN.md");
  const destination = path.join(process.cwd(), "DESIGN.md");
  if (!fs.existsSync(destination)) {
    fs.copyFileSync(template, destination);
    console.log(`✓ Created ${destination}`);
  } else {
    console.log("• DESIGN.md already exists; leaving it untouched.");
  }

  console.log("\n✓ Project setup complete.");
}

function removeJimx() {
  const home = os.homedir();
  const bases = [".agents", ".claude", ".copilot"];
  const names = ["jimx-ui", "jimx-mobile"];
  for (const base of bases) {
    for (const name of names) {
      const dir = path.join(home, base, "skills", name);
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`✓ Removed ${dir}`);
      }
    }
  }
}

const command = process.argv[2] || "install";
switch (command) {
  case "install":
  case "i":
    install();
    break;
  case "mobile":
  case "m":
    mobile();
    break;
  case "update":
  case "u":
    update();
    break;
  case "status":
  case "list":
    status();
    break;
  case "project":
  case "init":
    project();
    break;
  case "remove-jimx":
    removeJimx();
    break;
  default:
    console.log(`
JimX AI Toolkit

Usage:
  jimx-skills install           Install the web/frontend global stack
  jimx-skills mobile            Install the mobile global stack (HIG, Material 3,
                                React Native/Expo, Flutter) + jimx-mobile
  jimx-skills update            Update global skills
  jimx-skills status            Show installed global skills
  jimx-skills project           Add jimx-ui + DESIGN.md to current project
  jimx-skills project --mobile  Add jimx-mobile (and --web to add both)
  jimx-skills remove-jimx       Remove the local JimX skills (ui + mobile)

One-shot:
  npx skills add <repo> -g --agent '*' -y
`);
}
