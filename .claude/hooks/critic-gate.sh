#!/usr/bin/env bash
# Deprecated compatibility entry point for older Claude Code settings.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
exec python3 "$ROOT/.claude/hooks/work_block_gate.py"
