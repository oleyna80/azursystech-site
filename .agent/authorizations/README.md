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

AzurSysTech currently uses the private-repository Free fallback: no standalone
agent credential with repository `Contents: write`; feature-branch publication
uses an Owner-controlled GitHub channel; production deployment remains Owner-only
and manual. If protected-main enforcement is later enabled, the agent credential
may be widened only to the least privilege required for feature work and must not
receive GitHub Actions write/dispatch authority or production credentials.

This directory may remain so historical signed authorization records can be kept
as audit evidence. Their presence does not grant current authority and schema v3
gates do not bind to them.
