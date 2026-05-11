export const SOCIAL_POST_STATUSES = [
  "draft",
  "scheduled",
  "publishing",
  "published",
  "failed",
] as const;

export type SocialPostStatus = (typeof SOCIAL_POST_STATUSES)[number];

export function isSocialPostStatus(value: string | null | undefined): value is SocialPostStatus {
  return SOCIAL_POST_STATUSES.includes(value as SocialPostStatus);
}

export function canSchedulePost(status: SocialPostStatus): boolean {
  return status === "draft" || status === "failed";
}

export function canPublishPost(status: SocialPostStatus): boolean {
  return status === "scheduled";
}
