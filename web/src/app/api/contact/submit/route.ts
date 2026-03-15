import { NextResponse } from "next/server";

import {
  type ContactSubmitApiResult,
  getSubmitFallbackMessage,
  validateAndBuildContactPayload,
} from "@/lib/contact-submit";

type IntegrationResult =
  | { kind: "success" }
  | { kind: "integration_not_ready" }
  | { kind: "submit_failed" };

function isFinalIntegrationContractReady(): boolean {
  // Provisional integration boundary:
  // final live contract for `site -> n8n -> HubSpot` is not fixed in SSOT yet.
  // Do not assume webhook URL/auth/property mapping until contract is approved.
  return false;
}

async function forwardToConfiguredIntegration(_payload: unknown): Promise<IntegrationResult> {
  if (!isFinalIntegrationContractReady()) {
    return { kind: "integration_not_ready" };
  }

  return { kind: "submit_failed" };
}

function jsonResult(statusCode: number, result: ContactSubmitApiResult) {
  return NextResponse.json(result, { status: statusCode });
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

  const integrationResult = await forwardToConfiguredIntegration(validated.payload);
  if (integrationResult.kind === "integration_not_ready") {
    return jsonResult(503, {
      status: "integration_not_ready",
      userMessage: getSubmitFallbackMessage(),
    });
  }

  if (integrationResult.kind === "submit_failed") {
    return jsonResult(502, {
      status: "submit_failed",
      userMessage: getSubmitFallbackMessage(),
    });
  }

  return jsonResult(200, {
    status: "success",
    userMessage: "Заявка отправлена.",
  });
}
