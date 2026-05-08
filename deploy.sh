#!/usr/bin/env bash
# VPS deployment script for AzurSysTech registry-pull runtime.
# Usage:
#   ./deploy.sh ghcr.io/oleyna80/azursystech-app:sha-<commit>-<timestamp>
#   APP_IMAGE=ghcr.io/oleyna80/azursystech-app:sha-... ./deploy.sh

set -euo pipefail

APP_IMAGE="${1:-${APP_IMAGE:-}}"
if [ -z "${APP_IMAGE}" ] && [ -n "${IMAGE_REPO:-}" ] && [ -n "${IMAGE_TAG:-}" ]; then
  APP_IMAGE="${IMAGE_REPO}:${IMAGE_TAG}"
fi

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.vps.yml}"
ENV_FILE="${ENV_FILE:-.env}"
HEALTH_URL="${HEALTH_URL:-https://azursystech.fr/health}"
ROLLBACK_ON_FAILURE="${ROLLBACK_ON_FAILURE:-1}"
DEPLOY_STATE_DIR="${DEPLOY_STATE_DIR:-.deploy}"

if [ -z "${APP_IMAGE}" ]; then
  echo "APP_IMAGE is required (use an immutable registry image tag)" >&2
  exit 1
fi

case "${APP_IMAGE}" in
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
previous_image="$(docker inspect -f '{{.Config.Image}}' azursystech-app 2>/dev/null || true)"
if [ -n "${previous_image}" ]; then
  printf '%s\n' "${previous_image}" > "${DEPLOY_STATE_DIR}/previous-app-image"
fi

cp "${ENV_FILE}" "${ENV_FILE}.deploy-${timestamp}.bak"
set_env_value "APP_IMAGE" "${APP_IMAGE}" "${ENV_FILE}"

export APP_IMAGE
echo "Deploying AzurSysTech app image: ${APP_IMAGE}"
docker compose -f "${COMPOSE_FILE}" config >/tmp/azursystech-compose.rendered.yml
docker compose -f "${COMPOSE_FILE}" pull app web
docker compose -f "${COMPOSE_FILE}" up -d --remove-orphans app web

for attempt in $(seq 1 12); do
  if docker exec azursystech-app wget -qO- http://127.0.0.1:3000/health >/dev/null 2>&1 \
    && curl -fsSI "${HEALTH_URL}" >/dev/null 2>&1; then
    echo "Deploy healthcheck passed."
    echo "Containers:"
    docker compose -f "${COMPOSE_FILE}" ps
    exit 0
  fi

  echo "Healthcheck attempt ${attempt}/12 failed; retrying..."
  sleep 5
done

echo "Deploy healthcheck failed for ${APP_IMAGE}" >&2

if [ "${ROLLBACK_ON_FAILURE}" = "1" ] && [ -n "${previous_image}" ]; then
  echo "Rolling back to previous image: ${previous_image}" >&2
  set_env_value "APP_IMAGE" "${previous_image}" "${ENV_FILE}"
  export APP_IMAGE="${previous_image}"
  docker compose -f "${COMPOSE_FILE}" pull app || true
  docker compose -f "${COMPOSE_FILE}" up -d app web
fi

exit 1
