import {
  getIntakeDatabasePool,
  getIntakeStorageMode,
  isSqlPrimaryStorageMode,
  isSqlStorageEnabled,
  type IntakeStorageMode,
} from "@/lib/intake/config";
import {
  IntakeBriefConversationNotFoundError,
  type IntakeBriefStore,
  type SaveIntakeBriefInput,
  type SaveIntakeBriefResult,
} from "@/lib/intake/briefs";
import { createSqlIntakeBriefStore } from "@/lib/intake/sql-persistence";

export type SaveIntakeBriefOutcome =
  | {
      status: "persisted";
      result: SaveIntakeBriefResult;
    }
  | {
      status: "skipped_legacy";
    }
  | {
      status: "failed_open_dual";
    };

export class IntakeBriefPersistenceUnavailableError extends Error {
  constructor(
    readonly operation: "save_brief",
    readonly mode: IntakeStorageMode,
  ) {
    super(`Intake brief persistence unavailable during ${operation}`);
    this.name = "IntakeBriefPersistenceUnavailableError";
  }
}

let store: IntakeBriefStore | null = null;

function getBriefStore(): IntakeBriefStore {
  if (!store) {
    store = createSqlIntakeBriefStore(getIntakeDatabasePool());
  }

  return store;
}

function shouldFailClosed(mode: IntakeStorageMode): boolean {
  return isSqlPrimaryStorageMode(mode);
}

function logPersistenceFailure(
  operation: IntakeBriefPersistenceUnavailableError["operation"],
  mode: IntakeStorageMode,
  error: unknown,
): void {
  const message = error instanceof Error ? error.message : "unknown error";
  console.error("Intake brief persistence failure", { operation, mode, message });
}

export async function saveIntakeBrief(
  input: SaveIntakeBriefInput,
): Promise<SaveIntakeBriefOutcome> {
  const mode = getIntakeStorageMode();

  if (!isSqlStorageEnabled(mode)) {
    return { status: "skipped_legacy" };
  }

  try {
    return { status: "persisted", result: await getBriefStore().saveBrief(input) };
  } catch (error) {
    if (error instanceof IntakeBriefConversationNotFoundError) {
      throw error;
    }

    logPersistenceFailure("save_brief", mode, error);
    if (shouldFailClosed(mode)) {
      throw new IntakeBriefPersistenceUnavailableError("save_brief", mode);
    }
    return { status: "failed_open_dual" };
  }
}
