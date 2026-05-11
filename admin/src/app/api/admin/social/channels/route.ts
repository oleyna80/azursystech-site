import { NextResponse } from "next/server";

import { requireAdminMutationRequest, requireAdminRequest } from "@/lib/auth/require-admin";
import { listSocialChannels, upsertSocialChannel } from "@/modules/social/repositories/social-repository";

function storageErrorResponse(): NextResponse {
  return NextResponse.json({ error: "social_storage_failed" }, { status: 503 });
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
    const body = (await request.json().catch(() => ({}))) as {
      displayName?: unknown;
      externalAccountId?: unknown;
      metadata?: unknown;
    };

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
