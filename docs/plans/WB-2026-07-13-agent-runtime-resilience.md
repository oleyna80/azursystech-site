# Work Block — agent runtime resilience

## Stage 0 — Routing preflight

- **Work Block:** `WB-2026-07-13-agent-runtime-resilience`
- **Type:** local runtime resilience, workflow scripts, and control-layer policy
- **Side-effect class:** local docs/workflow write; local user runtime configuration write; Owner-approved host configuration write; Owner-approved temporary-directory deletion
- **DB action mode:** none
- **Hard Stops:** none (no deploy, live data, credential rotation, destructive Git, commit, or push). The approved host `sysctl` change is not a deploy and is limited to the two inotify limits below.
- **Subagent topology:** `Subagent-Required` (runtime/config/infrastructure, more than four implementation files, independent verification). Read-only Critic → exactly one write-capable Scoped Coder → independent readonly Verifier after diff freeze. No parallel writers.
- **Skill Routing:** relevance filter: always relevant `git-safety` and current gate templates; task-relevant `systematic-debugging`, `memory-ops`, `subagent-mission-brief`, and `openai-docs`; not relevant: frontend, design, DB, deploy, payment, browser, and sprint-analysis. Checked: `git-safety`, `systematic-debugging`, `memory-ops`, `subagent-mission-brief`, gate templates, `openai-docs`. Matched/used: `systematic-debugging`, `memory-ops`, `subagent-mission-brief`, gate templates, `openai-docs`. Skipped: `git-safety` (no commit); `sprint-analysis` (its contract is read-only and was used only as prior evidence, not as an implementation workflow).
- **Codex Critic:** required; read-only native Critic returned `SUPPLEMENT`.
- **Write gate:** READY after the two Critic supplements below are incorporated in the exact write-set and gate record.

## Objective

Make infrastructure limits a detectable prerequisite instead of a late Verifier
failure: provide a canonical independent readonly verifier runner that never
copies credentials, a runtime doctor, a persistent host inotify setting, safe
fixture lanes, and mission/policy guidance for all future agent stages.

## Expected final result

Future Work Blocks can run `scripts/agent-runtime-doctor.sh` before dispatch;
they receive actionable PASS/WARN/BLOCKED output for Codex/profile, verifier
home readiness, file-watch capacity, and local resource pressure. Formal
readonly verification uses one canonical runner with a user-provisioned
`CODEX_VERIFIER_HOME`; the runner never reads, copies, prints, or creates
credentials. The current temporary runtime home is gone, and the host retains
the approved inotify values across reboot.

The runner is a Control Tower command only. A native subagent must never use it
to launch nested Codex; that would violate the recursion guard.

## Approved write-set

Control Tower artifacts:

- `AGENTS.md`
- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.agent/workflows/sdd-protocol.md`
- `.codex/AGENTS.md`
- `.codex/config.toml.template`
- `.codex/instructions.md`
- `.codex/write-gate.md`
- `.codex/agents/verifier.toml`
- `docs/engineering-memory/runtime-command-adapters.md`
- `docs/templates/subagent-mission-brief-template.md`
- `docs/plans/WB-2026-07-13-agent-runtime-resilience.md`
- `docs/reports/WB-2026-07-13-agent-runtime-resilience-critic.md`
- `docs/reports/WB-2026-07-13-agent-runtime-resilience-verification.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `memory_bank/decisions.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/review-log.md`

Scoped Coder only:

- `scripts/run-independent-verifier.sh`
- `scripts/agent-runtime-doctor.sh`
- `scripts/agent-runtime-sysctl.conf`
- `scripts/tests/agent-runtime-fixtures.sh`

Owner-approved local runtime and host actions (not committed):

- `/home/azur/.codex/config.toml` — reduce `[agents].max_threads` from `6` to `3`.
- `/etc/sysctl.d/99-codex-agent-runtime.conf` — install the secret-free copy of `scripts/agent-runtime-sysctl.conf` and apply it.
- `/tmp/codex-verifier-wb` — remove recursively after its existence and scope are rechecked; it is a temporary runtime directory containing the earlier copied authentication state.

## Out of scope

- Application/admin code, dependencies, database, deployment, network/service configuration, provider settings, external APIs, commit, and push.
- Reading, copying, rotating, or deleting any persistent credential. Provisioning a dedicated verifier home requires the Owner to perform one interactive `codex login` when needed.
- OS-user/container isolation; this Work Block only supports the existing `independent-readonly-root` tier.

## Acceptance criteria

1. The runner requires an existing, owner-provisioned verifier home and a readonly profile; it runs Codex with `--strict-config`, `--profile readonly`, `--sandbox read-only`, and `--ephemeral`, captures a bounded result, and fails without touching auth material.
2. The doctor reports machine-readable PASS/WARN/BLOCKED readiness for the Codex binary/profile, verifier-home metadata (without reading auth), inotify thresholds, file-descriptor limit, and filesystem headroom.
3. The template and active user configuration cap agent concurrency at `3`; the value is justified by the four available execution slots.
4. The committed sysctl source contains `fs.inotify.max_user_watches = 524288` and `fs.inotify.max_user_instances = 512`; the host copy is installed and applied if interactive elevation succeeds, otherwise the exact blocker is recorded.
5. Mutable fixture tests stay explicitly local/test-only; formal readonly verification never runs them as proof of read-only behavior.
6. Policy, mission brief, agent definition, runtime memory, and Stage 0 instructions require the doctor and canonical runner for sensitive runtime/config Work Blocks.
7. The temporary `/tmp/codex-verifier-wb` no longer exists; no auth content is printed, moved, or retained by this Work Block.
8. New shell fixtures, syntax checks, both existing hook fixture suites, secret scan, configuration parse, and independent readonly verification pass, or any unavailable prerequisite is reported as `BLOCKED` rather than passed.

## Risks and mitigations

| Risk | Mitigation | Stop condition |
| --- | --- | --- |
| `sudo` requires an interactive terminal | Attempt the exact approved install/apply once under elevation; record the message if unavailable. | Host persistence remains BLOCKED. |
| Dedicated verifier home is not authenticated | Runner and doctor fail fast with a non-secret readiness message; document Owner one-time login. | Do not copy `auth.json` or fabricate a formal verifier run. |
| Runtime scripts accidentally expose credential data | Only use existence, ownership, permissions, and writability tests; no `cat`, copy, path dump, or environment export for auth. | Any requirement to inspect/copy credentials stops the Work Block. |
| Existing user changes are overwritten | Preserve the recorded dirty baseline and edit only approved paths. | Unexpected overlap outside write-set. |
| A native subagent attempts to run the runner | Document it as a Control Tower-only command and reject nested Codex invocation. | Any nested external AI CLI request stops that agent mission. |

## Verification plan

- `bash -n` for new scripts and both hook variants.
- `bash scripts/tests/agent-runtime-fixtures.sh`.
- `bash .claude/hooks/tests/gate-fixtures.sh` and `bash .codex/hooks/tests/gate-fixtures.sh`.
- `scripts/agent-runtime-doctor.sh` before and after the host attempt.
- `scripts/secret-scan.sh tracked` and `git diff --check`.
- `codex --strict-config --version` and `codex --profile readonly --strict-config --version`.
- Separate top-level readonly root after diff freeze. If the dedicated verifier home lacks Owner login, record `BLOCKED`; no temporary credential copy is permitted.

## Commit scope

- **Commit/push:** not authorized; nothing will be staged or committed.
- **Unrelated dirty files:** all pre-existing application, design, and prior-control-layer changes remain untouched.

## Stage 0 amendment — bounded formal-verifier capture (Owner approved 2026-07-13)

- **Reason:** the first independent readonly run proved that a process-wide
  `RLIMIT_FSIZE` also limits Codex internal ephemeral files. The subsequent
  post-run size check is useful detection but not an OS-level write boundary.
- **Added side-effect class:** Owner-approved host configuration write for one
  local systemd tmpfs mount. No network, service restart, credentials, DB,
  deployment, commit, or push action is authorized.
- **Added repository write-set:**
  `scripts/systemd/run-codex\x2dverifier\x2doutput.mount`,
  `scripts/run-independent-verifier.sh`, and
  `scripts/tests/agent-runtime-fixtures.sh`.
- **Added host action:** install the reviewed mount unit as
  `/etc/systemd/system/run-codex\x2dverifier\x2doutput.mount`, then
  `systemctl daemon-reload` and `systemctl enable --now
  run-codex\x2dverifier\x2doutput.mount`.
- **Boundary contract:** `/run/codex-verifier-output` is a dedicated 4 MiB
  tmpfs owned by the local Control Tower user with `0700,nosuid,nodev,noexec`.
  The runner accepts output only directly inside this mount and verifies that
  its filesystem is tmpfs with capacity at most 4 MiB before it launches
  Codex. This bounds the capture without constraining Codex internal files.
- **Rollback:** `systemctl disable --now
  run-codex\x2dverifier\x2doutput.mount`; remove the installed unit; run
  `systemctl daemon-reload`. The repository source remains as a reusable
  pattern but no formal runner can execute until a replacement boundary exists.
- **Pre-edit lifecycle check:** Owner confirmed the recently created runtime
  scripts and Work Block documents remain and should serve future projects.
- **Skills:** `openai-docs` was used for Codex-runtime routing; its manual
  helper could not produce a valid response in this environment, so no
  unverified remote claim is used. Existing local `codex exec` evidence remains
  the command-contract source.

## Stage outcome — 2026-07-13

- **Stage 1:** DONE. The sole Scoped Coder added the four approved runtime
  scripts; syntax and disposable fixture checks pass.
- **Stage 2:** DONE. The Owner applied the inotify baseline, provisioned the
  verifier home, and installed/enabled the reviewed 4 MiB output tmpfs. The
  host-access fixture and doctor pass; the native Reviewer is advisory READY.
- **Stage 3:** DONE. After source freeze, the canonical runner launched a
  separate top-level readonly Codex root (`approval: never`, `sandbox:
  read-only`) and received `FORMAL_VERDICT: READY`. The temporary verifier
  directory remains removed; no credential content was read, copied, printed,
  created, moved, or retained.
