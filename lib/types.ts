/**
 * @file types.ts
 * @description Defines hand-written frontend domain and API response types that mirror backend payloads.
 */

/** Supported story lengths. */
export type StoryLength = "SHORT" | "MEDIUM" | "LONG";
/** Supported narration voices. */
export type NarratorVoice = "MARYAM" | "BABAK" | "NAZANIN";
/** Supported generated illustration styles. */
export type IllustrationStyle = "WATERCOLOR" | "CLASSIC" | "PAPERCUT";
/** Supported story tones. */
export type StoryTone = "CALM" | "FUNNY" | "BRAVE";
/** Story lifecycle states returned by parent and administrator endpoints. */
export type StoryStatus =
  "DRAFT" | "AWAITING_PAYMENT" | "GENERATING" | "READY" | "FAILED";
/** Moral topics accepted by the story wizard. */
export type StoryTheme =
  | "HONESTY"
  | "KINDNESS"
  | "COURAGE"
  | "SHARING"
  | "TEAMWORK"
  | "RESPONSIBILITY"
  | "PATIENCE"
  | "RESPECT"
  | "OWN";

/** Parent-facing child-profile response. */
export interface ChildDto {
  id: string;
  firstName: string;
  age: number;
  interests: string[];
  hasPhoto: boolean;
  photoStatus: "NONE" | "PENDING" | "READY" | "FLAGGED" | "DELETED";
  prefLength: StoryLength;
  prefVoice: NarratorVoice;
  prefStyle: IllustrationStyle;
  prefAvoidScary: boolean;
  storyCount: number;
  createdAt: string;
}

/** A relative or supporting character saved for reuse in one child's stories. */
export interface ChildRelationDto {
  id: string;
  childId: string;
  name: string;
  relation: string;
  hasPhoto: boolean;
  createdAt: string;
}

/** Parent-facing story summary without internal prompts or storage keys. */
export interface StoryDto {
  id: string;
  title: string | null;
  childId: string;
  childName: string | null;
  theme: StoryTheme;
  length: StoryLength;
  pageCount: number;
  tone: StoryTone;
  style: IllustrationStyle;
  voice: NarratorVoice;
  topic: string;
  storyConsiderations: string;
  mode: string;
  artStyle: string;
  desiredMoral: string | null;
  nScenes: number;
  ageRange: string;
  additionalCharacters: {
    slot: number;
    name: string;
    relation: string;
    hasPhoto: boolean;
  }[];
  status: StoryStatus;
  durationSec: number | null;
  isFavorite: boolean;
  readCount: number;
  lastReadPage: number;
  lastReadAt: string | null;
  failureReason: string | null;
  createdAt: string;
  readyAt: string | null;
}

/** Payment order lifecycle states. */
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUND_PENDING"
  | "REFUNDED";

/** Persisted stages in the generation pipeline. */
export type JobStage =
  "CHARACTER" | "WRITING" | "ILLUSTRATION" | "NARRATION" | "BINDING";

/** Execution states for one generation stage. */
export type JobStatus = "QUEUED" | "RUNNING" | "DONE" | "FAILED";

/** Parent-facing payment order, optionally enriched with story summary fields. */
export interface OrderDto {
  id: string;
  storyId: string;
  /** ریال — render with faPrice, which converts to تومان. */
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentRef: string | null;
  paidAt: string | null;
  createdAt: string;
  storyTitle?: string | null;
  storyStatus?: StoryStatus | null;
}

/** GET /orders — صورت‌حساب, the parent's own transaction history. */
export interface TransactionsDto {
  items: OrderDto[];
  summary: { paidCount: number; paidTotal: number };
}

/** One row of the admin پرداخت‌ها table. */
export interface AdminPaymentDto {
  id: string;
  storyId: string;
  storyTitle: string | null;
  storyStatus: StoryStatus | null;
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentRef: string | null;
  paidAt: string | null;
  createdAt: string;
  user: { id: string; fullName: string; phone: string | null } | null;
}

/** Administrator transaction detail including callback audit events. */
export interface AdminPaymentDetailDto extends AdminPaymentDto {
  childName: string | null;
  failureReason: string | null;
  events: { id: string; event: string; ip: string | null; createdAt: string }[];
}

/** Paginated administrator payment response. */
export interface AdminPaymentsPageDto {
  total: number;
  page: number;
  pageCount: number;
  items: AdminPaymentDto[];
}

/** The four cards above the payments table, month to date. */
export interface AdminPaymentStatsDto {
  from: string | null;
  revenue: number;
  paidCount: number;
  failedCount: number;
  /** Failed as a share of what the bank actually ruled on. */
  failureRate: number;
  cancelledCount: number;
  pendingCount: number;
  pendingAmount: number;
}

/** GET /admin/orders — the سفارش‌ها lifecycle overview. */
export interface AdminOrdersOverviewDto {
  orderTotal: number;
  statuses: Record<OrderStatus, { count: number; amount: number }>;
  stories: Record<StoryStatus, number>;
  conversion: number;
  needsAction: {
    stalePending: number;
    recentFailed: number;
    paidButFailed: number;
  };
}

/** POST /stories — the wizard's final step returns the story and its payment link. */
export interface CreatedStory {
  story: StoryDto;
  order: OrderDto;
  payUrl: string;
}

/** Reader-visible generated story page. */
export interface StoryPageDto {
  index: number;
  text: string;
}

/** Polling response used by the five-stage generating screen. */
export interface StoryProgressDto {
  status: StoryStatus;
  failureReason: string | null;
  orderId: string | null;
  percent: number;
  stages: { stage: JobStage; status: JobStatus; error: string | null }[];
}

/** Parent-facing notification row. */
export interface NotificationDto {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

/** Safe active-session metadata shown in account security settings. */
export interface SessionDto {
  id: string;
  device: string | null;
  ip: string | null;
  createdAt: string;
  current: boolean;
}

/** Complete notification-preference shape returned by the account endpoint. */
export interface NotificationPrefs {
  notifyStoryReady: boolean;
  notifyPayment: boolean;
  notifyProductNews: boolean;
}

/* ——— the admin panel ——————————————————————————————————————————— */

/** Account access states shown in administrator views. */
export type UserStatus = "ACTIVE" | "SUSPENDED";
/** Child-photo storage and moderation states. */
export type PhotoStatus = "NONE" | "PENDING" | "READY" | "FLAGGED" | "DELETED";
/** Domain object under moderation review. */
export type ModerationTarget = "STORY" | "CHILD_PHOTO";
/** Human-review lifecycle state. */
export type ModerationStatus = "PENDING" | "APPROVED" | "REJECTED";
/** Time windows supported by administrator metrics. */
export type AdminRange = "24h" | "7d" | "30d";

/** Every admin table returns this envelope. */
export interface AdminPage<T> {
  total: number;
  page: number;
  pageCount: number;
  items: T[];
}

/** The named payer/owner shape the admin tables carry. Never a whole user row. */
export interface AdminUserRef {
  id: string;
  fullName: string;
  phone?: string | null;
}

/** GET /admin/dashboard */
export interface AdminDashboardDto {
  range: AdminRange;
  since: string;
  cards: {
    userTotal: number;
    userDelta: number;
    activeUsers: number;
    activeDelta: number;
    storiesCreated: number;
    storiesDelta: number;
    successRate: number;
    /** Percentage points, not a ratio — the design shows «▼ ۰٫۶٪». */
    successDelta: number;
    failedStories: number;
    revenue: number;
    revenueDelta: number;
    storiesReady: number;
  };
  daily: { date: string; count: number }[];
  queue: {
    running: number;
    queued: number;
    failed24h: number;
    maxConcurrent: number;
    illustrationRunning: number;
    illustrationCap: number;
    illustrationNearCap: boolean;
  };
  production: {
    storiesReady: number;
    pagesWritten: number;
    narrationSec: number;
    avgGenerationMs: number;
  };
  attention: {
    pendingModeration: number;
    failedPayments24h: number;
    longRunningJobs: number;
    failedStories: number;
  };
}

/** GET /admin/reports */
export interface AdminReportsDto {
  storyTotal: number;
  themes: { theme: StoryTheme; count: number; share: number }[];
  behaviour: {
    storiesPerFamily: number;
    peakHour: number | null;
    rereadRate: number;
    openedShare: number;
    averageChildAge: number;
    familyCount: number;
  };
}

/** GET /admin/usage — the pipeline measured stage by stage. */
export interface AdminUsageDto {
  range: AdminRange;
  since: string;
  stages: {
    stage: JobStage;
    count: number;
    avgSec: number;
    failed: number;
    errorRate: number;
    attempts: number;
    share: number;
  }[];
  totals: {
    jobs: number;
    stories: number;
    avgStoryMs: number;
    errorRate: number;
    slowestStage: JobStage | null;
    slowestAvgSec: number;
    retries: number;
  };
}

/** One account summary in the administrator user table. */
export interface AdminUserRow {
  id: string;
  fullName: string;
  phone: string | null;
  roles: ("SuperAdmin" | "Admin" | "User")[];
  role: "SuperAdmin" | "Admin" | "User";
  status: UserStatus;
  phoneVerified: boolean;
  createdAt: string;
  lastActiveAt: string | null;
  childCount: number;
  storyCount: number;
}

/** Audited administrator account-detail response. */
export interface AdminUserDetailDto {
  id: string;
  fullName: string;
  phone: string | null;
  roles: ("SuperAdmin" | "Admin" | "User")[];
  role: "SuperAdmin" | "Admin" | "User";
  status: UserStatus;
  phoneVerified: boolean;
  phoneVerifiedAt: string | null;
  /** True while an administrator's password reset is still unclaimed. */
  mustChangePassword: boolean;
  createdAt: string;
  lastActiveAt: string | null;
  activeSessions: number;
  paidCount: number;
  paidTotal: number;
  storyStatuses: Record<StoryStatus, number>;
  children: {
    id: string;
    firstName: string;
    age: number;
    photoStatus: PhotoStatus;
    hasPhoto: boolean;
    storyCount: number;
    createdAt: string;
  }[];
  recentStories: {
    id: string;
    title: string | null;
    childName: string | null;
    theme: StoryTheme;
    status: StoryStatus;
    createdAt: string;
  }[];
}

/** Privacy-limited child-profile row shown to administrators. */
export interface AdminChildRow {
  id: string;
  firstName: string;
  age: number;
  photoStatus: PhotoStatus;
  hasPhoto: boolean;
  storyCount: number;
  createdAt: string;
  user: AdminUserRef | null;
}

/** Cross-family story row shown to administrators. */
export interface AdminStoryRow {
  id: string;
  title: string | null;
  theme: StoryTheme;
  length: StoryLength;
  status: StoryStatus;
  durationSec: number | null;
  generationDurationMs: number | null;
  failureReason: string | null;
  createdAt: string;
  readyAt: string | null;
  childName: string | null;
  childAge: number | null;
  user: AdminUserRef | null;
}

/** One generation-stage execution row in the administrator pipeline table. */
export interface AdminJobRow {
  id: string;
  storyId: string;
  storyTitle: string | null;
  storyStatus: StoryStatus | null;
  stage: JobStage;
  status: JobStatus;
  attempts: number;
  error: string | null;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  durationMs: number | null;
  user: AdminUserRef | null;
}

/** GET /admin/jobs — the خط تولید strip and the table below it. */
export interface AdminJobsDto extends AdminPage<AdminJobRow> {
  pipeline: { stage: JobStage; running: number; queued: number }[];
}

/** GET /admin/stories/:id/jobs — every attempt at one story. */
export interface AdminStoryJobsDto {
  story: {
    id: string;
    title: string | null;
    theme: StoryTheme;
    length: StoryLength;
    status: StoryStatus;
    failureReason: string | null;
    generationDurationMs: number | null;
    createdAt: string;
    childName: string | null;
    user: AdminUserRef | null;
  };
  order: { id: string; status: OrderStatus; paidAt: string | null } | null;
  jobs: {
    id: string;
    stage: JobStage;
    status: JobStatus;
    attempts: number;
    error: string | null;
    startedAt: string | null;
    endedAt: string | null;
  }[];
}

/** Safe list summary for one moderation queue item. */
export interface AdminModerationItem {
  id: string;
  targetType: ModerationTarget;
  targetId: string;
  /** A code — the Persian wording lives in lib/admin.ts. */
  reason: string;
  status: ModerationStatus;
  note: string | null;
  createdAt: string;
  reviewedAt: string | null;
  reviewer: { id: string; fullName: string } | null;
  title: string;
  childName: string | null;
  childAge: number | null;
  user: AdminUserRef | null;
  /** The target was deleted while the row waited in the queue. */
  missing: boolean;
}

/** Moderation summary enriched with target-specific review context. */
export interface AdminModerationDetail extends AdminModerationItem {
  /** Story targets only. */
  ownIdea?: string | null;
  matchedWords?: string[];
  excerpt?: { index: number; text: string }[];
  storyStatus?: StoryStatus | null;
  theme?: StoryTheme | null;
  /** Child-photo targets only. */
  photoStatus?: PhotoStatus | null;
  hasPhoto?: boolean;
  interests?: string[];
}

/** Moderation list response and live pending count. */
export interface AdminModerationQueueDto {
  pending: number;
  items: AdminModerationItem[];
}

/** One append-only event shown in the administrator audit trail. */
export interface AdminAuditRow {
  id: string;
  event: string;
  targetType: string | null;
  targetId: string | null;
  ip: string | null;
  createdAt: string;
  /** Null means the system itself acted — «سامانه» in the table. */
  actor: {
    id: string;
    fullName: string;
    role: "SuperAdmin" | "Admin" | "User";
  } | null;
}

/** Paginated audit response with the effective retention period. */
export interface AdminAuditPageDto extends AdminPage<AdminAuditRow> {
  retentionDays: number;
}

/** GET /admin/settings — every key, as the stored string. */
export type AdminSettingsDto = Record<string, string>;
