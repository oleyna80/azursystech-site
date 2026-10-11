# WB-007 — Reporting-only closeout / Owner review handoff

**Implementation status: READY for Owner review before publication.**
This is a local coordination handoff, not successful lifecycle closeout or activation.

| Identity | Value |
|---|---|
| Subject branch | `feat/sdlc-wb007-native-runtime-alignment` |
| Baseline | `be9723c17a27393d01a9769c68ae710529acad94` |
| Committed planning | `465f9e12286df22e5da1e7228befca4d2571f428` |
| Frozen source candidate | `2de6a587039633374d3ba13a913cf665a2600ae8` |
| Source tree | `fc67a98a81504b8730f1699830b0e8f9fa05b14f` |
| Disposable admission | `adm-01841457bc9d45b582f559e55a63cd72` |
| Profile | human-governed, pinned baseline revision |
| Lifecycle | schema-v2 ASSURE; Critic, Reviewer, Verifier READY for their exact subjects |

Exactly 19 implementation paths and two approved planning paths form the source delta. This later commit adds only the four approved report paths; it cannot change the frozen source or planning revision. Controller decisions, lifecycle, policy, provider, installation/admission trust and Owner boundaries are unchanged.

## Verification

Python 3.14.4; ResourceWarning promoted to error. Complete independent discovery: controller 138/138, orchestration 81/81, WB-005 17/17; total 236, zero failures/errors/skips and zero Python warnings. Compile PASS; 32 production imports PASS. Reviewer READY and final independent Verifier VERIFIED bind the source above. Accepted Architecture Critic Revision 2 and focused planning-placement gate are traced in the companion report.

Exact commands (independent read-only source clone, isolated HOME/Git config and external cache):

```bash
/usr/bin/python3.14 -W error::ResourceWarning -m unittest discover -s .agent/controllers/v1/tests -t .agent/controllers -v
/usr/bin/python3.14 -W error::ResourceWarning -m unittest discover -s .agent/orchestration/tests -t .agent -v
/usr/bin/python3.14 -W error::ResourceWarning -m unittest discover -s .agent/assurance/wb5/tests -t .agent -v
/usr/bin/python3.14 -W error::ResourceWarning -m compileall -q .agent/controllers/v1 .agent/orchestration .agent/assurance/wb5 scripts/sdlc-v1-bridge.py scripts/sdlc-v1-bootstrap.py
```

Historical canonical FIRST ran against exact WB-006 baseline and frozen WB-005 source `e167b6ffbe01f3977ca2b738d8c12a17a4004110`: PASS, ACTIVATED nested check and rollback PASS. Current WB-007 wiring intentionally differs, so the unchanged historical canonical does not pass on current HEAD; current assurance is the independent regression/native track, not a validator override.
The byte-exact committed workflow was replayed locally on a full-history synthetic merge: historical 225 PASS, current 236 PASS, overall PASS. Negative disposable current test: historical PASS, one intentional current failure, overall exit 1/FAIL. Actual GitHub Actions has not run for this unpublished candidate.

Actual native Codex 0.162.1 and Claude Code 2.1.295/2.1.296 traces prove ALLOW without input rewrite and DENY before target/marker effects. The independently audited matrix covers 16 native cases: 14 retained v3 cases plus two fresh v4 Claude nested/linked ALLOW repeats, with two additional v4 nested/linked DENY probes. Those cases cover terminal/mismatched admission, missing trusted config, nested/linked cwd, foreign repository, malformed payload and missing cwd. Malformed/missing-cwd transport faults and installed-A command pinning in admitted B are declared fixture injection; actual bridge decisions and native blocking remain real. Two initial Codex nested fixture sessions failed at workspace sandbox; contrary to initial metadata, bridge invocation was present in their traces. Normal --add-dir fixture-root repeats passed without source changes. Two v3 Claude nested/linked writes had no bridge dispatch and are superseded EVIDENCE_GAP records. Fresh v4 repeats use explicit --settings selection of the unchanged project configuration, with actual PreToolUse bridge ALLOW/DENY, accepted native responses and authority snapshots. This proves that documented launch mode, not automatic parent settings discovery. The two admitted v4 writes also expose an inherited, unchanged non-authority PostToolUse typecheck relative-path error (exit 127) from nested cwd; this is recorded rather than suppressed.

Plugin 1.0.6 normal-completion observations resolve actual client-provided plugin-data path and original read-only config; absent state yields observed effective false. Seven enabled Stop outcomes cover ALLOW, BLOCK, malformed/empty/unexpected results, child error and timeout-result recovery. Review-child outputs are injected; native plugin dispatch, blocking, bounded recovery and authority snapshots are real. ETIMEDOUT handling is tested, not a real 15-minute wait or AI review quality. Claude emitted an unrelated client model diagnostic for `deepseek-flash[1m]`; it is not a Python/ResourceWarning or a candidate failure. Scope is the tested isolated client composition, not unobserved sessions.

## Preservation and publication boundary

The original dirty WB-037 checkout, production registry, tracked production files, indices, HEADs, Git configuration and registered worktree topology match the initial preservation snapshot (10005 file checks, 7 registered checkouts including a missing historical path). Production installation status differs from the initial snapshot only by 91 previously observed untracked .agents/skills entries; their provenance is not established. Their status/path list matches the paused checkpoint; these entries were not touched during this continuation. The paused checkpoint does not contain content hashes for these newly observed entries. Do not interpret this as a claim that the entire production untracked state matches the original clean status; final comparisons are retained externally. Only disposable installations/registries and the approved source/report scope were written.

No push, remote PR update, merge, deployment, global plugin modification or production hotfix was performed. No publication provenance is claimed. Controller remains ASSURE with exact source Reviewer/Verifier READY. Publication requires the separately applicable Owner authorization and trusted publication predicates; normal success must then use trusted publish, verified remote tip/provenance and INACTIVE. This reporting-only closeout does not bypass that transaction.
