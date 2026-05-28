import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type {
  IntakeOutboxMessage,
  IntakeOutboxStore,
  OutboundMessageTransitionName,
  OutboundMessageTransitionResult,
} from "@/lib/intake/persistence";
import {
  createFakeIntakeOutboundSender,
  type IntakeOutboundSender,
  type IntakeOutboundSendResult,
} from "@/lib/intake/sender";

const mocks = vi.hoisted(() => ({
  createSqlIntakeOutboxStore: vi.fn(),
  getIntakeDatabasePool: vi.fn(() => ({})),
  getIntakeStorageMode: vi.fn(() => "sql_primary"),
  isSqlStorageEnabled: vi.fn(() => true),
}));

vi.mock("@/lib/intake/config", () => ({
  getIntakeDatabasePool: mocks.getIntakeDatabasePool,
  getIntakeStorageMode: mocks.getIntakeStorageMode,
  isSqlStorageEnabled: mocks.isSqlStorageEnabled,
}));

vi.mock("@/lib/intake/sql-persistence", () => ({
  createSqlIntakeOutboxStore: mocks.createSqlIntakeOutboxStore,
}));

function createOutboxMessage(
  overrides: Partial<IntakeOutboxMessage> = {},
): IntakeOutboxMessage {
  return {
    channel: "telegram",
    conversationKey: "telegram:123",
    senderKey: "telegram:123",
    messageId: "msg-1",
    conversationId: "conv-1",
    idempotencyKey: "idem-1",
    direction: "outbound",
    authorType: "assistant",
    status: "queued",
    body: "Hello from intake",
    createdAtUtc: "2026-05-19T20:00:00.000Z",
    approvedAtUtc: "2026-05-19T20:01:00.000Z",
    sentAtUtc: null,
    ...overrides,
  };
}

function createTransition(
  message: IntakeOutboxMessage,
  transition: OutboundMessageTransitionName,
): OutboundMessageTransitionResult {
  return {
    ok: true,
    transition,
    message,
  };
}

function createClaimMock(
  implementation?: IntakeOutboxStore["withQueuedOutboundMessageDispatchClaim"],
): IntakeOutboxStore["withQueuedOutboundMessageDispatchClaim"] {
  return vi.fn(
    implementation ??
      (async ({ messageId }, fn) => ({
        ok: true,
        result: await fn(createOutboxMessage({ messageId })),
      })),
  ) as unknown as IntakeOutboxStore["withQueuedOutboundMessageDispatchClaim"];
}

function createStore(
  overrides: Partial<IntakeOutboxStore> = {},
): IntakeOutboxStore {
  return {
    listPendingOutboundDrafts: vi.fn(async () => []),
    listQueuedOutboundMessages: vi.fn(async () => []),
    approveOutboundDraftMessage: vi.fn(async ({ messageId }) =>
      createTransition(createOutboxMessage({ messageId, status: "approved" }), "approved"),
    ),
    queueApprovedOutboundMessage: vi.fn(async ({ messageId }) =>
      createTransition(createOutboxMessage({ messageId, status: "queued" }), "queued"),
    ),
    markOutboundMessageSent: vi.fn(async ({ messageId, providerMessageId }) =>
      createTransition(
        createOutboxMessage({
          messageId,
          providerMessageId,
          status: "sent",
          sentAtUtc: "2026-05-19T20:02:00.000Z",
        }),
        "sent",
      ),
    ),
    markOutboundMessageFailed: vi.fn(async ({ messageId }) =>
      createTransition(createOutboxMessage({ messageId, status: "failed" }), "failed"),
    ),
    withQueuedOutboundMessageDispatchClaim: createClaimMock(),
    ...overrides,
  };
}

function createLifecycleStore(): IntakeOutboxStore {
  let message = createOutboxMessage({ status: "draft", approvedAtUtc: null });

  return createStore({
    listPendingOutboundDrafts: vi.fn(async () =>
      message.status === "draft" ? [message] : [],
    ),
    approveOutboundDraftMessage: vi.fn(async ({ messageId }) => {
      message = createOutboxMessage({
        ...message,
        messageId,
        status: "approved",
        approvedAtUtc: "2026-05-19T20:01:00.000Z",
      });
      return createTransition(message, "approved");
    }),
    queueApprovedOutboundMessage: vi.fn(async ({ messageId }) => {
      message = createOutboxMessage({
        ...message,
        messageId,
        status: "queued",
      });
      return createTransition(message, "queued");
    }),
    listQueuedOutboundMessages: vi.fn(async () =>
      message.status === "queued" ? [message] : [],
    ),
    markOutboundMessageSent: vi.fn(async ({ messageId, providerMessageId }) => {
      message = createOutboxMessage({
        ...message,
        messageId,
        providerMessageId,
        status: "sent",
        sentAtUtc: "2026-05-19T20:02:00.000Z",
      });
      return createTransition(message, "sent");
    }),
    markOutboundMessageFailed: vi.fn(async ({ messageId }) => {
      message = createOutboxMessage({
        ...message,
        messageId,
        status: "failed",
      });
      return createTransition(message, "failed");
    }),
    withQueuedOutboundMessageDispatchClaim: createClaimMock(async ({ messageId }, fn) => {
      if (message.messageId !== messageId || message.status !== "queued") {
        return { ok: false, reason: "not_found" };
      }

      return { ok: true, result: await fn(message) };
    }),
  });
}

async function importOutboxModule() {
  vi.resetModules();
  return import("@/lib/intake/outbox");
}

describe("dispatchQueuedOutboundMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getIntakeStorageMode.mockReturnValue("sql_primary");
    mocks.isSqlStorageEnabled.mockReturnValue(true);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not read queued messages or call the sender while live sending is disabled", async () => {
    const store = createStore({
      listQueuedOutboundMessages: vi.fn(async () => [createOutboxMessage()]),
    });
    const sender: IntakeOutboundSender = {
      send: vi.fn(async (): Promise<IntakeOutboundSendResult> => ({
        ok: true,
        providerMessageId: "fake:msg-1",
      })),
    };
    mocks.createSqlIntakeOutboxStore.mockReturnValue(store);

    const { dispatchQueuedOutboundMessages } = await importOutboxModule();

    await expect(
      dispatchQueuedOutboundMessages({ liveSendingEnabled: false, sender }),
    ).resolves.toEqual({
      ok: false,
      mode: "disabled",
      attempted: 0,
      results: [],
    });

    expect(mocks.createSqlIntakeOutboxStore).not.toHaveBeenCalled();
    expect(store.listQueuedOutboundMessages).not.toHaveBeenCalled();
    expect(sender.send).not.toHaveBeenCalled();
  });

  it("marks a queued Telegram outbox message as sent after a fake sender success", async () => {
    const message = createOutboxMessage();
    const store = createStore({
      listQueuedOutboundMessages: vi.fn(async () => [message]),
    });
    const sender: IntakeOutboundSender = {
      send: vi.fn(async (): Promise<IntakeOutboundSendResult> => ({
        ok: true,
        providerMessageId: "fake:msg-1",
      })),
    };
    mocks.createSqlIntakeOutboxStore.mockReturnValue(store);

    const { dispatchQueuedOutboundMessages } = await importOutboxModule();
    const result = await dispatchQueuedOutboundMessages({
      channel: "telegram",
      liveSendingEnabled: true,
      sender,
    });

    expect(result.ok).toBe(true);
    expect(result.mode).toBe("enabled");
    expect(result.attempted).toBe(1);
    expect(result.results).toEqual([
      {
        ok: true,
        messageId: "msg-1",
        providerMessageId: "fake:msg-1",
        transition: expect.objectContaining({
          ok: true,
          transition: "sent",
        }),
      },
    ]);
    expect(store.listQueuedOutboundMessages).toHaveBeenCalledWith({
      channel: "telegram",
    });
    expect(sender.send).toHaveBeenCalledWith(message);
    expect(store.markOutboundMessageSent).toHaveBeenCalledWith({
      messageId: "msg-1",
      providerMessageId: "fake:msg-1",
    });
    expect(store.markOutboundMessageFailed).not.toHaveBeenCalled();
  });

  it("marks a queued Telegram outbox message as failed after sender failure", async () => {
    const message = createOutboxMessage();
    const store = createStore({
      listQueuedOutboundMessages: vi.fn(async () => [message]),
    });
    const sender: IntakeOutboundSender = {
      send: vi.fn(async (): Promise<IntakeOutboundSendResult> => ({
        ok: false,
        error: "fake_sender_failure",
        retryable: true,
      })),
    };
    mocks.createSqlIntakeOutboxStore.mockReturnValue(store);

    const { dispatchQueuedOutboundMessages } = await importOutboxModule();
    const result = await dispatchQueuedOutboundMessages({
      channel: "telegram",
      liveSendingEnabled: true,
      sender,
    });

    expect(result.ok).toBe(true);
    expect(result.mode).toBe("enabled");
    expect(result.attempted).toBe(1);
    expect(result.results).toEqual([
      {
        ok: false,
        messageId: "msg-1",
        error: "fake_sender_failure",
        retryable: true,
        transition: expect.objectContaining({
          ok: true,
          transition: "failed",
        }),
      },
    ]);
    expect(sender.send).toHaveBeenCalledWith(message);
    expect(store.markOutboundMessageFailed).toHaveBeenCalledWith({
      messageId: "msg-1",
    });
    expect(store.markOutboundMessageSent).not.toHaveBeenCalled();
  });

  it("does not resend a queued message that already has a provider message id", async () => {
    const message = createOutboxMessage({ providerMessageId: "telegram:99" });
    const store = createStore({
      listQueuedOutboundMessages: vi.fn(async () => [message]),
    });
    const sender: IntakeOutboundSender = {
      send: vi.fn(async (): Promise<IntakeOutboundSendResult> => ({
        ok: true,
        providerMessageId: "fake:msg-1",
      })),
    };
    mocks.createSqlIntakeOutboxStore.mockReturnValue(store);

    const { dispatchQueuedOutboundMessages } = await importOutboxModule();
    await expect(
      dispatchQueuedOutboundMessages({
        channel: "telegram",
        liveSendingEnabled: true,
        sender,
      }),
    ).resolves.toEqual({
      ok: true,
      mode: "enabled",
      attempted: 0,
      results: [],
    });

    expect(sender.send).not.toHaveBeenCalled();
    expect(store.markOutboundMessageSent).not.toHaveBeenCalled();
    expect(store.markOutboundMessageFailed).not.toHaveBeenCalled();
  });

  it("does not send the same queued message twice while another dispatcher holds the claim", async () => {
    const message = createOutboxMessage();
    let locked = false;
    let firstSendStarted: (() => void) | undefined;
    const firstSendStartedPromise = new Promise<void>((resolve) => {
      firstSendStarted = resolve;
    });
    let releaseFirstSend: (() => void) | undefined;
    const releaseFirstSendPromise = new Promise<void>((resolve) => {
      releaseFirstSend = resolve;
    });

    const store = createStore({
      listQueuedOutboundMessages: vi.fn(async () => [message]),
      withQueuedOutboundMessageDispatchClaim: createClaimMock(async (_input, fn) => {
        if (locked) {
          return { ok: false, reason: "locked" };
        }

        locked = true;
        try {
          return { ok: true, result: await fn(message) };
        } finally {
          locked = false;
        }
      }),
    });
    const sender: IntakeOutboundSender = {
      send: vi.fn(async (): Promise<IntakeOutboundSendResult> => {
        firstSendStarted?.();
        await releaseFirstSendPromise;
        return {
          ok: true,
          providerMessageId: "fake:msg-1",
        };
      }),
    };
    mocks.createSqlIntakeOutboxStore.mockReturnValue(store);

    const { dispatchQueuedOutboundMessages } = await importOutboxModule();
    const firstDispatch = dispatchQueuedOutboundMessages({
      channel: "telegram",
      liveSendingEnabled: true,
      sender,
    });
    const secondDispatch = firstSendStartedPromise.then(() =>
      dispatchQueuedOutboundMessages({
        channel: "telegram",
        liveSendingEnabled: true,
        sender,
      }),
    );

    await firstSendStartedPromise;
    releaseFirstSend?.();
    const [firstResult, secondResult] = await Promise.all([
      firstDispatch,
      secondDispatch,
    ]);

    expect(firstResult).toEqual({
      ok: true,
      mode: "enabled",
      attempted: 1,
      results: [
        expect.objectContaining({
          ok: true,
          messageId: "msg-1",
          providerMessageId: "fake:msg-1",
        }),
      ],
    });
    expect(secondResult).toEqual({
      ok: true,
      mode: "enabled",
      attempted: 0,
      results: [],
    });
    expect(sender.send).toHaveBeenCalledTimes(1);
    expect(store.markOutboundMessageSent).toHaveBeenCalledTimes(1);
    expect(store.markOutboundMessageFailed).not.toHaveBeenCalled();
  });

  it("runs draft to approved to queued to fake sent without calling Telegram fetch", async () => {
    const fetchSpy = vi.fn();
    const store = createLifecycleStore();
    mocks.createSqlIntakeOutboxStore.mockReturnValue(store);
    vi.stubGlobal("fetch", fetchSpy);

    const {
      approveOutboundDraftMessage,
      dispatchQueuedOutboundMessages,
      listPendingOutboundDrafts,
      queueApprovedOutboundMessage,
    } = await importOutboxModule();

    await expect(listPendingOutboundDrafts({ channel: "telegram" })).resolves.toEqual([
      expect.objectContaining({
        messageId: "msg-1",
        status: "draft",
      }),
    ]);
    await expect(approveOutboundDraftMessage({ messageId: "msg-1" })).resolves.toEqual(
      expect.objectContaining({
        ok: true,
        transition: "approved",
      }),
    );
    await expect(queueApprovedOutboundMessage({ messageId: "msg-1" })).resolves.toEqual(
      expect.objectContaining({
        ok: true,
        transition: "queued",
      }),
    );

    const result = await dispatchQueuedOutboundMessages({
      channel: "telegram",
      liveSendingEnabled: true,
      sender: createFakeIntakeOutboundSender(),
    });

    expect(result).toEqual({
      ok: true,
      mode: "enabled",
      attempted: 1,
      results: [
        {
          ok: true,
          messageId: "msg-1",
          providerMessageId: "fake:msg-1",
          transition: expect.objectContaining({
            ok: true,
            transition: "sent",
            message: expect.objectContaining({
              status: "sent",
              providerMessageId: "fake:msg-1",
            }),
          }),
        },
      ],
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("runs draft to approved to queued to fake failed without calling Telegram fetch", async () => {
    const fetchSpy = vi.fn();
    const store = createLifecycleStore();
    mocks.createSqlIntakeOutboxStore.mockReturnValue(store);
    vi.stubGlobal("fetch", fetchSpy);

    const {
      approveOutboundDraftMessage,
      dispatchQueuedOutboundMessages,
      listPendingOutboundDrafts,
      queueApprovedOutboundMessage,
    } = await importOutboxModule();

    const [draft] = await listPendingOutboundDrafts({ channel: "telegram" });
    expect(draft).toEqual(
      expect.objectContaining({
        messageId: "msg-1",
        status: "draft",
      }),
    );
    await approveOutboundDraftMessage({ messageId: "msg-1" });
    await queueApprovedOutboundMessage({ messageId: "msg-1" });

    const result = await dispatchQueuedOutboundMessages({
      channel: "telegram",
      liveSendingEnabled: true,
      sender: createFakeIntakeOutboundSender({ fail: true }),
    });

    expect(result).toEqual({
      ok: true,
      mode: "enabled",
      attempted: 1,
      results: [
        {
          ok: false,
          messageId: "msg-1",
          error: "fake_sender_failure",
          retryable: true,
          transition: expect.objectContaining({
            ok: true,
            transition: "failed",
            message: expect.objectContaining({
              status: "failed",
            }),
          }),
        },
      ],
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
