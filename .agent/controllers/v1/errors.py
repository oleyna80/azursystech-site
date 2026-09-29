"""Fail-closed controller exceptions."""


class ControllerError(Exception):
    """Base class for an expected controller refusal."""


class ValidationError(ControllerError):
    """Input, persisted state, or authority identity is invalid."""


class TransitionDenied(ControllerError):
    """A lifecycle transition's deterministic preconditions are not satisfied."""


class GitFactError(ControllerError):
    """Required Git facts cannot be resolved deterministically."""


class DurabilityUncertain(ControllerError):
    """Replacement may have occurred but durable persistence is indeterminate."""


class StopAndPreserve(ControllerError):
    """State/Git work must be preserved for explicit recovery."""
