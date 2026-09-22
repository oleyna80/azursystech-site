"""UTC time primitives with internal clock injection for deterministic tests."""

from __future__ import annotations

import datetime as dt
from collections.abc import Callable

from .errors import ValidationError

UTC = dt.timezone.utc
Clock = Callable[[], dt.datetime]


def utc_now() -> dt.datetime:
    """Production clock.  Public CLIs deliberately expose no clock override."""
    return dt.datetime.now(UTC)


def ensure_utc(value: dt.datetime, label: str = "timestamp") -> dt.datetime:
    if value.tzinfo is None or value.utcoffset() is None:
        raise ValidationError(f"{label} must be timezone-aware")
    return value.astimezone(UTC)


def parse_utc(value: object, label: str = "timestamp") -> dt.datetime:
    if not isinstance(value, str) or not value.strip():
        raise ValidationError(f"{label} must be a non-empty UTC timestamp")
    text = value.strip()
    if text.endswith("Z"):
        text = f"{text[:-1]}+00:00"
    try:
        parsed = dt.datetime.fromisoformat(text)
    except ValueError as exc:
        raise ValidationError(f"{label} is not ISO-8601") from exc
    return ensure_utc(parsed, label)


def render_utc(value: dt.datetime) -> str:
    return ensure_utc(value).isoformat().replace("+00:00", "Z")


def fixed_clock(value: dt.datetime) -> Clock:
    """Test-only helper; production entry points always call ``utc_now``."""
    instant = ensure_utc(value)
    return lambda: instant
