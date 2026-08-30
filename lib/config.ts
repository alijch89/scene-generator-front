/**
 * @file config.ts
 * @description Exposes public pricing configuration in display and API storage units.
 *
 * Each video length has its own one-time price. There are no plans or credit
 * packs — you pay once for the story you make.
 *
 * The backend owns the same fixed map and derives every order amount from the
 * selected length. The frontend values are display-only and are never sent as
 * part of a story request.
 */

import type { StoryLength } from '@/lib/types';

/** تومان — what the marketing pages print for each requested video length. */
export const STORY_PRICE_BY_LENGTH: Record<StoryLength, number> = {
  SHORT: 499_000,
  MEDIUM: 699_000,
  LONG: 999_000,
};

/** ریال — the unit the API stores and `faPrice` expects. */
export const STORY_PRICE_RIAL_BY_LENGTH: Record<StoryLength, number> = {
  SHORT: STORY_PRICE_BY_LENGTH.SHORT * 10,
  MEDIUM: STORY_PRICE_BY_LENGTH.MEDIUM * 10,
  LONG: STORY_PRICE_BY_LENGTH.LONG * 10,
};

/** Safe fallback for a malformed development payment URL. */
export const DEFAULT_STORY_PRICE_RIAL = STORY_PRICE_RIAL_BY_LENGTH.MEDIUM;
