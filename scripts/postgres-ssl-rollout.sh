#!/usr/bin/env bash
set -euo pipefail

MODE="require"
APPLY="false"
PROJECT_DIR=""
COMPOSE_FILE=""

usage() {
  cat <<'USAGE'
Usage: postgres-ssl-rollout.sh [--mode <disable|require|verify-full>] [--apply] [--project-dir <path>] [--compose-file <path>]
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)
      MODE="${2:-}"
      shift 2
      ;;
    --apply)
      APPLY="true"
      shift
      ;;
    --project-dir)
      PROJECT_DIR="${2:-}"
      shift 2
      ;;
    --compose-file)
      COMPOSE_FILE="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

case "$MODE" in
  disable|require|verify-full) ;;
  *)
    echo "Invalid --mode value: $MODE (expected disable|require|verify-full)" >&2
    exit 1
    ;;
esac

if [[ -z "$PROJECT_DIR" ]]; then
  PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fi

if [[ ! -d "$PROJECT_DIR" ]]; then
  echo "Project directory not found: $PROJECT_DIR" >&2
  exit 1
fi

if [[ -z "$COMPOSE_FILE" ]]; then
  COMPOSE_FILE="$PROJECT_DIR/docker-compose.vps.yml"
elif [[ "$COMPOSE_FILE" != /* ]]; then
  COMPOSE_FILE="$PROJECT_DIR/$COMPOSE_FILE"
fi

ENV_FILE="$PROJECT_DIR/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing .env file: $ENV_FILE" >&2
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Missing compose file: $COMPOSE_FILE" >&2
  exit 1
fi

COMPOSE_CMD=(docker compose -f "$COMPOSE_FILE")

POSTGRES_SSL="$("${COMPOSE_CMD[@]}" exec -T postgres sh -lc '
  export PGPASSWORD="$POSTGRES_PASSWORD"
  psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tA -c "SHOW ssl;"
' | tr -d '\r' | xargs)"

if [[ "$MODE" != "disable" && "$POSTGRES_SSL" != "on" ]]; then
  echo "PostgreSQL reports ssl=$POSTGRES_SSL; refusing mode=$MODE" >&2
  exit 1
fi

if [[ "$APPLY" != "true" ]]; then
  echo "DB_SSL_ROLLOUT_DRY_RUN mode=$MODE project_dir=$PROJECT_DIR compose_file=$COMPOSE_FILE env_file=$ENV_FILE postgres_ssl=$POSTGRES_SSL apply=false"
  echo "DB_SSL_ROLLOUT_OK mode=$MODE dry_run=true"
  exit 0
fi

TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_FILE="$PROJECT_DIR/.env.db-ssl-rollout-$TIMESTAMP.bak"
cp "$ENV_FILE" "$BACKUP_FILE"
chmod 600 "$BACKUP_FILE"

if grep -q '^DATABASE_SSL_MODE=' "$ENV_FILE"; then
  sed -i "s/^DATABASE_SSL_MODE=.*/DATABASE_SSL_MODE=$MODE/" "$ENV_FILE"
else
  printf '\nDATABASE_SSL_MODE=%s\n' "$MODE" >> "$ENV_FILE"
fi

"${COMPOSE_CMD[@]}" up -d app
echo "DB_SSL_ROLLOUT_APPLIED mode=$MODE env_file=$ENV_FILE backup_file=$BACKUP_FILE"

set +e
"${COMPOSE_CMD[@]}" exec -T -e DATABASE_SSL_MODE="$MODE" app sh -lc '
  node - <<'"'"'NODE'"'"'
const { Client } = require("pg");

const connectionString = process.env.DATABASE_URL;
const mode = (process.env.DATABASE_SSL_MODE || "disable").toLowerCase();

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

let ssl;
if (mode === "disable") {
  ssl = false;
} else if (mode === "require") {
  ssl = { rejectUnauthorized: false };
} else if (mode === "verify-full") {
  ssl = { rejectUnauthorized: true };
} else {
  throw new Error(`Unsupported DATABASE_SSL_MODE: ${mode}`);
}

const client = new Client({ connectionString, ssl });

async function main() {
  await client.connect();
  await client.query("select 1");
  await client.end();
}

main().catch(async (error) => {
  try {
    await client.end();
  } catch (_ignored) {}
  console.error(error.message || String(error));
  process.exit(1);
});
NODE
'
PROBE_EXIT="$?"
set -e

if [[ "$PROBE_EXIT" -ne 0 ]]; then
  cp "$BACKUP_FILE" "$ENV_FILE"
  set +e
  "${COMPOSE_CMD[@]}" up -d app >/dev/null 2>&1
  ROLLBACK_RESTART_EXIT="$?"
  set -e
  echo "DB_SSL_ROLLOUT_ROLLBACK mode=$MODE backup_file=$BACKUP_FILE probe_exit=$PROBE_EXIT rollback_restart_exit=$ROLLBACK_RESTART_EXIT"
  exit 1
fi

echo "DB_SSL_ROLLOUT_OK mode=$MODE dry_run=false backup_file=$BACKUP_FILE"
