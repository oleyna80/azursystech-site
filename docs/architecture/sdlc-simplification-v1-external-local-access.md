# SDLC Simplification v1 — External Local Read / Import Authority

Status: Owner-approved WB-004 refinement  
Scope: orchestration capability boundary; no controller schema change

## Purpose

Allow an agent to reuse explicitly authorized local files from another project
without granting general filesystem authority or weakening the active Work Block
write policy.

Typical use case:

```text
Owner authorizes old-project/.claude/skills
→ agent reads selected skills
→ agent imports/adapts them into current repository
→ current Work Block destination scope remains authoritative
```

## Authority model

External local access is not part of schema-v2 Work Block state and is not added
to the immutable admission record.

It is an ephemeral capability supplied by trusted orchestration:

```text
ExternalImportGrant
  mode = read-only
  source_root = exact resolved local root
  destination_scope = bounded repository scope
```

The two sides are independent:

```text
source path
→ resolve real filesystem path
→ must remain inside admitted source_root
→ read only

destination path
→ resolve inside target worktree
→ must match grant destination_scope
→ must match active implementation_write_set
→ must pass normal WB structured-write policy
```

External read authority never expands repository write authority.

## Default behavior

Without an explicit grant:

- external local reads/imports are denied by this capability surface;
- no neighboring directory discovery is inferred;
- no source path may be used to widen destination scope.

A grant provides no API for:

- external write;
- external delete;
- external rename/move;
- grant mutation/widening.

## Symlinks

Source containment is checked after filesystem resolution.

A source symlink that resolves outside the admitted root is denied.

Recursive import does not traverse symlink directories. This is intentionally
stricter than ordinary filesystem copy behavior.

Destination paths are also resolved against the target worktree. Destination
symlink escape is denied by containment and direct destination symlinks are not
imported through.

## Runtime contract

Do not infer this authority from arbitrary shell text.

In particular, a command such as:

```sh
cp -R /old/project/.claude/skills/foo .claude/skills/foo
```

is not authorized because a project-local parser recognized `cp`.

The supported model is a structured operation equivalent to:

```text
import
  source=/old/project/.claude/skills/foo
  destination=.claude/skills/foo
  grant=ext-skills
```

or an equivalent runtime sandbox/tool arrangement where the source is mounted or
exposed read-only and repository mutation still flows through normal write-policy
enforcement.

Opaque Bash remains outside controller authority inference.

## Lifecycle relationship

External read/import grants:

- do not add lifecycle states;
- do not change admission_id;
- do not change authority profile/base binding;
- do not persist runtime/session/topology information;
- expire with the trusted orchestration context that carries them.

Imports into the repository are ordinary implementation mutations and therefore
must occur while the Work Block permits implementation writes. Candidate,
Reviewer, Verifier, Git, and publication behavior remain unchanged.

## Required regressions

The implementation must prove:

1. explicitly granted external file read succeeds;
2. ungranted sibling/project read is denied;
3. source symlink escape is denied;
4. no external write/delete capability is exposed;
5. admitted source → admitted implementation destination succeeds;
6. admitted source → non-WB destination is denied;
7. WB write scope cannot override a narrower grant destination scope;
8. a grant cannot be widened by the role consuming it;
9. a broker bound to another worktree cannot be reused;
10. import still passes normal Git/candidate/assurance/publication transactions.

## Rollout

WB-004 implements the orchestration contract and deterministic simulated
capability.

Live Claude/Codex exposure is deferred to the normal runtime/cutover wiring
stage. That wiring must expose a structured read/import capability or equivalent
read-only filesystem sandbox; it must not reintroduce shell authority parsing.
