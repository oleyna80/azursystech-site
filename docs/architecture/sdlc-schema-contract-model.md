---
artifact_type: architecture_model
status: draft
scope: docs-only
not_work_block: true
---

# SDLC Schema & Contract Model

## Purpose

This document defines how SDLC artifacts are parsed, typed, validated, versioned, and consumed across lifecycle, hooks, local validators, and published-object conformance.

It is an architectural draft. It does not grant implementation authority.

## Core principle

> One artifact contract must have one canonical parser/schema implementation. Every consumer may add context-specific semantic checks, but no consumer may reinterpret the artifact syntax independently.

WB-037 showed that the same specification/report could be accepted by one part of the control plane and rejected later by another because different code paths implemented different assumptions about frontmatter, scalar types, lists, metadata, and bindings.

## Contract layers

Every machine-gated artifact is validated in four layers.

### Layer 1 — Syntax

Questions:

- Is the document structurally parseable?
- Is frontmatter delimited correctly?
- Are duplicate keys rejected?
- Are indentation and collection structures valid?
- Are unsupported YAML constructs rejected where the contract does not allow them?

Syntax validation must be deterministic and shared.

### Layer 2 — Type/schema

Questions:

- Are required fields present?
- Are fields the exact declared types?
- Are enum values valid?
- Are lists non-empty where required?
- Are path entries strings in the accepted path grammar?
- Are booleans actual booleans rather than truthy/falsy coercions?

Type validation must not rely on language truthiness.

Example invariant:

`required: false` is valid boolean false.

The following are invalid substitutes:

- `required: "false"`;
- `required: null`;
- `required: 0`;
- list/object values.

### Layer 3 — Binding

Questions:

- Does the artifact refer to the correct Work Block?
- Does specification revision match?
- Does branch/base match where applicable?
- Does assurance evidence bind the exact frozen candidate?
- Does execution id/context id match the lifecycle-prepared role execution?
- Does a terminal projection bind the exact candidate parent?

Binding validation is context-dependent but must consume the same parsed typed artifact.

### Layer 4 — Transition semantics

Questions:

- Is this artifact valid for the requested lifecycle transition now?
- Is the transition allowed from the current lifecycle state?
- Does the artifact satisfy the specific gate being crossed?

This layer belongs to lifecycle/shared policy, not to the parser.

## Canonical contract reader

Introduce one runtime-neutral **Contract Reader** used by:

- lifecycle commands;
- runtime/shared policy;
- Git pre-commit/pre-push validators;
- local standalone validators;
- published-object conformance;
- synthetic E2E harness.

Responsibilities:

1. read artifact bytes from an explicit source;
2. parse the permitted document/frontmatter syntax;
3. reject duplicate keys;
4. reject unsupported constructs;
5. validate exact field types;
6. validate artifact schema version;
7. return a typed canonical representation;
8. produce stable machine-readable validation errors.

The Contract Reader must not:

- inspect lifecycle state;
- grant authority;
- decide whether a transition is allowed;
- silently normalize malformed values into valid ones;
- infer missing bindings.

## Source of bytes

The same schema must be applicable to different Git views.

The caller explicitly chooses the source:

- worktree bytes;
- index/staged bytes;
- committed tree at exact SHA;
- published Git object.

The parser/schema logic is identical regardless of source.

This prevents the local hook and published-object validator from implementing separate interpretations of the same artifact.

## Supported syntax profile

Do not treat arbitrary YAML as an unlimited configuration language.

Use a documented constrained profile suitable for governance artifacts.

Required support should include only constructs actually needed by SDLC artifacts, such as:

- scalar strings;
- strict booleans;
- integers only where explicitly declared;
- simple mappings;
- simple sequences of scalar values;
- nested mappings/sequences where a schema explicitly declares them.

Fail closed on unsupported/ambiguous constructs unless a schema explicitly permits them.

Examples requiring explicit rejection in path lists and governance metadata include:

- aliases/anchors;
- block scalar syntax where scalar path values are expected;
- ambiguous implicit YAML values when the schema expects a path string;
- control characters;
- empty entries;
- malformed indentation;
- duplicate keys.

A schema validator must validate the resulting semantic type as well as lexical constraints relevant to the field.

## Path field contract

Path-bearing fields such as `source_write_set` and `coordination_write_set` need one canonical path grammar.

Minimum invariants:

- non-empty string;
- repository-relative;
- no control characters;
- no path outside repository root;
- no unsupported YAML syntax masquerading as a path;
- deterministic glob interpretation where globs are allowed;
- exact distinction between literal path and glob pattern;
- normalized separator semantics;
- no duplicate semantic entries after normalization.

Path parsing and Git path selection remain separate concerns:

- schema validates the declared path value;
- Git Transaction Layer resolves the effective Git-selected paths;
- policy validates that effective selection is inside declared authority.

## Artifact schema registry

The Contract Reader should dispatch by `artifact_type` and `schema_version`.

At minimum define explicit schemas for:

### C-001 — Specification

Required concepts:

- artifact type;
- Work Block id;
- revision;
- status;
- source write-set;
- coordination write-set where used;
- requirements / acceptance references as defined by the SDLC.

Consumed by:

- Define admission;
- freeze;
- assurance binding;
- terminal/published conformance.

### C-002 — Active Work Block state

Prefer JSON or another strictly typed serialization for authoritative mutable lifecycle state.

Required concepts include:

- schema version;
- Work Block identity;
- branch/base;
- contract binding;
- write-sets;
- lifecycle/write-gate state;
- frozen candidate identity;
- assurance bindings/dispositions;
- lifecycle note / closeout mode where applicable.

Every mutation must validate the complete new object before authoritative persistence.

### C-003 — Define Critic report

Required binding:

- artifact type/schema version;
- Work Block;
- exact specification revision/digest where used;
- verdict/status;
- execution/context provenance required by the assurance model.

### C-004 — Candidate-bound Critic disposition

Required binding:

- Work Block;
- specification path/revision;
- original Define Critic evidence;
- original resolved verdict/status;
- exact frozen candidate;
- disposition;
- skip reason when applicable.

### C-005 — Reviewer report

Required binding:

- Work Block;
- exact frozen candidate;
- specification revision;
- execution identity;
- verdict;
- role/provenance metadata required by the assurance policy.

Process Feedback data should not be hidden as an undocumented later parser requirement.

### C-006 — Verifier report

Same binding principles as Reviewer, with exact verifier execution and candidate binding.

### C-007 — Test evidence

Required concepts:

- Work Block/candidate binding where relevant;
- suite/command identifier;
- result;
- execution metadata needed for reproducibility.

### C-008 — Process Feedback record

Required concepts:

- stable observation id;
- Work Block linkage;
- classification;
- factual observation;
- authority = advisory/process-only as defined by policy.

Historical records should be append-only where required.

### C-009 — Terminal/closeout manifest

This should be generated from canonical lifecycle bindings rather than manually duplicating mutable references.

Required concepts:

- Work Block;
- spec revision;
- exact candidate commit;
- exact frozen candidate identity;
- assurance refs/verdicts;
- optional dispositions;
- test evidence refs;
- Process Feedback disposition;
- closeout mode;
- STOPPED reason where applicable.

## Validation timing

### At artifact creation/finalization

Run full syntax + schema + intrinsic binding checks.

Examples:

- Critic report cannot be finalized if required revision metadata is absent;
- Reviewer report cannot become authoritative if execution/candidate/verdict metadata does not match;
- Verifier report cannot become authoritative if required frontmatter is absent.

This avoids discovering producer-schema defects only during closeout.

### At lifecycle transition

Do not reparse with a different implementation.

Use Contract Reader, then add transition-specific semantic checks.

Example:

- before freeze: spec binding/current write-set;
- before Reviewer finalize: exact prepared execution + frozen candidate;
- before closeout: all canonical refs resolved.

### At Git commit/push

Read exact staged/committed Git objects through the same Contract Reader.

Add Git-specific checks:

- staged path set;
- parent/child relationship;
- exact terminal projection;
- commit trailers;
- refspec/force semantics.

### In CI / published-object conformance

Read exact published Git objects through the same Contract Reader.

Do not maintain a second parser.

CI adds historical/topological checks that are only meaningful on published Git history.

## Error model

Validation errors should be stable structured results, for example conceptually:

- `SYNTAX_DUPLICATE_KEY`;
- `SCHEMA_MISSING_FIELD`;
- `SCHEMA_WRONG_TYPE`;
- `SCHEMA_UNSUPPORTED_CONSTRUCT`;
- `PATH_INVALID_VALUE`;
- `BINDING_WORK_BLOCK_MISMATCH`;
- `BINDING_CANDIDATE_MISMATCH`;
- `TRANSITION_NOT_ALLOWED`.

Human-readable messages can include details, but tests should assert stable error classes rather than fragile prose.

## Schema evolution

Every authoritative artifact contract needs an explicit schema version.

Rules:

- schema version changes are intentional;
- readers declare supported versions;
- unsupported future versions fail closed;
- migration must be explicit;
- published historical artifacts remain readable under their declared schema;
- do not silently reinterpret old artifacts according to new semantics.

Artifact business revision and schema version are different concepts.

Example:

- specification `revision: v21` = revision of WB contract;
- `schema_version: 2` = version of specification file format.

## Findings derived from WB-037

### SC-F01 — Terminal parser rejected a valid multiline write-set

The specification contract accepted a YAML sequence for `source_write_set`, while terminal guard parsing expected a simpler representation.

Impact:

A valid terminal transaction became unreachable even though other terminal predicates were valid.

Required direction:

One Contract Reader for both local terminal guard and published-object validation.

### SC-F02 — Parser hardening became an iterative discovery process

After multiline support, review found aliases/block scalars, YAML-ambiguous scalar values, DEL, and C1 control characters that the field-specific parser could accept as paths.

Impact:

Multiple rework/assurance cycles were spent discovering parser edge cases.

Required direction:

Define the complete path-field grammar and test it independently of lifecycle before enforcement.

### SC-F03 — Strict boolean semantics were missing

Malformed values such as string `"false"`, null, numeric zero, lists, or objects could be misinterpreted as optional assurance unless exact boolean validation was added.

Required direction:

Schema layer must enforce exact declared types before lifecycle semantics.

### SC-F04 — Assurance reports were produced before their schema was fully validated

Verifier/Reviewer/Critic reports could be substantively complete yet fail later because required frontmatter revision, execution id, candidate binding, or verdict metadata was missing/mismatched.

Required direction:

Artifact finalization and schema validation must be one operation.

### SC-F05 — Process Feedback introduced a late hidden report contract

Reviewer reports could later fail Process Feedback validation due to section/field requirements not enforced when Reviewer evidence was finalized.

Required direction:

Either make those fields part of the explicit Reviewer schema and validate at finalization, or move Process Feedback into its own artifact schema. Do not add hidden late-stage parsing requirements.

### SC-F06 — Tasklist/traceability grammar leaked into prose

Traceability checks encountered task-type/format issues and prose containing task-like markers.

Required direction:

Machine-readable task records need an explicit grammar/schema and validators must parse structured task entries rather than use broad textual pattern matching.

### SC-F07 — Published conformance and local validation can diverge

WB-037 required paired tests for Git-native terminal admission and published-object conformance because both paths could classify the same history/artifact differently.

Required direction:

Share artifact parsing and core semantic predicates. Keep only view-specific Git topology logic separate.

## Testing strategy

### Contract-unit tests

For each schema, exhaustive positive/negative fixtures independent of lifecycle.

For path lists, include:

- ordinary relative paths;
- globs allowed by contract;
- duplicates;
- empty entries;
- aliases/anchors;
- block scalars;
- implicit null/bool/number/date-like values where ambiguous;
- DEL/C1/control characters;
- traversal/outside-root forms;
- malformed indentation;
- duplicate mapping keys.

### Consumer parity tests

Feed identical artifact bytes to:

- lifecycle reader;
- runtime/shared policy;
- Git hook validator;
- published conformance reader.

All must produce the same parsed canonical object or the same schema error class.

### Git-view parity tests

Validate equivalent bytes from:

- worktree;
- index;
- local commit;
- published commit fixture.

Parser/schema result must be identical.

### Evolution tests

- supported old schema remains readable;
- unsupported future schema fails closed;
- business revision changes do not implicitly change file schema.

## Design decisions accepted so far

1. One canonical Contract Reader.
2. Artifact schemas are versioned and strictly typed.
3. Duplicate keys fail closed.
4. No truthiness coercion for governance booleans.
5. Path fields use one explicit grammar.
6. Local and published conformance share parser/schema logic.
7. Artifact finalization includes schema/binding validation.
8. Transition semantics remain outside the parser.
9. Git source view is an input to the reader, not a reason to duplicate parsing logic.
10. Closeout manifest is generated from typed canonical lifecycle/evidence bindings.

## Open questions

1. Which serialization should be canonical for each artifact class: JSON, constrained YAML frontmatter + Markdown body, or generated JSON sidecar plus human Markdown?
2. Should machine-authoritative metadata be separated from human narrative for Critic/Reviewer/Verifier reports?
3. Do specifications/tasklists need full structured schemas now, or should the first remediation focus only on fields used by enforcement?
4. Which existing historical artifact schema versions must remain supported without migration?
5. Should the Contract Reader expose a typed Python model, a language-neutral JSON canonical representation, or both?
