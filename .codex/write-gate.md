# Codex Write Gate — Cooperative Scope Guard

> Human-readable compatibility note. The executable project-local state is
> `.agent/active-work-block.json`.

## Security boundary

The write gate is a **cooperative scope guard**, not a security boundary.

It enforces Work Block/write-set discipline inside the normal agent channel.
Consequential authority belongs outside the mutable project: GitHub repository
controls, least-privilege credentials, workflow permissions, OS isolation, and
separately held production/VPS/DB/secrets.

Per-Work-Block SSH signatures and detached authorization records are retired
from the normal AzurSysTech development path.

## Default state

AzurSysTech uses schema v3:

```json
{
  "schema_version": 3,
  "authority_mode": "github_capability",
  "write_gate": {"status": "BLOCKED", "opened_at": null},
  "write_set": []
}
```

While BLOCKED, only the configured coordination write-set is available for
planning/evidence work.

## Opening source work

After the Work Block, specification, write-set, and Critic state are resolved,
open the local scope gate without cryptographic signing:

```bash
python3 .codex/scripts/lifecycle.py open \
  --work-block-id WB-EXAMPLE \
  --specification-path docs/plans/wb-example.md \
  --specification-revision <git-revision-or-contract-revision> \
  --write src/example.py \
  --write tests/test_example.py \
  --critic-status READY \
  --critic-verdict APPROVE
```

This records the current Git HEAD as the planning baseline and sets the local
write scope to READY. Subsequent normal commits do not create a cryptographic
STALE/renew cycle; a material scope or requirement change returns to Define and
reopens the Work Block scope explicitly.

## Codex guardrails

`PreToolUse` checks:

- schema v3 and `authority_mode=github_capability`;
- active Work Block and READY state;
- specification path/revision;
- resolved Critic state;
- explicit source write-set;
- apply-patch source **and Move destination** paths;
- explicit Bash mutation targets;
- staged commit paths.

Normal feature-branch `git commit` is permitted when scope is valid. A normal
feature-branch push is not cryptographically authorized by this file; it is
possible only when the external GitHub credential/channel permits it. The shared
Hard Stop guard rejects direct default-branch push, force/broad/destructive push,
obvious destructive actions, live infrastructure/data operations,
credential/secret operations, client-facing communications, and external image
publish in the normal agent channel.

## Coordination while BLOCKED

Typical coordination paths:

```text
.agent/active-work-block.json
.agent/critic-gate.md
.agent/verification-gate.md
.codex/write-gate.md
docs/architecture/drafts/**
docs/specs/**
docs/plans/**
docs/tasklist/**
docs/reports/**
memory_bank/**
```

These paths do not grant production, credential, data, deployment, or default-
branch authority.

## AzurSysTech GitHub boundary

`oleyna80/azursystech-site` is a private repository. On the current hosting mode,
protected-main/ruleset enforcement is not available. Therefore the accepted
**Free fallback** is capability separation rather than a claim of branch
protection:

- do not provision a standalone agent credential with repository `Contents:
  write`;
- local edit/test/stage/commit may be autonomous inside an approved Work Block;
- feature-branch publication is performed through an Owner-controlled GitHub
  channel;
- deployment stays manual `workflow_dispatch` and Owner-controlled;
- production/VPS/DB/secrets are not exposed to the normal agent process.

If the repository later gains protected-main enforcement, the preferred agent
credential is least privilege for feature development with GitHub Actions
**read-only** and no administration, environment, secret, deployment, or
production credential authority.

A project-local hook must never be represented as equivalent to GitHub branch
protection.

## Legacy signed records

Historical `.agent/authorizations/*.json` and `.sig` files may remain as audit
evidence. Schema v3 does not require or trust them for normal development.
