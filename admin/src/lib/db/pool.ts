import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";

let pool: Pool | null = null;
const DATABASE_SSL_MODES = ["disable", "require", "verify-full"] as const;
type DatabaseSslMode = (typeof DATABASE_SSL_MODES)[number];

export class AdminDbError extends Error {
  constructor(message = "admin_db_error") {
    super(message);
    this.name = "AdminDbError";
  }
}

function readPoolMax(): number {
  const parsed = Number.parseInt(process.env.ADMIN_DB_POOL_MAX ?? "2", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 2;
  }

  return Math.min(parsed, 2);
}

function readDatabaseSslMode(): DatabaseSslMode {
  const rawMode = process.env.DATABASE_SSL_MODE?.trim().toLowerCase();

  if (!rawMode) {
    return "disable";
  }

  if ((DATABASE_SSL_MODES as readonly string[]).includes(rawMode)) {
    return rawMode as DatabaseSslMode;
  }

  throw new AdminDbError("database_ssl_mode_invalid");
}

function readDatabaseSslConfig(): false | { rejectUnauthorized: boolean } {
  const sslMode = readDatabaseSslMode();

  if (sslMode === "disable") {
    return false;
  }

  if (sslMode === "require") {
    return { rejectUnauthorized: false };
  }

  return { rejectUnauthorized: true };
}

export function getAdminDbPool(): Pool {
  if (pool) {
    return pool;
  }

  if (!process.env.DATABASE_URL) {
    throw new AdminDbError("database_url_missing");
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: readDatabaseSslConfig(),
    max: readPoolMax(),
  });

  return pool;
}

export async function queryAdminDb<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: readonly unknown[] = [],
): Promise<QueryResult<T>> {
  try {
    return await getAdminDbPool().query<T>(text, [...values]);
  } catch {
    throw new AdminDbError();
  }
}

export async function withAdminDbClient<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  let client: PoolClient | null = null;

  try {
    client = await getAdminDbPool().connect();
    return await callback(client);
  } catch (error) {
    if (error instanceof AdminDbError) {
      throw error;
    }

    throw new AdminDbError();
  } finally {
    client?.release();
  }
}
