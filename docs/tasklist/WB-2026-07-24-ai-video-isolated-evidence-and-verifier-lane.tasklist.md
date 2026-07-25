# WB-2026-07-24 — AI-video isolated evidence and verifier lane

## Objective

Make the recurring AI-video release-evidence process reproducible without
opening, copying, transforming, publishing, or generating any media. Deliver a
controlled private-evidence helper and a bounded `os-isolated` integrity
attestation lane, then align the policy, operating instruction, and template.

## Stage 0 — routing preflight

- Work Block type: reusable process hardening for private evidence and release
  verification.
- Side-effect class: local documentation/workflow write, local test side effect,
  and Owner-approved local host provisioning for a dedicated verifier account.
- DB action mode: none.
- Sensitive domains: external-provider evidence, media rights, private evidence,
  local host isolation.
- Hard Stops: no provider request, credential/configuration change, publication,
  public storage, deploy, client send, database action, staging, commit, push,
  destructive operation, or access to raw media.
- Skills checked: current-work-block-gates, media-production-orchestrator,
  video-provider-router, media-rights-compliance, security-pass, memory-ops,
  git-safety, creative-and-frontend-skills, video-generator.
- Skills matched: media-production-orchestrator, video-provider-router,
  media-rights-compliance, security-pass, memory-ops.
- Skills used: media-production-orchestrator for the bounded workflow,
  video-provider-router for the Preview decision ceiling,
  media-rights-compliance for evidence limits, security-pass for path and
  isolation hardening, memory-ops for SSOT sync.
- Skills skipped: git-safety (no staging/commit/push), creative-and-frontend-skills
  (no application/design change), video-generator (no provider call).
- Subagent topology: Subagent-Required (runtime, security, docs, 4+ files,
  independent verification). Native fresh-agent allocation returned
  `thread-limit`; interim critic is `review-degraded:inline-fallback`. One
  existing Scoped Coder may implement only the literal write-set; a read-only
  Verifier follows.
- Threat model: the private helper accepts only small redacted records from a
  fixed temporary root and rejects symlinks, traversal, replacement, raw media,
  and arbitrary destinations. The verifier runner creates a root-owned frozen
  allowlisted snapshot and invokes only fixed system utilities as a dedicated
  nologin user with a clean environment. Neither lane establishes copyright,
  exclusivity, legal clearance, or release approval.
- Write gate: READY after the critic record and gate files below are activated.

## In scope

- `scripts/ai-video-private-evidence.sh` — immutable, redacted-record helper.
- `scripts/provision-os-isolated-verifier.sh` and
  `scripts/run-os-isolated-verifier.sh` — separate-account deterministic
  attestation lane.
- Fixture checks and the associated runbook, policy, operating instruction,
  evidence template, and workflow documentation.

## Out of scope

No video generation, API call, billing event, source-media read or movement,
watermark handling, public release, application integration, deployment,
credential change, commit, or push.

## Acceptance criteria

1. The evidence helper has a fixed private root, strict identifiers and
   categories, rejects symlinks/traversal/raw media/replacement, and writes
   directories `0700` and records `0600`.
2. The provisioner creates only a dedicated nologin verifier account and the
   minimal root-owned clean-home hierarchy; it supports a non-mutating check.
3. The runner snapshots only an explicit allowlist into a root-owned read-only
   directory, runs no repository code and no network operation, and emits a
   bounded integrity attestation as the isolated account.
4. Documentation accurately describes these as process and integrity controls,
   never as legal clearance or automatic release authority.
5. Tests cover syntax, safe evidence-helper behavior, and root-required
   isolation checks are reported as blocked/skipped when root execution is not
   available.

## Approved write-set

The literal paths in `.agent/critic-gate.md` are authoritative.

## Verification tier

Full. Required verifier isolation is `os-isolated` for a live attestation run.
The repository implementation can receive a bounded local result; an actual
host account attestation remains `BLOCKED` until the Owner-approved privileged
provisioning and run are completed.

## Stage 1 — implementation

Completed by the single Scoped Coder within the approved write-set. The first
native Verifier found and the Coder corrected two blockers: a caller-controlled
private-root override, and insufficient verifier-account identity constraints.
No provider, media, credential, publication, integration, deploy, commit, or
push action occurred.

## Stage 2 — review and verification

The corrected scripts passed syntax, negative fixture, and scoped diff-hygiene
checks. Root-only fixture branches correctly reported `SKIP|root-required`.
The native re-verifier could not be allocated (`thread-limit`), so the final
source check is recorded as `review-degraded:inline-fallback`; it cannot close
the required `os-isolated` gate.

## Stage 3 — closeout

**Status: READY for this Work Block's bounded process/integrity scope.** The
first sudo authentication attempt did not run a script, but the Owner's second
root-terminal invocation returned `PASS|os-isolated-provisioner|ready` and a
14-file `PASS|os-isolated-verifier|...` attestation. The sandbox independently
observes the dedicated account but maps root-owned host directories to
`nobody:nogroup`; that local metadata limitation is recorded in the verification
report. A separate release Work Block remains required afterward.
