/**
 * The twelve ready-made adventures the site advertises ("دوازده ماجرا").
 * The design names the first six; the rest keep the same voice. The wizard's
 * theme step in phase 5 reads this same list, so `id` is what the API stores.
 */
export const THEMES = [
  {
    id: 'fantasy',
    title: 'خیال و جادو',
    body: 'درِ مخفی و جنگل جادویی',
    art: 'bg-[linear-gradient(160deg,#6B4BA8,#F3B26A)]',
  },
  {
    id: 'space',
    title: 'فضا',
    body: 'موشک کاغذی تا زحل',
    art: 'bg-[linear-gradient(170deg,#171436,#6E4B8F)]',
  },
  {
    id: 'dinosaurs',
    title: 'دایناسورها',
    body: 'درهٔ مه‌گرفته',
    art: 'bg-[linear-gradient(160deg,#2F7F58,#E7C86A)]',
  },
  {
    id: 'ocean',
    title: 'اقیانوس',
    body: 'شهر مرجانی',
    art: 'bg-[linear-gradient(180deg,#7FD3E0,#123E63)]',
  },
  {
    id: 'animals',
    title: 'حیوانات',
    body: 'روباه کوچک دشت',
    art: 'bg-[linear-gradient(150deg,#F3C578,#A9452C)]',
  },
  {
    id: 'bedtime',
    title: 'قصهٔ شب',
    body: 'آرام و کوتاه',
    art: 'bg-[linear-gradient(180deg,#2A2352,#C88FA8)]',
  },
  {
    id: 'train',
    title: 'قطار و سفر',
    body: 'قطار شب از میان کوه‌ها',
    art: 'bg-[linear-gradient(165deg,#3C4B7A,#C9A26B)]',
  },
  {
    id: 'robots',
    title: 'ربات‌ها',
    body: 'دوست فلزی مهربان',
    art: 'bg-[linear-gradient(155deg,#2C6E8F,#9AD3D8)]',
  },
  {
    id: 'kitchen',
    title: 'آشپزخانهٔ جادویی',
    body: 'سوپی که حرف می‌زد',
    art: 'bg-[linear-gradient(150deg,#E0854A,#F6D9A0)]',
  },
  {
    id: 'detective',
    title: 'کارآگاهی',
    body: 'رد پا روی برف',
    art: 'bg-[linear-gradient(170deg,#2A2E45,#8FA3C4)]',
  },
  {
    id: 'circus',
    title: 'سیرک',
    body: 'چادر راه‌راه و خرگوش گمشده',
    art: 'bg-[linear-gradient(150deg,#B23A5B,#F2B84B)]',
  },
  {
    id: 'sports',
    title: 'ورزش',
    body: 'دروازه‌بان کوچک',
    art: 'bg-[linear-gradient(160deg,#1F7A5A,#BFE07A)]',
  },
] as const;
