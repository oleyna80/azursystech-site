import { NextResponse } from "next/server";

import { setCsrfCookie } from "@/lib/auth/csrf";
import { createAdminSessionToken, setAdminSessionCookie } from "@/lib/auth/session";
import { validateAdminPassword } from "@/lib/auth/password";
import { checkLoginRateLimit, clearLoginRateLimit, getLoginRateLimitKey } from "@/lib/auth/rate-limit";

function isFormRequest(request: Request): boolean {
  return request.headers.get("content-type")?.includes("application/x-www-form-urlencoded") ?? false;
}

function redirectResponse(request: Request, pathname: string): NextResponse {
  return NextResponse.redirect(new URL(pathname, request.url), { status: 303 });
}

export async function POST(request: Request): Promise<NextResponse> {
  let password = "";
  const rateLimitKey = getLoginRateLimitKey(request);
  const rateLimit = checkLoginRateLimit(rateLimitKey);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  try {
    if (isFormRequest(request)) {
      const formData = await request.formData();
      password = String(formData.get("password") ?? "");
    } else {
      const body = (await request.json().catch(() => ({}))) as { password?: unknown };
      password = typeof body.password === "string" ? body.password : "";
    }

    const valid = await validateAdminPassword(password);

    if (!valid) {
      if (isFormRequest(request)) {
        return redirectResponse(request, "/login?error=invalid");
      }

      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    const session = createAdminSessionToken();
    const response = isFormRequest(request)
      ? redirectResponse(request, "/")
      : NextResponse.json({ ok: true });

    clearLoginRateLimit(rateLimitKey);
    setAdminSessionCookie(response, session.token);
    setCsrfCookie(response, session.payload);

    return response;
  } catch {
    if (isFormRequest(request)) {
      return redirectResponse(request, "/login?error=not_configured");
    }

    return NextResponse.json({ error: "admin_auth_unavailable" }, { status: 503 });
  }
}
