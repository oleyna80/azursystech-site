#!/usr/bin/env bash
# Compatibility adapter: the provider-neutral policy is the sole local Hard Stop parser.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
exec python3 "$ROOT/.agent/hooks/hard_stop_policy.py"
