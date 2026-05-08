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
docker buildx build \
  --platform "${PLATFORM}" \
  --tag "${APP_IMAGE}" \
  --push \
  .

printf '%s\n' "${APP_IMAGE}"
