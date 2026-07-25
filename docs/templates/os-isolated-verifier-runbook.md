# OS-isolated verifier runbook

Use this runbook only for a frozen Work Block whose required verifier isolation
is `os-isolated`. It provides a bounded process/integrity attestation, not an
AI review, content review, legal opinion, rights clearance, or release
authority.

## Preconditions

- The implementation diff is frozen and the Owner has approved privileged local
  host provisioning and the formal verifier run.
- The dedicated nologin account and root-owned verifier hierarchy have been
  provisioned. Candidate evidence remains Owner-managed root-only storage; this
  runner never creates or changes that package.
- The host provides `/usr/bin/unshare`. The formal command creates a distinct
  network namespace before starting the runner; the runner fails closed unless
  its namespace differs from PID 1.

## Commands

1. Inspect without changing the host:

   ```bash
   scripts/provision-os-isolated-verifier.sh --check
   ```

2. Only with the Owner approval above, provision the dedicated nologin account
   and root-owned clean hierarchy:

   ```bash
   sudo scripts/provision-os-isolated-verifier.sh --apply
   ```

3. After the implementation diff is frozen, install temporary root-owned copies
   of the reviewed materializer and verifier. This is an Owner-approved
   execution boundary: do not execute the mutable workspace copies with
   `sudo`. The directory is in `/run` and disappears on reboot; removal before
   reboot is deliberately outside this Work Block.

   ```bash
   sudo /usr/bin/install -d -o root -g root -m 0700 /run/azursystech-ai-video-materializer
   sudo /usr/bin/install -o root -g root -m 0700 /home/azur/Projects/WSL/azursystech/scripts/materialize-candidate-evidence.sh /run/azursystech-ai-video-materializer/materialize
   sudo /usr/bin/install -o root -g root -m 0700 /home/azur/Projects/WSL/azursystech/scripts/run-os-isolated-verifier.sh /run/azursystech-ai-video-materializer/verify
   /usr/bin/sha256sum /home/azur/Projects/WSL/azursystech/scripts/materialize-candidate-evidence.sh /home/azur/Projects/WSL/azursystech/scripts/run-os-isolated-verifier.sh
   sudo /usr/bin/sha256sum /run/azursystech-ai-video-materializer/materialize /run/azursystech-ai-video-materializer/verify
   ```

   The two source/copy digest pairs must be identical before continuing. Record
   only the SHA-256 values and aggregate command results; do not record private
   evidence, media, prompts, credentials, or record contents.

4. Materialize the fixed candidate records from the frozen root-owned copy:

   ```bash
   sudo /usr/bin/env -i HOME=/root PATH=/usr/sbin:/usr/bin:/sbin:/bin LANG=C /bin/bash /run/azursystech-ai-video-materializer/materialize
   ```

5. After the diff is frozen, an Owner runs the fixed-manifest candidate
   attestation with the same boundary:

   ```bash
   sudo /usr/bin/env -i HOME=/root PATH=/usr/sbin:/usr/bin:/sbin:/bin LANG=C /usr/bin/unshare --net -- /bin/bash /run/azursystech-ai-video-materializer/verify --candidate-evidence
   ```

Candidate mode accepts no identifier, root, path, environment, or configuration
override. It checks the complete fixed hierarchy and only five root-owned,
non-symlinked, single-link, mode-`0600` records. Each copied record must match
its exact conservative schema; arbitrary text is rejected, including prompt
text, provider-operation references, raw provider terms, and secret-like
fields. The schema check first enforces the expected byte size and printable
text boundary, then compares the record byte-for-byte with `cmp`; binary data
including a trailing NUL cannot be normalized into a passing record. Copying
is descriptor-backed into the verifier-owned snapshot, so a post-validation
path swap cannot alter the attested bytes. The disposable fixtures include an
expected-record-plus-NUL negative case.

The runner does not initiate network operations. The separate namespace is a
fail-closed execution precondition, not a claim of credential isolation. It
never executes repository code, provider actions, credential actions, or media
actions. Candidate mode emits only the aggregate `PASS` result; it emits no
record contents or content hashes.

Any `BLOCKED` line is a blocker. Do not use a same-user fallback and do not
treat this attestation as legal, ownership, provider-eligibility, or release
approval.
