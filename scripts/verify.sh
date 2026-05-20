#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-standard}"

run_shell_checks() {
  bash -n "${ROOT_DIR}/deploy.sh"
  while IFS= read -r script; do
    bash -n "${script}"
  done < <(find "${ROOT_DIR}/scripts" -maxdepth 1 -type f -name '*.sh' | sort)
}

run_project_check() {
  project="$1"
  (
    cd "${ROOT_DIR}/${project}"
    npm run check:ci
  )
}

run_compose_check() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "docker is not available; skipping compose render check." >&2
    return 0
  fi

  (
    cd "${ROOT_DIR}"
    POSTGRES_DB="${POSTGRES_DB:-azursystech}" \
      POSTGRES_USER="${POSTGRES_USER:-azursystech}" \
      POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-verify-only}" \
      APP_IMAGE="${APP_IMAGE:-ghcr.io/oleyna80/azursystech-app:verify}" \
      ADMIN_IMAGE="${ADMIN_IMAGE:-ghcr.io/oleyna80/azursystech-admin:verify}" \
      DEEPSEEK_API_KEY="${DEEPSEEK_API_KEY:-verify-only}" \
      AZURSYSTECH_CONTACT_SUBMIT_BASE_URL="${AZURSYSTECH_CONTACT_SUBMIT_BASE_URL:-https://azursystech.fr}" \
      AZURSYSTECH_CONTACT_SUBMIT_TOKEN="${AZURSYSTECH_CONTACT_SUBMIT_TOKEN:-verify-only}" \
      DATABASE_URL="${DATABASE_URL:-postgresql://azursystech:verify-only@postgres:5432/azursystech}" \
      ADMIN_SESSION_SECRET="${ADMIN_SESSION_SECRET:-verify-only}" \
      ADMIN_PASSWORD_HASH="${ADMIN_PASSWORD_HASH:-verify-only}" \
      docker compose -f docker-compose.vps.yml config >/tmp/azursystech-compose.verify.yml
  )
}

case "${MODE}" in
  lite)
    run_shell_checks
    ;;
  standard)
    run_shell_checks
    run_project_check web
    run_project_check admin
    ;;
  ops)
    run_shell_checks
    run_compose_check
    ;;
  full)
    run_shell_checks
    run_project_check web
    run_project_check admin
    run_compose_check
    ;;
  *)
    echo "Usage: $0 [lite|standard|ops|full]" >&2
    exit 2
    ;;
esac

echo "Verification passed: ${MODE}"
