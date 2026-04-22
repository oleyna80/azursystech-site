#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-status}"

VPS_HOST="${VPS_HOST:-178.156.212.10}"
VPS_USER="${VPS_USER:-dmitrii}"
SSH_KEY="${SSH_KEY:-/home/dmitrii/.ssh/hardwarelab_deploy}"
LOCAL_DB_PORT="${LOCAL_DB_PORT:-15432}"
REMOTE_DB_HOST="${REMOTE_DB_HOST:-127.0.0.1}"
REMOTE_DB_PORT="${REMOTE_DB_PORT:-5432}"

TUNNEL_SPEC="${LOCAL_DB_PORT}:${REMOTE_DB_HOST}:${REMOTE_DB_PORT}"
PATTERN="ssh .*${LOCAL_DB_PORT}:${REMOTE_DB_HOST}:${REMOTE_DB_PORT}.*${VPS_USER}@${VPS_HOST}"

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

tunnel_pids() {
  pgrep -af "$PATTERN" | awk '{print $1}' || true
}

start_tunnel() {
  if [ -n "$(tunnel_pids)" ]; then
    echo "Tunnel already running: ${TUNNEL_SPEC} via ${VPS_USER}@${VPS_HOST}"
    return 0
  fi

  ssh -fN \
    -i "$SSH_KEY" \
    -o ExitOnForwardFailure=yes \
    -o ServerAliveInterval=30 \
    -o ServerAliveCountMax=3 \
    -L "$TUNNEL_SPEC" \
    "${VPS_USER}@${VPS_HOST}"

  echo "Tunnel started: 127.0.0.1:${LOCAL_DB_PORT} -> ${REMOTE_DB_HOST}:${REMOTE_DB_PORT} (${VPS_USER}@${VPS_HOST})"
}

stop_tunnel() {
  if [ -z "$(tunnel_pids)" ]; then
    echo "Tunnel is not running."
    return 0
  fi
  pkill -f "$PATTERN"
  echo "Tunnel stopped."
}

status_tunnel() {
  local pids
  pids="$(tunnel_pids)"
  if [ -n "$pids" ]; then
    echo "Tunnel running (pids: $pids)"
  else
    echo "Tunnel not running"
  fi
  ss -ltn | grep -E ":${LOCAL_DB_PORT}\s" || true
}

test_tunnel() {
  require_cmd psql
  local db_user db_pass db_name
  read -r db_user db_pass db_name <<<"$(ssh -i "$SSH_KEY" -o BatchMode=yes "${VPS_USER}@${VPS_HOST}" \
    "docker exec azursystech-postgres sh -lc 'printf \"%s %s %s\" \"\$POSTGRES_USER\" \"\$POSTGRES_PASSWORD\" \"\$POSTGRES_DB\"'")"
  PGPASSWORD="$db_pass" psql -h 127.0.0.1 -p "$LOCAL_DB_PORT" -U "$db_user" -d "$db_name" -v ON_ERROR_STOP=1 \
    -c "select now() as ts, current_database() as db, current_user as usr;"
}

case "$ACTION" in
  start)
    start_tunnel
    ;;
  stop)
    stop_tunnel
    ;;
  status)
    status_tunnel
    ;;
  test)
    test_tunnel
    ;;
  restart)
    stop_tunnel
    start_tunnel
    ;;
  *)
    echo "Usage: $0 {start|stop|status|test|restart}" >&2
    exit 1
    ;;
esac
