---
artifact_type: critic_report
work_block_id: WB-036
specification: docs/specs/WB-036.md
revision: v2
status: READY
verdict: SUPPLEMENT
context_id: /root/wb036_critic
---

# WB-036 Define v2 Critic — SUPPLEMENT

The separate read-only Critic found the Git-native/shared-policy direction
appropriate for the demonstrated frozen commit conflict. Four conditions
apply before further source work:

1. Resolve the v2 Critic and keep the source write gate BLOCKED until then.
2. Deny `--no-verify`, `-n`, hook-path overrides, leading environment
   overrides, and alternate repository context for tool-mediated commits.
   Use one shared predicate for both runtime adapters. Cover allowed and
   denied cases in each adapter.
3. Update the v2 tasklist revision, changed paths, and test traceability.
4. Define source publication followed by bounded terminal inactive
   publication. Reporting-only closure cannot satisfy the requested READY
   outcome. Reviewer and Verifier bind the source freeze; terminal projection
   needs its own evidence.

The Critic reviewed Define and existing code, without editing source or
running implementation tests.
