# Review Report: WB-2026-08-25-shared-analysis-surface

## Verdict

READY

## Scope

Fresh local review of the complete corrective candidate based on
`cd9b594f9db620b3fa1bc3d0f898ad1fbc639f59`, including the follow-on REQ-005
Git-path parsing correction and reconciled lifecycle evidence. Earlier
repository-side review evidence is historical.

## Findings

- Pre-correction reproduction with Git's quoted display output showed false PASS
  for `private_evidence/секрет.txt`, `memory_bank/notes-français.md`, and
  `.codex/worktrees/копия.txt`.
- The validator now invokes `git ls-files -z`, splits the byte stream only on
  NUL, and applies `os.fsdecode` to each original pathname before protected-path
  checks. Its textual `rev-parse` call remains separate.
- The regression fixture forces `core.quotePath=true` and deterministically
  rejects the three reported non-ASCII paths, a newline-bearing private-evidence
  path, and a tab-bearing memory-bank path with their category diagnostics.
- The fix is limited to existing REQ-005 enforcement and its regression
  coverage. No workflow, requirement, dependency, runtime, product, deployment,
  data, secret, framework, hook, or unrelated path is in scope.

The narrow corrective delta has no technical blocker. Review verdict: READY.
Exact final-SHA confirmation and GitHub CI remain external after the final
repository commit.
