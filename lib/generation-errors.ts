import type { GenerationFailureCode } from './types';

/** Render authored text only, even when an old server returns a raw provider exception. */
const MESSAGES: Record<GenerationFailureCode, string> = {
  CONTENT_RESTRICTED:
    'ساخت تصویر این قصه در بررسی ایمنی متوقف شد. لطفاً موضوع و عکس انتخابی را بازبینی کنید یا با پشتیبانی تماس بگیرید.',
  PHOTO_MULTIPLE_FACES:
    'در عکس انتخابی بیش از یک چهره دیده شد. عکسی انتخاب کنید که فقط همان فرد در آن باشد.',
  PHOTO_FACE_NOT_FOUND:
    'چهره در عکس انتخابی تشخیص داده نشد. لطفاً عکسی واضح و رو به دوربین انتخاب کنید.',
  PHOTO_REQUIRED:
    'برای ساخت ویدیو، عکس کودک و شخصیت‌های انتخاب‌شده را در پروفایل کامل کنید.',
  PHOTO_INVALID:
    'عکس انتخابی برای ساخت ویدیو قابل استفاده نبود. لطفاً عکس واضح‌تری از یک نفر انتخاب کنید.',
  TIMEOUT:
    'ساخت ویدیو بیش از زمان مجاز طول کشید و متوقف شد. لطفاً کمی بعد دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.',
  SERVICE_UNAVAILABLE:
    'سرویس ساخت ویدیو موقتاً در دسترس نیست. لطفاً کمی بعد دوباره تلاش کنید.',
  GENERATION_FAILED:
    'ساخت ویدیو با مشکلی روبه‌رو شد. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.',
};

export const generationFailureMessage = (code: unknown): string =>
  typeof code === 'string' && Object.hasOwn(MESSAGES, code)
    ? MESSAGES[code as GenerationFailureCode]
    : MESSAGES.GENERATION_FAILED;
