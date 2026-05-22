#!/usr/bin/env bash
# Install/rotate the VPS read-only GHCR Docker login without exposing the token
# in shell history or process arguments.

set -euo pipefail

VPS_HOST="${VPS_HOST:?VPS_HOST is required}"
VPS_USER="${VPS_USER:-dmitrii}"
SSH_KEY="${SSH_KEY:-/home/dmitrii/.ssh/hardwarelab_deploy}"
REGISTRY="${REGISTRY:-ghcr.io}"
GHCR_USER="${GHCR_USER:-oleyna80}"
VERIFY_IMAGE="${VERIFY_IMAGE:-ghcr.io/oleyna80/azursystech-app:sha-fbf4e2f653f1-20260508T144928Z}"

if [ $# -ne 0 ]; then
  echo "Do not pass the token as an argument. Pipe it on stdin or enter it at the prompt." >&2
  exit 2
fi

if [ -t 0 ]; then
  printf 'GHCR deploy token for %s: ' "${GHCR_USER}" >&2
  restore_tty() {
    stty echo
  }
  trap restore_tty EXIT INT TERM
  stty -echo
  IFS= read -r GHCR_TOKEN
  stty echo
  trap - EXIT INT TERM
  printf '\n' >&2
else
  IFS= read -r GHCR_TOKEN
fi

if [ -z "${GHCR_TOKEN}" ]; then
  echo "GHCR token is required." >&2
  exit 2
fi

printf '%s\n' "${GHCR_TOKEN}" | ssh -i "${SSH_KEY}" "${VPS_USER}@${VPS_HOST}" \
  "docker login ${REGISTRY} -u ${GHCR_USER} --password-stdin"

if [ -n "${VERIFY_IMAGE}" ]; then
  ssh -i "${SSH_KEY}" "${VPS_USER}@${VPS_HOST}" \
    "docker manifest inspect ${VERIFY_IMAGE} >/dev/null"
  echo "VPS GHCR pull credential verified for ${VERIFY_IMAGE}."
fi
