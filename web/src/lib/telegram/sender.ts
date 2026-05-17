import type {
  IntakeOutboundSender,
  IntakeOutboundSendResult,
} from "@/lib/intake/sender";
import type { IntakeOutboxMessage } from "@/lib/intake/persistence";

const TELEGRAM_CONVERSATION_PREFIX = "telegram:";
const TELEGRAM_DEFAULT_API_BASE_URL = "https://api.telegram.org";
const TELEGRAM_MAX_SEND_MESSAGE_TEXT_LENGTH = 4_096;

export type TelegramSenderConfig = {
  botToken?: string;
  apiBaseUrl?: string;
  liveSendingEnabled?: boolean;
};

export type TelegramWebhookRegistrationConfig = {
  webhookUrl?: string;
  webhookSecret?: string;
  registrationEnabled?: boolean;
};

export type TelegramSenderReadinessStatus =
  | { ok: true; apiBaseUrl: string }
  | {
      ok: false;
      reason: "disabled" | "missing_bot_token";
    };

export type TelegramWebhookRegistrationReadinessStatus =
  | { ok: true; webhookUrl: string }
  | {
      ok: false;
      reason: "disabled" | "missing_webhook_url" | "missing_webhook_secret";
    };

type TelegramSendMessageResponse = {
  ok?: unknown;
  result?: unknown;
};

type FetchLike = (
  input: string,
  init: {
    method: "POST";
    headers: { "content-type": "application/json" };
    body: string;
  },
) => Promise<Response>;

function isEnabled(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}

function normalizeApiBaseUrl(value: string | undefined): string {
  const trimmed = value?.trim();
  return (trimmed || TELEGRAM_DEFAULT_API_BASE_URL).replace(/\/+$/, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getTelegramMessageId(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null;
  }
  const result = payload.result;
  if (!isRecord(result)) {
    return null;
  }
  const messageId = result.message_id;
  if (typeof messageId === "string" || typeof messageId === "number") {
    return String(messageId);
  }
  return null;
}

function extractTelegramChatId(message: IntakeOutboxMessage): string | null {
  if (message.channel !== "telegram") {
    return null;
  }
  if (!message.conversationKey.startsWith(TELEGRAM_CONVERSATION_PREFIX)) {
    return null;
  }

  const chatId = message.conversationKey.slice(TELEGRAM_CONVERSATION_PREFIX.length).trim();
  return chatId || null;
}

function normalizeTelegramOutboundText(body: string): string | null {
  const text = body.trim().slice(0, TELEGRAM_MAX_SEND_MESSAGE_TEXT_LENGTH);
  return text || null;
}

async function readTelegramResponse(
  response: Response,
): Promise<TelegramSendMessageResponse | null> {
  try {
    const payload = (await response.json()) as unknown;
    return isRecord(payload) ? payload : null;
  } catch {
    return null;
  }
}

function fail(error: string, retryable: boolean): IntakeOutboundSendResult {
  return { ok: false, error, retryable };
}

export function getTelegramSenderConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): TelegramSenderConfig {
  return {
    botToken: env.TELEGRAM_BOT_TOKEN,
    apiBaseUrl: env.TELEGRAM_BOT_API_BASE_URL,
    liveSendingEnabled: isEnabled(env.TELEGRAM_LIVE_SENDS_ENABLED),
  };
}

export function getTelegramWebhookRegistrationConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): TelegramWebhookRegistrationConfig {
  return {
    webhookUrl: env.TELEGRAM_WEBHOOK_URL,
    webhookSecret: env.TELEGRAM_WEBHOOK_SECRET,
    registrationEnabled: isEnabled(env.TELEGRAM_WEBHOOK_REGISTRATION_ENABLED),
  };
}

export function getTelegramSenderReadinessStatus(
  config: TelegramSenderConfig,
): TelegramSenderReadinessStatus {
  if (!config.liveSendingEnabled) {
    return { ok: false, reason: "disabled" };
  }
  if (!config.botToken?.trim()) {
    return { ok: false, reason: "missing_bot_token" };
  }

  return {
    ok: true,
    apiBaseUrl: normalizeApiBaseUrl(config.apiBaseUrl),
  };
}

export function getTelegramWebhookRegistrationReadinessStatus(
  config: TelegramWebhookRegistrationConfig,
): TelegramWebhookRegistrationReadinessStatus {
  if (!config.registrationEnabled) {
    return { ok: false, reason: "disabled" };
  }
  if (!config.webhookUrl?.trim()) {
    return { ok: false, reason: "missing_webhook_url" };
  }
  if (!config.webhookSecret?.trim()) {
    return { ok: false, reason: "missing_webhook_secret" };
  }

  return {
    ok: true,
    webhookUrl: config.webhookUrl.trim(),
  };
}

export function createTelegramOutboundSender(
  config: TelegramSenderConfig = getTelegramSenderConfigFromEnv(),
  fetchImpl: FetchLike = fetch,
): IntakeOutboundSender {
  return {
    async send(message) {
      const status = getTelegramSenderReadinessStatus(config);
      if (!status.ok) {
        return fail(`telegram_sender_${status.reason}`, false);
      }

      const chatId = extractTelegramChatId(message);
      if (!chatId) {
        return fail("telegram_sender_invalid_chat", false);
      }

      const text = normalizeTelegramOutboundText(message.body);
      if (!text) {
        return fail("telegram_sender_missing_body", false);
      }

      try {
        const response = await fetchImpl(
          `${status.apiBaseUrl}/bot${config.botToken}/sendMessage`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text,
            }),
          },
        );

        const payload = await readTelegramResponse(response);
        const providerMessageId = getTelegramMessageId(payload);
        if (!response.ok || payload?.ok !== true || !providerMessageId) {
          return fail("telegram_send_failed", true);
        }

        return {
          ok: true,
          providerMessageId: `telegram:${providerMessageId}`,
        };
      } catch {
        return fail("telegram_send_failed", true);
      }
    },
  };
}
