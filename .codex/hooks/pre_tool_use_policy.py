#!/usr/bin/env python3
"""Fail-closed Codex PreToolUse guard for Work Block writes.

Standard-library only. This is a project guardrail, not an OS security boundary.
"""
from __future__ import annotations

import datetime as dt
import fnmatch
import json
import os
from pathlib import Path, PurePosixPath
import re
import shlex
import subprocess
import sys

GATE_PATH = Path(".agent/active-work-block.json")
SIGNER_ENV = "AGENTIC_SDLC_OWNER_SIGNERS"
SIGNER_IDENTITY = "owner@agentic-sdlc"
SIGNER_NAMESPACE = "agentic-sdlc-authorization"
DEFAULT_COORDINATION = [
    ".agent/active-work-block.json",
    ".agent/critic-gate.md",
    ".agent/verification-gate.md",
    ".codex/write-gate.md",
    "docs/plans/**",
    "docs/specs/**",
    "docs/tasklist/**",
    "docs/reports/**",
    "docs/architecture/drafts/**",
    "memory_bank/**",
]
PATCH_PATHS = re.compile(
    r"^\*\*\*\s+(?:Update|Add|Delete)\s+File:\s+(.+?)\s*$", re.M
)
PATCH_MOVES = re.compile(r"^\*\*\*\s+Move to:\s+(.+?)\s*$", re.M)
DIFF_PATHS = re.compile(r"^\+\+\+\s+(?:b/)?(.+?)\s*$", re.M)
REDIRECTS = re.compile(r"(?<![<])(?:^|[^>])>{1,2}\s*([^\s;&|]+)")
MUTATING = re.compile(
    r"(^|[;&|]\s*)(rm|rmdir|mv|cp|install|touch|mkdir|ln|chmod|chown|"
    r"truncate|sed\s+-[^;\n]*i|perl\s+-[^;\n]*i|tee|"
    r"git\s+(add|commit|push|reset|clean|checkout|restore|mv|rm)|"
    r"npm\s+(install|uninstall|update|ci)|pnpm\s+(install|add|remove|update)|"
    r"yarn\s+(install|add|remove|upgrade)|pip3?\s+install|"
    r"poetry\s+(add|remove|install|update)|cargo\s+(add|remove|install|update)|"
    r"go\s+get|docker\s+(build|push|compose\s+(up|down))|"
    r"kubectl\s+(apply|delete|patch|replace|scale|rollout|set)|"
    r"terraform\s+(apply|destroy|import)|systemctl\s+(restart|stop|start|enable|disable)|"
    r"service\s+\S+\s+(restart|stop|start))(\s|$)",
    re.I,
)
DANGEROUS = [
    (re.compile(r"\bgit\s+commit\b", re.I), "git_commit", "git commit"),
    (re.compile(r"\bgit\s+push\b", re.I), "git_push", "git push"),
    (
        re.compile(
            r"\b(git\s+reset\s+--hard|git\s+clean|terraform\s+destroy|"
            r"kubectl\s+delete|DROP\s+(DATABASE|TABLE))\b|"
            r"\brm\b(?=[^;\n]*(?:\s--recursive\b|\s-[A-Za-z]*r))"
            r"(?=[^;\n]*(?:\s--force\b|\s-[A-Za-z]*f))",
            re.I,
        ),
        "destructive",
        "destructive operation",
    ),
    (
        re.compile(
            r"\b(docker\s+push|kubectl\s+(apply|patch|replace|scale|rollout|set)|"
            r"terraform\s+apply|systemctl\s+(restart|stop|start)|"
            r"service\s+\S+\s+(restart|stop|start)|scp|rsync[^\n]*:)\b",
            re.I,
        ),
        "live_infra",
        "live infrastructure operation",
    ),
    (
        re.compile(
            r"\b(psql|mysql|mongosh|redis-cli)\b[^\n]*\b"
            r"(DELETE|UPDATE|INSERT|ALTER|DROP|TRUNCATE|CREATE)\b",
            re.I,
        ),
        "live_data",
        "direct data mutation",
    ),
    (
        re.compile(
            r"(^|[\s/])(\.env([.][\w.-]+)?|credentials|secrets)([\s/]|$)|"
            r"\b(rotate|revoke)\b[^\n]*(token|secret|key|credential)",
            re.I,
        ),
        "credentials",
        "credential or secret access/mutation",
    ),
    (
        re.compile(
            r"\b(sendmail|mailx|twilio|sendgrid)\b|"
            r"\bcurl\b[^\n]*(messages|email|sms|notifications)[^\n]*"
            r"(-X\s*(POST|PUT|PATCH)|--data)",
            re.I,
        ),
        "client_communications",
        "client-facing communication",
    ),
]


class Denied(Exception):
    pass


def block(reason):
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": reason,
                }
            },
            ensure_ascii=False,
        )
    )
    raise SystemExit(0)


def read_event():
    try:
        event = json.load(sys.stdin)
    except (json.JSONDecodeError, OSError) as exc:
        block(f"Cannot parse PreToolUse input: {exc}")
    if not isinstance(event, dict):
        block("PreToolUse input must be a JSON object.")
    return event


def root_from(cwd):
    start = Path(str(cwd or os.getcwd())).resolve()
    for root in (start, *start.parents):
        if (root / GATE_PATH).is_file():
            return root
    block(f"Cannot find {GATE_PATH.as_posix()} from {start}.")


def load_gate(root):
    try:
        gate = json.loads((root / GATE_PATH).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        block(f"Invalid {GATE_PATH.as_posix()}: {exc}")
    if not isinstance(gate, dict):
        block("Active Work Block gate must be a JSON object.")
    return gate


def git(root, *args):
    try:
        result = subprocess.run(
            ["git", *args], cwd=root, check=True, capture_output=True,
            text=True, timeout=3
        )
    except (OSError, subprocess.SubprocessError) as exc:
        raise Denied(f"Cannot inspect git state: {exc}")
    return result.stdout.strip()


def git_raw(root, *args):
    try:
        result = subprocess.run(
            ["git", *args], cwd=root, check=True, capture_output=True,
            text=True, timeout=3
        )
    except (OSError, subprocess.SubprocessError) as exc:
        raise Denied(f"Cannot inspect git state: {exc}")
    return result.stdout


def signer_file(root):
    raw = os.environ.get(SIGNER_ENV)
    if not raw:
        raise Denied(f"{SIGNER_ENV} must name the external Owner trust anchor.")
    path = Path(raw).expanduser()
    if not path.is_absolute():
        raise Denied(f"{SIGNER_ENV} must be an absolute path.")
    try:
        resolved = path.resolve(strict=True)
    except OSError as exc:
        raise Denied(f"Owner trust anchor is unavailable: {exc}") from exc
    try:
        resolved.relative_to(root)
    except ValueError:
        pass
    else:
        raise Denied("Owner trust anchor must not reside in the mutable project.")
    if not resolved.is_file():
        raise Denied("Owner trust anchor must be a file.")
    return resolved


def verify_authorization_signature(root, path, committed, record, authorization):
    signature = record.get("signature")
    expected_path = f"{path}.sig"
    if not isinstance(signature, dict) or signature.get("path") != expected_path:
        raise Denied("Authorization record requires a detached sibling signature.")
    try:
        committed_signature = git_raw(root, "show", f"HEAD:{expected_path}")
        signature_blob = git(root, "rev-parse", f"HEAD:{expected_path}")
        disk_signature = (root / expected_path).read_text(encoding="utf-8")
    except (OSError, Denied) as exc:
        raise Denied(f"Authorization signature is unavailable: {exc}") from exc
    if disk_signature != committed_signature:
        raise Denied("Authorization signature is dirty or changed from committed policy.")
    if authorization.get("signature_path") != expected_path or authorization.get("signature_blob_id") != signature_blob:
        raise Denied("Authorization signature binding is dirty or changed from committed policy.")
    try:
        result = subprocess.run(
            ["ssh-keygen", "-Y", "verify", "-f", str(signer_file(root)), "-I", SIGNER_IDENTITY,
             "-n", SIGNER_NAMESPACE, "-s", str(root / expected_path)],
            input=committed, text=True, capture_output=True, check=False, timeout=5,
        )
    except OSError as exc:
        raise Denied(f"Owner signature verifier is unavailable: {exc}") from exc
    if result.returncode != 0:
        raise Denied("Authorization Owner signature is invalid.")


def normalize(raw, root):
    value = raw.strip().strip("\"'")
    if value in {"/dev/null", "dev/null"}:
        return ""
    if value.startswith(("a/", "b/")):
        value = value[2:]
    path = Path(value)
    if path.is_absolute():
        try:
            path = path.resolve().relative_to(root)
        except (ValueError, OSError) as exc:
            raise Denied(f"Path is outside repository: {raw}") from exc
    pure = PurePosixPath(path.as_posix())
    if ".." in pure.parts:
        raise Denied(f"Path escapes repository: {raw}")
    value = pure.as_posix().lstrip("./")
    if not value or value == ".":
        raise Denied(f"Cannot resolve repository path: {raw}")
    return value


def matches(path, patterns):
    path = path.rstrip("/")
    for raw in patterns:
        pattern = str(raw).strip().replace("\\", "/").lstrip("./")
        if not pattern:
            continue
        if pattern.endswith("/**"):
            prefix = pattern[:-3].rstrip("/")
            if path == prefix or path.startswith(prefix + "/"):
                return True
        if path == pattern.rstrip("/") or fnmatch.fnmatchcase(path, pattern):
            return True
    return False


def coordination(gate):
    values = gate.get("coordination_write_set")
    if isinstance(values, list) and any(str(v).strip() for v in values):
        return [str(v) for v in values if str(v).strip()]
    return DEFAULT_COORDINATION


def require_scope(paths, patterns, label):
    outside = [path for path in paths if not matches(path, patterns)]
    if outside:
        raise Denied(
            f"{label} outside approved scope: {', '.join(outside)}. "
            "Update the Work Block write-set before retrying."
        )


def expiry(value):
    if not isinstance(value, str) or not value.strip():
        raise Denied("write_gate.expires_at must be a non-empty timestamp.")
    try:
        parsed = dt.datetime.fromisoformat(value.strip().replace("Z", "+00:00"))
    except ValueError as exc:
        raise Denied(f"Invalid write_gate.expires_at: {exc}") from exc
    if parsed.tzinfo is None:
        raise Denied("write_gate.expires_at must include a timezone.")
    return parsed.astimezone(dt.timezone.utc)


def validate_source_gate(gate, root):
    if gate.get("schema_version") != 2:
        raise Denied("Unsupported active Work Block schema_version.")
    if not str(gate.get("work_block_id") or "").strip():
        raise Denied("Active Work Block requires work_block_id.")
    write_gate = gate.get("write_gate")
    if not isinstance(write_gate, dict) or write_gate.get("status") != "READY":
        raise Denied("Source writes require write_gate.status=READY.")
    exp = expiry(write_gate.get("expires_at"))
    if dt.datetime.now(dt.timezone.utc) >= exp:
        raise Denied(f"Write gate expired at {exp.isoformat()}.")
    spec = gate.get("specification")
    if not isinstance(spec, dict) or not str(spec.get("path") or "").strip():
        raise Denied("Active Work Block requires specification.path.")
    if not str(spec.get("revision") or "").strip():
        raise Denied("Active Work Block requires specification.revision.")
    base = str(gate.get("base_commit") or "").strip()
    if not re.fullmatch(r"[0-9a-fA-F]{7,40}", base):
        raise Denied("Active Work Block requires a valid base_commit SHA.")
    head = git(root, "rev-parse", "HEAD")
    if not head.startswith(base) and not base.startswith(head):
        raise Denied(f"Stale gate: HEAD {head[:12]} != base_commit {base[:12]}.")
    if gate.get("schema_version") == 2:
        auth = gate.get("authorization")
        if not isinstance(auth, dict) or not isinstance(auth.get("path"), str):
            raise Denied("Source gate requires authorization record.")
        path = auth["path"]
        if not path.startswith(".agent/authorizations/") or not path.endswith(".json"):
            raise Denied("Authorization record path is invalid.")
        committed = git_raw(root, "show", f"HEAD:{path}")
        blob = git(root, "rev-parse", f"HEAD:{path}")
        try:
            disk = (root / path).read_text(encoding="utf-8")
            record = json.loads(committed)
        except (OSError, json.JSONDecodeError) as exc:
            raise Denied(f"Authorization record unavailable: {exc}") from exc
        if disk != committed or auth.get("blob_id") != blob:
            raise Denied("Authorization record is dirty or changed from committed policy.")
        required = ("work_block_id", "specification", "spec_digest", "write_set", "expires_at", "status", "owner_evidence", "critic", "signature")
        if not isinstance(record, dict) or any(not record.get(key) for key in required):
            raise Denied("Authorization record is incomplete.")
        if record["status"] != "APPROVED" or record["work_block_id"] != gate.get("work_block_id"):
            raise Denied("Authorization record does not approve this Work Block.")
        if record["specification"] != gate.get("specification") or record["spec_digest"] != gate.get("spec_digest"):
            raise Denied("Authorization record specification mismatch.")
        if record["write_set"] != gate.get("write_set"):
            raise Denied("Authorization record write-set mismatch or widening.")
        if record["critic"] != gate.get("critic"):
            raise Denied("Authorization record Critic evidence mismatch.")
        verify_authorization_signature(root, path, committed, record, auth)
        ceiling = expiry(record["expires_at"])
        if expiry(write_gate.get("expires_at")) > ceiling:
            raise Denied("Gate expiry exceeds committed authorization ceiling.")
    critic = gate.get("critic")
    if not isinstance(critic, dict):
        raise Denied("Active Work Block requires critic state.")
    if critic.get("required") is True:
        status, verdict = critic.get("status"), critic.get("verdict")
        if status not in {"READY", "DEGRADED", "FALLBACK", "SKIPPED"}:
            raise Denied("Required Critic state is unresolved.")
        if status in {"READY", "DEGRADED", "FALLBACK"} and verdict not in {"APPROVE", "SUPPLEMENT"}:
            raise Denied("Required Critic verdict must be APPROVE or SUPPLEMENT.")
        if status == "SKIPPED" and not str(critic.get("skip_reason") or "").strip():
            raise Denied("Skipped Critic requires skip_reason.")
    write_set = gate.get("write_set")
    if not isinstance(write_set, list) or not any(str(v).strip() for v in write_set):
        raise Denied("Active Work Block requires a non-empty write_set.")
    return [str(v) for v in write_set if str(v).strip()]


def patch_paths(command, root):
    raw = PATCH_PATHS.findall(command) + PATCH_MOVES.findall(command) + DIFF_PATHS.findall(command)
    paths = []
    for value in raw:
        path = normalize(value, root)
        if path and path not in paths:
            paths.append(path)
    if not paths:
        raise Denied(
            "apply_patch did not expose target paths; use the standard "
            "'*** Update/Add/Delete File:' format."
        )
    return paths


def check_paths(paths, gate, root):
    coordination_paths = coordination(gate)
    source = [path for path in paths if not matches(path, coordination_paths)]
    if not source:
        require_scope(paths, coordination_paths, "Coordination write")
        return
    require_scope(source, validate_source_gate(gate, root), "Source write")


def approved(gate, key):
    values = gate.get("hard_stop_approvals")
    return isinstance(values, dict) and values.get(key) is True


def dangerous(command, gate, root):
    found = set()
    for pattern, key, label in DANGEROUS:
        if pattern.search(command):
            found.add(key)
            if not approved(gate, key):
                raise Denied(
                    f"{label} requires hard_stop_approvals.{key}=true and "
                    "recorded Owner approval."
                )
    if "git_push" in found:
        explicit = re.search(
            r"\bgit\s+push\b[^\n]*(\bmain\b|\bmaster\b|\bHEAD:(main|master)\b)",
            command, re.I
        )
        implicit = not re.search(r"\bgit\s+push\b\s+\S+\s+\S+", command, re.I)
        if implicit and git(root, "branch", "--show-current") not in {"main", "master"}:
            implicit = False
        if (explicit or implicit) and not approved(gate, "default_branch_push"):
            raise Denied(
                "Default-branch push requires "
                "hard_stop_approvals.default_branch_push=true."
            )
    return found


def shell_paths(command, root):
    paths = []
    for match in REDIRECTS.finditer(command):
        path = normalize(match.group(1), root)
        if path not in paths:
            paths.append(path)
    if re.search(r";|&&|\|\||(?<!\|)\|(?!\|)", command):
        raise Denied(
            "Complex mutating Bash cannot be scoped safely; split the command "
            "or use apply_patch."
        )
    try:
        tokens = shlex.split(command, posix=True)
    except ValueError as exc:
        raise Denied(f"Cannot parse mutating Bash: {exc}") from exc
    if not tokens:
        return paths
    name = Path(tokens[0]).name
    args = [v for v in tokens[1:] if not v.startswith("-")]
    targets = []
    if name in {"touch", "mkdir", "rm", "rmdir", "chmod", "chown", "truncate"}:
        targets = args
    elif name in {"mv", "install", "ln"}:
        targets = args
    elif name == "cp" and args:
        targets = [args[-1]]
    elif name == "tee":
        targets = args
    elif name in {"sed", "perl"}:
        targets = [v for v in args if not v.startswith(("s/", "s|"))]
    elif name == "git" and args and args[0] in {"add", "mv", "rm", "restore", "checkout"}:
        targets = args[1:]
    elif name in {"npm", "pnpm", "yarn", "pip", "pip3", "poetry", "cargo", "go"}:
        raise Denied(
            "Dependency commands have broad implicit writes; use a separately "
            "approved workflow."
        )
    for raw in targets:
        if raw in {".", "./"} or raw.startswith(("$", "`")) or any(c in raw for c in "*?[]{}"):
            raise Denied(f"Write target cannot be scoped safely: {raw}")
        path = normalize(raw, root)
        if path not in paths:
            paths.append(path)
    if not paths:
        raise Denied(
            "Mutating Bash did not expose explicit target paths; use apply_patch "
            "or a simpler command."
        )
    return paths


def check_bash(event, gate, root):
    value = event.get("tool_input")
    command = value.get("command") if isinstance(value, dict) else None
    if not isinstance(command, str):
        raise Denied("Bash input is missing tool_input.command.")
    found = dangerous(command, gate, root)
    if "git_push" in found or found.intersection({"live_infra", "live_data", "client_communications"}):
        return
    if "git_commit" in found:
        write_set = validate_source_gate(gate, root)
        staged = [v for v in git(root, "diff", "--cached", "--name-only", "--diff-filter=ACMRD").splitlines() if v]
        if not staged:
            raise Denied("git commit has no staged paths to validate.")
        require_scope(
            [v for v in staged if not matches(v, coordination(gate))],
            write_set,
            "Staged commit",
        )
        return
    if MUTATING.search(command) or REDIRECTS.search(command):
        check_paths(shell_paths(command, root), gate, root)


def main():
    event = read_event()
    root = root_from(event.get("cwd"))
    gate = load_gate(root)
    tool = str(event.get("tool_name") or "")
    try:
        if tool == "Bash":
            check_bash(event, gate, root)
        else:
            value = event.get("tool_input")
            command = value.get("command") if isinstance(value, dict) else None
            if not isinstance(command, str):
                raise Denied(f"Unsupported write tool shape for {tool}; use apply_patch.")
            check_paths(patch_paths(command, root), gate, root)
    except Denied as exc:
        block(str(exc))


if __name__ == "__main__":
    main()
