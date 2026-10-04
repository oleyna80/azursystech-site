# WB-005 — Holistic Replacement Assurance — Implementation Plan

## Wave 1 — Trusted activation bridge foundation

Implement and test:

- active subject-binding + terminal admission semantics in trusted external registry;
- trusted installation-config loader under Git common dir;
- deterministic active admission resolution;
- replacement runtime/Git/open/publish bridge command surface;
- concrete fail-closed branch-protection provider;
- minimal retained consequential guard with no lifecycle/candidate/assurance/publication authority.

Exit:

- bridges are executable in fixtures but remain unwired;
- no live configuration file changes;
- registry history/active authority separation is covered by restart and rollback tests.

## Wave 2 — Semantic comparison and cutover payload

Implement:

- baseline-pinned comparison corpus;
- deterministic comparison validator/runner;
- exact inert cutover patch;
- machine-readable manifest with pre/post blobs and modes;
- legacy entrypoint dispositions;
- cutover checklist.

Exit:

- all live entrypoints have explicit disposition;
- security-sensitive semantic changes cannot self-authorize;
- patch changes only declared WB-006 paths.

## Wave 3 — Rehearsal and canonical assurance command

Implement:

- disposable clean-clone rehearsal;
- bootstrap/install simulation;
- exact future Claude/Codex/Git invocation tests;
- local bare-remote publication path;
- snapshot/rollback verifier;
- canonical `scripts/verify-sdlc-replacement.py`;
- candidate-relative live-wiring immutability guard.

Exit:

- canonical command passes offline from clean disposable checkout;
- rollback removes/terminalizes all authority-bearing rehearsal state;
- no dependency on user Git config/network/AI.

## Wave 4 — Final package assurance

1. freeze exact WB-005 source candidate;
2. run holistic Critic on complete replacement package;
3. correct source findings only by producing a new candidate;
4. Reviewer on exact candidate;
5. Verifier independently on exact candidate;
6. run canonical deterministic command on exact candidate;
7. create coordination-only candidate/artifact blob binding;
8. close WB-005.

No live cutover occurs in WB-005.

## Implementation discipline

- Architecture/spec changes require renewed Critic review before implementation.
- Source defects found by Reviewer/Verifier create a new candidate.
- Live wiring is out of scope.
- WB-006 must consume exact assured artifact bytes; it must not regenerate cutover logic.
