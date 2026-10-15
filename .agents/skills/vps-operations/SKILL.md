---
name: vps-operations
description: Safe procedures for VPS server connectivity, SSH key management, port forwarding/tunnels (vps-db-tunnel.sh), GHCR container registry credentials (vps-ghcr-login.sh), and environment variable setup for live VPS operations. Use when managing SSH access, authorized_keys, DB tunnels, GHCR login, or troubleshooting VPS connectivity.
---

# VPS Operations & Connectivity

Procedural guide for managing VPS connections, SSH key deployment, database tunneling, container registry authentication, and server troubleshooting.

---

## 1. Prerequisites & Environment Variables

VPS operations require explicit target parameters. Never guess or hardcode hostnames in source files:

- `VPS_HOST`: Target IP address or hostname (e.g. `178.156.212.10` or domain)
- `VPS_USER`: Target user account (default: `dmitrii`)
- `SSH_KEY`: Path to private SSH key (e.g. `~/.ssh/id_ed25519_azur` or `~/.ssh/gh_actions_vps`)

---

## 2. SSH Key Management & Authorized Keys

To authorize a new SSH key for automated deployment or manual access on the VPS:

### Step 2.1: Appending Public Keys to VPS
Execute on the VPS server under the target user (`dmitrii`):

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
cat << 'EOF' >> ~/.ssh/authorized_keys
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKin3KYqW3zrup5Zmdt0NclHlEUUCgH6fsEgWw/YGb+m gh-actions-deploy
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOaRzU6cGK43tnAjHKXjda+x3fSIE+R/6gs5SLUq9hwA dmitrii@azur-vps
EOF
chmod 600 ~/.ssh/authorized_keys
```

### Step 2.2: Testing Connection
Test SSH connectivity with strict timeout and batch mode:

```bash
ssh -i ~/.ssh/id_ed25519_azur -o ConnectTimeout=5 -o BatchMode=yes dmitrii@${VPS_HOST} "echo VPS_OK"
```

---

## 3. Database SSH Tunneling (`vps-db-tunnel.sh`)

For secure local access to the remote PostgreSQL database container on VPS without exposing database ports publicly:

### Commands
```bash
# Start background SSH tunnel (127.0.0.1:15432 -> remote container 5432)
VPS_HOST="${VPS_HOST}" SSH_KEY="~/.ssh/id_ed25519_azur" bash scripts/vps-db-tunnel.sh start

# Check tunnel status
VPS_HOST="${VPS_HOST}" bash scripts/vps-db-tunnel.sh status

# Test DB connection over tunnel via psql
VPS_HOST="${VPS_HOST}" bash scripts/vps-db-tunnel.sh test

# Stop SSH tunnel
VPS_HOST="${VPS_HOST}" bash scripts/vps-db-tunnel.sh stop
```

---

## 4. GHCR Docker Registry Login (`vps-ghcr-login.sh`)

To configure or rotate GitHub Container Registry read-only pull credentials on the VPS without leaking tokens into shell history:

```bash
VPS_HOST="${VPS_HOST}" SSH_KEY="~/.ssh/id_ed25519_azur" bash scripts/vps-ghcr-login.sh
```
*Prompts securely for `GHCR_TOKEN` via masked tty input.*

---

## 5. Troubleshooting SSH Handshake Failures

If SSH returns `ssh: handshake failed: unable to authenticate`:

1. **Check key permissions on VPS**: `chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys`.
2. **Check SSH daemon config on VPS**: `/etc/ssh/sshd_config` must have `PubkeyAuthentication yes`.
3. **Check key format**: Ensure OpenSSH key format (no trailing quotes or corrupted line breaks).
