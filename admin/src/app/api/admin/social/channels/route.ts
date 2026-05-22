import { NextResponse } from "next/server";

import { readJsonWithLimit } from "@/lib/api-body";
import { requireAdminMutationRequest, requireAdminRequest } from "@/lib/auth/require-admin";
import { listSocialChannels, upsertSocialChannel } from "@/modules/social/repositories/social-repository";

const MAX_CHANNEL_POST_BODY_BYTES = 16_384;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function storageErrorResponse(): NextResponse {
  return NextResponse.json({ error: "social_storage_failed" }, { status: 503 });
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
    const channels = await listSocialChannels();
    return NextResponse.json({ channels });
  } catch {
    return storageErrorResponse();
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const auth = requireAdminMutationRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const parsed = await readJsonWithLimit<{
      displayName?: unknown;
      externalAccountId?: unknown;
      metadata?: unknown;
    }>(request, MAX_CHANNEL_POST_BODY_BYTES);

    if (!parsed.ok) {
      return invalidBodyResponse(parsed.reason);
    }

    const body = parsed.value;
    if (!isRecord(body)) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    if (typeof body.displayName !== "string" || typeof body.externalAccountId !== "string") {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const displayName = body.displayName.trim();
    const externalAccountId = body.externalAccountId.trim();

    if (!displayName || !externalAccountId) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const channel = await upsertSocialChannel({
      type: "facebook_page",
      displayName,
      externalAccountId,
      metadata:
        typeof body.metadata === "object" && body.metadata !== null ? (body.metadata as Record<string, unknown>) : {},
    });

    return NextResponse.json({ channel }, { status: 201 });
  } catch {
    return storageErrorResponse();
  }
}
