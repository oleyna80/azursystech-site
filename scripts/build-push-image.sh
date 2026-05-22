#!/usr/bin/env bash
# Build and push an immutable AzurSysTech app image from WSL.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_REPO="${IMAGE_REPO:-ghcr.io/oleyna80/azursystech-app}"
COMMIT_SHA="${COMMIT_SHA:-$(git -C "${ROOT_DIR}" rev-parse --short=12 HEAD)}"
STAMP="${STAMP:-$(date -u +%Y%m%dT%H%M%SZ)}"
IMAGE_TAG="${IMAGE_TAG:-sha-${COMMIT_SHA}-${STAMP}}"
APP_IMAGE="${IMAGE_REPO}:${IMAGE_TAG}"
PLATFORM="${PLATFORM:-linux/amd64}"
RUN_CHECKS="${RUN_CHECKS:-1}"
REGISTRY="${REGISTRY:-ghcr.io}"
GHCR_USER="${GHCR_USER:-${GITHUB_ACTOR:-oleyna80}}"
GHCR_TOKEN="${GHCR_TOKEN:-${GITHUB_TOKEN:-}}"

ensure_ghcr_auth() {
  if [ -n "${GHCR_TOKEN}" ]; then
    printf '%s\n' "${GHCR_TOKEN}" | docker login "${REGISTRY}" -u "${GHCR_USER}" --password-stdin >/dev/null
    return
  fi

  if [ "${GHCR_ALLOW_EXISTING_LOGIN:-0}" = "1" ]; then
    echo "GHCR_TOKEN is not set; relying on existing 'docker login ${REGISTRY}' credential." >&2
    return
  fi

  echo "GHCR_TOKEN is required before push; set GHCR_ALLOW_EXISTING_LOGIN=1 only after verifying 'docker login ${REGISTRY}'." >&2
  exit 2
}

case "${APP_IMAGE}" in
  *:latest|latest)
    echo "latest is forbidden for deploy source; use an immutable tag" >&2
    exit 1
    ;;
esac

if [ "${RUN_CHECKS}" = "1" ]; then
  cd "${ROOT_DIR}/web"
  npm ci
  npm run check:ci
fi

cd "${ROOT_DIR}"
ensure_ghcr_auth
docker buildx build \
  --platform "${PLATFORM}" \
  --tag "${APP_IMAGE}" \
  --push \
  .

printf '%s\n' "${APP_IMAGE}"
