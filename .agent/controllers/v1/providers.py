"""Concrete trusted external platform fact providers."""

from __future__ import annotations

import json
import re
import subprocess
from dataclasses import dataclass
from urllib.parse import quote

from .errors import StopAndPreserve
from .installation import InstallationConfig


_FEATURE_UNAVAILABLE = object()


def _feature_unavailable(exc: subprocess.CalledProcessError) -> bool:
    detail = (exc.stderr or "") + "\n" + (exc.stdout or "")
    return (
        "HTTP 403" in detail
        and "Upgrade to GitHub Pro" in detail
        and "enable this feature" in detail
    )


def _run_json(command: list[str], *, feature_unavailable_sentinel=False):
    try:
        result = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
            timeout=10,
        )
    except subprocess.CalledProcessError as exc:
        if feature_unavailable_sentinel and _feature_unavailable(exc):
            return _FEATURE_UNAVAILABLE
        raise StopAndPreserve(
            "trusted GitHub branch-protection lookup failed"
        ) from exc
    except (OSError, subprocess.SubprocessError) as exc:
        raise StopAndPreserve(
            "trusted GitHub branch-protection lookup failed"
        ) from exc
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        raise StopAndPreserve(
            "trusted GitHub branch-protection response is invalid"
        ) from exc


def _classic_pattern_matches(pattern: str, branch: str) -> bool | None:
    """Return exact match, or None when GitHub fnmatch semantics are unsupported.

    We only return False when the implemented subset can prove non-match.
    Unsupported syntax is fail-closed by the caller.
    """

    if not isinstance(pattern, str) or not pattern:
        return None
    if "\\" in pattern or "[" in pattern or "]" in pattern or "**" in pattern:
        return None
    if not any(token in pattern for token in ("*", "?")):
        return pattern == branch

    pieces: list[str] = ["^"]
    for char in pattern:
        if char == "*":
            pieces.append("[^/]*")
        elif char == "?":
            pieces.append("[^/]")
        else:
            pieces.append(re.escape(char))
    pieces.append("$")
    return re.fullmatch("".join(pieces), branch) is not None


@dataclass(frozen=True, slots=True)
class GitHubCliBranchProtectionResolver:
    config: InstallationConfig

    def _ruleset_protected(self, branch: str) -> bool:
        endpoint = (
            f"repos/{self.config.repository}/rules/branches/"
            f"{quote(branch, safe='')}"
        )
        payload = _run_json(
            ["gh", "api", endpoint],
            feature_unavailable_sentinel=True,
        )
        if payload is _FEATURE_UNAVAILABLE:
            return False
        if not isinstance(payload, list):
            raise StopAndPreserve(
                "trusted GitHub ruleset response is ambiguous"
            )
        return bool(payload)

    def _classic_protected(self, branch: str) -> bool:
        owner, name = self.config.repository.split("/", 1)
        query = (
            "query($owner:String!,$name:String!){"
            "repository(owner:$owner,name:$name){"
            "branchProtectionRules(first:100){"
            "nodes{pattern} pageInfo{hasNextPage}"
            "}}}"
        )
        payload = _run_json(
            [
                "gh", "api", "graphql",
                "-f", f"query={query}",
                "-F", f"owner={owner}",
                "-F", f"name={name}",
            ],
            feature_unavailable_sentinel=True,
        )
        if payload is _FEATURE_UNAVAILABLE:
            return False
        if not isinstance(payload, dict):
            raise StopAndPreserve(
                "trusted GitHub classic-protection response is ambiguous"
            )
        errors = payload.get("errors")
        if errors not in (None, []):
            raise StopAndPreserve(
                "trusted GitHub classic-protection response contains errors"
            )
        try:
            connection = payload["data"]["repository"]["branchProtectionRules"]
            nodes = connection["nodes"]
            has_next = connection["pageInfo"]["hasNextPage"]
        except (KeyError, TypeError) as exc:
            raise StopAndPreserve(
                "trusted GitHub classic-protection response is ambiguous"
            ) from exc
        if type(has_next) is not bool or has_next:
            raise StopAndPreserve(
                "classic branch-protection rule set is incomplete"
            )
        if not isinstance(nodes, list):
            raise StopAndPreserve(
                "classic branch-protection rule set is invalid"
            )
        for node in nodes:
            if not isinstance(node, dict):
                raise StopAndPreserve(
                    "classic branch-protection rule is invalid"
                )
            match = _classic_pattern_matches(node.get("pattern"), branch)
            if match is None or match:
                return True
        return False

    def __call__(self, remote: str, branch: str) -> bool:
        if remote != self.config.remote:
            raise StopAndPreserve("branch-protection request used untrusted remote")
        if not isinstance(branch, str) or not branch:
            raise StopAndPreserve("branch-protection request is missing branch")
        if self._ruleset_protected(branch):
            return True
        return self._classic_protected(branch)
