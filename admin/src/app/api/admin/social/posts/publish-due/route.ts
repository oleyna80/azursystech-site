import { NextResponse } from "next/server";

import { requireAdminOrSchedulerRequest } from "@/lib/auth/require-admin";
import { getDuePosts, SocialApplicationError } from "@/modules/social/application/posts";

const PUBLISH_DUE_CONTRACT =
  "dry_run_only: this route lists due posts for scheduler/admin review and does not publish to external channels";

export async function POST(request: Request): Promise<NextResponse> {
  const auth = requireAdminOrSchedulerRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const url = new URL(request.url);
    const limit = Number.parseInt(url.searchParams.get("limit") ?? "10", 10);
    const duePosts = await getDuePosts({ limit });

    return NextResponse.json({
      ok: true,
      contract: PUBLISH_DUE_CONTRACT,
      dryRun: true,
      publishEnabled: false,
      actor: auth.actor,
      dueCount: duePosts.length,
      posts: duePosts,
    });
  } catch (error) {
    if (error instanceof SocialApplicationError && error.code === "social_storage_failed") {
      return NextResponse.json({ error: "social_storage_failed" }, { status: 503 });
    }

    return NextResponse.json({ error: "publish_due_failed" }, { status: 500 });
  }
}
