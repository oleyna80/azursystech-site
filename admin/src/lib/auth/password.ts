import crypto from "node:crypto";
import { promisify } from "node:util";

import { getAdminAuthConfig } from "@/lib/auth/config";

const scryptAsync = promisify(crypto.scrypt);

function timingSafeEqualText(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

async function validateScryptPassword(candidate: string, storedHash: string): Promise<boolean> {
  const [, salt, expectedHash] = storedHash.split(":");

  if (!salt || !expectedHash) {
    return false;
  }

  const derivedKey = (await scryptAsync(candidate, salt, 64)) as Buffer;
  const expectedBuffer = Buffer.from(expectedHash, "hex");

  if (derivedKey.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(derivedKey, expectedBuffer);
}

export async function validateAdminPassword(candidate: string): Promise<boolean> {
  const config = getAdminAuthConfig();

  if (!config.enabled) {
    return true;
  }

  if (!candidate) {
    return false;
  }

  if (config.passwordHash) {
    return validateScryptPassword(candidate, config.passwordHash);
  }

  if (!config.password || config.isProduction) {
    return false;
  }

  return timingSafeEqualText(candidate, config.password);
}

export async function createScryptPasswordHash(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}
