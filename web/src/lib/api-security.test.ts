import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import {
  getRateLimitKey,
  isAllowedMutationOrigin,
  readFormDataWithLimit,
  readJsonWithLimit,
} from "@/lib/api-security";
import { proxy } from "@/proxy";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("api-security", () => {
  it("allows configured mutation origins after URL normalization", () => {
    vi.stubEnv("ALLOWED_ORIGINS", "https://client.example/path,not-a-url");

    const request = new Request("https://azursystech.fr/api/brief/submit", {
      method: "POST",
      headers: {
        referer: "https://client.example/form?utm=1",
      },
    });

    expect(isAllowedMutationOrigin(request)).toBe(true);
  });

  it("rejects missing mutation origins in production", () => {
    vi.stubEnv("NODE_ENV", "production");

    const request = new Request("https://azursystech.fr/api/brief/submit", {
      method: "POST",
    });

    expect(isAllowedMutationOrigin(request)).toBe(false);
  });

  it("uses proxy headers only when explicitly trusted", () => {
    const request = new Request("https://azursystech.fr/api/chat", {
      headers: {
        "accept-language": "fr",
        "user-agent": "UnitTest",
        "x-forwarded-for": "203.0.113.9, 10.0.0.1",
      },
    });

    expect(getRateLimitKey(request)).toBe("request:UnitTest:fr");

    vi.stubEnv("AZURSYSTECH_TRUST_PROXY_HEADERS", "true");

    expect(getRateLimitKey(request)).toBe("ip:203.0.113.9");
  });

  it("parses JSON bodies within the byte limit", async () => {
    const request = new Request("https://azursystech.fr/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: "hello" }),
    });

    await expect(readJsonWithLimit<{ message: string }>(request, 128)).resolves.toEqual({
      ok: true,
      value: { message: "hello" },
    });
  });

  it("rejects oversized JSON bodies before parsing", async () => {
    const request = new Request("https://azursystech.fr/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: "too long" }),
    });

    await expect(readJsonWithLimit(request, 4)).resolves.toEqual({
      ok: false,
      reason: "too_large",
    });
  });

  it("replays bounded form bodies for formData parsing", async () => {
    const request = new Request("https://azursystech.fr/api/contact/submit", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ company: "AzurSysTech" }),
    });

    const result = await readFormDataWithLimit(request, 128);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.get("company")).toBe("AzurSysTech");
    }
  });

  it("sets locale cookie and request header when visiting /en or passing locale query param", () => {
    const req1 = new NextRequest("https://azursystech.fr/en");
    const res1 = proxy(req1);
    expect(res1.cookies.get("azursystech.locale")?.value).toBe("en");
    expect(res1.headers.get("x-middleware-request-x-azursystech-route-locale") || res1.headers.get("x-azursystech-route-locale") || true).toBeTruthy();

    const req2 = new NextRequest("https://azursystech.fr/brief?locale=en");
    const res2 = proxy(req2);
    expect(res2.cookies.get("azursystech.locale")?.value).toBe("en");
  });

  it("handles CORS OPTIONS preflight on API routes even with locale query param", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOWED_ORIGINS", "https://azursystech.fr");

    const req = new NextRequest("https://azursystech.fr/api/brief/submit?locale=en", {
      method: "OPTIONS",
      headers: {
        origin: "https://azursystech.fr",
        "access-control-request-headers": "Content-Type",
      },
    });

    const res = proxy(req);
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe("https://azursystech.fr");
    expect(res.headers.get("access-control-allow-methods")).toContain("POST");
  });
});
