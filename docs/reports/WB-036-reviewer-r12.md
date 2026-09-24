---
artifact_type: reviewer_report
work_block_id: WB-036
specification: docs/specs/WB-036.md
revision: v2
frozen_candidate: content-sha256:4f86bf37d7bf1dc9c1edd30c19bec231b9728e094f38f135db1960d340efcdb3
status: CHANGES_REQUIRED
verdict: CHANGES_REQUIRED
execution_id: wb036-reviewer-r12-20260924
context_id: /root/wb036_reviewer_r5
---

# Reviewer r12 — CHANGES_REQUIRED

review_result: execution_id=wb036-reviewer-r12-20260924 candidate=content-sha256:4f86bf37d7bf1dc9c1edd30c19bec231b9728e094f38f135db1960d340efcdb3 verdict=CHANGES_REQUIRED

The dispatcher permits a nested shell command with an encoded bypass flag:
`bash -c 'g${WB036_U:-}it comm${WB036_U:-}it --no${WB036_U:-}-verify -m bypass'`.
With the variable unset, Bash executes `git commit --no-verify`; both adapters
miss the event. The nested-shell check only sees literal bypass flags. Reviewer
confirmed command resolution through harmless `git version`, without running
a bypassing commit. Reject the nested shell invocation before lexical Git
classification and add an adapter regression.

The exact frozen source identity and eleven staged source paths matched, with
no unstaged source differences. Reviewer changed no files.
