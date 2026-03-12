#!/usr/bin/env bash
# VPS deployment script for AzurSysTech image
# Usage: ./deploy.sh <image_tag>
# Example: ./deploy.sh sha-<40-char-commit>

set -euo pipefail

IMAGE_TAG="${1:-${IMAGE_TAG:-}}"
IMAGE_REPO="${IMAGE_REPO:-ghcr.io/<owner>/<repo>}"
COMPOSE_FILE="docker-compose.vps.yml"

if [ -z "${IMAGE_TAG}" ]; then
  echo "image tag is required (use immutable sha-* tag)" >&2
  exit 1
fi

if [ "${IMAGE_TAG}" = "latest" ]; then
  echo "latest is forbidden for deploy source; use immutable sha-* tag" >&2
  exit 1
fi

echo "Deploying AzurSysTech (image: ${IMAGE_REPO}:${IMAGE_TAG})..."

export IMAGE_TAG
export IMAGE_REPO
docker compose -f "${COMPOSE_FILE}" config >/tmp/azursystech-compose.rendered.yml
docker compose -f "${COMPOSE_FILE}" pull
docker compose -f "${COMPOSE_FILE}" up -d --remove-orphans
docker image prune -f

echo "Deploy complete. Containers:"
docker compose -f "${COMPOSE_FILE}" ps
