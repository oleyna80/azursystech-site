import { describe, expect, it } from "vitest";

import { normalizeTelegramDryRunUpdate, normalizeTelegramUpdate } from "@/lib/telegram/intake-adapter";

describe("telegram intake adapter", () => {
  it("normalizes private Telegram messages into intake messages", () => {
    const receivedAt = new Date("2026-05-19T20:00:00.000Z");
    const result = normalizeTelegramUpdate(
      {
        update_id: 42,
        message: {
          message_id: 7,
          date: 1_777_055_000,
          text: "  hello\u200B   world  ",
          chat: { id: 123, type: "private" },
          from: {
            id: 456,
            first_name: "Jean",
            last_name: "Dupont",
            username: "jdupont",
            language_code: "fr-FR",
          },
        },
      },
      receivedAt,
      { requirePrivateChat: true },
    );

    expect(result).toEqual({
      ok: true,
      message: {
        channel: "telegram",
        providerUpdateId: "42",
        providerMessageId: "7",
        conversationKey: "telegram:123",
        senderKey: "telegram:456",
        receivedAtUtc: new Date(1_777_055_000_000).toISOString(),
        text: "hello world",
        locale: "fr",
        clientName: "Jean Dupont (@jdupont)",
      },
    });
  });

  it("rejects non-private chats when private chat is required", () => {
    expect(
      normalizeTelegramUpdate(
        {
          message: {
            text: "hello",
            chat: { id: 123, type: "group" },
            from: { id: 456 },
          },
        },
        new Date("2026-05-19T20:00:00.000Z"),
        { requirePrivateChat: true },
      ),
    ).toEqual({ ok: false, error: "unsupported_update" });
  });

  it("trims long dry-run text to the Telegram intake limit", () => {
    const result = normalizeTelegramDryRunUpdate({
      message: {
        text: ` ${"x".repeat(1_600)} `,
        chat: { id: "chat-1" },
        from: { id: "sender-1", language_code: "ru" },
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.message.text).toHaveLength(1_500);
      expect(result.message.locale).toBe("ru");
    }
  });

  it("reports missing text as an adapter error", () => {
    expect(
      normalizeTelegramUpdate({
        message: {
          chat: { id: 123, type: "private" },
          from: { id: 456 },
        },
      }),
    ).toEqual({ ok: false, error: "missing_text" });
  });
});
