import type { IntakeLocale, NormalizedIntakeMessage } from "@/lib/intake/types";

const MAX_TELEGRAM_TEXT_LENGTH = 1_500;

type TelegramUser = {
  id?: number | string;
  username?: string;
  first_name?: string;
  last_name?: string;
  language_code?: string;
};

type TelegramChat = {
  id?: number | string;
  type?: string;
};

type TelegramMessage = {
  message_id?: number | string;
  date?: number;
  text?: string;
  from?: TelegramUser;
  chat?: TelegramChat;
};

export type TelegramUpdate = {
  update_id?: number | string;
  message?: TelegramMessage;
};

export type TelegramDryRunUpdate = TelegramUpdate;

export type TelegramAdapterResult =
  | { ok: true; message: NormalizedIntakeMessage }
  | { ok: false; error: "invalid_update" | "missing_text" | "unsupported_update" };

export type TelegramUpdateNormalizationOptions = {
  requirePrivateChat?: boolean;
};

function normalizeTelegramLocale(languageCode: string | undefined): IntakeLocale {
  const normalized = languageCode?.trim().toLowerCase();
  if (!normalized) {
    return "unknown";
  }

  if (normalized.startsWith("ru")) {
    return "ru";
  }
  if (normalized.startsWith("fr")) {
    return "fr";
  }

  return "unknown";
}

function normalizeTelegramText(value: string): string {
  return value
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TELEGRAM_TEXT_LENGTH);
}

function buildTelegramClientName(user: TelegramUser | undefined): string | undefined {
  const displayName = [user?.first_name, user?.last_name]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
  const username = user?.username?.trim();

  if (displayName && username) {
    return `${displayName} (@${username})`;
  }
  return displayName || (username ? `@${username}` : undefined);
}

export function normalizeTelegramUpdate(
  update: TelegramUpdate,
  receivedAtUtc = new Date(),
  options: TelegramUpdateNormalizationOptions = {},
): TelegramAdapterResult {
  if (!update || typeof update !== "object") {
    return { ok: false, error: "invalid_update" };
  }

  const message = update.message;
  if (!message) {
    return { ok: false, error: "unsupported_update" };
  }

  if (options.requirePrivateChat && message.chat?.type !== "private") {
    return { ok: false, error: "unsupported_update" };
  }

  const text = typeof message.text === "string" ? normalizeTelegramText(message.text) : "";
  if (!text) {
    return { ok: false, error: "missing_text" };
  }

  const chatId = message.chat?.id;
  const senderId = message.from?.id ?? chatId;
  if (chatId === undefined || senderId === undefined) {
    return { ok: false, error: "invalid_update" };
  }

  const messageDate =
    typeof message.date === "number" && Number.isFinite(message.date)
      ? new Date(message.date * 1_000)
      : receivedAtUtc;

  const clientName = buildTelegramClientName(message.from);

  return {
    ok: true,
    message: {
      channel: "telegram",
      ...(update.update_id !== undefined ? { providerUpdateId: String(update.update_id) } : {}),
      ...(message.message_id !== undefined ? { providerMessageId: String(message.message_id) } : {}),
      conversationKey: `telegram:${String(chatId)}`,
      senderKey: `telegram:${String(senderId)}`,
      receivedAtUtc: messageDate.toISOString(),
      text,
      locale: normalizeTelegramLocale(message.from?.language_code),
      ...(clientName ? { clientName } : {}),
    },
  };
}

export function normalizeTelegramDryRunUpdate(
  update: TelegramDryRunUpdate,
  receivedAtUtc = new Date(),
): TelegramAdapterResult {
  return normalizeTelegramUpdate(update, receivedAtUtc);
}
