#!/usr/bin/env bash
set -euo pipefail
umask 077

TARGET_DIR="/home/dmitrii/apps/azursystech"
SOURCE_PROJECTS_DIR="/home/dmitrii/projects/azursystech-site"
EXPECTED_PROJECT="azursystech-site"
EXPECTED_VOLUME="azursystech-site_postgres_data"
EXPECTED_PG_IMAGE="postgres:16-alpine"
EXPECTED_PG_DEST="/var/lib/postgresql/data"
CANONICAL_COMPOSE="${TARGET_DIR}/docker-compose.vps.yml"

if [ "$#" -ne 1 ]; then
  echo "ERROR: Expected exactly 1 argument: <BACKUP_DIR>" >&2
  exit 2
fi

RAW_BACKUP_DIR="$1"
if [[ "${RAW_BACKUP_DIR}" != /home/dmitrii/backups/consolidation-* ]]; then
  echo "ERROR: BACKUP_DIR must start with /home/dmitrii/backups/consolidation-" >&2
  exit 2
fi

if [ ! -d "${RAW_BACKUP_DIR}" ]; then
  echo "ERROR: BACKUP_DIR does not exist or is not a directory" >&2
  exit 2
fi

BACKUP_DIR="$(realpath "${RAW_BACKUP_DIR}")"
if [[ "${BACKUP_DIR}" != /home/dmitrii/backups/consolidation-* ]]; then
  echo "ERROR: Resolved BACKUP_DIR must remain under /home/dmitrii/backups/consolidation-*" >&2
  exit 2
fi

FINAL_BASELINE="${BACKUP_DIR}/final-cutover-baseline.txt"
SUCCESS_MARKER="${BACKUP_DIR}/cutover-success.txt"
CANDIDATE_SHA_FILE="${BACKUP_DIR}/candidate-compose.sha256"

for f in \
  "${FINAL_BASELINE}" \
  "${SUCCESS_MARKER}" \
  "${CANDIDATE_SHA_FILE}" \
  "${BACKUP_DIR}/.env.apps" \
  "${BACKUP_DIR}/deploy.sh.apps" \
  "${BACKUP_DIR}/nginx.proxy.conf.apps" \
  "${BACKUP_DIR}/.env.projects" \
  "${BACKUP_DIR}/docker-compose.vps.yml.projects"; do
  if [ ! -s "${f}" ]; then
    echo "ERROR: Required verification artifact is missing or empty: ${f}" >&2
    exit 1
  fi
done

for f in .env docker-compose.vps.yml deploy.sh nginx.proxy.conf; do
  if [ ! -s "${TARGET_DIR}/${f}" ]; then
    echo "ERROR: Required canonical runtime file is missing or empty: ${TARGET_DIR}/${f}" >&2
    exit 1
  fi
done

if [ ! -d "${SOURCE_PROJECTS_DIR}" ]; then
  echo "ERROR: Legacy source directory no longer exists: ${SOURCE_PROJECTS_DIR}" >&2
  exit 1
fi

for f in .env docker-compose.vps.yml; do
  if [ ! -s "${SOURCE_PROJECTS_DIR}/${f}" ]; then
    echo "ERROR: Legacy source runtime file is missing or empty: ${SOURCE_PROJECTS_DIR}/${f}" >&2
    exit 1
  fi
done

echo "=== 1. Verifying runtime files were preserved ==="
if ! cmp -s "${TARGET_DIR}/.env" "${BACKUP_DIR}/.env.apps"; then
  echo "ERROR: Canonical .env changed since 4A backup" >&2
  exit 1
fi
if ! cmp -s "${TARGET_DIR}/deploy.sh" "${BACKUP_DIR}/deploy.sh.apps"; then
  echo "ERROR: Canonical deploy.sh changed since 4A backup" >&2
  exit 1
fi
if ! cmp -s "${TARGET_DIR}/nginx.proxy.conf" "${BACKUP_DIR}/nginx.proxy.conf.apps"; then
  echo "ERROR: Canonical nginx.proxy.conf changed since 4A backup" >&2
  exit 1
fi
if ! cmp -s "${SOURCE_PROJECTS_DIR}/.env" "${BACKUP_DIR}/.env.projects"; then
  echo "ERROR: Legacy source .env changed since 4A backup" >&2
  exit 1
fi
if ! cmp -s "${SOURCE_PROJECTS_DIR}/docker-compose.vps.yml" "${BACKUP_DIR}/docker-compose.vps.yml.projects"; then
  echo "ERROR: Legacy source docker-compose.vps.yml changed since 4A backup" >&2
  exit 1
fi

if ! command -v sha256sum >/dev/null 2>&1; then
  echo "ERROR: sha256sum is required" >&2
  exit 1
fi

EXPECTED_SHA256="$(awk '{print $1}' "${CANDIDATE_SHA_FILE}")"
CANONICAL_SHA256="$(sha256sum "${CANONICAL_COMPOSE}" | awk '{print $1}')"
SUCCESS_SHA256="$(sed -n 's/^Candidate SHA256:[[:space:]]*\([0-9a-f]\{64\}\)[[:space:]]*$/\1/p' "${SUCCESS_MARKER}" | tail -n 1)"

if [[ ! "${EXPECTED_SHA256}" =~ ^[0-9a-f]{64}$ ]]; then
  echo "ERROR: Invalid Candidate SHA256 in ${CANDIDATE_SHA_FILE}" >&2
  exit 1
fi
if [ "${CANONICAL_SHA256}" != "${EXPECTED_SHA256}" ]; then
  echo "ERROR: Canonical Compose SHA256 does not match prepared candidate" >&2
  exit 1
fi
if [ "${SUCCESS_SHA256}" != "${EXPECTED_SHA256}" ]; then
  echo "ERROR: Cutover success marker SHA256 does not match prepared candidate" >&2
  exit 1
fi

echo "=== 2. Verifying mandatory containers ==="
for c in azursystech-postgres azursystech-app azursystech-web; do
  if ! docker inspect "${c}" >/dev/null 2>&1; then
    echo "ERROR: Mandatory container does not exist: ${c}" >&2
    exit 1
  fi

  running="$(docker inspect --format '{{.State.Running}}' "${c}" 2>/dev/null || echo "false")"
  health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "${c}" 2>/dev/null || echo "none")"

  if [ "${running}" != "true" ]; then
    echo "ERROR: Mandatory container is not running: ${c}" >&2
    exit 1
  fi
  if [ "${health}" != "healthy" ]; then
    echo "ERROR: Mandatory container is not healthy: ${c} (health=${health})" >&2
    exit 1
  fi
done

echo "=== 3. Verifying PostgreSQL image, readiness, and volume ==="
PG_IMAGE="$(docker inspect --format '{{.Config.Image}}' azursystech-postgres)"
if [ "${PG_IMAGE}" != "${EXPECTED_PG_IMAGE}" ]; then
  echo "ERROR: Unexpected PostgreSQL image: ${PG_IMAGE}" >&2
  exit 1
fi

if ! docker exec azursystech-postgres sh -c 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"' >/dev/null; then
  echo "ERROR: pg_isready failed" >&2
  exit 1
fi

if ! docker volume inspect "${EXPECTED_VOLUME}" >/dev/null 2>&1; then
  echo "ERROR: PostgreSQL volume does not exist: ${EXPECTED_VOLUME}" >&2
  exit 1
fi

PG_MOUNT_TYPE="$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/var/lib/postgresql/data"}}{{.Type}}{{end}}{{end}}' azursystech-postgres)"
PG_MOUNT_NAME="$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/var/lib/postgresql/data"}}{{.Name}}{{end}}{{end}}' azursystech-postgres)"
PG_MOUNT_DEST="$(docker inspect --format '{{range .Mounts}}{{if eq .Name "azursystech-site_postgres_data"}}{{.Destination}}{{end}}{{end}}' azursystech-postgres)"

if [ "${PG_MOUNT_TYPE}" != "volume" ] || [ "${PG_MOUNT_NAME}" != "${EXPECTED_VOLUME}" ] || [ "${PG_MOUNT_DEST}" != "${EXPECTED_PG_DEST}" ]; then
  echo "ERROR: PostgreSQL volume contract mismatch" >&2
  echo "  type=${PG_MOUNT_TYPE}" >&2
  echo "  name=${PG_MOUNT_NAME}" >&2
  echo "  destination=${PG_MOUNT_DEST}" >&2
  exit 1
fi

echo "=== 4. Verifying canonical Compose labels ==="
for c in azursystech-postgres azursystech-app azursystech-web; do
  project="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project"}}' "${c}")"
  workdir="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' "${c}")"
  config_files="$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project.config_files"}}' "${c}")"

  if [ "${project}" != "${EXPECTED_PROJECT}" ]; then
    echo "ERROR: ${c} project label mismatch: ${project}" >&2
    exit 1
  fi
  if [ "${workdir}" != "${TARGET_DIR}" ]; then
    echo "ERROR: ${c} working_dir is not canonical: ${workdir}" >&2
    exit 1
  fi
  if [ "${config_files}" != "${CANONICAL_COMPOSE}" ]; then
    echo "ERROR: ${c} config_files is not canonical: ${config_files}" >&2
    exit 1
  fi
done

echo "=== 5. Verifying database baseline ==="
EXPECTED_TABLE_COUNT="$(sed -n 's/^Final User Table Count:[[:space:]]*\([0-9]\{1,\}\)[[:space:]]*$/\1/p' "${FINAL_BASELINE}" | tail -n 1)"
CURRENT_TABLE_COUNT="$(docker exec azursystech-postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT count(*) FROM pg_tables WHERE schemaname NOT IN ('\''pg_catalog'\'', '\''information_schema'\'');"')"
CURRENT_DB_SIZE_BYTES="$(docker exec azursystech-postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT pg_database_size(current_database());"')"

if [[ ! "${EXPECTED_TABLE_COUNT}" =~ ^[0-9]+$ ]]; then
  echo "ERROR: Invalid Final User Table Count in ${FINAL_BASELINE}" >&2
  exit 1
fi
if [[ ! "${CURRENT_TABLE_COUNT}" =~ ^[0-9]+$ ]]; then
  echo "ERROR: Current PostgreSQL table count is not numeric" >&2
  exit 1
fi
if [[ ! "${CURRENT_DB_SIZE_BYTES}" =~ ^[0-9]+$ ]]; then
  echo "ERROR: Current PostgreSQL database size is not numeric" >&2
  exit 1
fi
if [ "${CURRENT_TABLE_COUNT}" != "${EXPECTED_TABLE_COUNT}" ]; then
  echo "ERROR: PostgreSQL table count mismatch: expected=${EXPECTED_TABLE_COUNT}, current=${CURRENT_TABLE_COUNT}" >&2
  exit 1
fi

echo "=== 6. Verifying external health endpoint ==="
if ! curl -fsS "https://azursystech.fr/health" >/dev/null; then
  echo "ERROR: External health endpoint failed" >&2
  exit 1
fi

echo "=== VPS CONSOLIDATION VERIFICATION PASSED ==="
echo "Compose project: ${EXPECTED_PROJECT}"
echo "PostgreSQL image: ${PG_IMAGE}"
echo "PostgreSQL volume: ${PG_MOUNT_NAME}"
echo "PostgreSQL mount: ${PG_MOUNT_DEST}"
echo "PostgreSQL table count: ${CURRENT_TABLE_COUNT}"
echo "PostgreSQL DB size bytes: ${CURRENT_DB_SIZE_BYTES}"
echo "Canonical working_dir: ${TARGET_DIR}"
echo "Canonical config_files: ${CANONICAL_COMPOSE}"
echo "Legacy source directory preserved: ${SOURCE_PROJECTS_DIR}"
echo "External health endpoint: PASSED"
echo "NO RUNTIME MUTATIONS WERE PERFORMED."
