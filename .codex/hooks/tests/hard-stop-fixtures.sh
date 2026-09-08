#!/usr/bin/env bash
# Compatibility entry point for the provider-neutral capability control-plane suite.
set -euo pipefail
cd "$(dirname "$0")/../../.."
exec env PYTHONDONTWRITEBYTECODE=1 python3 scripts/test-github-capability-control-plane.py
