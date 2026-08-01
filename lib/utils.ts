import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ponytail: credits/billing has no backend yet; one shared stub so every
// screen that shows a balance agrees, until a real billing module lands.
export const STUB_CREDITS = 7;

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
export function faDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => persianDigits[Number(d)]);
}
