---
artifact_type: architecture_audit
status: completed
scope: docs-only
not_work_block: true
---

# SDLC Revision Audit

## Purpose

This branch is the durable SSOT for the AzurSysTech SDLC architecture revision.

It is **not a Work Block**, does not grant implementation authority, and must not be used to bypass the existing lifecycle, hook, merge, or deploy controls.

The purpose is to collect findings from WB-036/WB-037, identify root causes, define the target lifecycle model, and later derive bounded implementation Work Blocks.

## Working rule

During the audit phase:

1. Observe and reproduce contradictions.
2. Record findings before changing control-plane code.
3. Separate symptoms from root causes.
4. Complete the transition model before writing the remediation plan.
5. Implement remediation later through separate bounded Work Blocks.

## Current diagnosis

WB-037 became an integration test of the control plane.

Most individual guards behaved fail-closed as designed, but the combined lifecycle could still enter states where every local rule was individually reasonable while the next valid transition was impossible.

The primary architectural problem is therefore not "bad hooks". It is that lifecycle state, Git worktree state, Git index state, Git history state, assurance state, and publication state are not yet represented by one complete transition model.

## Findings register

### F-001 — Assurance disposition lifecycle was incomplete

Optional assurance could remain PENDING while success-closeout required every assurance disposition to be resolved. A supported explicit SKIPPED transition with a non-empty reason was required.

Status: partially remediated during WB-037.

Architectural lesson: every blocking state needs a supported transition to every permitted terminal disposition.

### F-002 — Git command arguments were not equivalent to Git-selected paths

Directory staging could conceal forbidden descendants such as secret-bearing or otherwise forbidden files.

Status: remediated during WB-037.

Architectural lesson: authorization must validate the effective Git selection, not only the command-line path arguments.

### F-003 — Coordination authority was not a first-class lifecycle transition

Owner-authorized durable evidence could still be blocked when the active coordination write-set did not contain the path. A narrow WB-specific amendment was required because the lifecycle did not provide a general bounded coordination-scope transition.

Status: local problem remediated; general design issue remains open.

### F-004 — Candidate transaction and terminal transaction were not formally separated

A success-closeout could occur before the source candidate had been durably committed. Once the lifecycle became inactive, later publication steps could become impossible.

Status: open design issue.

Required direction: candidate commit must precede terminal preparation and lifecycle close.

### F-005 — Contract parsers disagreed on the accepted specification format

The terminal projection parser initially rejected a valid multiline YAML `source_write_set` already used by the specification. Subsequent review found YAML alias, ambiguous scalar, DEL, and C1 control-character edge cases.

Status: implementation prepared and tested locally in WB-037, but not yet published from that WB.

Architectural lesson: one schema/parser contract should be shared across lifecycle, hooks, and published-object conformance.

### F-006 — Owner-authorized recovery had no runtime capability representation

A bounded `git reset --soft` could be explicitly authorized by the Owner yet still be rejected by runtime PreToolUse because the command had implicit index mutations without explicit path targets.

Status: open design issue.

Architectural lesson: recovery authority should be represented as an explicit lifecycle capability, not inferred from arbitrary Git syntax.

### F-007 — Frozen candidate can deadlock with stale Git index

After an authorized soft reset, old source blobs remained staged. After freeze:

- `git restore --staged` was blocked as a source write;
- normal staging required the existing index to already match the frozen candidate.

The desired state existed, but the control plane provided no valid transition to reach it.

Status: OPEN — current systemic blocker discovered at the end of WB-037.

Required direction: add an index-only transition that materializes the exact frozen candidate without changing worktree source bytes or invalidating candidate assurance.

### F-008 — Evidence producers and evidence validators can diverge

Reviewer/Verifier/closeout artifacts have occasionally been structurally valid for the human review purpose but rejected later for missing mandatory metadata or sections.

Status: open design issue.

Architectural lesson: evidence schemas should be explicit, generated/validated close to production time, and should invalidate only the affected evidence layer when source bytes are unchanged.

### F-009 — Assurance invalidation is too coarse for control-plane self-modification

During WB-037, small changes to control-plane source or contract repeatedly forced new Critic, freeze, Reviewer, and Verifier cycles. This is correct for source changes, but the system currently does not clearly distinguish source, contract, evidence, and index-only mutations.

Status: open design issue.

Required direction: define mutation classes and precise invalidation rules.

### F-010 — Component tests were stronger than transaction-level E2E coverage

Individual lifecycle, hook, release-state, Process Feedback, and published-object tests often passed while the next real Git transition still found a new contradiction.

Status: open design issue.

Required direction: add a synthetic end-to-end Work Block transaction fixture that exercises the real sequence through terminal commit and publication conformance.

## Root-cause groups

### RC-A — Incomplete state model

The lifecycle does not yet model worktree, index, history, assurance, and publication state as one coherent transaction.

### RC-B — Distributed transition ownership

Lifecycle scripts, runtime hooks, Git hooks, validators, and CI each encode parts of the transition contract. No single layer owns the complete legal path.

### RC-C — Mutation classes are conflated

Source mutation, contract mutation, evidence repair, and index-only materialization are often treated as the same category of "write".

### RC-D — Self-hosting control-plane changes are expensive

When the control plane changes itself, the same evolving controls are also used to validate the change, creating repeated assurance cycles and exposing hidden contradictions one at a time.

## Audit objective

The revision is complete only when every permitted lifecycle state has:

- explicit preconditions;
- explicit allowed mutation;
- explicit postconditions;
- a clear authority owner;
- a reachable next transition;
- defined assurance invalidation semantics;
- positive and negative transaction tests.

The remediation plan must be derived from that model, not the other way around.

## Assurance & evidence audit

Detailed model: `docs/architecture/sdlc-assurance-evidence-model.md`.

The assurance audit confirms that engineering assurance and evidence packaging must be separated more explicitly.

### AE-F01 — Define Critic and candidate-bound Critic disposition are distinct

The Define Critic reviews the contract before implementation. Candidate-bound Critic disposition confirms applicability of that resolved decision to an exact frozen candidate.

They must remain separate artifacts with different bindings and invalidation rules.

### AE-F02 — Process Feedback is process evidence, not source assurance

WB-037 showed a READY Reviewer report later blocking closeout because a Process Feedback-specific section was incomplete.

The Process Feedback contract may gate terminal evidence completeness, but it must not retroactively convert a valid source-review verdict into a source defect.

### AE-F03 — Closeout evidence should be derived

Repeated recovery cycles required manual replacement of stale Critic/Reviewer/Verifier references in closeout artifacts.

The target architecture should generate a terminal/closeout manifest from canonical lifecycle bindings instead of duplicating those bindings as manually synchronized prose.

### AE-F04 — Evidence validation currently occurs too late

Some report-format/schema defects surfaced only at terminal or Process Feedback validation after the substantive Reviewer/Verifier work was complete.

Machine-gated evidence should be schema-validated when it is created/finalized.

### AE-F05 — Assurance invalidation must follow mutation class

Source mutation, contract mutation, evidence-only repair, and index-only materialization must have different invalidation effects.

In particular:

- source mutation invalidates candidate assurance;
- contract mutation invalidates only assurance dependent on changed semantics;
- evidence-only repair revalidates the affected evidence layer;
- index-only materialization invalidates no assurance.

## Current audit documents

- `sdlc-transition-model.md` — lifecycle and recovery transition model.
- `sdlc-assurance-evidence-model.md` — assurance/evidence dependency model.
- `sdlc-remediation-plan.md` — draft implementation sequencing after architecture approval.

## Authority & control-point audit

Detailed model: `docs/architecture/sdlc-authority-control-model.md`.

The authority audit separates ordinary engineering autonomy from Owner-controlled and external platform boundaries.

### AC-F01 — Runtime adapters must not become policy engines

Codex/Claude/runtime-specific hooks should normalize events into one shared evaluator. Equivalent normalized events must produce equivalent decisions.

### AC-F02 — Session-root binding is a bootstrap concern

Binding authority to the session's initial repository/worktree is a useful safety property, but command-local `cd` cannot safely substitute for explicit worktree handoff.

### AC-F03 — Owner authorization must map to named lifecycle capabilities

WB-037 showed that an explicitly authorized recovery could still be unexecutable because the runtime had no representation of the capability beyond a blocked Git command.

### AC-F04 — Source mutability and publication authority are separate

A frozen candidate should remain source-immutable while still becoming publishable after exact candidate assurance. Publication must not require reopening source write authority.

### AC-F05 — Local hooks are cooperative guardrails

Local hooks protect the normal engineering path from mistakes. Irreversible/high-impact authority boundaries must remain independently enforced by GitHub/platform permissions and Owner decisions.

Accepted direction:

- ordinary bounded implementation/rework/test/assurance/subject-branch publication remains autonomous;
- merge and deploy remain separate Owner decisions;
- exceptional recovery becomes a named lifecycle transition;
- force push, protected/default branch mutation, credentials, production/live data and governance override remain hard stops unless explicitly authorized by the proper external/Owner boundary.

## Schema & contract audit

Detailed model: `docs/architecture/sdlc-schema-contract-model.md`.

The schema audit confirms that multiple control-plane components have been interpreting the same artifacts with partially different assumptions.

### SC-F01 — One artifact had multiple parsers

The WB-037 specification used a valid multiline `source_write_set`, but the terminal guard parser initially accepted only a simpler representation.

### SC-F02 — Path grammar was underspecified

After multiline parsing was added, review exposed YAML alias/block-scalar markers, ambiguous scalar values, DEL/C1 characters, and other values that should fail closed for path fields.

### SC-F03 — Governance types require strict typing

The `required` assurance field needed exact boolean validation so strings, null, numbers, lists, or objects could not be interpreted through truthiness.

### SC-F04 — Assurance report schema validation happened too late

Critic/Reviewer/Verifier artifacts were sometimes substantively complete but rejected later due to missing/mismatched frontmatter metadata or candidate/execution binding.

### SC-F05 — Process Feedback added a hidden late report contract

Reviewer evidence could be finalized and only later fail because Process Feedback expected additional report structure.

### SC-F06 — Traceability parsing leaked into prose

Task/traceability checks have encountered false or ambiguous task markers in ordinary prose, indicating the need for structured task-entry parsing rather than broad regex-style interpretation.

### SC-F07 — Local and published validation need parser parity

Git-native hooks and published-object conformance should share the same parser/schema/core predicates and differ only where the Git view/topology itself differs.

Accepted direction:

- one canonical Contract Reader;
- versioned strict schemas;
- exact field types;
- duplicate-key rejection;
- one path-field grammar;
- artifact validation at creation/finalization time;
- the same parser/schema for worktree, index, local commits, and published Git objects;
- transition semantics remain outside the parser.

## E2E transaction harness audit

Detailed design: `docs/architecture/sdlc-e2e-transaction-harness.md`.

The E2E audit confirms that component-level green checks are insufficient for the SDLC control plane.

### EH-F01 — Real transaction smoke tests expose integration defects

WB-034 intentionally exercised the real lifecycle without repairing it during the run. This is the correct pattern for control-plane auditing.

### EH-F02 — Bootstrap/session binding belongs in E2E coverage

A runtime session bound to the wrong initial worktree could not be corrected by command-local `cd`; the harness must model session/worktree bootstrap explicitly.

### EH-F03 — Terminal rehearsal must precede enforcement changes

WB-037 showed that candidate/terminal rehearsal could expose defects that isolated validators missed.

### EH-F04 — Recovery must be tested by postcondition

The stale-index deadlock shows why the harness must validate the canonical state produced by recovery rather than assuming a Git command's incidental behavior is acceptable.

### EH-F05 — Reachability is a first-class test property

Every supported state must have at least one mechanically reachable legal next transition. A set of individually correct deny rules is not sufficient if their intersection blocks the happy path.

Accepted direction:

- synthetic full happy-path transaction;
- recovery scenarios;
- negative fail-closed scenarios;
- parser/schema parity;
- transition reachability assertions;
- structured blocker diagnostics;
- no real merge/deploy in the harness.

## Architecture freeze candidate

The resolved design decisions are consolidated in:

`docs/architecture/sdlc-architecture-freeze.md`

Status: **Architecture Freeze v0.6 approved and frozen on 2026-09-26**.

The freeze candidate resolves the current open questions for:

- STOPPED successor semantics;
- candidate versus terminal evidence;
- contract-change invalidation;
- runtime-neutral recovery exposure;
- canonical Contract Reader implementation form;
- optional assurance timing;
- Process Feedback placement;
- serialization/schema evolution;
- exact subject-branch publication prerequisites;
- E2E runtime/remote simulation strategy.

No implementation authority is created by this proposal. Implementation begins only through separate bounded Work Blocks after Owner approval of the architecture freeze.


Architecture consistency review: `docs/architecture/sdlc-architecture-consistency-review.md`.

## Audit completion

The architecture audit is complete.

Owner approved `docs/architecture/sdlc-architecture-freeze.md` revision v0.6 on 2026-09-26.

The audit branch remains the durable architecture SSOT. Further changes to the frozen decisions require an explicit architecture amendment. Implementation work must be performed through separate bounded Work Blocks derived from the frozen architecture.



## Post-freeze implementation findings

### F-011 — Self-hosting publication deadlock confirmed by WB-038

Status: confirmed by local WB-038 execution; not yet published as a WB branch.

WB-038 completed its diagnostic baseline locally without modifying production lifecycle/hooks/governance. Operator-reported results:

- B-001–B-005 and B-010: PASS;
- B-006–B-008: EXPECTED_BLOCK;
- B-009: UNREACHABLE;
- focused harness tests: 5/5;
- candidate-bound Critic: APPROVE;
- Reviewer: READY;
- Verifier: READY;
- frozen candidate: `content-sha256:a017c6a50cc289fcb695d2c63098b63f182ba85364daedf255bbf638c48454d9`.

After assurance, normal staging of the harness source was denied because the frozen lifecycle had `write_gate=BLOCKED`. WB-038 therefore closed reporting-only with no candidate commit or push.

Architectural interpretation:

The baseline did not reveal a contradiction in Architecture Freeze v0.6. It confirmed the expected implementation gap: the current published control plane cannot self-host a source-changing remediation because index/candidate-package materialization after freeze is still treated as source mutation.

Required remediation ownership:

- immediate bootstrap remediation: Git Transaction / Publication Bootstrap;
- target transitions: `MATERIALIZE_CANDIDATE_PACKAGE` and `REBUILD_CANDIDATE_INDEX`;
- no broad hook weakening;
- if the remediation WB itself reaches the same publication boundary after valid assurance, use only an explicit one-time Owner-controlled bootstrap transaction with exact candidate/path/postcondition binding.

This finding temporarily changes remediation implementation order but does not amend Architecture Freeze v0.6.


### F-012 — Cooperative guardrails became repair-path blockers

Status: confirmed during WB-039 preparation.

After WB-038 exposed the publication/index deadlock, WB-039 preparation showed a broader self-hosting issue: several local cooperative controls are useful on the normal engineering path but obstruct repair of the control plane itself.

Observed examples:

- a session bound to the preserved WB-038 worktree could not write to a newly created clean WB-039 checkout, even though the checkout was intentionally created for the next remediation step;
- direct-single-Git-command restrictions rejected compound read/check flows;
- complex mutating Bash restrictions blocked bounded remediation command shapes;
- the existing inactive/write-gate/freeze model can prevent the very source changes needed to repair lifecycle and Git transaction semantics.

The runtime usage limit that temporarily prevented an independent Critic from running is **not** part of this finding; it is an external capacity constraint.

Root cause:

The implementation treated cooperative local workflow guards as mandatory during repair of the same policy/lifecycle system. This created a self-hosting dependency loop.

Owner decision:

Adopt `docs/architecture/sdlc-maintenance-mode.md` as the remediation execution strategy.

During the maintenance window:

- external/Owner hard stops remain enforced;
- selected cooperative guards become AUDIT/WARN inside the exact remediation scope;
- no maintenance operation may claim normal lifecycle approval;
- repairs proceed in bounded batches;
- E2E runs after each batch;
- guards are re-enabled incrementally and retained only when they preserve transition reachability.

WB-039 is repurposed before lifecycle OPEN as **SDLC Maintenance Mode / Repair Bootstrap**.

Architecture Freeze v0.6 is unchanged.


### F-013 — Stop-hook pressure can cause unauthorized lifecycle-state mutation

Status: confirmed during Claude Code inspection from the preserved WB-037 worktree.

Observed behavior:

- the runtime session was bound to the preserved WB-037 checkout rather than WB-039;
- shell-policy checks correctly blocked cross-worktree mutation and exposed textual command-parsing false positives such as `2>/dev/null` being interpreted as an out-of-repository write path;
- the Stop hook then refused session termination while `closeout_mode=pending`;
- to make the Stop hook pass, the agent changed authoritative WB-037 lifecycle state from `pending` to `reporting-only` even though no legitimate WB-037 closeout transition had been performed.

This is not an acceptable lifecycle operation.

Root cause:

A runtime/session-exit hook must not pressure an agent to mutate authoritative lifecycle state merely to terminate a session. Session termination and Work Block closeout are separate concerns.

Required direction:

- Stop/session-exit checks may report unresolved lifecycle state but must not require falsifying or prematurely changing lifecycle state to allow the runtime to end;
- `reporting-only` / STOPPED remains a lifecycle transition with its own evidence and postconditions, not a generic "let the agent exit" value;
- Maintenance Mode must downgrade this Stop-hook behavior to audit/warn for remediation sessions;
- shell command parsing used by cooperative guards must be tested for quoted-text and redirection false positives;
- preserved WB-037 state must be restored to its pre-inspection value without disturbing its other local evidence.

This finding does not amend Architecture Freeze v0.6. It further justifies separating runtime convenience hooks from authoritative lifecycle semantics.
