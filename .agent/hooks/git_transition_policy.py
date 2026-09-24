#!/usr/bin/env python3
"""Shared, fail-closed policy for Git's index and pre-push ref event."""
from __future__ import annotations

import fnmatch
import json
import os
from pathlib import Path
import re
import shlex
import subprocess
import sys

from hard_stop_policy import (
    TERMINAL_CLOSEOUT_PATHS, autonomous_subject_push_allowed,
    canonical_inactive_for_commit, canonical_terminal_inactive, critic_disposition_evidence,
    assured_candidate_evidence, candidate_tree_identity, frozen_candidate_matches_head, default_branch,
    resolved_critic_for_publication, terminal_projection,
)

ROOT = Path(__file__).resolve().parents[2]
STATE = ".agent/active-work-block.json"
ID = re.compile(r"^(?:WB-[0-9]{3}|WB-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9]+(?:-[a-z0-9]+)*)$")
FORBIDDEN = ("*.pem", "*.key", "*.p12", "*.pfx", "*.pyc", "**/__pycache__/**", "node_modules/**")


class Denied(ValueError):
    pass


def wrapped_executable(tokens: list[str]) -> str:
    """Identify the program after ordinary command/env prefixes."""
    index = 0
    while index < len(tokens):
        name = Path(tokens[index]).name
        if name in {"exec", "sudo"}:
            index += 1
            continue
        if name == "command":
            index += 1
            if index < len(tokens) and tokens[index] in {"-v", "-V"}:
                return ""
            if index < len(tokens) and tokens[index] == "-p":
                index += 1
            continue
        if name == "env":
            index += 1
            while index < len(tokens):
                option = tokens[index]
                if option == "--":
                    index += 1
                    break
                if option in {"-u", "--unset", "-C", "--chdir", "--ignore-signal", "--block-signal", "--default-signal"}:
                    index += 2
                elif option.startswith("-") or ("=" in option and not option.startswith("-")):
                    index += 1
                else:
                    break
            continue
        return name
    return ""


def runtime_git_dispatch(command: str, root: Path) -> None:
    """Reject indirect Git execution and aliases before adapter event routing."""
    commit_hint = bool(re.search(
        r"(?:^|\s)commit(?:\s|$)|alias\.[^\s=]+=commit(?:\s|$)", command,
    ))
    try:
        lexer = shlex.shlex(command, posix=True, punctuation_chars=";&|<>()")
        lexer.whitespace_split = True
        lexer.commenters = ""
        tokens = list(lexer)
    except ValueError as exc:
        if re.search(r"(?<![\w])git(?![\w-])", command) or commit_hint:
            raise Denied(f"invalid Git command: {exc}") from exc
        return
    if tokens and any(char in tokens[0] for char in "$`"):
        raise Denied("dynamic shell executable denied")
    # GNU env -S constructs a new argument vector after our shell tokenization.
    # Its attached form (-Sbash) can hide a nested shell from the token scan.
    if tokens and Path(tokens[0]).name == "env" and any(
        token == "--split-string" or token.startswith("--split-string=")
        or token.startswith("-S") for token in tokens[1:]
    ):
        raise Denied("env split-string command denied")
    shell_wrapper = any(
        Path(token).name in {"bash", "sh", "dash", "zsh"}
        and any(re.fullmatch(r"-[A-Za-z]*c[A-Za-z]*", option) for option in tokens[index + 1:])
        for index, token in enumerate(tokens)
    )
    if shell_wrapper:
        raise Denied("nested shell command denied")
    # Search text and quoted arguments may mention Git without invoking it.
    # Classify the executable position (or a recognized command wrapper),
    # leaving arbitrary shell construction outside this cooperative guardrail.
    executable = wrapped_executable(tokens)
    git_hint = bool(re.match(r"^\s*git(?:\s|$)", command))
    decoded_git = bool(tokens and (tokens[0] == "git" or tokens[0].endswith("/git")))
    bypass_hint = commit_hint and bool(
        re.search(r"(?:^|\s)(?:-n|--no-veri\S*)(?:\s|$)", command)
    )
    if not (git_hint or decoded_git or executable == "git" or (executable in {"exec", "sudo"} and bypass_hint)):
        return
    if any(ord(char) < 32 or ord(char) == 127 for char in command) or "$" in command or "`" in command:
        raise Denied("indirect Git command denied")
    if not re.match(r"^\s*git(?:\s|$)", command) or not tokens or tokens[0] != "git" or any(
        token and all(char in ";&|<>()" for char in token) for token in tokens[1:]
    ):
        raise Denied("Git command requires direct, single invocation")
    index = 1
    while index < len(tokens) and tokens[index].startswith("-"):
        option = tokens[index]
        if option in {"-c", "-C", "--git-dir", "--work-tree", "--namespace", "--config-env"}:
            if index + 1 >= len(tokens):
                raise Denied("Git global option lacks value")
            value = tokens[index + 1]
            index += 2
        elif option.startswith("-c") and option != "-c":
            value = option[2:]
            index += 1
        elif option.startswith("--config-env="):
            value = option.split("=", 1)[1]
            index += 1
        else:
            index += 1
            continue
        if value.startswith("alias."):
            raise Denied("Git alias override denied")
    if index >= len(tokens):
        return
    subcommand = tokens[index]
    try:
        alias = subprocess.run(
            ["git", "config", "--get", f"alias.{subcommand}"], cwd=root,
            capture_output=True, text=True, timeout=5,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise Denied(f"cannot inspect Git alias: {exc}") from exc
    if alias.returncode == 0:
        raise Denied("Git alias dispatch denied")
    if alias.returncode != 1:
        raise Denied("Git alias inspection failed")


def runtime_commit_command(command: str) -> None:
    """Keep tool-mediated commits on the native-hook path."""
    if any(ord(char) < 32 or ord(char) == 127 for char in command):
        raise Denied("commit command control character denied")
    if "$" in command or "`" in command:
        raise Denied("commit command expansion denied")
    if any(char in command for char in "{}*?[]~"):
        raise Denied("commit command shell expansion denied")
    try:
        lexer = shlex.shlex(command, posix=True, punctuation_chars=";&|<>()")
        lexer.whitespace_split = True
        lexer.commenters = ""
        tokens = list(lexer)
    except ValueError as exc:
        raise Denied(f"invalid commit command: {exc}") from exc
    if tokens[:2] != ["git", "commit"]:
        raise Denied("commit requires direct git commit without environment or Git-global overrides")
    if any(token and all(char in ";&|<>()" for char in token) for token in tokens[2:]):
        raise Denied("compound commit command denied")
    if any(
        (option.startswith("--no-") and "--no-verify".startswith(option))
        or option.startswith("--no-verify")
        or (token.startswith("-") and not token.startswith("--") and "n" in token[1:])
        for token in tokens[2:]
        for option in [token.split("=", 1)[0]]
    ):
        raise Denied("commit hook bypass option denied")


def runtime_frozen_commit(root: Path) -> None:
    """Delegate a frozen source commit to the installed shared index policy."""
    try:
        configured = subprocess.run(
            ["git", "config", "--get", "core.hooksPath"], cwd=root,
            capture_output=True, text=True, timeout=5,
        )
        hook = root / ".githooks/pre-commit"
        message_hook = root / ".githooks/commit-msg"
        policy = root / ".agent/hooks/git_transition_policy.py"
        if configured.returncode != 0 or configured.stdout.strip() != ".githooks":
            raise Denied("frozen commit requires core.hooksPath=.githooks")
        if (not hook.is_file() or not os.access(hook, os.X_OK)
                or not message_hook.is_file() or not os.access(message_hook, os.X_OK)
                or not policy.is_file()):
            raise Denied("frozen commit requires executable Git-native pre-commit and commit-msg hooks and shared policy")
        result = subprocess.run(
            [sys.executable, str(policy), "pre-commit"], cwd=root,
            capture_output=True, text=True, timeout=20,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise Denied(f"cannot execute shared frozen commit policy: {exc}") from exc
    if result.returncode:
        raise Denied(f"shared frozen commit policy denied: {result.stderr.strip()}")


def git(*args: str, input: bytes | None = None) -> bytes:
    result = subprocess.run(["git", *args], cwd=ROOT, input=input, capture_output=True, timeout=15)
    if result.returncode:
        raise Denied(f"git {' '.join(args)} failed: {result.stderr.decode(errors='replace').strip()}")
    return result.stdout


def state_from_bytes(raw: bytes) -> dict:
    try:
        value = json.loads(raw)
    except (ValueError, UnicodeError) as exc:
        raise Denied(f"invalid lifecycle state: {exc}") from exc
    if not isinstance(value, dict) or value.get("schema_version") != 3 or value.get("authority_mode") != "github_capability":
        raise Denied("unsupported lifecycle state")
    return value


def load_state() -> dict:
    try:
        return state_from_bytes((ROOT / STATE).read_bytes())
    except OSError as exc:
        raise Denied(f"lifecycle state unavailable: {exc}") from exc


def matches(path: str, patterns: list[str]) -> bool:
    for pattern in patterns:
        if not isinstance(pattern, str) or not pattern or pattern.startswith("/") or ".." in Path(pattern).parts:
            raise Denied("invalid write-set pattern")
        if pattern.endswith("/**") and path.startswith(pattern[:-3].rstrip("/") + "/"):
            return True
        if path == pattern or fnmatch.fnmatchcase(path, pattern):
            return True
    return False


def forbidden(path: str) -> bool:
    parts = Path(path).parts
    name = parts[-1]
    return (
        any(part in {"node_modules", "__pycache__"} for part in parts)
        or (name == ".env" or (name.startswith(".env.") and not name.endswith(".example")))
        or any(fnmatch.fnmatchcase(name, pattern) for pattern in FORBIDDEN if "/" not in pattern)
    )


def staged_paths() -> list[str]:
    raw = git("diff", "--cached", "--name-status", "-z", "--no-renames")
    fields = raw.split(b"\0")
    if fields[-1:] == [b""]:
        fields.pop()
    if len(fields) % 2:
        raise Denied("malformed staged path list")
    paths: list[str] = []
    for index in range(0, len(fields), 2):
        status = fields[index].decode("ascii", errors="replace")
        path = fields[index + 1].decode("utf-8", errors="surrogateescape")
        if status not in {"A", "C", "D", "M", "T"} or not path or path.startswith("/") or ".." in Path(path).parts:
            raise Denied("unsupported staged path/status")
        paths.append(path)
    if not paths or len(paths) != len(set(paths)):
        raise Denied("empty or duplicate staged path list")
    return paths


def candidate_matches_index(paths: list[str], gate: dict) -> None:
    revision = gate.get("frozen_revision")
    if not isinstance(revision, str) or not re.fullmatch(r"content-sha256:[0-9a-f]{64}", revision):
        raise Denied("frozen candidate identity missing")
    sys.path.insert(0, str(ROOT / ".codex" / "scripts"))
    from lifecycle import candidate_content_identity
    if candidate_content_identity(ROOT, gate.get("write_set")) != revision:
        raise Denied("frozen worktree candidate changed")
    tree = git("write-tree").decode().strip()
    if candidate_tree_identity(ROOT, tree, gate["write_set"]) != revision:
        raise Denied("frozen candidate differs from complete proposed index tree")
    for path in paths:
        if not matches(path, gate["write_set"]):
            continue
        result = subprocess.run(["git", "show", f":{path}"], cwd=ROOT, capture_output=True)
        file = ROOT / path
        if result.returncode:
            if file.exists() or file.is_symlink():
                raise Denied(f"index/worktree deletion mismatch: {path}")
        elif file.is_symlink():
            if result.stdout != file.readlink().as_posix().encode():
                raise Denied(f"index/worktree symlink mismatch: {path}")
        elif not file.is_file() or result.stdout != file.read_bytes():
            raise Denied(f"index/worktree candidate mismatch: {path}")


def commit() -> None:
    gate = load_state()
    paths = staged_paths()
    if any(forbidden(path) for path in paths):
        raise Denied("prohibited local or secret-bearing path staged")
    if git("show", f":{STATE}") != (ROOT / STATE).read_bytes():
        raise Denied("index lifecycle state differs from worktree")
    branch = git("symbolic-ref", "--quiet", "--short", "HEAD").decode().strip()
    default = default_branch(ROOT)
    if not default or branch == default:
        raise Denied("default branch commit denied")
    active = gate.get("work_block_id")
    if active:
        if not isinstance(active, str) or not ID.fullmatch(active) or gate.get("subject_branch") != branch:
            raise Denied("active Work Block/branch mismatch")
        spec = gate.get("specification")
        if not isinstance(spec, dict) or not spec.get("path") or not spec.get("revision"):
            raise Denied("active specification missing")
        if not resolved_critic_for_publication(gate):
            raise Denied("Critic admission is not ready")
        source = gate.get("write_set")
        coordination = gate.get("coordination_write_set")
        if not isinstance(source, list) or not source or not isinstance(coordination, list):
            raise Denied("write-set unavailable")
        if any(not matches(path, source + coordination) for path in paths):
            raise Denied("staged path outside approved write-set")
        source_paths = [path for path in paths if not matches(path, coordination)]
        status = gate.get("write_gate", {}).get("status")
        if status == "READY":
            return
        if status == "BLOCKED":
            candidate_matches_index(source_paths, gate)
            return
        raise Denied("source gate unresolved")
    if not canonical_inactive_for_commit(gate, ROOT):
        raise Denied("inactive state is not canonical")
    coordination = gate.get("coordination_write_set")
    if not isinstance(coordination, list) or any(not matches(path, coordination) for path in paths):
        raise Denied("inactive commit exceeds coordination scope")
    try:
        parent = state_from_bytes(git("show", f"HEAD:{STATE}"))
    except Denied:
        parent = None
    if isinstance(parent, dict) and parent.get("work_block_id"):
        if not canonical_terminal_inactive(gate, ROOT):
            raise Denied("terminal child must be successful canonical inactive")
        if STATE not in paths or parent.get("subject_branch") != branch or not ID.fullmatch(str(parent.get("work_block_id"))):
            raise Denied("invalid terminal closeout binding")
        allowed = TERMINAL_CLOSEOUT_PATHS | {f"docs/plans/{parent['work_block_id']}.md", f"docs/tasklist/{parent['work_block_id']}.tasklist.md"}
        if any(path not in allowed for path in paths):
            raise Denied("terminal closeout staged diff exceeds bound")
        if parent.get("write_gate", {}).get("status") != "BLOCKED" or not critic_disposition_evidence(parent, ROOT) or not assured_candidate_evidence(parent, ROOT) or not frozen_candidate_matches_head(parent, ROOT):
            raise Denied("terminal parent lacks committed frozen assurance")
        tree = git("write-tree").decode().strip()
        child = git("commit-tree", tree, "-p", "HEAD", "-m", "pre-commit terminal projection").decode().strip()
        if terminal_projection(ROOT, "HEAD", parent, child_revision=child) is None:
            raise Denied("staged terminal projection is malformed")


def push(remote: str, url: str, lines: bytes) -> None:
    if remote != "origin":
        raise Denied("push remote must be origin")
    push_url = subprocess.run(["git", "config", "--get", "remote.origin.pushurl"], cwd=ROOT, capture_output=True)
    expected_url = push_url.stdout.decode().strip() if push_url.returncode == 0 else git("config", "--get", "remote.origin.url").decode().strip()
    if not url or url != expected_url:
        raise Denied("push URL does not match origin")
    updates = [line.split() for line in lines.decode("utf-8", errors="strict").splitlines() if line.strip()]
    if len(updates) != 1 or len(updates[0]) != 4:
        raise Denied("push requires exactly one update")
    local_ref, local_oid, remote_ref, remote_oid = updates[0]
    branch = git("symbolic-ref", "--quiet", "--short", "HEAD").decode().strip()
    if local_ref != "HEAD" or local_oid != git("rev-parse", "HEAD").decode().strip() or remote_ref != f"refs/heads/{branch}":
        raise Denied("push must update exact subject branch from HEAD")
    if not re.fullmatch(r"[0-9a-f]{40,64}", remote_oid) or not re.fullmatch(r"[0-9a-f]{40,64}", local_oid):
        raise Denied("push object IDs malformed")
    if int(remote_oid, 16) != 0:
        result = subprocess.run(["git", "merge-base", "--is-ancestor", remote_oid, local_oid], cwd=ROOT, capture_output=True)
        if result.returncode:
            raise Denied("non-fast-forward or unknown remote parent")
    gate = load_state()
    command = f"git push origin HEAD:refs/heads/{branch}"
    if not autonomous_subject_push_allowed(command, gate, ROOT):
        raise Denied("shared publication policy denied candidate")


def main() -> int:
    try:
        if sys.argv[1:] == ["pre-commit"]:
            commit()
        elif len(sys.argv) == 4 and sys.argv[1] == "pre-push":
            push(sys.argv[2], sys.argv[3], sys.stdin.buffer.read())
        else:
            raise Denied("invalid Git transition event")
    except (Denied, OSError, UnicodeError, ValueError, subprocess.TimeoutExpired, SystemExit) as exc:
        print(f"git-transition: BLOCKED: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
