import { NextResponse } from "next/server";

import {
  buildBriefSubmissionPayload,
  type BriefSubmitApiResult,
  type BriefSubmitRequestBody,
  validateBriefValues,
} from "@/lib/brief-submit";

function jsonResult(statusCode: number, result: BriefSubmitApiResult) {
  return NextResponse.json(result, { status: statusCode });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toSafeBoolean(value: unknown): boolean {
  return typeof value === "boolean" ? value : false;
}

function toSafeNonNegativeInteger(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.trunc(value));
}

export async function POST(request: Request) {
  let body: BriefSubmitRequestBody;

  try {
    body = (await request.json()) as BriefSubmitRequestBody;
  } catch {
    return jsonResult(400, {
      success: false,
      message: "Не удалось прочитать данные brief. Проверьте заполнение и попробуйте ещё раз.",
      issues: [{ field: "form", message: "Некорректный формат JSON" }],
    });
  }

  if (!isPlainObject(body) || !isPlainObject(body.values)) {
    return jsonResult(400, {
      success: false,
      message: "Проверьте данные brief и попробуйте ещё раз.",
      issues: [{ field: "values", message: "Отсутствуют данные brief" }],
    });
  }

  const validated = validateBriefValues(body.values);
  if (validated.kind === "validation_error") {
    return jsonResult(400, {
      success: false,
      message: "Проверьте обязательные поля и попробуйте отправить brief снова.",
      issues: validated.issues,
    });
  }

  const payload = buildBriefSubmissionPayload(validated.values, {
    ai_assist_used: toSafeBoolean(body.ai_assist_used),
    assistant_interaction_count: toSafeNonNegativeInteger(body.assistant_interaction_count),
    created_at: new Date().toISOString(),
  });

  return jsonResult(200, {
    success: true,
    message: "Бриф принят. Данные готовы для review.",
    payload,
    handoff: payload.crm_handoff,
  });
}
