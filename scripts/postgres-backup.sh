#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-$ROOT_DIR/docker-compose.vps.yml}"
BACKUP_DIR="${BACKUP_DIR:-/home/dmitrii/backups/azursystech-postgres}"
KEEP_BACKUPS="${KEEP_BACKUPS:-14}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_FILE="$BACKUP_DIR/azursystech-postgres-$TIMESTAMP.dump"

mkdir -p "$BACKUP_DIR"

docker compose -f "$COMPOSE_FILE" exec -T postgres sh -lc '
  export PGPASSWORD="$POSTGRES_PASSWORD"
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -F c -Z 9
' > "$BACKUP_FILE"

chmod 600 "$BACKUP_FILE"

if [[ "$KEEP_BACKUPS" =~ ^[0-9]+$ ]] && [ "$KEEP_BACKUPS" -ge 1 ]; then
  mapfile -t OLD_BACKUPS < <(ls -1t "$BACKUP_DIR"/azursystech-postgres-*.dump 2>/dev/null | tail -n +"$((KEEP_BACKUPS + 1))")
  if [ "${#OLD_BACKUPS[@]}" -gt 0 ]; then
    rm -f "${OLD_BACKUPS[@]}"
  fi
fi

echo "BACKUP_OK $BACKUP_FILE"
