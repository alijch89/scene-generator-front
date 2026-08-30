import type { StatusTone } from './orders';
import type {
  JobStage,
  JobStatus,
  ModerationStatus,
  PhotoStatus,
  StoryStatus,
  UserStatus,
} from './types';

/**
 * The admin panel's vocabulary. The API sends codes; every Persian word an
 * operator reads is decided here, next to the pages that render it — the same
 * split lib/orders.ts uses for payment statuses.
 *
 * Every status carries a glyph as well as a tone: the design's rule is that
 * state is never conveyed by colour alone.
 */

/** Persian display labels for account roles. */
export const ROLE_LABEL: Record<'SuperAdmin' | 'Admin' | 'User', string> = {
  SuperAdmin: 'مدیر ارشد',
  Admin: 'مدیر',
  User: 'کاربر',
};

/** Label, icon, and tone for each user access state. */
export const USER_STATUS: Record<
  UserStatus,
  { icon: string; label: string; tone: StatusTone }
> = {
  ACTIVE: { icon: '✓', label: 'فعال', tone: 'success' },
  SUSPENDED: { icon: '✕', label: 'غیرفعال', tone: 'neutral' },
};

/** Shown instead of «فعال» when the account has never confirmed its address. */
export const UNVERIFIED = {
  icon: '!',
  label: 'تأیید نشده',
  tone: 'warning' as StatusTone,
};

/** Administrator label, icon, and tone for each story lifecycle state. */
export const STORY_STATUS: Record<
  StoryStatus,
  { icon: string; label: string; tone: StatusTone }
> = {
  DRAFT: { icon: '•', label: 'پیش‌نویس', tone: 'neutral' },
  AWAITING_PAYMENT: { icon: '⏳', label: 'در انتظار پرداخت', tone: 'warning' },
  GENERATING: { icon: '◐', label: 'در حال ساخت', tone: 'warning' },
  READY: { icon: '✓', label: 'کامل', tone: 'success' },
  FAILED: { icon: '✕', label: 'ناموفق', tone: 'error' },
};

/** Administrator label, icon, and tone for each generation-job state. */
export const JOB_STATUS: Record<
  JobStatus,
  { icon: string; label: string; tone: StatusTone }
> = {
  QUEUED: { icon: '⏳', label: 'در صف', tone: 'warning' },
  RUNNING: { icon: '◐', label: 'در حال اجرا', tone: 'warning' },
  DONE: { icon: '✓', label: 'کامل', tone: 'success' },
  FAILED: { icon: '✕', label: 'ناموفق', tone: 'error' },
};

/**
 * The five pipeline stages under the names the design's خط تولید strip gives
 * them, which are the operator's words rather than the parent's.
 */
/** Administrator-facing names for the five generation stages. */
export const STAGE_ADMIN_LABEL: Record<JobStage, string> = {
  CHARACTER: 'ساخت شخصیت',
  WRITING: 'تولید متن',
  ILLUSTRATION: 'تصویرسازی',
  NARRATION: 'صداگذاری',
  BINDING: 'صحافی',
};

/** «عکس کودکان در این پنل نمایش داده نمی‌شود» — only ever its state. */
export const PHOTO_STATUS: Record<PhotoStatus, string> = {
  NONE: 'بدون عکس',
  PENDING: '🔒 در انتظار بازبینی',
  READY: '🔒 خصوصی',
  FLAGGED: '⚑ حذف‌شده در بازبینی',
  DELETED: 'پاک‌شده به‌خواست والد',
};

export const MODERATION_STATUS: Record<
  ModerationStatus,
  { icon: string; label: string; tone: StatusTone }
> = {
  PENDING: { icon: '⏳', label: 'در انتظار بازبینی', tone: 'warning' },
  APPROVED: { icon: '✓', label: 'تأیید شده', tone: 'success' },
  REJECTED: { icon: '✕', label: 'رد شده', tone: 'error' },
};

/**
 * Why a row is in the queue. `kind` drives the design's card badge — a flag the
 * system raised on its own reads differently from one a person asked for.
 */
export const MODERATION_REASON: Record<
  string,
  { label: string; detail: string; kind: string; tone: StatusTone }
> = {
  sensitive_words: {
    label: 'پرچم خودکار',
    detail: 'ایدهٔ ورودی کاربر شامل واژه‌های فهرست حساس بود.',
    kind: 'auto',
    tone: 'warning',
  },
  young_child: {
    label: 'اولویت بالا',
    detail: 'بازبینی انسانی برای کودک زیر ۵ سال درخواست شده است.',
    kind: 'policy',
    tone: 'error',
  },
  photo_check: {
    label: 'بررسی عکس',
    detail: 'عکس تازهٔ پروندهٔ کودک در انتظار تأیید ایمنی است.',
    kind: 'photo',
    tone: 'warning',
  },
};

/** Resolves a moderation reason code, preserving unknown codes as neutral text. */
export const moderationReason = (code: string) =>
  MODERATION_REASON[code] ?? {
    label: 'پرچم',
    detail: code,
    kind: 'auto',
    tone: 'neutral' as StatusTone,
  };

/**
 * Audit events in the words the design's گزارش رخدادها table uses. An event we
 * do not have a phrase for is shown as its own code rather than hidden — an
 * audit log that quietly drops rows it cannot label is worse than a terse one.
 */
export const AUDIT_EVENT_LABEL: Record<string, string> = {
  'payment.paid': 'پرداخت تأیید شد',
  'payment.failed': 'بانک پرداخت را رد کرد',
  'payment.cancelled': 'پرداخت لغو شد',
  'admin.user.viewed': 'مشاهدهٔ پروندهٔ کاربر',
  'admin.user.suspended': 'غیرفعال کردن حساب کاربر',
  'admin.user.reactivated': 'فعال کردن دوبارهٔ حساب کاربر',
  'admin.story.retried': 'اجرای دوبارهٔ ساخت قصه',
  'admin.setting.reset': 'بازگردانی تنظیمات به پیش‌فرض',
  'moderation.approved': 'تأیید محتوای گزارش‌شده',
  'moderation.rejected': 'رد و حذف محتوای گزارش‌شده',
  'auth.login': 'ورود به حساب',
  'auth.logout': 'خروج از حساب',
  'auth.password.reset': 'بازنشانی گذرواژه',
  'auth.account.deleted': 'حذف حساب به‌خواست کاربر',
};

/**
 * A settings change carries its own description after the colon, so the map
 * above cannot hold it. Split it out rather than showing the raw key.
 */
export const auditEventLabel = (event: string) => {
  if (event.startsWith('admin.setting.changed:')) {
    return `تغییر تنظیمات — ${event.slice('admin.setting.changed:'.length)}`;
  }
  return AUDIT_EVENT_LABEL[event] ?? event;
};

/** What «هدف» links to, when the target is something the panel can show. */
export const auditTargetHref = (targetType: string | null, id: string | null) => {
  if (!id) return null;
  if (targetType === 'user') return `/admin/users/${id}`;
  if (targetType === 'order') return `/admin/payments/${id}`;
  if (targetType === 'story') return `/admin/stories/${id}/jobs`;
  return null;
};

/**
 * تنظیمات سیستم, as three cards. Each field names the Setting key it writes,
 * so the form and the API agree by construction rather than by convention.
 */
export const SETTINGS_FORM: {
  title: string;
  note?: string;
  fields: {
    key: string;
    label: string;
    hint?: string;
    kind: 'number' | 'switch';
    min?: number;
    max?: number;
  }[];
}[] = [
  {
    title: 'ظرفیت تولید',
    note: 'این چهار مقدار را موتور ساخت در شروع هر مرحله می‌خواند، پس تغییرشان از همان کار بعدی اثر می‌گذارد.',
    fields: [
      {
        key: 'generation.maxConcurrentJobs',
        label: 'حداکثر کار هم‌زمان',
        kind: 'number',
        min: 1,
        max: 200,
      },
      {
        key: 'generation.illustrationQueueCap',
        label: 'سقف صف تصویرسازی',
        hint: 'مبنای هشدار ظرفیت در داشبورد.',
        kind: 'number',
        min: 1,
        max: 500,
      },
      {
        key: 'generation.retryOnError',
        label: 'تلاش مجدد در خطا',
        kind: 'number',
        min: 0,
        max: 10,
      },
      {
        key: 'generation.stageTimeoutSec',
        label: 'زمان انتظار هر مرحله (ثانیه)',
        kind: 'number',
        min: 10,
        max: 3600,
      },
    ],
  },
  {
    title: 'ایمنی محتوا',
    note: 'هر سه سوییچ فقط تعیین می‌کنند چه چیزی به صف بازبینی برود؛ هیچ‌کدام تحویل قصه را متوقف نمی‌کند.',
    fields: [
      {
        key: 'safety.autoFlagSensitiveWords',
        label: 'پرچم خودکار واژه‌های حساس',
        hint: 'ایدهٔ دلخواه والد پیش از ساخت با فهرست واژه‌ها سنجیده می‌شود.',
        kind: 'switch',
      },
      {
        key: 'safety.adultFaceCheck',
        label: 'بازبینی عکس کودک',
        hint: 'تشخیص خودکار چهره نداریم؛ با روشن بودن این گزینه هر عکس تازه به صف بازبینی می‌رود.',
        kind: 'switch',
      },
      {
        key: 'safety.humanReviewUnderFive',
        label: 'بازبینی انسانی برای سن زیر ۵ سال',
        hint: 'قصهٔ کودک زیر ۵ سال با اولویت بالا در صف بازبینی ثبت می‌شود.',
        kind: 'switch',
      },
    ],
  },
  {
    title: 'نگهداری داده',
    fields: [
      {
        key: 'retention.photoDeleteDeadlineHours',
        label: 'مهلت پاسخ به درخواست حذف عکس (ساعت)',
        hint: 'تعهد اعلام‌شده به والدین است، نه زمان‌سنج خودکار: حذف عکس در پنل والد بی‌درنگ انجام می‌شود.',
        kind: 'number',
        min: 1,
        max: 8760,
      },
      {
        key: 'retention.auditLogDays',
        label: 'نگهداری گزارش رخدادها (روز)',
        hint: 'رخدادهای قدیمی‌تر از این بازه پاک می‌شوند.',
        kind: 'number',
        min: 1,
        max: 3650,
      },
    ],
  },
];
/**
 * @file admin.ts
 * @description Centralizes administrator labels, status semantics, audit links, and settings-form metadata.
 */
