# Agentic SDLC v1 — Independent Documentation Conflict Audit

**Executive verdict: `DOCS ALIGNMENT REQUIRED`.** No demonstrated Controller v1 bypass or native runtime exploit in this read-only source audit. The highest risks are documentation authority inversion and a noncanonical publication path. The explicitly quarantined legacy SDD/adapter sections are *not* treated as current defects.

## 1. Audit identity, reproducibility and coverage

- Repository: `oleyna80/azursystech-site`; frozen **main** baseline `49e976aefc29402b2e1578efbe64768dd5c30b41`.
- Isolated audit branch: `audit/sdlc-v1-documentation-conflicts-2026-10-13`; verified source head before publication `34c84039b4fc186af849f0f79ed7cc5bfddd1e39` (one added audit brief; merge-base exactly `49e976aefc29402b2e1578efbe64768dd5c30b41`).
- Owner brief: [docs/plans/sdlc-v1-documentation-conflict-audit-2026-10-13.md:L1-87](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/docs/plans/sdlc-v1-documentation-conflict-audit-2026-10-13.md#L1-L87) (brief exists in audit branch only; source link at baseline intentionally inapplicable).
- Method: GitHub connector only; source reads pinned to frozen SHA, remote recursive Git tree (1664 tracked blobs), GitHub code-search sampling for v1/v3, gates and publication terminology, explicit linked-file existence checks and source-only Controller/bridge/validator comparison. No local source execution or native client launch.
- **Direct file inspection:** 92 unique read paths, comprising 78 documentation/configuration paths and 14 source scripts/Git-hook paths. Includes all 9 governance Markdown files, all 10 docs/architecture files, all 11 docs/engineering-memory files, root/agent/Codex/Claude instructions, selected OpenCode/skill mirrors, templates, release validator and bridge. Repo-wide 1664-blob tree inventory is not equivalent to reading all file bodies.
- Exclusions/limits: historical individual WB specs/reports/tasklists sampled by code search but not exhaustively read; generated or private installation files outside committed Git unavailable; no native Codex/Claude/OpenCode hook smoke, secret inspection, provider calls, network/effective sandbox tests. Findings describe textual inconsistencies, not verified security bypasses.

## 2. Authority and source-of-truth map

1. **Installed runtime/enforcement authority:** [.agent/controllers/v1/state.py:L11-26](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/state.py#L11-L26), [.agent/controllers/v1/policy.py:L159-200](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/policy.py#L159-L200), [.agent/controllers/v1/cli.py:L257-305](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/cli.py#L257-L305) and [scripts/sdlc-v1-bridge.py:L223-246](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/scripts/sdlc-v1-bridge.py#L223-L246). Trusted external active admission and common-dir installation, per-worktree Git-private schema-v2 state. Git committed docs cannot grant admission.
2. **Normative human policy:** [AGENTS.md:L32-62](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/AGENTS.md#L32-L62) and especially [governance/authority.md:L34-47](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/authority.md#L34-L47) / [governance/authority.md:L120-157](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/authority.md#L120-L157). Work Block intent is Owner → approved spec → accepted architecture → approved plan/scope, subordinate to installed runtime admission for permissible operations. Other governance files remain normative for relevant process functions *except* where they contradict installed v1.
3. **Planning/product and architecture:** approved current docs/specs and accepted docs/architecture are decision/input contracts, not live state. Some architecture files are marked proposal/draft or pre-cutover implementation plans; chronology/status must be checked before reuse.
4. **Operational guides and runtime adapters:** [docs/session-bootstrap.md:L10-25](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/docs/session-bootstrap.md#L10-L25), [.agent/ROSTER.md:L48-63](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/ROSTER.md#L48-L63), [.codex/AGENTS.md:L33-64](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.codex/AGENTS.md#L33-L64), [.codex/instructions.md:L69-80](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.codex/instructions.md#L69-L80), [CLAUDE.md:L145-176](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/CLAUDE.md#L145-L176), [.claude/settings.json:L1-36](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.claude/settings.json#L1-L36) and [.codex/hooks.json:L1-40](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.codex/hooks.json#L1-L40). Static hooks are intended wiring only; actual runtime loading remains UNVERIFIED.
5. **Generated/historical projection and evidence:** [PROJECT_MAP.md:L6-10](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/PROJECT_MAP.md#L6-L10) migration block, [FILE_REGISTRY.yml:L101-119](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/FILE_REGISTRY.yml#L101-L119) migration index, tracked `.agent/active-work-block.json` schema-v3, `.agent/active-work-block.default.json`, historic gate JSON/Markdown and `.codex/scripts/lifecycle.py`. Validated old CI evidence can remain tracked but does not select v1 runtime authority. [governance/release-state.md:L32-45](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/release-state.md#L32-L45) and machine registry currently mislabel parts of this distinction.
6. **Role/skill contract:** `.agent/skills/` is the project-neutral canonical skill location ([.agents/README.md:L1-8](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agents/README.md#L1-L8)); runtime-local skill copies and thin wrappers must not override governance or v1. [docs/engineering-memory/README.md:L26-40](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/docs/engineering-memory/README.md#L26-L40) records rationale only; [docs/reports/sdlc-wb007-closeout.md:L1-1](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/docs/reports/sdlc-wb007-closeout.md#L1-L1) is historical implementation evidence, not a new authorization.

**Invariants cross-checked against source:** only INACTIVE/DEFINE/EXECUTE/ASSURE; Critic binds committed planning; Reviewer and Verifier bind exact clean candidate SHA; assured post-candidate changes restricted to coordination; trusted verified publish ends in INACTIVE; failures preserve ASSURE; protection unknown fails closed; missing/corrupt state is not a permissive inactive default. These are implemented source claims, not live execution attestations.

## 3. Findings register — 27 entries

**Severity totals:** CRITICAL 0; HIGH 8; MEDIUM 14; LOW 5. **Statuses:** CONFIRMED 22; AMBIGUOUS 2; LEGACY-MITIGATED 2; UNVERIFIED 1.

### DOC-001 — Normative lifecycle still offers Stage 3 Close and schema-v3 state

- **Severity:** HIGH; **status:** CONFIRMED.
- **Claim A / location:** [governance/lifecycle.md:L158-211](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/lifecycle.md#L158-L211). The unqualified `Lifecycle State` declares `define|execute|assure|close`, Stage 3 Close and `authority_mode: github_capability` / READY-BLOCKED source gate.
- **Claim B / authoritative comparator:** [.agent/controllers/v1/state.py:L11-21](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/state.py#L11-L21); [.agent/controllers/v1/state.py:L371-385](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/state.py#L371-L385). Installed v1 permits exactly INACTIVE/DEFINE/EXECUTE/ASSURE; successful exit is publish_success, while close accepts only reporting-only/cancelled.
- **Consequence (documentation risk, not observed exploit):** Normative governance can lead agents to use nonexistent success-close or tracked gate as the live transition.
- **Minimal future remediation:** Retain macro activities as historical/process guidance, but add a prominent installed-v1 precedence header and distinguish process Close from v1 state.
- **Code/CI/runtime dependency:** Code: confirmed by source; CI/template consumers: investigate.

### DOC-002 — Release-state names tracked schema-v3 JSON the live operational gate

- **Severity:** HIGH; **status:** CONFIRMED.
- **Claim A / location:** [governance/release-state.md:L32-45](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/release-state.md#L32-L45); [governance/release-state.md:L85-95](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/release-state.md#L85-L95). Canonical Sources item 4 calls `.agent/active-work-block.json` the operational gate and specifies canonical inactive schema-v3 behavior.
- **Claim B / authoritative comparator:** [AGENTS.md:L47-59](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/AGENTS.md#L47-L59); [scripts/validate-release-state.py:L297-327](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/scripts/validate-release-state.py#L297-L327). Controller v1 uses trusted external admission and Git-private schema-v2; the release-state validator *still* checks tracked v3 as a separate CI/document contract.
- **Consequence (documentation risk, not observed exploit):** Agents may confuse legacy CI projection validity with runtime eligibility; legacy validation can independently block repository release-state checks.
- **Minimal future remediation:** Retitle tracked v3 checks `legacy release projection compatibility`, give explicit v1 precedence, and assess whether CI must retain historical checks.
- **Code/CI/runtime dependency:** CI: YES; inspect release-state-contract workflow and validator dependencies before any migration.

### DOC-003 — Machine registry contradicts its own v1 navigation map

- **Severity:** HIGH; **status:** CONFIRMED.
- **Claim A / location:** [FILE_REGISTRY.yml:L225-244](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/FILE_REGISTRY.yml#L225-L244). Registry classifies `sdd-protocol` as a normative Define→Execute→Assure→Close contract, tracked active JSON as `operational_gate_state`, and v3 default as normative.
- **Claim B / authoritative comparator:** [PROJECT_MAP.md:L140-152](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/PROJECT_MAP.md#L140-L152); [AGENTS.md:L83-96](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/AGENTS.md#L83-L96). Map classifies SDD as v1-precedence/historical and tracked JSON as non-authoritative; root prescribes 4-state Controller v1.
- **Consequence (documentation risk, not observed exploit):** Automated navigation/agent indexing can promote obsolete inputs as authoritative.
- **Minimal future remediation:** Reclassify machine entries as v1-precedence/historical/compatibility projection while preserving migration metadata.
- **Code/CI/runtime dependency:** CI/index/schema consumers: YES.

### DOC-004 — Operational publication guide directs shell push rather than trusted publish

- **Severity:** HIGH; **status:** CONFIRMED.
- **Claim A / location:** [.agent/workflows/owner-controlled-github-flow.md:L38-63](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/workflows/owner-controlled-github-flow.md#L38-L63). Stage C prescribes `git push origin HEAD:refs/heads/<exact subject_branch>` and legacy active/terminal frozen/write-gate predicates as the sole autonomous publication path.
- **Claim B / authoritative comparator:** [governance/authority.md:L134-153](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/authority.md#L134-L153); [scripts/sdlc-v1-bridge.py:L223-246](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/scripts/sdlc-v1-bridge.py#L223-L246). Current success invokes trusted publish, verifies remote exact tip, records provenance, then reaches INACTIVE; source-backed state-event contract explains direct push alone does not transition the Controller.
- **Consequence (documentation risk, not observed exploit):** An agent can leave an assured v1 state unclosed or report publication without trusted provenance, even if Git pre-push allows a narrowly scoped ref.
- **Minimal future remediation:** Replace Stage C operational instructions with trusted-publish entry point, preserve old terminal path under explicit pre-v1 history.
- **Code/CI/runtime dependency:** Runtime hook and publish-path consumers: YES; documentation only in future block.

### DOC-005 — Claude/OpenCode skill copies impose superseded Owner-before-every-push rule

- **Severity:** HIGH; **status:** CONFIRMED.
- **Claim A / location:** [.claude/skills/git-orchestration-flow/SKILL.md:L130-163](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.claude/skills/git-orchestration-flow/SKILL.md#L130-L163); [.opencode/skills/git-orchestration-flow/SKILL.md:L130-163](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.opencode/skills/git-orchestration-flow/SKILL.md#L130-L163). Two runtime skill copies say agents must always stop before `git push` and request Owner publication.
- **Claim B / authoritative comparator:** [governance/authority.md:L120-155](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/authority.md#L120-L155); [docs/engineering-memory/github-free-owner-controlled-flow.md:L31-34](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/docs/engineering-memory/github-free-owner-controlled-flow.md#L31-L34). Canonical authority allows trusted assured exact-subject publication and delegates Owner decision only for integration; old every-push handoff is explicitly superseded.
- **Consequence (documentation risk, not observed exploit):** Which skill copy a runtime discovers changes agent conduct and stalls v1 delivery; the copies have different Git blob SHAs from `.agent/` canonical.
- **Minimal future remediation:** Add v1 precedence to both mirrors and synchronize canonical skill semantics; preserve historical handoff only as history.
- **Code/CI/runtime dependency:** Skill packaging, native discovery and tests: YES.

### DOC-006 — Canonical git skill documents merge and generic push outside v1 publish predicate

- **Severity:** HIGH; **status:** CONFIRMED.
- **Claim A / location:** [.agent/skills/git-orchestration-flow/SKILL.md:L184-219](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/skills/git-orchestration-flow/SKILL.md#L184-L219). Stacked-PR procedure creates a two-parent merge and instructs `git push <remote> <child-branch>` or `update_ref(force=false)` after local checks.
- **Claim B / authoritative comparator:** [.agent/controllers/v1/policy.py:L159-200](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/policy.py#L159-L200); [governance/authority.md:L139-157](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/authority.md#L139-L157). v1 normal publish must be exactly subject ref through origin, post-candidate history must be coordination-only and no merges, with trusted publication provenance; merge/default authority is separate.
- **Consequence (documentation risk, not observed exploit):** An active v1 agent could attempt an inadmissible merge/push or use a generic GitHub ref mutation as if within normal autonomous scope.
- **Minimal future remediation:** Flag stacked-PR procedure as a separate Owner-controlled migration/repair path, not live v1 Work Block publication.
- **Code/CI/runtime dependency:** GitHub operation permissions and ruleset behavior: YES.

### DOC-007 — Define-quality governance specifies schema-v3 write gate as live prerequisite

- **Severity:** HIGH; **status:** CONFIRMED.
- **Claim A / location:** [governance/define-quality.md:L248-253](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/define-quality.md#L248-L253); [governance/define-quality.md:L303-339](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/define-quality.md#L303-L339). Executable prerequisite is persisted into tracked schema-v3 `define_quality`, and source permission proceeds through `Critic -> Write Gate -> write-set`.
- **Claim B / authoritative comparator:** [AGENTS.md:L47-59](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/AGENTS.md#L47-L59); [.agent/controllers/v1/state.py:L23-30](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/state.py#L23-L30); [.agent/controllers/v1/cli.py:L93-119](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/cli.py#L93-L119). v1 schema-v2 active fields do not include `define_quality` or `write_gate`; Critic READY on committed planning controls EXECUTE.
- **Consequence (documentation risk, not observed exploit):** Applying the normative v3 migration instructions to v1 would select wrong state and may produce false BLOCKED/READY claims.
- **Minimal future remediation:** Retain requirements quality as planning/evidence methodology, explicitly separate legacy machine aggregate from v1 runtime transitions.
- **Code/CI/runtime dependency:** Traceability validation / templates / installation-profile checks: YES.

### DOC-008 — Current Work Block template asks agents to record a nonexistent v1 Close/write-gate state

- **Severity:** HIGH; **status:** CONFIRMED.
- **Claim A / location:** [docs/templates/work-block-template.md:L18-43](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/docs/templates/work-block-template.md#L18-L43). Template presents `Current Stage: ... Close`, `Write Gate READY|BLOCKED`, legacy Critic SKIPPED and source-gate Define aggregate as the live lifecycle metadata.
- **Claim B / authoritative comparator:** [AGENTS.md:L83-96](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/AGENTS.md#L83-L96); [.agent/controllers/v1/state.py:L141-152](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/state.py#L141-L152). v1 current states exclude Close and its machine record lacks `write_gate`; documents are evidence, not authority.
- **Consequence (documentation risk, not observed exploit):** New WBs created from a live template can accidentally present historical gate fields as actual controller authority.
- **Minimal future remediation:** Provide a v1 Controller section/fields, label profile/evaluation/Close fields as process evidence, deprecate obsolete machine gate instructions.
- **Code/CI/runtime dependency:** Template/validator/WB consumers: YES.

### DOC-009 — Artifact contract implies post-closeout coordination writes from inactive tracked state

- **Severity:** MEDIUM; **status:** CONFIRMED.
- **Claim A / location:** [governance/artifacts.md:L200-229](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/artifacts.md#L200-L229). After either closeout mode, canonical inactive operational record still allows declared coordination commits and requires a successor to reopen a resolved write gate.
- **Claim B / authoritative comparator:** [.agent/controllers/v1/policy.py:L65-103](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/policy.py#L65-L103); [.agent/controllers/v1/state.py:L371-385](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/state.py#L371-L385). v1 inactive/missing pre-WB writes require trusted active external admission and are limited to docs/changes/**; no tracked write-gate can independently reopen scope.
- **Consequence (documentation risk, not observed exploit):** Post-closeout status could be mistaken for continued write permission outside trusted admission.
- **Minimal future remediation:** Separate historical closeout artifact reconciliation from state-v2 write semantics; reference trusted admission explicitly.
- **Code/CI/runtime dependency:** Validator/template consumers: YES.

### DOC-010 — Verification report template demands reporting-only Stage 3

- **Severity:** MEDIUM; **status:** CONFIRMED.
- **Claim A / location:** [docs/templates/verification-report-template.md:L37-41](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/docs/templates/verification-report-template.md#L37-L41). Non-READY verdicts 'require reporting-only Stage 3' in the current verification template.
- **Claim B / authoritative comparator:** [.agent/controllers/v1/state.py:L371-385](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/state.py#L371-L385). Installed controller has no Stage 3; reporting-only is an explicit close outcome, not a live stage.
- **Consequence (documentation risk, not observed exploit):** Automated report generation could invoke a nonexistent transition or mislabel completion.
- **Minimal future remediation:** Rename to reporting-only close outcome and distinguish controller result from the process record.
- **Code/CI/runtime dependency:** Template consumers: check.

### DOC-011 — OpenCode Coder still relies on READY local write gate

- **Severity:** MEDIUM; **status:** CONFIRMED.
- **Claim A / location:** [.opencode/agents/coder.md:L42-63](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.opencode/agents/coder.md#L42-L63). Coder instructions require local write_gate READY and allow exact direct shell push after review.
- **Claim B / authoritative comparator:** [AGENTS.md:L47-59](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/AGENTS.md#L47-L59); [governance/authority.md:L134-151](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/authority.md#L134-L151). Live v1 uses trusted external admission and state-v2, with trusted publish for normal success.
- **Consequence (documentation risk, not observed exploit):** OpenCode adapter guidance might apply legacy checks if the runtime is selected; native OpenCode bridge load/authority is not proven.
- **Minimal future remediation:** Mark legacy permission prompts subordinate and provide v1-specific admission/publish instructions or explicitly declare adapter unsupported.
- **Code/CI/runtime dependency:** OpenCode runtime activation and negative tests: YES.

### DOC-012 — Claude Critic persona disclaims verdicts while v1 requires a Critic READY binding

- **Severity:** MEDIUM; **status:** AMBIGUOUS.
- **Claim A / location:** [.claude/agents/critic.md:L10-44](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.claude/agents/critic.md#L10-L44). Critic agent profile says it never issues READY/BLOCKED verdicts, reviews 'Stage 0.5', and refers to a READY write gate.
- **Claim B / authoritative comparator:** [.codex/critic.md:L12-23](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.codex/critic.md#L12-L23); [governance/authority.md:L110-119](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/authority.md#L110-L119). Controller requires an independent planning Critic READY binding before EXECUTE; the Orchestrator may still translate a structured read-only report into an authorized binding, so a runtime failure is not proved.
- **Consequence (documentation risk, not observed exploit):** Evidence handoff may lack a clear READY/BLOCKED result and lead to an unsupported Orchestrator inference.
- **Minimal future remediation:** Specify Critic recommendation/verdict vs trusted Controller binding responsibility; retire write-gate phrasing.
- **Code/CI/runtime dependency:** Native Critic output and orchestration handoff: YES.

### DOC-013 — Runtime capability contract uses incompatible allowed values

- **Severity:** MEDIUM; **status:** CONFIRMED.
- **Claim A / location:** [governance/runtime-capabilities.md:L40-59](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/runtime-capabilities.md#L40-L59). Allowed capability values enumerate `true`, `false`, `conditional`, `unknown`, `launch_failed`, then insist `available` is the only promotable value.
- **Claim B / authoritative comparator:** [.agent/ROSTER.md:L48-63](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/ROSTER.md#L48-L63); [governance/authority.md:L110-119](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/authority.md#L110-L119). Current authority treats capability as evidence, not admission, and doesn't require a native-topology gate to grant trusted admission.
- **Consequence (documentation risk, not observed exploit):** A runtime may never produce an accepted value or may treat native topology as extra authority gate.
- **Minimal future remediation:** Normalize schema value vocabulary and label old native topology policy as historical/assurance-specific, not installed admission.
- **Code/CI/runtime dependency:** Capability validators or profiles: YES.

### DOC-014 — Codex sprint adapter instructs mutation of a historical verification gate

- **Severity:** MEDIUM; **status:** CONFIRMED.
- **Claim A / location:** [.agents/skills/sprint-analysis/SKILL.md:L13-20](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agents/skills/sprint-analysis/SKILL.md#L13-L20); [docs/engineering-memory/runtime-command-adapters.md:L31-40](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/docs/engineering-memory/runtime-command-adapters.md#L31-L40). Read-only sprint procedure nonetheless permits session-local SKIPPED/lite writes to `.agent/verification-gate.md` and reset to PENDING for stop hooks.
- **Claim B / authoritative comparator:** [CLAUDE.md:L171-176](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/CLAUDE.md#L171-L176); [AGENTS.md:L57-59](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/AGENTS.md#L57-L59). Old authority stop/verification gates are unwired; tracked verification-gate is historical, not live runtime authority.
- **Consequence (documentation risk, not observed exploit):** A Codex discovery adapter can encourage extraneous gate-file mutation or false confidence in stop-hook completion.
- **Minimal future remediation:** Remove runtime gate mutation advice, retain historical note, route any real external Stop restriction to native client evaluation.
- **Code/CI/runtime dependency:** Codex native skill loading and Stop plugin: YES.

### DOC-015 — Agent README incorrectly states agent directory is untracked and local-only

- **Severity:** MEDIUM; **status:** CONFIRMED.
- **Claim A / location:** [.agent/README.md:L1-18](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/README.md#L1-L18). README says `.agent/` is not published to Git and shows `.agent/.gitignore` as local-only authority.
- **Claim B / authoritative comparator:** [PROJECT_MAP.md:L136-153](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/PROJECT_MAP.md#L136-L153); [AGENTS.md:L47-59](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/AGENTS.md#L47-L59). The immutable Git baseline includes tracked `.agent/README.md`, Controller source and legacy `.agent/active-work-block.json`; recursive tree contains no `.agent/.gitignore`.
- **Consequence (documentation risk, not observed exploit):** An agent may ignore committed changes or misdiagnose security and tracking properties.
- **Minimal future remediation:** Rewrite directory inventory to describe tracked Controller assets vs Git-private per-worktree state; delete nonexistent .gitignore reference from text.
- **Code/CI/runtime dependency:** Bootstrap, ignored-file and install-profile tests: check.

### DOC-016 — Governance README links to nonexistent accepted ADR

- **Severity:** MEDIUM; **status:** CONFIRMED.
- **Claim A / location:** [governance/README.md:L63-72](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/README.md#L63-L72). 'See the accepted ADR' points to `docs/architecture/decisions/2026-07-25-runtime-neutral-control-plane.md`.
- **Claim B / authoritative comparator:** [docs/architecture/sdlc-simplification-v1.md:L1-19](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/docs/architecture/sdlc-simplification-v1.md#L1-L19). No file exists at the cited ADR path in the exact 1664-file Git baseline; available architecture uses `docs/architecture/sdlc-simplification-v1*` documents.
- **Consequence (documentation risk, not observed exploit):** Governance readers cannot locate purported accepted policy provenance.
- **Minimal future remediation:** Replace with exact existing accepted decision/contract link or create a decision only under a separately approved documentation change.
- **Code/CI/runtime dependency:** Markdown link validation: check.

### DOC-017 — Canonical git-orchestration skill requires a missing reference file

- **Severity:** MEDIUM; **status:** CONFIRMED.
- **Claim A / location:** [.agent/skills/git-orchestration-flow/SKILL.md:L136-143](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/skills/git-orchestration-flow/SKILL.md#L136-L143). Stacked-PR guidance explicitly directs readers to `reference/stacked-pr-synchronization.md`.
- **Claim B / authoritative comparator:** [.agent/skills/git-orchestration-flow/reference/github-rulesets-and-api.md:L1-5](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/skills/git-orchestration-flow/reference/github-rulesets-and-api.md#L1-L5). The referenced stacked-pr-synchronization file is absent from immutable Git tree; reference directory has github-rulesets-and-api.md and two-pass-closure-projection.md only.
- **Consequence (documentation risk, not observed exploit):** A complex Git procedure may depend on an unavailable explanatory contract.
- **Minimal future remediation:** Restore or remove the dependency; verify whether missing reference is essential before re-enabling this procedure.
- **Code/CI/runtime dependency:** Skill content packaging/tests: YES.

### DOC-018 — Current project context still calls tracked v3 live canonical project source

- **Severity:** MEDIUM; **status:** CONFIRMED.
- **Claim A / location:** [docs/project-context.md:L57-63](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/docs/project-context.md#L57-L63); [memory_bank/context.md:L37-43](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/memory_bank/context.md#L37-L43). General onboarding/current-state text includes `.agent/active-work-block.json` in canonical sources and active Work Block resolution.
- **Claim B / authoritative comparator:** [AGENTS.md:L47-62](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/AGENTS.md#L47-L62); [docs/session-bootstrap.md:L10-25](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/docs/session-bootstrap.md#L10-L25). Installed authority is Git-private v2 and trusted admission; tracked v3 is historical.
- **Consequence (documentation risk, not observed exploit):** Retrieval or summarization may promote stale controller record as live state.
- **Minimal future remediation:** Add one-line v1 precedence and classify tracked JSON as historical; keep prior operational snapshots with dated headings.
- **Code/CI/runtime dependency:** Memory loaders/retrieval indices: check.

### DOC-019 — Engineering-memory SSOT table ranks tasklist as highest requirement authority

- **Severity:** MEDIUM; **status:** CONFIRMED.
- **Claim A / location:** [docs/engineering-memory/source-of-truth-chains.md:L6-18](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/docs/engineering-memory/source-of-truth-chains.md#L6-L18). For Work Block scope and acceptance, table says current docs/tasklist/** live status is highest authority, with approved plans subordinate.
- **Claim B / authoritative comparator:** [AGENTS.md:L36-45](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/AGENTS.md#L36-L45); [docs/session-bootstrap.md:L79-102](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/docs/session-bootstrap.md#L79-L102). Actual precedence puts explicit Owner instruction, approved specification and accepted architecture before plans and derived tasklist; engineering memory itself is non-authoritative.
- **Consequence (documentation risk, not observed exploit):** A copied memory table can invert decision priority, despite being lower in hierarchy.
- **Minimal future remediation:** Correct table to reference approved spec/architecture and external admission; retain tasklist as derived execution evidence.
- **Code/CI/runtime dependency:** Memory curation consumers: check.

### DOC-020 — OpenCode runtime guide is not marked pre-v1 despite obsolete admission model

- **Severity:** MEDIUM; **status:** AMBIGUOUS.
- **Claim A / location:** [runtimes/opencode/README.md:L1-23](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/runtimes/opencode/README.md#L1-L23); [runtimes/opencode/README.md:L221-240](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/runtimes/opencode/README.md#L221-L240). Adapter guide presents installed baseline permission/writes/activation and local commit-push restrictions with no installed-v1 precedence section.
- **Claim B / authoritative comparator:** [runtimes/codex/README.md:L1-38](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/runtimes/codex/README.md#L1-L38); [runtimes/claude-code/README.md:L1-39](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/runtimes/claude-code/README.md#L1-L39). Other live adapters explicitly separate current v1 entry points from pre-v1 historical procedures; OpenCode guide does not. Actual OpenCode runtime adoption was not verified.
- **Consequence (documentation risk, not observed exploit):** Future agent may treat static OpenCode permission rules as authoritative v1 enforcement.
- **Minimal future remediation:** Add status banner `not verified as Controller v1 native`, document actual installed guard once independently tested.
- **Code/CI/runtime dependency:** OpenCode runtime smoke and adapter mapping: YES.

### DOC-021 — Runtime index still describes machine write gates as installed adapter capabilities

- **Severity:** MEDIUM; **status:** CONFIRMED.
- **Claim A / location:** [runtimes/README.md:L41-50](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/runtimes/README.md#L41-L50). Index labels Codex and Claude adapters as implemented 'machine write/source/assurance gates'.
- **Claim B / authoritative comparator:** [runtimes/codex/README.md:L3-38](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/runtimes/codex/README.md#L3-L38); [runtimes/claude-code/README.md:L3-39](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/runtimes/claude-code/README.md#L3-L39). Both adapter entry points state Controller v1 Git-private schema-v2 controls the lifecycle and older gates are historical.
- **Consequence (documentation risk, not observed exploit):** Quick runtime selection/bootstrapping sends agents toward defunct gate expectations.
- **Minimal future remediation:** Refresh index status/description to v1 bridge and link the installed-v1 entry point for each adapter.
- **Code/CI/runtime dependency:** Bootstrap profile routing: check.

### DOC-022 — Role roster lists skill aliases not present as standalone installed skills

- **Severity:** MEDIUM; **status:** CONFIRMED.
- **Claim A / location:** [.agent/ROSTER.md:L7-16](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/ROSTER.md#L7-L16). Core skill routing table includes `ssot-sync-closeout`, `orchestrator-log`, `reviewer`, `verifier`, and `security-audit-triage` as direct skills.
- **Claim B / authoritative comparator:** [.agent/skills/README.md:L1-1](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/skills/README.md#L1-L1); [.agent/ROSTER.md:L68-93](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/ROSTER.md#L68-L93). Git tree has no standalone `.agent/skills/{ssot-sync-closeout,orchestrator-log,reviewer,verifier,security-audit-triage}/SKILL.md`; analogous functions may be nested in memory-ops/security-pass.
- **Consequence (documentation risk, not observed exploit):** Agents may report missing mandatory skills or invent substitutes despite available role/process contracts.
- **Minimal future remediation:** Route explicit installed skill names and note aliases/functions, with no claim that absent standalone packages are installed.
- **Code/CI/runtime dependency:** Skill inventory and routing tests: check.

### DOC-023 — Agent README references a nonexistent AGENTS section for external discovery

- **Severity:** LOW; **status:** CONFIRMED.
- **Claim A / location:** [.agent/README.md:L34-44](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/README.md#L34-L44). Skill discovery guidance says check `AGENTS.md § External Skill Discovery`.
- **Claim B / authoritative comparator:** [AGENTS.md:L159-169](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/AGENTS.md#L159-L169). Current root AGENTS.md has External Material heading but no section entitled External Skill Discovery.
- **Consequence (documentation risk, not observed exploit):** Minor navigation detour and temptation to use unapproved external skill.
- **Minimal future remediation:** Point at root External Material rules and current skills lock/routing guidance.
- **Code/CI/runtime dependency:** Markdown anchors: check.

### DOC-024 — CLAUDE.md underreports English locale

- **Severity:** LOW; **status:** CONFIRMED.
- **Claim A / location:** [CLAUDE.md:L83-87](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/CLAUDE.md#L83-L87). Localized route guidance identifies only fr/ru.
- **Claim B / authoritative comparator:** [web/src/i18n.js:L1-10](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/web/src/i18n.js#L1-L10). Runtime site configuration declares `SUPPORTED_LOCALES = ['fr','ru','en']`.
- **Consequence (documentation risk, not observed exploit):** An agent may omit EN from route, link, content or smoke coverage.
- **Minimal future remediation:** Update locale list to fr/ru/en and align acceptance checks.
- **Code/CI/runtime dependency:** Website test inventory: check.

### DOC-025 — SDD protocol explicitly quarantines its old Close/write-gate workflow

- **Severity:** LOW; **status:** LEGACY-MITIGATED.
- **Claim A / location:** [.agent/workflows/sdd-protocol.md:L7-29](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/workflows/sdd-protocol.md#L7-L29); [.agent/workflows/sdd-protocol.md:L135-159](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/workflows/sdd-protocol.md#L135-L159). Historical body still shows Define→Execute→Assure→Close and terminal candidate publication.
- **Claim B / authoritative comparator:** [AGENTS.md:L83-96](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/AGENTS.md#L83-L96). Protocol begins with explicit Controller v1 precedence and marks all following pre-v1 procedure non-authoritative.
- **Consequence (documentation risk, not observed exploit):** No standalone active-document finding; residual risk comes from other unqualified references/registries.
- **Minimal future remediation:** Preserve history; only update cross-links to ensure readers land on the precedence header.
- **Code/CI/runtime dependency:** No code work required.

### DOC-026 — Legacy Codex/Claude adapters and write-gate record already have explicit v1 override

- **Severity:** LOW; **status:** LEGACY-MITIGATED.
- **Claim A / location:** [runtimes/codex/README.md:L1-38](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/runtimes/codex/README.md#L1-L38); [runtimes/claude-code/README.md:L1-39](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/runtimes/claude-code/README.md#L1-L39); [.codex/write-gate.md:L1-10](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.codex/write-gate.md#L1-L10). Older sections and recorded gates include schema-v3 signing, frozen candidate and legacy hook/close procedures.
- **Claim B / authoritative comparator:** [governance/authority.md:L34-47](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/governance/authority.md#L34-L47). Top-of-file entry points and write-gate banner clearly forbid using these as current v1 authority.
- **Consequence (documentation risk, not observed exploit):** Retained history does not by itself demonstrate active contradiction; risk is copying old sections without header.
- **Minimal future remediation:** Preserve as historical evidence; optional later archive only after dependency checks.
- **Code/CI/runtime dependency:** Potential historical test/bootstrap references: check before deletion.

### DOC-027 — Native instruction discovery and external hook composition not proven by repository source

- **Severity:** LOW; **status:** UNVERIFIED.
- **Claim A / location:** [.codex/AGENTS.md:L1-5](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.codex/AGENTS.md#L1-L5); [.codex/config.toml.template:L1-11](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.codex/config.toml.template#L1-L11); [.codex/hooks.json:L1-26](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.codex/hooks.json#L1-L26); [.claude/settings.json:L1-36](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.claude/settings.json#L1-L36). Repository contains project-level Codex guidance, optional config template and hook wiring, and Claude hooks.
- **Claim B / authoritative comparator:** [docs/session-bootstrap.md:L135-152](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/docs/session-bootstrap.md#L135-L152); [runtimes/codex/README.md:L24-31](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/runtimes/codex/README.md#L24-L31). Static presence cannot prove `.codex/AGENTS.md`, `.codex/instructions.md`, the optional template, native agent skills, or project hooks were actually loaded; external global/plugin config is unavailable.
- **Consequence (documentation risk, not observed exploit):** Do not claim live hook, isolation, credential, or Reviewer/Verifier execution parity from this GitHub-only audit.
- **Minimal future remediation:** Later authorized native negative tests should capture effective instruction sources, actual hook dispatch, Stop/plugin composition and isolation; do not change trust settings here.
- **Code/CI/runtime dependency:** Native runtime/security gate: YES.

## 4. Cross-reference inventory and stale terminology

- **Verified absent targets in frozen recursive Git tree:** `docs/architecture/decisions/2026-07-25-runtime-neutral-control-plane.md` (DOC-016); `.agent/.gitignore` (DOC-015); `.agent/skills/git-orchestration-flow/reference/stacked-pr-synchronization.md` (DOC-017); `AGENTS.md § External Skill Discovery` heading (DOC-023). Directory paths and section targets were compared to exact tracked tree / read root headings; absence is not an assertion about untracked external worktrees.
- **Legacy phrase examples in live/unqualified docs:** `Stage 3 Close` and `authority_mode: github_capability` in governance/lifecycle; `operational Work Block gate state` in governance/release-state; `canonical_define_execute_assure_close_contract` and `portable_fail_closed_default_gate_state` in FILE_REGISTRY; `write_gate: BLOCKED` and `git push origin HEAD...` in owner-controlled-github-flow; `Close/Write Gate` in the Work Block template; standalone gate in OpenCode Coder.
- **Explicitly mitigated uses:** old schema-v3 and finalization instructions in `.agent/workflows/sdd-protocol.md`, `runtimes/codex/README.md`, `runtimes/claude-code/README.md`, `.codex/write-gate.md`, and old `.codex/scripts/lifecycle.py` (historic helper not wired in inspected current v1 bridge). The first four have direct precedence banners; legacy helper's actual invocation was not run.
- **Duplicate contracts:** canonical `.agent/skills/git-orchestration-flow/SKILL.md` differs from Claude/OpenCode skill copies, and the latter share the same stale Git blob. Other tested copies (`crash-test-gate`, `vps-operations`, `memory-ops`) share exact Git blob SHA where available. `.agents/skills/sprint-analysis/SKILL.md` is intended as a thin adapter, not a byte-for-byte canonical copy.
- **Link verification method limitation:** examined named entrypoints and targeted reference directories, but no full repository-wide Markdown anchor parser or URL liveness crawler ran. External-site hyperlinks were not asserted healthy or broken.

## 5. No-change controls and non-defects

- All comparisons are against immutable main baseline; branch before report publication contains only the Owner-supplied audit brief. No source document, Controller, hook, policy, state, CI YAML, plugin installation or registry was modified by this audit.
- No native execution, local commands, worktree changes, CLI dispatch, PR, merge, deployment, branch protection mutation, or shell push occurred. The sole authorized write is this Markdown report on the named audit branch.
- Historical signed authorization artifacts, schema-v3 state files, prior WB assurance and Process Feedback are legitimate audit evidence, *not automatic defects*. Legacy mentions become findings only when an unqualified active instruction/authority classification is inconsistent.
- Existing root and adapter v1-precedence headers substantially mitigate risk. A static file or hook config is not proof that a native client executed it; no assertion of token disclosure, OS-level credential isolation, exploit success or real-world push bypass is made.

## 6. Prioritized Owner-approved future cleanup plan (not executed)

1. **P0 — authority/publication convergence:** scope governance/lifecycle, release-state, FILE_REGISTRY, owner-controlled-github-flow and canonical/runtime git-orchestration skills. Align accepted v1 publish/role/state semantics before changing any client behavior. Preserve the external hard-stop boundary. CI/validator tests first for registry/release-state changes.
2. **P1 — active templates and agent entrypoints:** update define-quality machine language, work-block/verification templates, OpenCode Coder, Critic handoff vocabulary and Codex sprint adapter. Never silently modify runtime paths or change selected authority profile. Validate skill discovery, exact candidate requirements and no-legacy-gate mutation.
3. **P2 — navigation hygiene:** fix missing ADR/reference/README anchor, .agent tracking description, locale list, role alias vocabulary, runtime index and engineering-memory source-of-truth statements. Add automated internal-link checks when justified.
4. **P3 — archive planning:** identify references in tests/CI/bootstrap to legacy `.codex/scripts/lifecycle.py`, signed gate evidence, tracked schema-v3 defaults and old generated adapter chapters; mark or migrate only after dependency review and separate Owner authorization. Preserve provenance.
5. **Security validation separately:** negative-test credential/shell/network isolation and agent hook loading before unrestricted agent autonomy; this documentation-only task did not certify any native security boundary.

## 7. Residual unknowns / evidence gaps

- Native Codex does not automatically prove it loads `.codex/AGENTS.md` or `.codex/instructions.md`; `.codex/config.toml.template` is optional; effective user/global policy, hooks, plugin composition, OpenCode runtime and Claude Stop behavior are inaccessible in this read-only GitHub inspection.
- User-supplied background: an earlier operational smoke reportedly saw missing Codex project-hook dispatch and Claude global plugin metadata drift. **Not reproduced, not attributed to a root cause, and not promoted to CONFIRMED source findings.** Validate independently in a later sandboxed Work Block.
- Source review cannot verify actual trusted installation config/registry ACLs, remote branch protection resolver, secrets inaccessible to agent shell, outbound network restrictions, credential non-exfiltration or negative-test pass. No confidential values were read.
- Existing release-state CI script does validate the tracked v3 projection; whether this causes an actual current CI failure is unknown without allowed workflow execution and candidate-specific evidence.
- The 697 docs/** tracked file inventory was not exhaustively read; individual historical WB artifacts may still repeat superseded terminology, but the audit did not mistake recurrence in history for live policy conflict.

## 8. Exact report-only diff and branch head

- Before write: `main=49e976aefc29402b2e1578efbe64768dd5c30b41`; audit branch head `34c84039b4fc186af849f0f79ed7cc5bfddd1e39`; base→branch diff exactly added `docs/plans/sdlc-v1-documentation-conflict-audit-2026-10-13.md` (87 lines).
- Authorized new path: `docs/reports/sdlc-v1-documentation-conflict-audit-2026-10-13.md` only. Relative to pre-write audit head, expected exact diff is **one added Markdown report** and no changed/deleted path.
- Exact resulting publication commit and remote branch ref are recorded in the audit execution's GitHub verification and Owner-facing chat result. A Git commit cannot reliably embed its own SHA in its own tracked content (self-reference changes that SHA); do not edit this report again just to fill in a self-referential hash.
- No PR, merge or main mutation is authorized. This document is a documentation audit, not Controller lifecycle READY, Critic/Reviewer/Verifier READY, deployment approval or security gate attestation.
