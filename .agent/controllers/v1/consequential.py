"""Minimal non-lifecycle guard for obvious consequential shell effects."""

from __future__ import annotations

import re

from .events import Decision, decision

_PATTERNS = (
    (re.compile(r"\bgit\s+push\b[^\n]*(?:--force(?:-with-lease)?|-f\b)", re.I), "force push"),
    (re.compile(r"\bgit\s+(?:reset\s+--hard|clean\b)", re.I), "destructive Git operation"),
    (re.compile(r"\bterraform\s+(?:apply|destroy)\b", re.I), "live infrastructure operation"),
    (re.compile(r"\bkubectl\s+(?:apply|delete|patch|replace|scale|rollout|set)\b", re.I), "live infrastructure operation"),
    (re.compile(r"\bsystemctl\s+(?:restart|stop|start)\b", re.I), "live infrastructure operation"),
    (re.compile(r"\bdocker\s+push\b", re.I), "external image publish"),
    (re.compile(r"\bgh\s+(?:pr\s+merge|release\s+(?:create|delete|upload)|secret\s+(?:set|delete)|repo\s+edit)\b", re.I), "consequential GitHub mutation"),
    (re.compile(r"\b(?:psql|mysql|mongosh|redis-cli)\b[^\n]*\b(?:DELETE|UPDATE|INSERT|ALTER|DROP|TRUNCATE|CREATE)\b", re.I), "direct live-data mutation"),
    (re.compile(r"\b(?:rotate|revoke)\b[^\n]*(?:token|secret|key|credential)", re.I), "credential operation"),
    (re.compile(r"\b(?:sendmail|mailx|twilio|sendgrid|msmtp|ssmtp)\b", re.I), "client-facing communication"),
)


def evaluate_command(command: str) -> Decision:
    if not isinstance(command, str):
        return decision("DENY", "CONSEQUENTIAL_INPUT_INVALID", "shell command is missing")
    for pattern, label in _PATTERNS:
        if pattern.search(command):
            return decision(
                "DENY",
                "CONSEQUENTIAL_EFFECT_DENIED",
                f"{label} requires an external Owner/platform authority boundary",
            )
    return decision(
        "ALLOW",
        "CONSEQUENTIAL_GUARD_CLEAR",
        "no explicitly consequential shell operation was recognized",
    )
