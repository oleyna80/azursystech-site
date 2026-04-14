import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import {
  type ContactSubmitPayload,
  type ContactSubmitApiResult,
  getSubmitFallbackMessage,
  validateAndBuildContactPayload,
} from "@/lib/contact-submit";
import {
  getIntakeStorageMode,
  isSqlStorageEnabled,
  persistLeadSubmission,
  recordLeadEvent,
} from "@/lib/intake-storage";

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

const CONTRACT_VERSION = "1";
const REQUEST_TIMEOUT_MS = 10_000;

function getIntegrationConfig(): ContactSubmitIntegrationConfig | null {
  const enabled = process.env.AZURSYSTECH_CONTACT_SUBMIT_ENABLED === "true";
  const baseUrl = process.env.AZURSYSTECH_CONTACT_SUBMIT_BASE_URL?.trim();
  const token = process.env.AZURSYSTECH_CONTACT_SUBMIT_TOKEN?.trim();

  if (!enabled || !baseUrl || !token) {
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
  } catch (error) {
    console.error(`Failed to persist lead event "${eventType}"`, error);
  }
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return jsonResult(400, {
      status: "validation_error",
      userMessage: "Не удалось прочитать данные формы. Проверьте заполнение и попробуйте ещё раз.",
      issues: [{ field: "form", message: "Некорректный формат формы" }],
    });
  }

  const validated = validateAndBuildContactPayload(formData);

  if (validated.kind === "spam_detected") {
    return jsonResult(200, {
      status: "spam_detected",
      userMessage: "Заявка отклонена системой анти-спам. Используйте телефон, WhatsApp или email для связи.",
    });
  }

  if (validated.kind === "validation_error") {
    return jsonResult(400, {
      status: "validation_error",
      userMessage: "Проверьте обязательные поля и попробуйте отправить заявку снова.",
      issues: validated.issues,
    });
  }

  const intakeStorageMode = getIntakeStorageMode();
  const requestId = randomUUID();
  const idempotencyKey = randomUUID();
  const receivedAtUtc = new Date();
  const sqlStorageEnabled = isSqlStorageEnabled(intakeStorageMode);
  let leadId: string | null = null;

  if (sqlStorageEnabled) {
    try {
      const persistedLead = await persistLeadSubmission({
        payload: validated.payload,
        requestId,
        idempotencyKey,
        receivedAtUtc,
      });
      leadId = persistedLead.leadId;
    } catch (error) {
      console.error("Failed to persist intake lead in SQL", error);
      return jsonResult(502, {
        status: "submit_failed",
        userMessage: getSubmitFallbackMessage(),
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
    if (intakeStorageMode === "sql_primary") {
      return jsonResult(200, {
        status: "success",
        userMessage: "Заявка отправлена.",
      });
    }

    return jsonResult(503, {
      status: "integration_not_ready",
      userMessage: getSubmitFallbackMessage(),
    });
  }

  if (integrationResult.kind === "submit_failed") {
    await safeRecordLeadEvent(leadId, "integration.submit_failed", {
      request_id: requestId,
      storage_mode: intakeStorageMode,
    });
    if (intakeStorageMode === "sql_primary") {
      return jsonResult(200, {
        status: "success",
        userMessage: "Заявка отправлена.",
      });
    }

    return jsonResult(502, {
      status: "submit_failed",
      userMessage: getSubmitFallbackMessage(),
    });
  }

  await safeRecordLeadEvent(leadId, "integration.accepted", {
    request_id: requestId,
    upstream_request_id: integrationResult.requestId,
    storage_mode: intakeStorageMode,
  });

  return jsonResult(200, {
    status: "success",
    userMessage: "Заявка отправлена.",
  });
}
