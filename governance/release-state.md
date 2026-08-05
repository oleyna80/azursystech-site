# Release-State and SSOT Reconciliation Contract

## Purpose

This contract defines the repository-owned lifecycle state required before a
framework change may be treated as release-ready. It prevents completed Work
Blocks, navigation maps, machine registries, and closeout evidence from describing
contradictory states.

## Ownership Boundary

The repository owns and versions:

- Work Block lifecycle and verdicts;
- completed and active migration paths;
- review, verification, evaluation, drift, and closeout evidence;
- release-readiness classification based on repository evidence.

GitHub pull-request and merge state is **mutable external operational metadata**,
including:

- whether a pull request is Draft or Ready;
- whether it is open, closed, or merged;
- merge timestamps and merge commit SHAs;
- requested reviewers and branch deletion state.

Mutable GitHub state may be cited in an external notification or appended by a
separate post-merge record, but it must not be normative content of a pre-merge
closeout commit. A closeout records `repository closeout`, not a prediction or
copy of later hosting-platform state.

## Canonical Sources

1. Work Block frontmatter and its single `Final State` or legacy `Closeout State`
   section define the lifecycle of that Work Block.
2. `FILE_REGISTRY.yml:migration_state` is the machine-readable index of completed
   and active migration Work Blocks.
3. The machine block and visible `Migration Work` section in `PROJECT_MAP.md` are
   the human-readable projection of the same migration state.
4. Closeout reports provide evidence and classification; they do not override the
   Work Block or registry.
5. GitHub PR/merge state is external operational evidence and cannot override
   repository authority.

## Required Invariants

### Completed Work Blocks

A path listed in `completed_work_blocks` must:

- exist under `docs/plans/`;
- contain Work Block frontmatter;
- use `status: completed`;
- not be the active Work Block;
- contain exactly one terminal state section;
- declare exact terminal successful review, verification, drift, closeout, and
  optional task-state values;
- reject suffixes, rationales, or contradictory text appended to non-evaluation
  terminal values;
- reject `PENDING`, `BLOCKED`, `UNVERIFIED`, `MISALIGNED`, or any other adverse or
  non-terminal value;
- use exact `READY` or `SKIPPED — <non-empty rationale>` when an evaluation verdict
  is present.

Legacy `Drift Gate: READY` remains accepted for historical Work Blocks created
before `ALIGNED` became the canonical terminal drift token. New Work Blocks use
`ALIGNED`.

### Active Work Block

A non-null `active_work_block` must:

- exist;
- not appear in `completed_work_blocks`;
- have an active frontmatter status such as `draft`, `planned`, `in_progress`, or
  `blocked`;
- be represented as active inside the unique visible `## Migration Work` section
  of `PROJECT_MAP.md`.

When `active_work_block` is null, that section must explicitly state that there is
no active implementation Work Block.

### Closeout

A successful closeout must identify:

- exact `completed` repository execution state;
- exact `READY` review and verification verdicts;
- exact `ALIGNED` drift verdict;
- evaluation evidence whenever the latest Work Block declares an evaluation
  verdict, with exact `READY` or `SKIPPED — <non-empty rationale>` semantics;
- exact `SUCCESS` closeout classification and `completed` task state;
- non-normative external VCS state;
- one non-empty `## Residual Risks and Limitations` section;
- one non-empty `## Follow-Up Work` section.

Only an evaluation `SKIPPED` verdict may carry a dash-separated rationale. Review,
verification, drift, classification, execution, and task-state values are compared
as complete values; strings such as `READY — BLOCKED` or
`ALIGNED — MISALIGNED` fail closed.

Normalized closeout marker keys must be unique. Contradictory repeated markers fail
closed rather than using first-value-wins or last-value-wins behavior.

The `External VCS state` marker must begin with `non-normative`, and the remainder
of that marker must not contain a concrete mutable state such as Draft, Ready,
open, closed, merged, or unmerged. The marker declares an ownership boundary only;
it must not append a current or predicted hosting-platform state.

The mutable-state scan covers the entire closeout document, including parsed YAML
frontmatter and Markdown body. Syntax-dependent raw patterns run against the original
document before asterisk/underscore normalization; semantic state patterns then run
against the normalized copy. It rejects:

- prose assertions such as a pull request being open, Draft, or merged;
- terse identifier-plus-state assertions such as `PR #9 merged` or
  `Pull request #9 closed`;
- colon and equals forms;
- structured keys such as `pr_status`, `pull_request_state`, or equivalent nested
  hyphen/space variants when their value is a mutable state;
- parent-key forms such as `pr: {status: merged}` or
  `pull_request: {state: open}` by carrying VCS context through descendant fields;
- raw syntax-dependent forms such as `**Merge status:** open` and keys such as
  `merged_at` before Markdown normalization can erase their syntax;
- Markdown-emphasized forms after normalizing asterisk and underscore decoration,
  including italic, bold, and combined emphasis around mutable state tokens;
- Markdown table rows that pair a pull-request identifier with a mutable state;
- merge timestamps, merge commit state, or equivalent hosting-platform facts.

A clean non-normative ownership statement remains permitted; a concrete mutable
state assertion does not, including when appended to the boundary marker itself.

Every existing `closeout_report` under `docs/reports/closeout/` that binds to a
completed Work Block ID must retain approved status, exact successful lifecycle
markers, matching evaluation semantics, a non-normative external-state boundary,
and the required residual-risk and follow-up sections. Historical closeout drift
fails closed even when the latest closeout remains valid.

### Fail-Closed Release Readiness

Missing or contradictory evidence yields `BLOCKED`, never `READY`. A release-state
validator must reject at least:

- missing completed Work Block paths or terminal sections;
- completed Work Blocks with non-completed frontmatter or adverse lifecycle values;
- non-evaluation terminal values containing suffixes or contradictory text;
- active/completed path or Work Block ID overlap;
- missing or invalid active Work Block paths;
- map/registry or machine/visible-map disagreement;
- closeout identity mismatch or duplicate markers;
- missing or malformed required evaluation evidence;
- missing residual-risk or follow-up sections;
- normative mutable GitHub-state claims anywhere in the current canonical closeout,
  including terse identifier-plus-state prose, structured frontmatter, VCS parent-key
  descendants, boundary-marker payloads, and Markdown forms normalized before
  semantic state matching;
- adverse or contradictory lifecycle evidence in any existing closeout report bound
  to a completed Work Block ID.

## Enforcement

`scripts/validate-release-state.py` validates repository state.
`scripts/test-release-state-contracts.py` provides positive and adversarial
fixtures. `.github/workflows/release-state-contract.yml` runs both on pushes and
pull requests, while Framework Contracts invokes the same governance validation.

The release-state gate is assurance evidence only. It does not authorize merge,
deployment, publication, credentials, or Hard Stop exceptions.
