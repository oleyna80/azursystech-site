import { NextResponse } from "next/server";

import { clearCsrfCookie, isValidCsrfToken } from "@/lib/auth/csrf";
import { requireAdminRequest } from "@/lib/auth/require-admin";
import { clearAdminSessionCookie } from "@/lib/auth/session";

function redirectResponse(request: Request): NextResponse {
  return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
}

function clearCookies(response: NextResponse): NextResponse {
  clearAdminSessionCookie(response);
  clearCsrfCookie(response);
  return response;
}

export async function POST(request: Request): Promise<NextResponse> {
  const auth = requireAdminRequest(request);

  if (!auth.ok) {
    return auth.response;
  }

  const formData = await request.formData().catch(() => null);
  const csrfToken = formData ? String(formData.get("csrfToken") ?? "") : request.headers.get("x-csrf-token");

  if (!isValidCsrfToken(csrfToken, auth.session)) {
    return NextResponse.json({ error: "csrf_failed" }, { status: 403 });
  }

  const acceptsHtml = request.headers.get("accept")?.includes("text/html") ?? false;
  const response = acceptsHtml ? redirectResponse(request) : NextResponse.json({ ok: true });
  return clearCookies(response);
}
