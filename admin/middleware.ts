import { NextResponse, type NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE_NAME = "azr_admin_session";
const SCHEDULER_HEADER_NAME = "x-admin-scheduler-secret";
const SCHEDULER_PATHS = new Set(["/api/admin/social/posts/publish-due"]);

function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname === "/health" ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  );
}

function isSchedulerCandidate(request: NextRequest, pathname: string): boolean {
  return SCHEDULER_PATHS.has(pathname) && Boolean(request.headers.get(SCHEDULER_HEADER_NAME));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (isSchedulerCandidate(request, pathname)) {
    return NextResponse.next();
  }

  const hasSessionCookie = Boolean(request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value);

  if (hasSessionCookie) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
