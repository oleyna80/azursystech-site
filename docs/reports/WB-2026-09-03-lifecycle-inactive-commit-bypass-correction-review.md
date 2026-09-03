---
artifact_type: review_report
work_block_id: WB-2026-09-03-lifecycle-inactive-commit-bypass-correction
status: approved
revision: v1
---

# Review: Inactive Commit Bypass Correction

Fresh read-only review of the exact uncommitted subject is **APPROVE**.

- Both runtime adapters use the same direct-invocation parser and selector denial.
- In canonical inactive state, `-a`/`--all`, `-i`/`--include`, `-o`/`--only`, explicit pathspecs, and `--pathspec-from-file` are denied before staged-path inspection.
- Git global options plus `command`, `env`, executable-path forms, and GNU `env` optional signal forms were assessed. Optional signal flags no longer consume the executable token; standalone, attached, and nested `env -S` split-string forms are normalized before the Git check.
- The existing staged-source denial, coordination-only commit allowance, branch binding, and stale-gate protections remain covered.

No P1/P2 finding remains. Review isolation: same-session-degraded.
