/**
 * The single static per-story price, in تومان. There are no plans and no
 * credit packs — you pay for the story you make.
 *
 * The backend's `story_price` Setting row is the real source of truth from the
 * wizard onward; the marketing site is static, so it reads this instead of
 * calling the API.
 */
export const STORY_PRICE = Number(
  process.env.NEXT_PUBLIC_STORY_PRICE ?? 49_000,
);
