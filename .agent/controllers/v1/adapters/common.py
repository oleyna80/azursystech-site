"""Shared event normalization helpers."""

from __future__ import annotations

import re
import shlex
from collections.abc import Mapping
from pathlib import PurePosixPath

from ..errors import ValidationError

PATCH_PATH = re.compile(r"^\*\*\*\s+(?:Add|Update|Delete)\s+File:\s+(.+?)\s*$", re.M)
PATCH_MOVE = re.compile(r"^\*\*\*\s+Move to:\s+(.+?)\s*$", re.M)
SHELL_CONTROL = re.compile(r"[;&|<>\n\r]")
AMBIGUOUS_SHELL = re.compile(r"[;&|\n\r`]|\$\(|\$\{")
NON_LITERAL_PATH = re.compile(r"[\[\]*?{}$~]")
UNKNOWN_WRITE_PATH = ("__UNKNOWN_WRITE_PATH__",)
LIFECYCLE_OPERATIONS = {
    "open",
    "refresh-capability",
    "record-dispatch",
    "begin-define-revision",
    "admit-define-revision",
    "freeze-candidate",
    "finalize-assurance",
    "resume-execute",
    "reporting-only",
}


def lifecycle_operation(tool: str, payload: Mapping[str, object]) -> str | None:
    """Recognize only one direct invocation of the activated canonical CLI."""
    if tool.lower() not in {"bash", "shell", "exec_command"}:
        return None
    command = payload.get("command") or payload.get("cmd")
    if not isinstance(command, str) or SHELL_CONTROL.search(command):
        return None
    try:
        tokens = shlex.split(command, posix=True)
    except ValueError:
        return None
    if len(tokens) < 3 or tokens[0] not in {"python", "python3"}:
        return None
    script = PurePosixPath(tokens[1]).as_posix()
    if script not in {".codex/scripts/lifecycle.py", "./.codex/scripts/lifecycle.py"}:
        return None
    operation = next((token for token in tokens[2:] if token in LIFECYCLE_OPERATIONS), None)
    return operation


def write_paths(tool: str, payload: Mapping[str, object]) -> tuple[str, ...] | None:
    name = tool.lower()
    if name in {"edit", "write"}:
        value = payload.get("file_path") or payload.get("path")
        return (str(value),) if isinstance(value, str) and value else UNKNOWN_WRITE_PATH
    if name in {"multiedit", "multi_edit"}:
        edits = payload.get("edits")
        if not isinstance(edits, list) or not edits:
            return UNKNOWN_WRITE_PATH
        paths = []
        for edit in edits:
            if not isinstance(edit, dict):
                return UNKNOWN_WRITE_PATH
            value = edit.get("file_path") or edit.get("path")
            if not isinstance(value, str) or not value:
                return UNKNOWN_WRITE_PATH
            paths.append(value)
        return tuple(paths)
    if name in {"apply_patch", "applypatch"}:
        patch = payload.get("patch") or payload.get("input")
        if not isinstance(patch, str):
            return UNKNOWN_WRITE_PATH
        paths = PATCH_PATH.findall(patch) + PATCH_MOVE.findall(patch)
        return tuple(paths) if paths else UNKNOWN_WRITE_PATH
    if name in {"bash", "shell", "exec_command"}:
        command = payload.get("command") or payload.get("cmd")
        if not isinstance(command, str):
            return UNKNOWN_WRITE_PATH
        return bash_write_paths(command)
    return None


def bash_write_paths(command: str) -> tuple[str, ...] | None:
    """Classify one simple command; every ambiguous shell construct fails closed.

    Returning ``None`` is reserved for a command that this adapter can prove is
    read-only. Unknown commands are potential writers and therefore return the
    unresolved-path sentinel. This avoids treating an unfamiliar Bash writer as
    a read merely because its spelling was absent from a marker list.
    """
    if not command.strip() or AMBIGUOUS_SHELL.search(command):
        return UNKNOWN_WRITE_PATH
    try:
        lexer = shlex.shlex(command, posix=True, punctuation_chars="<>")
        lexer.whitespace_split = True
        lexer.commenters = ""
        tokens = list(lexer)
    except ValueError:
        return UNKNOWN_WRITE_PATH
    if not tokens:
        return UNKNOWN_WRITE_PATH

    command_tokens: list[str] = []
    redirect_paths: list[str] = []
    index = 0
    while index < len(tokens):
        token = tokens[index]
        if token in {">", ">>"}:
            if index + 1 >= len(tokens) or not _literal_path(tokens[index + 1]):
                return UNKNOWN_WRITE_PATH
            redirect_paths.append(tokens[index + 1])
            index += 2
            continue
        if "<" in token or ">" in token:
            return UNKNOWN_WRITE_PATH
        command_tokens.append(token)
        index += 1

    while command_tokens and _assignment(command_tokens[0]):
        command_tokens.pop(0)
    if not command_tokens:
        return UNKNOWN_WRITE_PATH

    executable = PurePosixPath(command_tokens[0]).name.lower()
    arguments = command_tokens[1:]

    if executable in {"echo", "printf"}:
        return tuple(redirect_paths) if redirect_paths else None

    if executable in {"touch", "mkdir", "rm", "rmdir", "unlink"}:
        paths = _flag_only_operands(arguments)
        if paths is None:
            return UNKNOWN_WRITE_PATH
        return _resolved_writes(paths, redirect_paths)

    if executable == "chmod":
        if len(arguments) < 2 or arguments[0].startswith("-"):
            return UNKNOWN_WRITE_PATH
        return _resolved_writes(arguments[1:], redirect_paths)

    if executable in {"cp", "mv", "install"}:
        # Destination-shaping options such as ``-t`` and
        # ``--target-directory`` make the last operand an input.  The adapter
        # intentionally supports only the unambiguous ``SOURCE DEST`` form.
        if any(argument.startswith("-") for argument in arguments):
            return UNKNOWN_WRITE_PATH
        if len(arguments) != 2 or any(not _literal_path(item) for item in arguments):
            return UNKNOWN_WRITE_PATH
        return _resolved_writes((arguments[-1],), redirect_paths)

    if executable == "tee":
        operands = _flag_only_operands(arguments)
        if operands is None or not operands:
            return UNKNOWN_WRITE_PATH
        return _resolved_writes(operands, redirect_paths)

    if executable == "git":
        if not arguments:
            return None
        subcommand = arguments[0].lower()
        if subcommand in {
            "status", "diff", "log", "show", "rev-parse", "ls-files",
            "ls-tree", "cat-file", "merge-base", "name-rev", "cherry",
            "check-ignore", "describe",
        }:
            if _git_may_write_or_execute(arguments[1:]):
                return UNKNOWN_WRITE_PATH
            return tuple(redirect_paths) if redirect_paths else None
        if subcommand == "remote" and len(arguments) >= 2 and arguments[1] in {"-v", "get-url"}:
            return tuple(redirect_paths) if redirect_paths else None
        if subcommand == "add":
            paths = _flag_only_operands(arguments[1:])
            if paths is None or not paths:
                return UNKNOWN_WRITE_PATH
            return _resolved_writes(paths, redirect_paths)
        return UNKNOWN_WRITE_PATH

    if _proven_read_only(executable, arguments):
        return tuple(redirect_paths) if redirect_paths else None
    return UNKNOWN_WRITE_PATH


def _assignment(token: str) -> bool:
    return bool(re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*=[^\n\r]*", token))


def _literal_path(token: str) -> bool:
    return bool(token and token not in {".", ".."} and not NON_LITERAL_PATH.search(token))


def _flag_only_operands(arguments: list[str]) -> list[str] | None:
    """Accept flags with no separate values and return literal operands."""
    operands: list[str] = []
    options_done = False
    for argument in arguments:
        if argument == "--" and not options_done:
            options_done = True
            continue
        if argument.startswith("-") and not options_done:
            continue
        if not _literal_path(argument):
            return None
        options_done = True
        operands.append(argument)
    return operands


def _resolved_writes(paths: list[str] | tuple[str, ...], redirects: list[str]) -> tuple[str, ...]:
    combined = [*paths, *redirects]
    if not combined or any(not _literal_path(path) for path in combined):
        return UNKNOWN_WRITE_PATH
    return tuple(combined)


def _proven_read_only(executable: str, arguments: list[str]) -> bool:
    if executable in {
        "pwd", "ls", "cat", "head", "tail", "wc", "stat", "file",
        "sha256sum", "readlink", "realpath", "dirname", "basename", "true",
        "false", "test", "grep", "egrep", "fgrep",
    }:
        return True
    if executable == "sort":
        return not any(argument == "-o" or argument.startswith("--output=") for argument in arguments)
    if executable == "rg":
        return not any(argument == "--pre" or argument.startswith("--pre=") for argument in arguments)
    return False


def _git_may_write_or_execute(arguments: list[str]) -> bool:
    """Reject Git read commands that can write files or execute helpers."""
    for argument in arguments:
        if argument in {"--output", "--ext-diff", "--textconv"}:
            return True
        if argument.startswith("--output="):
            return True
    return False


def payload_object(event: Mapping[str, object]) -> Mapping[str, object]:
    value = event.get("tool_input") or event.get("input") or event.get("parameters") or {}
    if not isinstance(value, dict):
        raise ValidationError("runtime tool payload must be an object")
    return value
