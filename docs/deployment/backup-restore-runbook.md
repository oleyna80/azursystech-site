# Backup & Restore Runbook - AzurSysTech VPS

## Scope
Deployment is stateless. The only critical VPS-local backup artifact is runtime `.env`.

## What must be backed up
- Critical: `/home/dmitrii/projects/azursystech-site/.env`
- Recoverable from git: source, compose files, nginx config, workflows

## Backup procedure

```bash
cd /home/dmitrii/azursystech
./scripts/backup-env.sh
```

Expected output archive:
- `/home/dmitrii/backups/azursystech/env-YYYYMMDD-HHMMSS.tar.gz`

## Restore procedure

1. Clone repository to VPS path.
2. Restore `.env` from backup archive or recreate from `.env.vps.example`.
3. Login to GHCR with `read:packages` PAT.
4. Deploy with immutable `IMAGE_TAG=sha-*`.
5. Verify `docker compose ps` and `/health` response.

## Recovery target
- RTO: under 15 minutes with valid image and `.env` backup.
