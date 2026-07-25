# Verification — WB-2026-07-24 candidate evidence attestation

## Verdict

`BLOCKED` — only on the mandatory Owner os-isolated runtime proof. All code-level and synthetic-fixture acceptance checks passed after remediation.

## Passed code-level evidence

- Literal argument contract and compile-time fixed candidate manifest.
- Byte-exact text schemas, including rejection of NUL and trailing-byte variations.
- Rejection coverage for traversal, symbolic links, hard links, bad ownership/modes, oversized records, prompt-like content, provider-operation references, raw provider terms, and token-like fields.
- Root-owned hierarchy checks and descriptor-backed snapshot copying.
- Fixed Bash, sterile startup environment, and a fail-closed distinct network-namespace precondition.
- Root-owned snapshot and nologin verifier execution with fixed utilities and aggregate-only output.
- `bash -n` and the disposable fixture suite passed.

## Required Owner proof

After the implementation diff is frozen, run exactly:

```bash
sudo /usr/bin/env -i HOME=/root PATH=/usr/sbin:/usr/bin:/sbin:/bin LANG=C /usr/bin/unshare --net -- /bin/bash /home/azur/Projects/WSL/azursystech/scripts/run-os-isolated-verifier.sh --candidate-evidence
```

Record only the bounded result. A non-`PASS` result is a blocker and must not be bypassed with a same-user, same-network, or relaxed-schema fallback.

## Non-claims

Even a `PASS` proves only fixed text-record integrity linkage. It does not prove media bytes, visual quality, SynthID, billing validity, ownership, exclusivity, third-party clearance, legal or provider eligibility, or release approval. The candidate remains `NEEDS_PROVIDER_CONFIRMATION`; publication remains blocked.
