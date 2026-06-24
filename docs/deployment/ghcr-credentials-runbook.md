# GHCR Credentials Runbook

## Decision

Use separate credentials for image publishing and production image pulling.

- WSL build/push credential: classic GitHub PAT with `write:packages`.
- VPS deploy pull credential: classic GitHub PAT with `read:packages` only.

Do not reuse a broad local GitHub token on the VPS.

## Token model

GitHub Container Registry authentication for Docker uses GitHub Packages
permissions. GitHub Packages registry authentication requires a personal access
token classic.

Minimum scopes:

| Host | Purpose | Token type | Required scope |
| --- | --- | --- | --- |
| WSL | Build and push image to GHCR | classic PAT | `write:packages` |
| VPS | Pull production image from GHCR | classic PAT | `read:packages` |

Recommended names:

- `azursystech-wsl-ghcr-push`
- `azursystech-vps-ghcr-readonly`

Use expiration. Rotate before expiry.

## Create the VPS read-only token

In GitHub:

1. Open `Settings -> Developer settings -> Personal access tokens -> Tokens (classic)`.
2. Generate a new token.
3. Name: `azursystech-vps-ghcr-readonly`.
4. Expiration: set a finite date.
5. Scopes: select only `read:packages`.
6. Generate the token and copy it once.

Do not add `repo`, `write:packages`, or `delete:packages` for the VPS token.

## Install or rotate VPS Docker login

From WSL:

```bash
cd /home/dmitrii/azursystech
chmod +x scripts/vps-ghcr-login.sh
./scripts/vps-ghcr-login.sh
```

The script prompts for the token without echoing it. It does not accept tokens
as command-line arguments.

Non-interactive form:

```bash
printf '%s\n' "$GHCR_VPS_READONLY_TOKEN" | ./scripts/vps-ghcr-login.sh
```

After login, the script verifies that the VPS can inspect the current app image
manifest.

## Verify deploy credential manually

On VPS:

```bash
docker manifest inspect ghcr.io/oleyna80/azursystech-app:sha-fbf4e2f653f1-20260508T144928Z >/dev/null
```

Then verify normal deploy state:

```bash
cd /home/dmitrii/apps/azursystech
docker compose -f docker-compose.vps.yml ps
curl -fsSI https://azursystech.fr/health
```

## Rotate

1. Create a new `read:packages` token in GitHub.
2. Run `./scripts/vps-ghcr-login.sh` from WSL.
3. Verify manifest access and `/health`.
4. Revoke the old VPS token in GitHub.

## Incident handling

If a broad token was copied to the VPS:

1. Install the replacement `read:packages` VPS token.
2. Verify `docker manifest inspect` for the current image.
3. Revoke the broad token in GitHub if it is no longer needed.
4. If the token may have leaked, rotate any dependent credentials immediately.

Do not print Docker auth files, tokens, or `.env` contents in reports.

## References

- GitHub Docs: [Working with the Container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).
- GitHub Docs: [About permissions for GitHub Packages](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages).
