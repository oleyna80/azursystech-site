# Authorization Records — Legacy Compatibility

Per-Work-Block SSH-signed authorization records are retired from the normal
AzurSysTech development path by `WB-2026-08-12-github-capability-authority-migration`,
which adopts the framework `WB-CORE-003F` GitHub capability authority model.

New AzurSysTech Work Blocks do **not** require:

- an Owner private signing key;
- `ssh-keygen -Y sign` / `verify`;
- an external `allowed_signers` file;
- detached `<record>.json.sig` files;
- authorization-bootstrap commits.

The reason is architectural: project-local hooks are cooperative controls, not
an OS security boundary, while the signed state machine added circular bootstrap,
replay, H0/H1/H2, expiry, and runtime-parity complexity around ordinary reversible
Git operations.

The preferred security boundary is external capability separation: GitHub
protected branches/rulesets where the hosting plan supports them, least-privilege
credentials, GitHub Actions permissions, OS isolation, and separately held
production/VPS/DB/secrets.

AzurSysTech may use a constrained repository `Contents: write` capability for
ordinary non-force publication of an assured candidate to the exact active
non-default subject branch. That capability is bounded by the active Work Block
and `governance/authority.md`; it is not a general publication credential. It
does not permit default/protected-branch pushes, force pushes, remote deletion,
tags/releases, merge, deployment, GitHub Actions write/dispatch authority, or
production credentials. The Owner alone reviews the pushed candidate and decides
`MERGE`, `REVISION`, or `REJECT`.

This directory may remain so historical signed authorization records can be kept
as audit evidence. Their presence does not grant current authority and schema v3
gates do not bind to them.
