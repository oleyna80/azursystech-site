import { NextResponse } from "next/server";

import { requireAdminMutationRequest } from "@/lib/auth/require-admin";
import { schedulePost, SocialApplicationError } from "@/modules/social/application/posts";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function errorResponse(error: unknown): NextResponse {
  if (error instanceof SocialApplicationError) {
    const status = error.code === "social_storage_failed" ? 503 : error.code === "not_found" ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ error: "social_schedule_failed" }, { status: 500 });
}

export async function PATCH(request: Request, context: RouteContext): Promise<NextResponse> {
  const auth = requireAdminMutationRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as { scheduledAt?: unknown };
    const postId = id.trim();

    if (!postId || typeof body.scheduledAt !== "string") {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const post = await schedulePost({
      postId,
      scheduledAt: body.scheduledAt,
      scheduledBy: auth.actor,
    });

    return NextResponse.json({ post });
  } catch (error) {
    return errorResponse(error);
  }
}
