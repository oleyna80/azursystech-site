---
artifact_type: reviewer_report
work_block_id: WB-036
specification: docs/specs/WB-036.md
revision: v2
frozen_candidate: content-sha256:6fa31a9a1e6019f439ebe6bbd4e1483afe65c61fccd4b526d9bea4a1dc823223
status: CHANGES_REQUIRED
verdict: CHANGES_REQUIRED
execution_id: wb036-reviewer-r9-20260924
context_id: /root/wb036_reviewer_r5
---

# Reviewer r9 — CHANGES_REQUIRED

review_result: execution_id=wb036-reviewer-r9-20260924 candidate=content-sha256:6fa31a9a1e6019f439ebe6bbd4e1483afe65c61fccd4b526d9bea4a1dc823223 verdict=CHANGES_REQUIRED

The independent read-only Reviewer confirmed the r8 repairs but found an
indirect commit bypass in both runtime adapters. `git -c alias.c=commit c -n
-m candidate` invokes a Git alias, while the adapter commit parser returns
`None`; the shared direct-commit predicate is never called. A shell wrapper
such as `bash -c 'git commit -n -m candidate'` also escapes commit detection.
Both can skip native hooks. Require direct Git invocation and deny alias
dispatch in a shared policy, with negative tests through both adapters.

The frozen identity matched all eleven staged source files; no unstaged source
diff or cached whitespace error was present. Reviewer inspected the spec,
matrix, shared policy, hooks, adapters, and test record without changing files.
