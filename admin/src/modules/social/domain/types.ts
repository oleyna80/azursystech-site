import type { SocialPostStatus } from "@/modules/social/domain/status";

export type SocialChannelType = "facebook_page";
export type SocialChannelStatus = "active" | "disabled";
export type SocialPublishJobStatus = "pending" | "running" | "succeeded" | "failed";

export type SocialChannel = {
  id: string;
  type: SocialChannelType;
  status: SocialChannelStatus;
  displayName: string;
  externalAccountId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type SocialPost = {
  id: string;
  channelId: string;
  status: SocialPostStatus;
  content: string;
  media: Record<string, unknown> | null;
  locale: string | null;
  scheduledAt: string | null;
  publishedAt: string | null;
  externalPostId: string | null;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
  metadata: Record<string, unknown>;
  createdBy: string | null;
  scheduledBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SocialEvent = {
  id: string;
  source: string;
  externalEventId: string | null;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type SocialPublishJob = {
  id: string;
  postId: string;
  idempotencyKey: string;
  status: SocialPublishJobStatus;
  attempts: number;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateDraftPostInput = {
  channelId: string;
  content: string;
  media?: Record<string, unknown> | null;
  locale?: string | null;
  createdBy?: string | null;
  metadata?: Record<string, unknown>;
};

export type SchedulePostInput = {
  postId: string;
  scheduledAt: Date;
  scheduledBy?: string | null;
};
