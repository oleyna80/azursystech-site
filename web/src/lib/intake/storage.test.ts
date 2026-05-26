import { afterEach, describe, expect, it, vi } from "vitest";

import type {
  PersistIntakeDecisionInput,
  PersistIntakeDecisionResult,
} from "@/lib/intake/persistence";
import type { IntakeStorageMode } from "@/lib/intake/config";

const persistedResult: PersistIntakeDecisionResult = {
  conversationKey: "telegram:1",
  idempotencyKey: "telegram:1:2",
  insertedMessage: true,
  duplicateProviderEvent: false,
  briefStatus: "collecting",
  adminNotificationStatus: "not_ready",
  sheetsMirrorStatus: "not_ready",
};

const persistInput = {
  message: {
    channel: "telegram",
    conversationKey: "telegram:1",
    senderKey: "telegram:2",
    receivedAtUtc: "2026-05-22T10:00:00.000Z",
    text: "hello",
    locale: "fr",
  },
  decision: {
    action: "ask_followup",
    idempotencyKey: "telegram:1:2",
    assistantReply: "Tell me more.",
    briefDraft: {
      preferredLanguage: "fr",
      missingFields: ["problem_statement"],
      contactCtaState: "not_offered",
      nextStep: "clarify",
    },
    safety: {
      deflectedCommitment: false,
      detectedContactInChat: false,
      detectedConfidentialInput: false,
      deflectedUnsafeRequest: false,
      duplicateProviderEvent: false,
      sanitizedForLogs: true,
    },
    rateLimit: {
      status: "deferred_to_channel_route",
      key: "telegram:1",
    },
  },
} satisfies PersistIntakeDecisionInput;

function mockStorageMode(mode: IntakeStorageMode): void {
  vi.doMock("@/lib/intake/config", () => ({
    getIntakeDatabasePool: vi.fn(() => ({})),
    getIntakeStorageMode: vi.fn(() => mode),
    isSqlPrimaryStorageMode: (value: IntakeStorageMode) => value === "sql_primary",
    isSqlStorageEnabled: (value: IntakeStorageMode) => value !== "legacy",
  }));
}

async function loadStorage(
  mode: IntakeStorageMode,
  persistDecision = vi.fn(async () => persistedResult),
) {
  vi.resetModules();
  mockStorageMode(mode);
  vi.doMock("@/lib/intake/sql-persistence", () => ({
    createSqlIntakePersistenceStore: vi.fn(() => ({
      loadConversationState: vi.fn(async () => null),
      persistDecision,
    })),
  }));

  const storage = await import("@/lib/intake/storage");
  return { storage, persistDecision };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  vi.doUnmock("@/lib/intake/config");
  vi.doUnmock("@/lib/intake/sql-persistence");
});

describe("intake storage", () => {
  it("returns an explicit legacy skip when SQL storage is disabled", async () => {
    const { storage, persistDecision } = await loadStorage("legacy");

    await expect(storage.persistIntakeDecision(persistInput)).resolves.toEqual({
      status: "skipped_legacy",
    });
    expect(persistDecision).not.toHaveBeenCalled();
  });

  it("returns an explicit persisted outcome when SQL persistence succeeds", async () => {
    const { storage } = await loadStorage("dual");

    await expect(storage.persistIntakeDecision(persistInput)).resolves.toEqual({
      status: "persisted",
      result: persistedResult,
    });
  });

  it("returns a visible failed-open outcome when dual persistence fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { storage } = await loadStorage(
      "dual",
      vi.fn(async () => {
        throw new Error("database unavailable");
      }),
    );

    await expect(storage.persistIntakeDecision(persistInput)).resolves.toEqual({
      status: "failed_open_dual",
    });
  });

  it("keeps sql_primary fail-closed on persistence failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { storage } = await loadStorage(
      "sql_primary",
      vi.fn(async () => {
        throw new Error("database unavailable");
      }),
    );

    await expect(storage.persistIntakeDecision(persistInput)).rejects.toMatchObject({
      name: "IntakePersistenceUnavailableError",
      operation: "persist_decision",
      mode: "sql_primary",
    });
  });
});
