# Skill Source Provenance Record

Schema and template for a locally maintained external-skill provenance record.
Store metadata and evidence pointers only; never store copied upstream
instructions, credentials, or private tokens. A consumer project normally keeps
this record in `.agent/skill-sources.yml`.

```yaml
schema_version: 1
sources:
  - id: UPSTREAM-SKILL-LIBRARY
    repository: https://github.com/OWNER/REPOSITORY
    upstream_path: skills/SKILL_NAME
    requested_ref: TAG-OR-BRANCH
    resolved_revision: FULL_40_CHARACTER_COMMIT_SHA
    local_skills:
      - LOCAL-SKILL-NAME
    license:
      identifier: TBD_AFTER_LICENSE_REVIEW
      evidence_path: PATH_TO_LICENSE_EVIDENCE
      adaptation_allowed: TBD_AFTER_OWNER_AND_LICENSE_APPROVAL
    first_adopted: YYYY-MM-DD
    last_checked: YYYY-MM-DD
    local_delta: DESCRIBE_INTENTIONAL_LOCAL_DIVERGENCE
    decision: TBD_AFTER_REVIEW
    evidence:
      - PATH_TO_APPROVED_WORK_BLOCK_OR_REPORT
```

Field definitions:

- `requested_ref` is the human-facing tag or branch requested for comparison.
- `resolved_revision` is the full immutable Git commit SHA actually reviewed.
- `adaptation_allowed` is set only after the license review and Owner approval.
- `local_delta` explains intentional divergence that must not be overwritten.
- `decision` is one of `adopted`, `deferred`, `rejected`, or `blocked`.
- `evidence` points to the approved Work Block or review report.
