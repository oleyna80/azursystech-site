# Critic Report — WB-2026-09-06-video-generator-transaction-contract

## Verdict

APPROVE

## Scope

Read-only challenge of the proposed current-main transaction contract before
implementation. Historical `generate_hero_veo.py` and its July skill files are
reference evidence only; no provider, application, or framework action is
authorized.

## Challenges and resolutions

- **Duplicate billing:** an approved request is exactly one billable
  submission. `accepted-with-id`, `accepted-without-id`, `timeout`, and
  `transport-failure` cannot authorize resubmission.
- **Ambiguous acknowledgement:** an acknowledgement without a provider request
  ID is terminal for submission. Only an identified request may use a bounded,
  provider-capability-dependent retrieval path.
- **Retry semantics:** safe/read-only status retrieval is separate from
  billable generation submission; no generic transient retry rule may blur that
  boundary.
- **Provenance gap:** local output without reliable transaction identity must be
  marked unconfirmed and quarantined, even if technical validation succeeds.
- **Authority leakage:** provider routing, technical QC, rights review, and
  publication authorization remain separate responsibilities. The skill grants
  none of them and does not provide credentials or execution commands.
- **Complexity:** the state machine is deliberately small, deterministic, and
  provider-neutral; provider-specific capability and terms remain references to
  the router and rights contracts.

## Boundary

Approve implementation of the current skill and declarative safe transaction
record template only. Do not copy or cherry-pick the historical generator
script, call a provider, generate media, modify application/framework paths, or
publish output.
