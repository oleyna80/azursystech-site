# Verification report — Veo Preview release evidence and isolation

**Work Block:** `WB-2026-07-24-immobilier-veo-preview-release-evidence-and-isolation`  
**Tier:** full  
**Verifier:** native subagent (advisory)  
**Required verifier isolation:** `os-isolated`  
**Actual verifier isolation:** `same-session-degraded`  
**Formal verdict:** `BLOCKED`

## Evidence reviewed

- The Work Block tasklist and Critic report retain `os-isolated` as the formal
  release requirement.
- The Control Tower runtime doctor reports the existing readonly runner is
  available, but that runner is `independent-readonly-root`, not a separate OS
  user/container-equivalent with a clean credential-free environment.
- Scoped Coder metadata-only inspection found only partial private evidence.
  The Coder did not access raw media, invoke a provider API, or disclose
  sensitive values; its approved private evidence paths were not writable from
  the present sandbox.
- The Owner authorization for this Work Block excludes release, publication,
  application integration, and deployment.

## Checks

| Check | Result | Notes |
| --- | --- | --- |
| Required isolation recorded | PASS | Tasklist and Critic report require `os-isolated`. |
| Formal verifier isolation | BLOCKED | Native verification is advisory; the available runner does not meet the required OS and credential boundary. |
| Private evidence tuple | BLOCKED | Required provider, rights, and decision records cannot be completed in the approved private store from this sandbox. |
| Release authority | BLOCKED | No explicit responsible-human release decision or Preview final-output exception was granted. |
| Route/runtime proof | NOT APPLICABLE | No application route changed and external/live operations are out of scope. |
| Secret handling | PASS | No secret, raw-media, provider, or release action was performed in this Work Block. |

## Required before a new release Work Block

1. Allow the single Scoped Coder to write only the already-approved private
   evidence subtrees, or provide an equivalent approved private evidence lane.
2. Complete and freeze the exact provider/rights/release tuple, including a
   responsible-human decision and an explicit Preview final-output exception.
3. Provision a separate OS user, container, or equivalent with read-only
   source, a clean home, and no `.env`, SSH, provider, or other credentials;
   run the frozen-scope verifier there.
4. Obtain separate Owner approval for release only after the preceding gates
   pass.

No `RELEASE_APPROVED` status, integration, publication, deployment, staging,
commit, or push is authorized by this report.
