"""Versioned Work Block controller generation v1.

This package is inert while WB-031 is active.  Future live entry points are
staged under ``activation/staged`` and import this package only after the
post-terminal activation projection has been verified and integrated.
"""

from .errors import ControllerError, DurabilityUncertain, ValidationError

CONTROLLER_GENERATION = "v1"

__all__ = [
    "CONTROLLER_GENERATION",
    "ControllerError",
    "DurabilityUncertain",
    "ValidationError",
]
