import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class values and resolves Tailwind utility conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Placeholder credit balance shared by billing-related screens.
 *
 * This is presentation-only until a backend billing module is connected and
 * must not be used for authorization or purchase enforcement.
 */
export const STUB_CREDITS = 7;

/** Persian digit lookup indexed by an ASCII digit's numeric value. */
const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

/**
 * Replaces ASCII digits in a value with Persian glyphs.
 *
 * @param value Number or string to localize for display.
 * @returns String with every ASCII digit translated.
 */
export function faDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => persianDigits[Number(d)]);
}
