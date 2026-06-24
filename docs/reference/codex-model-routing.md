# Codex Model Routing

Codex can participate in the AzurSysTech Agentic SDLC without turning the
project into a provider-specific runtime. Keep model routing as a user or
private project environment concern, and keep committed project files limited
to templates, contracts, and review rules.

## Default Position

Use Codex as the mega-orchestrator and decision auditor:

```text
Codex Orchestrator
  role: Work Block planning, decomposition, architecture decisions, scope
        control, handoff decisions, closeout
  default model: strongest available reasoning model

Codex Critic
  role: independent read-only challenge of Codex decisions before risky work
  default model: strongest available review model

Claude Code Teams
  role: controlled implementation teams with internal subagent management,
        hooks, logs, and critic/verifier gates
  default model: project/runtime environment, usually cheaper executor model
```

This keeps high-value reasoning on the strongest model while letting cheaper
execution runtimes do bounded implementation work when that is operationally
useful.

## What Belongs In This Project

Committed project files may include:

- model-routing policy and decision rules;
- safe templates without real provider credentials;
- custom agent contracts without API keys, proxy URLs, or private endpoints;
- Work Block fields that state which runtime/profile is intended;
- critic rules that require strong-model review for high-risk decisions.

Committed project files must not include:

- real API keys or tokens;
- user-level `~/.codex/config.toml` content with secrets;
- project `.env` files;
- organization-specific proxy URLs unless explicitly sanitized;
- claims that an optional provider works without a smoke test.

## Provider Configuration Boundary

Codex provider settings are user/runtime configuration, not reusable project
policy. Keep real provider definitions outside the repository or inside
private, ignored project-local configuration.

Use user-level Codex config for real provider definitions:

```toml
# ~/.codex/config.toml or ~/.codex/<profile>.config.toml
model_provider = "openai"
model = "strong-review-model"
```

Use project-local `.codex/config.toml` only for safe project behavior such as
hooks, MCP entries, local policy comments, or non-secret overrides. Do not rely
on a committed project template to configure provider credentials.

## Suggested Routing

| Work type | Preferred runtime | Preferred model class |
|---|---|---|
| Architecture, decomposition, risk tradeoffs | Codex Orchestrator | strongest reasoning model |
| Stage 0.5 critic review | Codex Critic | strongest review model |
| Scoped implementation | Claude Code team or Codex worker | cheaper capable executor |
| Large read-only discovery | Codex explorer/worker | cheaper or local model after smoke test |
| Handoff result acceptance | Codex Orchestrator + Critic when triggered | strongest reasoning/review model |
| Final release/publication review | Codex Critic or external reviewer | strongest review model |

## Optional Codex Profiles

Advanced users can define local Codex profiles for different model classes:

```toml
# ~/.codex/strong-review.config.toml
model_provider = "openai"
model = "strong-review-model"
model_reasoning_effort = "high"

# ~/.codex/cheap-worker.config.toml
model_provider = "private-worker-provider"
model = "bounded-worker-model"
model_reasoning_effort = "medium"

# ~/.codex/oss-local.config.toml
oss_provider = "local-runtime"
```

Run a smoke task before trusting any non-default provider for real Work Blocks.
Treat local/OSS providers as experimental until they have passed the same
review and verification flow as remote providers.

## Custom Codex Agents

Codex custom agents can carry narrower instructions and model settings. Keep
them read-only unless the Work Block explicitly grants write authority.

Example shape:

```toml
name = "critic"
description = "Read-only critic for Work Block routing, risks, and verification."
model = "strong-review-model"
model_reasoning_effort = "high"
developer_instructions = """
Review the Stage 0 plan. Challenge scope, risks, verification, and delegation.
Do not modify files.
"""
```

Do not use cheaper worker models for final critic decisions until they have
proved reliable in project retrospectives.

## When Not To Add More Models

Do not add a new provider or model profile when:

- the current Work Block is blocked by unclear requirements, not model cost;
- Claude Code already provides the controlled execution path needed;
- provider setup would introduce secrets/config churn into the project;
- no smoke test is available;
- the model would be used for high-risk review before quality is known.

Prefer the current stable topology until the benefit justifies the operational
cost:

```text
Codex mega-orchestrator -> Codex critic -> Claude Code execution teams
```
