import { Pool } from "pg";

const INTAKE_STORAGE_MODES = ["legacy", "dual", "sql_primary"] as const;
const DATABASE_SSL_MODES = ["disable", "require", "verify-full"] as const;

export type IntakeStorageMode = (typeof INTAKE_STORAGE_MODES)[number];
export type DatabaseSslMode = (typeof DATABASE_SSL_MODES)[number];

let pool: Pool | null = null;

function isIntakeStorageMode(value: string): value is IntakeStorageMode {
  return (INTAKE_STORAGE_MODES as readonly string[]).includes(value);
}

export function getIntakeStorageMode(): IntakeStorageMode {
  const rawMode = process.env.INTAKE_STORAGE_MODE?.trim().toLowerCase();
  if (!rawMode || !isIntakeStorageMode(rawMode)) {
    return "legacy";
  }

  return rawMode;
}

export function isLegacyStorageMode(mode = getIntakeStorageMode()): boolean {
  return mode === "legacy";
}

export function isDualStorageMode(mode = getIntakeStorageMode()): boolean {
  return mode === "dual";
}

export function isSqlPrimaryStorageMode(mode = getIntakeStorageMode()): boolean {
  return mode === "sql_primary";
}

export function isSqlStorageEnabled(mode = getIntakeStorageMode()): boolean {
  return !isLegacyStorageMode(mode);
}

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required when INTAKE_STORAGE_MODE is not legacy");
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

export function getIntakeDatabasePool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
      ssl: getDatabaseSslConfig(),
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  return pool;
}

export async function closeIntakeDatabasePoolForTests(): Promise<void> {
  if (!pool) {
    return;
  }

  const currentPool = pool;
  pool = null;
  await currentPool.end();
}
