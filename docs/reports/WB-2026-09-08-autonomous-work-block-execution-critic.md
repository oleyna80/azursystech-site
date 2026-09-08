# Critic Record — WB-2026-09-08-autonomous-work-block-execution

## Assignment

- **Role:** Critic (read-only)
- **Scope:** the proposed canonical authority source, governance/workflow and
  runtime adapter consistency, enforcement boundaries, and assurance topology.
- **Out of scope:** repository writes, application code, credentials, remote
  publication, merge, deployment, and any external mutation.

## Critic result

The separate read-only Critic reviewed the Owner instruction, Work Block
artifacts, governance/workflow/runtime surfaces, hooks, templates, and
deterministic tests. It returned **SUPPLEMENT**. It made no repository changes.

## Required supplements accepted into implementation

1. `governance/authority.md` must actually replace the obsolete every-push
   handoff rule; all derived documents, including engineering memory, must
   defer to it.
2. The shared Hard Stop needs one narrow, fail-closed predicate: schema-v3
   active Work Block, READY write gate, attached matching non-default branch,
   exact `origin`, exact current source and exact subject destination, plus
   READY Review and Verification. Bare, alternate-remote, remote-URL,
   alternate-source, alternate-destination, multiple-refspec and
   publication-flag forms remain denied.
3. The local policy must obtain the configured default branch rather than
   protect only literal `main` or `master`; unknown default configuration must
   fail closed for autonomous publication.
4. The lifecycle producer and default state need Define-quality parity, with a
   Managed formal-profile prerequisite and an explicit non-required Controlled
   path.
5. The legacy Codex shell hook must be aligned with the shared policy or
   reduced to a non-authority-bearing adapter. OpenCode static permissions
   cannot be claimed as the dynamic authority predicate.

## Verdict

**SUPPLEMENT.** Proceed only with the narrow write set in the approved plan;
require a fresh independent Reviewer and Verifier after implementation. The
Critic did not inspect external GitHub rulesets, credential scope, remote branch
protection, or live runtime hook activation; those remain explicitly unproven.
