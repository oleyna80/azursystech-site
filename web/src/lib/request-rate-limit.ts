import { createHash } from "node:crypto";
import { Pool } from "pg";

type IsRateLimitedPersistentInput = {
  scope: string;
  key: string;
  maxRequests: number;
  windowMs: number;
  maxMemoryKeys: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const DATABASE_SSL_MODES = ["disable", "require", "verify-full"] as const;
type DatabaseSslMode = (typeof DATABASE_SSL_MODES)[number];

const fallbackStore = new Map<string, RateLimitEntry>();
const DB_RETRY_BACKOFF_MS = 5_000;
let pool: Pool | null = null;
let schemaReady = false;
let schemaBootstrapPromise: Promise<void> | null = null;
let dbUnavailableUntil = 0;

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  return databaseUrl;
}

function getDatabaseSslMode(): DatabaseSslMode {
  const rawMode = process.env.DATABASE_SSL_MODE?.trim().toLowerCase();
  if (!rawMode) {
    return "disable";
  }

  if ((DATABASE_SSL_MODES as readonly string[]).includes(rawMode)) {
    return rawMode as DatabaseSslMode;
  }

  throw new Error(
    `Invalid DATABASE_SSL_MODE: "${rawMode}". Supported values: ${DATABASE_SSL_MODES.join(", ")}`,
  );
}

function getDatabaseSslConfig(): false | { rejectUnauthorized: boolean } {
  const sslMode = getDatabaseSslMode();

  if (sslMode === "disable") {
    return false;
  }

  if (sslMode === "require") {
    return { rejectUnauthorized: false };
  }

  return { rejectUnauthorized: true };
}

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
      ssl: getDatabaseSslConfig(),
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  return pool;
}

function hashKey(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function getWindowStart(nowMs: number, windowMs: number): Date {
  const safeWindowMs = Math.max(1, windowMs);
  const windowStartMs = Math.floor(nowMs / safeWindowMs) * safeWindowMs;
  return new Date(windowStartMs);
}

function cleanupFallbackStore(now: number) {
  for (const [storeKey, entry] of fallbackStore.entries()) {
    if (entry.resetAt <= now) {
      fallbackStore.delete(storeKey);
    }
  }
}

function enforceFallbackBound(maxMemoryKeys: number, now: number) {
  const safeMaxKeys = Math.max(1, maxMemoryKeys);
  if (fallbackStore.size <= safeMaxKeys) {
    return;
  }

  cleanupFallbackStore(now);
  if (fallbackStore.size <= safeMaxKeys) {
    return;
  }

  const entriesByResetAt = Array.from(fallbackStore.entries()).sort((a, b) => a[1].resetAt - b[1].resetAt);
  const itemsToDelete = fallbackStore.size - safeMaxKeys;

  for (let i = 0; i < itemsToDelete; i += 1) {
    const victim = entriesByResetAt[i]?.[0];
    if (victim) {
      fallbackStore.delete(victim);
    }
  }
}

function isRateLimitedInMemory(
  scope: string,
  hashedKey: string,
  maxRequests: number,
  windowMs: number,
  maxMemoryKeys: number,
): boolean {
  const now = Date.now();
  const safeMaxRequests = Math.max(1, maxRequests);
  const safeWindowMs = Math.max(1, windowMs);
  const storeKey = `${scope}:${hashedKey}`;
  const existing = fallbackStore.get(storeKey);

  if (!existing || existing.resetAt <= now) {
    fallbackStore.set(storeKey, {
      count: 1,
      resetAt: now + safeWindowMs,
    });
    enforceFallbackBound(maxMemoryKeys, now);
    return false;
  }

  if (existing.count >= safeMaxRequests) {
    return true;
  }

  existing.count += 1;
  fallbackStore.set(storeKey, existing);
  enforceFallbackBound(maxMemoryKeys, now);
  return false;
}

async function ensureRateLimitSchema(): Promise<void> {
  if (schemaReady) {
    return;
  }

  if (!schemaBootstrapPromise) {
    schemaBootstrapPromise = (async () => {
      const db = getPool();
      await db.query(`
        CREATE TABLE IF NOT EXISTS api_rate_limits (
          scope TEXT NOT NULL,
          key_hash TEXT NOT NULL,
          window_start TIMESTAMPTZ NOT NULL,
          hits INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (scope, key_hash, window_start)
        )
      `);
      schemaReady = true;
    })().finally(() => {
      schemaBootstrapPromise = null;
    });
  }

  await schemaBootstrapPromise;
}

function markDatabaseUnavailable(nowMs: number) {
  dbUnavailableUntil = nowMs + DB_RETRY_BACKOFF_MS;
}

async function incrementPersistentCounter(
  scope: string,
  hashedKey: string,
  windowStart: Date,
): Promise<number> {
  const db = getPool();
  const result = await db.query<{ hits: number }>(
    `
      INSERT INTO api_rate_limits (scope, key_hash, window_start, hits, created_at, updated_at)
      VALUES ($1, $2, $3, 1, NOW(), NOW())
      ON CONFLICT (scope, key_hash, window_start)
      DO UPDATE SET
        hits = api_rate_limits.hits + 1,
        updated_at = NOW()
      RETURNING hits
    `,
    [scope, hashedKey, windowStart.toISOString()],
  );

  return Number(result.rows[0]?.hits ?? 0);
}

async function cleanupExpiredRows(scope: string, windowMs: number) {
  if (Math.random() > 0.02) {
    return;
  }

  const db = getPool();
  const retentionMs = Math.max(windowMs * 5, 300_000);
  const cutoff = new Date(Date.now() - retentionMs).toISOString();
  await db.query(
    `
      DELETE FROM api_rate_limits
      WHERE scope = $1
        AND window_start < $2
    `,
    [scope, cutoff],
  );
}

export async function isRateLimitedPersistent({
  scope,
  key,
  maxRequests,
  windowMs,
  maxMemoryKeys,
}: IsRateLimitedPersistentInput): Promise<boolean> {
  const nowMs = Date.now();
  const hashedKey = hashKey(key || "unknown");
  const safeWindowMs = Math.max(1, windowMs);
  const safeMaxRequests = Math.max(1, maxRequests);

  if (nowMs < dbUnavailableUntil) {
    return isRateLimitedInMemory(scope, hashedKey, safeMaxRequests, safeWindowMs, maxMemoryKeys);
  }

  try {
    await ensureRateLimitSchema();
    const hits = await incrementPersistentCounter(scope, hashedKey, getWindowStart(nowMs, safeWindowMs));
    await cleanupExpiredRows(scope, safeWindowMs);
    return hits > safeMaxRequests;
  } catch {
    markDatabaseUnavailable(nowMs);
    console.error(`Persistent rate limit fallback enabled for scope=${scope}`);
    return isRateLimitedInMemory(scope, hashedKey, safeMaxRequests, safeWindowMs, maxMemoryKeys);
  }
}
