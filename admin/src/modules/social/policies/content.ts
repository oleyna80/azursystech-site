const MAX_FACEBOOK_POST_CONTENT_LENGTH = 5000;
const TOKEN_LIKE_PATTERN = /(EA[A-Za-z0-9_-]{20,}|access_token|client_secret|password)/i;

export type ContentValidationResult =
  | { ok: true; content: string }
  | { ok: false; error: "content_empty" | "content_too_long" | "content_contains_secret_like_text" };

export function validateSocialPostContent(content: string): ContentValidationResult {
  const normalized = content.trim();

  if (!normalized) {
    return { ok: false, error: "content_empty" };
  }

  if (normalized.length > MAX_FACEBOOK_POST_CONTENT_LENGTH) {
    return { ok: false, error: "content_too_long" };
  }

  if (TOKEN_LIKE_PATTERN.test(normalized)) {
    return { ok: false, error: "content_contains_secret_like_text" };
  }

  return { ok: true, content: normalized };
}
