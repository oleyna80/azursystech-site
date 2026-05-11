export type AdminAuthConfig = {
  enabled: boolean;
  isProduction: boolean;
  sessionSecret: string;
  passwordHash: string | null;
  password: string | null;
  schedulerSecret: string | null;
  sessionTtlSeconds: number;
};

const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 8;

function readTrimmedEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function readBooleanEnv(name: string, defaultValue: boolean): boolean {
  const value = process.env[name]?.trim().toLowerCase();

  if (!value) {
    return defaultValue;
  }

  return ["1", "true", "yes", "on"].includes(value);
}

function readPositiveIntegerEnv(name: string, defaultValue: number): number {
  const value = process.env[name]?.trim();
  if (!value) {
    return defaultValue;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
}

export function getAdminAuthConfig(): AdminAuthConfig {
  const isProduction = process.env.NODE_ENV === "production";
  const enabled = readBooleanEnv("ADMIN_AUTH_ENABLED", true);
  const sessionSecret = readTrimmedEnv("ADMIN_SESSION_SECRET") ?? "";
  const passwordHash = readTrimmedEnv("ADMIN_PASSWORD_HASH");
  const password = readTrimmedEnv("ADMIN_PASSWORD");
  const schedulerSecret = readTrimmedEnv("ADMIN_SCHEDULER_SECRET");

  if (isProduction && !enabled) {
    throw new Error("admin_auth_disabled_in_production");
  }

  if (enabled && !sessionSecret) {
    throw new Error("admin_session_secret_missing");
  }

  if (enabled && !passwordHash && !password) {
    throw new Error("admin_password_missing");
  }

  if (enabled && isProduction && (!passwordHash || !passwordHash.startsWith("scrypt:"))) {
    throw new Error("admin_password_hash_invalid");
  }

  if (enabled && isProduction && sessionSecret.length < 32) {
    throw new Error("admin_session_secret_too_short");
  }

  if (enabled && isProduction && schedulerSecret && schedulerSecret.length < 32) {
    throw new Error("admin_scheduler_secret_too_short");
  }

  return {
    enabled,
    isProduction,
    sessionSecret,
    passwordHash,
    password,
    schedulerSecret,
    sessionTtlSeconds: readPositiveIntegerEnv(
      "ADMIN_SESSION_TTL_SECONDS",
      DEFAULT_SESSION_TTL_SECONDS,
    ),
  };
}

export function isAdminAuthConfigured(): boolean {
  try {
    getAdminAuthConfig();
    return true;
  } catch {
    return false;
  }
}
