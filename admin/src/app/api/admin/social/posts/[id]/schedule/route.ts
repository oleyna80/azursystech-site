import { NextResponse } from "next/server";

import { readJsonWithLimit } from "@/lib/api-body";
import { requireAdminMutationRequest } from "@/lib/auth/require-admin";
import { schedulePost, SocialApplicationError } from "@/modules/social/application/posts";

const MAX_SCHEDULE_POST_BODY_BYTES = 16_384;
const ISO_DATE_TIME_WITH_TIMEZONE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function errorResponse(error: unknown): NextResponse {
  if (error instanceof SocialApplicationError) {
    const status = error.code === "social_storage_failed" ? 503 : error.code === "not_found" ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ error: "social_schedule_failed" }, { status: 500 });
}

function invalidBodyResponse(reason: "too_large" | "unreadable"): NextResponse {
  return NextResponse.json(
    { error: reason === "too_large" ? "request_too_large" : "invalid_request" },
    { status: reason === "too_large" ? 413 : 400 },
  );
}

function isIsoDateTime(value: string): boolean {
  if (!ISO_DATE_TIME_WITH_TIMEZONE.test(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
}

export async function PATCH(request: Request, context: RouteContext): Promise<NextResponse> {
  const auth = requireAdminMutationRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    const parsed = await readJsonWithLimit<{ scheduledAt?: unknown }>(request, MAX_SCHEDULE_POST_BODY_BYTES);

    if (!parsed.ok) {
      return invalidBodyResponse(parsed.reason);
    }

    const body = parsed.value;
    const postId = id.trim();

    if (!postId || !isRecord(body) || typeof body.scheduledAt !== "string") {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const scheduledAt = body.scheduledAt.trim();

    if (!isIsoDateTime(scheduledAt)) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const post = await schedulePost({
      postId,
      scheduledAt,
      scheduledBy: auth.actor,
    });

    return NextResponse.json({ post });
  } catch (error) {
    return errorResponse(error);
  }
}
