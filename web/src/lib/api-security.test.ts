import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getRateLimitKey,
  isAllowedMutationOrigin,
  readFormDataWithLimit,
  readJsonWithLimit,
} from "@/lib/api-security";

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
});
