# ISO Deployment Artifact Isolation — Independent Reduced-Scope Review

**Verdict: REWORK**

- **Repository:** `oleyna80/azursystech-site`
- **Reviewed candidate:** `d38347704753b49b849f4d78928e615e23ff44ef`
- **Base main:** `49e976aefc29402b2e1578efbe64768dd5c30b41`
- **Candidate branch at time of review:** `infra/sdlc-deployment-artifact-isolation-2026-10-13`
- **Review date:** 2026-10-13
- **Review type:** Independent, source-level, read-only; no Docker build, workflow execution, GHCR publication, or VPS deployment.

This report records the findings for the *frozen reviewed candidate SHA*, not for any subsequent documentation-only commit that stores this report.

## 1. Identity and scope — PASS

Independently checked through the connected GitHub repository:

- Candidate branch HEAD matched the exact reviewed SHA.
- `main` matched the specified base; comparison showed 12 commits ahead and 0 behind.
- Exactly three paths changed relative to the base:
  - `.dockerignore` — modified;
  - `.github/workflows/deployment-artifact-isolation.yml` — added;
  - `scripts/verify-runtime-artifact-isolation.py` — added.
- Production `Dockerfile`, `Dockerfile.admin`, `Dockerfile.showcase`, `docker-publish.yml`, `ci.yml`, and `deploy-vps.yml` were read-only dependencies and not changed by the reviewed candidate.

The Owner has deferred ISO-003 publication authority hardening. This review concerns only exclusion of SDLC/agent/control-plane material from Docker build contexts, application runtime filesystems, and managed VPS deployment file transfers. **ISO-003 remains HIGH / OPEN.**

## 2. Blocking findings under the reduced scope

### ISO-RS-001 — MEDIUM: Showcase runtime and event coverage incomplete

**Evidence:** `.github/workflows/deployment-artifact-isolation.yml` lines 7–32 and 93–125; `.github/workflows/docker-publish.yml` lines 82–123.

The isolation workflow builds and scans only `web` and `admin`. Docker Publish always publishes `web` and `showcase`; `admin` is optional. Both `pull_request` and `push` path filters omit `showcase/**`.

**Minimum correction:** Add a `showcase` / `Dockerfile.showcase` runtime-matrix entry and add `showcase/**` to both path-filter lists. Keep Showcase application and Dockerfile behavior unchanged, including the existing Webpack build contract.

### ISO-RS-002 — MEDIUM: Recursive SDLC build-context exclusions incomplete

**Evidence:** `.dockerignore` lines 33–79.

Root-level SDLC exclusions and several nested agent-file rules exist. However, equivalent recursive rules are absent for certain sensitive filenames. Examples that should be covered by the documented policy include nested `opencode.json`, `PRODUCT.md`, `.agentsignore`, and `.codexignore` inside application subtrees. Root-only matches do not establish arbitrary-depth exclusion.

**Minimum correction:** Add narrowly targeted recursive exclusion patterns and context-probe negative fixtures for these identified SDLC-specific filenames. Do not exclude every generic nested `scripts`, `docs`, or `README.md` path indiscriminately: those may be legitimate application assets.

### ISO-RS-003 — MEDIUM: Runtime forbidden-path policy mismatch

**Evidence:** `scripts/verify-runtime-artifact-isolation.py` lines 29–47 and 113–126; `.dockerignore` lines 71–78.

`.dockerignore` excludes `02_website` but the runtime inspector's `FORBIDDEN_DIRS` omits it. Thus `app/02_website/plan.md` is not rejected on account of the directory name. Path checks otherwise cover nested entries and locations outside `/app`, subject to the dependency allowlist.

**Minimum correction:** Align the explicitly identified control-plane policy entries between Docker-context and runtime checks, including `02_website`, and add synthetic TAR fixtures inside and outside `/app`. Decide explicitly whether any document names such as `README.md` are forbidden in runtime images without blocking legitimate third-party documentation.

### ISO-RS-004 — MEDIUM: Symlink to filesystem root bypasses /app escape check

**Evidence:** `scripts/verify-runtime-artifact-isolation.py` lines 129–185.

For a first-party symlink such as `app/public/link` with target `/`, `link_target_parts` normalizes the link to an empty tuple. The first-party escape check requires a nonempty target, so this filesystem-root link does not produce an escape finding.

**Minimum correction:** Treat an absolute link to filesystem root, and equivalent normalized cases, as escaping `/app`. Add a synthetic TAR negative test. No new TAR parser or OCI framework is required.

## 3. Disposition of earlier isolation corrections

- **ISO-001 — Docker context:** Mostly corrected at source level. SDLC root directories are excluded; nested sensitive filename pattern coverage needs the bounded ISO-RS-002 repair.
- **ISO-002 — Runtime forbidden paths:** Significantly corrected. Recursive path checks cover control-plane files and directories, including locations outside `/app`. The precise ISO-RS-003 and ISO-RS-004 false negatives remain.
- **ISO-004 — Dockerfile source and VPS transfer contracts:** PASS at source level. `EXPECTED_COPIES` corresponds to the three unchanged Dockerfiles; unapproved `COPY` changes, `ADD`, `ONBUILD` and `RUN --mount` are rejected. `VPS_RUNTIME_TRANSFER` and the deployed SCP `source` are exactly `docker-compose.vps.yml,deploy.sh,nginx.proxy.conf`.
- **ISO-005 — TAR robustness:** Principal source-level corrections are present: path normalization, forbidden nested members, link validation, bounded findings, bounded `docker export` size, process timeouts, exception propagation, and container cleanup. ISO-RS-004 remains an edge-case gap.

The inspector requires a regular standalone `server.js` entry under an approved `/app` path, scans the full Docker-exported filesystem rather than only `/app`, and includes synthetic negative fixtures for malformed paths, forbidden files, links, and unapproved Dockerfile input changes.

These are **source observations**, not claims that real image scans or CI jobs completed.

## 4. Minimum change set

Only three reviewed candidate files need adjustment:

1. `.github/workflows/deployment-artifact-isolation.yml` — Showcase runtime-matrix entry, both Showcase event path filters, expanded context probes as needed.
2. `.dockerignore` — targeted recursive exclusions for remaining nested SDLC-specific filenames.
3. `scripts/verify-runtime-artifact-isolation.py` — `02_website` policy match, filesystem-root link rejection, corresponding negative fixtures.

Do **not** modify application code, Showcase behavior, production Dockerfiles, Docker Publish, GHCR ACLs, VPS deployment configuration, or the SDLC Controller to close this reduced scope.

## 5. Verification required after correction

The next candidate must be reviewed under its own exact SHA. Required evidence:

1. Inspector `--self-test` passes with all new negative fixtures.
2. `--check-repo-contract` passes for all three production Dockerfiles and the VPS SCP allowlist.
3. The actual synthetic Docker build-context probe demonstrates that root and nested SDLC artifacts are excluded while `web`, `admin` and `showcase` application inputs remain available.
4. Real production-equivalent local Docker images for `web`, `admin` and `showcase` build and pass the runtime inspector.
5. Representative forbidden-content and unsafe-link injections fail closed.
6. The complete isolation workflow passes on the **new exact candidate SHA**.

For `d38347704753b49b849f4d78928e615e23ff44ef`, the GitHub workflow-run lookup returned no runs matching the exact commit. Consequently actual Docker-image contents, run results, and integration behavior were **not independently verified**.

## 6. Deferred publication-hardening risk

**ISO-003 remains HIGH / OPEN and explicitly deferred.**

The unchanged Docker Publish workflow still checks for successful source CI and executes Buildx `push: true` with `packages: write`, without requiring an exact-SHA result from the independent isolation workflow. Independently built diagnostic images do not prove that published OCI images are byte-identical to inspected images.

This residual publication-authority/artifact-identity risk is outside the approved reduced objective. Do not treat this report or a future reduced-scope READY as ISO-003 closure.

## 7. Final decision

**REWORK for exact reviewed candidate `d38347704753b49b849f4d78928e615e23ff44ef`.**

The core ISO-001/002/004/005 corrections are substantially present. Four bounded coverage/policy/link findings remain under the reduced objective. They can be addressed without a separate publisher repository, OCI promotion redesign, application-code changes, or production deployment modifications.

**No implementation or runtime-verification success is certified by this report.**

### Source references

- [Frozen candidate tree](https://github.com/oleyna80/azursystech-site/tree/d38347704753b49b849f4d78928e615e23ff44ef)
- [`.dockerignore`](https://github.com/oleyna80/azursystech-site/blob/d38347704753b49b849f4d78928e615e23ff44ef/.dockerignore)
- [Isolation workflow](https://github.com/oleyna80/azursystech-site/blob/d38347704753b49b849f4d78928e615e23ff44ef/.github/workflows/deployment-artifact-isolation.yml)
- [Runtime inspector](https://github.com/oleyna80/azursystech-site/blob/d38347704753b49b849f4d78928e615e23ff44ef/scripts/verify-runtime-artifact-isolation.py)
- [Docker Publish](https://github.com/oleyna80/azursystech-site/blob/d38347704753b49b849f4d78928e615e23ff44ef/.github/workflows/docker-publish.yml)
- [VPS deployment workflow](https://github.com/oleyna80/azursystech-site/blob/d38347704753b49b849f4d78928e615e23ff44ef/.github/workflows/deploy-vps.yml)
