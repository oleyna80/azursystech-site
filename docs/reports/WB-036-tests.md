---
artifact_type: test_report
work_block_id: WB-036
specification: docs/specs/WB-036.md
revision: v3
status: READY
---

# WB-036 deterministic checks

Executed on `audit/hook-enforcement-036` on 2026-09-24 before the final v3
freeze. Focused fixtures include positive and negative cases for each changed
Git, runtime, and published-object predicate.

| Command | Result |
|---|---|
| Git-transition fixture suite | PASS, 31 cases: active/terminal index, configured default branch, WB, Critic, frozen source, forbidden environment files, exact publication, fail-closed inspection |
| Commit-message fixture suite | PASS, 33 cases: trailer, branch, inactive and terminal commit |
| GitHub-capability control-plane suite | PASS=19 FAIL=0; WB-035 lifecycle and rework; both runtime adapters allow a valid frozen commit and deny bypass, missing hook, and stale source |
| Published-object CI conformance suite | PASS=25 FAIL=0; active, terminal, canonical-inactive, branch/head/base, trailer, scope including forbidden environment files and allowed examples, frozen identity, assurance, malformed state, and workflow trigger/head cases |
| Codex gate fixture suite | PASS=61 FAIL=0 |
| Claude gate fixture suite | PASS=61 FAIL=0 |
| Codex and Claude Hard Stop fixture suites | PASS=19 FAIL=0 each |
| Bootstrap Git-hook check | PASS, three executable Git hooks installed |
| Define traceability validator | READY, 6 requirements / 6 acceptance criteria / 6 tasks |
| Release-state validator | READY for active WB-036 |
| Python AST parse of four changed Python files; `git diff --check` | PASS |

The v1 Reviewer r1-r3 findings were resolved by successive rework. Reviewer
r4/Verifier r1, then Reviewer r5/Verifier r2 bound earlier v1 freezes. Opening
v2 to fix the runtime commit contradiction invalidated all earlier assurance.
Their reports remain historical. Reviewer v2 found a newline command-separator
bypass in the shared runtime commit command predicate. Lifecycle rework
invalidated that freeze; the predicate now denies control characters and its
focused regression exercises both runtime adapters. Reviewer r7 found accepted
`--no-verify` abbreviations and shell brace expansion. Another lifecycle
rework invalidated that freeze; the shared predicate now rejects both forms
and glob expansion, with negative cases through each adapter. The final
that freeze required new independent Reviewer and Verifier reports. Reviewer r8
found shell comment parsing and missing `commit-msg` hook preflight gaps. The
shared predicate now disables comment elision and requires both native commit
hooks; both adapters exercise the bypass and missing/non-executable hook cases.
Reviewer r9 identified indirect Git alias and shell-wrapper commit invocation;
the shared dispatcher now denies these before runtime event routing, with
positive direct-Git and negative indirect-command cases through both adapters.
Reviewer r10 identified shell-escaped `g\it` and `${IFS}` Git invocation that
escaped the raw-command fast path. The dispatcher now parses before routing
and rejects decoded or expansion-bearing Git commands. Both adapters have
negative cases for these forms and a positive unrelated search command; the
control-plane suite passed again (19/0), as did both Git fixture suites.
Reviewer r11 found a dynamically assembled executable and subcommand that
avoided literal Git/commit hints. The shared dispatcher now rejects a dynamic
executable before classification and nested shell wrappers carrying hook
bypass flags. Positive direct Git and unrelated search cases and negative
direct/nested dynamic-command cases pass for both adapters (control plane 19/0).
Reviewer r12 found that an encoded bypass flag still escaped the nested-shell
literal check. The dispatcher now rejects nested `sh`/`bash`/`dash`/`zsh -c`
invocations before Git classification; both adapters cover encoded bypass and
an ordinary nested shell invocation as negatives. Control plane passed (19/0).
Reviewer r13 found that leading `env` assignments moved the nested shell
beyond the bounded token scan. The scan now covers all parsed tokens and
combined shell options; both adapters deny the prefixed encoded case. Control
plane passed (19/0) on the corrected predicate.
Reviewer r14 found GNU `env -Sbash` reconstructing a shell executable from a
single option token. The shared dispatcher now rejects `env` split-string
invocations before Git classification; both adapters cover attached and long
options as negative cases and ordinary `env` use as a positive case. The
control-plane suite passed (19/0) after this rework.
Reviewer r15 then demonstrated `command env -Sbash -c` escaping that
first-token check while still executing the encoded Git command. The Owner
approved the cooperative contract in v3: local hooks and adapters are
deterministic normal-path guardrails, and this arbitrary-Bash bypass is a
known capability-model limitation. AC-004 no longer asserts that arbitrary
Bash cannot assemble a bypass. Recognized bypass detection remains in place.
The published-object CI validator adds an independent recheck of all
Git-observable invariants, while external required checks and Owner controls
remain necessary for merge/deploy authority. Earlier assurance is historical;
v3 required fresh Reviewer and Verifier on its final freeze.

Reviewer v3 r1 found that a read-only search for `git` in source text was
blocked as if it were an executable Git command. Rework now classifies the
executable position or recognized command wrapper before applying Git
dispatch checks. Both runtime adapters positively admit a search pattern
containing `git commit`; existing indirect invocation negatives still pass.
The live search command also completed. The r1 freeze and assurance were
invalidated; a new freeze and independent assurance are required.

Reviewer v3 r2 reproduced three defects: configured `origin/HEAD` was compared
as `origin/main` against a local `main` branch; `env`/`command` wrappers of
read-only searches containing Git text were falsely denied; and secret-bearing
`.env.production`/`.env.vps` files were admitted under an approved coordination
glob. The shared policies now normalize the configured default, identify the
wrapped executable, and reject nested `.env.*` except documented `.example`
templates. Focused positive and negative cases pass in Git-transition fixtures,
both runtime adapters, and published-object CI conformance. The r2 freeze and
assurance were invalidated. Reviewer v3 r3 and Verifier v3 independently
returned READY on the exact final frozen candidate; their reports preserve
separate context IDs and matching source identity.

The pre-edit lifecycle check confirmed `scripts/bootstrap.sh` and
`.githooks/commit-msg` remain in place with focused edits. Git's pre-push
event cannot expose an unused force flag or original shell command; the
runtime command guard and external branch policy cover those limits. No
external GitHub ruleset audit is claimed.
