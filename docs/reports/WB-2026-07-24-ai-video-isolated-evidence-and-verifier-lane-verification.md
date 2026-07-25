# Verification — WB-2026-07-24-ai-video-isolated-evidence-and-verifier-lane

## Verdict

**READY — bounded host isolation attestation is available.**

The repository-side implementation is locally verified. It does not establish
legal clearance, rights ownership, exclusivity, or release authority for any
video. No provider request, credential use, raw-media access, integration,
publication, deployment, staging, commit, or push occurred.

## Required and actual isolation

- Sensitive domains: private evidence, media-rights workflow, host isolation.
- Required verifier isolation: `os-isolated`.
- Actual verifier isolation: `os-isolated` for the deterministic host
  attestation, supplemented by a read-only native Reviewer for source/security
  review.
- Verifier: `subagent`; the first native Verifier found two implementation
  blockers, the Scoped Coder recovered them, and the final Reviewer confirmed
  the bounded host evidence and sandbox limitation.

The actual isolation is at least the required level for this bounded
process/integrity Work Block.

## Implemented controls reviewed

1. `scripts/ai-video-private-evidence.sh` uses a fixed production root,
   accepts only bounded redacted records, rejects arbitrary destinations,
   traversal, symlinks, raw media, replacement, and known sensitive markers.
2. `scripts/provision-os-isolated-verifier.sh` fails closed unless the verifier
   account is a non-root system account with the exact group, home, nologin
   shell, and no supplementary groups.
3. `scripts/run-os-isolated-verifier.sh` requires that hierarchy, makes a
   root-owned allowlisted snapshot, starts a clean-environment process as that
   account, and produces only a bounded hash attestation.
4. Policy, instruction, template, runbook, and workflow text state that a
   paid Preview generation and an integrity attestation are not rights
   clearance or a release decision.

## Checks run

- `bash -n scripts/ai-video-private-evidence.sh scripts/provision-os-isolated-verifier.sh scripts/run-os-isolated-verifier.sh` — PASS.
- `scripts/tests/os-isolated-verifier-fixtures.sh` — PASS for helper negative
  cases; root-only host checks reported `SKIP|root-required` as designed.
- Scoped `git diff --check` — PASS.
- Final narrow inline review of the two prior verifier findings — PASS:
  caller-controlled evidence-root override is removed, and UID/home/group
  invariants now fail closed.

## Host proof

The first terminal attempt failed authentication before any script action:

```text
sudo scripts/provision-os-isolated-verifier.sh --apply
sudo: A terminal is required to authenticate
```

The Owner then ran the approved commands successfully on `azur-pc`:

```text
PASS|os-isolated-provisioner|ready
PASS|os-isolated-verifier|files=14|attestation-sha256=1bd081386d74d6a52801f6bdd8acf06a2813e4dacb3d74395a62a7e0b2bef8cd
```

This is internally consistent with the literal 14-file allowlist. A local
non-root sandbox re-check reads the dedicated account (UID 997, primary GID
973, nologin shell, no supplementary groups), but maps root-owned `/var/lib`
directories to `nobody:nogroup`; its `--check` therefore fails ownership
comparison. That sandbox mapping does not contradict the Owner's root-terminal
PASS evidence and is not used to rewrite host ownership.

The runner's hash identifies the bounded snapshot at run time. The repository
baseline was `a5bb47584c84d90c45c8f80320430bb692779317`; the in-scope process
files were uncommitted at execution, so the hash is not represented as a Git
commit or broader source-provenance proof.

## Remaining boundary

This `READY` covers only the reusable process and integrity lane. A separate,
explicitly approved release Work Block must still evaluate an actual video
evidence tuple, rights/consent, provider route decision, candidate QC, and a
responsible-human release decision.
