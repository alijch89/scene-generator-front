/**
 * The single static per-story price. There are no plans and no credit packs —
 * you pay for the story you make.
 *
 * The backend's `story.price` Setting row is the real source of truth from the
 * wizard onward, and every order carries its own amount. These two constants
 * exist for the static marketing pages, which have no session to call the API
 * with, and for the wizard's preview card.
 */

/** تومان — what the marketing pages print. */
export const STORY_PRICE = Number(
  process.env.NEXT_PUBLIC_STORY_PRICE ?? 490_000,
);

/** ریال — the unit the API stores and `faPrice` expects. */
export const STORY_PRICE_RIAL = STORY_PRICE * 10;
