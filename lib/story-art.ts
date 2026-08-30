import type {
  IllustrationStyle,
  NarratorVoice,
  StoryLength,
  StoryStatus,
  StoryTheme,
  StoryTone,
} from './types';

/** Parent-facing labels for the moral topic a story is built around. */
export const THEME_LABEL: Record<StoryTheme, string> = {
  HONESTY: 'راست‌گویی',
  KINDNESS: 'مهربانی و کار خوب',
  COURAGE: 'شجاعت',
  SHARING: 'سهیم شدن',
  TEAMWORK: 'همکاری',
  RESPONSIBILITY: 'مسئولیت‌پذیری',
  PATIENCE: 'صبر و پشتکار',
  RESPECT: 'احترام و ادب',
  OWN: 'ایدهٔ خودم',
};

/** Detailed story-length labels used by the wizard. */
export const LENGTH_LABEL: Record<StoryLength, string> = {
  SHORT: '۵ صفحه · حدود ۳ دقیقه',
  MEDIUM: '۱۰ صفحه · حدود ۶ دقیقه',
  LONG: '۱۶ صفحه · حدود ۱۰ دقیقه',
};

/** Compact story-length labels used by cards and tables. */
export const LENGTH_SHORT_LABEL: Record<StoryLength, string> = {
  SHORT: 'کوتاه',
  MEDIUM: 'متوسط',
  LONG: 'بلند',
};

/** Parent-facing labels for supported story tones. */
export const TONE_LABEL: Record<StoryTone, string> = {
  CALM: 'گرم و آرام',
  FUNNY: 'شاد و بازیگوش',
  BRAVE: 'پرهیجان',
};

/** Parent-facing labels for illustration styles. */
export const STYLE_LABEL: Record<IllustrationStyle, string> = {
  WATERCOLOR: 'آبرنگ',
  CLASSIC: 'کتاب کلاسیک',
  PAPERCUT: 'کاغذ بُرشی',
};

/** Parent-facing labels for narrator voices. */
export const VOICE_LABEL: Record<NarratorVoice, string> = {
  MARYAM: 'مریم',
  BABAK: 'بابک',
  NAZANIN: 'نازنین',
};

/**
 * Story covers in the design are painted gradients, not images — one per
 * topic. The design's nine gradients are kept verbatim, so a card still
 * looks like its mock.
 */
export const THEME_COVER: Record<StoryTheme, string> = {
  HONESTY: 'linear-gradient(180deg,#7FD3E0,#2B7FA8 55%,#123E63)',
  KINDNESS: 'linear-gradient(150deg,#F3C578,#DE7639 70%,#A9452C)',
  COURAGE: 'linear-gradient(150deg,#3E4FA8,#7A4FA8 60%,#BE3F5F)',
  SHARING: 'linear-gradient(160deg,#2F7F58,#8FB94A 65%,#E7C86A)',
  TEAMWORK: 'linear-gradient(180deg,#221C46,#59418C 58%,#D9926B)',
  RESPONSIBILITY: 'linear-gradient(170deg,#171436,#3B2A6B 70%,#6E4B8F)',
  PATIENCE: 'linear-gradient(160deg,#2C2A45,#4A4468 60%,#8A7FA8)',
  RESPECT: 'linear-gradient(180deg,#2A2352,#574585 65%,#C88FA8)',
  OWN: 'linear-gradient(160deg,#6B4BA8,#C77FBF 60%,#F3B26A)',
};

/** A story that never finished gets the design's flat, colourless cover. */
export const FAILED_COVER = 'linear-gradient(160deg,#3C3550,#57506B)';

/** Parent-facing labels for story lifecycle states. */
export const STATUS_LABEL: Record<StoryStatus, string> = {
  DRAFT: 'پیش‌نویس',
  AWAITING_PAYMENT: 'در انتظار پرداخت',
  GENERATING: 'در حال ساخت',
  READY: 'آماده',
  FAILED: 'ناموفق',
};

/** Selects the failed or theme-specific deterministic cover gradient. */
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

/** The nine topics the wizard offers, with card artwork and a sample opening line. */
export const WIZARD_THEMES: {
  id: StoryTheme;
  title: string;
  body: string;
  example: string;
  image: string | null;
}[] = [
  {
    id: 'HONESTY',
    title: 'راست‌گویی',
    body: 'وقتی یک دروغ کوچک بزرگ و بزرگ‌تر می‌شود',
    example:
      'گلدان مادربزرگ می‌شکند و یک «کار من نبود» کوچک، تا شب آن‌قدر قد می‌کشد که اندازهٔ اتاق می‌شود.',
    image: '/topics/راستگویی.jpeg',
  },
  {
    id: 'KINDNESS',
    title: 'مهربانی و کار خوب',
    body: 'یک کار خوب کوچک که دست‌به‌دست می‌چرخد',
    example:
      'صبح یک کار خوب کوچک در کوچه انجام می‌شود و تا غروب دست‌به‌دست می‌گردد و به در خانهٔ خودمان برمی‌گردد.',
    image: '/topics/مهربانی.jpeg',
  },
  {
    id: 'COURAGE',
    title: 'شجاعت',
    body: 'رو‌به‌رو شدن با چیزی که کمی می‌ترساند',
    example:
      'چراغ که خاموش می‌شود، سایهٔ گوشهٔ اتاق باید یک بار از نزدیک دیده شود تا معلوم شود کیست.',
    image: '/topics/شجاعت.jpeg',
  },
  {
    id: 'SHARING',
    title: 'سهیم شدن',
    body: 'یک اسباب‌بازی و دو دستِ منتظر',
    example:
      'در حیاط فقط یک ماشین قرمز هست و دو نفر هم‌زمان آن را می‌خواهند؛ باید راهی پیدا شود.',
    image: '/topics/سهیم.jpeg',
  },
  {
    id: 'TEAMWORK',
    title: 'همکاری',
    body: 'کاری که از پس یک نفر تنها برنمی‌آید',
    example:
      'بادبادک روی بلندترین شاخهٔ کوچه گیر کرده و هیچ‌کس به‌تنهایی دستش به آن نمی‌رسد.',
    image: '/topics/همکاری.jpeg',
  },
  {
    id: 'RESPONSIBILITY',
    title: 'مسئولیت‌پذیری',
    body: 'قولی که داده شده و باید نگه داشته شود',
    example:
      'قرار بوده هر روز به گلدان کوچک آب برسد؛ امروز صبح برگ‌هایش خم شده‌اند.',
    image: '/topics/مسئولیت.jpeg',
  },
  {
    id: 'PATIENCE',
    title: 'صبر و پشتکار',
    body: 'کاری که بار اول درست از آب درنمی‌آید',
    example:
      'دانه‌ای کاشته می‌شود و هر روز صبح هنوز فقط خاک است، خاکِ ساکت؛ تا یک صبح.',
    image: '/topics/پشتکار.jpeg',
  },
  {
    id: 'RESPECT',
    title: 'احترام و ادب',
    body: 'حرف‌هایی که حال کسی را خوب یا بد می‌کنند',
    example:
      'در صف نانوایی حرفی از دهان بیرون می‌پرد که برای برگرداندنش باید فکری کرد.',
    image: '/topics/احترام.jpeg',
  },
  {
    id: 'OWN',
    title: 'ایدهٔ خودم را می‌نویسم',
    body: 'درسی که فقط در خانهٔ شما معنا دارد',
    example: '',
    image: null,
  },
];

/**
 * The topics the public site advertises: every wizard topic that carries cover
 * art. "ایدهٔ خودم" has no artwork and belongs to the wizard, not the marketing
 * pages, so the flatMap both drops it and narrows `image` to a plain string.
 */
export const PUBLIC_TOPICS = WIZARD_THEMES.flatMap((topic) =>
  topic.image ? [{ ...topic, image: topic.image }] : [],
);

/** Deterministic gradient for a child's avatar when there is no photo. */
export const AVATAR_GRADIENT =
  'linear-gradient(140deg,var(--sh-primary),var(--sh-accent))';
/**
 * @file story-art.ts
 * @description Centralizes story labels, gradients, progress stages, and the wizard's moral topics.
 */
