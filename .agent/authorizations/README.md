# Authorization Records — Legacy Compatibility

Per-Work-Block SSH-signed authorization records are retired from the default
Agentic SDLC development path as of WB-CORE-004.

New projects and normal Work Blocks do **not** require:

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
rulesets/protected branches, least-privilege agent credentials, GitHub Actions
permissions, OS isolation, and separately held production/VPS/DB/secrets.

This directory may remain so historical signed authorization records can be kept
as audit evidence. Their presence does not grant current authority and generated
schema v3 gates do not bind to them.
