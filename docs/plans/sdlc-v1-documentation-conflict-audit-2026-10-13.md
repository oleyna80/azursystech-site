# SDLC v1 — Independent Documentation Conflict Audit

**Status:** audit brief / Owner-requested, report-only  
**Repository:** \`oleyna80/azursystech-site\`  
**Audit branch:** \`audit/sdlc-v1-documentation-conflicts-2026-10-13\`  
**Frozen comparison baseline:** \`49e976aefc29402b2e1578efbe64768dd5c30b41\`  
**Expected report:** \`docs/reports/sdlc-v1-documentation-conflict-audit-2026-10-13.md\`

## Objective

Independently inspect the repository's current and legacy instructions, governance documents, runtime adapters, and references. **Find and document every substantiated contradiction, ambiguous precedence rule, obsolete instruction presented as live, broken reference, and material duplication that could mislead Codex/Claude/other agents after the WB-001–WB-007 Controller v1 cutover.**

This is an **inventory and evidence report, not a documentation migration or code change**. Distinguish discrepancies in documentation from proven runtime failures. Existing historical documents are not defects merely because they are historical.

## Execution constraints

- Work through the connected **GitHub plugin only** for this phase. Read immutable files at the exact baseline SHA; independently verify the remote branch starts at that SHA.
- Preserve \`main\`, other branches, existing PRs, CI workflows, runtime files, configs, trusted Controller state, registries, hooks, and all local worktrees.
- Do not execute source code or launch Codex/Claude runtimes for this audit. A read-only source inspection cannot prove that instructions or hooks were loaded in a native session.
- Do **not** edit, delete, reorder, or replace instruction/protocol/governance files. Only create the designated Markdown report on this audit branch; do not modify this brief except by separate Owner authorization.
- No new admission, authority records, tags, PR, merge, deployment, production action, plugin changes, or local \`git pull\`. Do not represent this report-only GitHub task as an assured Controller lifecycle or as independent Reviewer/Verifier READY.
- If publishing the report is denied by available GitHub authority, return the complete report in chat and state **NOT PUBLISHED**; do not bypass controls.
- Do not collect tokens, environment values, secret contents, private client metadata, or hidden reasoning.

## Authoritative reference to establish

Treat the **implemented installed Controller v1 contract** and its current, committed normative statements as the baseline for compatibility analysis. Inspect:

- Root \`AGENTS.md\`, \`CLAUDE.md\`, \`PROJECT_MAP.md\`, \`FILE_REGISTRY.yml\`.
- \`governance/\`: \`authority.md\`, \`lifecycle.md\`, \`enforcement.md\`, \`release-state.md\`, \`artifacts.md\`, \`define-quality.md\`, \`runtime-capabilities.md\`, \`README.md\`.
- \`docs/session-bootstrap.md\`, relevant \`docs/architecture/\`, \`docs/engineering-memory/\`, current instructions and references in \`docs/\`.
- \`.agent/README.md\`, \`.agent/ROSTER.md\`, \`.agent/workflows/{sdd-protocol.md,owner-controlled-github-flow.md}\`, \`.agent/critic-gate.md\`, \`.agent/verification-gate.md\`, legacy \`.agent/active-work-block.json\`.
- \`.codex/AGENTS.md\`, \`.codex/instructions.md\`, \`.codex/critic.md\`, \`.codex/write-gate.md\`, \`.codex/config.toml.template\`, \`.codex/hooks.json\`, legacy lifecycle helper.
- \`.claude/settings.json\`, \`.claude/agents/\`, agent memory entrypoints; \`.agents/\`, \`.opencode/\`, \`runtimes/\`, \`.githooks/\`, \`scripts/sdlc-v1-bridge.py\` where needed to verify documented wiring.
- Any other documents **discovered by searching references to** \`Controller v1\`, \`schema v2\`, \`schema v3\`, \`active-work-block\`, \`write gate\`, \`Close\`, \`publish\`, \`Critic\`, \`Reviewer\`, \`Verifier\`, \`admission\`, \`AGENTS.md\`, \`sdd-protocol\`, \`bootstrap\`, \`hook\` and \`legacy\`.

Examine runtime code **read-only** only to validate claims about the current implementation; do not suggest changing it under this task.

## Questions to answer with evidence

1. Which exact document is normative, operational guidance, runtime configuration, generated projection, or historical evidence? Are any two files claiming incompatible authority or sources of truth?
2. Do the files distinguish the **Controller v1 schema-v2 Git-private per-worktree state + trusted external admission** from tracked schema-v3 / legacy write gates?
3. Which documents still prescribe \`Define → Execute → Assure → Close\`, \`close --success\`, the old terminal publication, old frozen/write-gate states, or direct shell \`git push\` as if current? Which historical sections are already explicitly marked non-authoritative?
4. Do publication, revision, assurance, admission, Owner hard stops and \`INACTIVE\` semantics align with \`governance/authority.md\` and current Controller code?
5. Which instructions conflict on role permissions, review independence, capability vs authority, isolation, hooks loading, network/credentials, and linked worktrees?
6. Are there references to missing files/sections, out-of-date paths/commands, incorrect repo tracking claims, duplicate skill copies with diverged contracts, or false claims about client instruction discovery?
7. Are \`PROJECT_MAP.md\`, \`FILE_REGISTRY.yml\`, \`release-state.md\` and old registries explicitly projections/evidence rather than live controller authority?
8. Are there instructions that could cause an agent to bypass v1 controls, misreport READY, mutate \`main\`, or leak credentials? Clearly distinguish a **document risk** from an observed exploit.
9. Which older docs should be preserved as historical evidence, updated with precedence headers, moved to a later archive, or eventually removed **after dependency and CI checks**? Do not make those changes here.
10. Which contradictions are **already mitigated by explicit v1-precedence disclaimers** and which remain unmitigated? Avoid reporting every legacy mention as an active conflict.

## Leads to verify, not preaccepted conclusions

- \`governance/lifecycle.md\` describes historical Stage 3 Close and schema-v3 source gates; compare against installed schema-v2 state machine.
- \`governance/release-state.md\` calls tracked \`.agent/active-work-block.json\` an "operational Work Block gate state"; examine validator scope and current Controller precedence.
- \`.agent/workflows/owner-controlled-github-flow.md\` still contains old frozen write-gate and terminal subject-publication predicates.
- \`.agent/workflows/sdd-protocol.md\` has an explicit non-authoritative historical section — classify correctly rather than treating the whole file as a current instruction.
- \`.agent/README.md\` claims \`.agent/\` is not tracked by Git, references \`.agent/.gitignore\` and identifies SDD as the full lifecycle; verify against tracked tree.
- \`CLAUDE.md\` documents localized routes as FR/RU; check the current EN support.
- \`governance/README.md\` references an ADR path; verify it exists.
- \`.codex/AGENTS.md\` and \`.codex/instructions.md\` are only runtime-visible if actually loaded; mark native-loading assumptions UNVERIFIED when source config alone cannot prove them.
- Known external operational smoke observed a Codex launch with missing project-hook dispatch and global Claude plugin metadata drift. Use this *only as supplied background*, label separately as non-reproduced runtime evidence; do not imply repository text alone proves either cause.

## Required report structure

Produce exactly one Markdown file at the expected report path:

1. **Executive verdict**: \`DOCS ALIGNED\`, \`DOCS ALIGNMENT REQUIRED\`, or \`AUDIT INCOMPLETE\`.
2. **Audit identity & coverage**: exact baseline SHA, branch, document count, included/excluded categories and inspection method.
3. **Authority and source-of-truth map**: named files with classification and precedence.
4. **Findings register**: IDs \`DOC-001\` etc. Each finding must include severity (\`CRITICAL/HIGH/MEDIUM/LOW\`), status (\`CONFIRMED/AMBIGUOUS/LEGACY-MITIGATED/UNVERIFIED\`), exact path and line spans, *both* conflicting claims or a verified missing target, authoritative reference, consequence, **minimal remediation proposal**, and whether code/CI dependency needs further investigation.
5. **Cross-reference inventory**: broken targets and stale terminology, listing explicit examples or explaining method/coverage.
6. **No-change controls**: what remained untouched, and what is deliberately not a defect.
7. **Prioritized documentation cleanup plan** with bounded groups for a future Owner-approved Work Block; no implementation under this audit.
8. **Residual unknowns / evidence gaps**, especially actual native instruction loading, hook activation and any external config unavailable via GitHub.
9. **Exact report-only diff and branch head** after publication.

Use canonical GitHub links of the form \`https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/<path>#Lx-Ly\` for every substantiated finding. Never use free-floating line numbers alone. If an item cannot be verified, label \`UNVERIFIED\`, not \`CONFIRMED\`.

## Acceptance criteria / stop condition

- Document inventory and all known high-risk conflicts are represented, including mitigated/historical cases.
- Exact path and line references support every high/critical finding.
- No source, governance, hook, state or runtime changes have occurred.
- The report is committed **only** to the isolated audit branch; \`main\` remains unchanged.
- Return branch URL, exact report URL, report commit SHA, number of findings by severity, and a concise priority summary.
- **Stop before PR creation, merge, deployment, or local pull.**
