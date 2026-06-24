# Backup & Restore Runbook - AzurSysTech VPS

## Scope
SQL-first intake runtime stores lead data in PostgreSQL.
Critical artifacts are:
- runtime `.env`
- PostgreSQL dumps
- runtime compose/scripts
- current and previous `APP_IMAGE` values

## What must be backed up
- `/home/dmitrii/backups/azursystech-postgres/*.dump`
- `/home/dmitrii/apps/azursystech/.env`
- `/home/dmitrii/apps/azursystech/.deploy/previous-app-image`
- runtime files in `/home/dmitrii/apps/azursystech`

Migration note:
- `/home/dmitrii/projects/azursystech-site/.env` belongs to the old git-backed runtime directory.
- Keep backing it up until production is fully moved to `/home/dmitrii/apps/azursystech`.

## Backup procedure

```bash
cd /home/dmitrii/apps/azursystech
./scripts/backup-env.sh
./scripts/postgres-backup.sh
```

Expected output:
- `/home/dmitrii/backups/azursystech/env-YYYYMMDD-HHMMSS.tar.gz`
- `/home/dmitrii/backups/azursystech-postgres/azursystech-postgres-YYYYMMDDTHHMMSSZ.dump`

Optional daily cron example:

```bash
17 2 * * * /home/dmitrii/apps/azursystech/scripts/postgres-backup.sh >> /home/dmitrii/backups/azursystech-postgres/backup.log 2>&1
```

## Restore procedure

1. Restore `.env` from backup archive or recreate from `.env.vps.example`.
2. Confirm that `COMPOSE_PROJECT_NAME=azursystech-site` is present when using
   `/home/dmitrii/apps/azursystech`.
3. Confirm that `APP_IMAGE` points to a known-good immutable image tag.
4. Login to the private registry if the app image is not already present locally.
5. Start compose stack:

```bash
cd /home/dmitrii/apps/azursystech
docker compose -f docker-compose.vps.yml pull app || true
docker compose -f docker-compose.vps.yml up -d
```

6. Restore SQL dump into a check database:

```bash
LATEST_BACKUP="$(ls -1t /home/dmitrii/backups/azursystech-postgres/*.dump | head -n 1)"
./scripts/postgres-restore.sh "$LATEST_BACKUP" azursystech_restore_check
```

7. Validate restored data:

```bash
docker compose -f docker-compose.vps.yml exec -T postgres sh -lc 'export PGPASSWORD="$POSTGRES_PASSWORD"; psql -U "$POSTGRES_USER" -d azursystech_restore_check -c "select count(*) from intake_leads;"'
```

8. Verify runtime health:

```bash
docker compose -f docker-compose.vps.yml ps
curl -sSI https://azursystech.fr/health
```

9. Optional cleanup of restore-check database:

```bash
docker compose -f docker-compose.vps.yml exec -T -e TARGET_DB="azursystech_restore_check" postgres sh -lc 'export PGPASSWORD="$POSTGRES_PASSWORD"; psql -U "$POSTGRES_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$TARGET_DB\";"'
```

## Recovery target
- RTO: under 30 minutes for application runtime recovery.
- RPO: up to backup interval (default daily unless increased).

## Fallback note: DB SSL rollout
- If `scripts/postgres-ssl-rollout.sh --mode require|verify-full --apply` fails DB probe, restore `.env` from the timestamped backup created by the script and restart `app`:

```bash
cd /home/dmitrii/apps/azursystech
cp .env.db-ssl-rollout-<timestamp>.bak .env
docker compose -f docker-compose.vps.yml up -d app
```

## Residual risk
- If backups remain only on the same VPS disk, node loss can remove both production data and backups.
- If the private registry is unavailable and no local rollback image remains, app recovery can be delayed.
- Recommended follow-up: offsite backup sync (S3, Storage Box, or separate host).
