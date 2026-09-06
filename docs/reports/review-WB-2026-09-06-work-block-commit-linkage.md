# Review Report — WB-2026-09-06-work-block-commit-linkage

## Verdict

READY

## Findings

The fresh hook reads schema-v3 `.agent/active-work-block.json` with structured
Python JSON parsing. Active means a non-empty canonical `work_block_id`; the
write-gate status does not disable linkage. Exactly one Git-parsed
`Work-Block` trailer must match the active ID, and the attached branch must
match `subject_branch`. Detached HEAD, stale branch state, malformed state,
and malformed/multiple/mismatched trailers are blocked. Empty `work_block_id`
permits ordinary commits.

Bootstrap keeps its no-argument health-check behavior and adds explicit
`--install-git-hooks` (mutating only the local repository config) and
`--check-git-hooks` (read-only). Fixtures use disposable repositories only.
The hook is documented as cooperative, not a security boundary.

Historical hook/parser was not copied or cherry-picked. No application,
skills, framework, provider, deployment, or shared repository configuration
was changed.
