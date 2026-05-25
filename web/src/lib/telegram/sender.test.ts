import { describe, expect, it } from "vitest";

import type { IntakeOutboxMessage } from "@/lib/intake/persistence";
import {
  createTelegramOutboundSender,
  getTelegramSenderReadinessStatus,
} from "@/lib/telegram/sender";

type TelegramFetch = NonNullable<Parameters<typeof createTelegramOutboundSender>[1]>;

function createOutboxMessage(overrides: Partial<IntakeOutboxMessage> = {}): IntakeOutboxMessage {
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
    body: "  Hello from intake  ",
    createdAtUtc: "2026-05-19T20:00:00.000Z",
    approvedAtUtc: "2026-05-19T20:01:00.000Z",
    sentAtUtc: null,
    ...overrides,
  };
}

describe("telegram sender", () => {
  it("reports readiness reasons before live sending", () => {
    expect(getTelegramSenderReadinessStatus({ liveSendingEnabled: false })).toEqual({
      ok: false,
      reason: "disabled",
    });
    expect(getTelegramSenderReadinessStatus({ liveSendingEnabled: true })).toEqual({
      ok: false,
      reason: "missing_bot_token",
    });
    expect(
      getTelegramSenderReadinessStatus({
        liveSendingEnabled: true,
        botToken: "token",
        apiBaseUrl: "https://telegram.example///",
      }),
    ).toEqual({
      ok: true,
      apiBaseUrl: "https://telegram.example",
    });
  });

  it("does not call fetch when sending is disabled", async () => {
    let called = false;
    const fetchImpl: TelegramFetch = async () => {
      called = true;
      return Response.json({ ok: true });
    };
    const sender = createTelegramOutboundSender({ liveSendingEnabled: false }, fetchImpl);

    await expect(sender.send(createOutboxMessage())).resolves.toEqual({
      ok: false,
      error: "telegram_sender_disabled",
      retryable: false,
    });
    expect(called).toBe(false);
  });

  it("sends Telegram messages with normalized chat id and text", async () => {
    const calls: Parameters<TelegramFetch>[] = [];
    const fetchImpl: TelegramFetch = async (input, init) => {
      calls.push([input, init]);
      return Response.json({ ok: true, result: { message_id: 99 } });
    };
    const sender = createTelegramOutboundSender(
      {
        liveSendingEnabled: true,
        botToken: "token",
        apiBaseUrl: "https://telegram.example/",
      },
      fetchImpl,
    );

    await expect(sender.send(createOutboxMessage())).resolves.toEqual({
      ok: true,
      providerMessageId: "telegram:99",
    });

    expect(calls).toEqual([
      [
        "https://telegram.example/bottoken/sendMessage",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: "123",
            text: "Hello from intake",
          }),
        },
      ],
    ]);
  });

  it("rejects invalid Telegram conversation keys without retry", async () => {
    let called = false;
    const fetchImpl: TelegramFetch = async () => {
      called = true;
      return Response.json({ ok: true });
    };
    const sender = createTelegramOutboundSender(
      {
        liveSendingEnabled: true,
        botToken: "token",
      },
      fetchImpl,
    );

    await expect(
      sender.send(createOutboxMessage({ conversationKey: "whatsapp:123" })),
    ).resolves.toEqual({
      ok: false,
      error: "telegram_sender_invalid_chat",
      retryable: false,
    });
    expect(called).toBe(false);
  });

  it("rejects empty message bodies without calling fetch", async () => {
    let called = false;
    const fetchImpl: TelegramFetch = async () => {
      called = true;
      return Response.json({ ok: true });
    };
    const sender = createTelegramOutboundSender(
      {
        liveSendingEnabled: true,
        botToken: "token",
      },
      fetchImpl,
    );

    await expect(sender.send(createOutboxMessage({ body: "   " }))).resolves.toEqual({
      ok: false,
      error: "telegram_sender_missing_body",
      retryable: false,
    });
    expect(called).toBe(false);
  });

  it("returns a retryable failure when Telegram HTTP or API status fails", async () => {
    const fetchImpl: TelegramFetch = async () =>
      Response.json({ ok: false, description: "retry later" }, { status: 429 });
    const sender = createTelegramOutboundSender(
      {
        liveSendingEnabled: true,
        botToken: "token",
      },
      fetchImpl,
    );

    await expect(sender.send(createOutboxMessage())).resolves.toEqual({
      ok: false,
      error: "telegram_send_failed",
      retryable: true,
    });
  });

  it("treats a missing Telegram provider message id as a retryable failure", async () => {
    const fetchImpl: TelegramFetch = async () => Response.json({ ok: true, result: {} });
    const sender = createTelegramOutboundSender(
      {
        liveSendingEnabled: true,
        botToken: "token",
      },
      fetchImpl,
    );

    await expect(sender.send(createOutboxMessage())).resolves.toEqual({
      ok: false,
      error: "telegram_send_failed",
      retryable: true,
    });
  });
});
