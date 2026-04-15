#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <backup_file.dump> <target_database>"
  exit 1
fi

BACKUP_FILE="$1"
TARGET_DB="$2"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-$ROOT_DIR/docker-compose.vps.yml}"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

if [[ ! "$TARGET_DB" =~ ^[a-zA-Z0-9_]+$ ]]; then
  echo "Invalid database name: $TARGET_DB"
  exit 1
fi

docker compose -f "$COMPOSE_FILE" exec -T -e TARGET_DB="$TARGET_DB" postgres sh -lc '
  export PGPASSWORD="$POSTGRES_PASSWORD"
  psql -U "$POSTGRES_USER" -d postgres -v ON_ERROR_STOP=1 <<SQL
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '\''$TARGET_DB'\'' AND pid <> pg_backend_pid();
DROP DATABASE IF EXISTS "$TARGET_DB";
CREATE DATABASE "$TARGET_DB";
SQL
'

cat "$BACKUP_FILE" | docker compose -f "$COMPOSE_FILE" exec -T -e TARGET_DB="$TARGET_DB" postgres sh -lc '
  export PGPASSWORD="$POSTGRES_PASSWORD"
  pg_restore -U "$POSTGRES_USER" -d "$TARGET_DB" --no-owner --no-privileges --verbose
'

echo "RESTORE_OK $TARGET_DB from $BACKUP_FILE"
