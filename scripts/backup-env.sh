#!/usr/bin/env bash
# Backs up runtime .env to a timestamped archive.
# Usage: ./scripts/backup-env.sh

set -euo pipefail

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
PROJECT_DIR="${PROJECT_DIR:-/home/dmitrii/projects/azursystech-site}"
BACKUP_DIR="${BACKUP_DIR:-/home/dmitrii/backups/azursystech}"
BACKUP_FILE="${BACKUP_DIR}/env-${TIMESTAMP}.tar.gz"

if [[ ! -f "${PROJECT_DIR}/.env" ]]; then
  echo "Error: ${PROJECT_DIR}/.env not found" >&2
  exit 1
fi

mkdir -p "${BACKUP_DIR}"
tar -czf "${BACKUP_FILE}" -C "${PROJECT_DIR}" .env

echo "Backup saved: ${BACKUP_FILE}"
ls -lh "${BACKUP_FILE}"
