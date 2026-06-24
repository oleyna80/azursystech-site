#!/usr/bin/env bash
# VPS deployment script for AzurSysTech registry-pull runtime.
# Usage:
#   ./deploy.sh ghcr.io/oleyna80/azursystech-app:sha-<commit>-<timestamp>
#   APP_IMAGE=ghcr.io/oleyna80/azursystech-app:sha-... ./deploy.sh
#   WEB_IMAGE=ghcr.io/oleyna80/azursystech-proxy:sha-... ./deploy.sh "$APP_IMAGE"
#   DEPLOY_ADMIN=1 ADMIN_IMAGE=ghcr.io/oleyna80/azursystech-admin:sha-... ./deploy.sh "$APP_IMAGE"

set -euo pipefail

APP_IMAGE="${1:-${APP_IMAGE:-}}"
if [ -z "${APP_IMAGE}" ] && [ -n "${IMAGE_REPO:-}" ] && [ -n "${IMAGE_TAG:-}" ]; then
  APP_IMAGE="${IMAGE_REPO}:${IMAGE_TAG}"
fi
ADMIN_IMAGE="${ADMIN_IMAGE:-}"
WEB_IMAGE="${WEB_IMAGE:-}"
DEPLOY_ADMIN="${DEPLOY_ADMIN:-0}"

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.vps.yml}"
ENV_FILE="${ENV_FILE:-.env}"
HEALTH_URL="${HEALTH_URL:-https://azursystech.fr/health}"
ROLLBACK_ON_FAILURE="${ROLLBACK_ON_FAILURE:-1}"
DEPLOY_STATE_DIR="${DEPLOY_STATE_DIR:-.deploy}"

if [ -z "${APP_IMAGE}" ] && [ -f "${ENV_FILE}" ]; then
  APP_IMAGE="$(grep -E '^APP_IMAGE=' "${ENV_FILE}" | head -1 | cut -d= -f2-)"
fi

if [ -z "${APP_IMAGE}" ]; then
  echo "APP_IMAGE is required (use an immutable registry image tag)" >&2
  exit 1
fi

derive_proxy_image() {
  app_image="$1"

  case "${app_image}" in
    *-app:*)
      printf '%s-proxy:%s\n' "${app_image%-app:*}" "${app_image##*:}"
      ;;
    *)
      return 1
      ;;
  esac
}

if [ -z "${WEB_IMAGE}" ]; then
  if ! WEB_IMAGE="$(derive_proxy_image "${APP_IMAGE}")"; then
    if [ -f "${ENV_FILE}" ]; then
      WEB_IMAGE="$(grep -E '^WEB_IMAGE=' "${ENV_FILE}" | head -1 | cut -d= -f2-)"
    fi

    if [ -z "${WEB_IMAGE}" ]; then
      echo "WEB_IMAGE is required when it cannot be derived from APP_IMAGE" >&2
      exit 1
    fi
  fi
fi

case "${APP_IMAGE}" in
  *:latest|latest)
    echo "latest is forbidden for deploy source; use an immutable tag" >&2
    exit 1
    ;;
esac

case "${WEB_IMAGE}" in
  *:latest|latest)
    echo "latest is forbidden for proxy deploy source; use an immutable tag" >&2
    exit 1
    ;;
esac

if [ "${DEPLOY_ADMIN}" = "1" ]; then
  if [ -z "${ADMIN_IMAGE}" ]; then
    echo "ADMIN_IMAGE is required when DEPLOY_ADMIN=1" >&2
    exit 1
  fi

  case "${ADMIN_IMAGE}" in
    *:latest|latest)
      echo "latest is forbidden for admin deploy source; use an immutable tag" >&2
      exit 1
      ;;
  esac
fi

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

wait_for_health() {
  label="$1"
  require_admin="${2:-0}"

  for attempt in $(seq 1 12); do
    if docker exec azursystech-app wget -qO- http://127.0.0.1:3000/health >/dev/null 2>&1 \
      && curl -fsSI "${HEALTH_URL}" >/dev/null 2>&1; then
      if [ "${require_admin}" = "1" ]; then
        for admin_attempt in $(seq 1 12); do
          if docker exec azursystech-admin wget -qO- http://127.0.0.1:3000/health >/dev/null 2>&1; then
            break
          fi

          if [ "${admin_attempt}" = "12" ]; then
            echo "${label} admin healthcheck failed" >&2
            return 1
          fi

          echo "${label} admin healthcheck attempt ${admin_attempt}/12 failed; retrying..."
          sleep 5
        done
      fi

      echo "${label} healthcheck passed."
      return 0
    fi

    echo "${label} healthcheck attempt ${attempt}/12 failed; retrying..."
    sleep 5
  done

  return 1
}

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
previous_image="$(docker inspect -f '{{.Config.Image}}' azursystech-app 2>/dev/null || true)"
if [ -n "${previous_image}" ]; then
  printf '%s\n' "${previous_image}" > "${DEPLOY_STATE_DIR}/previous-app-image"
fi
previous_web_image="$(docker inspect -f '{{.Config.Image}}' azursystech-web 2>/dev/null || true)"
if [ -n "${previous_web_image}" ]; then
  printf '%s\n' "${previous_web_image}" > "${DEPLOY_STATE_DIR}/previous-web-image"
fi
previous_admin_image=""
if [ "${DEPLOY_ADMIN}" = "1" ]; then
  previous_admin_image="$(docker inspect -f '{{.Config.Image}}' azursystech-admin 2>/dev/null || true)"
  if [ -n "${previous_admin_image}" ]; then
    printf '%s\n' "${previous_admin_image}" > "${DEPLOY_STATE_DIR}/previous-admin-image"
  fi
fi

cp "${ENV_FILE}" "${ENV_FILE}.deploy-${timestamp}.bak"
set_env_value "APP_IMAGE" "${APP_IMAGE}" "${ENV_FILE}"
set_env_value "WEB_IMAGE" "${WEB_IMAGE}" "${ENV_FILE}"
if [ "${DEPLOY_ADMIN}" = "1" ]; then
  set_env_value "ADMIN_IMAGE" "${ADMIN_IMAGE}" "${ENV_FILE}"
fi

export APP_IMAGE
export WEB_IMAGE
if [ "${DEPLOY_ADMIN}" = "1" ]; then
  export ADMIN_IMAGE
fi
echo "Deploying AzurSysTech app image: ${APP_IMAGE}"
echo "Deploying AzurSysTech proxy image: ${WEB_IMAGE}"
docker compose -f "${COMPOSE_FILE}" config >/tmp/azursystech-compose.rendered.yml
docker compose -f "${COMPOSE_FILE}" pull app web
docker compose -f "${COMPOSE_FILE}" up -d --no-build --remove-orphans app web

if [ "${DEPLOY_ADMIN}" = "1" ]; then
  echo "Deploying AzurSysTech admin image: ${ADMIN_IMAGE}"
  docker compose -f "${COMPOSE_FILE}" --profile admin pull admin
  docker compose -f "${COMPOSE_FILE}" --profile admin up -d --no-build admin
fi

if wait_for_health "Deploy" "${DEPLOY_ADMIN}"; then
  echo "Containers:"
  docker compose -f "${COMPOSE_FILE}" ps
  exit 0
fi

echo "Deploy healthcheck failed for ${APP_IMAGE}" >&2

if [ "${ROLLBACK_ON_FAILURE}" = "1" ] && [ -n "${previous_image}" ]; then
  echo "Rolling back to previous image: ${previous_image}" >&2
  set_env_value "APP_IMAGE" "${previous_image}" "${ENV_FILE}"
  export APP_IMAGE="${previous_image}"
  rollback_web_image="${previous_web_image}"
  if [ -z "${rollback_web_image}" ]; then
    rollback_web_image="$(derive_proxy_image "${previous_image}" || true)"
  fi
  if [ -n "${rollback_web_image}" ]; then
    echo "Rolling back proxy to previous image: ${rollback_web_image}" >&2
    set_env_value "WEB_IMAGE" "${rollback_web_image}" "${ENV_FILE}"
    export WEB_IMAGE="${rollback_web_image}"
  fi
  rollback_admin="0"
  if [ "${DEPLOY_ADMIN}" = "1" ] && [ -n "${previous_admin_image}" ]; then
    echo "Rolling back admin to previous image: ${previous_admin_image}" >&2
    set_env_value "ADMIN_IMAGE" "${previous_admin_image}" "${ENV_FILE}"
    export ADMIN_IMAGE="${previous_admin_image}"
    rollback_admin="1"
  fi

  if ! docker compose -f "${COMPOSE_FILE}" pull app web; then
    echo "Rollback app/proxy image pull failed; attempting to use the local image cache." >&2
  fi
  if [ "${rollback_admin}" = "1" ]; then
    if ! docker compose -f "${COMPOSE_FILE}" --profile admin pull admin; then
      echo "Rollback admin image pull failed; attempting to use the local image cache." >&2
    fi
    docker compose -f "${COMPOSE_FILE}" --profile admin up -d --no-build app web admin
  else
    docker compose -f "${COMPOSE_FILE}" up -d --no-build app web
  fi

  if wait_for_health "Rollback" "${rollback_admin}"; then
    echo "Rollback healthcheck passed; original deploy still failed." >&2
  else
    echo "Rollback healthcheck failed." >&2
    exit 2
  fi
fi

exit 1
