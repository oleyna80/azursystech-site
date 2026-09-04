---
schema_version: 1
artifact_type: traceable_tasklist
work_block_id: WB-2026-09-04-nice-historical-artifacts-publication
---

# Tasklist — publish Nice historical artifacts

- [x] TASK-001 [type=requirement] [req=REQ-001,REQ-002] [ac=AC-001,AC-002] [paths=21 historical paths] Freeze and verify the exact publication manifest.
- [x] TASK-002 [type=requirement] [req=REQ-003,REQ-004] [ac=AC-003,AC-004] [paths=docs/reports/WB-2026-09-04-nice-historical-artifacts-publication.md] Run secret-safe and repository integrity checks.
- [x] TASK-003 [type=requirement] [req=REQ-005] [ac=AC-005] [paths=all approved paths] Create one docs-only commit and push the publication branch.

## Acceptance criteria

- AC-001 [req=REQ-001]: exact approved paths only;
- AC-002 [req=REQ-002]: all copied hashes match canonical source;
- AC-003 [req=REQ-003]: checks pass without sensitive output;
- AC-004 [req=REQ-004]: no application/canonical mutation;
- AC-005 [req=REQ-005]: one bounded commit is pushed.
