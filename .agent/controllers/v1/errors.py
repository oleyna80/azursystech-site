"""Fail-closed controller exceptions."""


class ControllerError(Exception):
    """Base class for an expected controller refusal."""


class ValidationError(ControllerError):
    """Input or authority identity is invalid."""


class TransitionDenied(ControllerError):
    """A lifecycle transition's preconditions are not satisfied."""


class DurabilityUncertain(ControllerError):
    """Replacement may have occurred but durable persistence is indeterminate."""


class StopAndPreserve(ControllerError):
    """State must be preserved for operator diagnosis."""
