---
artifact_type: specification
work_block_id: WB-2026-09-03-lifecycle-inactive-commit-bypass-correction
status: approved
revision: v1
---

# Specification: Inactive Commit Bypass Correction

## Objective

Close the inactive-state commit bypass in the Codex and Claude runtime adapters:
the adapters must not approve a coordination-only staged set when the requested
Git commit can additionally materialize tracked source content from the working
tree.

## Scope and Exclusions

The scope is limited to the two runtime commit gates, their deterministic
control-plane regression, the Work Block lifecycle artifacts, and Critic Gate
record synchronization. Application roots, dependency manifests, runtime
configuration, deployment state, SEO behaviour, credentials, production data,
and GitHub merge or deployment actions are excluded.

## Requirements

- REQ-001: In canonical inactive state, both runtime adapters must deny a local
  Git commit that uses `-a`/`--all`, `-i`/`--include`, `-o`/`--only`, an
  explicit pathspec, or `--pathspec-from-file` in either split or `=value`
  form, because each can select working-tree content outside the prevalidated
  staged set.
- REQ-001A: Both adapters must identify the commit subcommand after supported
  Git global options, including `-C <directory>` and `-c <name=value>`, and
  must fail closed for unknown global options that precede a direct commit.
  They must also identify direct executable-path, `command`, and `env` forms
  so a prefixed direct invocation cannot skip the commit gate.
- REQ-002: A normal local commit whose staged paths are exclusively canonical
  coordination paths must remain permitted while inactive.
- REQ-003: Source paths staged before the command remain denied while inactive;
  active Work Block branch binding and stale-gate failures remain fail-closed
  for the revised commit path as well as writes.
- REQ-004: The deterministic control-plane regression must cover both adapters,
  all-tracked and pathspec bypass forms, a content-selecting equivalent option,
  and the permitted coordination-only control case.
- REQ-005: `.agent/critic-gate.md` and the successor Work Block evidence must
  identify the current correction and be synchronized at closeout.

## Acceptance Criteria

- AC-001 [req=REQ-001,REQ-001A]: Both adapters deny fixture commands using
  `-a`, `--all`, `-i`/`--include`, `-o`/`--only`, an explicit source pathspec,
  `--pathspec-from-file=<file>`, and a supported Git-global-option prefix while
  canonical inactive state has only coordination content staged; it also denies
  unknown-global, executable-path, `command`, and `env` prefixes.
- AC-002 [req=REQ-002]: Both adapters allow the existing coordination-only
  staged local commit control case.
- AC-003 [req=REQ-003]: Existing inactive source-commit regressions pass and
  both adapters reject a commit from a stale active-branch binding.
- AC-004 [req=REQ-004]: `scripts/test-github-capability-control-plane.py`,
  `scripts/test-release-state-contracts.py`, traceability, and `git diff --check`
  pass.
- AC-005 [req=REQ-005]: Review, Verification, Drift, and closeout evidence are
  complete; no deployment action is taken.
