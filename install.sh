#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/aqsajimmy/jimx-ai-toolkit.git"
COMMAND="${1:-install}"

echo "JimX AI Toolkit"
echo "================"
echo

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "ERROR: $2"
    exit 1
  fi
}

require_command node "Node.js 22+ is required. Install from https://nodejs.org/"

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [ "$NODE_MAJOR" -lt 22 ]; then
  echo "ERROR: Node.js 22+ is required. Found: $(node --version)"
  exit 1
fi

# Resolve the repo root. When run from a local checkout, BASH_SOURCE points at
# the real file. When piped via `curl ... | bash`, BASH_SOURCE is "bash" / an
# interactive handle and no local repo exists, so clone into a cache dir first.
SOURCE="${BASH_SOURCE[0]:-}"
ROOT=""
if [ -n "$SOURCE" ] && [ -f "$SOURCE" ]; then
  ROOT="$(cd "$(dirname "$SOURCE")" && pwd)"
fi

if [ -z "$ROOT" ] || [ ! -f "$ROOT/bin/jimx-skills.js" ]; then
  require_command git "Git is required to bootstrap from the remote installer."

  CACHE_BASE="${XDG_CACHE_HOME:-$HOME/.cache}"
  ROOT="$CACHE_BASE/jimx-ai-toolkit"

  if [ -d "$ROOT/.git" ]; then
    echo "Updating cached toolkit at $ROOT"
    git -C "$ROOT" pull --ff-only --quiet
  else
    echo "Cloning toolkit to $ROOT"
    mkdir -p "$(dirname "$ROOT")"
    git clone --depth 1 "$REPO_URL" "$ROOT" --quiet
  fi
fi

node "$ROOT/bin/jimx-skills.js" "$COMMAND"
