#!/usr/bin/env bash
set -euo pipefail
umask 077

TARGET_DIR="/home/dmitrii/apps/azursystech"
SOURCE_PROJECTS_DIR="/home/dmitrii/projects/azursystech-site"
EXPECTED_VOLUME="azursystech-site_postgres_data"
EXPECTED_PROJECT="azursystech-site"

PREPARE_CUTOVER=0
EXECUTE_CUTOVER=0

if [ "$#" -eq 2 ]; then
  RAW_BACKUP_DIR="$1"
  RAW_CANDIDATE_COMPOSE="$2"
elif [ "$#" -eq 3 ]; then
  RAW_BACKUP_DIR="$1"
  RAW_CANDIDATE_COMPOSE="$2"
  if [ "$3" = "--prepare-cutover" ]; then
    PREPARE_CUTOVER=1
  elif [ "$3" = "--execute-cutover" ]; then
    EXECUTE_CUTOVER=1
  else
    echo "ERROR: Invalid third argument: '$3'. Permitted options: '--prepare-cutover', '--execute-cutover'." >&2
    exit 2
  fi
else
  echo "ERROR: Invalid number of arguments. Expected 2 (<BACKUP_DIR> <CANDIDATE_COMPOSE>) or 3 (<BACKUP_DIR> <CANDIDATE_COMPOSE> --prepare-cutover|--execute-cutover)." >&2
  exit 2
fi

if [[ "${RAW_BACKUP_DIR}" != /home/dmitrii/backups/consolidation-* ]]; then
  echo "ERROR: BACKUP_DIR must start with /home/dmitrii/backups/consolidation-" >&2
  exit 2
fi

if [[ "${RAW_CANDIDATE_COMPOSE}" != /* ]]; then
  echo "ERROR: CANDIDATE_COMPOSE must be an absolute path" >&2
  exit 2
fi

if [ ! -d "${RAW_BACKUP_DIR}" ]; then
  echo "ERROR: BACKUP_DIR does not exist or is not a directory" >&2
  exit 2
fi

if [ ! -s "${RAW_CANDIDATE_COMPOSE}" ]; then
  echo "ERROR: CANDIDATE_COMPOSE does not exist or is empty" >&2
  exit 2
fi

RESOLVED_BACKUP_DIR="$(realpath "${RAW_BACKUP_DIR}")"
RESOLVED_CANDIDATE_COMPOSE="$(realpath "${RAW_CANDIDATE_COMPOSE}")"

if [[ "${RESOLVED_BACKUP_DIR}" != /home/dmitrii/backups/* ]]; then
  echo "ERROR: Resolved BACKUP_DIR must be under /home/dmitrii/backups/" >&2
  exit 2
fi

if [[ "${RESOLVED_BACKUP_DIR}" != /home/dmitrii/backups/consolidation-* ]]; then
  echo "ERROR: Resolved BACKUP_DIR must start with /home/dmitrii/backups/consolidation-" >&2
  exit 2
fi

if [[ "${RESOLVED_CANDIDATE_COMPOSE}" != /home/dmitrii/apps/azursystech/* ]]; then
  echo "ERROR: Resolved CANDIDATE_COMPOSE must be under /home/dmitrii/apps/azursystech/" >&2
  exit 2
fi

BACKUP_DIR="${RESOLVED_BACKUP_DIR}"
CANDIDATE_COMPOSE="${RESOLVED_CANDIDATE_COMPOSE}"

exec 200>/tmp/azursystech-deploy.lock
if ! flock -n 200; then
  echo "ERROR: deployment or migration is already running" >&2
  exit 1
fi

echo "=== 1. Validating Backup Artifacts from 4A ==="
REQUIRED_BACKUP_FILES=(
  "azursystech_pg_dump.sql.gz"
  "db-baseline.txt"
  "preflight-summary.txt"
  "docker-metadata-before.txt"
  ".env.apps"
  ".env.projects"
  "docker-compose.vps.yml.apps"
  "docker-compose.vps.yml.projects"
)

for f in "${REQUIRED_BACKUP_FILES[@]}"; do
  if [ ! -s "${BACKUP_DIR}/${f}" ]; then
    echo "ERROR: Required backup artifact ${f} is missing or empty in ${BACKUP_DIR}" >&2
    exit 1
  fi
done

echo "=== 2. Validating PostgreSQL Dump Integrity ==="
DUMP_FILE="${BACKUP_DIR}/azursystech_pg_dump.sql.gz"
gzip -t "${DUMP_FILE}"

if ! gzip -cd "${DUMP_FILE}" | awk '
  NR <= 30 && tolower($0) ~ /postgresql database dump/ {
    found=1
  }
  END {
    exit(found ? 0 : 1)
  }
'; then
  echo "ERROR: PostgreSQL dump header validation failed" >&2
  exit 1
fi

echo "=== 3. Checking Preconditions on Current Runtime ==="
if [ ! -d "${TARGET_DIR}" ] || [ ! -d "${SOURCE_PROJECTS_DIR}" ]; then
  echo "ERROR: Target directory or Source projects directory does not exist" >&2
  exit 1
fi

for f in .env docker-compose.vps.yml deploy.sh nginx.proxy.conf; do
  if [ ! -s "${TARGET_DIR}/${f}" ]; then
    echo "ERROR: Required file ${TARGET_DIR}/${f} is missing or empty" >&2
    exit 1
  fi
done

echo "=== 4. Validating Current Compose Project Name ==="
COMPOSE_PROJECT="$(sed -n 's/^[[:space:]]*COMPOSE_PROJECT_NAME=\(.*\)/\1/p' "${TARGET_DIR}/.env" | tail -n 1)"
if [ "${COMPOSE_PROJECT}" != "${EXPECTED_PROJECT}" ]; then
  echo "ERROR: COMPOSE_PROJECT_NAME in ${TARGET_DIR}/.env must be '${EXPECTED_PROJECT}', got: '${COMPOSE_PROJECT}'" >&2
  exit 1
fi

echo "=== 5. Checking Current Container Health ==="
for c in azursystech-postgres azursystech-app azursystech-web; do
  if ! docker inspect "${c}" >/dev/null 2>&1; then
    echo "ERROR: Mandatory container ${c} does not exist" >&2
    exit 1
  fi

  st="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}unhealthy{{end}}' "${c}" 2>/dev/null || echo "unhealthy")"
  if [ "${st}" != "healthy" ]; then
    echo "ERROR: Container ${c} health status is not healthy (got: ${st})" >&2
    exit 1
  fi
done

echo "=== 6. Validating Current PostgreSQL Volume Contract ==="
if ! docker volume inspect "${EXPECTED_VOLUME}" >/dev/null 2>&1; then
  echo "ERROR: External volume ${EXPECTED_VOLUME} does not exist" >&2
  exit 1
fi

PG_MOUNT_TYPE="$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/var/lib/postgresql/data"}}{{.Type}}{{end}}{{end}}' azursystech-postgres)"
PG_MOUNT_NAME="$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/var/lib/postgresql/data"}}{{.Name}}{{end}}{{end}}' azursystech-postgres)"

if [ "${PG_MOUNT_TYPE}" != "volume" ] || [ "${PG_MOUNT_NAME}" != "${EXPECTED_VOLUME}" ]; then
  echo "ERROR: Invalid PostgreSQL mount! Type: '${PG_MOUNT_TYPE}', Name: '${PG_MOUNT_NAME}'" >&2
  exit 1
fi

echo "=== 7. Querying Current Database State ==="
if ! docker exec azursystech-postgres sh -c 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"' >/dev/null; then
  echo "ERROR: pg_isready failed on current PostgreSQL container" >&2
  exit 1
fi

CURRENT_TABLE_COUNT="$(docker exec azursystech-postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT count(*) FROM pg_tables WHERE schemaname NOT IN ('\''pg_catalog'\'', '\''information_schema'\'');"')"
CURRENT_DB_SIZE_BYTES="$(docker exec azursystech-postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT pg_database_size(current_database());"')"

echo "=== 8. Validating Table Count Against 4A Baseline ==="
BASELINE_FILE="${BACKUP_DIR}/db-baseline.txt"
BACKUP_TABLE_COUNT="$(sed -n 's/^[[:space:]]*User Table Count:[[:space:]]*\([0-9]\{1,\}\).*/\1/p' "${BASELINE_FILE}" | tail -n 1)"

if [[ ! "${BACKUP_TABLE_COUNT}" =~ ^[0-9]+$ ]]; then
  echo "ERROR: Invalid or unparseable User Table Count in ${BASELINE_FILE}" >&2
  exit 1
fi

if [ "${CURRENT_TABLE_COUNT}" != "${BACKUP_TABLE_COUNT}" ]; then
  echo "ERROR: Database table count changed since backup! Current: ${CURRENT_TABLE_COUNT}, Backup: ${BACKUP_TABLE_COUNT}" >&2
  exit 1
fi

echo "=== 9. Validating Candidate Compose Syntax and Contract ==="
if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: python3 is required for structured Compose config validation" >&2
  exit 1
fi

if ! docker compose --env-file "${TARGET_DIR}/.env" -f "${CANDIDATE_COMPOSE}" config -q; then
  echo "ERROR: Candidate Compose file syntax validation failed" >&2
  exit 1
fi

CURRENT_PG_IMAGE="$(docker inspect --format '{{.Config.Image}}' azursystech-postgres)"

CANDIDATE_PG_IMAGE="$(
  docker compose --env-file "${TARGET_DIR}/.env" -f "${CANDIDATE_COMPOSE}" config --format json | python3 -c '
import sys, json

try:
    data = json.load(sys.stdin)
except Exception as e:
    sys.exit(1)

services = data.get("services", {})
if "postgres" not in services:
    sys.exit(1)

pg_service = services["postgres"]
pg_image = pg_service.get("image")
if not pg_image or not isinstance(pg_image, str):
    sys.exit(1)

volumes = data.get("volumes", {})
if "postgres_data" not in volumes:
    sys.exit(1)

vol_cfg = volumes["postgres_data"]
if vol_cfg.get("external") is not True or vol_cfg.get("name") != "azursystech-site_postgres_data":
    sys.exit(1)

pg_volumes = pg_service.get("volumes", [])
mount_valid = False
for v in pg_volumes:
    if isinstance(v, dict):
        if v.get("target") == "/var/lib/postgresql/data":
            if v.get("source") == "postgres_data":
                mount_valid = True
            else:
                sys.exit(1)
    elif isinstance(v, str):
        if v == "postgres_data:/var/lib/postgresql/data":
            mount_valid = True
        elif ":/var/lib/postgresql/data" in v:
            sys.exit(1)

if not mount_valid:
    sys.exit(1)

print(pg_image)
'
)"

if [ -z "${CANDIDATE_PG_IMAGE}" ]; then
  echo "ERROR: Failed to extract or validate PostgreSQL image/volume contract from Candidate Compose" >&2
  exit 1
fi

echo "=== 10. Validating Candidate PostgreSQL Image ==="
if [ "${CANDIDATE_PG_IMAGE}" != "${CURRENT_PG_IMAGE}" ]; then
  echo "ERROR: PostgreSQL image mismatch! Current: '${CURRENT_PG_IMAGE}', Candidate: '${CANDIDATE_PG_IMAGE}'" >&2
  exit 1
fi

echo "=== 11. Auditing Current Compose Project Labels ==="
PG_PROJ="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project"}}' azursystech-postgres)"
APP_PROJ="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project"}}' azursystech-app)"
WEB_PROJ="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project"}}' azursystech-web)"

if [ "${PG_PROJ}" != "${EXPECTED_PROJECT}" ] || [ "${APP_PROJ}" != "${EXPECTED_PROJECT}" ] || [ "${WEB_PROJ}" != "${EXPECTED_PROJECT}" ]; then
  echo "ERROR: Compose project label mismatch! Expected '${EXPECTED_PROJECT}' for all services" >&2
  exit 1
fi

PG_WORKDIR="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' azursystech-postgres)"
APP_WORKDIR="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' azursystech-app)"
WEB_WORKDIR="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' azursystech-web)"

PG_CONFFILE="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.config_files"}}' azursystech-postgres)"
APP_CONFFILE="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.config_files"}}' azursystech-app)"
WEB_CONFFILE="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.config_files"}}' azursystech-web)"

if [ "${APP_WORKDIR}" != "${TARGET_DIR}" ] || [ "${WEB_WORKDIR}" != "${TARGET_DIR}" ]; then
  echo "ERROR: Unexpected app/web working_dir! app: '${APP_WORKDIR}', web: '${WEB_WORKDIR}'" >&2
  exit 1
fi

if [ "${PG_WORKDIR}" != "${SOURCE_PROJECTS_DIR}" ]; then
  echo "ERROR: Unexpected postgres working_dir! Expected '${SOURCE_PROJECTS_DIR}', got: '${PG_WORKDIR}'" >&2
  exit 1
fi

if [ "${APP_CONFFILE}" != "${TARGET_DIR}/docker-compose.vps.yml" ] || [ "${WEB_CONFFILE}" != "${TARGET_DIR}/docker-compose.vps.yml" ]; then
  echo "ERROR: Unexpected app/web config_files! app: '${APP_CONFFILE}', web: '${WEB_CONFFILE}'" >&2
  exit 1
fi

if [ "${PG_CONFFILE}" != "${SOURCE_PROJECTS_DIR}/docker-compose.vps.yml" ]; then
  echo "ERROR: Unexpected postgres config_files! Expected '${SOURCE_PROJECTS_DIR}/docker-compose.vps.yml', got: '${PG_CONFFILE}'" >&2
  exit 1
fi

if [ "${EXECUTE_CUTOVER}" -eq 1 ]; then
  echo "=== 12. Validating Cutover Preparation Artifacts ==="
  if [ ! -s "${BACKUP_DIR}/candidate-compose.sha256" ] || [ ! -s "${BACKUP_DIR}/cutover-baseline.txt" ] || [ ! -s "${BACKUP_DIR}/azursystech_pg_dump_cutover.sql.gz" ]; then
    echo "ERROR: Missing required preparation artifacts in ${BACKUP_DIR} for --execute-cutover" >&2
    exit 1
  fi

  if ! command -v sha256sum >/dev/null 2>&1; then
    echo "ERROR: sha256sum is required for cutover execution" >&2
    exit 1
  fi

  EXPECTED_SHA256="$(awk '{print $1}' "${BACKUP_DIR}/candidate-compose.sha256")"
  ACTUAL_SHA256="$(sha256sum "${CANDIDATE_COMPOSE}" | awk '{print $1}')"

  if [ -z "${EXPECTED_SHA256}" ] || [ "${ACTUAL_SHA256}" != "${EXPECTED_SHA256}" ]; then
    echo "ERROR: Candidate Compose SHA256 mismatch! Expected: '${EXPECTED_SHA256}', Actual: '${ACTUAL_SHA256}'" >&2
    exit 1
  fi

  APP_WAS_RUNNING="$(docker inspect --format '{{.State.Running}}' azursystech-app 2>/dev/null || echo "false")"
  WEB_WAS_RUNNING="$(docker inspect --format '{{.State.Running}}' azursystech-web 2>/dev/null || echo "false")"
  ADMIN_WAS_RUNNING="false"
  if docker inspect azursystech-admin >/dev/null 2>&1; then
    ADMIN_WAS_RUNNING="$(docker inspect --format '{{.State.Running}}' azursystech-admin 2>/dev/null || echo "false")"
  fi

  CANONICAL_COMPOSE="${TARGET_DIR}/docker-compose.vps.yml"
  BEFORE_COMPOSE_BACKUP="${BACKUP_DIR}/cutover-runtime-compose-before.yml"
  if [ -e "${BEFORE_COMPOSE_BACKUP}" ]; then
    echo "ERROR: Pre-cutover compose backup ${BEFORE_COMPOSE_BACKUP} already exists" >&2
    exit 1
  fi

  cp -p "${CANONICAL_COMPOSE}" "${BEFORE_COMPOSE_BACKUP}"
  chmod 600 "${BEFORE_COMPOSE_BACKUP}"

  CUTOVER_STARTED=1
  CUTOVER_SUCCESS=0

  cutover_rollback_trap() {
    ORIGINAL_ERR_CODE="$?"
    trap - EXIT INT TERM
    set +e

    if [ "${CUTOVER_STARTED:-0}" -eq 1 ] && [ "${CUTOVER_SUCCESS:-0}" -eq 0 ]; then
      echo "CRITICAL: Cutover failed after starting! Executing rollback..." >&2

      cp "${BEFORE_COMPOSE_BACKUP}" "${CANONICAL_COMPOSE}" || true
      chmod 644 "${CANONICAL_COMPOSE}" || true

      ROLLBACK_CONTAINER_ERR=0
      docker compose --env-file "${TARGET_DIR}/.env" -f "${SOURCE_PROJECTS_DIR}/docker-compose.vps.yml" up -d --no-deps --force-recreate --pull never postgres || ROLLBACK_CONTAINER_ERR=1

      PG_HEALTH_OK=0
      for attempt in $(seq 1 24); do
        st="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}unhealthy{{end}}' azursystech-postgres 2>/dev/null || echo "unhealthy")"
        if [ "${st}" = "healthy" ]; then
          PG_HEALTH_OK=1
          break
        fi
        sleep 5
      done

      if [ "${PG_HEALTH_OK}" -eq 1 ] && docker exec azursystech-postgres sh -c 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"' >/dev/null 2>&1; then
        echo "PostgreSQL rollback container is healthy and ready." >&2
      else
        echo "CRITICAL: PostgreSQL rollback container health/ready check failed!" >&2
        ROLLBACK_CONTAINER_ERR=1
      fi

      if [ "${APP_WAS_RUNNING}" = "true" ]; then
        docker start azursystech-app || ROLLBACK_CONTAINER_ERR=1
      fi
      if [ "${WEB_WAS_RUNNING}" = "true" ]; then
        docker start azursystech-web || ROLLBACK_CONTAINER_ERR=1
      fi
      if [ "${ADMIN_WAS_RUNNING}" = "true" ]; then
        docker start azursystech-admin || ROLLBACK_CONTAINER_ERR=1
      fi

      if [ "${APP_WAS_RUNNING}" = "true" ]; then
        st="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}unhealthy{{end}}' azursystech-app 2>/dev/null || echo "unhealthy")"
        if [ "${st}" != "healthy" ]; then
          ROLLBACK_CONTAINER_ERR=1
        fi
      fi
      if [ "${WEB_WAS_RUNNING}" = "true" ]; then
        st="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}unhealthy{{end}}' azursystech-web 2>/dev/null || echo "unhealthy")"
        if [ "${st}" != "healthy" ]; then
          ROLLBACK_CONTAINER_ERR=1
        fi
      fi

      if ! curl -fsS "https://azursystech.fr/health" >/dev/null 2>&1; then
        echo "CRITICAL: Rollback external endpoint health check failed!" >&2
        ROLLBACK_CONTAINER_ERR=1
      fi

      if [ "${ROLLBACK_CONTAINER_ERR}" -ne 0 ]; then
        echo "CRITICAL: Rollback execution or health check FAILED!" >&2
        exit 2
      fi

      echo "Rollback completed successfully. Original runtime environment restored." >&2
    fi

    exit "${ORIGINAL_ERR_CODE}"
  }

  trap cutover_rollback_trap EXIT INT TERM

  echo "=== 13. Stopping Writers ==="
  docker stop azursystech-app
  if [ "${ADMIN_WAS_RUNNING}" = "true" ]; then
    docker stop azursystech-admin
  fi
  if [ "${WEB_WAS_RUNNING}" = "true" ]; then
    docker stop azursystech-web
  fi

  for c in azursystech-app azursystech-web azursystech-admin; do
    if docker inspect "$c" >/dev/null 2>&1; then
      run_st="$(docker inspect --format '{{.State.Running}}' "$c" 2>/dev/null || echo "false")"
      if [ "${run_st}" != "false" ]; then
        echo "ERROR: Container $c is still running after stop!" >&2
        exit 1
      fi
    fi
  done

  st="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}unhealthy{{end}}' azursystech-postgres 2>/dev/null || echo "unhealthy")"
  if [ "${st}" != "healthy" ]; then
    echo "ERROR: PostgreSQL container lost health after stopping writers!" >&2
    exit 1
  fi

  if ! docker exec azursystech-postgres sh -c 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"' >/dev/null; then
    echo "ERROR: pg_isready failed after stopping writers!" >&2
    exit 1
  fi

  echo "=== 14. Creating Final PostgreSQL Safety Dump ==="
  FINAL_DUMP_FILE="${BACKUP_DIR}/azursystech_pg_dump_final.sql.gz"
  if [ -e "${FINAL_DUMP_FILE}" ]; then
    echo "ERROR: Final dump file ${FINAL_DUMP_FILE} already exists" >&2
    exit 1
  fi

  docker exec azursystech-postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > "${FINAL_DUMP_FILE}"

  test -s "${FINAL_DUMP_FILE}"
  gzip -t "${FINAL_DUMP_FILE}"

  if ! gzip -cd "${FINAL_DUMP_FILE}" | awk '
    NR <= 30 && tolower($0) ~ /postgresql database dump/ {
      found=1
    }
    END {
      exit(found ? 0 : 1)
    }
  '; then
    echo "ERROR: Final PostgreSQL dump header validation failed" >&2
    exit 1
  fi

  FINAL_TABLE_COUNT="$(docker exec azursystech-postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT count(*) FROM pg_tables WHERE schemaname NOT IN ('\''pg_catalog'\'', '\''information_schema'\'');"')"
  FINAL_DB_SIZE_BYTES="$(docker exec azursystech-postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT pg_database_size(current_database());"')"

  if [[ ! "${FINAL_TABLE_COUNT}" =~ ^[0-9]+$ ]] || [[ ! "${FINAL_DB_SIZE_BYTES}" =~ ^[0-9]+$ ]]; then
    echo "ERROR: Invalid numeric baseline returned from PostgreSQL after final dump" >&2
    exit 1
  fi

  TIMESTAMP_UTC="$(date -u +%Y%m%dT%H%M%SZ)"
  {
    echo "Timestamp UTC: ${TIMESTAMP_UTC}"
    echo "Final User Table Count: ${FINAL_TABLE_COUNT}"
    echo "Final Database Size Bytes: ${FINAL_DB_SIZE_BYTES}"
    echo "PostgreSQL Image: ${CURRENT_PG_IMAGE}"
    echo "PostgreSQL Volume: ${EXPECTED_VOLUME}"
    echo "Candidate Compose SHA256: ${ACTUAL_SHA256}"
  } > "${BACKUP_DIR}/final-cutover-baseline.txt"
  chmod 600 "${BACKUP_DIR}/final-cutover-baseline.txt"

  echo "=== 15. Installing Candidate Compose as Canonical ==="
  TEMP_COMPOSE_TARGET="${TARGET_DIR}/docker-compose.vps.yml.tmp-cutover"
  cp -p "${CANDIDATE_COMPOSE}" "${TEMP_COMPOSE_TARGET}"
  chmod 644 "${TEMP_COMPOSE_TARGET}"

  TEMP_SHA256="$(sha256sum "${TEMP_COMPOSE_TARGET}" | awk '{print $1}')"
  if [ "${TEMP_SHA256}" != "${ACTUAL_SHA256}" ]; then
    echo "ERROR: Temporary canonical compose SHA256 mismatch!" >&2
    rm -f "${TEMP_COMPOSE_TARGET}"
    exit 1
  fi

  mv "${TEMP_COMPOSE_TARGET}" "${CANONICAL_COMPOSE}"

  echo "=== 16. Recreating PostgreSQL Service under Canonical Runtime ==="
  cd "${TARGET_DIR}"
  docker compose --env-file "${TARGET_DIR}/.env" -f "${CANONICAL_COMPOSE}" up -d --no-deps --force-recreate --pull never postgres

  PG_RECREATED_HEALTHY=0
  for attempt in $(seq 1 24); do
    st="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}unhealthy{{end}}' azursystech-postgres 2>/dev/null || echo "unhealthy")"
    if [ "${st}" = "healthy" ]; then
      PG_RECREATED_HEALTHY=1
      break
    fi
    sleep 5
  done

  if [ "${PG_RECREATED_HEALTHY}" -ne 1 ]; then
    echo "ERROR: Recreated PostgreSQL container failed healthcheck!" >&2
    exit 1
  fi

  if ! docker exec azursystech-postgres sh -c 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"' >/dev/null; then
    echo "ERROR: pg_isready failed on recreated PostgreSQL container!" >&2
    exit 1
  fi

  PG_MOUNT_TYPE="$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/var/lib/postgresql/data"}}{{.Type}}{{end}}{{end}}' azursystech-postgres)"
  PG_MOUNT_NAME="$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/var/lib/postgresql/data"}}{{.Name}}{{end}}{{end}}' azursystech-postgres)"

  if [ "${PG_MOUNT_TYPE}" != "volume" ] || [ "${PG_MOUNT_NAME}" != "${EXPECTED_VOLUME}" ]; then
    echo "ERROR: Recreated PostgreSQL volume contract mismatch! Type: '${PG_MOUNT_TYPE}', Name: '${PG_MOUNT_NAME}'" >&2
    exit 1
  fi

  POST_TABLE_COUNT="$(docker exec azursystech-postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT count(*) FROM pg_tables WHERE schemaname NOT IN ('\''pg_catalog'\'', '\''information_schema'\'');"')"
  POST_DB_SIZE_BYTES="$(docker exec azursystech-postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT pg_database_size(current_database());"')"

  if [ "${POST_TABLE_COUNT}" != "${FINAL_TABLE_COUNT}" ]; then
    echo "ERROR: Table count mismatch after PostgreSQL recreate! Final: ${FINAL_TABLE_COUNT}, Post: ${POST_TABLE_COUNT}" >&2
    exit 1
  fi

  NEW_PG_PROJ="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project"}}' azursystech-postgres)"
  NEW_PG_WORKDIR="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' azursystech-postgres)"
  NEW_PG_CONFFILE="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.config_files"}}' azursystech-postgres)"

  if [ "${NEW_PG_PROJ}" != "${EXPECTED_PROJECT}" ] || [ "${NEW_PG_WORKDIR}" != "${TARGET_DIR}" ] || [ "${NEW_PG_CONFFILE}" != "${CANONICAL_COMPOSE}" ]; then
    echo "ERROR: Canonical Compose labels mismatch on recreated PostgreSQL!" >&2
    exit 1
  fi

  echo "=== 17. Restoring Previous Container States ==="
  if [ "${APP_WAS_RUNNING}" = "true" ]; then
    docker start azursystech-app
  fi
  if [ "${WEB_WAS_RUNNING}" = "true" ]; then
    docker start azursystech-web
  fi
  if [ "${ADMIN_WAS_RUNNING}" = "true" ]; then
    docker start azursystech-admin
  fi

  if [ "${APP_WAS_RUNNING}" = "true" ]; then
    st="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}unhealthy{{end}}' azursystech-app 2>/dev/null || echo "unhealthy")"
    if [ "${st}" != "healthy" ]; then
      echo "ERROR: azursystech-app is not healthy after start!" >&2
      exit 1
    fi
  fi

  if [ "${WEB_WAS_RUNNING}" = "true" ]; then
    st="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}unhealthy{{end}}' azursystech-web 2>/dev/null || echo "unhealthy")"
    if [ "${st}" != "healthy" ]; then
      echo "ERROR: azursystech-web is not healthy after start!" >&2
      exit 1
    fi
  fi

  if [ "${ADMIN_WAS_RUNNING}" = "true" ]; then
    st="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}unhealthy{{end}}' azursystech-admin 2>/dev/null || echo "unhealthy")"
    if [ "${st}" != "healthy" ]; then
      echo "ERROR: azursystech-admin is not healthy after start!" >&2
      exit 1
    fi
  fi

  curl -fsS "https://azursystech.fr/health" >/dev/null

  FINAL_APP_WORKDIR="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' azursystech-app)"
  FINAL_APP_CONFFILE="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.config_files"}}' azursystech-app)"
  FINAL_WEB_WORKDIR="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' azursystech-web)"
  FINAL_WEB_CONFFILE="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.config_files"}}' azursystech-web)"

  if [ "${FINAL_APP_WORKDIR}" != "${TARGET_DIR}" ] || [ "${FINAL_APP_CONFFILE}" != "${CANONICAL_COMPOSE}" ] || [ "${FINAL_WEB_WORKDIR}" != "${TARGET_DIR}" ] || [ "${FINAL_WEB_CONFFILE}" != "${CANONICAL_COMPOSE}" ]; then
    echo "ERROR: App or Web compose labels degraded after cutover!" >&2
    exit 1
  fi

  TIMESTAMP_UTC="$(date -u +%Y%m%dT%H%M%SZ)"
  {
    echo "Timestamp UTC: ${TIMESTAMP_UTC}"
    echo "Candidate SHA256: ${ACTUAL_SHA256}"
    echo "PostgreSQL Image: ${CURRENT_PG_IMAGE}"
    echo "PostgreSQL Volume: ${EXPECTED_VOLUME}"
    echo "Final Table Count: ${FINAL_TABLE_COUNT}"
    echo "Post-Cutover Table Count: ${POST_TABLE_COUNT}"
    echo "PostgreSQL WorkingDir: ${NEW_PG_WORKDIR}"
    echo "PostgreSQL ConfigFiles: ${NEW_PG_CONFFILE}"
  } > "${BACKUP_DIR}/cutover-success.txt"
  chmod 600 "${BACKUP_DIR}/cutover-success.txt"

  CUTOVER_SUCCESS=1
  trap - EXIT INT TERM

  echo "Cutover execution PASSED"
  echo "PostgreSQL service successfully consolidated under ${TARGET_DIR}"
  echo "Canonical compose updated: ${CANONICAL_COMPOSE}"
  echo "PostgreSQL volume: ${EXPECTED_VOLUME}"
  echo "PostgreSQL image: ${CURRENT_PG_IMAGE}"
  echo "Table count verified: ${POST_TABLE_COUNT}"
  echo "PostgreSQL working_dir: ${NEW_PG_WORKDIR}"
  echo "PostgreSQL config_files: ${NEW_PG_CONFFILE}"
  echo "External endpoint healthcheck: PASSED"
elif [ "${PREPARE_CUTOVER}" -eq 1 ]; then
  echo "=== 12. Preparing Cutover Checkpoint ==="
  if ! command -v sha256sum >/dev/null 2>&1; then
    echo "ERROR: sha256sum is required for cutover preparation" >&2
    exit 1
  fi

  CANDIDATE_SHA256="$(sha256sum "${CANDIDATE_COMPOSE}" | awk '{print $1}')"
  if [[ ! "${CANDIDATE_SHA256}" =~ ^[0-9a-f]{64}$ ]]; then
    echo "ERROR: Invalid Candidate Compose SHA256 format" >&2
    exit 1
  fi

  CUTOVER_DUMP_FILE="${BACKUP_DIR}/azursystech_pg_dump_cutover.sql.gz"
  if [ -e "${CUTOVER_DUMP_FILE}" ]; then
    echo "ERROR: Cutover dump file ${CUTOVER_DUMP_FILE} already exists" >&2
    exit 1
  fi

  docker exec azursystech-postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > "${CUTOVER_DUMP_FILE}"

  test -s "${CUTOVER_DUMP_FILE}"
  gzip -t "${CUTOVER_DUMP_FILE}"

  if ! gzip -cd "${CUTOVER_DUMP_FILE}" | awk '
    NR <= 30 && tolower($0) ~ /postgresql database dump/ {
      found=1
    }
    END {
      exit(found ? 0 : 1)
    }
  '; then
    echo "ERROR: Cutover PostgreSQL dump header validation failed" >&2
    exit 1
  fi

  CUTOVER_TABLE_COUNT="$(docker exec azursystech-postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT count(*) FROM pg_tables WHERE schemaname NOT IN ('\''pg_catalog'\'', '\''information_schema'\'');"')"
  CUTOVER_DB_SIZE_BYTES="$(docker exec azursystech-postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT pg_database_size(current_database());"')"

  if [[ ! "${CUTOVER_TABLE_COUNT}" =~ ^[0-9]+$ ]] || [[ ! "${CUTOVER_DB_SIZE_BYTES}" =~ ^[0-9]+$ ]]; then
    echo "ERROR: Invalid numeric baseline returned from PostgreSQL during cutover preparation" >&2
    exit 1
  fi

  if [ "${CUTOVER_TABLE_COUNT}" != "${CURRENT_TABLE_COUNT}" ]; then
    echo "ERROR: Table count changed during cutover dump creation! Initial: ${CURRENT_TABLE_COUNT}, Cutover: ${CUTOVER_TABLE_COUNT}" >&2
    exit 1
  fi

  printf '%s  %s\n' "${CANDIDATE_SHA256}" "${CANDIDATE_COMPOSE}" > "${BACKUP_DIR}/candidate-compose.sha256.tmp"
  chmod 600 "${BACKUP_DIR}/candidate-compose.sha256.tmp"
  mv "${BACKUP_DIR}/candidate-compose.sha256.tmp" "${BACKUP_DIR}/candidate-compose.sha256"

  TIMESTAMP_UTC="$(date -u +%Y%m%dT%H%M%SZ)"
  {
    echo "Timestamp UTC: ${TIMESTAMP_UTC}"
    echo "User Table Count: ${CUTOVER_TABLE_COUNT}"
    echo "Database Size Bytes: ${CUTOVER_DB_SIZE_BYTES}"
    echo "PostgreSQL Image: ${CURRENT_PG_IMAGE}"
    echo "PostgreSQL Volume: ${EXPECTED_VOLUME}"
    echo "Candidate Compose SHA256: ${CANDIDATE_SHA256}"
  } > "${BACKUP_DIR}/cutover-baseline.txt.tmp"
  chmod 600 "${BACKUP_DIR}/cutover-baseline.txt.tmp"
  mv "${BACKUP_DIR}/cutover-baseline.txt.tmp" "${BACKUP_DIR}/cutover-baseline.txt"

  echo "Cutover preparation PASSED"
  echo "Fresh PostgreSQL safety dump validated."
  echo "Candidate Compose SHA256: ${CANDIDATE_SHA256}"
  echo "Cutover table count: ${CUTOVER_TABLE_COUNT}"
  echo "Cutover DB size bytes: ${CUTOVER_DB_SIZE_BYTES}"
  echo "Backup directory: ${BACKUP_DIR}"
  echo "NO CONTAINERS WERE STOPPED OR RECREATED."
else
  echo "Migration preflight PASSED"
  echo "Backup: ${BACKUP_DIR}"
  echo "Candidate compose: ${CANDIDATE_COMPOSE}"
  echo "Compose project: ${EXPECTED_PROJECT}"
  echo "PostgreSQL volume: ${EXPECTED_VOLUME}"
  echo "Current table count: ${CURRENT_TABLE_COUNT}"
  echo "Backup table count: ${BACKUP_TABLE_COUNT}"
  echo "Current DB size bytes: ${CURRENT_DB_SIZE_BYTES}"
  echo "PostgreSQL image: ${CURRENT_PG_IMAGE}"
  echo "Current postgres working_dir: ${PG_WORKDIR}"
  echo "Target candidate runtime: ${TARGET_DIR}"
  echo "No runtime changes were performed."
fi
