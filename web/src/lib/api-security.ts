const DEFAULT_ALLOWED_ORIGINS = [
  "https://azursystech.fr",
  "https://www.azursystech.fr",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];

type ReadBodyResult =
  | { ok: true; body: Uint8Array }
  | { ok: false; reason: "too_large" | "unreadable" };

export type ParsedBodyResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: "too_large" | "unreadable" };

function normalizeOrigin(origin: string): string | null {
  try {
    return new URL(origin).origin;
  } catch {
    return null;
  }
}

function getAllowedOrigins(): Set<string> {
  const raw = process.env.ALLOWED_ORIGINS?.trim();
  const origins = raw
    ? raw
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : DEFAULT_ALLOWED_ORIGINS;

  return new Set(
    origins
      .map((origin) => normalizeOrigin(origin))
      .filter((origin): origin is string => Boolean(origin)),
  );
}

export function isAllowedMutationOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const candidate = origin ? normalizeOrigin(origin) : referer ? normalizeOrigin(referer) : null;

  if (!candidate) {
    return process.env.NODE_ENV !== "production";
  }

  return getAllowedOrigins().has(candidate);
}

export function getRateLimitKey(request: Request): string {
  const trustProxyHeaders =
    process.env.AZURSYSTECH_TRUST_PROXY_HEADERS?.trim().toLowerCase() === "true";

  if (trustProxyHeaders) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const forwardedIp = forwardedFor?.split(",")[0]?.trim();
    const realIp = request.headers.get("x-real-ip")?.trim();

    if (forwardedIp) {
      return `ip:${forwardedIp}`;
    }

    if (realIp) {
      return `ip:${realIp}`;
    }
  }

  const userAgent = request.headers.get("user-agent")?.trim() || "unknown";
  const acceptLanguage = request.headers.get("accept-language")?.trim() || "unknown";
  return `request:${userAgent.slice(0, 120)}:${acceptLanguage.slice(0, 80)}`;
}

async function readBodyWithLimit(request: Request, maxBytes: number): Promise<ReadBodyResult> {
  if (!request.body) {
    return { ok: true, body: new Uint8Array() };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      receivedBytes += value.byteLength;
      if (receivedBytes > maxBytes) {
        await reader.cancel();
        return { ok: false, reason: "too_large" };
      }

      chunks.push(value);
    }
  } catch {
    return { ok: false, reason: "unreadable" };
  }

  const body = new Uint8Array(receivedBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { ok: true, body };
}

export async function readJsonWithLimit<T>(
  request: Request,
  maxBytes: number,
): Promise<ParsedBodyResult<T>> {
  const body = await readBodyWithLimit(request, maxBytes);
  if (!body.ok) {
    return body;
  }

  try {
    const text = new TextDecoder().decode(body.body);
    return { ok: true, value: JSON.parse(text) as T };
  } catch {
    return { ok: false, reason: "unreadable" };
  }
}

export async function readFormDataWithLimit(
  request: Request,
  maxBytes: number,
): Promise<ParsedBodyResult<FormData>> {
  const body = await readBodyWithLimit(request, maxBytes);
  if (!body.ok) {
    return body;
  }

  try {
    const bodyBuffer = body.body.buffer.slice(
      body.body.byteOffset,
      body.body.byteOffset + body.body.byteLength,
    ) as ArrayBuffer;
    const replayRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: bodyBuffer,
    });

    return { ok: true, value: await replayRequest.formData() };
  } catch {
    return { ok: false, reason: "unreadable" };
  }
}
