/**
 * @file interests.ts
 * @description Defines suggested child interests and the shared selection limit.
 */

/** Suggested chips shown by child forms; parents may also enter custom values. */
export const SUGGESTED_INTERESTS = [
  'فضا',
  'حیوانات',
  'دایناسورها',
  'نقاشی',
  'فوتبال',
  'اسب‌ها',
  'ستاره‌شناسی',
  'موسیقی',
  'قطار',
  'دریا',
];

/** Maximum interests accepted by both frontend forms and the backend DTO. */
export const MAX_INTERESTS = 12;
