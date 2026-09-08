# Autonomous Work Block Publication Rationale — AzurSysTech

Status: non-authoritative engineering memory

## Authority boundary

This document records rationale and lessons only. It does not establish
authority and cannot override a current Owner instruction, `AGENTS.md`, or the
canonical policy in `governance/authority.md`.

The current model permits an assured, non-force push of the exact active Work
Block subject branch and then sends the pushed candidate to the Owner for
`MERGE / REVISION / REJECT`. Merge, protected/default branch updates,
force/non-fast-forward/deletion/broad/tag publication, deploy, live data,
credentials, and other irreversible actions remain Owner-controlled.

## Rationale and lessons

Earlier local-only publication handoffs added manual delay to routine reversible
candidate delivery without increasing the protection of the actions that matter:
merge, production, secrets, destructive Git, live data, and external
communication. A narrow explicit branch-and-ref predicate preserves a useful
review boundary while allowing corrective development to proceed.

The operating lesson is to make the exact target visible (`origin`, `HEAD`, and
`refs/heads/<subject_branch>`), require completed assurance, and fail closed on
ambiguous local branch/default-branch state. Project-local hooks remain process
controls; GitHub rules, least-privilege credentials, and OS isolation are the
real external constraints.

## Historical note

The previous every-push Owner-publication-handoff model is superseded. Historic
plans and reports that describe it remain audit records, not current authority.
