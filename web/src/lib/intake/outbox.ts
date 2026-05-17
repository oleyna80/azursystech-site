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
  ListQueuedOutboundMessagesInput,
  MarkOutboundMessageSentInput,
  OutboundMessageTransitionResult,
  TransitionOutboundMessageInput,
} from "@/lib/intake/persistence";
import type { IntakeOutboundSender } from "@/lib/intake/sender";
import { createSqlIntakeOutboxStore } from "@/lib/intake/sql-persistence";

export type IntakeOutboxOperation =
  | "list_pending_outbound_drafts"
  | "list_queued_outbound_messages"
  | "approve_outbound_draft_message"
  | "queue_approved_outbound_message"
  | "mark_outbound_message_sent"
  | "mark_outbound_message_failed";

export type DispatchQueuedOutboundMessagesInput = ListQueuedOutboundMessagesInput & {
  sender: IntakeOutboundSender;
  liveSendingEnabled?: boolean;
};

export type DispatchQueuedOutboundMessageResult =
  | {
      ok: true;
      messageId: string;
      providerMessageId: string;
      transition: OutboundMessageTransitionResult;
    }
  | {
      ok: false;
      messageId: string;
      error: string;
      retryable: boolean;
      transition: OutboundMessageTransitionResult;
    };

export type DispatchQueuedOutboundMessagesResult =
  | {
      ok: false;
      mode: "disabled";
      attempted: 0;
      results: [];
    }
  | {
      ok: true;
      mode: "enabled";
      attempted: number;
      results: DispatchQueuedOutboundMessageResult[];
    };

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

export function listQueuedOutboundMessages(
  input?: ListQueuedOutboundMessagesInput,
): Promise<IntakeOutboxMessage[]> {
  return runOutboxOperation("list_queued_outbound_messages", (store) =>
    store.listQueuedOutboundMessages(input),
  );
}

export function approveOutboundDraftMessage(
  input: TransitionOutboundMessageInput,
): Promise<OutboundMessageTransitionResult> {
  return runOutboxOperation("approve_outbound_draft_message", (store) =>
    store.approveOutboundDraftMessage(input),
  );
}

export function markOutboundMessageSent(
  input: MarkOutboundMessageSentInput,
): Promise<OutboundMessageTransitionResult> {
  return runOutboxOperation("mark_outbound_message_sent", (store) =>
    store.markOutboundMessageSent(input),
  );
}

export function markOutboundMessageFailed(
  input: TransitionOutboundMessageInput,
): Promise<OutboundMessageTransitionResult> {
  return runOutboxOperation("mark_outbound_message_failed", (store) =>
    store.markOutboundMessageFailed(input),
  );
}

export async function dispatchQueuedOutboundMessages(
  input: DispatchQueuedOutboundMessagesInput,
): Promise<DispatchQueuedOutboundMessagesResult> {
  if (!input.liveSendingEnabled) {
    return {
      ok: false,
      mode: "disabled",
      attempted: 0,
      results: [],
    };
  }

  const messages = await listQueuedOutboundMessages(input);
  const results: DispatchQueuedOutboundMessageResult[] = [];

  for (const message of messages) {
    if (message.providerMessageId) {
      continue;
    }

    const sendResult = await input.sender.send(message);

    if (sendResult.ok) {
      results.push({
        ok: true,
        messageId: message.messageId,
        providerMessageId: sendResult.providerMessageId,
        transition: await markOutboundMessageSent({
          messageId: message.messageId,
          providerMessageId: sendResult.providerMessageId,
        }),
      });
      continue;
    }

    results.push({
      ok: false,
      messageId: message.messageId,
      error: sendResult.error,
      retryable: sendResult.retryable,
      transition: await markOutboundMessageFailed({ messageId: message.messageId }),
    });
  }

  return {
    ok: true,
    mode: "enabled",
    attempted: results.length,
    results,
  };
}

export function queueApprovedOutboundMessage(
  input: TransitionOutboundMessageInput,
): Promise<OutboundMessageTransitionResult> {
  return runOutboxOperation("queue_approved_outbound_message", (store) =>
    store.queueApprovedOutboundMessage(input),
  );
}
