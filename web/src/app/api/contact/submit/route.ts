import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

import {
  type ContactSubmitPayload,
  type ContactSubmitApiResult,
  getContactSubmitRouteCopy,
  getSubmitFallbackMessage,
  resolveContactLocale,
  validateAndBuildContactPayload,
} from "@/lib/contact-submit";
import { LOCALE_COOKIE_KEY } from "@/i18n";
import {
  getIntakeStorageMode,
  isSqlStorageEnabled,
  persistLeadSubmission,
  recordLeadEvent,
} from "@/lib/intake-storage";
import { isRateLimitedPersistent } from "@/lib/request-rate-limit";
import { sendTelegramLeadNotification } from "@/lib/telegram-notify";

type IntegrationResult =
  | { kind: "success"; requestId: string }
  | { kind: "integration_not_ready" }
  | { kind: "submit_failed" };

type ContactSubmitIntegrationConfig = {
  enabled: boolean;
  baseUrl: string;
  token: string;
};

type UpstreamSuccessResponse = {
  status: "accepted";
  request_id: string;
};

type UpstreamFailureResponse = {
  status: "temporary_failure" | "rejected";
  message: string;
  request_id: string;
};

type IntegrationDispatchContext = {
  idempotencyKey: string;
};

type NotificationDispatchContext = {
  leadId: string | null;
  inserted: boolean;
  payload: ContactSubmitPayload;
  requestId: string;
  storageMode: string;
  integrationKind: "accepted" | "integration_not_ready" | "submit_failed";
};

const CONTRACT_VERSION = "1";
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_REQUEST_BODY_BYTES = 200_000;
const CONTACT_RATE_LIMIT_WINDOW_MS = 60_000;
const CONTACT_RATE_LIMIT_MAX = 10;
const CONTACT_RATE_LIMIT_MAX_KEYS = 10_000;

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRequestBodyTooLarge(request: Request): boolean {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) {
    return false;
  }

  const parsed = Number.parseInt(contentLength, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return false;
  }

  return parsed > MAX_REQUEST_BODY_BYTES;
}

function normalizeAllowedHosts(rawHosts: string | undefined): string[] {
  if (!rawHosts) {
    return [];
  }

  return rawHosts
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

function isWebhookBaseUrlAllowed(baseUrl: string): boolean {
  let parsed: URL;

  try {
    parsed = new URL(baseUrl);
  } catch {
    return false;
  }

  const isProd = process.env.NODE_ENV === "production";
  const protocol = parsed.protocol.toLowerCase();
  const hostname = parsed.hostname.toLowerCase();

  if (isProd && protocol !== "https:") {
    return false;
  }

  if (!isProd && protocol === "http:" && (hostname === "localhost" || hostname === "127.0.0.1")) {
    return true;
  }

  if (protocol !== "https:") {
    return false;
  }

  const allowedHosts = normalizeAllowedHosts(process.env.AZURSYSTECH_CONTACT_SUBMIT_ALLOWED_HOSTS);
  if (allowedHosts.length === 0) {
    return true;
  }

  return allowedHosts.includes(hostname);
}

function getIntegrationConfig(): ContactSubmitIntegrationConfig | null {
  const enabled = process.env.AZURSYSTECH_CONTACT_SUBMIT_ENABLED === "true";
  const baseUrl = process.env.AZURSYSTECH_CONTACT_SUBMIT_BASE_URL?.trim();
  const token = process.env.AZURSYSTECH_CONTACT_SUBMIT_TOKEN?.trim();
  const allowedHosts = normalizeAllowedHosts(process.env.AZURSYSTECH_CONTACT_SUBMIT_ALLOWED_HOSTS);
  const isProd = process.env.NODE_ENV === "production";

  if (!enabled || !baseUrl || !token) {
    return null;
  }

  if (isProd && allowedHosts.length === 0) {
    console.error(
      "Contact submit integration misconfigured: AZURSYSTECH_CONTACT_SUBMIT_ALLOWED_HOSTS must be non-empty in production",
    );
    return null;
  }

  if (!isWebhookBaseUrlAllowed(baseUrl)) {
    console.error("Contact submit integration misconfigured: invalid base URL");
    return null;
  }

  return { enabled, baseUrl, token };
}

function buildWebhookUrl(baseUrl: string): string {
  return new URL("/webhook/azursystech/contact-submit", baseUrl).toString();
}

function isUpstreamSuccessResponse(value: unknown): value is UpstreamSuccessResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return candidate.status === "accepted" && typeof candidate.request_id === "string";
}

function isUpstreamFailureResponse(value: unknown): value is UpstreamFailureResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const hasKnownStatus = candidate.status === "temporary_failure" || candidate.status === "rejected";
  return hasKnownStatus && typeof candidate.message === "string" && typeof candidate.request_id === "string";
}

async function forwardToConfiguredIntegration(
  payload: ContactSubmitPayload,
  dispatchContext: IntegrationDispatchContext,
): Promise<IntegrationResult> {
  const config = getIntegrationConfig();
  if (!config) {
    return { kind: "integration_not_ready" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(buildWebhookUrl(config.baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.token}`,
        "X-Contract-Version": CONTRACT_VERSION,
        "X-Idempotency-Key": dispatchContext.idempotencyKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    let responseBody: unknown = null;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = null;
    }

    if (response.status === 200 && isUpstreamSuccessResponse(responseBody)) {
      return { kind: "success", requestId: responseBody.request_id };
    }

    if (
      (response.status === 503 || response.status === 400 || response.status === 401 || response.status === 403 || response.status === 422) &&
      isUpstreamFailureResponse(responseBody)
    ) {
      return { kind: "submit_failed" };
    }

    return { kind: "submit_failed" };
  } catch {
    return { kind: "submit_failed" };
  } finally {
    clearTimeout(timeout);
  }
}

function jsonResult(statusCode: number, result: ContactSubmitApiResult) {
  return NextResponse.json(result, { status: statusCode });
}

async function safeRecordLeadEvent(
  leadId: string | null,
  eventType: string,
  eventPayload: Record<string, unknown>,
) {
  if (!leadId) {
    return;
  }

  try {
    await recordLeadEvent(leadId, eventType, eventPayload);
  } catch {
    console.error(`Lead event persistence failed: ${eventType}`);
  }
}

async function sendTelegramNotificationForNewLead(context: NotificationDispatchContext): Promise<void> {
  if (!context.leadId || !context.inserted) {
    return;
  }

  const telegramResult = await sendTelegramLeadNotification({
    requestId: context.requestId,
    leadId: context.leadId,
    payload: context.payload,
    integrationOutcome: context.integrationKind,
  });

  if (telegramResult.status === "skipped") {
    return;
  }

  if (telegramResult.status === "sent") {
    await safeRecordLeadEvent(context.leadId, "notification.telegram.sent", {
      request_id: context.requestId,
      storage_mode: context.storageMode,
      integration_kind: context.integrationKind,
      telegram_message_id: telegramResult.messageId,
    });
    return;
  }

  await safeRecordLeadEvent(context.leadId, "notification.telegram.failed", {
    request_id: context.requestId,
    storage_mode: context.storageMode,
    integration_kind: context.integrationKind,
    error: telegramResult.error,
    ...(typeof telegramResult.httpStatus === "number"
      ? { telegram_http_status: telegramResult.httpStatus }
      : {}),
    ...(typeof telegramResult.telegramErrorCode === "number"
      ? { telegram_error_code: telegramResult.telegramErrorCode }
      : {}),
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const fallbackLocale = resolveContactLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);
  const fallbackCopy = getContactSubmitRouteCopy(fallbackLocale);

  if (isRequestBodyTooLarge(request)) {
    return jsonResult(413, {
      status: "submit_failed",
      userMessage: fallbackCopy.tooLarge,
    });
  }

  const clientIp = getClientIp(request);
  const isRateLimited = await isRateLimitedPersistent({
    scope: "contact_submit",
    key: clientIp,
    maxRequests: CONTACT_RATE_LIMIT_MAX,
    windowMs: CONTACT_RATE_LIMIT_WINDOW_MS,
    maxMemoryKeys: CONTACT_RATE_LIMIT_MAX_KEYS,
  });
  if (isRateLimited) {
    return jsonResult(429, {
      status: "submit_failed",
      userMessage: fallbackCopy.rateLimited,
    });
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return jsonResult(400, {
      status: "validation_error",
      userMessage: fallbackCopy.unreadableForm,
      issues: [{ field: "form", message: fallbackCopy.unreadableFormIssue }],
    });
  }

  const requestLocale = resolveContactLocale(
    typeof formData.get("locale") === "string"
      ? (formData.get("locale") as string)
      : cookieStore.get(LOCALE_COOKIE_KEY)?.value,
  );
  const copy = getContactSubmitRouteCopy(requestLocale);
  const validated = validateAndBuildContactPayload(formData, requestLocale);

  if (validated.kind === "spam_detected") {
    return jsonResult(200, {
      status: "spam_detected",
      userMessage: copy.spamDetected,
    });
  }

  if (validated.kind === "validation_error") {
    return jsonResult(400, {
      status: "validation_error",
      userMessage: copy.validationFailed,
      issues: validated.issues,
    });
  }

  const intakeStorageMode = getIntakeStorageMode();
  const requestId = randomUUID();
  const idempotencyKey = randomUUID();
  const receivedAtUtc = new Date();
  const sqlStorageEnabled = isSqlStorageEnabled(intakeStorageMode);
  let leadId: string | null = null;
  let inserted = false;

  if (sqlStorageEnabled) {
    try {
      const persistedLead = await persistLeadSubmission({
        payload: validated.payload,
        requestId,
        idempotencyKey,
        receivedAtUtc,
      });
      leadId = persistedLead.leadId;
      inserted = persistedLead.inserted;
    } catch {
      console.error("Lead persistence failed");
      return jsonResult(502, {
        status: "submit_failed",
        userMessage: getSubmitFallbackMessage(requestLocale),
      });
    }
  }

  const integrationResult = await forwardToConfiguredIntegration(validated.payload, {
    idempotencyKey,
  });
  if (integrationResult.kind === "integration_not_ready") {
    await safeRecordLeadEvent(leadId, "integration.not_ready", {
      request_id: requestId,
      storage_mode: intakeStorageMode,
    });
    await sendTelegramNotificationForNewLead({
      leadId,
      inserted,
      payload: validated.payload,
      requestId,
      storageMode: intakeStorageMode,
      integrationKind: "integration_not_ready",
    });
    if (intakeStorageMode === "sql_primary") {
      return jsonResult(200, {
        status: "success",
        userMessage: copy.success,
      });
    }

    return jsonResult(503, {
      status: "integration_not_ready",
      userMessage: getSubmitFallbackMessage(requestLocale),
    });
  }

  if (integrationResult.kind === "submit_failed") {
    await safeRecordLeadEvent(leadId, "integration.submit_failed", {
      request_id: requestId,
      storage_mode: intakeStorageMode,
    });
    await sendTelegramNotificationForNewLead({
      leadId,
      inserted,
      payload: validated.payload,
      requestId,
      storageMode: intakeStorageMode,
      integrationKind: "submit_failed",
    });
    if (intakeStorageMode === "sql_primary") {
      return jsonResult(200, {
        status: "success",
        userMessage: copy.success,
      });
    }

    return jsonResult(502, {
      status: "submit_failed",
      userMessage: getSubmitFallbackMessage(requestLocale),
    });
  }

  await safeRecordLeadEvent(leadId, "integration.accepted", {
    request_id: requestId,
    upstream_request_id: integrationResult.requestId,
    storage_mode: intakeStorageMode,
  });
  await sendTelegramNotificationForNewLead({
    leadId,
    inserted,
    payload: validated.payload,
    requestId,
    storageMode: intakeStorageMode,
    integrationKind: "accepted",
  });

  return jsonResult(200, {
    status: "success",
    userMessage: copy.success,
  });
}
