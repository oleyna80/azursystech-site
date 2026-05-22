import {
  getIntakeDatabasePool,
  getIntakeStorageMode,
  isSqlPrimaryStorageMode,
  isSqlStorageEnabled,
  type IntakeStorageMode,
} from "@/lib/intake/config";
import type {
  IntakePersistenceStore,
  LoadIntakeConversationInput,
  PersistIntakeDecisionInput,
  PersistIntakeDecisionResult,
} from "@/lib/intake/persistence";
import { createSqlIntakePersistenceStore } from "@/lib/intake/sql-persistence";
import type { IntakeConversationState } from "@/lib/intake/types";

export type PersistIntakeDecisionOutcome =
  | {
      status: "persisted";
      result: PersistIntakeDecisionResult;
    }
  | {
      status: "skipped_legacy";
    }
  | {
      status: "failed_open_dual";
    };

export class IntakePersistenceUnavailableError extends Error {
  constructor(
    readonly operation: "load_conversation_state" | "persist_decision",
    readonly mode: IntakeStorageMode,
  ) {
    super(`Intake persistence unavailable during ${operation}`);
    this.name = "IntakePersistenceUnavailableError";
  }
}

let store: IntakePersistenceStore | null = null;

function getPersistenceStore(): IntakePersistenceStore {
  if (!store) {
    store = createSqlIntakePersistenceStore(getIntakeDatabasePool());
  }

  return store;
}

function logPersistenceFailure(
  operation: IntakePersistenceUnavailableError["operation"],
  mode: IntakeStorageMode,
  error: unknown,
): void {
  const message = error instanceof Error ? error.message : "unknown error";
  console.error("Intake persistence failure", { operation, mode, message });
}

function shouldFailClosed(mode: IntakeStorageMode): boolean {
  return isSqlPrimaryStorageMode(mode);
}

export async function loadIntakeConversationState(
  input: LoadIntakeConversationInput,
  fallbackState?: IntakeConversationState,
): Promise<IntakeConversationState | undefined> {
  const mode = getIntakeStorageMode();

  if (!isSqlStorageEnabled(mode)) {
    return fallbackState;
  }

  try {
    return (await getPersistenceStore().loadConversationState(input)) ?? fallbackState;
  } catch (error) {
    logPersistenceFailure("load_conversation_state", mode, error);
    if (shouldFailClosed(mode)) {
      throw new IntakePersistenceUnavailableError("load_conversation_state", mode);
    }
    return fallbackState;
  }
}

export async function persistIntakeDecision(
  input: PersistIntakeDecisionInput,
): Promise<PersistIntakeDecisionOutcome> {
  const mode = getIntakeStorageMode();

  if (!isSqlStorageEnabled(mode)) {
    return { status: "skipped_legacy" };
  }

  try {
    return { status: "persisted", result: await getPersistenceStore().persistDecision(input) };
  } catch (error) {
    logPersistenceFailure("persist_decision", mode, error);
    if (shouldFailClosed(mode)) {
      throw new IntakePersistenceUnavailableError("persist_decision", mode);
    }
    return { status: "failed_open_dual" };
  }
}
