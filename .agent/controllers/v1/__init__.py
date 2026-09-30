"""Inert Work Block controller v1. Importing this package has no side effects."""

from .errors import ControllerError, DurabilityUncertain, StopAndPreserve, TransitionDenied, ValidationError

CONTROLLER_GENERATION = "v1"

__all__ = [
    "CONTROLLER_GENERATION",
    "ControllerError",
    "DurabilityUncertain",
    "StopAndPreserve",
    "TransitionDenied",
    "ValidationError",
]
