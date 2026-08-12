# Codex Write Gate — Cooperative Scope Guard

> Human-readable compatibility note. The executable project-local state is
> `.agent/active-work-block.json`.

## Security boundary

The write gate is a **cooperative scope guard**, not a security boundary.

It enforces Work Block/write-set discipline inside the normal agent channel.
Consequential authority belongs outside the mutable project: GitHub repository
rules, least-privilege credentials, workflow permissions, OS isolation, and
separately held production/VPS/DB/secrets.

Per-Work-Block SSH signatures and detached authorization records are retired
from the default path.

## Default state

Generated projects start with schema v3:

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

Normal feature-branch `git commit` and `git push` are permitted when scope is
valid. The separate shared Hard Stop guard rejects direct default-branch push,
force push, obvious destructive actions, live infrastructure/data operations,
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

These paths do not grant production, credential, data, deployment, or protected
branch authority.

## GitHub-native boundary

For the public framework repository, `main` is protected externally by the
active GitHub ruleset: pull requests and required checks are mandatory, while
branch deletion and non-fast-forward updates are prohibited.

Consumer projects should use a dedicated least-privilege agent credential. If
an agent must not deploy production, do not give that credential GitHub Actions
write/dispatch authority and do not expose VPS/DB/production secrets to the
agent process.

## Legacy signed records

Historical `.agent/authorizations/*.json` and `.sig` files may remain as audit
evidence. Schema v3 does not require or trust them for normal development.
