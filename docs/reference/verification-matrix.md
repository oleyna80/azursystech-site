# AzurSysTech Verification Matrix

Status: local reference

Use this matrix to choose checks for each work block. Prefer targeted checks
that prove the changed contract, then add wider checks only when the blast
radius justifies them.

## Default Layers

1. Read the relevant SSOT: `AGENTS.md`, `memory_bank/*`, active spec, plan,
   tasklist, and domain docs.
2. Check changed-file scope against the approved write-set.
3. Run the smallest reliable syntax, type, lint, test, build, or smoke check
   for the changed behavior.
4. Review config, secrets, deploy, logging, and public repo exposure when the
   change touches operations or publishing.

## Suggested Checks

| Change class | Minimum verification |
| --- | --- |
| Read-only analysis | Source inspection with cited files and residual risks |
| Markdown/process docs | Readback, path sanity, `git diff --check` |
| Public content/contact/legal | Compare against strategy, brand, website, contact, and legal SSOT |
| Frontend UI | Typecheck/lint/build as applicable; browser smoke for changed routes |
| API/runtime | Typecheck or syntax check; focused tests; negative-path validation |
| Database/storage | Migration/contract review; controlled local or mocked persistence smoke |
| Security/secrets | Secret exposure review; unsafe env/log review; dependency/config review |
| Docker/deploy | Image/build or pull proof; compose state; public health; no secrets in image |

## Acceptance Verdicts

- `accept`: required checks passed and no material hidden risk remains.
- `accept with follow-up`: core checks passed and residual risk is bounded.
- `do not accept yet`: required checks are missing, failed, or ambiguous.

## Verification Report

Every verification report must include:

- commands run;
- result summary;
- checks skipped with reasons;
- whether runtime/browser/deploy checks ran;
- remaining risks;
- next recommended action.
