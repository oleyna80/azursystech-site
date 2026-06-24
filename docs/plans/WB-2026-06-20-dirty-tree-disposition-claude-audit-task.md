# Read-Only Claude Audit Task: Dirty Tree Disposition

## Assignment

- **Role:** Reviewer / External Audit Runner
- **Work Block:** `WB-2026-06-20-dirty-tree-disposition`
- **Objective:** independently challenge the J1 inventory and disposition draft.
- **Expected output:** findings-first audit on stdout only, ending with a verdict of `APPROVE`, `SUPPLEMENT`, or `RECONSIDER`.
- **File-change permission:** none; do not write, edit, create, delete, stage, commit, or push any file.

## Exact Read Scope

Read only these files:

1. `AGENTS.md`
2. `.codex/write-gate.md`
3. `docs/plans/WB-2026-06-20-dirty-tree-disposition.md`
4. `docs/reports/critic-WB-2026-06-20-dirty-tree-disposition.md`
5. `docs/reports/inventory-WB-2026-06-20-dirty-tree-disposition.yml`
6. `docs/reports/disposition-WB-2026-06-20-dirty-tree-disposition.md`
7. `scripts/validate-dirty-tree-inventory.py`
8. `/tmp/WB-2026-06-20-dirty-tree-disposition-B0.json`

The inventory is JSON-compatible YAML. You may use read-only `Read`, `Glob`,
and `Grep` operations only. Do not execute the validator, shell commands,
scripts, package tools, Git mutations, network calls, or nested AI tools.

## Private Boundary

Do not read `.claude/settings.json` content, `.env*` content, ignored files,
credentials, tokens, provider settings, private model settings, raw external
transcripts, or any classified subject-file payload. Paths and metadata already
present in the inventory or B0 are sufficient. Do not reproduce sensitive-looking
payloads if encountered unexpectedly; report only the path and boundary concern.

## Audit Checks

Return findings ordered by severity and cite the relevant file and path/group.
Check:

- exact coverage of all 237 B0 paths and preservation of raw path/status/hash/size metadata;
- omissions, duplicate paths, duplicate group membership, and paths outside B0;
- consistency among domain owner, disposition, group, dependencies, tier, risk, and decision markers;
- privacy handling for private/unknown/config-adjacent paths;
- provenance and vendor/license handling for imported skills, AI assets, and showcase content;
- portability handling for Unicode, generated files, executable scripts, `.gitattributes`, and ignore-policy conflicts;
- whether proposed groups respect atomic dependencies and avoid implying commit approval;
- whether Owner decisions and follow-up Work Blocks cover every HOLD or unresolved risk;
- whether the stdlib validator actually enforces its stated schema, B0/C set model, B0-C drift, and empty staging;
- inspection gaps or claims that cannot be proved from the exact read scope.

## Output Contract

Write only to stdout using this structure:

1. `Findings` with severity, evidence, impact, and required correction.
2. `Coverage gaps` including uninspected or unprovable areas.
3. `Duplicate/omission result`.
4. `Privacy, provenance, and portability result`.
5. `Group/dependency result`.
6. `Verdict`: `APPROVE`, `SUPPLEMENT`, or `RECONSIDER`.

Do not make repository changes. Do not approve a commit, deploy, config change,
dependency change, or private-file disposition. External output is evidence for
later local triage, not final acceptance.
