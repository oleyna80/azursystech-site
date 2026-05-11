import { NextResponse } from "next/server";

import { getAdminSessionFromRequest } from "@/lib/auth/session";

export async function GET(request: Request): Promise<NextResponse> {
  const session = getAdminSessionFromRequest(request);

  return NextResponse.json({
    authenticated: Boolean(session),
    expiresAt: session ? new Date(session.exp * 1000).toISOString() : null,
  });
}
