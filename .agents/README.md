# Codex Project Adapters

This directory contains Codex-compatible discovery adapters for project skills.

Canonical skill bodies remain in `.agent/skills/**`. Files under
`.agents/skills/**` should stay thin wrappers that point Codex to the canonical
project contract and must not contain secrets, provider settings, or local
machine paths.
