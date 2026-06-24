# AzurSysTech Security Baseline

Status: local reference

Use this checklist before release, deploy, public repo publication, external
integration, or any change touching auth, secrets, logging, Docker, webhooks, or
production config.

## Secrets

- Store real secrets only in local `.env`, VPS-local env files, Docker/GitHub
  secrets, or an approved secret store.
- Commit only placeholders such as `.env.example`.
- Never print tokens, API keys, private keys, passwords, full connection
  strings, Docker auth files, or provider payloads with sensitive data.
- Never bake secrets into Docker images or pass them as build args.

## Public Repository

- GitHub is portfolio/source visibility. Review all committed workflow files
  for secrets, private client context, raw transcripts, local machine paths,
  generated logs, and unreviewed agent conclusions before publication.
- The `.agent/`, `.claude/`, `memory_bank/`, and agent-facing `docs/` workflow
  layer is synchronized through Git by default (per `AGENTS.md § Synchronized
  Agent Layer`). Keep secrets, credentials, private transcripts, local runtime
  logs, caches, and machine-specific tool state out of Git.
- `.gitignore` does not untrack already tracked files; use approved
  `git rm --cached <path>` when local preservation is required.

## Runtime Config

- Treat config, environment, deploy, and credential changes as approval-gated.
- Keep production config separate from local development config.
- Validate required environment variables at startup where practical.
- Do not expose production `.env` files, Docker credentials, or VPS-only
  runtime files in docs, logs, screenshots, or commits.

## Auth, Webhooks, And External Providers

- Enforce authorization server-side.
- Do not trust client-provided ownership, roles, prices, statuses, totals, or
  IDs for sensitive operations.
- Verify webhook signatures when the provider supports it.
- Use idempotency for webhooks, scheduled jobs, and external sends.
- AI-generated outbound content stays draft until human approval.

## Logging And Data

- Log operational events, not secrets.
- Minimize PII in logs and reports.
- Do not copy real customer data into docs, prompts, reports, screenshots, or
  public repositories.

## Docker And VPS

- Prefer WSL/CI builds and registry pull on the VPS.
- Do not run CPU-heavy builds on the VPS unless explicitly approved.
- Review `.dockerignore` before production image builds.
- Ensure Docker images do not include `.env`, agent docs, memory files, private
  keys, build caches, or local-only artifacts.

## Minimum Release Review

- secret/config diff review;
- auth/permissions review for changed routes or actions;
- Docker image and dependency hygiene review when deploy is involved;
- verification commands recorded with results and skipped checks.
