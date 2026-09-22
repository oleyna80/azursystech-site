"""Runtime-shared monotonic deny-only outer guardrails."""

from __future__ import annotations

import re
from collections.abc import Mapping

from .policy import PolicyDecision

_DENIALS = (
    (
        re.compile(
            r"\b(?:git\s+reset\s+--hard|git\s+clean\b|"
            r"rm\s+(?:-[A-Za-z]*r[A-Za-z]*|--recursive)\b|"
            r"terraform\s+destroy|kubectl\s+delete|"
            r"DROP\s+(?:DATABASE|TABLE)|TRUNCATE\s+TABLE)\b",
            re.I,
        ),
        "destructive operation",
    ),
    (
        re.compile(
            r"\b(?:kubectl\s+(?:apply|patch|replace|scale|rollout|set)|"
            r"terraform\s+apply|systemctl\s+(?:restart|stop|start)|"
            r"service\s+\S+\s+(?:restart|stop|start)|scp|ssh|rsync[^\n]*:)\b",
            re.I,
        ),
        "live infrastructure operation",
    ),
    (re.compile(r"\bdocker\s+push\b", re.I), "external image publication"),
    (re.compile(r"\bgit\s+push\b", re.I), "Owner-controlled Git publication"),
    (
        re.compile(
            r"\bgh\s+(?:workflow\s+run|run\s+(?:rerun|cancel|delete)|"
            r"pr\s+merge|release\s+(?:create|delete|upload)|"
            r"secret\s+(?:set|delete)|variable\s+(?:set|delete)|repo\s+edit)\b|"
            r"\bgh\s+api\b[^\n]*(?:--method|-X)\s*(?:POST|PUT|PATCH|DELETE)\b",
            re.I,
        ),
        "Owner-controlled GitHub operation",
    ),
    (
        re.compile(
            r"\bcurl\b(?=[^\n]*api\.github\.com)"
            r"(?=[^\n]*(?:-X\s*(?:POST|PUT|PATCH|DELETE)|"
            r"--request\s*(?:POST|PUT|PATCH|DELETE)|--data))[^\n]*",
            re.I,
        ),
        "Owner-controlled GitHub API operation",
    ),
    (
        re.compile(
            r"\b(?:psql|mysql|mongosh|redis-cli)\b[^\n]*\b"
            r"(?:DELETE|UPDATE|INSERT|ALTER|DROP|TRUNCATE|CREATE)\b",
            re.I,
        ),
        "direct live-data mutation",
    ),
    (
        re.compile(
            r"(?:^|[\s/])"
            r"(?:\.env(?:\.(?!example(?:[\s/]|$))[\w.-]+)?|credentials|secrets)"
            r"(?:[\s/]|$)|"
            r"\b(?:rotate|revoke)\b[^\n]*(?:token|secret|key|credential)",
            re.I,
        ),
        "credential or secret operation",
    ),
    (
        re.compile(
            r"\b(?:sendmail|mailx|twilio|sendgrid|msmtp|ssmtp)\b|"
            r"\bcurl\b[^\n]*(?:messages|email|sms|notifications|whatsapp)[^\n]*"
            r"(?:-X\s*(?:POST|PUT|PATCH)|--data)",
            re.I,
        ),
        "client-facing communication",
    ),
)


def evaluate_outer(event: Mapping[str, object]) -> PolicyDecision:
    """Apply only non-Work-Block hard stops; ALLOW never grants WB authority."""
    command = event.get("command")
    if not isinstance(command, str):
        return PolicyDecision.allow("no outer hard-stop command surface")
    for pattern, reason in _DENIALS:
        if pattern.search(command):
            return PolicyDecision.deny("OUTER_HARD_STOP", reason)
    return PolicyDecision.allow("no outer hard stop matched")
