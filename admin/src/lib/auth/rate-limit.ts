type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, RateLimitEntry>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const MAX_RATE_LIMIT_KEYS = 5_000;

function nowMs(): number {
  return Date.now();
}

function cleanupExpired(now: number): void {
  for (const [key, entry] of attempts.entries()) {
    if (entry.resetAt <= now) {
      attempts.delete(key);
    }
  }
}

function trimOldestEntries(maxEntries: number): void {
  while (attempts.size > maxEntries) {
    const oldest = attempts.keys().next();

    if (oldest.done) {
      break;
    }

    attempts.delete(oldest.value);
  }
}

export type LoginRateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

function trustProxyHeaders(): boolean {
  return process.env.AZURSYSTECH_TRUST_PROXY_HEADERS?.trim().toLowerCase() === "true";
}

export function getLoginRateLimitKey(request: Request): string {
  if (trustProxyHeaders()) {
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const realIp = request.headers.get("x-real-ip")?.trim();
    if (forwardedFor) {
      return `ip:${forwardedFor}`;
    }
    if (realIp) {
      return `ip:${realIp}`;
    }
  }

  const userAgent = request.headers.get("user-agent")?.trim() || "unknown";
  const acceptLanguage = request.headers.get("accept-language")?.trim() || "unknown";
  return `request:${userAgent.slice(0, 120)}:${acceptLanguage.slice(0, 80)}`;
}

export function checkLoginRateLimit(key: string): LoginRateLimitResult {
  const now = nowMs();
  cleanupExpired(now);

  const entry = attempts.get(key);

  if (!entry || entry.resetAt <= now) {
    attempts.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    trimOldestEntries(MAX_RATE_LIMIT_KEYS);
    return { allowed: true };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  attempts.set(key, entry);
  return { allowed: true };
}

export function clearLoginRateLimit(key: string): void {
  attempts.delete(key);
}
