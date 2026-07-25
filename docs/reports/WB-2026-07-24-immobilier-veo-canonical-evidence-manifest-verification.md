# Verification — WB-2026-07-24 Immobilier Veo canonical evidence manifest

Date: 2026-07-24  
Tier: full  
Verifier: subagent (advisory code verification)  
Sensitive domains: private-evidence, local-host-isolation, media-rights, external-provider  
Required verifier isolation: os-isolated  
Actual verifier isolation: os-isolated  
Formal verdict: READY — bounded candidate-record integrity linkage only

## Verified locally

- Shell syntax passed for the materializer, candidate runner, and both fixture
  suites.
- Both disposable fixture suites passed:
  `PASS|candidate-materializer-fixtures|materialization-and-runner-contract`
  and `PASS|os-isolated-fixtures|process-continuity-and-candidate-boundaries`.
- Scoped whitespace and diff checks passed.
- The no-argument materializer validates `/var` and `/var/lib`, then creates
  only absent fixed ancestors `/var/lib/azursystech-private` and
  `/var/lib/azursystech-private/ai-video-evidence` as root:root mode `0700`.
  It subsequently publishes only five compile-time text records through
  no-clobber atomic staging.
- Existing, unsafe, or symlinked private ancestors and an existing candidate
  package fail closed. The candidate runner retains exact-tree, metadata, link,
  byte-size, printable-byte, and exact-schema checks.
- The frozen-copy runbook now invokes only candidate mode. It does not invoke
  the generic process mode, whose allowlist is intentionally not frozen in the
  two-file `/run` lane.
- The first Owner host attempt proved the frozen materializer and candidate
  checks reached their aggregate `PASS` lines, but used the preceding runner
  revision and then emitted an `unbound variable` EXIT-trap error. It is not
  accepted as a formal proof. The cleanup regression is now covered by a
  disposable candidate success run with exit `0` and exact sole PASS output,
  plus candidate and process failure-cleanup checks that leave no snapshot.

## Owner OS-isolated host proof

The candidate package was not rematerialized. The Owner refreshed only the
frozen verifier copy, then recorded this matching source/copy SHA-256 pair:

```text
931ed134804a0ab7c0cfc09c98aed25cf9a1c99012caf8a1799f9d8412e834a6  scripts/run-os-isolated-verifier.sh
931ed134804a0ab7c0cfc09c98aed25cf9a1c99012caf8a1799f9d8412e834a6  /run/azursystech-ai-video-materializer/verify
```

The Owner then ran the sterile `unshare --net` candidate verifier against the
unchanged package. Its complete relevant result was:

```text
PASS|os-isolated-verifier|candidate-evidence=PASS
exit=0
```

No additional trap error occurred. The historical materializer PASS remains
evidence of the already-created package only. This READY result does not
establish video provenance, rights, provider eligibility, billing, quality,
integration, publication, or release authorization. Candidate state remains
`NEEDS_PROVIDER_CONFIRMATION`.
