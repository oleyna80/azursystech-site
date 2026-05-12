#!/usr/bin/env bash
# VPS deployment script for AzurSysTech admin registry-pull runtime.
# Usage:
#   ./deploy-admin.sh ghcr.io/oleyna80/azursystech-admin:sha-<commit>-<timestamp>
#   ADMIN_IMAGE=ghcr.io/oleyna80/azursystech-admin:sha-... ./deploy-admin.sh

set -euo pipefail

ADMIN_IMAGE="${1:-${ADMIN_IMAGE:-}}"
if [ -z "${ADMIN_IMAGE}" ] && [ -n "${IMAGE_REPO:-}" ] && [ -n "${IMAGE_TAG:-}" ]; then
  ADMIN_IMAGE="${IMAGE_REPO}:${IMAGE_TAG}"
fi

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.vps.yml}"
ENV_FILE="${ENV_FILE:-.env}"
HEALTH_URL="${ADMIN_HEALTH_URL:-https://admin.azursystech.fr/health}"
ROLLBACK_ON_FAILURE="${ROLLBACK_ON_FAILURE:-1}"
DEPLOY_STATE_DIR="${DEPLOY_STATE_DIR:-.deploy}"

if [ -z "${ADMIN_IMAGE}" ]; then
  echo "ADMIN_IMAGE is required (use an immutable registry image tag)" >&2
  exit 1
fi

case "${ADMIN_IMAGE}" in
  *:latest|latest)
    echo "latest is forbidden for deploy source; use an immutable tag" >&2
    exit 1
    ;;
esac

if [ ! -f "${ENV_FILE}" ]; then
  echo "${ENV_FILE} is missing; create it from .env.vps.example on the VPS" >&2
  exit 1
fi

set_env_value() {
  key="$1"
  value="$2"
  file="$3"
  tmp="${file}.tmp.$$"

  if grep -q "^${key}=" "${file}"; then
    sed "s|^${key}=.*|${key}=${value}|" "${file}" > "${tmp}"
    chmod --reference="${file}" "${tmp}" 2>/dev/null || chmod 600 "${tmp}"
    mv "${tmp}" "${file}"
  else
    printf '\n%s=%s\n' "${key}" "${value}" >> "${file}"
  fi
}

mkdir -p "${DEPLOY_STATE_DIR}"

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
previous_image="$(docker inspect -f '{{.Config.Image}}' azursystech-admin 2>/dev/null || true)"
if [ -n "${previous_image}" ]; then
  printf '%s\n' "${previous_image}" > "${DEPLOY_STATE_DIR}/previous-admin-image"
fi

cp "${ENV_FILE}" "${ENV_FILE}.admin-deploy-${timestamp}.bak"
set_env_value "ADMIN_IMAGE" "${ADMIN_IMAGE}" "${ENV_FILE}"

export ADMIN_IMAGE
export COMPOSE_PROFILES="${COMPOSE_PROFILES:-admin}"
echo "Deploying AzurSysTech admin image: ${ADMIN_IMAGE}"
docker compose -f "${COMPOSE_FILE}" config >/tmp/azursystech-admin-compose.rendered.yml
docker compose -f "${COMPOSE_FILE}" pull admin web
docker compose -f "${COMPOSE_FILE}" up -d --remove-orphans admin web

for attempt in $(seq 1 12); do
  if docker exec azursystech-admin wget -qO- http://127.0.0.1:3000/health >/dev/null 2>&1 \
    && curl -fsSI "${HEALTH_URL}" >/dev/null 2>&1; then
    echo "Admin deploy healthcheck passed."
    echo "Containers:"
    docker compose -f "${COMPOSE_FILE}" ps
    exit 0
  fi

  echo "Admin healthcheck attempt ${attempt}/12 failed; retrying..."
  sleep 5
done

echo "Admin deploy healthcheck failed for ${ADMIN_IMAGE}" >&2

if [ "${ROLLBACK_ON_FAILURE}" = "1" ] && [ -n "${previous_image}" ]; then
  echo "Rolling back to previous admin image: ${previous_image}" >&2
  set_env_value "ADMIN_IMAGE" "${previous_image}" "${ENV_FILE}"
  export ADMIN_IMAGE="${previous_image}"
  docker compose -f "${COMPOSE_FILE}" pull admin || true
  docker compose -f "${COMPOSE_FILE}" up -d admin web
fi

exit 1
