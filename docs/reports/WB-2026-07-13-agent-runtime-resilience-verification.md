# Verification Report — agent runtime resilience

- **Work Block:** `WB-2026-07-13-agent-runtime-resilience`
- **Tier:** full
- **Verifier:** formal top-level readonly Codex root
- **Required isolation:** `independent-readonly-root`
- **Actual isolation:** `independent-readonly-root`
- **Stage 3 mode:** formal independent verification and SSOT sync
- **Verdict:** `READY`

## Passed evidence

- `bash -n` passed for `scripts/run-independent-verifier.sh`,
  `scripts/agent-runtime-doctor.sh`, and
  `scripts/tests/agent-runtime-fixtures.sh`.
- `bash scripts/tests/agent-runtime-fixtures.sh` passed. Its expected negative
  cases prove rejection of a missing/unsafe verifier home, safe Codex arguments
  and `CODEX_HOME`, propagation of a non-zero Codex exit, and doctor
  `PASS`/`WARN`/`BLOCKED` classification.
- Both deterministic hook suites passed: Claude 59/59 and Codex 59/59.
- `scripts/secret-scan.sh tracked` passed.
- `git diff --check` passed for the approved repository paths.
- `codex --strict-config --version` and
  `codex --profile readonly --strict-config --version` passed after changing
  local `[agents].max_threads` from 6 to 3.
- `/tmp/codex-verifier-wb` no longer exists. Its contents were not read,
  copied, printed, moved, or retained by this Work Block.
- Advisory review found the runner uses `--strict-config --profile readonly
  --sandbox read-only --ephemeral`, checks an existing mode-`0700` home and
  profile, and has no auth-read/copy implementation. Policy and mission docs
  accurately describe the Control-Tower-only runner and the non-isolation of
  credentials/network.

## Historic blockers (resolved)

1. `scripts/agent-runtime-doctor.sh` returned exit 2 with
   `BLOCKED|verifier-home|missing`. The Work Block deliberately did not create,
   inspect, or copy authentication. The Owner must provision a dedicated,
   mode-`0700` `CODEX_VERIFIER_HOME`, add its readonly profile, and authenticate
   it interactively before a formal runner invocation.
2. The approved host command reached an interactive `sudo` password prompt.
   It could not install `/etc/sysctl.d/99-codex-agent-runtime.conf` in this
   session. Actual values remain `fs.inotify.max_user_watches=65536` and
   `fs.inotify.max_user_instances=128`, below the reviewed `524288` and `512`
   baseline; doctor therefore emitted the corresponding `WARN`s.

## Historic formal closeout condition

After the Owner applies the reviewed host file and provisions the separate
verifier home, rerun the doctor, freeze the diff, and launch the canonical
Control-Tower-only runner from a separate top-level readonly root. Until then,
the native verdict is advisory and must not be represented as formal `READY`.

## Recovery evidence — 2026-07-13

- The Owner successfully installed and applied the reviewed host file. Reread
  values are `fs.inotify.max_user_watches=524288` and
  `fs.inotify.max_user_instances=512`; the capacity warnings are resolved.
- A scoped recovery found that `approval_policy = "never"` was previously
  profile-dependent. The runner now pins that policy per `codex exec`
  invocation alongside `--sandbox read-only`, while preserving strict loading
  of `$CODEX_HOME/readonly.config.toml`.
- `bash -n scripts/run-independent-verifier.sh
  scripts/tests/agent-runtime-fixtures.sh` and
  `scripts/tests/agent-runtime-fixtures.sh` passed. An independent native
  Verifier returned advisory `READY`; it checked the command contract,
  profile path, mode-`0700` boundary, and fixture coverage.

The sole remaining formal blocker is the Owner-provisioned verifier home and
its interactive authentication. No credential contents were read, copied, or
created during recovery.

## Formal runner attempt and capture-safety blocker — 2026-07-13

The Owner-provisioned verifier home subsequently passed the doctor under host
access, including the auth marker; that prerequisite is resolved. The canonical
independent runner started with `approval: never` and `sandbox: read-only` but
terminated with `codex-exit-153` (`File size limit exceeded`) before returning
a verdict. Its process-wide `RLIMIT_FSIZE` also applied to Codex internal
ephemeral files.

A scoped recovery removed that process-wide limit, retained the read-only,
approval, timeout, profile, and exit-propagation controls, and added a
post-run captured-output-size check plus fixture coverage. The focused fixture
and advisory checks passed. However, the advisory Verifier correctly found that
a post-run check cannot prevent a transient oversized write from exhausting the
filesystem. Formal `READY` is therefore blocked until the output capture uses
a separately size-bounded filesystem/quota (or equivalent OS-level boundary)
that does not limit the entire Codex process.

## Bounded-capture recovery — implementation history

- The approved source adds `scripts/systemd/run-codex\x2dverifier\x2doutput.mount`:
  a dedicated `/run/codex-verifier-output` tmpfs with 4 MiB capacity,
  `0700`, owner uid/gid 1000, and `nosuid,nodev,noexec`.
- The runner now proves the exact mount target, `tmpfs` type, capacity,
  private current-user ownership, and direct new output path before Codex
  starts. It rejects external, symlinked, existing, empty, and oversized
  captures; it does not set `ulimit` or redirect Codex internals to tmpfs.
- Focused static checks passed and the native advisory Reviewer returned
  `READY` for the implementation. The disposable fixture correctly reports
  its missing host prerequisite before the mount exists.
- The Control Tower's first approved install attempt returned `sudo: A terminal
  is required to authenticate`; it did not change `/etc/systemd/system` or
  mount anything. The Owner then performed the reviewed installation in an
  interactive terminal.

## Formal closeout — 2026-07-13

- The Owner installed and enabled
  `run-codex\x2dverifier\x2doutput.mount`. Live host inspection confirms an
  exact `/run/codex-verifier-output` `tmpfs`, size `4194304` bytes, mode `0700`,
  owner `1000:1000`, and `nosuid,nodev,noexec` options.
- The host-access fixture passed: its normal lane succeeds and the missing
  home, unsafe home, external/symlink/existing output, non-zero Codex, empty,
  and oversized output lanes block as designed. The doctor returned
  `PASS|summary|ready`.
- After the runtime-source review was frozen, the canonical runner launched a
  separate top-level Codex root with `approval: never` and `sandbox: read-only`.
  Its captured report ends `FORMAL_VERDICT: READY` and found no blocking
  `RLIMIT_FSIZE`, credential handling, or capture-path issue.
- The three runtime source checksums match before and after the formal run.
  The mutable fixture suite was not used as formal readonly proof.

This closes the full-tier gate. The earlier incidents are retained above as
evidence of the infrastructure cause and recovery, not as active blockers.
