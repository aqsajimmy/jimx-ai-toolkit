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

const targets = [
  ["Anthropic frontend-design", "https://github.com/anthropics/skills", "frontend-design"],
  ["Taste Skill", "https://github.com/Leonxlnx/taste-skill", "design-taste-frontend"],
  ["Vercel Web Interface Guidelines", "https://github.com/vercel-labs/agent-skills", "web-design-guidelines"],
  ["Playwright", "https://github.com/microsoft/playwright-cli", "*"],
];

function install() {
  console.log("JimX AI Toolkit — global install");
  console.log("Target: compatible agents discovered by the skills CLI.");
  console.log("This uses upstream skills; no third-party code is vendored.");

  const failed = [];
  for (const [label, repo, skill] of targets) {
    console.log(`\n=== ${label} ===`);
    const args = ["add", repo, "-g", "--agent", "*", "-y"];
    if (skill !== "*") args.push("--skill", skill);
    // Upstream skills are best-effort: a single unreachable repo should not
    // abort the whole install. Collect failures and report them at the end.
    if (npxSkills(args, { fatal: false }) !== 0) failed.push(label);
  }

  // The local JimX skill is the core deliverable — failing to install it is fatal.
  installJimxSkill();

  if (failed.length) {
    console.log(`\n⚠ JimX UI installed, but these upstream skills failed: ${failed.join(", ")}`);
    console.log("  Re-run 'jimx-skills install' or check network/upstream availability.");
  } else {
    console.log("\n✓ JimX AI Toolkit installed.");
  }
  console.log("Restart Claude Code / Codex / VS Code agent sessions.");
}

function installJimxSkill() {
  // Install our own skill into the universal .agents location first.
  // VS Code and Codex discover this location; the skills CLI can also link
  // it into compatible agent directories.
  const source = path.join(ROOT, "skills", "jimx-ui");
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
  const source = path.join(ROOT, "skills", "jimx-ui");
  console.log("Installing JimX UI skill into the current project...");
  npxSkills(["add", source, "--agent", "*", "-y", "--copy"]);

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
  const dirs = [
    path.join(home, ".agents", "skills", "jimx-ui"),
    path.join(home, ".claude", "skills", "jimx-ui"),
    path.join(home, ".copilot", "skills", "jimx-ui"),
  ];
  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✓ Removed ${dir}`);
    }
  }
}

const command = process.argv[2] || "install";
switch (command) {
  case "install":
  case "i":
    install();
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
  jimx-skills install       Install the complete global stack
  jimx-skills update        Update global skills
  jimx-skills status        Show installed global skills
  jimx-skills project       Add JimX skill + DESIGN.md to current project
  jimx-skills remove-jimx   Remove only JimX UI skill

One-shot:
  npx skills add <repo> -g --agent '*' -y
`);
}
