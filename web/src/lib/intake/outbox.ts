import {
  getIntakeDatabasePool,
  getIntakeStorageMode,
  isSqlStorageEnabled,
  type IntakeStorageMode,
} from "@/lib/intake/config";
import type {
  IntakeOutboxMessage,
  IntakeOutboxStore,
  ListPendingOutboundDraftsInput,
  OutboundMessageTransitionResult,
  TransitionOutboundMessageInput,
} from "@/lib/intake/persistence";
import { createSqlIntakeOutboxStore } from "@/lib/intake/sql-persistence";

export type IntakeOutboxOperation =
  | "list_pending_outbound_drafts"
  | "approve_outbound_draft_message"
  | "queue_approved_outbound_message";

export class IntakeOutboxUnavailableError extends Error {
  constructor(
    readonly operation: IntakeOutboxOperation,
    readonly mode: IntakeStorageMode,
  ) {
    super(`Intake outbox unavailable during ${operation}`);
    this.name = "IntakeOutboxUnavailableError";
  }
}

let store: IntakeOutboxStore | null = null;

function getOutboxStore(): IntakeOutboxStore {
  if (!store) {
    store = createSqlIntakeOutboxStore(getIntakeDatabasePool());
  }

  return store;
}

function ensureSqlOutboxAvailable(operation: IntakeOutboxOperation): void {
  const mode = getIntakeStorageMode();

  if (!isSqlStorageEnabled(mode)) {
    throw new IntakeOutboxUnavailableError(operation, mode);
  }
}

function logOutboxFailure(
  operation: IntakeOutboxOperation,
  mode: IntakeStorageMode,
  error: unknown,
): void {
  const message = error instanceof Error ? error.message : "unknown error";
  console.error("Intake outbox failure", { operation, mode, message });
}

async function runOutboxOperation<T>(
  operation: IntakeOutboxOperation,
  fn: (store: IntakeOutboxStore) => Promise<T>,
): Promise<T> {
  ensureSqlOutboxAvailable(operation);
  const mode = getIntakeStorageMode();

  try {
    return await fn(getOutboxStore());
  } catch (error) {
    logOutboxFailure(operation, mode, error);
    throw error;
  }
}

export function listPendingOutboundDrafts(
  input?: ListPendingOutboundDraftsInput,
): Promise<IntakeOutboxMessage[]> {
  return runOutboxOperation("list_pending_outbound_drafts", (store) =>
    store.listPendingOutboundDrafts(input),
  );
}

export function approveOutboundDraftMessage(
  input: TransitionOutboundMessageInput,
): Promise<OutboundMessageTransitionResult> {
  return runOutboxOperation("approve_outbound_draft_message", (store) =>
    store.approveOutboundDraftMessage(input),
  );
}

export function queueApprovedOutboundMessage(
  input: TransitionOutboundMessageInput,
): Promise<OutboundMessageTransitionResult> {
  return runOutboxOperation("queue_approved_outbound_message", (store) =>
    store.queueApprovedOutboundMessage(input),
  );
}
