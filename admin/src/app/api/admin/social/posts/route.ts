import { NextResponse } from "next/server";

import { readJsonWithLimit } from "@/lib/api-body";
import { requireAdminMutationRequest, requireAdminRequest } from "@/lib/auth/require-admin";
import { createDraftPost, getPosts, SocialApplicationError } from "@/modules/social/application/posts";

const MAX_SOCIAL_POST_BODY_BYTES = 65_536;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function errorResponse(error: unknown): NextResponse {
  if (error instanceof SocialApplicationError) {
    const status = error.code === "social_storage_failed" ? 503 : error.code === "not_found" ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ error: "social_posts_failed" }, { status: 500 });
}

function invalidBodyResponse(reason: "too_large" | "unreadable"): NextResponse {
  return NextResponse.json(
    { error: reason === "too_large" ? "request_too_large" : "invalid_request" },
    { status: reason === "too_large" ? 413 : 400 },
  );
}

export async function GET(request: Request): Promise<NextResponse> {
  const auth = requireAdminRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const url = new URL(request.url);
    const posts = await getPosts({
      status: url.searchParams.get("status"),
      limit: Number.parseInt(url.searchParams.get("limit") ?? "50", 10),
    });

    return NextResponse.json({ posts });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const auth = requireAdminMutationRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const parsed = await readJsonWithLimit<{
      channelId?: unknown;
      content?: unknown;
      media?: unknown;
      locale?: unknown;
      metadata?: unknown;
    }>(request, MAX_SOCIAL_POST_BODY_BYTES);

    if (!parsed.ok) {
      return invalidBodyResponse(parsed.reason);
    }

    const body = parsed.value;
    if (!isRecord(body)) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    if (typeof body.channelId !== "string" || typeof body.content !== "string") {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const channelId = body.channelId.trim();

    if (!channelId) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const post = await createDraftPost({
      channelId,
      content: body.content,
      media: typeof body.media === "object" && body.media !== null ? (body.media as Record<string, unknown>) : null,
      locale: typeof body.locale === "string" ? body.locale : null,
      metadata:
        typeof body.metadata === "object" && body.metadata !== null ? (body.metadata as Record<string, unknown>) : {},
      createdBy: auth.actor,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
