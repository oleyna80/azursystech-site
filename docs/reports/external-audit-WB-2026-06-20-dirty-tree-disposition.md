# External Audit Triage

- **Work Block:** `WB-2026-06-20-dirty-tree-disposition`
- **Stage:** External Audit / I; Implementation / J2 and Review-fix
- **External role:** Reviewer / External Audit Runner
- **Triage role:** Coder / Docs Analyst under Orchestrator dispositions
- **External verdict:** `SUPPLEMENT`
- **Repository authority:** evidence only; no group is approved to stage or commit

## Execution Record

Claude Code `2.1.183` received the bounded task contents as its prompt and ran
read-only. It did not separately read the source task path, which limits task
chain-of-custody confirmation but is not a repository defect. The first
input-substitution invocation failed immediately. A stdin sandbox invocation
then returned `ConnectionRefused`. The approved network rerun exited `0` under
a 10-minute timeout, without token or monetary budget flags. Captured stdout was
154 lines and 16,299 bytes. No provider credential or configuration content is
included here.

Claude read seven of the eight requested evidence files. Its sandbox could not
read `/tmp/WB-2026-06-20-dirty-tree-disposition-B0.json`, so it could assess
internal inventory consistency but could not independently compare B0 raw
fields. This report summarizes the transcript rather than reproducing it.

## Findings and Dispositions

### F1 - B0 unavailable to Claude (`HIGH`)

**Finding:** Claude could not independently verify path/status/hash/size fields
against the frozen `/tmp` baseline.

**Disposition: accepted as an external coverage limit.** B0 will not be copied
into the repository. The local stdlib validator independently passes against
the preserved count `237` and baseline hash
`7041c3a287c32c3a232dae09af8d304f501dfb274ef0eefd5d500a59efe2b453`.
Native Reviewer K and Verifier L must repeat this check.

### F2 - B0/control overlap for memory log (`HIGH`)

**Finding:** a memory log is both an A9 subject and an active control path.

**Disposition: clarified.** The plan explicitly permits C intersection with
B0. Pre-Work-Block history in both approved logs remains classified A9 subject
content; only new append-only entries are control writes. Inventory raw fields
remain the frozen B0 snapshot, and the validator intentionally excludes active
C paths from B0-C immutability checks. Neither log is removed from B0, A9, or C.

### F3 - Validator outside subject inventory (`HIGH`)

**Finding:** the validator is a control artifact outside B0 and therefore not
covered by the eight imported executable Python subject paths.

**Disposition: clarified.** This is intentional. The untracked validator has
filesystem mode `0664`, no Git index mode, and is non-executable. The validator
now enforces that it remains non-executable unless policy is explicitly changed
with Owner approval.

### F4 - Unresolved dependency references (`MEDIUM`)

**Finding:** dependency strings that were not group names had no structured
resolution target or validator enforcement.

**Disposition: accepted.** The inventory now has an `external_dependencies`
registry for all 42 non-group keys. Each record declares category, resolution
owner, expected follow-up Work Block or decision, and unresolved/resolved
status. The validator requires every dependency to resolve to a group or exact
registry key and validates the registry fields and status enum. All statuses
remain conservatively `unresolved`.

### F5 - Misleading root-language marker (`MEDIUM`)

**Finding:** `wrong-root-language` could be mistaken for filesystem portability.

**Disposition: accepted.** It is renamed
`root-html-lang-content-mismatch` and documented as an accessibility/SEO
content-locale concern, not a filesystem encoding issue.

### F6 - Task source path not separately read (`MEDIUM`)

**Finding:** Claude did not inspect the repository task file independently.

**Disposition: clarified as a chain-of-custody limitation.** The exact task
contents were the invocation prompt. No repository correction is required;
native Review can compare the task file and this triage evidence.

### F7 - C1 T2/high pairing (`LOW`)

**Finding:** the verification-tier/risk combination is unusual but internally
consistent.

**Disposition: noted.** No correction is required.

### F8 - Coverage ignore evidence (`LOW`)

**Finding:** the earlier Boolean did not identify its evidence or resolution.

**Disposition: accepted.** The literal candidate path `coverage/` was tested
with `git check-ignore -v -- coverage/`; exit `1` and no output mean no matching
ignore rule. The candidate is not in B0, and no existing coverage artifact is
claimed. Future ignore-policy resolution is routed to E2.

## Audit Result

Within its readable scope, Claude found unique entries, matching group/path
manifests, conservative privacy and provenance treatment, and no internal
omission. It incorrectly reported 28 groups; the J2 manifest contained 29. It
also identified C2/D2 circular ordering risk, which Review K correctly elevated
to a specification gap because C3 completed the cycle and the validator did not
reject internal cycles.

## Review K Follow-Up

Review K returned `NEEDS_CHANGES`. The exact C2 (29), C3 (2), and D2 (3)
members are now one 34-path `C2D2-showcase-integration-atomic-hold`. Their
domain owners and conservative entry dispositions are preserved, including the
two generated-derived candidates that still require regenerate-and-compare.
The merged group has only external unresolved dependencies, and the validator
now emits an actionable concrete path for any internal group cycle.

The external `SUPPLEMENT` remains dispositioned, but K re-review is pending and
no approval is implied. Verification L remains required, especially for B0 raw
field equality, dependency acyclicity, dual-role controls, live-tree equality,
and empty staging.
