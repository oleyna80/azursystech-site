#!/usr/bin/env bash
set -euo pipefail
umask 077

TARGET_DIR="/home/dmitrii/apps/azursystech"
SOURCE_PROJECTS_DIR="/home/dmitrii/projects/azursystech-site"
BACKUP_BASE="/home/dmitrii/backups"

exec 200>/tmp/azursystech-deploy.lock
if ! flock -n 200; then
  echo "ERROR: deployment or migration is already running" >&2
  exit 1
fi

echo "=== 1. Checking Preconditions ==="
if [ ! -d "${TARGET_DIR}" ]; then
  echo "ERROR: Target directory ${TARGET_DIR} does not exist!" >&2
  exit 1
fi

if [ ! -d "${SOURCE_PROJECTS_DIR}" ]; then
  echo "ERROR: Source projects directory ${SOURCE_PROJECTS_DIR} does not exist!" >&2
  exit 1
fi

for f in .env docker-compose.vps.yml deploy.sh nginx.proxy.conf; do
  if [ ! -s "${TARGET_DIR}/${f}" ]; then
    echo "ERROR: File ${TARGET_DIR}/${f} is missing or empty!" >&2
    exit 1
  fi
done

for f in .env docker-compose.vps.yml; do
  if [ ! -s "${SOURCE_PROJECTS_DIR}/${f}" ]; then
    echo "ERROR: File ${SOURCE_PROJECTS_DIR}/${f} is missing or empty!" >&2
    exit 1
  fi
done

echo "=== 2. Checking Compose Project Name ==="
COMPOSE_PROJECT="$(sed -n 's/^[[:space:]]*COMPOSE_PROJECT_NAME=\(.*\)/\1/p' "${TARGET_DIR}/.env" | tail -n 1)"
if [ "${COMPOSE_PROJECT}" != "azursystech-site" ]; then
  echo "ERROR: COMPOSE_PROJECT_NAME in ${TARGET_DIR}/.env must be 'azursystech-site', got: '${COMPOSE_PROJECT}'" >&2
  exit 1
fi

echo "=== 3. Checking Container Health ==="
for container in azursystech-postgres azursystech-app azursystech-web; do
  if ! docker inspect "${container}" >/dev/null 2>&1; then
    echo "ERROR: Mandatory container ${container} does not exist!" >&2
    exit 1
  fi

  health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}unhealthy{{end}}' "${container}" 2>/dev/null || echo "unhealthy")"
  if [ "${health}" != "healthy" ]; then
    echo "ERROR: Container ${container} health is not healthy (got: ${health})!" >&2
    exit 1
  fi
done

ADMIN_EXISTS="false"
ADMIN_RUNNING="false"
ADMIN_HEALTH="none"
if docker inspect azursystech-admin >/dev/null 2>&1; then
  ADMIN_EXISTS="true"
  ADMIN_RUNNING="$(docker inspect --format '{{.State.Running}}' azursystech-admin 2>/dev/null || echo "false")"
  ADMIN_HEALTH="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' azursystech-admin 2>/dev/null || echo "none")"
fi

echo "=== 4. Checking PostgreSQL Volume and Mount ==="
if ! docker volume inspect azursystech-site_postgres_data >/dev/null 2>&1; then
  echo "ERROR: Volume azursystech-site_postgres_data does not exist!" >&2
  exit 1
fi

PG_MOUNT_TYPE="$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/var/lib/postgresql/data"}}{{.Type}}{{end}}{{end}}' azursystech-postgres)"
PG_MOUNT_NAME="$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/var/lib/postgresql/data"}}{{.Name}}{{end}}{{end}}' azursystech-postgres)"

if [ "${PG_MOUNT_TYPE}" != "volume" ] || [ "${PG_MOUNT_NAME}" != "azursystech-site_postgres_data" ]; then
  echo "ERROR: Invalid PostgreSQL mount! Type: '${PG_MOUNT_TYPE}', Name: '${PG_MOUNT_NAME}'" >&2
  exit 1
fi

echo "=== 5. Creating Backup Directory ==="
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_DIR="${BACKUP_BASE}/consolidation-${TIMESTAMP}"

if [ -e "${BACKUP_DIR}" ]; then
  echo "ERROR: Backup directory ${BACKUP_DIR} already exists!" >&2
  exit 1
fi

report_error_backup() {
  echo "ERROR: Preflight script failed." >&2
  if [ -n "${BACKUP_DIR:-}" ] && [ -d "${BACKUP_DIR}" ]; then
    echo "Backup directory preserved at: ${BACKUP_DIR}" >&2
  fi
}
trap report_error_backup ERR

mkdir -p "${BACKUP_DIR}"
chmod 700 "${BACKUP_DIR}"

echo "=== 6. Backing Up Runtime Files ==="
cp -p "${TARGET_DIR}/.env" "${BACKUP_DIR}/.env.apps"
cp -p "${TARGET_DIR}/docker-compose.vps.yml" "${BACKUP_DIR}/docker-compose.vps.yml.apps"
cp -p "${TARGET_DIR}/deploy.sh" "${BACKUP_DIR}/deploy.sh.apps"
cp -p "${TARGET_DIR}/nginx.proxy.conf" "${BACKUP_DIR}/nginx.proxy.conf.apps"
chmod 600 "${BACKUP_DIR}/.env.apps"

cp -p "${SOURCE_PROJECTS_DIR}/.env" "${BACKUP_DIR}/.env.projects"
cp -p "${SOURCE_PROJECTS_DIR}/docker-compose.vps.yml" "${BACKUP_DIR}/docker-compose.vps.yml.projects"
chmod 600 "${BACKUP_DIR}/.env.projects"

sed -n 's/^[[:space:]]*\([A-Za-z_][A-Za-z0-9_]*\)=.*/\1/p' "${TARGET_DIR}/.env" | sort -u > "${BACKUP_DIR}/env-keys-apps.txt"
sed -n 's/^[[:space:]]*\([A-Za-z_][A-Za-z0-9_]*\)=.*/\1/p' "${SOURCE_PROJECTS_DIR}/.env" | sort -u > "${BACKUP_DIR}/env-keys-projects.txt"

echo "=== 7. Generating Filtered Metadata Snapshot ==="
SNAPSHOT_FILE="${BACKUP_DIR}/docker-metadata-before.txt"
touch "${SNAPSHOT_FILE}"
chmod 600 "${SNAPSHOT_FILE}"

for c in azursystech-postgres azursystech-app azursystech-web; do
  {
    echo "=== Container: ${c} ==="
    docker inspect --format 'Image: {{.Config.Image}}' "${c}"
    docker inspect --format 'ImageID: {{.Image}}' "${c}"
    docker inspect --format 'HealthStatus: {{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "${c}"
    docker inspect --format 'Label Project: {{index .Config.Labels "com.docker.compose.project"}}' "${c}"
    docker inspect --format 'Label WorkingDir: {{index .Config.Labels "com.docker.compose.project.working_dir"}}' "${c}"
    docker inspect --format 'Label ConfigFiles: {{index .Config.Labels "com.docker.compose.project.config_files"}}' "${c}"
    echo "Mounts:"
    docker inspect --format '{{range .Mounts}}  - Type: {{.Type}} | Name: {{.Name}} | Source: {{.Source}} | Destination: {{.Destination}}{{"\n"}}{{end}}' "${c}"
    echo ""
  } >> "${SNAPSHOT_FILE}"
done

if [ "${ADMIN_EXISTS}" = "true" ]; then
  {
    echo "=== Container: azursystech-admin ==="
    docker inspect --format 'Image: {{.Config.Image}}' azursystech-admin
    docker inspect --format 'ImageID: {{.Image}}' azursystech-admin
    docker inspect --format 'Running: {{.State.Running}}' azursystech-admin
    docker inspect --format 'HealthStatus: {{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' azursystech-admin
    docker inspect --format 'Label Project: {{index .Config.Labels "com.docker.compose.project"}}' azursystech-admin
    docker inspect --format 'Label WorkingDir: {{index .Config.Labels "com.docker.compose.project.working_dir"}}' azursystech-admin
    docker inspect --format 'Label ConfigFiles: {{index .Config.Labels "com.docker.compose.project.config_files"}}' azursystech-admin
    echo "Mounts:"
    docker inspect --format '{{range .Mounts}}  - Type: {{.Type}} | Name: {{.Name}} | Source: {{.Source}} | Destination: {{.Destination}}{{"\n"}}{{end}}' azursystech-admin
    echo ""
  } >> "${SNAPSHOT_FILE}"
fi

echo "=== 8. Creating and Validating PostgreSQL Dump ==="
DUMP_FILE="${BACKUP_DIR}/azursystech_pg_dump.sql.gz"
docker exec azursystech-postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > "${DUMP_FILE}"

test -s "${DUMP_FILE}"
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

echo "=== 9. Collecting DB Baseline ==="
BASELINE_FILE="${BACKUP_DIR}/db-baseline.txt"
touch "${BASELINE_FILE}"
chmod 600 "${BASELINE_FILE}"

PG_READY="$(docker exec azursystech-postgres sh -c 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"' || echo "failed")"
PG_VERSION="$(docker exec azursystech-postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT version();"')"
PG_DBNAME="$(docker exec azursystech-postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT current_database();"')"
PG_DBSIZE="$(docker exec azursystech-postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT pg_size_pretty(pg_database_size(current_database()));"')"
PG_TABLE_COUNT="$(docker exec azursystech-postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT count(*) FROM pg_tables WHERE schemaname NOT IN ('\''pg_catalog'\'', '\''information_schema'\'');"')"

{
  echo "pg_isready: ${PG_READY}"
  echo "PostgreSQL Version: ${PG_VERSION}"
  echo "Database Name: ${PG_DBNAME}"
  echo "Database Size: ${PG_DBSIZE}"
  echo "User Table Count: ${PG_TABLE_COUNT}"
} > "${BASELINE_FILE}"

echo "=== 10. Generating Preflight Summary ==="
SUMMARY_FILE="${BACKUP_DIR}/preflight-summary.txt"

PG_WORKDIR="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' azursystech-postgres)"
PG_CONFFILE="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.config_files"}}' azursystech-postgres)"
APP_WORKDIR="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' azursystech-app)"
APP_CONFFILE="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.config_files"}}' azursystech-app)"
WEB_WORKDIR="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' azursystech-web)"
WEB_CONFFILE="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.config_files"}}' azursystech-web)"

{
  echo "Preflight Timestamp: ${TIMESTAMP}"
  echo "Backup Directory: ${BACKUP_DIR}"
  echo "Compose Project Name: ${COMPOSE_PROJECT}"
  echo "Health Statuses:"
  echo "  - azursystech-postgres: healthy"
  echo "  - azursystech-app: healthy"
  echo "  - azursystech-web: healthy"
  echo "  - azursystech-admin (exists: ${ADMIN_EXISTS}): running=${ADMIN_RUNNING}, health=${ADMIN_HEALTH}"
  echo "PostgreSQL Volume Name: ${PG_MOUNT_NAME}"
  echo "PostgreSQL Mount Destination: /var/lib/postgresql/data"
  echo "DB Size: ${PG_DBSIZE}"
  echo "User Table Count: ${PG_TABLE_COUNT}"
  echo "Labels Audit (Source / Target):"
  echo "  - postgres working_dir: ${PG_WORKDIR}"
  echo "  - postgres config_files: ${PG_CONFFILE}"
  echo "  - app working_dir: ${APP_WORKDIR}"
  echo "  - app config_files: ${APP_CONFFILE}"
  echo "  - web working_dir: ${WEB_WORKDIR}"
  echo "  - web config_files: ${WEB_CONFFILE}"
  echo "pg_dump validation: PASSED"
} > "${SUMMARY_FILE}"

chmod 600 "${SUMMARY_FILE}"

trap - ERR

echo "=== PREFLIGHT AUDIT AND BACKUP COMPLETED SUCCESSFULLY ==="
echo "Summary report available at: ${SUMMARY_FILE}"
