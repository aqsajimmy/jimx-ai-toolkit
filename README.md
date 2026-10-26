# JimX AI Toolkit

One-command installer for a shared frontend/design skill stack across Claude Code, OpenAI Codex, and VS Code/GitHub Copilot.

## Included

- Anthropic `frontend-design`
- Leonxlnx `design-taste-frontend` (Taste Skill v2)
- Vercel `web-design-guidelines`
- Microsoft Playwright skills
- JimX `jimx-ui` — local anti-AI-slop rules and project design workflow
- Optional `DESIGN.md` project template

The toolkit does **not** copy third-party skills into this repository. The installer pulls them from their upstream repositories using the official `npx skills` CLI, so updates remain manageable.

## Supported platforms

| OS | Installer | Notes |
|----|-----------|-------|
| Windows 10/11 | `install.ps1` (PowerShell 5+ / 7) | CRLF line endings |
| macOS | `install.sh` (bash/zsh) | Intel & Apple Silicon |
| Linux | `install.sh` (bash) | any distro with Node 22+ |
| WSL | `install.sh` | runs as Linux |

Both installers work two ways: from a local clone, or piped from the web
(`irm`/`curl`). When piped, the installer clones the toolkit into a cache dir
(`$XDG_CACHE_HOME`/`~/.cache/jimx-ai-toolkit`) and re-uses it on later runs.

## Requirements

- Node.js 22+
- npm / npx
- Git
- Claude Code, Codex, and/or VS Code/Copilot

The current `skills` CLI supports global installs with `-g` and can target all supported agents. VS Code also discovers personal skills from `~/.copilot/skills`, `~/.claude/skills`, and `~/.agents/skills`.

## Quick start

### Windows PowerShell

```powershell
irm https://raw.githubusercontent.com/aqsajimmy/jimx-ai-toolkit/main/install.ps1 | iex
```

Or after cloning:

```powershell
.\install.ps1
```

### macOS / Linux / WSL

```bash
curl -fsSL https://raw.githubusercontent.com/aqsajimmy/jimx-ai-toolkit/main/install.sh | bash
```

Or:

```bash
./install.sh
```

## Commands

Global install:

```bash
jimx-skills install
```

Update:

```bash
jimx-skills update
```

Check:

```bash
jimx-skills status
```

Project setup:

```bash
jimx-skills project
```

Remove only the JimX local skill:

```bash
jimx-skills remove-jimx
```

## Important

Third-party skills remain upstream-owned. Check their licenses and repositories before redistributing modified copies.

Current upstreams:

- Anthropic frontend-design: https://github.com/anthropics/skills
- Taste Skill: https://github.com/Leonxlnx/taste-skill
- Vercel Agent Skills: https://github.com/vercel-labs/agent-skills
- Playwright: https://github.com/microsoft/playwright-cli

## Why this architecture?

Agent Skills is an open standard. A skill is a directory containing `SKILL.md` plus optional scripts/resources. The same skill can therefore be exposed to multiple compatible agents instead of maintaining three unrelated instruction sets.
