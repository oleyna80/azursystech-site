# SDLC Simplification v1 — Holistic Critic Closure Response

Status: ready for focused independent closure review  
Original Critic: `cd684f75f97fb860096f16f7deb2994ea036ee8d`  
Original reviewed head: `d8cd003426255deaea4e41044ce149dd7b3868d8`  
Corrected package head before this response: `aa58615b40f18a8b36827d245081da73166f4441`

This document records how the four Must findings from the holistic Critic were incorporated. It is not a Critic verdict and does not grant source implementation authority.

## M1 — Exact contract consistency

Status: addressed.

Corrections:

1. Missing-state open:
   - enforcement matrix now permits canonical INACTIVE or NO_LOCAL_AUTHORITY;
   - trusted admission is required before missing-state planning/open.

2. Critic READY:
   - `critic ready` is one atomic DEFINE -> EXECUTE transition;
   - there is no required persisted DEFINE+READY intermediate state;
   - READY binds the exact committed planning revision.

3. Successful terminal path:
   - separate successful `close` was removed from the enforcement contract;
   - durable closeout notes are prepared while ASSURE;
   - normal successful terminal transition is exclusively `publish -> remote verification -> INACTIVE`;
   - `close` remains reporting-only/cancelled.

Primary correction commit:
- `6329985ad4168c24c7460be7fe376b8740b68838`

## M2 — Reachable material revision

Status: addressed.

The revision transaction is:

```text
EXECUTE / ASSURE
-> revise begin
-> DEFINE
-> edit/commit planning
-> revise bind
-> Critic
-> EXECUTE
```

Key properties:

- no new persisted lifecycle state;
- `revise begin` happens before new planning edits exist;
- immutable WB/admission/profile/base identity is preserved;
- candidate/assurance is cleared as applicable;
- DEFINE has a derived planning surface under immutable `initiative_ref`;
- `revise bind` installs the new committed planning revision/paths/scopes;
- Critic READY is denied if Git shows later unbound planning-surface changes.

Required E2E cases are now explicit:
- proactive EXECUTE revision;
- proactive ASSURE revision;
- Critic-BLOCKED revision;
- Reviewer/Verifier scope-change revision.

Primary correction commits:
- `6329985ad4168c24c7460be7fe376b8740b68838`
- `6529f96c2c4682a331f19ba4683642ce6a32a77a`
- `5796ccdf8e646bc0f2bd74abad76293aa0307793`

## M3 — Trusted admission / run / profile / base binding

Status: addressed using Option A.

Schema v2 now stores one opaque immutable:

```text
admission_id
```

The controller treats it only as a correlation key.

The external trusted admission record owns at minimum:

```text
admission_id
repository identity
trigger_class
authority_profile.id
authority_profile.revision
base_ref
base_commit
subject_branch
```

Canonical protected policy files are fixed as:

```text
.agent/policies/autonomy-profiles.json
.agent/policies/admission-rules.json
```

Trusted admission reads both from one exact pinned commit of the trusted repository default/policy branch.

Ordinary Work Blocks cannot include `.agent/policies/**` in implementation/coordination authority.

Base semantics are fixed:

- trusted admission resolves the configured base ref before planning;
- exact `base_commit` is pinned before subject branch/worktree creation;
- subject branch is created or verified against that commit;
- `open` consumes that admitted base and cannot accept a later subject-selected replacement;
- candidate containment therefore includes pre-open subject changes.

External delivery correlation after local INACTIVE is:

```text
admission_id
-> source_candidate_sha
-> published_tip_sha
-> PR identity
-> merged/released SHA
-> deployed SHA
```

Git/PR metadata may carry `admission_id` only as a correlation key; authority is re-resolved from the trusted external admission record.

Primary correction commits:
- `6529f96c2c4682a331f19ba4683642ce6a32a77a`
- `0a328c7236a618e22481114c62cb9a233d5685fb`
- `bfb671bd256ba280fea06d64607c13c0dcdb8070`
- `5796ccdf8e646bc0f2bd74abad76293aa0307793`
- `aa58615b40f18a8b36827d245081da73166f4441`

GitHub platform limitation from the Critic remains accepted: Level 2/3 autonomy must prove real branch/ruleset/environment protections at rollout time. No such protection is assumed by the baseline design.

## M4 — Logical independence and overlapping writers

Status: addressed.

Ownership is assigned to orchestration scheduling, not controller runtime provenance.

Logical-role rules:

- Coder cannot satisfy Critic/Reviewer/Verifier;
- Critic/Reviewer/Verifier are distinct logical assurance roles;
- unavailable independent assurance blocks rather than self-approves;
- controller state still does not persist session/runtime/topology proof.

Writer scheduling rules:

- write-capable Coders with overlapping `implementation_write_set` are serialized;
- disjoint scopes may execute concurrently;
- overlap is deterministic under the shared exact-path / terminal-`/**` grammar;
- no global execution registry or persisted session IDs are introduced.

Orchestration tests are required for both logical-role separation and writer serialization.

Primary correction commits:
- `6329985ad4168c24c7460be7fe376b8740b68838`
- `bfb671bd256ba280fea06d64607c13c0dcdb8070`
- `5796ccdf8e646bc0f2bd74abad76293aa0307793`
- `aa58615b40f18a8b36827d245081da73166f4441`

## Should findings

S1 is incorporated into the implementation plan: `test_legacy_regressions.py` must maintain explicit `F-001..F-039 -> target tests -> COVERED/SUPERSEDED/NOT_APPLICABLE -> rationale` mapping.

S2 is closed by trusted admission-pinned base semantics.

S3 is closed by the external `admission_id` delivery provenance chain.

S4 remains an explicit rollout requirement: higher autonomy is fixture/simulation only until real external protections, least-privilege credentials, environment restrictions, rollback and post-deploy verification are proven.

## Closure-review scope

The next independent Critic should perform a focused closure review only:

1. verify M1 exact-contract synchronization;
2. verify the M2 revision transaction is reachable with no hidden planning-write deadlock;
3. verify M3 admission/profile/base/delivery correlation is internally consistent and schema v2 is sufficient;
4. verify M4 ownership/tests are explicit without restoring runtime topology ceremony;
5. confirm no correction reintroduced a legacy deadlock or a second authority system.

If READY, the implementation-ready package may be frozen and WB-1 source implementation may begin.
