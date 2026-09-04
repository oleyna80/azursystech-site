# Legacy authorization evidence inventory — 2026-08-13

## Purpose

This is an inventory, not an authorization. AzurSysTech's active lifecycle is
schema 3 with `authority_mode=github_capability`; SSH signatures and
authorization drafts listed here are retired from normal Work Block opening.

## Discovery boundary

Discovery was read-only in the canonical checkout using:

```text
rg --files .agent/authorizations docs | rg 'authorization|\\.sig$'
```

The boundary was `.agent/authorizations/**` and `docs/**` files whose paths
contain `authorization` or end with `.sig`. It found the tracked recovery pair,
the staged Showcase pair, and the two untracked draft records below. No claim
is made about ignored, external, deleted, or unrelated repositories.

## Evidence retained without modification

| Origin path | SHA-256 | Classification |
| --- | --- | --- |
| `.agent/authorizations/WB-2026-08-11-deploy-recovery.json` | `ee474849cbe9e199acdd6b7305d64ff39dc45cbe9715a991d364107d6370529c` | tracked schema-v1 authorization record; historical only |
| `.agent/authorizations/WB-2026-08-11-deploy-recovery.json.sig` | `c33c6a63b3d1cad8b6a991eac0802d78f71350caf85f82b211b62d360fba2811` | tracked SSH signature; historical only |
| `.agent/authorizations/WB-2026-08-12-showcase-production-multizone.json` | `254e48c7062c9b9c0154a9632090aef539ff7cfaf81c0c55cf05d6e00ba94cf4` | staged schema-v1 authorization record; historical only |
| `.agent/authorizations/WB-2026-08-12-showcase-production-multizone.json.sig` | `877ce4e4a116071e6bc0632047d90f03ce37c4351dbc00b01c5427f6e7b878ce` | staged SSH signature; historical only |
| `docs/plans/WB-2026-08-11-deploy-recovery.authorization-draft.json` | `ee474849cbe9e199acdd6b7305d64ff39dc45cbe9715a991d364107d6370529c` | untracked schema-v1 recovery draft; historical only |
| `docs/plans/WB-2026-08-12-showcase-production-multizone.authorization-draft.json` | `254e48c7062c9b9c0154a9632090aef539ff7cfaf81c0c55cf05d6e00ba94cf4` | untracked schema-v1 Showcase draft; historical only |

## Handling rule

- Do not verify, regenerate, sign, keygen, amend, or use these files to open
  a Work Block.
- Do not delete, unstage, reset, or move them during this inventory Work Block.
- Any later archival relocation requires its own exact Owner-approved manifest
  because two records are already staged user changes.

## Related historical evidence

The recovery plan/tasklist/critic/verifier documents describe a prior deploy
and may be retained for operational history. They do not supply current
authorization for Showcase or any other future change.
