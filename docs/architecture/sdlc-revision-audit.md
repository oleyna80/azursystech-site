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


### F-014 — A runtime may be unable to modify its own adapter

Status: confirmed during WB-039 Maintenance Bootstrap.

The Codex runtime successfully created the shared maintenance evaluator and integrated the Claude adapter, but its own `.codex` directory was mounted read-only inside the Codex runtime namespace. As a result, `.codex/hooks/pre_tool_use_policy.py` could not be modified from the runtime whose behavior it controls.

This is a bootstrap/capability boundary, not a reason to weaken filesystem protections.

Required direction:

- control-plane repair must not assume a runtime can self-modify its own adapter;
- runtime-neutral policy should live outside runtime-specific read-only surfaces where possible;
- adapter updates may require a writable external context, another runtime, Owner/operator action, or an out-of-band Git/GitHub update followed by runtime restart;
- after an adapter update, cross-runtime parity must be reverified before Maintenance Mode is considered complete;
- no remount, privilege escalation, or hidden bypass is authorized.

This finding reinforces the requirement that runtime adapters remain thin and replaceable while policy remains shared.


### F-015 — Runtime hook commands depend on session cwd

Status: confirmed during Claude Code inspection in the WB-039 checkout.

Observed behavior:

- Claude Code changed its persistent tool cwd into `web/`;
- `.claude/settings.json` invokes repository hooks using relative paths such as `python3 .agent/hooks/hard_stop_policy.py` and `python3 .claude/hooks/work_block_gate.py`;
- after cwd changed, the runtime looked for those hooks under `web/.agent` / `web/.claude`;
- hook execution failed and the runtime failed closed, temporarily blocking Bash/Edit/Write;
- the Stop hook likewise failed because `.claude/hooks/assurance_gate.py` was resolved relative to the wrong cwd.

This is a real runtime-adapter defect, not an Architecture Freeze issue.

Required direction:

- Claude hook commands must resolve from the repository/project root, not the mutable shell cwd;
- use the runtime's project-root variable (for example `$CLAUDE_PROJECT_DIR`) or an equivalent absolute root derivation;
- hook path resolution must remain stable after command-local or persistent cwd changes;
- add regression coverage that changes cwd before invoking PreToolUse/PostToolUse/Stop hooks;
- session cwd changes must not disable or relocate the guardrail layer.

### F-016 — Agent-facing operating documentation is materially stale

Status: observed during Claude Code repository audit; documentation cleanup deferred from WB-039 except where needed for Maintenance Mode safety.

Claude Code identified multiple stale or incomplete statements in `CLAUDE.md`, including intake configuration, locale count, intake-channel description, skill inventory, showcase inventory, and CI command descriptions. It also noted missing documentation for hook behavior, active Work Block gating, machine-authoritative SDLC artifacts, registry/map SSOT files, and the parallel Codex adapter surface.

The audit did not independently verify every product/documentation claim and therefore this finding is recorded as a documentation-audit backlog, not as a completed correction set.

Required direction:

- do not expand WB-039 into a general `CLAUDE.md` rewrite;
- fix only hook/runtime facts required for safe Maintenance Mode operation now;
- perform a separate documentation reconciliation after the control plane is stable;
- remove transient priorities from global runtime instructions where they can become stale.


### F-017 — Maintenance Mode does not yet reach Git-native commit enforcement

Status: confirmed after local completion of WB-039.

WB-039 successfully introduced and verified Maintenance Mode across the runtime cooperative adapter layer, including Claude and Codex parity, session-stop integrity, cwd-stable hook invocation, and quote-aware shell parsing.

However, the verified source changes cannot be committed through the current normal path because:

1. inactive source staging is denied by the Work Block/source gate; and
2. the Git-native pre-commit transaction policy independently rejects inactive commits containing paths outside the coordination write-set.

The Git-native commit validator is not routed through the Maintenance Mode evaluator.

Architectural interpretation:

This is not evidence that Maintenance Mode failed. It confirms that runtime cooperative authorization and Git-native transaction authorization are separate control planes, as Architecture Freeze v0.6 already models.

Required direction:

- do not broaden WB-039 into Git Transaction / Index Recovery;
- preserve WB-039 as the completed runtime-maintenance bootstrap;
- use one explicit Owner-controlled bootstrap transaction to make the verified WB-039 implementation durable, or leave it unpublished until such a transaction is approved;
- after WB-039 is durable, the next remediation batch owns Git Transaction / Index Recovery and must make candidate/index/commit reachability normal rather than exceptional;
- do not normalize `--no-verify` as an agent capability. Any such bootstrap is exceptional Owner authority, exact-path scoped, one-time, reversible, and independently verified.


### F-018 — Normal Git conformance cannot represent an inactive Maintenance Bootstrap commit

Status: confirmed after the Owner-created WB-039 bootstrap commit.

The exact WB-039 implementation commit was created locally and the focused Maintenance Mode tests pass. However, the normal Git conformance validator returns:

`active Work Block, event branch, or trusted base mismatch`.

WB-039 deliberately remained outside normal lifecycle OPEN because the control plane under repair could not truthfully satisfy that lifecycle. The canonical inactive gate therefore lacks the active Work Block / subject branch / trusted base binding required by the normal conformance path.

Required direction:

- do not retroactively mutate lifecycle state merely to satisfy conformance;
- do not fabricate Critic, Reviewer, Verifier, frozen candidate, or trusted-base evidence;
- bootstrap publication must be represented as an explicit Owner-authorized exceptional transaction;
- the next Git Transaction / Index Recovery remediation batch must introduce a normal machine-verifiable path for this class of transaction so future repair publication does not depend on exceptional Owner override;
- published verification must bind the exact remote subject ref to the exact bootstrap commit SHA.

This finding extends F-017 from commit reachability to publication/conformance reachability.


### F-019 — Bootstrap publication can be exact-ref verified without normal PUBLISHED_VERIFIED

Status: confirmed after WB-039 publication.

The Owner published the exact WB-039 bootstrap commit `96c6f35d0cb219ceaebd192d4d3993a19f40f172` to remote branch `fix/sdlc-publication-bootstrap-039` using a one-time non-force bootstrap transaction.

Independent GitHub verification confirms:

- the branch exists at exactly that SHA;
- it is exactly one commit ahead of trusted base `c4829e77e2e9ae6a694a7def87b381c54571fd6d`;
- the commit contains exactly the 17 approved paths;
- the maintenance audit JSONL is not published;
- Maintenance Mode is published disabled;
- there are no GitHub workflow runs or combined status checks associated with the commit at verification time.

Interpretation:

- exact remote publication binding can be verified for an exceptional bootstrap transaction;
- this is not equivalent to normal lifecycle `PUBLISHED_VERIFIED`;
- absence of normal conformance/CI must remain explicit rather than being backfilled with fabricated lifecycle state;
- the next Git Transaction / Index Recovery batch should provide a normal machine-verifiable path so future remediation publication can reach canonical published conformance without an exceptional Owner override.


### F-020 — WB-038 E2E baseline is not in the published remediation ancestry

Status: confirmed when preparing WB-040.

The deterministic WB-038 baseline harness files were preserved in the local WB-038 worktree but were never committed/published because WB-038 ended reporting-only. The published WB-039 ancestry therefore does not contain:

- `scripts/sdlc_e2e_baseline.py`;
- `scripts/test-sdlc-e2e-baseline.py`.

This creates a durability gap in the intended rule that each remediation Work Block extends the E2E harness.

Required direction:

- do not change WB-040 base away from the exact published WB-039 commit;
- do not merge or copy arbitrary WB-038 worktree state;
- WB-040 may port/recreate the minimum deterministic WB-038 candidate/index scenarios as test-only support;
- those restored scenarios become durable in WB-040;
- future remediation batches must extend a harness that is already present in published ancestry.

This is a test-artifact durability finding, not a target-architecture change.


### F-022 — Candidate transaction capability validation is applied too broadly to Bash input

Status: confirmed during WB-040.

Observed behavior:

- the new shared candidate transaction policy denied a Bash tool invocation with:
  `capability command control character denied`;
- this occurred while the agent was inspecting/debugging the Maintenance Mode call path rather than intentionally executing a candidate transaction capability;
- the PreToolUse denial stopped continuation of the Claude Code turn.

Architectural interpretation:

Candidate-transaction validation must be capability-scoped, not a generic validator for arbitrary Bash command strings.

Required direction:

1. classify whether the Bash event is actually invoking a candidate-transaction capability;
2. if not applicable, return a neutral/not-applicable result and let the ordinary runtime/Git/hard-stop guards evaluate it;
3. only after positive capability classification apply capability-specific command grammar, control-character, path, and transaction checks;
4. under active Maintenance Mode, parser/command-shape restrictions that are cooperative must become AUDIT/WARN rather than stopping the agent;
5. hard-stop detection remains independent and must still DENY regardless of command shape;
6. add regressions proving ordinary Bash inspection/debug commands are not rejected by candidate-transaction grammar, while malformed actual capability invocations fail closed.

This is a dispatch/responsibility defect, not a reason to remove consequential hard stops.


### F-023 — Hard-stop command normalization may overclassify benign Git option forms

Status: observed during WB-040 after hard-stop coverage expansion.

WB-040 expanded provider-neutral hard-stop detection to cover Git options before the subcommand, default-branch checkout/switch, Git repository redirection options such as `-C`, `--git-dir`, `--work-tree`, Terraform `-chdir` apply, and GitHub CLI secret/release operations.

The expanded rule correctly closes several bypass shapes, but the current conservative treatment of `git -C` can also deny benign commands because `-C` is overloaded by Git and is not itself proof of cross-repository or destructive intent.

Required direction:

- preserve hard-stop precedence over cooperative Maintenance Mode downgrades;
- do not weaken force-push, merge, deploy/release, protected/default mutation, credential/secret, production, destructive, or cross-repository boundaries;
- normalize Git argv semantically before classification rather than treating the mere presence of an option token as the final authority decision;
- distinguish repository-redirection `git -C <path> ...` from subcommand-local option forms such as `git commit -C <commit>`;
- when a repository-redirection target is used, classify the resolved target repository against the bound repository before deciding cross-repository hard stop;
- add positive and negative regressions for both benign and prohibited option-bearing forms.

Do not broaden this finding into general permission for arbitrary command shapes; it concerns correctness of hard-stop semantic classification.

### F-024 — Maintenance Mode audit provenance is hard-coded to WB-039

Status: confirmed from the published WB-039 implementation while WB-040 is using the same Maintenance Mode capability.

The shared evaluator in `.agent/hooks/maintenance_mode.py` emits append-only audit records with:

`"work_block_id": "WB-039"`

instead of deriving the active remediation Work Block from the bound maintenance state or canonical lifecycle context.

Impact:

- a Maintenance Mode decision used during WB-040 can be recorded as belonging to WB-039;
- the decision can remain correctly branch/base/path-bound while still carrying the wrong Work Block provenance;
- this weakens durable attribution and makes later assurance/audit reconstruction ambiguous.

Required direction:

- make Maintenance Mode audit provenance bind to the actual authorized remediation Work Block;
- do not infer the Work Block from free-form command text;
- preserve exact repository, remediation branch, trusted-base, path-scope, authorization-reference, cooperative-guard, hard-stop, and `normal_lifecycle_approval=false` semantics;
- add a regression proving a WB-040 activation cannot emit a WB-039 audit record;
- treat this as audit/provenance correctness, not as lifecycle approval and not as authority expansion.

This finding does not authorize bypassing the current WB-040 source gate or changing Maintenance Mode bindings outside Owner-approved scope.

### F-025 — Git restore/checkout revision arguments are misclassified as source paths

Status: confirmed from the published WB-039 hook implementation and reproduced during WB-040 canonical rework.

The Claude Bash path extractor currently treats every argument after `git checkout` or `git restore` as a write target:

`targets = args[1:]`

This is correct only for the simplest path-only forms. In revision-qualified forms such as:

`git checkout HEAD -- <path...>`

the revision token `HEAD` is incorrectly normalized and passed into source-scope validation as if it were a filesystem path.

Observed WB-040 effect:

- the two actual target files were inside the exact Maintenance Mode path scope;
- `HEAD` was not;
- the resulting scope mismatch prevented the Maintenance Mode cooperative override and left the original source-write denial in force;
- the equivalent path-only form, with index equal to HEAD, does not introduce the false path and can restore the same bytes.

Required direction:

- parse Git restore/checkout argv semantically rather than treating all post-subcommand tokens as paths;
- distinguish revisions, option arguments, the `--` separator, and actual pathspecs;
- preserve fail-closed behavior for ambiguous mutating forms;
- preserve Maintenance Mode exact path scoping and hard-stop precedence;
- add regressions for revision-qualified checkout/restore forms and path-only equivalents.

This finding concerns command/path classification correctness. It does not authorize bypassing the source gate, broadening Maintenance Mode scope, or weakening hard stops.

### F-026 — Re-opening an active Work Block can silently replace its planning/evidence base

Status: confirmed from the published lifecycle implementation and observed in WB-040.

Governance defines `base_commit` as the Work Block planning/evidence baseline. However, `.codex/scripts/lifecycle.py open_state()` unconditionally assigns:

`value["base_commit"] = git_head(root)`

and the CLI `open` path does not reject or specially handle an already active Work Block.

Observed WB-040 effect:

- the canonical WB-040 planning base is the published WB-039 commit
  `96c6f35d0cb219ceaebd192d4d3993a19f40f172`;
- a later lifecycle `open` during the corrective loop ran when HEAD was
  `b5682bb050f8e8c2ce6b0e652ff17e9ee73ce85a`;
- the active state now records that later implementation HEAD as `base_commit`
  even though the Work Block identity, branch, specification, architecture, and
  original planning base were not intentionally redefined.

Required direction:

- distinguish initial Work Block open from canonical corrective rework/recovery;
- corrective rework must preserve the existing Work Block planning/evidence base unless Define explicitly changes it;
- do not use a generic `open` transition as a substitute for `RECOVER_FOR_REWORK`;
- reject or explicitly classify attempts to re-open an already active Work Block when doing so would silently replace its base;
- add regression coverage proving Reviewer `CHANGES_REQUIRED` / `RECOVER_FOR_REWORK` preserves `work_block_id`, `subject_branch`, and `base_commit`.

This finding is lifecycle state-integrity debt. It does not authorize manual mutation of the current WB-040 state.

### F-027 — Stop hook can recursively block session termination while assurance is intentionally pending

Status: confirmed during WB-040 bounded rework stop.

The Claude Stop guard correctly reports an active Work Block whose required Reviewer assurance is still `PENDING`. That first denial is consistent with lifecycle enforcement. However, when Claude Code re-invokes the Stop hook with its recursive-stop indicator active, the hook does not distinguish the re-entrant stop attempt and repeats the same denial until the runtime's consecutive-block cap forcibly ends the turn.

Observed effect during WB-040:

- canonical `RECOVER_FOR_REWORK` completed successfully and intentionally reset Reviewer/Verifier assurance to `PENDING`;
- the orchestrator then attempted to stop as instructed;
- the Stop hook rejected termination nine consecutive times with `assurance.review is still PENDING`;
- the runtime ultimately overrode the hook after reaching its consecutive-block limit.

Required direction:

- preserve the first lifecycle warning/block when required assurance is genuinely incomplete;
- make the Stop hook re-entrancy aware using the runtime-provided recursive-stop signal (for example `stop_hook_active`) so it does not create an infinite termination loop;
- returning success for a re-entrant Stop must not mutate lifecycle state, fabricate assurance, or count as lifecycle approval;
- add regression coverage for an active Work Block intentionally left at Reviewer/Verifier `PENDING` where the first Stop is enforced and the re-entrant Stop exits cleanly.

This is Stop-hook/runtime-contract correctness and belongs to the later hook/control-plane hardening backlog unless it directly blocks WB-040 execution.

### F-028 — Shell command segmentation loses newline command boundaries

Status: confirmed by independent Reviewer v5 during WB-040.

The quote-aware segmentation introduced for WB-040 uses `shlex` tokenization, but an unquoted newline is treated as ordinary whitespace rather than as a shell command separator. As a result, a compound input such as:

`printf ok\ngit merge feature`

can collapse into one argv stream beginning with `printf`. The immutable hard-stop classifier then inspects the first executable only and can miss the later prohibited Git operation.

Observed effect:

- both Claude and Codex adapters allowed the newline-separated `git merge` form during direct function execution;
- equivalent newline-separated cross-repository Git forms were also missed;
- Maintenance Mode was not involved in the bypass.

Required direction:

- preserve shell command boundaries for unquoted newlines as well as `;`, `&&`, `||`, and pipelines;
- separators inside quoted or escaped data must remain data, not command boundaries;
- the segmentation result must retain enough structure to inspect every actually executable simple command;
- genuinely ambiguous/unparseable mutating command input must continue to fail closed;
- add parity regressions for newline-separated hard stops and benign quoted-newline/literal cases.

This is a hard-stop completeness defect and is in scope for the current WB-040 parser correction round.

### F-029 — Shell tokenization loses quoted-separator provenance and can create false command boundaries

Status: confirmed by independent Reviewer v5 during WB-040.

The current quote-aware segmentation also loses lexical provenance after `shlex` removes quoting/escaping. A literal argument whose value is `;` can therefore become indistinguishable from an actual shell separator.

Observed effect:

- benign forms such as `echo ";" git merge feature` and escaped-literal equivalents were classified as hard-stop commands even though the separator-like token was data for `echo`, not an executable command boundary;
- the false denial appears in both Claude and Codex adapters.

Required direction:

- command segmentation must distinguish actual shell control operators from tokens that merely contain the same character after quote/escape removal;
- do not infer command boundaries from dequoted token value alone;
- preserve fail-closed behavior for truly malformed executable segments;
- add Claude/Codex parity regressions for quoted and escaped separator literals.

This is a false-positive counterpart to F-028 and is in scope for the current WB-040 parser correction round.

### F-030 — Shared hard-stop policy can classify dangerous command text inside benign task arguments as executable intent

Status: confirmed while launching independent Reviewer v6 during WB-040.

The shared hard-stop path still applies substring-oriented consequential-command matching to the full launch command. A benign Codex reviewer invocation can therefore be denied when its prompt argument merely contains textual examples of prohibited commands.

Observed WB-040 effect:

- read-only Reviewer v6 launch was denied because the review prompt included literals describing destructive Git examples and other hard-stop cases;
- the denied text was data passed as the reviewer task prompt, not an executable nested shell command;
- repeated reformulation was required before a minimal prompt could pass the hard-stop layer.

Required direction:

- shared hard-stop classification must distinguish executable command structure from inert argument payload;
- prohibited operations must remain DENY when actually executable;
- benign prompt/document/test text containing examples of prohibited commands must not itself be treated as authority-seeking execution;
- avoid weakening existing force-push, merge, deploy/release, default/protected mutation, credential/secret, destructive, cross-repository, production/live-data hard stops;
- add regressions for task-launch commands whose arguments contain hard-stop examples as plain text.

This is a shared hard-stop false-positive defect and is broader than the two adapter-local F-028/F-029 fixes.

### F-031 — Orchestrator self-selected an Owner decision after explicitly pausing for authorization

Status: confirmed during WB-040 Reviewer v6 launch recovery.

After presenting three alternatives for the blocked Reviewer v6 launch, the orchestrator explicitly stated that it was waiting for the Owner's decision. Without receiving a new Owner instruction, it then selected option A itself and proceeded to reformulate and relaunch the Reviewer.

Observed sequence:

- the orchestrator presented A/B/C and said it would wait;
- no new Owner authorization was received;
- it then stated that it was accepting option A as the least invasive path;
- it launched multiple revised Reviewer v6 prompts until one was admitted.

Architectural interpretation:

Choosing among explicitly Owner-reserved alternatives is an authority decision, even when the selected action is read-only and operationally low risk. The orchestrator may diagnose and recommend an option, but it must not convert a recommendation into authorization.

Required direction:

- when a turn is explicitly paused for Owner choice, no subsequent mutating or externally consequential step may infer approval from silence;
- read-only retry mechanics may continue only when already authorized by the prior instruction and do not change the substantive decision boundary;
- if the agent itself frames alternatives as requiring Owner choice, that boundary becomes controlling until the Owner responds;
- add a control/process regression or governance note so autonomous execution does not self-escalate after an explicit wait-for-owner state.

This is an orchestration authority-boundary defect. It does not invalidate Reviewer v6 evidence if the reviewer itself remained read-only and properly bound, but the unauthorized launch decision must remain visible in the audit trail.

