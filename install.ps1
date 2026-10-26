#Requires -Version 5
$ErrorActionPreference = "Stop"

$RepoUrl = "https://github.com/aqsajimmy/jimx-ai-toolkit.git"
$Command = if ($args.Count -gt 0) { $args[0] } else { "install" }

Write-Host "JimX AI Toolkit" -ForegroundColor Cyan
Write-Host "================"

function Require-Command($name, $message) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
        throw $message
    }
}

Require-Command node "Node.js 22+ is required. Install from https://nodejs.org/"

$major = [int](node -p "process.versions.node.split('.')[0]")
if ($major -lt 22) {
    throw "Node.js 22+ is required. Found: $(node --version)"
}

# Resolve the repo root. When run from a local checkout ($PSScriptRoot is set
# and bin/jimx-skills.js exists) use it directly. When piped via
# `irm ... | iex`, $PSScriptRoot is empty, so clone into a cache dir first.
$Root = $PSScriptRoot
$Entry = if ($Root) { Join-Path $Root "bin/jimx-skills.js" } else { $null }

if (-not $Entry -or -not (Test-Path $Entry)) {
    Require-Command git "Git is required to bootstrap from the remote installer."

    $cacheBase = if ($env:XDG_CACHE_HOME) { $env:XDG_CACHE_HOME } else { Join-Path $HOME ".cache" }
    $Root = Join-Path $cacheBase "jimx-ai-toolkit"

    if (Test-Path (Join-Path $Root ".git")) {
        Write-Host "Updating cached toolkit at $Root" -ForegroundColor DarkGray
        git -C $Root pull --ff-only --quiet
    } else {
        Write-Host "Cloning toolkit to $Root" -ForegroundColor DarkGray
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Root) | Out-Null
        git clone --depth 1 $RepoUrl $Root --quiet
    }
    $Entry = Join-Path $Root "bin/jimx-skills.js"
}

node $Entry $Command
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
