#!/usr/bin/env bash
# Claude Code compatibility entry point for the shared provider-neutral policy.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
exec python3 "$ROOT/.agent/hooks/hard_stop_policy.py"
