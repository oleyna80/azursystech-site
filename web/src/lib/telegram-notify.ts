import type { ContactSubmitPayload } from "@/lib/contact-submit";

const DEFAULT_TELEGRAM_API_BASE_URL = "https://api.telegram.org";
const TELEGRAM_REQUEST_TIMEOUT_MS = 4_000;
const MAX_PROBLEM_SNIPPET_LENGTH = 180;

type TelegramConfig = {
  apiBaseUrl: string;
  botToken: string;
  chatId: string;
  threadId?: number;
};

type TelegramConfigResolution =
  | { kind: "disabled" }
  | { kind: "invalid"; error: "missing_credentials" | "invalid_api_base_url" | "invalid_thread_id" }
  | { kind: "ready"; config: TelegramConfig };

export type TelegramLeadNotificationInput = {
  requestId: string;
  leadId: string;
  payload: ContactSubmitPayload;
  integrationOutcome: string;
};

export type TelegramNotifyResult =
  | { status: "skipped"; reason: "disabled" }
  | { status: "sent"; messageId: number | null }
  | {
      status: "failed";
      error:
        | "missing_credentials"
        | "invalid_api_base_url"
        | "invalid_thread_id"
        | "timeout"
        | "http_error"
        | "invalid_response"
        | "api_error"
        | "network_error";
      httpStatus?: number;
      telegramErrorCode?: number;
    };

function resolveTelegramConfig(): TelegramConfigResolution {
  const enabled = process.env.AZURSYSTECH_TELEGRAM_NOTIFICATIONS_ENABLED?.trim() === "true";
  if (!enabled) {
    return { kind: "disabled" };
  }

  const botToken = process.env.AZURSYSTECH_TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.AZURSYSTECH_TELEGRAM_CHAT_ID?.trim();
  if (!botToken || !chatId) {
    return { kind: "invalid", error: "missing_credentials" };
  }

  const apiBaseUrlRaw = process.env.AZURSYSTECH_TELEGRAM_API_BASE_URL?.trim() || DEFAULT_TELEGRAM_API_BASE_URL;
  let parsedBaseUrl: URL;
  try {
    parsedBaseUrl = new URL(apiBaseUrlRaw);
  } catch {
    return { kind: "invalid", error: "invalid_api_base_url" };
  }

  const threadIdRaw = process.env.AZURSYSTECH_TELEGRAM_THREAD_ID?.trim();
  let threadId: number | undefined;
  if (threadIdRaw) {
    const parsedThreadId = Number.parseInt(threadIdRaw, 10);
    if (!Number.isInteger(parsedThreadId) || parsedThreadId <= 0) {
      return { kind: "invalid", error: "invalid_thread_id" };
    }
    threadId = parsedThreadId;
  }

  return {
    kind: "ready",
    config: {
      apiBaseUrl: parsedBaseUrl.toString(),
      botToken,
      chatId,
      ...(threadId ? { threadId } : {}),
    },
  };
}

function buildProblemSnippet(problemDescription: string): string {
  const normalized = problemDescription.replace(/\s+/g, " ").trim();
  if (normalized.length <= MAX_PROBLEM_SNIPPET_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, MAX_PROBLEM_SNIPPET_LENGTH - 1)}...`;
}

function buildLeadMessage(input: TelegramLeadNotificationInput): string {
  return [
    "AzurSysTech lead",
    `request_id: ${input.requestId}`,
    `lead_id: ${input.leadId}`,
    `source: ${input.payload.source}`,
    `segment: ${input.payload.segment}`,
    `service_type: ${input.payload.service_type}`,
    `name: ${input.payload.name}`,
    `phone: ${input.payload.phone}`,
    `city: ${input.payload.city}`,
    `problem: ${buildProblemSnippet(input.payload.problem_description)}`,
    `integration: ${input.integrationOutcome}`,
  ].join("\n");
}

export async function sendTelegramLeadNotification(
  input: TelegramLeadNotificationInput,
): Promise<TelegramNotifyResult> {
  const configResolution = resolveTelegramConfig();
  if (configResolution.kind === "disabled") {
    return { status: "skipped", reason: "disabled" };
  }

  if (configResolution.kind === "invalid") {
    return { status: "failed", error: configResolution.error };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TELEGRAM_REQUEST_TIMEOUT_MS);

  try {
    const endpointUrl = new URL(`/bot${configResolution.config.botToken}/sendMessage`, configResolution.config.apiBaseUrl);
    const response = await fetch(endpointUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: configResolution.config.chatId,
        text: buildLeadMessage(input),
        ...(configResolution.config.threadId ? { message_thread_id: configResolution.config.threadId } : {}),
      }),
      signal: controller.signal,
    });

    let responseBody: unknown = null;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = null;
    }

    if (!response.ok) {
      return { status: "failed", error: "http_error", httpStatus: response.status };
    }

    if (!responseBody || typeof responseBody !== "object") {
      return { status: "failed", error: "invalid_response" };
    }

    const parsedBody = responseBody as {
      ok?: unknown;
      error_code?: unknown;
      result?: { message_id?: unknown };
    };
    if (parsedBody.ok !== true) {
      return {
        status: "failed",
        error: "api_error",
        ...(typeof parsedBody.error_code === "number" ? { telegramErrorCode: parsedBody.error_code } : {}),
      };
    }

    const messageId =
      typeof parsedBody.result?.message_id === "number" ? parsedBody.result.message_id : null;
    return { status: "sent", messageId };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { status: "failed", error: "timeout" };
    }
    return { status: "failed", error: "network_error" };
  } finally {
    clearTimeout(timeout);
  }
}
