/** Safe authenticated profile returned by the backend. */
export interface UserProfile {
  /** Account UUID. */
  id: string;
  /** Normalized login phone number. */
  phoneNumber: string;
  /** Optional recovery email. */
  email: string | null;
  /** Optional user-facing name. */
  displayName: string | null;
  /** Current database-backed roles. */
  roles: string[];
  /** Permissions inherited from current roles. */
  permissions: string[];
}

/** Normalized subset of API error fields used by the browser client. */
export interface ApiErrorBody {
  /** HTTP status code returned by the backend. */
  statusCode?: number;
  /** Human-readable error or validation messages. */
  message?: string | string[];
  /** Optional trace identifier for support diagnostics. */
  correlationId?: string;
}

/** User-visible story lifecycle values mirrored from the backend contract. */
export type StoryStatus =
  | "Draft"
  | "Queued"
  | "Processing"
  | "Completed"
  | "Failed"
  | "Cancelled"
  | "Expired";

/** Story summary/detail shape consumed by the web application. */
export interface Story {
  /** Story aggregate UUID. */
  id: string;
  /** Owning account UUID. */
  userId: string;
  /** Display title. */
  title: string;
  /** Story topic slug. */
  topic: string;
  /** Story language code. */
  language: string;
  /** Child name used for personalization. */
  childName: string;
  /** Child age recorded at creation. */
  childAge: number;
  /** Requested story duration in minutes. */
  durationMinutes: number;
  /** Current story lifecycle state. */
  status: StoryStatus;
  /** Authenticated cover-image URL, when available. */
  coverImageUrl: string | null;
  /** Complete generated narrative, when available. */
  storyText: string | null;
  /** ISO creation timestamp. */
  createdAt: string;
  /** ISO latest-update timestamp. */
  updatedAt: string;
  /** ISO generation-completion timestamp, when completed. */
  completedAt: string | null;
  /** Optional personalized character metadata included by detail endpoints. */
  character?: { photoUrl: string };
}

/** Ordered story page and its optional generated media. */
export interface StoryPage {
  /** Page UUID. */
  id: string;
  /** Owning story UUID. */
  storyId: string;
  /** One-based page position. */
  pageNumber: number;
  /** Optional page heading. */
  pageTitle: string | null;
  /** Narrative page text. */
  pageText: string;
  /** Authenticated page-image URL, when available. */
  imageUrl: string | null;
  /** Authenticated narration URL, when available. */
  audioUrl: string | null;
  /** Media duration in whole seconds. */
  durationSeconds: number;
}

/** Downloadable story asset metadata. */
export interface StoryAsset {
  /** Asset UUID. */
  id: string;
  /** Backend media category. */
  assetType: string;
  /** Authenticated download URL. */
  publicUrl: string;
  /** Media content type. */
  mimeType: string;
  /** Byte size represented as a bigint-safe string. */
  fileSize: string;
  /** ISO metadata-creation timestamp. */
  createdAt: string;
}

/** Durable generation job summary. */
export interface StoryJob {
  /** Job UUID. */
  id: string;
  /** Generated story UUID. */
  storyId: string;
  /** Current operational job state. */
  status: string;
  /** Number of accepted dispatch attempts. */
  attemptCount: number;
  /** Latest transport/provider error, when any. */
  errorMessage: string | null;
  /** ISO job-creation timestamp. */
  createdAt: string;
}

/** Paginated story-list response. */
export interface StoryList {
  /** Story records for the requested page. */
  items: Story[];
  /** Page position, size, total records, and total pages. */
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** Active topic and language options returned by the story catalogs endpoint. */
export interface StoryCatalogs {
  /** Selectable topic definitions. */
  topics: Array<{ slug: string; displayName: string; description: string }>;
  /** Selectable language definitions and text direction metadata. */
  languages: Array<{
    code: string;
    displayName: string;
    nativeName: string;
    isRtl: boolean;
  }>;
}

/**
 * Rewrites a backend API asset path through the same-origin Next.js proxy.
 *
 * @param value Backend asset URL or `null`.
 * @returns Same-origin web URL, or `undefined` when absent.
 *
 * @example
 * assetUrl('/api/v1/storage/assets/id/download');
 * // '/api/storage/assets/id/download'
 */
export function assetUrl(value: string | null): string | undefined {
  if (!value) return undefined;
  return value.replace(/^\/api\/v1\//, "/api/");
}
