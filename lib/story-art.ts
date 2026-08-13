import type {
  IllustrationStyle,
  NarratorVoice,
  StoryLength,
  StoryStatus,
  StoryTheme,
  StoryTone,
} from './types';

/** Labels lifted from Story Wizard.dc.html, so the library reads like it. */
export const THEME_LABEL: Record<StoryTheme, string> = {
  FANTASY: 'خیال و جادو',
  SPACE: 'فضا',
  DINO: 'دایناسورها',
  OCEAN: 'اقیانوس',
  ANIMALS: 'حیوانات',
  HERO: 'ابرقهرمان',
  MYSTERY: 'راز و رمز',
  BEDTIME: 'قصهٔ شب',
  OWN: 'ایدهٔ خودم',
};

export const LENGTH_LABEL: Record<StoryLength, string> = {
  SHORT: '۵ صفحه · حدود ۳ دقیقه',
  MEDIUM: '۱۰ صفحه · حدود ۶ دقیقه',
  LONG: '۱۶ صفحه · حدود ۱۰ دقیقه',
};

export const LENGTH_SHORT_LABEL: Record<StoryLength, string> = {
  SHORT: 'کوتاه',
  MEDIUM: 'متوسط',
  LONG: 'بلند',
};

export const TONE_LABEL: Record<StoryTone, string> = {
  CALM: 'گرم و آرام',
  FUNNY: 'شاد و بازیگوش',
  BRAVE: 'پرهیجان',
};

export const STYLE_LABEL: Record<IllustrationStyle, string> = {
  WATERCOLOR: 'آبرنگ',
  CLASSIC: 'کتاب کلاسیک',
  PAPERCUT: 'کاغذ بُرشی',
};

export const VOICE_LABEL: Record<NarratorVoice, string> = {
  MARYAM: 'مریم',
  BABAK: 'بابک',
  NAZANIN: 'نازنین',
};

/**
 * Story covers in the design are painted gradients, not images — one per
 * adventure. Copied verbatim so a card looks the same as its mock.
 */
export const THEME_COVER: Record<StoryTheme, string> = {
  FANTASY: 'linear-gradient(180deg,#221C46,#59418C 58%,#D9926B)',
  SPACE: 'linear-gradient(170deg,#171436,#3B2A6B 70%,#6E4B8F)',
  DINO: 'linear-gradient(160deg,#2F7F58,#8FB94A 65%,#E7C86A)',
  OCEAN: 'linear-gradient(180deg,#7FD3E0,#2B7FA8 55%,#123E63)',
  ANIMALS: 'linear-gradient(150deg,#F3C578,#DE7639 70%,#A9452C)',
  HERO: 'linear-gradient(150deg,#3E4FA8,#7A4FA8 60%,#BE3F5F)',
  MYSTERY: 'linear-gradient(180deg,#2A2352,#574585 65%,#C88FA8)',
  BEDTIME: 'linear-gradient(160deg,#2C2A45,#4A4468 60%,#8A7FA8)',
  OWN: 'linear-gradient(160deg,#6B4BA8,#C77FBF 60%,#F3B26A)',
};

/** A story that never finished gets the design's flat, colourless cover. */
export const FAILED_COVER = 'linear-gradient(160deg,#3C3550,#57506B)';

export const STATUS_LABEL: Record<StoryStatus, string> = {
  DRAFT: 'پیش‌نویس',
  AWAITING_PAYMENT: 'در انتظار پرداخت',
  GENERATING: 'در حال ساخت',
  READY: 'آماده',
  FAILED: 'ناموفق',
};

export const coverFor = (theme: StoryTheme, status: StoryStatus) =>
  status === 'FAILED' ? FAILED_COVER : THEME_COVER[theme];

/** The generating screen's five stages, in order, with the design's wording. */
export const STAGE_LABEL: Record<string, string> = {
  CHARACTER: 'شناخت شخصیت',
  WRITING: 'نوشتن ماجرا',
  ILLUSTRATION: 'کشیدن تصویرها',
  NARRATION: 'ضبط روایت',
  BINDING: 'صحافی کتاب',
};

/** The nine adventures the wizard offers, with the design's own sample lines. */
export const WIZARD_THEMES: {
  id: StoryTheme;
  title: string;
  body: string;
  example: string;
}[] = [
  {
    id: 'FANTASY',
    title: 'خیال و جادو',
    body: 'درِ مخفی، جنگل جادویی و ستاره‌های گمشده',
    example:
      'پشت درخت کهنسال حیاط دری مخفی پیدا می‌شود که به جنگلی می‌رسد که ستاره‌هایش گم شده‌اند.',
  },
  {
    id: 'SPACE',
    title: 'فضا',
    body: 'سفر با موشک کاغذی تا حلقه‌های زحل',
    example:
      'با موشکی کاغذی از پنجرهٔ اتاق بلند می‌شویم تا ببینیم حلقه‌های زحل از چه ساخته شده‌اند.',
  },
  {
    id: 'DINO',
    title: 'دایناسورها',
    body: 'درهٔ مه‌گرفته و دوستی با یک بچه‌دایناسور',
    example: 'در درهٔ مه‌گرفته بچه‌دایناسوری هست که راه خانه‌اش را گم کرده است.',
  },
  {
    id: 'OCEAN',
    title: 'اقیانوس',
    body: 'شهر مرجانی و نهنگی که راه را نشان می‌دهد',
    example:
      'سوار بر پشت نهنگی مهربان به شهر مرجانی می‌رویم که چراغ‌هایش خاموش شده‌اند.',
  },
  {
    id: 'ANIMALS',
    title: 'حیوانات',
    body: 'یک روز در دشت، همراه با روباه کوچک',
    example:
      'قرار می‌گذاریم تا غروب همهٔ گنجشک‌های گمشدهٔ دشت را پیدا کنیم.',
  },
  {
    id: 'HERO',
    title: 'ابرقهرمان',
    body: 'شنل، شهر خوابیده و یک نجات کوچک',
    example: 'شنل را می‌بندیم تا گربهٔ همسایه را از بالای بلندترین درخت کوچه پایین بیاوریم.',
  },
  {
    id: 'MYSTERY',
    title: 'راز و رمز',
    body: 'ردِ پاهای کوچک روی برف حیاط',
    example:
      'صبح برفی، ردِ پاهای کوچکی دور خانه حلقه زده‌اند و هیچ‌کس نمی‌داند از کجا آمده‌اند.',
  },
  {
    id: 'BEDTIME',
    title: 'قصهٔ شب',
    body: 'آرام، کوتاه و ساخته‌شده برای خواب',
    example: 'فانوسی روشن می‌کنیم تا خواب‌های سرگردان راهشان را به بالش‌ها پیدا کنند.',
  },
  {
    id: 'OWN',
    title: 'ایدهٔ خودم را می‌نویسم',
    body: 'قصه‌ای که فقط در خانهٔ شما معنا دارد',
    example: '',
  },
];

/** Deterministic gradient for a child's avatar when there is no photo. */
export const AVATAR_GRADIENT =
  'linear-gradient(140deg,var(--sh-primary),var(--sh-accent))';
