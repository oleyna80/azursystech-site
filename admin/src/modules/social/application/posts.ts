import { isSocialPostStatus, type SocialPostStatus } from "@/modules/social/domain/status";
import type { CreateDraftPostInput, SchedulePostInput, SocialPost } from "@/modules/social/domain/types";
import { validateSocialPostContent } from "@/modules/social/policies/content";
import {
  createDraftSocialPost,
  listDueScheduledPosts,
  listSocialPosts,
  scheduleSocialPost,
} from "@/modules/social/repositories/social-repository";

export class SocialApplicationError extends Error {
  constructor(
    public readonly code:
      | "invalid_content"
      | "invalid_status"
      | "invalid_schedule_time"
      | "not_found"
      | "social_storage_failed",
    message: string = code,
  ) {
    super(message);
    this.name = "SocialApplicationError";
  }
}

export async function createDraftPost(input: CreateDraftPostInput): Promise<SocialPost> {
  const contentValidation = validateSocialPostContent(input.content);

  if (!contentValidation.ok) {
    throw new SocialApplicationError("invalid_content", contentValidation.error);
  }

  try {
    return await createDraftSocialPost({
      ...input,
      content: contentValidation.content,
    });
  } catch {
    throw new SocialApplicationError("social_storage_failed");
  }
}

export async function schedulePost(input: Omit<SchedulePostInput, "scheduledAt"> & {
  scheduledAt: string;
}): Promise<SocialPost> {
  const scheduledAt = new Date(input.scheduledAt);

  if (Number.isNaN(scheduledAt.getTime())) {
    throw new SocialApplicationError("invalid_schedule_time");
  }

  try {
    return await scheduleSocialPost({
      ...input,
      scheduledAt,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "social_post_not_found") {
      throw new SocialApplicationError("not_found");
    }

    if (error instanceof Error && error.message.includes("status")) {
      throw new SocialApplicationError("invalid_status");
    }

    throw new SocialApplicationError("social_storage_failed");
  }
}

export async function getPosts(options: { status?: string | null; limit?: number } = {}): Promise<SocialPost[]> {
  const status = options.status;
  let postStatus: SocialPostStatus | undefined;

  if (status) {
    if (!isSocialPostStatus(status)) {
      throw new SocialApplicationError("invalid_status");
    }

    postStatus = status;
  }

  try {
    return await listSocialPosts({
      status: postStatus,
      limit: options.limit,
    });
  } catch {
    throw new SocialApplicationError("social_storage_failed");
  }
}

export async function getDuePosts(options: { limit?: number } = {}): Promise<SocialPost[]> {
  try {
    return await listDueScheduledPosts(options);
  } catch {
    throw new SocialApplicationError("social_storage_failed");
  }
}
