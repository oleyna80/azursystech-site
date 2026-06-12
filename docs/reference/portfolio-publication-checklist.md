# AzurSysTech Portfolio Publication Checklist

Status: local reference

Use this before publishing or pushing changes intended for the public GitHub
repository. The repository is kept as portfolio/source visibility; deployment
runs through the approved VPS Docker image flow.

## Publishable Content

The public repository may include:

- project source code needed to run or review the site;
- tests and fixtures that do not contain private data;
- public `README.md` with purpose, stack, setup, and deployment status;
- sanitized public docs explicitly approved for publication;
- CI/build files that do not expose secrets;
- Dockerfile or Compose examples only when sanitized.

## Synchronized Internal Docs

Synchronize through Git by default so project context survives work from
multiple workstations:

- `AGENTS.md`;
- `Claude.md` / `CLAUDE.md`;
- `.agent/`;
- `memory_bank/`;
- internal `docs/specs/`, `docs/plans/`, `docs/tasklist/`, `docs/reports/`,
  `docs/reference/`, and active-ticket files.

Keep local-only:

- `.codex/`;
- raw prompts, private transcripts, agent logs, scratch files, and unredacted
  handoffs;
- real `.env` files, tokens, private keys, credentials, provider payloads,
  customer data, local database dumps, and raw logs.

## README Minimum

The public `README.md` should answer:

- what AzurSysTech does;
- who the service is for;
- what is implemented now;
- main stack and architecture summary;
- how to run locally;
- how to run checks;
- what is intentionally local-only for privacy/security, mocked, unfinished, or
  excluded;
- deployment status without production config or secrets.

## Screenshots And Demo Data

Before publishing screenshots or demo data:

- remove tokens, emails, private phone numbers, customer names, private URLs,
  local paths, and internal admin data;
- prefer synthetic demo data;
- verify screenshots do not expose browser profiles, API keys, dashboards, VPS
  paths, or secret values;
- keep raw design references local unless explicitly approved.

## Git Hygiene

Before push or portfolio cleanup:

1. Run `git status --short --branch`.
2. Review tracked files with `git ls-files` when publication scope changes.
3. Confirm `.gitignore` does not hide synchronized workflow docs.
4. Confirm `.gitignore` still covers secrets, caches, logs, local runtime
   artifacts, and machine-specific tool state.
5. If a synchronized doc is staged for deletion or ignored, stop and resolve
   before commit.
6. Confirm no `.env`, credentials, build output, or private evidence is staged.
7. Run the checks required by the active work block.

## Public Note

Recommended public README note:

```text
This repository contains project code and public documentation only. Internal
agent workflow notes, planning documents, runtime secrets, and VPS-local
deployment context are intentionally excluded.
```
