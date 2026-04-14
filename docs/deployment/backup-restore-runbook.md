# Backup & Restore Runbook - AzurSysTech VPS

## Scope
SQL-first intake runtime stores lead data in PostgreSQL.
Critical artifacts are:
- runtime `.env`
- PostgreSQL dumps

## What must be backed up
- `/home/dmitrii/projects/azursystech-site/.env`
- `/home/dmitrii/backups/azursystech-postgres/*.dump`
- Source/config in git remains recoverable by repository checkout

## Backup procedure

```bash
cd /home/dmitrii/projects/azursystech-site
./scripts/backup-env.sh
./scripts/postgres-backup.sh
```

Expected output:
- `/home/dmitrii/backups/azursystech/env-YYYYMMDD-HHMMSS.tar.gz`
- `/home/dmitrii/backups/azursystech-postgres/azursystech-postgres-YYYYMMDDTHHMMSSZ.dump`

Optional daily cron example:

```bash
17 2 * * * /home/dmitrii/projects/azursystech-site/scripts/postgres-backup.sh >> /home/dmitrii/backups/azursystech-postgres/backup.log 2>&1
```

## Restore procedure

1. Restore `.env` from backup archive or recreate from `.env.vps.example`.
2. Start compose stack:

```bash
cd /home/dmitrii/projects/azursystech-site
docker compose -f docker-compose.vps.yml up -d
```

3. Restore SQL dump into a check database:

```bash
LATEST_BACKUP="$(ls -1t /home/dmitrii/backups/azursystech-postgres/*.dump | head -n 1)"
./scripts/postgres-restore.sh "$LATEST_BACKUP" azursystech_restore_check
```

4. Validate restored data:

```bash
docker compose -f docker-compose.vps.yml exec -T postgres sh -lc 'export PGPASSWORD="$POSTGRES_PASSWORD"; psql -U "$POSTGRES_USER" -d azursystech_restore_check -c "select count(*) from intake_leads;"'
```

5. Verify runtime health:

```bash
docker compose -f docker-compose.vps.yml ps
curl -sSI https://azursystech.fr/health
```

6. Optional cleanup of restore-check database:

```bash
docker compose -f docker-compose.vps.yml exec -T -e TARGET_DB="azursystech_restore_check" postgres sh -lc 'export PGPASSWORD="$POSTGRES_PASSWORD"; psql -U "$POSTGRES_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$TARGET_DB\";"'
```

## Recovery target
- RTO: under 30 minutes for application runtime recovery.
- RPO: up to backup interval (default daily unless increased).

## Residual risk
- If backups remain only on the same VPS disk, node loss can remove both production data and backups.
- Recommended follow-up: offsite backup sync (S3, Storage Box, or separate host).
