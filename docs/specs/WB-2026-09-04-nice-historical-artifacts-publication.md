---
schema_version: 1
artifact_type: specification
work_block_id: WB-2026-09-04-nice-historical-artifacts-publication
status: approved
revision: v1
governance_profile: Managed
---

# Specification — publish Nice historical artifacts

## Objective

Publish the exact 21 historical lifecycle artifacts identified in the valuation
WB, together with its valuation evidence, as a docs-only change from
`origin/main`. Preserve the canonical Nice worktree and do not delete or alter
the source artifacts.

## Requirements

- REQ-001: stage only the exact 21 historical paths, the completed valuation
  Work Block's eight evidence documents, and this publication Work Block's
  specification, plan, tasklist, and reports;
- REQ-002: preserve byte identity of the 21 copied source artifacts, including
  the authorization/signature pair;
- REQ-003: run secret-safe and repository contract checks without printing
  sensitive values;
- REQ-004: do not modify application code, production, canonical Nice state,
  branches other than this publication branch, or live data;
- REQ-005: commit and push only this bounded docs-only publication after checks.

## Acceptance criteria

- AC-001 [req=REQ-001]: staged paths are exactly the approved 21 plus the
  publication evidence files;
- AC-002 [req=REQ-002]: source/copy SHA-256 manifests match;
- AC-003 [req=REQ-003]: JSON parses, diff check and release-state checks pass,
  and no secret value is reproduced;
- AC-004 [req=REQ-004]: no application or canonical worktree path changes;
- AC-005 [req=REQ-005]: one bounded commit is pushed to the publication branch.
